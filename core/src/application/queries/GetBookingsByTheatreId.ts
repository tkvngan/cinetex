import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

declare module "../" {
    interface UseCaseDefinitions {
        readonly GetBookingsByTheatreId: GetBookingsByTheatreId
    }
}

export class GetBookingsByTheatreId extends QueryUseCase<{ theatreId: string }, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{ theatreId: string }, Booking[]>) {
        super(GetBookingsByTheatreId.name, invoker);
    }
}



