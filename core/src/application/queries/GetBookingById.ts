import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetBookingById extends QueryUseCase<{ id: string }, Booking | undefined> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{ id: string }, Booking | undefined>) {
        super("GetBookingById", invokerFactory);
    }
}

type Query = { id: string }


