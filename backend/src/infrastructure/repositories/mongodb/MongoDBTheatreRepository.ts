import {TheatreRepository} from "../../../application/repositories/TheatreRepository";
import {filterField, filterIdField, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, Schema, SchemaDefinition} from "mongoose";
import {Theatre} from "cinetex-core/dist/domain/entities/Theatre";
import {TheatresQuery} from "cinetex-core/dist/application/queries";
import {DefaultSchemaOptions, DefaultSubSchemaOptions} from "./MongoDBRepositories";
import {MongoDBRepository} from "./MongoDBRepository";

const AddressDefinition: SchemaDefinition = {
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: String, required: true},
}

const AddressSchema = new Schema(AddressDefinition, DefaultSubSchemaOptions)

const ScreenDefinition: SchemaDefinition = {
    id: {type: Number, required: true},
    name: {type: String, required: true},
    rows: {type: Number, required: true},
    columns: {type: Number, required: true},
    frontRows: {type: Number, required: true},
    sideColumns: {type: Number, required: true},
    seats: {type: [[Number]], required: true},
    imageUrl: {type: String, required: false},
}

const ScreenSchema = new Schema(ScreenDefinition, DefaultSubSchemaOptions)

const TheatreSchemaDefinition: SchemaDefinition = <SchemaDefinition> {
    name: {type: String, required: true, unique: true, index: true},
    location: {type: AddressSchema, required: true},
    phone: {type: String, required: false},
    screens: {type: [ScreenSchema], required: true},
    imageUrl: {type: String, required: false}
}

export const TheatreSchema = new Schema(TheatreSchemaDefinition, DefaultSchemaOptions)

export class MongoDBTheatreRepository extends MongoDBRepository<Theatre> implements TheatreRepository {

    constructor(model: Model<Theatre>) {
        super(model);

    }

    async getAllTheatres(): Promise<Theatre[]> {
        return (await this.model.find()).map(theatre => theatre.toObject(this.toObjectOptions));
    }

    async getTheatreById(id: string): Promise<Theatre | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject(this.toObjectOptions);
    }

    async getTheatreByName(name: string): Promise<Theatre | undefined> {
        return (await this.model.findOne({name: name}))?.toObject(this.toObjectOptions);
    }

    async getTheatresByQuery(query: TheatresQuery): Promise<Theatre[]> {
        const filter = createTheatreFilter(query);
        return (await this.model.find(filter)).map(theatre => theatre.toObject(this.toObjectOptions));
    }

    async addTheatre(theatre: Theatre): Promise<Theatre> {
        return (await this.model.create(this.fromObject(theatre))).toObject(this.toObjectOptions);
    }

    async deleteTheatreById(id: string): Promise<Theatre | undefined> {
        return (await this.model
            .findByIdAndDelete(toObjectId(id), { returnDocument: "before" }))?.toObject(this.toObjectOptions);
    }

    async deleteTheatreByName(name: string): Promise<Theatre | undefined> {
        return (await this.model
            .findOneAndDelete({name: name}, { returnDocument: "before" }))?.toObject(this.toObjectOptions);
    }

    async deleteTheatresByQuery(query: TheatresQuery): Promise<number> {
        const filter = createTheatreFilter(query);
        return (await this.model.deleteMany(filter)).deletedCount || 0
    }

    async updateTheatreById(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined> {
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: this.fromObject(theatre)}, { returnDocument: "after" }))?.toObject(this.toObjectOptions)
    }
}

export function createTheatreFilter(query: TheatresQuery): FilterQuery<Theatre> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filterIdField(filter, "_id", query.id)
    }
    if (query.name) {
        filterField(filter, "name", query.name)
    }
    if (query.screenCount) {
        filter.screen = filterField({}, "$size", query.screenCount)
    }
    if (query.location) {
        filter.location = {
            $or: [
                filterField({}, "street", query.location),
                filterField({}, "city", query.location),
                filterField({}, "state", query.location),
                filterField({}, "zip", query.location),
            ]
        }
    }
    return filter
}
