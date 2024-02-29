import mongoose, {
    ConnectOptions,
    Model,
    Mongoose,
    Schema,
    SchemaDefinition,
    SchemaDefinitionType,
    SchemaOptions,
    ToObjectOptions
} from "mongoose";
import {Repositories} from "../../application/repositories/Repositories";
import {Booking} from "cinetex-core/dist/domain/entities/Booking";
import {MediaContent} from "cinetex-core/dist/domain/entities/MediaContent";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {Theatre} from "cinetex-core/dist/domain/entities/Theatre";
import {User} from "cinetex-core/dist/domain/entities/User";

import {MongoDBMovieRepository, MovieSchemaDefinition} from "./MongoDBMovieRepository";
import {MongoDBTheatreRepository, TheatreSchemaDefinition} from "./MongoDBTheatreRepository";
import {MongoDBScheduleRepository, ScheduleSchemaDefinition, ScheduleSchemaOptions} from "./MongoDBScheduleRepository";
import {BookingSchemaDefinition, MongoDBBookingRepository} from "./MongoDBBookingRepository";
import {MongoDBUserRepository, UserSchemaDefinition} from "./MongoDBUserRepository";
import {MediaContentSchemaDefinition, MongoDBMediaContentRepository} from "./MongoDBMediaContentRepository";
import {toObjectId} from "./MongoDBUtils";

const defaultUri = "mongodb://localhost:27017"

const defaultOptions: ConnectOptions = {
    dbName: "Cinetex",
    user: "root",
    pass: "goodExample",
}

export async function connectMongoDB(uri?: string, options?: ConnectOptions): Promise<Mongoose> {
    return mongoose.connect(uri ?? defaultUri, options ?? defaultOptions)
}

export const DefaultSubSchemaOptions: SchemaOptions = {
    _id: false,
    id: false,
}

export const DefaultSchemaOptions: SchemaOptions = {
    id: false,
    versionKey: false,
}

export const DefaultToObjectOptions: ToObjectOptions = {
    versionKey: false,
    transform: function (doc: any, ret: Record<string, any>) {
        if (!ret.id) {
            ret.id = ret._id?.toHexString()
        }
        delete ret._id;
    }
}

export function fromObject<T>(obj: T): T {
    const original = obj as any
    const replacement: any = {
        ...obj,
    }
    if (original.id && typeof original.id === "string" && !original._id) {
        replacement._id = toObjectId(original.id)
        replacement.id = undefined
    }
    return replacement as T

}


export function MongoDBRepositories(): Repositories {
    function createModel<T>(name: string, definition: SchemaDefinition<SchemaDefinitionType<T>>, options?: {}): Model<T> {
        return mongoose.models[name] as Model<T> ??
            mongoose.model<T>(name, new Schema(definition, options ?? DefaultSchemaOptions), name)
    }
    const movieModel = createModel<Movie>("Movie", MovieSchemaDefinition, DefaultSchemaOptions)
    const theatreModel = createModel<Theatre>("Theatre", TheatreSchemaDefinition, DefaultSchemaOptions)
    const scheduleModel = createModel<Schedule>("Schedule", ScheduleSchemaDefinition, ScheduleSchemaOptions)
    const bookingModel = createModel<Booking>("Booking", BookingSchemaDefinition, DefaultSchemaOptions)
    const userModel = createModel<User>("User", UserSchemaDefinition, DefaultSchemaOptions)
    return {
        Movie: MongoDBMovieRepository(movieModel),
        Theatre: MongoDBTheatreRepository(theatreModel),
        Schedule: MongoDBScheduleRepository(scheduleModel, movieModel, theatreModel),
        Booking: MongoDBBookingRepository(bookingModel, theatreModel, movieModel, userModel),
        User: MongoDBUserRepository(userModel),
        MediaContent: MongoDBMediaContentRepository(createModel<MediaContent>("MediaContent", MediaContentSchemaDefinition))
    }
}
