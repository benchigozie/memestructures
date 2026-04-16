import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { createSignedUrl } from "@/utils/createSignedUrl";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;


    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;

        if (!accessToken) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        let user;

        try {
            user = verifyToken(accessToken, "access") as { id: string; email: string };
        } catch (err: any) {
            return NextResponse.json(
                { error: err.message === "EXPIRED" ? "Token expired" : "Invalid token" },
                { status: 401 }
            );
        }

        const kyc = await prisma.individualKyc.findUnique({
            where: { id: params.id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        accountStatus: true,
                        accountType: true,
                        kycStatus: true,
                    },
                },
            },
        });

        if (!kyc) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const idFrontUrl = await createSignedUrl(kyc.idFrontPath!);
        const idBackUrl = await createSignedUrl(kyc.idBackPath!);
        const selfieUrl = await createSignedUrl(kyc.selfieWithIdPath!);
        const residenceUrl = kyc.residenceDocPath
            ? await createSignedUrl(kyc.residenceDocPath)
            : null;

        //console.log("Generated signed URLs: ", { idFrontUrl, idBackUrl, selfieUrl, residenceUrl })

        return NextResponse.json({
            success: true,
            data: {
                ...kyc,

                files: {
                    idFrontUrl,
                    idBackUrl,
                    selfieUrl,
                    residenceUrl,
                },
            },
        });
    } catch (err: any) {

        console.log("this is error: ", err.message);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}