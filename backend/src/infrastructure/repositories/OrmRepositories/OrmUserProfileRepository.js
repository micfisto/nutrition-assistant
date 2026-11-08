import { UserProfileMapper } from "../../mappers/UserProfileMapper.js";
import { InfrastructureError } from "../../../domain/errors/InfrastructureError.js";

export class OrmUserProfileRepository {
  #ormModel;

  constructor(ormModel) {
    this.#ormModel = ormModel;
  }

  async findById(id) {
    try {
      const rawProfile = await this.#ormModel.findUnique({ where: { id } });
      return UserProfileMapper.toDomain(rawProfile);
    } catch (err) {
      throw new InfrastructureError('DATABASE_QUERY_ERROR', err);
    }
  }

  async findByUserId(userId) {
    try {
      const rawProfile = await this.#ormModel.findUnique({ where: { userId } });
      return UserProfileMapper.toDomain(rawProfile);
    } catch (err) {
      throw new InfrastructureError('DATABASE_QUERY_ERROR', err);
    }
  }

  async findAll() {
    try {
      const rawProfiles = await this.#ormModel.findMany();
      return rawProfiles.map(raw => UserProfileMapper.toDomain(raw)).filter(p => p !== null);
    } catch (err) {
      throw new InfrastructureError('DATABASE_QUERY_ERROR', err);
    }
  }

  async save(profile) {
    try {
      const data = UserProfileMapper.toPersistence(profile);

      await this.#ormModel.upsert({
        where: { id: data.id },
        update: data,
        create: data
      });
    } catch (err) {
      throw new InfrastructureError('DATABASE_SAVE_ERROR', err);
    }
  }

  async delete(id) {
    try {
      await this.#ormModel.delete({ where: { id } });
    } catch (err) {
      throw new InfrastructureError('DATABASE_DELETE_ERROR', err);
    }
  }
}
