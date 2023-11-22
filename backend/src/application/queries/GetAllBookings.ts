import {Booking} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllBookings} from "cinetex-core/dist/application/queries";

export function GetAllBookingsInteractor(repositories: Repositories): GetAllBookings {
    return GetAllBookings(async (query: {}): Promise<Booking[]>   => {
        return await repositories.Booking.getAllBookings();
    })
}
