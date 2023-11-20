import {QueryCriteria, QueryRange} from "./QueryCriteria";
import {Booking, ShowTime} from "../../../domain/entities";
import {QueryUseCase} from "../UseCase";

export type QueryBookingsCriteria = QueryCriteria & {
    userId?: string;
    theatreId?: string;
    movieId?: string;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export type QueryBookings = QueryUseCase<{ criteria: QueryBookingsCriteria }, Booking[]>

export function QueryBookings(invoke: (query: { criteria: QueryBookingsCriteria }) => Promise<Booking[]>): QueryBookings {
    return { name: "GetBookingsByQuery", type: "query", invoke }
}


