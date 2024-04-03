import mongoose, {ConnectOptions, Model, Mongoose, SchemaOptions, ToObjectOptions} from "mongoose";
import {Repositories} from "../../../application/repositories/Repositories";
import {Booking} from "cinetex-core/dist/domain/entities/Booking";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {Theatre} from "cinetex-core/dist/domain/entities/Theatre";
import {User} from "cinetex-core/dist/domain/entities/User";

import {MongoDBMovieRepository, MovieSchema} from "./MongoDBMovieRepository";
import {MongoDBTheatreRepository, TheatreSchema} from "./MongoDBTheatreRepository";
import {MongoDBScheduleRepository, ScheduleSchema} from "./MongoDBScheduleRepository";
import {BookingSchema, MongoDBBookingRepository} from "./MongoDBBookingRepository";
import {MongoDBUserRepository, UserSchema} from "./MongoDBUserRepository";

const defaultUri = "mongodb://localhost:27017"

const defaultOptions: ConnectOptions = {
    dbName: "Cinetex",
    user: "root",
    pass: "goodExample",
}

export async function connectMongoDB(uri?: string, options?: ConnectOptions): Promise<Mongoose> {
    return mongoose.connect(uri ?? defaultUri, options ?? defaultOptions)
}

export const DefaultToObjectOptions: ToObjectOptions = {
    versionKey: false,
    transform: function (doc: any, ret: Record<string, any>) {
        if (doc instanceof Model) {
            if (!ret.id && ret._id) {
                ret.id = ret._id.toHexString()
            }
        }
        delete ret._id;
    }
}

export const DefaultSchemaOptions: SchemaOptions = {
    id: false,
    versionKey: false,
}

export const DefaultSubSchemaOptions: SchemaOptions = {
    _id: false,
    id: false,
    versionKey: false,
}

export class MongoDBRepositories implements Repositories {
    readonly movieModel = mongoose.model<Movie>("Movie", MovieSchema)
    readonly theatreModel = mongoose.model<Theatre>("Theatre", TheatreSchema)
    readonly scheduleModel = mongoose.model<Schedule>("Schedule", ScheduleSchema)
    readonly bookingModel = mongoose.model<Booking>("Booking", BookingSchema)
    readonly userModel = mongoose.model<User>("User", UserSchema)

    readonly Movie = new MongoDBMovieRepository(this.movieModel)
    readonly Theatre = new MongoDBTheatreRepository(this.theatreModel)
    readonly Schedule = new MongoDBScheduleRepository(this.scheduleModel, this.movieModel, this.theatreModel)
    readonly Booking = new MongoDBBookingRepository(this.bookingModel, this.theatreModel, this.movieModel, this.userModel)
    readonly User = new MongoDBUserRepository(this.userModel)

    async sync(): Promise<void> {
        // Do nothing
    }

    async transaction(callback: (tx: any) => Promise<void>): Promise<void> {
        await callback(undefined)
    }
}

