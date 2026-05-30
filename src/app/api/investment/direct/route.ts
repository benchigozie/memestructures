import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { sendNotification } from "@/lib/mail/sendNotification";
import { sendEmail } from "@/lib/mail/sendEmail";
import { notificationTemplate } from "@/lib/mail/templates/notificationTemplate";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const amount = Number(formData.get("amount"));
    const coin = formData.get("coin") as string;
    const network = formData.get("network") as string;
    const fundSlug = formData.get("fundName") as string;
    const proof = formData.get("proof") as File | null;

    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (user.kycStatus !== "VERIFIED") {
      return NextResponse.json(
        { error: "Complete KYC before investing" },
        { status: 403 }
      );
    }

    const fund = await prisma.fund.findUnique({
      where: { slug: fundSlug.toLowerCase() },
    });

    if (!fund) {
      return NextResponse.json({ error: "Invalid fund selected" }, { status: 400 });
    }

    const fee = amount * 0.01;
    const total = amount + fee;

    let investment;

    investment = await prisma.investment.create({
      data: {
        userId: user.id,
        fundId: fund.id,
        amount,
        fee,
        total,
        method: "DIRECT",
        status: "PENDING",
        coin,
        network,
        proofPath: proof ? "UPLOAD_PENDING" : null,
      },
    });

    sendNotification({
      userId: user.id,
      title: "Investment Submitted",
      message: `Your investment of $${amount.toLocaleString()} is under review.`,
      type: "INVESTMENT",
      link: "/dashboard/user/overview",
    }).catch(console.error);

    sendEmail({
      to: user.email,
      subject: "Investment Under Review",
      html: notificationTemplate({
        title: "Investment Submitted",
        message: `
          Your investment has been submitted and is awaiting review.
          You will be notified once it is approved.
        `,
        buttonText: "View Dashboard",
        buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/overview`,
      }),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Investment submitted for review",
      data: investment,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}