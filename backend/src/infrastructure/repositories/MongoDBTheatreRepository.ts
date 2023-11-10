import {TheatreRepository} from "../../application/repositories/TheatreRepository";
import {toObjectId, toPatternFilter, toRangeFilter} from "./MongoDBUtils";
import {FilterQuery, Model} from "mongoose";
import {Theatre} from "@cinetex/shared/domain/entities/Theatre";
import {TheatreQueryCriteria} from "@cinetex/shared/application/usecases/queries/GetTheatresByQuery";

export class MongoDBTheatreRepository implements TheatreRepository {

    constructor(readonly model: Model<Theatre>) {}

    async getAllTheatres(): Promise<Theatre[]> {
        return (await this.model.find()).map(theatre => theatre.toObject());
    }

    async getTheatreById(id: string): Promise<Theatre | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject();
    }

    async getTheatreByName(name: string): Promise<Theatre | undefined> {
        return (await this.model.findOne({name: name}))?.toObject();
    }

    async getTheatresByQuery(criteria: TheatreQueryCriteria): Promise<Theatre[]> {
        const filter = createTheatreFilter(criteria);
        return (await this.model.find(filter)).map(theatre => theatre.toObject());
    }

    async addTheatre(theatre: Theatre): Promise<Theatre> {
        return (await this.model.create(theatre)).toObject();
    }

    async deleteTheatreById(id: string): Promise<Theatre | undefined> {
        return (await this.model
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteTheatreByName(name: string): Promise<Theatre | undefined> {
        return (await this.model
            .findOneAndDelete({name: name}, {returnDocument: "before"}))?.toObject();
    }

    async deleteTheatresByQuery(criteria: TheatreQueryCriteria): Promise<number> {
        const filter= createTheatreFilter(criteria);
        return (await this.model.deleteMany(filter)).deletedCount || 0
    }

    async updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined> {
        delete (theatre as any).id
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: theatre}, {returnDocument: "after"}))?.toObject()
    }
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
