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
          error: "Complete KYC before funding your wallet",
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
          error: "Minimum funding amount is $5,000",
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

    const reference = `WF-${Date.now()}`;

    proofPath = await uploadTransactionFile(
      proof,
      `wallet-funding/${user.id}/${reference}`
    );

    const transaction = await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,

        type: "DEPOSIT",
        intent: "WALLET_FUNDING",

        amount,

        coin,
        network,

        proofPath,

        status: "PENDING",

        reference,
      },
    });

    sendNotification({
      userId: user.id,
      title: "Wallet Funding Submitted",
      message: `Your wallet funding request of $${amount.toLocaleString()} has been submitted for review.`,
      type: "DEPOSIT",
      link: "/dashboard/user/wallet",
    }).catch(console.error);

    sendEmail({
      to: user.email,
      subject: "Wallet Funding Under Review",
      html: notificationTemplate({
        title: "Wallet Funding Submitted",
        message: `
          Your wallet funding request has been submitted
          and is currently awaiting review.

          Once approved, your wallet balance will be updated.
        `,
        buttonText: "View Wallet",
        buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/wallet`,
      }),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Wallet funding submitted for review",
      data: transaction,
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