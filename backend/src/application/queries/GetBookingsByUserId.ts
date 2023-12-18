import {Booking} from "cinetex-core/dist/domain/entities";
import {Repositories} from "../repositories";
import {GetBookingsByUserId} from "cinetex-core/dist/application/queries";
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {
    AuthenticationRequiredException,
    UnauthorizedException
} from "cinetex-core/dist/application/exceptions/Exceptions";

export class GetBookingsByUserIdInteractor extends GetBookingsByUserId {
    constructor(readonly repositories: Repositories) {
        super()
    }

    override async invoke(query: { userId: string }, credentials?: Credentials): Promise<Booking[]> {
        if (!credentials) {
            throw new AuthenticationRequiredException()
        }
        const roles = credentials.user.roles;
        if (roles.includes("admin") || roles.includes("user") && credentials.user.id === query.userId) {
            return await this.repositories.Booking.getBookingsByUserId(query.userId);
        }
        throw new UnauthorizedException()
    }
}
