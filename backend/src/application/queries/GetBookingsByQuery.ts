import {GetBookingsByQuery,} from "cinetex-core/dist/application/queries";
import {Booking} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {BookingsQuery} from "cinetex-core/dist/application/queries/GetBookingsByQuery";

export function GetBookingsByQueryInteractor(repositories: Repositories): GetBookingsByQuery {
    return GetBookingsByQuery(async (query: BookingsQuery): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByQuery(query);
    })
}

