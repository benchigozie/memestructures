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
  const rawPassword2 = "Mrbarbie1";

  const hashedPassword = await bcrypt.hash(
    rawPassword + PEPPER,
    SALT_ROUNDS
  );

  const hashedPassword2 = await bcrypt.hash(
    rawPassword2 + PEPPER,
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
      console.log("Seed admin inserted.");

      await prisma.user.create({
        data: {
          name: "Benedict Meow",
          email: "asoyabenedict@gmail.com",
          password: hashedPassword2,
          accountType: "INDIVIDUAL",
          emailVerified: true,
          
        }
      });
        console.log("Seed user4 inserted.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });