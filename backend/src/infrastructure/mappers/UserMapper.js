import {User} from '../../domain/entities/User.js';

export class UserMapper {
    static toDomain(raw) {
        if (!raw)
            return null;

        return User.restore({
            id: raw.id,
            login: raw.login,
            username: raw.username,
            email: raw.email,
            passwordHash: raw.password_hash || raw.passwordHash,
            role: raw.role,
            status: raw.status,
            deactivatedAt: raw.deactivated_at || raw.deactivatedAt,
            updatedAt: raw.updated_at || raw.updated_at
        })
    }

    static toPersistence(user) {
        const json = user.toJSON();
        return {
            id: json.id,
            login: json.login,
            username: json.username,
            email: json.email,
            password_hash: json.passwordHash,
            role: json.role,
            status: json.status,
            deactivated_at: json.deactivatedAt,
            updated_at: json.updated_at
        };
    }
}