import { userRepository } from '../infrastructure/repositories/userRepository.js';
import { User } from '../domain/entities/User.js';
import { DomainError } from '../domain/errors/DomainError.js';
import { UserErrors } from '../domain/errors/UserErrors.js';

export class UserService {

    async registerUser({ login, username, email, passwordHash, role }) {
        const existingByEmail = await userRepository.findByEmail(email);
        if (existingByEmail) {
            throw new DomainError(UserErrors.EmailAlreadyExists); // Или твоя ошибка
        }

        const user = User.create({
            login,
            username,
            email,
            passwordHash,
            role
        });

        await userRepository.save(user);

        return user.toJSON();
    }

    async getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new DomainError(UserErrors.NotFound);
        }
        return user.toJSON();
    }

    async deactivateUser(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new DomainError(UserErrors.NotFound);
        }

        user.deactivate();

        await userRepository.save(user);
        return user.toJSON();
    }
}

export const userService = new UserService();