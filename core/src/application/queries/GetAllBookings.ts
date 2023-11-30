import {QueryUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetAllBookings extends QueryUseCase<{}, Booking[]> {
    constructor(invokerFactory?: UseCaseInvokerFactory<{}, Booking[]>) {
        super("GetAllBookings", invokerFactory);
    }
}
