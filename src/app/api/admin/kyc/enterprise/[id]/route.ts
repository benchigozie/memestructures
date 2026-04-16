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
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    verifyToken(token, "access");

    const kyc = await prisma.organizationKyc.findUnique({
      where: { id: params.id },
      include: {
        members: true,
        documents: true,
        organization: true,
      },
    });

    if (!kyc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const documents = await Promise.all(
      kyc.documents.map(async (doc) => ({
        ...doc,
        url: await createSignedUrl(doc.filePath),
      }))
    );

    const members = await Promise.all(
      kyc.members.map(async (member) => ({
        ...member,
        idFrontUrl: member.idFrontPath
          ? await createSignedUrl(member.idFrontPath)
          : null,
        idBackUrl: member.idBackPath
          ? await createSignedUrl(member.idBackPath)
          : null,
        proofOfAddressUrl: member.proofOfAddressPath
          ? await createSignedUrl(member.proofOfAddressPath)
          : null,
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        ...kyc,
        documents,
        members, 
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