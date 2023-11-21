import {Booking} from "core/dist/domain/entities/Booking";
import {BookingsQuery} from "core/dist/application/queries";

export interface BookingRepository {

    getAllBookings(): Promise<Booking[]>;

    getBookingById(id: string): Promise<Booking | undefined>;

    getBookingsByUserId(userId: string): Promise<Booking[]>;

    getBookingsByTheatreId(theatreId: string): Promise<Booking[]>;

    getBookingsByMovieId(movieId: string): Promise<Booking[]>;

    addBooking(booking: Booking): Promise<Booking>;

    deleteBookingById(id: string): Promise<Booking | undefined>;

    deleteBookingsByQuery(query: BookingsQuery): Promise<number>;

    updateBookingById(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined>;

    getBookingsByQuery(query: BookingsQuery): Promise<Booking[]>;

}
