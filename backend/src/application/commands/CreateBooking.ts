import {Booking} from "cinetex-core/dist/domain/entities/Booking";
import {CreateBooking} from "cinetex-core/dist/application/commands";
import {Repositories} from "../repositories/Repositories";
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {UnauthorizedException} from "cinetex-core/dist/application/exceptions/Exceptions";


export class CreateBookingInteractor extends CreateBooking {
    constructor(readonly repositories: Repositories) {
        super();
    }

    override async invoke(input: Omit<Booking, "id">, credentials?: Credentials): Promise<void> {
        if (credentials && credentials.user.roles.includes("user") && input.userId === credentials.user.id) {
            // need to check if other bookings exist for the same movie, seat and time
            await this.repositories.Booking.addBooking(input);
        } else {
            throw new UnauthorizedException("A user needs to be authenticated in to create a booking")
        }
    }
}
