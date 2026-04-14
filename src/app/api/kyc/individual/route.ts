import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/utils/uploadFile";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = verifyToken(token, "access") as { id: string };

    const formData = await req.formData();

    const idFront = formData.get("idFront") as File;
    const idBack = formData.get("idBack") as File;
    const selfie = formData.get("selfieWithId") as File;
    const residenceDoc = formData.get("residenceDoc") as File;

    console.log("this is form data: ", formData)

    if (!(idFront && idBack && selfie && residenceDoc)) {
      throw new Error("Missing required files");
    }

    const idFrontPath = await uploadFile(idFront, "individual");
    const idBackPath = await uploadFile(idBack, "individual");
    const selfiePath = await uploadFile(selfie, "individual");
    const residenceDocPath = await uploadFile(residenceDoc, "residence");

    const result = await prisma.individualKyc.create({
      data: {
        userId: user.id,
    
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
    
        dob: new Date(formData.get("dob") as string),
        gender: formData.get("gender") as string,
    
        idType: formData.get("idType") as string,
        idNumber: formData.get("idNumber") as string,
    
        country: formData.get("country") as string,
        state: formData.get("state") as string,
        city: formData.get("city") as string,
        address: formData.get("address") as string,
    
        idFrontPath,
        idBackPath,
        selfieWithIdPath: selfiePath,
    
        // 🔥 REQUIRED FIELD (this fixes your error)
        residenceType: formData.get("residenceType") as string,
        residenceDocPath,
      },
    });

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}