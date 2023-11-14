import {Booking} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetBookingById} from "shared/dist/application/usecases/queries";

export function GetBookingByIdInteractor(repositories: Repositories): GetBookingById {
    return GetBookingById(async (query: { id: string }): Promise<Booking | undefined>  => {
        return await repositories.Booking.getBookingById(query.id);
    })
}

