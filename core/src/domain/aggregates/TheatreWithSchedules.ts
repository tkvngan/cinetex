import {Movie, Schedule, Theatre} from "../entities";

export type TheatreWithSchedules = Theatre & Readonly<{
    schedules: readonly (Schedule & Readonly<{
        movie: Movie
    }>)[]
}>
