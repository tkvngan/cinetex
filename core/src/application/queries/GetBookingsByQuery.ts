import {QueryCriteria, QueryRange} from "./QueryCriteria";
import {Booking, ShowTime} from "../../domain/entities";
import {QueryUseCase} from "../UseCase";

export type BookingsQuery = QueryCriteria & {
    userId?: string;
    theatreId?: string;
    movieId?: string;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type GetBookingsByQuery = QueryUseCase<BookingsQuery, Booking[]>

export function GetBookingsByQuery(invoke: (query: BookingsQuery) => Promise<Booking[]>): GetBookingsByQuery {
    return { name: "GetBookingsByQuery", type: "query", invoke }
}


