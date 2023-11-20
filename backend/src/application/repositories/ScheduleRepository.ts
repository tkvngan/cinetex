import {Schedule} from "core/dist/domain/entities/Schedule";
import {QuerySchedulesCriteria} from "core/dist/application/usecases/queries";

export interface ScheduleRepository {
    getAllSchedules(): Promise<Schedule[]>;

    getScheduleById(id: string): Promise<Schedule | undefined>;

    addSchedule(schedule: Schedule): Promise<Schedule>;

    deleteScheduleById(id: string): Promise<Schedule | undefined>;

    deleteSchedulesByQuery(criteria: QuerySchedulesCriteria): Promise<number>;

    updateScheduleById(id: string, show: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined>;

    querySchedules(criteria: QuerySchedulesCriteria): Promise<Schedule[]>;

}
