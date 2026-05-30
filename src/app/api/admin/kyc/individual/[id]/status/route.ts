import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { sendNotification } from "@/lib/mail/sendNotification";
import { sendEmail } from "@/lib/mail/sendEmail";
import { notificationTemplate } from "@/lib/mail/templates/notificationTemplate";

const KycStatus = {
    UNVERIFIED: 'UNVERIFIED',
    UNCOMPLETED: 'UNCOMPLETED',
    VERIFIED: 'VERIFIED',
    PENDING: 'PENDING',
    REJECTED: 'REJECTED'
  } as const;
  
  type KycStatus = typeof KycStatus[keyof typeof KycStatus];

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

    if (!dbUser || (dbUser.accountType !== "ADMIN" && dbUser.accountType !== "DEV")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body as { status: KycStatus };

    console.log("Updating KYC status to: ", status)

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

    console.log(
      `KYC ${status} for user ${kyc.user.email}. Sending notification and email.`
    );
    
    const isVerified = status === "VERIFIED";
    
    sendNotification({
      userId: kyc.userId,
      title: isVerified
        ? "KYC Verification Approved"
        : "KYC Verification Rejected",
      message: isVerified
        ? "Your KYC verification has been approved. You now have access to verified account features."
        : "Your KYC verification was rejected. Please review your submission and try again.",
      type: isVerified ? "SUCCESS" : "WARNING",
      link: "/dashboard/user/profile",
    }).catch(console.error);
    
    sendEmail({
      to: kyc.user.email,
      subject: isVerified
        ? "Your KYC Has Been Approved"
        : "Your KYC Submission Was Rejected",
      html: notificationTemplate({
        title: isVerified
          ? "KYC Verification Approved"
          : "KYC Verification Rejected",
    
        message: isVerified
          ? `
            Congratulations. Your identity verification has been successfully approved.
    
            You now have access to all features available to verified users.
          `
          : `
            Unfortunately, your KYC submission was not approved.
    
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
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}