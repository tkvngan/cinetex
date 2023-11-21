import {BookingRepository} from "../../application/repositories";
import {FilterQuery, Model, SchemaDefinition, Types} from "mongoose";
import {toObjectId, asFieldFilter, asIdFieldFilter,} from "./MongoDBUtils";
import {Booking, Movie, Schedule, Theatre, User} from "core/dist/domain/entities";
import {BookingsQuery, MoviesQuery, TheatresQuery} from "core/dist/application/queries";
import {TODO} from "core/dist/utils";
import {createTheatreFilter} from "./MongoDBTheatreRepository";
import {createMovieFilter} from "./MongoDBMovieRepository";
import {createUserFilter} from "./MongoDBUserRepository";

const SeatPositionDefinition: SchemaDefinition = {
    row: {type: Number, required: true},
    column: {type: Number, required: true}
}

const TicketDefinition: SchemaDefinition = {
    screenId: {type: Number, required: true},
    showDate: {type: String, required: true},
    showTime: {type: String, required: true},
    seat: {type: SeatPositionDefinition, required: true},
    price: {type: Number, required: true}
}

export const BookingSchemaDefinition: SchemaDefinition = {
    userId: {type: Types.ObjectId, required: true},
    theatreId: {type: Types.ObjectId, required: true},
    bookingTime: {type: String, required: true},
    totalPrice: {type: Number, required: true},
    tickets: {type: [TicketDefinition], required: true}
}

function createBookingFilter(query: BookingsQuery): FilterQuery<Booking> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filter._id = asIdFieldFilter(query.id)
        return filter
    }
    if (query.theatre) {
        if (query.theatre.id) {
            filter.theatreId = asIdFieldFilter(query.theatre.id)
        } else {
            filter.theatreFilter = createTheatreFilter(query.theatre)
        }
    }
    if (query.movie) {
        if (query.movie.id) {
            filter.movieId = asIdFieldFilter(query.movie.id)
        } else {
            filter.movieFilter = createMovieFilter(query.movie)
        }
    }
    if (query.user) {
        if (query.user.id) {
            filter.userId = asIdFieldFilter(query.user.id)
        } else {
            filter.userFilter = createUserFilter(query.user)
        }
    }
    if (query.showDate) {
        filter.tickets = {$elemMatch: {showDate: asFieldFilter(query.showDate)}}
    }
    if (query.showTime) {
        filter.tickets = {$elemMatch: {showTime: asFieldFilter(query.showTime)}}
    }
    return filter
}

export function MongoDBBookingRepository(model: Model<Booking>, theatreModel: Model<Theatre>, movieModel: Model<Movie>, userModel: Model<User>): BookingRepository {
    return {
        async getAllBookings(): Promise<Booking[]> {
            return (await model.find()).map(booking => booking.toObject());
        },

        async getBookingById(id: string): Promise<Booking | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject();
        },

        async getBookingsByUserId(userId: string): Promise<Booking[]> {
            return (await model.find({userId: toObjectId(userId)})).map(booking => booking.toObject());
        },

        async getBookingsByTheatreId(theatreId: string): Promise<Booking[]> {
            return (await model.find({theatreId: toObjectId(theatreId)})).map(booking => booking.toObject());
        },

        async getBookingsByMovieId(movieId: string): Promise<Booking[]> {
            return (await model.find({movieId: toObjectId(movieId)})).map(booking => booking.toObject());
        },

        async getBookingsByQuery(query: BookingsQuery): Promise<Booking[]> {
            const filter = createBookingFilter(query);
            const theatreFilter = filter.theatreFilter
            const movieFilter = filter.movieFilter
            const userFilter = filter.userFilter
            delete filter.theatreFilter
            delete filter.movieFilter
            delete filter.userFilter
            return (await model.find(filter.booking)).filter(async booking => {
                return (!theatreFilter || (await theatreModel.exists({ _id: booking.theatreId, ...theatreFilter})))
                    && (!userFilter || (await userModel.exists({ _id: booking.userId, ...userFilter})))
                    && (!movieFilter || booking.tickets.filter(
                        async ticket =>
                            await movieModel.exists({ _id: ticket.movieId, ...movieFilter})).length > 0)
            });
        },

        async addBooking(booking: Booking): Promise<Booking> {
            return (await model.create(booking)).toObject();
        },

        async deleteBookingById(id: string): Promise<Booking | undefined> {
            return (await model
                .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
        },

        async deleteBookingsByQuery(query: BookingsQuery): Promise<number> {
            const filter = createBookingFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateBookingById(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined> {
            delete (booking as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: booking}, {returnDocument: "after"}))?.toObject()
        }
    }

}
