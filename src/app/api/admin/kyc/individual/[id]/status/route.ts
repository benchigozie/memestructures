import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { KycStatus } from "@/generated/prisma/enums";

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {

    const params = await context.params;
    console.log("Received request to update KYC status for ID: ", params.id)
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = verifyToken(token, "access") as { id: string };

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { accountType: true },
    });

    if (!dbUser || (dbUser.accountType !== "ADMIN" && dbUser.accountType !== "DEV")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body as { status: KycStatus };

    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const kyc = await prisma.individualKyc.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!kyc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // update BOTH KYC + user
    const updated = await prisma.$transaction(async (tx) => {
      const updatedKyc = await tx.individualKyc.update({
        where: { id: params.id },
        data: {},
      });

      const updatedUser = await tx.user.update({
        where: { id: kyc.userId },
        data: {
          kycStatus: status,
        },
      });

      return { updatedKyc, updatedUser };
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}