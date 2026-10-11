import {UserMapper} from "../../mappers/UserMapper.js";

export class InMemoryUserRepository {
    #users = new Map();

    async findById(id) {
        const rawUser = this.#users.get(id);
        return UserMapper.toDomain(rawUser);
    }

    async findByEmail(email) {
        for (const rawUser of this.#users.values()){
            if(rawUser.email === email){
                return UserMapper.toDomain(rawUser);
            }
        }
        return null;
    }

    async save(user) {
        const data = UserMapper.toPersistence(user);
        this.#users.set(data.id, data);
    }
}