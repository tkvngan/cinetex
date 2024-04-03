import {BookingRepository} from "../../../application/repositories/BookingRepository";
import {FilterQuery, Model, Schema, SchemaDefinition, SchemaOptions, ToObjectOptions, Types} from "mongoose";
import {filterField, filterIdField, toObjectId,} from "./MongoDBUtils";
import {Booking, Ticket} from "cinetex-core/dist/domain/entities/Booking";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {Theatre} from "cinetex-core/dist/domain/entities/Theatre";
import {User} from "cinetex-core/dist/domain/entities/User";
import {BookingsQuery} from "cinetex-core/dist/application/queries/GetBookingsByQuery";
import {createTheatreFilter} from "./MongoDBTheatreRepository";
import {createMovieFilter} from "./MongoDBMovieRepository";
import {createUserFilter} from "./MongoDBUserRepository";
import {DefaultSubSchemaOptions} from "./MongoDBRepositories";
import {MongoDBRepository} from "./MongoDBRepository";

const SeatPositionDefinition: SchemaDefinition = {
    row: {type: Number, required: true},
    column: {type: Number, required: true}
}

const SeatPositionSchema = new Schema(SeatPositionDefinition, DefaultSubSchemaOptions)

const TicketDefinition: SchemaDefinition = {
    _movieId: {type: Types.ObjectId, required: true},
    screenId: {type: Number, required: true},
    showDate: {type: String, required: true},
    showTime: {type: String, required: true},
    seat: {type: SeatPositionSchema, required: true},
    price: {type: Number, required: true},
    ticketNo: {type: Number, required: false},
    token: {type: String, required: false}
}

const TicketSchema = new Schema(TicketDefinition, DefaultSubSchemaOptions)

const BookingSchemaDefinition: SchemaDefinition = {
    _userId: {type: Types.ObjectId, required: true},
    _theatreId: {type: Types.ObjectId, required: true},
    bookingTime: {type: String, required: true},
    totalPrice: {type: Number, required: true},
    tickets: {type: [TicketSchema], required: true}
}

const BookingToObjectOptions: ToObjectOptions = {
    versionKey: false,
    transform: function(doc: any, ret: Record<string, any>) {
        if (doc instanceof Model) {
            ret.id = ret._id?.toHexString()
            ret.userId = ret._userId?.toHexString()
            ret.theatreId = ret._theatreId?.toHexString()
            delete ret._userId;
            delete ret._theatreId;
        } else {
            if (ret._movieId) {
                ret.movieId = ret._movieId.toHexString()
                delete ret._movieId
            }
        }
        delete ret._id;
    }
}

const BookingSchemaOptions: SchemaOptions = {
    id: false,
    versionKey: false,
    toObject: BookingToObjectOptions,
    toJSON: BookingToObjectOptions,
}

export const BookingSchema = new Schema(BookingSchemaDefinition, BookingSchemaOptions)

export class MongoDBBookingRepository extends MongoDBRepository<Booking> implements BookingRepository {

    constructor(model: Model<Booking>, private theatreModel: Model<Theatre>, private movieModel: Model<Movie>, private userModel: Model<User>) {
        super(model);
    }

    override toObjectOptions: ToObjectOptions = BookingToObjectOptions

    override fromObject(obj: Partial<Booking>): Booking {
        const toTickets = obj.tickets?.map((ticket: Ticket) => {
            const to: any = {
                ...ticket,
                _movieId: (ticket.movieId ? toObjectId(ticket.movieId) : undefined)
            }
            delete to.movieId
            return to as Ticket
        })
        const to: any = {
            ...super.fromObject(obj),
            _userId: (obj.userId ? toObjectId(obj.userId) : undefined),
            _theatreId: (obj.theatreId ? toObjectId(obj.theatreId) : undefined),
            tickets: toTickets
        }
        delete to.id
        delete to.userId
        delete to.theatreId
        return to as Booking;
    }

    async getAllBookings(): Promise<Booking[]> {
        return (await this.model.find()).map(booking => booking.toObject(this.toObjectOptions));
    }

    async getBookingById(id: string): Promise<Booking | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject(this.toObjectOptions);
    }

    async getBookingsByUserId(userId: string): Promise<Booking[]> {
        return (await this.model.find({_userId: toObjectId(userId)})).map(booking => booking.toObject(this.toObjectOptions));
    }

    async getBookingsByTheatreId(theatreId: string): Promise<Booking[]> {
        return (await this.model.find({_theatreId: toObjectId(theatreId)})).map(booking => booking.toObject(this.toObjectOptions));
    }

    async getBookingsByMovieId(movieId: string): Promise<Booking[]> {
        return (await this.model.find({
            tickets: {
                $elemMatch: {
                    _movieId: toObjectId(movieId)
                }
            }
        })).map(booking => booking.toObject(this.toObjectOptions));
    }

    async getBookingsByQuery(query: BookingsQuery): Promise<Booking[]> {
        const filter = createBookingFilter(query);
        const theatreFilter = filter.theatreFilter
        const movieFilter = filter.movieFilter
        const userFilter = filter.userFilter
        delete filter.theatreFilter
        delete filter.movieFilter
        delete filter.userFilter
        return (await this.model.find(filter.booking)).filter(async booking => {
            return (!theatreFilter || (await this.theatreModel.exists({ _id: booking.theatreId, ...theatreFilter})))
                && (!userFilter || (await this.userModel.exists({ _id: booking.userId, ...userFilter})))
                && (!movieFilter || booking.tickets.filter(
                    async (ticket: Ticket) =>
                        await this.movieModel.exists({ _id: ticket.movieId, ...movieFilter})).length > 0)
        }).map(booking => booking.toObject(this.toObjectOptions) as Booking);
    }

    async addBooking(booking: Omit<Booking, "id">): Promise<Booking> {
        return (await this.model.create(this.fromObject(booking))).toObject(this.toObjectOptions);
    }

    async deleteBookingById(id: string): Promise<Booking | undefined> {
        return (await this.model
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject(this.toObjectOptions);
    }

    async deleteBookingsByQuery(query: BookingsQuery): Promise<number> {
        const filter = createBookingFilter(query);
        return (await this.model.deleteMany(filter)).deletedCount || 0
    }

    async updateBookingById(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined> {
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: this.fromObject(booking)}, {returnDocument: "after"}))?.toObject(this.toObjectOptions)
    }
}

function createBookingFilter(query: BookingsQuery): FilterQuery<Booking> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filterIdField(filter, "_id", query.id)
    }
    if (query.theatre) {
        if (query.theatre.id) {
            filterIdField(filter, "_theatreId", query.theatre.id)
        } else {
            filter.theatreFilter = createTheatreFilter(query.theatre)
        }
    }
    if (query.movie) {
        filter.movieFilter = createMovieFilter(query.movie)
    }
    if (query.user) {
        if (query.user.id) {
            filterIdField(filter, "_userId", query.user.id)
        } else {
            filter.userFilter = createUserFilter(query.user)
        }
    }
    if (query.ticket?.showDate) {
        filter.tickets = {$elemMatch: filterField({}, "showDate", query.ticket.showDate)}
    }
    if (query.ticket?.showTime) {
        filter.tickets = {$elemMatch: filterField({}, "showTime", query.ticket.showTime)}
    }
    return filter
}
