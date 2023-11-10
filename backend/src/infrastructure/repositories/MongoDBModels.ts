import mongoose, {
    ConnectOptions,
    Model,
    Mongoose,
    Schema,
    SchemaDefinition,
    SchemaDefinitionType,
    Types
} from "mongoose";
import {Booking, MediaStore, Movie, Schedule, User} from "@cinetex/shared/domain/entities";
import {Theatre} from "@cinetex/shared/domain/entities";


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

export class MongoDBModels {

    readonly Movie: Model<Movie> = this.initModel<Movie>("Movie", MovieDefinition)
    readonly Theatre: Model<Theatre> = this.initModel<Theatre>("Theatre", TheatreDefinition)
    readonly Schedule: Model<Schedule> = this.initModel<Schedule>("Schedule", ScheduleDefinition)
    readonly Booking: Model<Booking> = this.initModel<Booking>("Booking", BookingDefinition)
    readonly User: Model<User> = this.initModel<User>("User", UserDefinition)
    readonly MediaStore: Model<MediaStore> = this.initModel<MediaStore>("MediaStore", MediaStoreDefinition)

    protected initModel<T>(name: string, definition: SchemaDefinition<SchemaDefinitionType<T>>, options?: {}): Model<T> {
        return mongoose.models[name] as Model<T> ??
            mongoose.model<T>(name, new Schema(definition, options ?? DefaultSchemaOptions), name)
    }

    get<T>(name: keyof Omit<MongoDBModels, "getModel">): Model<T> {
        return mongoose.models[name] as Model<T>
    }

    static defaultUri = "mongodb://localhost:27017"

    static defaultOptions: ConnectOptions = {
        dbName: "Cinetex",
        user: "root",
        pass: "goodExample",
    }

    static async connect(uri?: string, options?: ConnectOptions): Promise<Mongoose> {
        return mongoose.connect(uri ?? MongoDBModels.defaultUri, options ?? MongoDBModels.defaultOptions)
    }
}
