import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/superbaseServer";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { sendNotification } from "@/lib/mail/sendNotification";
import { sendEmail } from "@/lib/mail/sendEmail";
import { notificationTemplate } from "@/lib/mail/templates/notificationTemplate";
import { uploadTransactionFile } from "@/utils/uploadFile";

export async function POST(req: Request) {
  let proofPath: string | null = null;

  try {
    const formData = await req.formData();

    const amount = Number(formData.get("amount"));
    const coin = formData.get("coin") as string;
    const network = formData.get("network") as string;
    const fundSlug = formData.get("fundName") as string;
    const proof = formData.get("proof") as File | null;

    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    if (user.kycStatus !== "VERIFIED") {
      return NextResponse.json(
        {
          success: false,
          error: "Complete KYC before investing",
        },
        {
          status: 403,
        }
      );
    }

    if (!amount || amount < 5000) {
      return NextResponse.json(
        {
          success: false,
          error: "Minimum investment amount is $5,000",
        },
        {
          status: 400,
        }
      );
    }

    if (!coin || !network) {
      return NextResponse.json(
        {
          success: false,
          error: "Coin and network are required",
        },
        {
          status: 400,
        }
      );
    }

    if (!proof) {
      return NextResponse.json(
        {
          success: false,
          error: "Proof of payment is required",
        },
        {
          status: 400,
        }
      );
    }

    const fund = await prisma.fund.findUnique({
      where: {
        slug: fundSlug.toLowerCase(),
      },
    });

    if (!fund) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid fund selected",
        },
        {
          status: 400,
        }
      );
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        {
          success: false,
          error: "Wallet not found",
        },
        {
          status: 404,
        }
      );
    }

    proofPath = await uploadTransactionFile(
      proof,
      `investments/${user.id}`
    );

    const fee = amount * 0.01;
    const total = amount + fee;

    const result = await prisma.$transaction(async (tx) => {
      const investment = await tx.investment.create({
        data: {
          userId: user.id,
          fundId: fund.id,
          amount,
          fee,
          total,
          method: "DIRECT",
          status: "PENDING",
        },
      });

      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,

          investmentId: investment.id,

          type: "DEPOSIT",
          intent: "DIRECT_INVESTMENT",

          amount,

          coin,
          network,

          proofPath,

          status: "PENDING",

          reference: `INV-${Date.now()}`,
        },
      });

      return {
        investment,
        transaction,
      };
    });

    sendNotification({
      userId: user.id,
      title: "Investment Submitted",
      message: `Your investment of $${amount.toLocaleString()} is under review.`,
      type: "INVESTMENT",
      link: "/dashboard/user/overview",
    }).catch(console.error);

    sendEmail({
      to: user.email,
      subject: "Investment Under Review",
      html: notificationTemplate({
        title: "Investment Submitted",
        message: `
          Your investment has been submitted and is awaiting review.
          You will be notified once it is approved.
        `,
        buttonText: "View Dashboard",
        buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/overview`,
      }),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Investment submitted for review",
      data: result,
    });
  } catch (err: any) {
    console.error(err);

    if (proofPath) {
      await supabase.storage
        .from("transactions")
        .remove([proofPath])
        .catch(console.error);
    }

    return NextResponse.json(
      {
        success: false,
        error: err.message || "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}