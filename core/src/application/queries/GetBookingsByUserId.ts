import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities/Booking";

declare module "../index" {
     export interface UseCaseDefinitions {
        readonly GetBookingsByUserId: GetBookingsByUserId
    }
}

export class GetBookingsByUserId extends QueryUseCase<{ userId: string }, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{ userId: string }, Booking[]>) {
        super("GetBookingsByUserId", invoker);
    }
}



