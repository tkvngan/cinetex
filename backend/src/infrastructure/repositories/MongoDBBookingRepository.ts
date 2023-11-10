import {BookingRepository} from "../../application/repositories/BookingRepository";
import {FilterQuery, Model} from "mongoose";
import {toObjectId, toRangeFilter} from "./MongoDBUtils";

import {Booking} from "@cinetex/shared/domain/entities/Booking";
import {BookingQueryCriteria} from "@cinetex/shared/application/usecases/queries/GetBookingsByQuery";

function createBookingFilter(criteria: BookingQueryCriteria): FilterQuery<Booking> {
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

export class MongoDBBookingRepository implements BookingRepository {

    constructor(readonly model: Model<Booking>) {
    }

    async getAllBookings(): Promise<Booking[]> {
        return (await this.model.find()).map(booking => booking.toObject());
    }

    async getBookingById(id: string): Promise<Booking | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject();
    }

    async getBookingsByUserId(userId: string): Promise<Booking[]> {
        return (await this.model.find({userId: toObjectId(userId)})).map(booking => booking.toObject());
    }

    async getBookingsByTheatreId(theatreId: string): Promise<Booking[]> {
        return (await this.model.find({theatreId: toObjectId(theatreId)})).map(booking => booking.toObject());
    }

    async getBookingsByMovieId(movieId: string): Promise<Booking[]> {
        return (await this.model.find({movieId: toObjectId(movieId)})).map(booking => booking.toObject());
    }

    async getBookingsByQuery(criteria: BookingQueryCriteria): Promise<Booking[]> {
        const filter = createBookingFilter(criteria);
        return (await this.model.find(filter)).map(booking => booking.toObject());
    }

    async addBooking(booking: Booking): Promise<Booking> {
        return (await this.model.create(booking)).toObject();
    }

    async deleteBookingById(id: string): Promise<Booking | undefined> {
        return (await this.model
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteBookingsByQuery(criteria: BookingQueryCriteria): Promise<number> {
        const filter= createBookingFilter(criteria);
        return (await this.model.deleteMany(filter)).deletedCount || 0
    }

    async updateBookingById(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined> {
        delete (booking as any).id
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: booking}, {returnDocument: "after"}))?.toObject()
    }
}
