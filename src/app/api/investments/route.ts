import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { uploadFile } from "@/utils/uploadFile";
import { wallets } from "@/data/wallets";
import { validateFile } from "@/utils/validateFile";

const funds = {
  DIF: { min: 35000, max: 1000000 },
  DIAF: { min: 100000, max: null },
  EDF: { min: 65000, max: 5000000 },
  EMSF: { min: 5000, max: 30000 },
};

export async function POST(req: Request) {
  console.log("Received investment submission request");

  try {
    const formData = await req.formData();

    const debugData: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        debugData[key] = {
          name: value.name,
          type: value.type,
          size: value.size,
        };
      } else {
        debugData[key] = value;
      }
    }

    console.log("Parsed FormData:", debugData);

    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token, "access") as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.kycStatus !== "VERIFIED") {
      return NextResponse.json(
        { success: false, error: "Complete KYC before investing" },
        { status: 403 }
      );
    }

    const amount = Number(formData.get("amount"));
    const coin = formData.get("coin") as string;
    const network = formData.get("network") as string;
    const fundName = formData.get("fundName") as keyof typeof funds;
    const proof = formData.get("proof") as File;

    if (!amount || !coin || !network || !fundName || !proof) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fund = funds[fundName];

    if (!fund) {
      return NextResponse.json(
        { success: false, error: "Invalid fund" },
        { status: 400 }
      );
    }

    if (amount < fund.min) {
      return NextResponse.json(
        { success: false, error: `Minimum is $${fund.min}` },
        { status: 400 }
      );
    }

    if (fund.max && amount > fund.max) {
      return NextResponse.json(
        { success: false, error: `Maximum is $${fund.max}` },
        { status: 400 }
      );
    }

    const selectedWallet = wallets.find((w) => w.coin === coin);
    const selectedNetwork = selectedWallet?.networks.find(
      (n) => n.name === network
    );

    if (!selectedNetwork) {
      return NextResponse.json(
        { success: false, error: "Invalid wallet selection" },
        { status: 400 }
      );
    }

    const walletAddress = selectedNetwork.address;

    try {
      validateFile(proof, { maxSizeMB: 5 });
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 400 }
      );
    }

    const proofPath = await uploadFile(proof, "investments");

    const fee = amount * 0.01;
    const total = amount + fee;

    const investment = await prisma.investment.create({
      data: {
        userId: user.id,
        fundName,
        amount,
        fee,
        total,
        coin,
        network,
        walletAddress,
        proofPath,
      },
    });

    return NextResponse.json({
      success: true,
      data: investment,
      message: "Investment submitted. Awaiting confirmation.",
    });

  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { success: false, error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}