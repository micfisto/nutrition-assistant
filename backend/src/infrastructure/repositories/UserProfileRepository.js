import { InMemoryUserProfileRepository } from "./InMemoryRepositories/InMemoryUserProfileRepository.js";
import { OrmUserProfileRepository } from "./OrmRepositories/OrmUserProfileRepository.js";
import { prisma } from "../orm/PrismaClient.js";

const driver = process.env.DB_DRIVER || "memory";

let userProfileRepository;

if (driver === "memory") {
  userProfileRepository = new InMemoryUserProfileRepository();
} else if (driver === "orm") {
  userProfileRepository = new OrmUserProfileRepository(prisma.userProfileEntity);
}

export { userProfileRepository };