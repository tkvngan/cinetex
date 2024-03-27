import {ByRange} from "./QueryCriteria";
import {Booking} from "../../domain/entities/Booking";
import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {UsersQuery} from "./GetUsersByQuery";
import {TheatresQuery} from "./GetTheatresByQuery";
import {MoviesQuery} from "./GetMoviesByQuery";

export type BookingsQuery = {
    id?: string | string[];
    user?: UsersQuery;
    theatre?: TheatresQuery;
    movie?: MoviesQuery;
    bookingTime?: string | string[] | ByRange<string>;
    ticket?: {
        screenId: number | number[];
        showDate: string | string[] | ByRange<string>;
        showTime: string | string[] | ByRange<string>;
        row: string | string[];
        column: string | string[];
    }
}

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetBookingsByQuery: GetBookingsByQuery
    }
}

export class GetBookingsByQuery extends QueryUseCase<BookingsQuery, Booking[]> {
    constructor(invoker?: UseCaseInvoker<BookingsQuery, Booking[]>) {
        super("GetBookingsByQuery", invoker);
    }
}



