import mongoose, {ConnectOptions, Model, Mongoose, Schema, SchemaDefinition, SchemaDefinitionType} from "mongoose";
import {Repositories} from "../../application/repositories";
import {Booking, MediaContent, Movie, Schedule, Theatre, User} from "shared/dist/domain/entities";
import {MongoDBMovieRepository, MovieSchemaDefinition} from "./MongoDBMovieRepository";
import {MongoDBTheatreRepository, TheatreSchemaDefinition} from "./MongoDBTheatreRepository";
import {MongoDBScheduleRepository, ScheduleSchemaDefinition} from "./MongoDBScheduleRepository";
import {BookingSchemaDefinition, MongoDBBookingRepository} from "./MongoDBBookingRepository";
import {MongoDBUserRepository, UserSchemaDefinition} from "./MongoDBUserRepository";
import {MediaContentSchemaDefinition, MongoDBMediaContentRepository} from "./MongoDBMediaContentRepository";

const defaultUri = "mongodb://localhost:27017"

const defaultOptions: ConnectOptions = {
    dbName: "Cinetex",
    user: "root",
    pass: "goodExample",
}

export async function connectMongoDB(uri?: string, options?: ConnectOptions): Promise<Mongoose> {
    return mongoose.connect(uri ?? defaultUri, options ?? defaultOptions)
}

const DefaultSchemaOptions = {
    id: true,
    versionKey: false,
    toObject: {
        virtuals: true, id: true, versionKey: false,
        transform: function (doc: any, ret: Record<string, any>) {
            delete ret._id;
        }
    },
    toJSON: {
        virtuals: true, id: true, versionKey: false,
        transform: function (doc: any, ret: Record<string, any>) {
            delete ret._id;
        }
    }
}

export function MongoDBRepositories(): Repositories {
    function createModel<T>(name: string, definition: SchemaDefinition<SchemaDefinitionType<T>>, options?: {}): Model<T> {
        return mongoose.models[name] as Model<T> ??
            mongoose.model<T>(name, new Schema(definition, options ?? DefaultSchemaOptions), name)
    }
    return {
        Movie: MongoDBMovieRepository(createModel<Movie>("Movie", MovieSchemaDefinition)),
        Theatre: MongoDBTheatreRepository(createModel<Theatre>("Theatre", TheatreSchemaDefinition)),
        Schedule: MongoDBScheduleRepository(createModel<Schedule>("Schedule", ScheduleSchemaDefinition)),
        Booking: MongoDBBookingRepository(createModel<Booking>("Booking", BookingSchemaDefinition)),
        User: MongoDBUserRepository(createModel<User>("User", UserSchemaDefinition)),
        MediaContent: MongoDBMediaContentRepository(createModel<MediaContent>("MediaContent", MediaContentSchemaDefinition))
    }
}
