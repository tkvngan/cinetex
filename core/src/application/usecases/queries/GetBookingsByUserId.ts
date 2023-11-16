import {QueryUseCase} from "../UseCase";
import {Booking} from "../../../domain/entities";

export type GetBookingsByUserId = QueryUseCase<{ userId: string }, Booking[]>

export function GetBookingsByUserId(invoke: (query: { userId: string }) => Promise<Booking[]>): GetBookingsByUserId {
    return { name: "GetBookingsByUserId", type: "query", invoke }
}


