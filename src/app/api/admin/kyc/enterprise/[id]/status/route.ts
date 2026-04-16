import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

const KycStatus = {
  UNVERIFIED: "UNVERIFIED",
  UNCOMPLETED: "UNCOMPLETED",
  VERIFIED: "VERIFIED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
} as const;

type KycStatus = typeof KycStatus[keyof typeof KycStatus];

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  console.log("Updating ENTERPRISE KYC:", params.id);

  try {
 
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }


    let user;

    try {
        user = verifyToken(token, "access") as { id: string; email: string };
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message === "EXPIRED" ? "Token expired" : "Invalid token" },
            { status: 401 }
        );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { accountType: true },
    });

    if (
      !dbUser ||
      (dbUser.accountType !== "ADMIN" && dbUser.accountType !== "DEV")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body as { status: KycStatus };

    console.log("Updating KYC status to: ", status);

    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const kyc = await prisma.organizationKyc.findUnique({
      where: { id: params.id },
      include: {
        organization: true,
      },
    });

    if (!kyc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.$transaction(async (tx) => {
        const updatedKyc = await tx.organizationKyc.update({
          where: { id: params.id },
          data: { status },
        });
      
        const membership = await tx.membership.findFirst({
          where: {
            organizationId: kyc.organizationId,
          },
          select: {
            userId: true,
          },
        });
      
        if (membership) {
          await tx.user.update({
            where: {
              id: membership.userId,
            },
            data: {
              kycStatus: status,
            },
          });
        }
      
        return { updatedKyc };
      });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err: any) {
    console.error("Enterprise KYC update error:", err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}