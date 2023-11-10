import {Pattern, Range} from "./Repository";
import {Schedule, ShowTime} from "@cinetex/shared/domain/entities/Schedule";

export type ScheduleSearchCriteria = {
    theatreId?: string;
    movieId?: string;
    movieName?: string | Pattern;
    screenId?: number;
    showDate?: string | Range<string>;
    showTime?: ShowTime[];
}

export interface ScheduleRepository {
    getAllSchedules(): Promise<Schedule[]>;

    getSchedule(id: string): Promise<Schedule | undefined>;

    getSchedules(criteria: ScheduleSearchCriteria): Promise<Schedule[]>;

    addSchedule(schedule: Schedule): Promise<Schedule>;

    deleteSchedule(id: string): Promise<Schedule | undefined>;

    deleteSchedules(criteria: ScheduleSearchCriteria): Promise<number>;

    updateSchedule(id: string, show: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined>;
}
