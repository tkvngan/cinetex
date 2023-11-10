import {Range} from "./Repository";
import {Booking} from "@cinetex/shared/domain/entities/Booking";
import {ShowTime} from "@cinetex/shared/domain/entities/Schedule";

export type BookingSearchCriteria = {
    userId?: string;
    theatreId?: string;
    movieId?: string;
    showDate?: string | Range<string>;
    showTime?: ShowTime[];
}

export interface BookingRepository {

    getAllBookings(): Promise<Booking[]>;

    getBooking(id: string): Promise<Booking | undefined>;

    getBookingsByUserId(userId: string): Promise<Booking[]>;

    getBookingsByTheatreId(theatreId: string): Promise<Booking[]>;

    getBookingsByMovieId(movieId: string): Promise<Booking[]>;

    getBookings(criteria: BookingSearchCriteria): Promise<Booking[]>;

    addBooking(booking: Booking): Promise<Booking>;

    deleteBooking(id: string): Promise<Booking | undefined>;

    deleteBookings(criteria: BookingSearchCriteria): Promise<number>;

    updateBooking(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined>;
}
