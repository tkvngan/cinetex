import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetBookingById extends QueryUseCase<{ id: string }, Booking | undefined> {
    constructor(invoker?: UseCaseInvoker<{ id: string }, Booking | undefined>) {
        super("GetBookingById", invoker);
    }
}

type Query = { id: string }


