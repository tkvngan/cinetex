import {TheatreRepository} from "../../application/repositories";
import {asFieldFilter, asIdFieldFilter, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition, ToObjectOptions} from "mongoose";
import {Theatre} from "cinetex-core/dist/domain/entities";
import {TheatresQuery} from "cinetex-core/dist/application/queries";
import {DefaultSubSchemaOptions, DefaultToObjectOptions, fromObject} from "./MongoDBRepositories";

const AddressDefinition: SchemaDefinition = {
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: String, required: true},
}

const ScreenDefinition: SchemaDefinition = {
    name: {type: String, required: true},
    rows: {type: Number, required: true},
    columns: {type: Number, required: true},
    frontRows: {type: Number, required: true},
    sideColumns: {type: Number, required: true},
    seats: {type: [[Number]], required: true},
    imageUrl: {type: String, required: false},
}

export const TheatreSchemaDefinition: SchemaDefinition = <SchemaDefinition> {
    name: {type: String, required: true, unique: true, index: true},
    location: {type: AddressDefinition, required: true, options: DefaultSubSchemaOptions},
    screens: {type: [ScreenDefinition], required: true, options: DefaultSubSchemaOptions},
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
            return (await model.find()).map(theatre => theatre.toObject(DefaultToObjectOptions));
        },

        async getTheatreById(id: string): Promise<Theatre | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject(DefaultToObjectOptions);
        },

        async getTheatreByName(name: string): Promise<Theatre | undefined> {
            return (await model.findOne({name: name}))?.toObject(DefaultToObjectOptions);
        },

        async getTheatresByQuery(query: TheatresQuery): Promise<Theatre[]> {
            const filter = createTheatreFilter(query);
            return (await model.find(filter)).map(theatre => theatre.toObject(DefaultToObjectOptions));
        },

        async addTheatre(theatre: Theatre): Promise<Theatre> {
            return (await model.create(fromObject(theatre))).toObject(DefaultToObjectOptions);
        },

        async deleteTheatreById(id: string): Promise<Theatre | undefined> {
            return (await model
                .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject(DefaultToObjectOptions);
        },

        async deleteTheatreByName(name: string): Promise<Theatre | undefined> {
            return (await model
                .findOneAndDelete({name: name}, {returnDocument: "before"}))?.toObject(DefaultToObjectOptions);
        },

        async deleteTheatresByQuery(query: TheatresQuery): Promise<number> {
            const filter = createTheatreFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined> {
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: fromObject(theatre)}, {returnDocument: "after"}))?.toObject(DefaultToObjectOptions)
        },
    }

}
