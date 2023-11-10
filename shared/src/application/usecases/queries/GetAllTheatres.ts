import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities";

export type GetAllTheatres = QueryUseCase<{}, Theatre[]>
