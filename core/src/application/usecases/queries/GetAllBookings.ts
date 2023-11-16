import {QueryUseCase} from "../UseCase";
import {Booking} from "../../../domain/entities";

export type GetAllBookings = QueryUseCase<{}, Booking[]>

export function GetAllBookings(invoke: (query: {}) => Promise<Booking[]>): GetAllBookings {
    return { name: "GetAllBookings", type: "query", invoke }
}
