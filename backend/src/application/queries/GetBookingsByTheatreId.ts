import {Booking} from "cinetex-core/dist/domain/entities/Booking";
import {Repositories} from "../repositories/Repositories";
import {GetBookingsByTheatreId} from "cinetex-core/dist/application/queries";

export class GetBookingsByTheatreIdInteractor extends GetBookingsByTheatreId {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { theatreId: string }): Promise<Booking[]> {
        return await this.repositories.Booking.getBookingsByTheatreId(query.theatreId);
    }
}
