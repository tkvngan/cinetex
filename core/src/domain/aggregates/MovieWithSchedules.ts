import {Movie} from "../entities/Movie";
import {Schedule} from "../entities/Schedule";
import {Theatre} from "../entities/Theatre";

export type MovieWithSchedules = Movie & Readonly<{
    schedules: readonly (Schedule & Readonly<{
        theatre: Theatre
    }>)[]
}>
