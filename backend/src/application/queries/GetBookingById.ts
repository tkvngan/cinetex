import {Booking} from "core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetBookingById} from "core/dist/application/queries";

export function GetBookingByIdInteractor(repositories: Repositories): GetBookingById {
    return GetBookingById(async (query: { id: string }): Promise<Booking | undefined>  => {
        return await repositories.Booking.getBookingById(query.id);
    })
}

