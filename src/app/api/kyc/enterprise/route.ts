import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { uploadFile } from "@/utils/uploadFile";
import prisma from "@/lib/prisma";
import { KycRole } from "../../../../../prisma/generated/enums";


export async function POST(req: Request) {

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let user;

  try {
    user = verifyToken(accessToken, "access") as { id: string; email: string };
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message === "EXPIRED" ? "Token expired" : "Invalid token" },
      { status: 401 }
    );
  }


  const formData = await req.formData()

  const companyName = formData.get("companyName")
  const certificate = formData.get("certificateOfIncorporation") as File
  const memorandum = formData.get("memorandumOfAssociation") as File

  const directors = JSON.parse(formData.get("directors") as string)
  const operator = JSON.parse(formData.get("operator") as string)

  console.log("Received directors:", directors)
  console.log("Received operator:", operator)

  const directorsWithFiles = directors.map((d: any, i: number) => {
    const idFront = formData.get(`director_${i}_idFront`) as File
    const idBack = formData.get(`director_${i}_idBack`) as File
    const proofOfAddressDoc = formData.get(`director_${i}_proofOfAddressDoc`) as File

    return {
      ...d,
      idFront,
      idBack,
      proofOfAddressDoc
    }
  })

  console.log("bluhuuu: ", directorsWithFiles[0].idBack)

  const operatorWithFiles = {
    ...operator,
    idFront: formData.get("operator_idFront") as File,
    idBack: formData.get("operator_idBack") as File,
    proofOfAddressDoc: formData.get("operator_proofOfAddressDoc") as File,
  }

  console.log({
    companyName,
    certificate,
    memorandum,
    directorsWithFiles,
    operatorWithFiles
  })

  const certificatePath = await uploadFile(certificate, "enterprise");
  const memorandumPath = await uploadFile(memorandum, "enterprise");

  const directorsUploaded = await Promise.all(
    directorsWithFiles.map(async (d: any) => {
      const idFrontPath = await uploadFile(d.idFront, "enterprise");
      const idBackPath = await uploadFile(d.idBack, "enterprise");
      const proofOfAddressPath = await uploadFile(d.proofOfAddressDoc, "enterprise");


      return {
        role: KycRole.DIRECTOR,
        fullName: d.fullName,
        idType: d.idType,
        idNumber: d.idNumber,
        address: d.address,
        idFrontPath,
        idBackPath,
        proofOfAddressType: d.proofOfAddressType,
        proofOfAddressPath,
      };
    })
  );

  const operatorIdFrontPath = await uploadFile(operatorWithFiles.idFront, "enterprise");
  const operatorIdBackPath = await uploadFile(operatorWithFiles.idBack, "enterprise");
  const operatorProofPath = await uploadFile(operatorWithFiles.proofOfAddressDoc, "enterprise");



  const operatorUploaded = {
    role: KycRole.OPERATOR,
    fullName: operatorWithFiles.fullName,
    idType: operatorWithFiles.idType,
    idNumber: operatorWithFiles.idNumber,
    address: operatorWithFiles.address,
    idFrontPath: operatorIdFrontPath,
    idBackPath: operatorIdBackPath,
    proofOfAddressType: operatorWithFiles.proofOfAddressType,
    proofOfAddressPath: operatorProofPath,
  };

  const result = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        name: companyName as string,
      },
    });

    const orgKyc = await tx.organizationKyc.create({
      data: {
        organizationId: org.id,
        companyName: companyName as string,
      },
    });

    await tx.organizationMember.createMany({
      data: [
        ...directorsUploaded,
        operatorUploaded,
      ].map((m) => ({
        ...m,
        kycId: orgKyc.id,
      })),
    });

    await tx.membership.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: "OWNER", 
      },
    });

    await tx.organizationDocument.createMany({
      data: [
        {
          type: "CERTIFICATE_OF_INCORPORATION",
          filePath: certificatePath,
          kycId: orgKyc.id,
        },
        {
          type: "MEMORANDUM_OF_ASSOCIATION",
          filePath: memorandumPath,
          kycId: orgKyc.id,
        },
      ],
    });

    return orgKyc;
  });


  console.log("Enterprise KYC data saved to database for user ID:", user.id)
  console.log("Database transaction result:", result)


  return Response.json({
    success: true,
    message: "Enterprise KYC submitted"
  });

}