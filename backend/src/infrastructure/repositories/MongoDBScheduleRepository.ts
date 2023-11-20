import {ScheduleRepository} from "../../application/repositories";
import {toObjectId, toRangeFilter} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition, Types} from "mongoose";
import {Schedule} from "core/dist/domain/entities";
import {SchedulesQuery} from "core/dist/application/queries";

export const ScheduleSchemaDefinition: SchemaDefinition = {
    movieId: {type: Types.ObjectId, required: true},
    theatreId: {type: Types.ObjectId, required: true},
    screenId: {type: Number, required: true},
    showStartDate: {type: String, required: true},
    showEndDate: {type: String, required: true},
    showTimes: {type: [String], required: true}
}

export function MongoDBScheduleRepository(model: Model<Schedule>): ScheduleRepository {
    return {
        async getAllSchedules(): Promise<any[]> {
            return (await model.find()).map(schedule => schedule.toObject());
        },

        async getScheduleById(id: string): Promise<any | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject();
        },

        async querySchedules(criteria: SchedulesQuery): Promise<Schedule[]> {
            const filter = createScheduleFilter(criteria);
            return (await model.find(filter)).map(schedule => schedule.toObject());
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

        async deleteSchedulesByQuery(criteria: SchedulesQuery): Promise<number> {
            const filter = createScheduleFilter(criteria);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateScheduleById(id: string, schedule: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined> {
            delete (schedule as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: schedule}, {returnDocument: "after"},))?.toObject()
        },
    }

    function createScheduleFilter(criteria: SchedulesQuery): FilterQuery<Schedule> {
        const filter: FilterQuery<any> = {}
        if (criteria.movieId) {
            filter.movieId = toObjectId(criteria.movieId)
        }
        if (criteria.theatreId) {
            filter.theatreId = toObjectId(criteria.theatreId)
        }
        if (criteria.screenId) {
            filter.screenId = criteria.screenId
        }
        if (criteria.showDate) {
            filter.date = toRangeFilter(criteria.showDate)
        }
        if (criteria.showTime) {
            filter.showTime = { $all: criteria.showTime }
        }
        return filter as FilterQuery<Schedule>
    }
}
