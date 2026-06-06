import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { seedFunds } from "./fundSeed";

async function main() {

  await seedFunds();
  
  console.log("Clearing database...");

  await prisma.walletTransaction.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.position.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleared.");

  const PEPPER = process.env.BCRYPT_PEPPER || "";
  const SALT_ROUNDS = 10;

  const hashedPassword = await bcrypt.hash("Mrbarbie1" + PEPPER, SALT_ROUNDS);
  const hashedPassword2 = await bcrypt.hash("Admin123" + PEPPER, SALT_ROUNDS);
  const hashedPassword3 = await bcrypt.hash("enterprise123" + PEPPER, SALT_ROUNDS);
  const hashedPassword4 = await bcrypt.hash("individual123" + PEPPER, SALT_ROUNDS);
  const hashedPassword5 = await bcrypt.hash("Mrbarbie1" + PEPPER, SALT_ROUNDS);
  const hashedPassword6 = await bcrypt.hash("Mrbarbie1" + PEPPER, SALT_ROUNDS);


  const devUser = await prisma.user.create({
    data: {
      name: "Ben Developer",
      email: "bennchigozie@gmail.com",
      password: hashedPassword,
      accountType: "DEV",
      emailVerified: true,
    },
  });

  console.log("Dev User inserted.");

  const adminUser = await prisma.user.create({
    data: {
      name: "memestructures admin",
      email: "admin@gmail.com",
      password: hashedPassword2,
      accountType: "ADMIN",
      emailVerified: true,
    },
  });

  console.log("Admin User inserted.");

  const enterpriseUser = await prisma.user.create({
    data: {
      name: "memestructures enterprise",
      email: "enterprise@gmail.com",
      password: hashedPassword3,
      accountType: "ENTERPRISE",
      emailVerified: true,
      kycStatus: "VERIFIED",
    },
  });

  console.log("Enterprise User inserted.");

  const individualUser = await prisma.user.create({
    data: {
      name: "memestructures individual",
      email: "individual@gmail.com",
      password: hashedPassword4,
      accountType: "INDIVIDUAL",
      emailVerified: true,
      kycStatus: "VERIFIED",
    },
  });

  console.log("Individual User inserted.");



  const User1 = await prisma.user.create({
    data: {
      name: "asoya benedict",
      email: "asoyabenedict@gmail.com",
      password: hashedPassword5,
      accountType: "INDIVIDUAL",
      emailVerified: true,
      kycStatus: "VERIFIED",
    },
  });

  const User2 = await prisma.user.create({
    data: {
      name: "ben mark",
      email: "benmarrk@gmail.com",
      password: hashedPassword6,
      accountType: "INDIVIDUAL",
      emailVerified: true,
      kycStatus: "VERIFIED",
    },
  });


  const devWallet = await prisma.wallet.create({
    data: { userId: devUser.id },
  });

  const adminWallet = await prisma.wallet.create({
    data: { userId: adminUser.id },
  });

  const enterpriseWallet = await prisma.wallet.create({
    data: { userId: enterpriseUser.id },
  });

  const individualWallet = await prisma.wallet.create({
    data: { userId: individualUser.id },
  });

  const user1Wallet = await prisma.wallet.create({
    data: { userId: User1.id },
  });

  const user2Wallet = await prisma.wallet.create({
    data: { userId: User2.id },
  });


  console.log("Wallets created.");


  await prisma.$transaction(async (tx) => {

    await tx.wallet.update({
      where: { id: individualWallet.id },
      data: {
        balance: {
          increment: 400000000,
        },
      },
    });

    await tx.walletTransaction.create({
      data: {
        wallet: {
          connect: { id: individualWallet.id },
        },
        type: "DEPOSIT",
        intent: "WALLET_FUNDING",
        amount: 400000000,
        status: "COMPLETED",
        reference: "SEED_FUNDING",
      },
    });
  });

  console.log("Individual wallet funded with $400,000.");

  console.log("Seeding complete.");


  const user = await prisma.user.findUnique({
    where: {
      email: "asoyabenedict@gmail.com",
    },
  });
  
  if (!user) throw new Error("User not found");
  
  await prisma.wallet.update({
    where: {
      userId: user.id,
    },
    data: {
      balance: {
        increment: 400_000_000,
      },
    },
  });



  const user2 = await prisma.user.findUnique({
    where: {
      email: "benmarrk@gmail.com",
    },
  });
  
  if (!user2) throw new Error("User not found");
  
  await prisma.wallet.update({
    where: {
      userId: user2.id,
    },
    data: {
      balance: {
        increment: 400_000_000,
      },
    },
  });
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });