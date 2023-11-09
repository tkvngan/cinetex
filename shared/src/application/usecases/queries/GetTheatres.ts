import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities/Theatre";

export type GetAllTheatres = QueryUseCase<{
    name?: string;
    city?: string;
    state?: string;
}, readonly Theatre[]>;
