import {ScheduleRepository} from "../../application/repositories/ScheduleRepository";
import {toObjectId, toRangeFilter} from "./MongoDBUtils";
import {FilterQuery, Model} from "mongoose";
import {Schedule } from "@cinetex/shared/domain/entities/Schedule";
import {ScheduleQueryCriteria} from "@cinetex/shared/application/usecases/queries/GetSchedulesByQuery";

export class MongoDBScheduleRepository implements ScheduleRepository {

    constructor(readonly model: Model<Schedule>) {}

    async getAllSchedules(): Promise<any[]> {
        return (await this.model.find()).map(schedule => schedule.toObject());
    }

    async getScheduleById(id: string): Promise<any | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject();
    }

    async getSchedulesByQuery(criteria: ScheduleQueryCriteria): Promise<Schedule[]> {
        const filter = createScheduleFilter(criteria);
        return (await this.model.find(filter)).map(schedule => schedule.toObject());
    }

    async addSchedule(schedule: Schedule): Promise<Schedule> {
        return (await this.model.create(schedule)).toObject();
    }

    async deleteScheduleById(id: string): Promise<Schedule | undefined> {
        return (await this.model
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteSchedulesByQuery(criteria: ScheduleQueryCriteria): Promise<number> {
        const filter= createScheduleFilter(criteria);
        return (await this.model.deleteMany(filter)).deletedCount || 0
    }

    async updateScheduleById(id: string, schedule: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined> {
        delete (schedule as any).id
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: schedule}, {returnDocument: "after"}))?.toObject()
    }
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
