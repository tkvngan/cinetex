import {Booking} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetBookingsByTheatreId} from "shared/dist/application/usecases/queries";

export function GetBookingsByTheatreIdInteractor(repositories: Repositories): GetBookingsByTheatreId {
    return GetBookingsByTheatreId(async (query: { theatreId: string }): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByTheatreId(query.theatreId);
    })
}


