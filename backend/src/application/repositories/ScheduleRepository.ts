import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {SchedulesQuery} from "cinetex-core/dist/application/queries";

export interface ScheduleRepository {
    getAllSchedules(): Promise<Schedule[]>;

    getScheduleById(id: string): Promise<Schedule | undefined>;

    addSchedule(schedule: Schedule): Promise<Schedule>;

    deleteScheduleById(id: string): Promise<Schedule | undefined>;

    deleteSchedulesByQuery(query: SchedulesQuery): Promise<number>;

    updateScheduleById(id: string, show: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined>;

    getSchedulesByQuery(query: SchedulesQuery): Promise<Schedule[]>;

}
