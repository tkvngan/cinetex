import {ScheduleRepository} from "../../application/repositories";
import {asArrayFieldFilter, asFieldFilter, asIdFieldFilter, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition, Types} from "mongoose";
import {Movie, Schedule, Theatre} from "cinetex-core/dist/domain/entities";
import {SchedulesQuery} from "cinetex-core/dist/application/queries";
import {TODO} from "cinetex-core/dist/utils";
import {createMovieFilter} from "./MongoDBMovieRepository";
import {createTheatreFilter} from "./MongoDBTheatreRepository";

export const TimeSlotSchemaDefinition = {
    date: {type: String, required: true},
    times: {type: [String], required: true}
}

export const ScheduleSchemaDefinition: SchemaDefinition = {
    movieId: {type: Types.ObjectId, required: true},
    theatreId: {type: Types.ObjectId, required: true},
    screenId: {type: Number, required: true},
    showTimes: {type: [TimeSlotSchemaDefinition], required: true}
}

export function MongoDBScheduleRepository(model: Model<Schedule>, movieModel: Model<Movie>, theatreModel: Model<Theatre>): ScheduleRepository {
    return {
        async getAllSchedules(): Promise<any[]> {
            return (await model.find()).map(schedule => schedule.toObject());
        },

        async getScheduleById(id: string): Promise<any | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject();
        },

        async getSchedulesByQuery(query: SchedulesQuery): Promise<Schedule[]> {
            const filter = createScheduleFilter(query);
            const movieFilter = filter.movieFilter
            const theatreFilter = filter.theatreFilter
            delete filter.movieFilter
            delete filter.theatreFilter
            return (await model.find(filter)).filter(async schedule => {
                return (!movieFilter || (await movieModel.exists({_id: schedule.movieId, ...movieFilter})))
                    && (!theatreFilter || (await theatreModel.exists({_id: schedule.theatreId, ...theatreFilter})))
            });
        },

        async addSchedule(schedule: Schedule): Promise<Schedule> {
            return (await model.create(
                {...schedule,
                    movieId: toObjectId(schedule.movieId),
                    theatreId: toObjectId(schedule.theatreId),
                }
            )).toObject();
        },

        async deleteScheduleById(id: string): Promise<Schedule | undefined> {
            return (await model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"},))?.toObject();
        },

        async deleteSchedulesByQuery(query: SchedulesQuery): Promise<number> {
            const filter = createScheduleFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateScheduleById(id: string, schedule: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined> {
            delete (schedule as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: schedule}, {returnDocument: "after"},))?.toObject()
        },
    }

}

export function createScheduleFilter(query: SchedulesQuery): FilterQuery<Schedule> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filter._id = asIdFieldFilter(query.id)
        return filter
    }
    if (query.movie) {
        if (query.movie.id) {
            filter.moveId = asIdFieldFilter(query.movie.id)
        } else {
            filter.movieFilter = createMovieFilter(query.movie)
        }
    }
    if (query.theatre) {
        if (query.theatre.id) {
            filter.theatreId = asIdFieldFilter(query.theatre.id)
        } else {
            filter.theatreFilter = createTheatreFilter(query.theatre)
        }
    }
    if (query.screen) {
        if (query.screen.id) {
            filter.screenId = asFieldFilter(query.screen.id)
        } else if (query.screen.name) {
            filter.screenName = asFieldFilter(query.screen.name)
        }
    }
    if (query.showDate) {
        filter.showStartDate = asFieldFilter(query.showDate)
    }
    if (query.showTime) {
        filter.showTimes = asArrayFieldFilter(query.showTime)
    }
    return filter
}
