import {Schedule} from "shared/dist/domain/entities/Schedule";
import {QueryScheduleCriteria} from "shared/dist/application/usecases/queries";

export interface ScheduleRepository {
    getAllSchedules(): Promise<Schedule[]>;

    getScheduleById(id: string): Promise<Schedule | undefined>;

    addSchedule(schedule: Schedule): Promise<Schedule>;

    deleteScheduleById(id: string): Promise<Schedule | undefined>;

    deleteSchedulesByQuery(criteria: QueryScheduleCriteria): Promise<number>;

    updateScheduleById(id: string, show: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined>;

    querySchedules(criteria: QueryScheduleCriteria): Promise<Schedule[]>;

}
