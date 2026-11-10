import {InMemoryUserRepository} from "./InMemoryRepositories/InMemoryUserRepository.js";
// import { OrmUserRepository } from './OrmUserRepository.js';
// import { prisma } from '../orm/PrismaClient.js';

const driver = process.env.DB_DRIVER || 'memory';

let userRepository;

console.log('DB_DRIVER:', driver);

if (driver === 'memory') {
    userRepository = new InMemoryUserRepository();
    console.log('Используется хранилище в оперативной памяти (In-Memory)');
} else if (driver === 'orm') {
    // ORM repository not implemented yet, falling back to memory
    userRepository = new InMemoryUserRepository();
    console.log('ORM repository not implemented, falling back to In-Memory');
}

console.log('userRepository initialized:', !!userRepository);

export {userRepository};