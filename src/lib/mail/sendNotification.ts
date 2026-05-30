
import prisma from "@/lib/prisma";

type NotificationParams = {
  userId: string;

  title: string;
  message: string;

  type:
    | "INFO"
    | "SUCCESS"
    | "WARNING"
    | "ERROR"
    | "INVESTMENT"
    | "DEPOSIT"
    | "WITHDRAWAL";

  link?: string;
};

export async function sendNotification({
  userId,
  title,
  message,
  type,
  link,
}: NotificationParams) {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
}