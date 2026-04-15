import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { createSignedUrl } from "@/utils/createSignedUrl";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // 🔥 signed URLs for documents
    const documents = await Promise.all(
      kyc.documents.map(async (doc) => ({
        ...doc,
        url: await createSignedUrl(doc.filePath),
      }))
    );

    return NextResponse.json({
      success: true,
      data: {
        ...kyc,
        documents,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}