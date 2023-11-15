import {QueryBookings,} from "core/dist/application/usecases/queries";
import {Booking} from "core/dist/domain/entities";
import {Repositories} from "../../repositories";
import {QueryBookingCriteria} from "core/dist/application/usecases/queries/QueryBookings";

export function QueryBookingsInteractor(repositories: Repositories): QueryBookings {
    return QueryBookings(async (query: { criteria: QueryBookingCriteria }): Promise<Booking[]>  => {
        return await repositories.Booking.queryBookings(query.criteria);
    })
}

