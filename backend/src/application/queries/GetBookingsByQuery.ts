import {GetBookingsByQuery,} from "cinetex-core/dist/application/queries";
import {Booking} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories/Repositories";
import {BookingsQuery} from "cinetex-core/dist/application/queries/GetBookingsByQuery";

export class GetBookingsByQueryInteractor extends GetBookingsByQuery {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: BookingsQuery): Promise<Booking[]> {
        return await this.repositories.Booking.getBookingsByQuery(query);
    }
}
