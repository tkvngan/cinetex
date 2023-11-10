import {QueryUseCase} from "../UseCase";
import {Movie} from "../../../domain/entities";

export type GetAllMovies = QueryUseCase<{}, Movie[]>
