import {Booking} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetBookingsByUserId} from "core/dist/application/queries";

export function GetBookingsByUserIdInteractor(repositories: Repositories): GetBookingsByUserId {
    return GetBookingsByUserId(async (query: { userId: string }): Promise<Booking[]>  => {
        return await repositories.Booking.getBookingsByUserId(query.userId);
    })
}

