import {ScheduleRepository} from "../../application/repositories";
import {toObjectId, toRangeFilter} from "./MongoDBUtils";
import {FilterQuery, Model} from "mongoose";
import {Schedule } from "shared/dist/domain/entities";
import {ScheduleQueryCriteria} from "shared/dist/application/usecases/queries";

export function MongoDBScheduleRepository(model: Model<Schedule>): ScheduleRepository {
    return {
        async getAllSchedules(): Promise<any[]> {
            return (await model.find()).map(schedule => schedule.toObject());
        },

        async getScheduleById(id: string): Promise<any | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject();
        },

        async getSchedulesByQuery(criteria: ScheduleQueryCriteria): Promise<Schedule[]> {
            const filter = createScheduleFilter(criteria);
            return (await model.find(filter)).map(schedule => schedule.toObject());
        },

        async addSchedule(schedule: Schedule): Promise<Schedule> {
            return (await model.create(schedule)).toObject();
        },

        async deleteScheduleById(id: string): Promise<Schedule | undefined> {
            return (await model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"},))?.toObject();
        },

        async deleteSchedulesByQuery(criteria: ScheduleQueryCriteria): Promise<number> {
            const filter = createScheduleFilter(criteria);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateScheduleById(id: string, schedule: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined> {
            delete (schedule as any).id
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: schedule}, {returnDocument: "after"},))?.toObject()
        },
    }

    function createScheduleFilter(criteria: ScheduleQueryCriteria): FilterQuery<Schedule> {
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
