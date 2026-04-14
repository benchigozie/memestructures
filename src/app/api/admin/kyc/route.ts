import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { KycStatus, OrgRole } from "@/generated/prisma/enums";

type UnifiedKycRow = {
  id: string;
  type: "INDIVIDUAL" | "ENTERPRISE";
  status: string;
  name: string;
  email: string | null;
  createdAt: Date;
};

export async function GET(req: Request) {
  try {
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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        accountType: true,
      },
    });

    if (!dbUser || (dbUser.accountType !== "ADMIN" && dbUser.accountType !== "DEV")) {
      return NextResponse.json(
        { error: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const status = searchParams.get("status");
    const type = searchParams.get("type");

    let result: any[] = [];

    if (type === "INDIVIDUAL") {
      const individualKycs = await prisma.individualKyc.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: { kycStatus: true },
          },
        },
        where: status
          ? {
            user: {
              kycStatus: status as KycStatus,
            },
          }
          : undefined,
      });

      result = individualKycs.map((kyc) => ({
        id: kyc.id,
        type: "INDIVIDUAL",
        status: kyc.user.kycStatus,
        name: `${kyc.firstName} ${kyc.lastName}`,
        email: kyc.email,
        createdAt: kyc.createdAt,
      }));
    }

    else if (type === "ENTERPRISE") {
      const enterpriseKycs = await prisma.organizationKyc.findMany({
        skip,
        take: limit,
        include: {
          organization: {
            include: {
              members: {
                where: {
                  role: OrgRole.OWNER,
                },
                include: {
                  user: {
                    select: { email: true },
                  },
                },
              },
            },
          },
        },
        where: status
          ? {
            status: status as KycStatus,
          }
          : undefined,
      });

      result = enterpriseKycs.map((kyc) => {
        const owner = kyc.organization.members[0];

        return {
          id: kyc.id,
          type: "ENTERPRISE",
          status: kyc.status,
          name: kyc.companyName,
          email: owner?.user?.email || null,
          createdAt: kyc.createdAt,
        };
      });
    }

    else {
      const query = await prisma.$queryRawUnsafe<UnifiedKycRow[]>(`
        SELECT * FROM (
          
          SELECT 
            i.id AS id,
            'INDIVIDUAL' AS type,
            u."kycStatus" AS status,
            CONCAT(i."firstName", ' ', i."lastName") AS name,
            i.email AS email,
            i."createdAt" AS "createdAt"
          FROM "IndividualKyc" i
          JOIN "User" u ON u.id = i."userId"
          ${status ? `WHERE u."kycStatus" = '${status}'` : ""}
      
          UNION ALL
      
          SELECT 
            o.id AS id,
            'ENTERPRISE' AS type,
            o.status AS status,
            o."companyName" AS name,
            m.email AS email,
            o."createdAt" AS "createdAt"
          FROM "OrganizationKyc" o
          LEFT JOIN "Organization" org ON org.id = o."organizationId"
          LEFT JOIN "Membership" mem ON mem."organizationId" = org.id AND mem.role = 'OWNER'
          LEFT JOIN "User" m ON m.id = mem."userId"
      
        ) AS combined
      
        ORDER BY combined."createdAt" ASC
        LIMIT ${limit}
        OFFSET ${skip};
      `);
      result = query;
    }

    console.log("Fetched KYC entries:", result);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("KYC FETCH ERROR:", error);

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}