import {QueryRange} from "./QueryCriteria";
import {Booking, Genre, Rating, ShowTime} from "../../../domain/entities";
import {QueryUseCase} from "../UseCase";
import {QueryCriteria} from "./QueryCriteria";

export type BookingQueryCriteria = QueryCriteria & {
    userId?: string;
    theatreId?: string;
    movieId?: string;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type GetBookingsByQuery = QueryUseCase<{ criteria: BookingQueryCriteria }, Booking[]>
