import {CommandUseCase, UseCaseInvoker} from "../UseCase";
import {Booking} from "../../domain/entities";


export class CreateBooking extends CommandUseCase<Omit<Booking, "id">> {
    constructor(invoker?: UseCaseInvoker<Omit<Booking, "id">, void>) {
        super("CreateBooking", invoker);
    }
}
