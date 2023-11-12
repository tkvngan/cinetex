import {Booking} from "shared/dist/domain/entities";
import {Repositories} from "../../repositories";
import {GetAllBookings} from "shared/dist/application/usecases/queries";

export function GetAllBookingsInteractor(repositories: Repositories): GetAllBookings {
    return GetAllBookings(async (query: {}): Promise<Booking[]>   => {
        return await repositories.Booking.getAllBookings();
    })
}
