import {Booking} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetAllBookings} from "cinetex-core/dist/application/queries";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {UseCase} from "cinetex-core/dist/application";

export class GetAllBookingsInteractor extends GetAllBookings {
    constructor(readonly repositories: Repositories) {
        super();
    }

    override async invoke(query: {}, credentials?: SecurityCredentials): Promise<Booking[]> {
        return await this.repositories.Booking.getAllBookings();
    }
}
