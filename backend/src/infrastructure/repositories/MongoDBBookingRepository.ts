import {BookingRepository} from "../../application/repositories";
import {FilterQuery, Model, SchemaDefinition, Types} from "mongoose";
import {toObjectId, toRangeFilter} from "./MongoDBUtils";
import {Booking} from "core/dist/domain/entities";
import {BookingsQuery} from "core/dist/application/queries";

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

export function MongoDBBookingRepository(model: Model<Booking>): BookingRepository {
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

        async queryBookings(criteria: BookingsQuery): Promise<Booking[]> {
            const filter = createBookingFilter(criteria);
            return (await model.find(filter)).map(booking => booking.toObject());
        },

        async addBooking(booking: Booking): Promise<Booking> {
            return (await model.create(booking)).toObject();
        },

        async deleteBookingById(id: string): Promise<Booking | undefined> {
            return (await model
                .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
        },

        async deleteBookingsByQuery(criteria: BookingsQuery): Promise<number> {
            const filter = createBookingFilter(criteria);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateBookingById(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined> {
            delete (booking as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: booking}, {returnDocument: "after"}))?.toObject()
        }
    }

    function createBookingFilter(criteria: BookingsQuery): FilterQuery<Booking> {
        const filter: FilterQuery<any> = {}
        if (criteria.userId) {
            filter.userId = toObjectId(criteria.userId)
        }
        if (criteria.theatreId) {
            filter.theatreId = toObjectId(criteria.theatreId)
        }
        if (criteria.movieId) {
            filter.movieId = toObjectId(criteria.movieId)
        }
        if (criteria.showDate) {
            filter.showDate = toRangeFilter(criteria.showDate)
        }
        if (criteria.showTime) {
            filter.showTime = { $all: criteria.showTime }
        }
        return filter as FilterQuery<Booking>
    }
}
