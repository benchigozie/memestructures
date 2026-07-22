import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { sendNotification } from "@/lib/mail/sendNotification";
import { sendEmail } from "@/lib/mail/sendEmail";
import { notificationTemplate } from "@/lib/mail/templates/notificationTemplate";

export async function POST(req: Request) {
  try {
    const body = await req.json();

console.log("Investment wallet body:", body);

const { amount, assetClass } = body;

    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (user.kycStatus !== "VERIFIED") {
      return NextResponse.json(
        {
          error: "Complete KYC before investing",
        },
        {
          status: 403,
        }
      );
    }

    if (!assetClass) {
      return NextResponse.json(
        {
          error: "Investment selection is required",
        },
        {
          status: 400,
        }
      );
    }


    const selectedAssetClass = await prisma.assetClass.findUnique({
      where: {
        slug: assetClass,
      },
    });


    if (!selectedAssetClass) {
      return NextResponse.json(
        {
          error: "Invalid investment selected",
        },
        {
          status: 400,
        }
      );
    }


    if (
      !amount ||
      amount < selectedAssetClass.minimumInvestment
    ) {
      return NextResponse.json(
        {
          error: `Minimum investment is $${selectedAssetClass.minimumInvestment.toLocaleString()}`,
        },
        {
          status: 400,
        }
      );
    }


    if (
      selectedAssetClass.maximumInvestment &&
      amount > selectedAssetClass.maximumInvestment
    ) {
      return NextResponse.json(
        {
          error: `Maximum investment is $${selectedAssetClass.maximumInvestment.toLocaleString()}`,
        },
        {
          status: 400,
        }
      );
    }


    const fee = amount * 0.01;
    const total = amount + fee;


    const wallet = await prisma.wallet.findUnique({
      where: {
        userId: user.id,
      },
    });


    if (!wallet) {
      return NextResponse.json(
        {
          error: "Wallet not found",
        },
        {
          status: 404,
        }
      );
    }


    if (wallet.balance < total) {
      return NextResponse.json(
        {
          error: "Insufficient wallet balance",
        },
        {
          status: 400,
        }
      );
    }


    let investment;


    await prisma.$transaction(async (tx) => {

      await tx.wallet.update({
        where: {
          userId: user.id,
        },
        data: {
          balance: {
            decrement: total,
          },
        },
      });


      investment = await tx.investment.create({
        data: {
          userId: user.id,

          assetClassId: selectedAssetClass.id,

          amount,

          fee,

          total,

          method: "WALLET",

          status: "CONFIRMED",
        },
      });


      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,

          investmentId: investment.id,

          type: "WITHDRAWAL",

          intent: "WALLET_INVESTMENT",

          amount: total,

          status: "COMPLETED",

          reference: `INV-${Date.now()}`,
        },
      });


      await tx.position.upsert({
        where: {
          userId_assetClassId: {
            userId: user.id,
            assetClassId: selectedAssetClass.id,
          },
        },

        update: {
          amount: {
            increment: amount,
          },
        },

        create: {
          userId: user.id,
          assetClassId: selectedAssetClass.id,
          amount,
        },
      });

    });


    sendNotification({
      userId: user.id,

      title: "Investment Successful",

      message: `Your investment of $${amount.toLocaleString()} was successful.`,

      type: "SUCCESS",

      link: "/dashboard/user/overview",

    }).catch(console.error);



    sendEmail({
      to: user.email,

      subject: "Investment Confirmed",

      html: notificationTemplate({

        title: "Investment Successful",

        message: `You are now invested in ${selectedAssetClass.name}.`,

        buttonText: "View Dashboard",

        buttonLink:
          `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/overview`,

      }),

    }).catch(console.error);



    return NextResponse.json({
      success: true,

      message: "Investment completed successfully",

      data: investment,
    });


  } catch (err: any) {

    console.error(err);

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