import {TheatreRepository} from "../../application/repositories";
import {asFieldFilter, asIdFieldFilter, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition} from "mongoose";
import {Theatre} from "cinetex-core/dist/domain/entities";
import {TheatresQuery} from "cinetex-core/dist/application/queries";

const AddressDefinition: SchemaDefinition = {
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: String, required: true}
}

const ScreenDefinition: SchemaDefinition = {
    name: {type: String, required: true},
    rows: {type: Number, required: true},
    columns: {type: Number, required: true},
    frontRows: {type: Number, required: true},
    sideColumns: {type: Number, required: true},
    seats: {type: [[Number]], required: true},
    imageUrl: {type: String, required: false}
}

export const TheatreSchemaDefinition: SchemaDefinition = {
    name: {type: String, required: true, unique: true, index: true},
    location: {type: AddressDefinition, required: true},
    screens: {type: [ScreenDefinition], required: true},
    imageUrl: {type: String, required: false}
}

export function createTheatreFilter(query: TheatresQuery): FilterQuery<Theatre> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filter._id = asIdFieldFilter(query.id)
        return filter
    }
    if (query.name) {
        filter.name = asFieldFilter(query.name)
    }
    if (query.screenCount) {
        filter.screen = {$size: asFieldFilter(query.screenCount)}
    }
    if (query.location) {
        filter.location = {
            $or: [
                {street: asFieldFilter(query.location)},
                {city: asFieldFilter(query.location)},
                {state: asFieldFilter(query.location)},
                {zip: asFieldFilter(query.location)}
            ]
        }
    }
    return filter
}

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

        async getTheatresByQuery(query: TheatresQuery): Promise<Theatre[]> {
            const filter = createTheatreFilter(query);
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

        async deleteTheatresByQuery(query: TheatresQuery): Promise<number> {
            const filter = createTheatreFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined> {
            delete (theatre as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: theatre}, {returnDocument: "after"}))?.toObject()
        },
    }

}
