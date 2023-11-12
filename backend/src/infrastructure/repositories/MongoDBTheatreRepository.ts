import {TheatreRepository} from "../../application/repositories";
import {toObjectId, toPatternFilter, toRangeFilter} from "./MongoDBUtils";
import {FilterQuery, Model} from "mongoose";
import {Theatre} from "shared/dist/domain/entities";
import {TheatreQueryCriteria} from "shared/dist/application/usecases/queries";

export function MongoDBTheatreRepository(model: Model<Theatre>): TheatreRepository {
    return {
        async getAllTheatres(): Promise<Theatre[]> {
            return (await model.find()).map(theatre => theatre.toObject());
        },

        async getTheatreById(id: string): Promise<Theatre | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject();
        },

        async getTheatreByName(name: string): Promise<Theatre | undefined> {
            return (await model.findOne({name: name}))?.toObject();
        },

        async getTheatresByQuery(criteria: TheatreQueryCriteria): Promise<Theatre[]> {
            const filter = createTheatreFilter(criteria);
            return (await model.find(filter)).map(theatre => theatre.toObject());
        },

        async addTheatre(theatre: Theatre): Promise<Theatre> {
            return (await model.create(theatre)).toObject();
        },

        async deleteTheatreById(id: string): Promise<Theatre | undefined> {
            return (await model
                .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
        },

        async deleteTheatreByName(name: string): Promise<Theatre | undefined> {
            return (await model
                .findOneAndDelete({name: name}, {returnDocument: "before"}))?.toObject();
        },

        async deleteTheatresByQuery(criteria: TheatreQueryCriteria): Promise<number> {
            const filter = createTheatreFilter(criteria);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined> {
            delete (theatre as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: theatre}, {returnDocument: "after"}))?.toObject()
        },
    }

    function createTheatreFilter(criteria: TheatreQueryCriteria): FilterQuery<Theatre> {
        const filter: FilterQuery<any> = {}
        if (criteria.name) {
            filter.name = toPatternFilter(criteria.name)
        }
        if (criteria.screenCount) {
            filter.screen = { $size: toRangeFilter(criteria.screenCount) }
        }
        if (criteria.location) {
            filter.location = {
                $or: [
                    { street: toPatternFilter(criteria.location) },
                    { city: toPatternFilter(criteria.location) },
                    { state: toPatternFilter(criteria.location) },
                    { zip: toPatternFilter(criteria.location) }
                ]
            }
        }
        return filter as FilterQuery<Theatre>
    }
}
