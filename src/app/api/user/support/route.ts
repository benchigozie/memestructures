import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabase } from "@/lib/superbaseServer";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

import { sendNotification } from "@/lib/mail/sendNotification";
import { sendEmail } from "@/lib/mail/sendEmail";
import { notificationTemplate } from "@/lib/mail/templates/notificationTemplate";

import { uploadSupportFile } from "@/utils/uploadFile";

const allowedCategories = [
  "INVESTMENT",
  "WITHDRAWAL",
  "KYC",
  "ACCOUNT",
  "TECHNICAL",
  "OTHER",
] as const;

type SupportCategory = typeof allowedCategories[number];

export async function POST(req: Request) {
  let attachmentPath: string | null = null;


  try {
    const formData = await req.formData();

    const subject = formData.get("subject") as string;
    const rawCategory = formData.get("category") as string;
    const category = rawCategory?.toUpperCase() as SupportCategory;
    const message = formData.get("message") as string;

    if (!allowedCategories.includes(category as SupportCategory)) {
      return NextResponse.json(
        { success: false, error: "Invalid category" },
        { status: 400 }
      );
    }

    const attachment =
      formData.get("attachment") as File | null;

    const user = await getUserFromRequest();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Not authenticated",
        },
        {
          status: 401,
        }
      );
    }

    if (!subject?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Subject is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!category?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Category is required",
        },
        {
          status: 400,
        }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    if (attachment) {
      attachmentPath = await uploadSupportFile(
        attachment,
        `support/${user.id}`
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: user.id,

        subject,
        category: category as SupportCategory,
        message,

        attachmentPath,

        status: "OPEN",
      },
    });

    sendNotification({
      userId: user.id,
      title: "Support Ticket Created",
      message: `Your support request has been received.`,
      type: "INFO",
      link: "/dashboard/user/support",
    }).catch(console.error);

    sendEmail({
      to: user.email,
      subject: "Support Ticket Received",
      html: notificationTemplate({
        title: "Support Request Received",
        message: `
          We have received your support request and
          our team will review it shortly.
        `,
        buttonText: "View Dashboard",
        buttonLink: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/support`,
      }),
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "Support ticket submitted successfully.",
      data: ticket,
    });
  } catch (err: any) {
    console.error(err);

    if (attachmentPath) {
      await supabase.storage
        .from("transactions")
        .remove([attachmentPath])
        .catch(console.error);
    }

    return NextResponse.json(
      {
        success: false,
        error:
          err.message ||
          "An unexpected error occurred",
      },
      {
        status: 500,
      }
    );
  }
}