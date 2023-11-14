import {QueryRange} from "./QueryCriteria";
import {Booking, Genre, Rating, ShowTime} from "../../../domain/entities";
import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {QueryCriteria} from "./QueryCriteria";

export type QueryBookingCriteria = QueryCriteria & {
    userId?: string;
    theatreId?: string;
    movieId?: string;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type QueryBookings = QueryUseCase<{ criteria: QueryBookingCriteria }, Booking[]>

export function QueryBookings(invoke: (query: { criteria: QueryBookingCriteria }) => Promise<Booking[]>): QueryBookings {
    return { name: "GetBookingsByQuery", type: "query", invoke }
}


