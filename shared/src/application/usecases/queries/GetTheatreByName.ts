import {QueryUseCase} from "../UseCase";
import {Theatre} from "../../../domain/entities/Theatre";

export type GetTheatreByName = QueryUseCase<{ theatreName: string }, Theatre | undefined>;
