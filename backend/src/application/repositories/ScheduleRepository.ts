import {Schedule} from "@cinetex/shared/domain/entities/Schedule";
import {ScheduleQueryCriteria} from "@cinetex/shared/application/usecases/queries/GetSchedulesByQuery";

export interface ScheduleRepository {
    getAllSchedules(): Promise<Schedule[]>;

    getScheduleById(id: string): Promise<Schedule | undefined>;

    getSchedulesByQuery(criteria: ScheduleQueryCriteria): Promise<Schedule[]>;

    addSchedule(schedule: Schedule): Promise<Schedule>;

    deleteScheduleById(id: string): Promise<Schedule | undefined>;

    deleteSchedulesByQuery(criteria: ScheduleQueryCriteria): Promise<number>;

    updateScheduleById(id: string, show: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined>;
}
