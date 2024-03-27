import {ScheduleRepository} from "../../../application/repositories/ScheduleRepository";
import {filterArrayField, filterField, filterIdField, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, Schema, SchemaDefinition, SchemaOptions, ToObjectOptions, Types} from "mongoose";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {Schedule} from "cinetex-core/dist/domain/entities/Schedule";
import {Theatre} from "cinetex-core/dist/domain/entities/Theatre";

import {SchedulesQuery} from "cinetex-core/dist/application/queries/GetSchedulesByQuery";
import {createMovieFilter} from "./MongoDBMovieRepository";
import {createTheatreFilter} from "./MongoDBTheatreRepository";
import {DefaultSubSchemaOptions} from "./MongoDBRepositories";
import {MongoDBRepository} from "./MongoDBRepository";

const TimeSlotSchemaDefinition = <SchemaDefinition>{
    date: {type: String, required: true},
    times: {type: [String], required: true},
}

const TimeSlotSchema = new Schema(TimeSlotSchemaDefinition, DefaultSubSchemaOptions)

const ScheduleSchemaDefinition: SchemaDefinition = {
    _movieId: {type: Types.ObjectId, required: true, index: true},
    _theatreId: {type: Types.ObjectId, required: true, index: true},
    screenId: {type: Number, required: true},
    showTimes: {type: [TimeSlotSchema], required: true},
}

const ScheduleToObjectOptions: ToObjectOptions = {
    versionKey: false,
    transform: function(doc: any, ret: Record<string, any>) {
        if (doc instanceof Model) {
            ret.id = ret._id?.toHexString()
            ret.movieId = ret._movieId?.toHexString()
            ret.theatreId = ret._theatreId?.toHexString()
            delete ret._movieId;
            delete ret._theatreId;
        }
        delete ret._id;
    }
}

const ScheduleSchemaOptions: SchemaOptions = {
    id: false,
    versionKey: false,
    toObject: ScheduleToObjectOptions,
    toJSON: ScheduleToObjectOptions,
}

export const ScheduleSchema = new Schema(ScheduleSchemaDefinition, ScheduleSchemaOptions)

export class MongoDBScheduleRepository extends MongoDBRepository<Schedule> implements ScheduleRepository {

    constructor(model: Model<Schedule>, private movieModel: Model<Movie>, private theatreModel: Model<Theatre>) {
        super(model)
    }

    override toObjectOptions: ToObjectOptions = ScheduleToObjectOptions

    override fromObject(obj: Partial<Schedule>): Schedule {
        const to: any = {
            ...super.fromObject(obj),
            _movieId: (obj.movieId ? toObjectId(obj.movieId) : undefined),
            _theatreId: (obj.theatreId ? toObjectId(obj.theatreId) : undefined),
        }
        delete to.id
        delete to.movieId
        delete to.theatreId
        return to as Schedule;
    }

    async getAllSchedules(): Promise<Schedule[]> {
        return (await this.model.find()).map(schedule => schedule.toObject(this.toObjectOptions));
    }

    async getScheduleById(id: string): Promise<Schedule | undefined> {
        return (await this.model.findById(toObjectId(id)))?.toObject(this.toObjectOptions);
    }

    async getSchedulesByQuery(query: SchedulesQuery): Promise<Schedule[]> {
        const filter = {...createScheduleFilter(query)};
        const movieFilter = query.movie ? createMovieFilter(query.movie) : undefined
        const theatreFilter = query.theatre ? createTheatreFilter(query.theatre) : undefined
        const schedules: any[] = await this.model.find(filter)
        const filteredSchedules: any[] = []
        for (const schedule of schedules) {
            let movieMatched = true
            if (movieFilter) {
                movieMatched = (await this.movieModel.exists({...movieFilter, _id: schedule._movieId})) !== null
            }
            let theatreMatched = true
            if (theatreFilter) {
                theatreMatched = (await this.theatreModel.exists({...theatreFilter, _id: schedule._theatreId})) !== null
            }
            if (movieMatched && theatreMatched) {
                filteredSchedules.push(schedule.toObject(this.toObjectOptions))
            }
        }
        return filteredSchedules
    }

    async addSchedule(schedule: Schedule): Promise<Schedule> {
        return (await this.model.create(this.fromObject(schedule))).toObject(this.toObjectOptions);
    }

    async deleteScheduleById(id: string): Promise<Schedule | undefined> {
        return (await this.model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"},))?.toObject(this.toObjectOptions);
    }

    async deleteSchedulesByQuery(query: SchedulesQuery): Promise<number> {
        if (Object.keys(query).length === 0) {
            return (await this.model.deleteMany({})).deletedCount || 0
        }
        if (Object.keys(query).length === 1 && query.id) {
            return (await this.model.deleteOne({_id: toObjectId(query.id as string)})).deletedCount || 0
        }
        const schedules = await this.getSchedulesByQuery(query)
        const ids = schedules.map(schedule => schedule.id).map(toObjectId)
        return (await this.model.deleteMany({ _id: { $in: ids } })).deletedCount || 0
    }

    async updateScheduleById(id: string, schedule: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined> {
        return (await this.model.findByIdAndUpdate(toObjectId(id), {$set: this.fromObject(schedule)}, {returnDocument: "after"},))?.toObject(this.toObjectOptions)
    }
}

export function createScheduleFilter(query: SchedulesQuery): FilterQuery<Schedule> {
    const filter: FilterQuery<any> = {}
    if (query.id) {
        filterIdField(filter, "_id", query.id)
    }
    if (query.movie) {
        if (query.movie.id) {
            filterIdField(filter, "_movieId", query.movie.id)
        // } else {
        //     filter.movieFilter = createMovieFilter(query.movie)
        }
    }
    if (query.theatre) {
        if (query.theatre.id) {
            filterIdField(filter, "_theatreId", query.theatre.id)
        // } else {
        //     filter.theatreFilter = createTheatreFilter(query.theatre)
        }
    }
    if (query.screenId) {
        filterField(filter, "screenId", query.screenId)
    }
    const showTimeFilterElement: FilterQuery<any> = {}
    if (query.showDate) {
        filterField(showTimeFilterElement, "date", query.showDate)
    }
    if (query.showTime) {
        filterArrayField(showTimeFilterElement, "times", query.showTime)
    }
    if (Object.keys(showTimeFilterElement).length > 0) {
        filter.showTimes = {$elemMatch: showTimeFilterElement}
    }
    return filter
}
