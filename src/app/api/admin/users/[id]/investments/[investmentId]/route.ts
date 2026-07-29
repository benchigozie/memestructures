import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function DELETE(
    req: NextRequest,
    {
        params,
    }: {
        params: Promise<{
            id: string;
            investmentId: string;
        }>;
    }
) {

    const admin = await getUserFromRequest();

    const {
        id,
        investmentId
    } = await params;

    try {

        if (
            !admin ||
            admin.accountType !== "ADMIN"
        ) {

            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 403,
                }
            );

        }



        const investment =
            await prisma.investment.findUnique({

                where: {
                    id: investmentId,
                },

                include: {
                    walletTransaction: true
                }

            });



        if (!investment) {

            return NextResponse.json(
                {
                    message: "Investment not found",
                },
                {
                    status: 404,
                }
            );

        }



        if (investment.userId !== id) {

            return NextResponse.json(
                {
                    message: "Investment does not belong to this user",
                },
                {
                    status: 400,
                }
            );

        }



        await prisma.$transaction(async (tx) => {

            const position =
                await tx.position.findUnique({

                    where: {

                        userId_assetClassId: {

                            userId: investment.userId,

                            assetClassId: investment.assetClassId

                        }

                    }

                });




            if (position) {

                const remainingAmount =
                    position.amount - investment.amount;



                if (remainingAmount <= 0) {

                    await tx.position.delete({

                        where: {

                            userId_assetClassId: {

                                userId: investment.userId,

                                assetClassId: investment.assetClassId

                            }

                        }

                    });

                } else {

                    await tx.position.update({

                        where: {

                            userId_assetClassId: {

                                userId: investment.userId,

                                assetClassId: investment.assetClassId

                            }

                        },

                        data: {

                            amount: {

                                decrement: investment.amount

                            }

                        }

                    });

                }

            }



            if (investment.walletTransaction?.id) {


                await tx.walletTransaction.update({
                    where:{
                        id: investment.walletTransaction.id
                    },
                    data:{
                        status:"CANCELLED"
                    }
                });

            }



            await tx.investment.delete({

                where: {

                    id: investment.id

                }

            });

        });



        return NextResponse.json({

            success: true,

            message: "Investment deleted successfully"

        });

    } catch (error) {

        console.error(
            "DELETE INVESTMENT ERROR:",
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