import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { sendEmail } from "@/lib/mail/sendEmail";
import { tempPasswordTemplate } from "@/lib/mail/templates/passwordTemplate";


export async function POST(req: Request) {

    try {

        const creator = await getUserFromRequest();


        if (!creator) {

            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );

        }



        if (
            creator.accountType !== "ADMIN" &&
            creator.accountType !== "DEV" &&
            creator.accountType !== "ENTERPRISE"
        ) {

            return NextResponse.json(
                {
                    error: "You cannot create users"
                },
                {
                    status: 403
                }
            );

        }



        const body = await req.json();



        const {
            name,
            email: rawEmail,
            accountType = "INDIVIDUAL",
            kycStatus = "UNVERIFIED"
        } = body;



        const email = rawEmail?.trim().toLowerCase();



        if (!name || !email) {

            return NextResponse.json(
                {
                    error: "Name and email are required"
                },
                {
                    status: 400
                }
            );

        }



        const allowedAccountTypes = [
            "INDIVIDUAL",
            "ENTERPRISE"
        ];


        const allowedKycStatuses = [
            "UNVERIFIED",
            "PENDING",
            "VERIFIED"
        ];



        if (!allowedAccountTypes.includes(accountType)) {

            return NextResponse.json(
                {
                    error: "Invalid account type"
                },
                {
                    status: 400
                }
            );

        }



        if (!allowedKycStatuses.includes(kycStatus)) {

            return NextResponse.json(
                {
                    error: "Invalid KYC status"
                },
                {
                    status: 400
                }
            );

        }




        const existing = await prisma.user.findUnique({
            where: {
                email
            }
        });



        if (existing) {

            return NextResponse.json(
                {
                    error: "Email already exists"
                },
                {
                    status: 409
                }
            );

        }




        const temporaryPassword =
            crypto.randomBytes(8).toString("hex");



        const PEPPER = process.env.BCRYPT_PEPPER;


        if (!PEPPER) {
            throw new Error("Missing password pepper");
        }



        const hashedPassword =
            await bcrypt.hash(
                temporaryPassword + PEPPER,
                10
            );





        const user = await prisma.user.create({

            data: {

                name,

                email,

                password: hashedPassword,

                accountType,

                kycStatus,

                createdById: creator.id,

                wallet: {
                    create: {},
                },

            }

        });




        const loginLink =
            `${process.env.NEXT_PUBLIC_BASE_URL}/login`;



        await sendEmail({

            to: email,

            subject: "Your investor account has been created",

            html: tempPasswordTemplate({
                name,
                loginLink,
                temporaryPassword
            }),

        });




        return NextResponse.json(

            {
                message: "Investor account created",

                user: {
                    id: user.id,
                    email: user.email,
                    accountType: user.accountType,
                    kycStatus: user.kycStatus,
                },

            },

            {
                status: 201
            }

        );



    }
    catch(error) {

        console.error(error);


        return NextResponse.json(
            {
                error:"Failed creating user"
            },
            {
                status:500
            }
        );

    }

}