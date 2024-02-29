import {Booking} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories/Repositories";
import {GetAllBookings} from "cinetex-core/dist/application/queries";
import {Credentials} from "cinetex-core/dist/security/Credentials";

export class GetAllBookingsInteractor extends GetAllBookings {
    constructor(readonly repositories: Repositories) {
        super();
    }

    override async invoke(query: {}, credentials?: Credentials): Promise<Booking[]> {
        return await this.repositories.Booking.getAllBookings();
    }
}
