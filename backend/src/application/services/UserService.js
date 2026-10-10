import { userRepository } from '../../infrastructure/repositories/userRepository.js';
import { User } from '../../domain/entities/User.js';
import { UserResponseDto } from '../dtos/UserDtos/UserResponseDto.js';

export async function registerUser(dto) {
    const existingLogin = await userRepository.findByLogin(dto.login);
    if (existingLogin) throw new Error("LOGIN_ALREADY_EXISTS");

    const existingEmail = await userRepository.findByEmail(dto.email);
    if (existingEmail) throw new Error("EMAIL_ALREADY_EXISTS");

    const passwordHash = await hashPassword(dto.password);

    const user = User.create({
        login: dto.login,
        username: dto.username,
        email: dto.email,
        passwordHash
    });

    await userRepository.save(user);

    return new UserResponseDto(user);
}

export async function updateUser(userId, dto) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error("USER_NOT_FOUND");

    if (dto.login !== undefined) {
        user.changeLogin(dto.login);
    }
    if (dto.username !== undefined) {
        user.changeUsername(dto.username);
    }
    if (dto.email !== undefined) {
        user.changeEmail(dto.email);
    }
    if (dto.password !== undefined) {
        const newHash = await hashPassword(dto.password);
        user.changePassword(newHash);
    }

    await userRepository.save(user);

    return new UserResponseDto(user);
}

async function hashPassword(plainPassword) {
    // В реальном проекте: return await bcrypt.hash(plainPassword, 10);
    return `hashed_${plainPassword}`;
}