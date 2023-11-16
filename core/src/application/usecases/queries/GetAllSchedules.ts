import {QueryUseCase} from "../UseCase";
import {Schedule} from "../../../domain/entities";

export type GetAllSchedules = QueryUseCase<{}, Schedule[]>

export function GetAllSchedules(invoke: (query: {}) => Promise<Schedule[]>): GetAllSchedules {
    return { name: "GetAllSchedules", type: "query", invoke }
}


