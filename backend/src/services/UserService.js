import {userRepository} from '../infrastructure/repositories/userRepository.js';
import {User} from '../domain/entities/User.js';
import {DomainError} from '../domain/errors/DomainError.js';
import {UserErrors} from '../domain/errors/UserErrors.js';

export class UserService {

    async registerUser({login, username, email, passwordHash, role}) {
        const existingByLogin = await userRepository.findByLogin({login});
        if(existingByLogin)
            throw new DomainError(UserErrors.LoginAlreadyExists);

        const existingByEmail = await userRepository.findByEmail(email);
        if (existingByEmail)
            throw new DomainError(UserErrors.EmailAlreadyExists);

        const user = User.create({
            login,
            username,
            email,
            passwordHash,
            role
        });

        await this.#saveUser(user);
    }

    async updateUser({id, login, username, email}) {
        /**@type {User}*/
        const user = await this.#getUserById(id);

        if (login !== undefined)
            user.changeLogin(login);

        if (username !== undefined)
            user.changeUsername(username);

        if (email !== undefined)
            user.changeEmail(email);

        await this.#saveUser(user);
    }

    async updatePassword({id, password}) {
        /**@type {User}*/
        const user = await this.#getUserById(id);
        user.changePassword(password);

        await this.#saveUser(user);
    }

    async updateRole({id, role}) {
        /**@type {User}*/
        const user = await this.#getUserById(id);
        user.changeRole(role);

        await this.#saveUser(user);
    }

    async deactivateUser(id) {
        /**@type {User}*/
        const user = await this.#getUserById(id);
        user.deactivate();

        await this.#saveUser(user);
    }

    async deleteUser(id) {
        /**@type {User}*/
        const user = await this.#getUserById(id);
        user.delete();

        await this.#saveUser(user);
    }

    async recoverUser(id) {
        /**@type {User}*/
        const user = await this.#getUserById(id);
        user.recover();

        await this.#saveUser(user);
    }

    async #getUserById(id) {
        const user = await userRepository.findById(id);
        if (!user)
            throw new DomainError(UserErrors.NotFound);

        return user;
    }

    async #saveUser(user){
        await userRepository.save(user);
        return user.toJSON();
    }
}

export const userService = new UserService();