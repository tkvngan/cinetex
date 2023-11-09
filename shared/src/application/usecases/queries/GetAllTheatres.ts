import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities/Theatre";

export type GetAllTheatres = QueryUseCase<{}, readonly Theatre[]>;
