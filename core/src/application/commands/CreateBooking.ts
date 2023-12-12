import {CommandUseCase, UseCaseInvokerFactory} from "../UseCase";
import {Booking} from "../../domain/entities";


export class CreateBooking extends CommandUseCase<Omit<Booking, "id">> {
    constructor(invokerFactory?: UseCaseInvokerFactory<Omit<Booking, "id">, void>) {
        super("CreateBooking", invokerFactory);
    }
}
