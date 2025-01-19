import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  try {
    // Create initial tenants
    const tenants = [
      {
        name: "Premium Cars",
        domain: "premium",
        description: "Luxury car rentals for special occasions",
      },
      {
        name: "City Rentals",
        domain: "city",
        description: "Affordable city cars for daily use",
      },
    ];

    console.log("Creating tenants...");

    for (const tenantData of tenants) {
      const tenant = await prisma.tenant.upsert({
        where: { domain: tenantData.domain },
        update: {},
        create: tenantData,
      });

      // Create admin user for each tenant
      const hashedPassword = await hash("admin123", 10);
      const adminEmail = `admin@${tenantData.domain}.com`;

      const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
          email: adminEmail,
          name: "Admin",
          password: hashedPassword,
          role: "ADMIN",
          tenants: {
            create: {
              tenantId: tenant.id,
              role: "ADMIN",
            },
          },
        },
      });

      // Create sample cars for each tenant
      const cars = [
        {
          brand: "Toyota",
          model: "Camry",
          year: 2023,
          color: "Silver",
          licensePlate: `${tenantData.domain.toUpperCase()}-1234`,
          dailyRate: 50.0,
          tenantId: tenant.id,
        },
        {
          brand: "Honda",
          model: "Civic",
          year: 2023,
          color: "Black",
          licensePlate: `${tenantData.domain.toUpperCase()}-5678`,
          dailyRate: 45.0,
          tenantId: tenant.id,
        },
      ];

      for (const carData of cars) {
        await prisma.car.upsert({
          where: { licensePlate: carData.licensePlate },
          update: {},
          create: carData,
        });
      }

      console.log(`Created tenant: ${tenant.name} with admin: ${admin.email}`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Error running seed script:", error);
  process.exit(1);
});
