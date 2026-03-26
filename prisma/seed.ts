import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import prisma from "@/lib/prisma";

async function main() {

    console.log("Clearing database...");

    await prisma.membership.deleteMany();
    console.log("Memberships cleared.");
    await prisma.organization.deleteMany();
    console.log("Organizations cleared.");
    await prisma.user.deleteMany();
    console.log("Users cleared.");

    console.log("Database cleared.");

    /*await prisma.user.create({
      data: {
        name: "Ben Admin",
        email: "benmarrk@gmail.com",
        password: "Mrbarbie1",
        accountType: "DEV"
      }
    });
      console.log("Seed admin inserted.");*/
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });