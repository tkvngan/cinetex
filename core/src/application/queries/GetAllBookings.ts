import {QueryUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";

export class GetAllBookings extends QueryUseCase<{}, Booking[]> {
    constructor(invoker?: UseCaseInvoker<{}, Booking[]>) {
        super("GetAllBookings", invoker);
    }
}
