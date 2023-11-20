import {QueryUseCase} from "../UseCase";
import {Booking} from "../../domain/entities";

export type GetBookingsByTheatreId = QueryUseCase<{ theatreId: string }, Booking[]>

export function GetBookingsByTheatreId(invoke: (query: { theatreId: string }) => Promise<Booking[]>): GetBookingsByTheatreId {
    return { name: "GetBookingsByTheatreId", type: "query", invoke }
}


