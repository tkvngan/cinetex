import {Movie} from "../entities/Movie";
import {Schedule} from "../entities/Schedule";
import {Theatre} from "../entities/Theatre";

export type TheatreWithSchedules = Theatre & Readonly<{
    schedules: readonly (Schedule & Readonly<{
        movie: Movie
    }>)[]
}>
