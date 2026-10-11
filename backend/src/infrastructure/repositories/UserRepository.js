import {InMemoryUserRepository} from "./InMemoryRepositories/InMemoryUserRepository.js";
// import { OrmUserRepository } from './OrmUserRepository.js';
// import { prisma } from '../orm/PrismaClient.js';

const driver = process.env.DB_DRIVER || 'memory';

let userRepository;

if (driver === 'memory') {
    userRepository = new InMemoryUserRepository();
    console.log('Используется хранилище в оперативной памяти (In-Memory)');
} else if (driver === 'orm') {
    // userRepository = new OrmUserRepository(prisma.userEntity);
}

export {userRepository};