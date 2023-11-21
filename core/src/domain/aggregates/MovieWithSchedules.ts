import {Movie, Schedule, Theatre} from "../entities";

export type MovieWithSchedules = Movie & Readonly<{
    schedules: readonly (Schedule & Readonly<{
        theatre: Theatre
    }>)[]
}>
