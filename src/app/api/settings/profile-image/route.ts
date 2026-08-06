import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { uploadProfileImage } from "@/utils/uploadFile";
import { validateFile } from "@/utils/validateFile";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export async function PATCH(req: Request) {

  try {
    const formData = await req.formData();

    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided." },
        { status: 400 }
      );
    }

    validateFile(image);

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


    const imagePath = await uploadProfileImage(image, `profile-image/${user.accountType.toLocaleLowerCase()}/${user.id}`);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        profileImagePath: imagePath,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile image updated successfully.",
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error:
          "Could not update profile image.",
      },
      { status: 500 }
    );
  }
}