import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function POST(
    req: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            id: string;
        }>;
    }
) {

    const admin = await getUserFromRequest();
    const { id } = await params;

    console.log("ADMIN:", admin);

    try {

        if (!admin || admin.accountType !== "ADMIN") {

            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 403,
                }
            );

        }

        const body = await req.json();

        const {
            assetClassId,
            amount,
            fee,
            total,
            method,
        } = body;

        if (
            !assetClassId ||
            !amount ||
            !method
        ) {

            return NextResponse.json(
                {
                    message: "Missing required fields",
                },
                {
                    status: 400,
                }
            );

        }

        const user = await prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                wallet: true,
            },
        });

        if (!user) {

            return NextResponse.json(
                {
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );

        }

        const assetClass =
            await prisma.assetClass.findUnique({

                where: {
                    id: assetClassId,
                },

            });

        if (!assetClass) {

            return NextResponse.json(
                {
                    message: "Asset class not found",
                },
                {
                    status: 404,
                }
            );

        }

        if (
            method === "WALLET" &&
            !user.wallet
        ) {

            return NextResponse.json(
                {
                    message: "User has no wallet",
                },
                {
                    status: 400,
                }
            );

        }

        if (
            method === "WALLET" &&
            user.wallet!.balance < Number(total)
        ) {

            return NextResponse.json(
                {
                    message: "Insufficient wallet balance",
                },
                {
                    status: 400,
                }
            );

        }

        const investment =
            await prisma.$transaction(async (tx) => {

                //--------------------------------------------------
                // Create Investment
                //--------------------------------------------------

                const createdInvestment =
                    await tx.investment.create({

                        data: {

                            userId: user.id,

                            assetClassId,

                            amount: Number(amount),

                            fee: Number(fee),

                            total: Number(total),

                            method,

                            status: "CONFIRMED",

                            createdById: admin.id,

                        },

                        include: {

                            assetClass: true,

                        },

                    });

                //--------------------------------------------------
                // Update Position
                //--------------------------------------------------

                await tx.position.upsert({

                    where: {

                        userId_assetClassId: {

                            userId: user.id,

                            assetClassId,

                        },

                    },

                    update: {

                        amount: {

                            increment: Number(amount),

                        },

                    },

                    create: {

                        userId: user.id,

                        assetClassId,

                        amount: Number(amount),

                    },

                });

                //--------------------------------------------------
                // Debit wallet if necessary
                //--------------------------------------------------

                if (method === "WALLET") {

                    await tx.wallet.update({

                        where: {

                            id: user.wallet!.id,

                        },

                        data: {

                            balance: {

                                decrement: Number(total),

                            },

                        },

                    });

                }

                //--------------------------------------------------
                // Wallet Transaction
                //--------------------------------------------------

                if (user.wallet) {

                    await tx.walletTransaction.create({

                        data: {

                            walletId: user.wallet.id,

                            investmentId: createdInvestment.id,

                            amount: Number(total),

                            type:
                                method === "WALLET"
                                    ? "ADMIN_DEBIT"
                                    : "ADMIN_CREDIT",

                            intent: "ADMIN_ADJUSTMENT",

                            status: "COMPLETED",

                            createdById: admin.id,

                            reference:
                                `ADMIN-${createdInvestment.id}`,

                        },

                    });

                }

                return createdInvestment;

            });

        return NextResponse.json(
            {
                success: true,
                investment,
            },
            {
                status: 201,
            }
        );

    } catch (error) {

        console.error(
            "CREATE ADMIN INVESTMENT ERROR:",
            error
        );

        return NextResponse.json(
            {
                message: "Something went wrong",
            },
            {
                status: 500,
            }
        );

    }

}