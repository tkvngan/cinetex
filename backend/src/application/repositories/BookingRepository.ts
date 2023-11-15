import {Booking} from "core/dist/domain/entities/Booking";
import {QueryBookingCriteria} from "core/dist/application/usecases/queries";

export interface BookingRepository {

    getAllBookings(): Promise<Booking[]>;

    getBookingById(id: string): Promise<Booking | undefined>;

    getBookingsByUserId(userId: string): Promise<Booking[]>;

    getBookingsByTheatreId(theatreId: string): Promise<Booking[]>;

    getBookingsByMovieId(movieId: string): Promise<Booking[]>;

    addBooking(booking: Booking): Promise<Booking>;

    deleteBookingById(id: string): Promise<Booking | undefined>;

    deleteBookingsByQuery(criteria: QueryBookingCriteria): Promise<number>;

    updateBookingById(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined>;

    queryBookings(criteria: QueryBookingCriteria): Promise<Booking[]>;

}
