import mongoose, {ConnectOptions, Model, Mongoose, Schema, SchemaDefinition, SchemaDefinitionType} from "mongoose";
import {Repositories} from "../../application/repositories";
import {Booking, MediaContent, Movie, Schedule, Theatre, User} from "core/dist/domain/entities";
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
    const movieModel = createModel<Movie>("Movie", MovieSchemaDefinition)
    const theatreModel = createModel<Theatre>("Theatre", TheatreSchemaDefinition)
    const scheduleModel = createModel<Schedule>("Schedule", ScheduleSchemaDefinition)
    const bookingModel = createModel<Booking>("Booking", BookingSchemaDefinition)
    const userModel = createModel<User>("User", UserSchemaDefinition)
    return {
        Movie: MongoDBMovieRepository(movieModel),
        Theatre: MongoDBTheatreRepository(theatreModel),
        Schedule: MongoDBScheduleRepository(scheduleModel, movieModel, theatreModel),
        Booking: MongoDBBookingRepository(bookingModel, theatreModel, movieModel, userModel),
        User: MongoDBUserRepository(userModel),
        MediaContent: MongoDBMediaContentRepository(createModel<MediaContent>("MediaContent", MediaContentSchemaDefinition))
    }
}
