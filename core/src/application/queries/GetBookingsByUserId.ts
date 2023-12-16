import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

declare module "../UseCaseDefinitions" {
    export interface UseCaseDefinitions {
        readonly GetBookingsByUserId: GetBookingsByUserId
    }
}

export class GetBookingsByUserId extends QueryUseCase<{ userId: string }, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{ userId: string }, Booking[]>) {
        super(GetBookingsByUserId.name, invoker);
    }
}



