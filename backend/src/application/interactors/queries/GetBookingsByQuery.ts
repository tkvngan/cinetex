import {
    GetBookingsByQuery,
    QueryCriteria,
    QueryRange
} from "shared/dist/application/usecases/queries";
import {Booking, ShowTime} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";

export type BookingQueryCriteria = QueryCriteria & {
    userId?: string;
    theatreId?: string;
    movieId?: string;
    showDate?: string | QueryRange<string>;
    showTime?: ShowTime[];
}

export function GetBookingsByQueryInteractor(repositories: Repositories): GetBookingsByQuery {
    return GetBookingsByQuery(async (query: { criteria: BookingQueryCriteria }): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByQuery(query.criteria);
    })
}


