import {QueryUseCase} from "../UseCase";
import {Schedule} from "../../../domain/entities";

export type GetScheduleById = QueryUseCase<{ id: string }, Schedule | undefined>
