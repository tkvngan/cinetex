import {ByRange} from "./QueryCriteria";
import {Booking} from "../../domain/entities";
import {QueryUseCase, UseCaseInvoker} from "../UseCase";
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
    showDate?: string | [string] | ByRange<string>;
    showTime?: string | [string] | ByRange<string>
}

export class GetBookingsByQuery extends QueryUseCase<BookingsQuery, Booking[]> {
    constructor(invoker?: UseCaseInvoker<BookingsQuery, Booking[]>) {
        super(GetBookingsByQuery.name, invoker);
    }
}



