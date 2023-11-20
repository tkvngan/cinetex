import {QueryUseCase} from "../UseCase";
import {Booking} from "../../domain/entities";

export type GetBookingById = QueryUseCase<{ id: string }, Booking | undefined>

type Query = { id: string }
export function GetBookingById(invoke: (query: { id: string }) => Promise<Booking | undefined>): GetBookingById {
    return { name: "GetBookingById", type: "query", invoke }
}


