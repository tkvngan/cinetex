import {Booking} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetBookingsByUserId} from "shared/dist/application/usecases/queries";

export function GetBookingsByUserIdInteractor(repositories: Repositories): GetBookingsByUserId {
    return GetBookingsByUserId(async (query: { userId: string }): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByUserId(query.userId);
    })
}

