import {QueryUseCase} from "../UseCase";
import {Id} from "../../../domain/types/Entity";
import {Theatre} from "../../../domain/entities/Theatre";

export type GetTheatreById = QueryUseCase<{theatreId: Id}, Theatre | undefined>;

