import {UserMapper} from "../../mappers/UserMapper.js";
import {InfrastructureError} from "../../../domain/errors/InfrastructureError.js";

export class OrmUserRepository {
    #ormModel;

    constructor(ormModel) {
        this.#ormModel = ormModel;
    }

    async findById(id) {
        try {
            const rawUser = await this.#ormModel.findUnique({where: {id}});
            return UserMapper.toDomain(rawUser);
        } catch (err) {
            throw new InfrastructureError('DATABASE_QUERY_ERROR', err);
        }
    }

    async findByEmail(email) {
        try {
            const rawUser = await this.#ormModel.findUnique({where: {email}});
            return UserMapper.toDomain(rawUser);
        } catch (err) {
            throw new InfrastructureError('DATABASE_QUERY_ERROR', err);
        }
    }

    async findByLogin(login) {
        try {
            const rawUser = await this.#ormModel.findUnique({where: {email: login}});
            return UserMapper.toDomain(rawUser);
        } catch (err) {
            throw new InfrastructureError('DATABASE_QUERY_ERROR', err);
        }
    }

    async save(user) {
        try {
            const data = UserMapper.toPersistence(user);

            await this.#ormModel.upsert({
                where: {id: data.id},
                update: data,
                create: data
            })
        } catch (err) {
            throw new InfrastructureError('DATABASE_SAVE_ERROR', err);
        }
    }
}