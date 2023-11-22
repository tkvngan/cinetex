import {QueryRange} from "./QueryCriteria";
import {Booking} from "../../domain/entities";
import {QueryUseCase} from "../UseCase";
import {UsersQuery} from "./GetUsersByQuery";
import {TheatresQuery} from "./GetTheatresByQuery";
import {MoviesQuery} from "./GetMoviesByQuery";

export type BookingsQuery = {
    id: string | [string];
    user?: never;
    theatre?: never;
    movie?: never;
    showDate?: never;
    showTime?: never;
} | {
    id?: never;
    user?: UsersQuery;
    theatre?: TheatresQuery;
    movie?: MoviesQuery;
    showDate?: string | [string] | QueryRange<string>;
    showTime?: string | [string] | QueryRange<string>
}

export type GetBookingsByQuery = QueryUseCase<BookingsQuery, Booking[]>

export function GetBookingsByQuery(invoke: (query: BookingsQuery) => Promise<Booking[]>): GetBookingsByQuery {
    return { name: "GetBookingsByQuery", type: "query", invoke }
}


