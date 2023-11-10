import {QueryUseCase} from "../UseCase";
import {Schedule} from "../../../domain/entities";

export type GetAllSchedules = QueryUseCase<{}, Schedule[]>
