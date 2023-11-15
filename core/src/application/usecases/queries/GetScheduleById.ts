import {QueryUseCase, UseCaseProperties} from "../UseCase";
import {Schedule} from "../../../domain/entities";

export type GetScheduleById = QueryUseCase<{ id: string }, Schedule | undefined>

export function GetScheduleById(invoke: (query: { id: string }) => Promise<Schedule | undefined>): GetScheduleById {
    return { name: "GetScheduleById", type: "query", invoke }
}


