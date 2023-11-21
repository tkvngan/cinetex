import {GetBookingsByQuery,} from "core/dist/application/queries";
import {Booking} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {BookingsQuery} from "core/dist/application/queries/GetBookingsByQuery";

export function GetBookingsByQueryInteractor(repositories: Repositories): GetBookingsByQuery {
    return GetBookingsByQuery(async (query: BookingsQuery): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByQuery(query);
    })
}

