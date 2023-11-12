import mongoose, {ConnectOptions, Model, Mongoose, Schema, SchemaDefinition, SchemaDefinitionType, Types} from "mongoose";
import {Repositories} from "../../application/repositories";
import {MongoDBMovieRepository} from "./MongoDBMovieRepository";
import {MongoDBTheatreRepository} from "./MongoDBTheatreRepository";
import {MongoDBScheduleRepository} from "./MongoDBScheduleRepository";
import {MongoDBBookingRepository} from "./MongoDBBookingRepository";
import {MongoDBUserRepository} from "./MongoDBUserRepository";
import {Booking, MediaContent, Movie, Schedule, User, Theatre} from "shared/dist/domain/entities";
import {MongoDBMediaContentRepository} from "./MongoDBMediaContentRepository";

const defaultUri = "mongodb://localhost:27017"

const defaultOptions: ConnectOptions = {
    dbName: "Cinetex",
    user: "root",
    pass: "goodExample",
}

export async function connectMongoDB(uri?: string, options?: ConnectOptions): Promise<Mongoose> {
    return mongoose.connect(uri ?? defaultUri, options ?? defaultOptions)
}

export function MongoDBRepositories(): Repositories {
    function createModel<T>(name: string, definition: SchemaDefinition<SchemaDefinitionType<T>>, options?: {}): Model<T> {
        return mongoose.models[name] as Model<T> ??
            mongoose.model<T>(name, new Schema(definition, options ?? DefaultSchemaOptions), name)
    }
    return {
        Movie: MongoDBMovieRepository(createModel<Movie>("Movie", MovieDefinition)),
        Theatre: MongoDBTheatreRepository(createModel<Theatre>("Theatre", TheatreDefinition)),
        Schedule: MongoDBScheduleRepository(createModel<Schedule>("Schedule", ScheduleDefinition)),
        Booking: MongoDBBookingRepository(createModel<Booking>("Booking", BookingDefinition)),
        User: MongoDBUserRepository(createModel<User>("User", UserDefinition)),
        MediaContent: MongoDBMediaContentRepository(createModel<MediaContent>("MediaContent", MediaStoreDefinition))
    }
}

const SeatDefinition: SchemaDefinition = {
    row: {type: Number, required: true},
    column: {type: Number, required: true},
    priceClass: {type: String, required: true}
}

const ScreenDefinition: SchemaDefinition = {
    name: {type: String, required: true},
    rows: {type: Number, required: true},
    columns: {type: Number, required: true},
    seats: {type: [SeatDefinition], required: true}
}

const AddressDefinition: SchemaDefinition = {
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zip: {type: String, required: true}
}

const MovieDefinition: SchemaDefinition = {
    name: {type: String, required: true, unique: true, index: true},
    duration: {type: Number, required: true},
    synopsis: {type: String, required: true},
    director: {type: String, required: true},
    cast: {type: [String], required: true},
    releaseDate: {type: String, required: true},
    rating: {type: String, required: true},
    genres: {type: [String], required: true},
    imageId: {type: Types.ObjectId, required: false},
    trailerId: {type: Types.ObjectId, required: false},
}

const TheatreDefinition: SchemaDefinition = {
    name: {type: String, required: true, unique: true, index: true},
    location: {type: AddressDefinition, required: true},
    screens: {type: [ScreenDefinition], required: true}
}

const MediaStoreDefinition: SchemaDefinition = {
    name: {type: String, required: false},
    contentType: {type: String, required: true},
    data: {type: Buffer, required: true}
}

const ScheduleDefinition: SchemaDefinition = {
    theatreId: {type: Types.ObjectId, required: true},
    movieId: {type: Types.ObjectId, required: true},
    screenId: {type: Number, required: true},
    showStartDate: {type: String, required: true},
    showEndDate: {type: String, required: true},
    showTimes: {type: [String], required: true}
}

const SeatPositionDefinition: SchemaDefinition = {
    row: {type: Number, required: true},
    column: {type: Number, required: true}
}

const BookingItemDefinition: SchemaDefinition = {
    screenId: {type: Number, required: true},
    showDate: {type: String, required: true},
    showTime: {type: String, required: true},
    seat: {type: SeatPositionDefinition, required: true},
    price: {type: Number, required: true}
}

const BookingDefinition: SchemaDefinition = {
    userId: {type: Types.ObjectId, required: true},
    theatreId: {type: Types.ObjectId, required: true},
    bookingTime: {type: String, required: true},
    totalPrice: {type: Number, required: true},
    bookingItems: {type: [BookingItemDefinition], required: true}
}

const UserDefinition: SchemaDefinition = {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: false},
}

const DefaultSchemaOptions = {
    id: true,
    versionKey: false,
    toObject: {virtuals: true, id: true, versionKey: false,
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
