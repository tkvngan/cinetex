import {Booking} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetBookingById} from "cinetex-core/dist/application/queries";

export class GetBookingByIdInteractor extends GetBookingById {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { id: string }): Promise<Booking | undefined> {
        return await this.repositories.Booking.getBookingById(query.id);
    }
}
