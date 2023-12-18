import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

declare module "../" {
    interface UseCaseDefinitions {
        readonly GetBookingById: GetBookingById
    }
}

export class GetBookingById extends QueryUseCase<{ id: string }, Booking | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Booking | undefined>) {
        super(GetBookingById.name, invoker);
    }
}

type Query = { id: string }


