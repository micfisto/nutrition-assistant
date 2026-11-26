import { InMemoryUserProfileRepository } from "./InMemoryRepositories/InMemoryUserProfileRepository.js";

const driver = process.env.DB_DRIVER || "memory";

let userProfileRepository;

if (driver === "orm") {
  const { OrmUserProfileRepository } = await import(
    "./OrmRepositories/OrmUserProfileRepository.js"
  );
  const { prisma } = await import("../orm/PrismaClient.js");
  userProfileRepository = new OrmUserProfileRepository(
    prisma.userProfileEntity,
  );
  console.log("Профили: Supabase (ORM)");
} else {
  userProfileRepository = new InMemoryUserProfileRepository();
  console.log("Профили: оперативная память (In-Memory)");
}

export { userProfileRepository };