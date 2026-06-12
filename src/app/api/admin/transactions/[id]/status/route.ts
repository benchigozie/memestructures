import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { sendNotification } from "@/lib/mail/sendNotification";
import { sendEmail } from "@/lib/mail/sendEmail";
import { notificationTemplate } from "@/lib/mail/templates/notificationTemplate";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        { status: 401 }
      );
    }

    if (
      user.accountType !== "ADMIN" &&
      user.accountType !== "DEV"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden",
        },
        { status: 403 }
      );
    }

    const params = await context.params;

    const body = await req.json();

    const { status } = body as {
      status: "COMPLETED" | "REJECTED";
    };

    if (!["COMPLETED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status",
        },
        { status: 400 }
      );
    }

    const transaction =
      await prisma.walletTransaction.findUnique({
        where: {
          id: params.id,
        },
        include: {
          wallet: {
            include: {
              user: true,
            },
          },
        },
      });

    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction not found",
        },
        { status: 404 }
      );
    }

    if (transaction.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction already processed",
        },
        { status: 400 }
      );
    }

    const updatedTransaction =
      await prisma.$transaction(async (tx) => {
        const updated =
          await tx.walletTransaction.update({
            where: {
              id: transaction.id,
            },
            data: {
              status,
            },
          });

        if (
          status === "COMPLETED" &&
          transaction.type === "DEPOSIT"
        ) {
          await tx.wallet.update({
            where: {
              id: transaction.walletId,
            },
            data: {
              balance: {
                increment: transaction.amount,
              },
            },
          });
        }

        return updated;
      });

    const approved = status === "COMPLETED";

    sendNotification({
      userId: transaction.wallet.user.id,
      title: approved
        ? "Wallet Funding Approved"
        : "Wallet Funding Rejected",

      message: approved
        ? `Your wallet funding of $${transaction.amount.toLocaleString()} has been approved and credited to your wallet.`
        : `Your wallet funding request of $${transaction.amount.toLocaleString()} was rejected.`,

      type: approved ? "DEPOSIT" : "WARNING",

      link: "/dashboard/user/wallet",
    }).catch(console.error);

    sendEmail({
      to: transaction.wallet.user.email,

      subject: approved
        ? "Wallet Funding Approved"
        : "Wallet Funding Rejected",

      html: notificationTemplate({
        title: approved
          ? "Wallet Funding Approved"
          : "Wallet Funding Rejected",

        message: approved
          ? `
            Your wallet funding request has been approved.

            $${transaction.amount.toLocaleString()} has been credited to your wallet balance.
          `
          : `
            Your wallet funding request was not approved.

            Please review your submission and contact support if you believe this was a mistake.
          `,

        buttonText: "View Wallet",

        buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/wallet`,
      }),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}