import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function PATCH(
    request: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {

        const admin = await getUserFromRequest();

        if (!admin) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        if (
            admin.accountType !== "ADMIN" &&
            admin.accountType !== "DEV"
        ) {
            return NextResponse.json(
                {
                    error: "Forbidden",
                },
                {
                    status: 403,
                }
            );
        }

        const { id } = await params;

        const body = await request.json();

        const {
            amount,
            type,
        } = body;

        if (
            !amount ||
            amount <= 0
        ) {
            return NextResponse.json(
                {
                    error: "Invalid amount",
                },
                {
                    status: 400,
                }
            );
        }

        if (
            type !== "ADMIN_CREDIT" &&
            type !== "ADMIN_DEBIT"
        ) {
            return NextResponse.json(
                {
                    error: "Invalid transaction type",
                },
                {
                    status: 400,
                }
            );
        }

        const user = await prisma.user.findFirst({
            where: {
                id,
                createdById: admin.id,
                isManaged: true,
            },
            include: {
                wallet: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    error: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        await prisma.$transaction(async (tx) => {

            let wallet = user.wallet;

            if (!wallet) {

                wallet = await tx.wallet.create({
                    data: {
                        userId: user.id,
                        balance: 0,
                    },
                });

            }

            let newBalance = wallet.balance;

            if (type === "ADMIN_CREDIT") {

                newBalance += Number(amount);

            } else {

                if (wallet.balance < Number(amount)) {

                    throw new Error(
                        "Insufficient wallet balance."
                    );

                }

                newBalance -= Number(amount);

            }

            await tx.wallet.update({
                where: {
                    id: wallet.id,
                },
                data: {
                    balance: newBalance,
                },
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,

                    amount: Number(amount),

                    type,

                    intent: "ADMIN_ADJUSTMENT",

                    status: "COMPLETED",

                    createdById: admin.id,
                },
            });

            await tx.notification.create({
                data: {
                    userId: user.id,

                    title:
                        type === "ADMIN_CREDIT"
                            ? "Wallet Credited"
                            : "Wallet Debited",

                    message:
                        type === "ADMIN_CREDIT"
                            ? `Your wallet has been credited with ₦${Number(amount).toLocaleString()}.`
                            : `Your wallet has been debited by ₦${Number(amount).toLocaleString()}.`,

                    type:
                        type === "ADMIN_CREDIT"
                            ? "DEPOSIT"
                            : "WITHDRAWAL",
                },
            });

        });

        return NextResponse.json({
            message: "Wallet updated successfully.",
        });

    } catch (error: any) {

        return NextResponse.json(
            {
                error:
                    error.message ||
                    "Internal server error",
            },
            {
                status: 500,
            }
        );

    }
}