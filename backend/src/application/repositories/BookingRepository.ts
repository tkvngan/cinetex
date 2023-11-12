import {Booking} from "shared/dist/domain/entities/Booking";
import {BookingQueryCriteria} from "shared/dist/application/usecases/queries/GetBookingsByQuery";

export interface BookingRepository {

    getAllBookings(): Promise<Booking[]>;

    getBookingById(id: string): Promise<Booking | undefined>;

    getBookingsByUserId(userId: string): Promise<Booking[]>;

    getBookingsByTheatreId(theatreId: string): Promise<Booking[]>;

    getBookingsByMovieId(movieId: string): Promise<Booking[]>;

    getBookingsByQuery(criteria: BookingQueryCriteria): Promise<Booking[]>;

    addBooking(booking: Booking): Promise<Booking>;

    deleteBookingById(id: string): Promise<Booking | undefined>;

    deleteBookingsByQuery(criteria: BookingQueryCriteria): Promise<number>;

    updateBookingById(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined>;
}
