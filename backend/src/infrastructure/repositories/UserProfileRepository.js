import { InMemoryUserProfileRepository } from "./InMemoryRepositories/InMemoryUserProfileRepository.js";
// import { OrmUserProfileRepository } from "./OrmRepositories/OrmUserProfileRepository.js";
// import { prisma } from "../orm/PrismaClient.js";

const driver = process.env.DB_DRIVER || "memory";

let userProfileRepository;

if (driver === "memory") {
  userProfileRepository = new InMemoryUserProfileRepository();
} else if (driver === "orm") {
  // ORM repository not implemented yet, falling back to memory
  userProfileRepository = new InMemoryUserProfileRepository();
}

export { userProfileRepository };