import { InMemoryUserRepository } from "./InMemoryRepositories/InMemoryUserRepository.js";

const driver = process.env.DB_DRIVER || "memory";

let userRepository;

if (driver === "orm") {
  const { OrmUserRepository } = await import(
    "./OrmRepositories/OrmUserRepository.js"
  );
  const { prisma } = await import("../orm/PrismaClient.js");
  userRepository = new OrmUserRepository(prisma.userEntity);
  console.log("Пользователи: Supabase (ORM)");
} else {
  userRepository = new InMemoryUserRepository();
  console.log("Пользователи: оперативная память (In-Memory)");
}

export { userRepository };