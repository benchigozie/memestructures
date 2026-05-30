import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { sendNotification } from "@/lib/mail/sendNotification";
import { sendEmail } from "@/lib/mail/sendEmail";
import { notificationTemplate } from "@/lib/mail/templates/notificationTemplate";

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

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let user: { id: string; email: string };

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

    if (!dbUser || (dbUser.accountType !== "ADMIN" && dbUser.accountType !== "DEV")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body as { status: KycStatus };

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

    const membership = await prisma.membership.findFirst({
      where: {
        organizationId: kyc.organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Organization user not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedKyc = await tx.organizationKyc.update({
        where: { id: params.id },
        data: { status },
      });

      await tx.user.update({
        where: { id: membership.userId },
        data: {
          kycStatus: status,
        },
      });

      return { updatedKyc };
    });

    const isVerified = status === "VERIFIED";

    sendNotification({
      userId: membership.userId,
      title: isVerified
        ? "Enterprise KYC Approved"
        : "Enterprise KYC Rejected",
      message: isVerified
        ? "Your enterprise verification has been approved."
        : "Your enterprise verification was rejected. Please review your submission and try again.",
      type: isVerified ? "SUCCESS" : "WARNING",
      link: "/dashboard/user/profile",
    }).catch(console.error);

    sendEmail({
      to: membership.user.email,
      subject: isVerified
        ? "Enterprise Verification Approved"
        : "Enterprise Verification Rejected",
      html: notificationTemplate({
        title: isVerified
          ? "Enterprise Verification Approved"
          : "Enterprise Verification Rejected",

        message: isVerified
          ? `
            Congratulations.

            Your enterprise account has been successfully verified.

            You now have access to all verified enterprise features.
          `
          : `
            Unfortunately, your enterprise verification was not approved.

            Please review your submitted information and documents, make any necessary corrections, and submit a new verification request.
          `,

        buttonText: isVerified
          ? "Open Dashboard"
          : "Review Submission",

        buttonLink: isVerified
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/overview`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/overview`,
      }),
    }).catch(console.error);

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