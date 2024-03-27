import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities/Booking";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetBookingsByTheatreId: GetBookingsByTheatreId
    }
}

export class GetBookingsByTheatreId extends QueryUseCase<{ theatreId: string }, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{ theatreId: string }, Booking[]>) {
        super("GetBookingsByTheatreId", invoker);
    }
}



