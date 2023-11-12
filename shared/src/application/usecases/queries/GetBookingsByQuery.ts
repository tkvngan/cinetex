import {QueryRange} from "./QueryCriteria";
import {Booking, Genre, Rating, ShowTime} from "../../../domain/entities";
import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {QueryCriteria} from "./QueryCriteria";

export type BookingQueryCriteria = QueryCriteria & {
    userId?: string;
    theatreId?: string;
    movieId?: string;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type GetBookingsByQuery = QueryUseCase<{ criteria: BookingQueryCriteria }, Booking[]>

export function GetBookingsByQuery(invoke: (query: { criteria: BookingQueryCriteria }) => Promise<Booking[]>): GetBookingsByQuery {
    return { name: "GetBookingsByQuery", type: "query", invoke }
}


