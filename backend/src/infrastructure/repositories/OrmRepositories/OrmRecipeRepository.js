import {RecipeMapper} from "../../mappers/RecipeMapper.js";
import {InfrastructureError} from "../../../domain/errors/InfrastructureError.js";

export class OrmRecipeRepository {
    #ormModel;

    constructor(ormModel) {
        this.#ormModel = ormModel;
    }

    async findAll() {
        try {
            const rawRecipes = await this.#ormModel.findMany();
            return rawRecipes.map(raw => RecipeMapper.toDomain(raw)).filter(r => r !== null);
        } catch (err) {
            throw new InfrastructureError('DATABASE_QUERY_ERROR', err);
        }
    }

    async findById(id) {
        try {
            const rawRecipe = await this.#ormModel.findUnique({where: {id}});
            return RecipeMapper.toDomain(rawRecipe);
        } catch (err) {
            throw new InfrastructureError('DATABASE_QUERY_ERROR', err);
        }
    }

    async save(recipe) {
        try {
            const data = RecipeMapper.toPersistence(recipe);

            await this.#ormModel.upsert({
                where: {id: data.id},
                update: data,
                create: data
            });
        } catch (err) {
            throw new InfrastructureError('DATABASE_SAVE_ERROR', err);
        }
    }

    async delete(id) {
        try {
            await this.#ormModel.delete({where: {id}});
        } catch (err) {
            throw new InfrastructureError('DATABASE_DELETE_ERROR', err);
        }
    }
}
