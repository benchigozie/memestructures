import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { raw } from "@prisma/client/runtime/client";

async function main() {

  console.log("Clearing database...");

  await prisma.membership.deleteMany();
  console.log("Memberships cleared.");
  await prisma.organization.deleteMany();
  console.log("Organizations cleared.");
  await prisma.user.deleteMany();
  console.log("Users cleared.");

  console.log("Database cleared.");

  const PEPPER = process.env.BCRYPT_PEPPER;
  const SALT_ROUNDS = 10;

  const rawPassword = "Mrbarbie1";
  const rawPassword2 = "Admin123";
  const rawPassword3 = "enterprise123";
  const rawPassword4 = "individual123";

  const hashedPassword = await bcrypt.hash(
    rawPassword + PEPPER,
    SALT_ROUNDS
  );

  const hashedPassword2 = await bcrypt.hash(
    rawPassword2 + PEPPER,
    SALT_ROUNDS
  );

  const hashedPassword3 = await bcrypt.hash(
    rawPassword3 + PEPPER,
    SALT_ROUNDS
  );

  const hashedPassword4 = await bcrypt.hash(
    rawPassword4 + PEPPER,
    SALT_ROUNDS
  );

  await prisma.user.create({
    data: {
      name: "Ben Developer",
      email: "bennchigozie@gmail.com",
      password: hashedPassword,
      accountType: "DEV",
      emailVerified: true,

    }
  });
  console.log("Dev User inserted.");

  await prisma.user.create({
    data: {
      name: "memestructures admin",
      email: "admin@gmail.com",
      password: hashedPassword2,
      accountType: "ADMIN",
      emailVerified: true,

    }
  });

  console.log("Admin User inserted.");

  await prisma.user.create({
    data: {
      name: "memestructures enterprise",
      email: "enterprise@gmail.com",
      password: hashedPassword3,
      accountType: "ENTERPRISE",
      emailVerified: true,
      kycStatus: "VERIFIED",
    }
  });

  console.log("Enterprise User inserted.");

  await prisma.user.create({
    data: {
      name: "memestructures individual",
      email: "individual@gmail.com",
      password: hashedPassword4,
      accountType: "INDIVIDUAL",
      emailVerified: true,
      kycStatus: "VERIFIED",
    }
  });
  console.log("Seed user inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });