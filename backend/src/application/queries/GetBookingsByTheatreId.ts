import {Booking} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetBookingsByTheatreId} from "core/dist/application/queries";

export function GetBookingsByTheatreIdInteractor(repositories: Repositories): GetBookingsByTheatreId {
    return GetBookingsByTheatreId(async (query: { theatreId: string }): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByTheatreId(query.theatreId);
    })
}

