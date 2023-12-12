import {ScheduleRepository} from "../../application/repositories";
import {asArrayFieldFilter, asFieldFilter, asIdFieldFilter, toObjectId} from "./MongoDBUtils";
import {FilterQuery, Model, SchemaDefinition, SchemaOptions, ToObjectOptions, Types} from "mongoose";
import {Movie, Schedule, Theatre} from "cinetex-core/dist/domain/entities";
import {SchedulesQuery} from "cinetex-core/dist/application/queries";
import {createMovieFilter} from "./MongoDBMovieRepository";
import {createTheatreFilter} from "./MongoDBTheatreRepository";
import {DefaultSubSchemaOptions, fromObject as defaultFromObject} from "./MongoDBRepositories";

export const TimeSlotSchemaDefinition = <SchemaDefinition>{
    date: {type: String, required: true},
    times: {type: [String], required: true},
}

export const ScheduleSchemaOptions: SchemaOptions = {
    // ...DefaultSubSchemaOptions,
    // toObject: toObjectOrJSON,
    // toJSON: toObjectOrJSON,
    // virtuals: {
    //     movieId: {
    //         type: String,
    //         get: function(this: any) {
    //             return this._movieId?.toHexString()
    //         },
    //         set(this: any, value?: string) {
    //             this._movieId = value ? toObjectId(value) : undefined
    //         }
    //     },
    //     theatreId: {
    //         type: String,
    //         get: function(this: any) {
    //             return this._theatreId?.toHexString()
    //         },
    //         set: function(this: any, value?: string) {
    //             this._theatreId = value ? toObjectId(value) : undefined
    //         }
    //     },
    // },
}

export const ScheduleSchemaDefinition: SchemaDefinition = {
    _movieId: {type: Types.ObjectId, required: true, index: true},
    _theatreId: {type: Types.ObjectId, required: true, index: true},
    screenId: {type: Number, required: true},
    showTimes: {type: [TimeSlotSchemaDefinition], required: true, options: DefaultSubSchemaOptions},
}

const toObjectOptions: ToObjectOptions = {
    virtuals: true,
    transform: function(doc: any, ret: Record<string, any>) {
        ret.id = ret._id?.toHexString()
        ret.movieId = ret._movieId?.toHexString()
        ret.theatreId = ret._theatreId?.toHexString()
        delete ret._id;
        delete ret._movieId;
        delete ret._theatreId;
    }
}

function fromObject<T extends {movieId?: string, theatreId?: string}>(obj: T): T {
    return {
        ...defaultFromObject(obj),
        _movieId: (obj.movieId ? toObjectId(obj.movieId) : undefined),
        _theatreId: (obj.theatreId ? toObjectId(obj.theatreId) : undefined),
        movieId: undefined,
        theatreId: undefined,
    }
}

export function MongoDBScheduleRepository(model: Model<Schedule>, movieModel: Model<Movie>, theatreModel: Model<Theatre>): ScheduleRepository {
    return {
        async getAllSchedules(): Promise<Schedule[]> {
            return (await model.find()).map(schedule => schedule.toObject(toObjectOptions));
        },

        async getScheduleById(id: string): Promise<Schedule | undefined> {
            return (await model.findById(toObjectId(id)))?.toObject(toObjectOptions);
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
            return (await model.create(fromObject(schedule))).toObject(toObjectOptions);
        },

        async deleteScheduleById(id: string): Promise<Schedule | undefined> {
            return (await model.findByIdAndDelete(toObjectId(id), {returnDocument: "before"},))?.toObject(toObjectOptions);
        },

        async deleteSchedulesByQuery(query: SchedulesQuery): Promise<number> {
            const filter = createScheduleFilter(query);
            return (await model.deleteMany(filter)).deletedCount || 0
        },

        async updateScheduleById(id: string, schedule: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined> {
            return (await model.findByIdAndUpdate(toObjectId(id), {$set: fromObject(schedule)}, {returnDocument: "after"},))?.toObject(toObjectOptions)
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
            filter.movieId = asIdFieldFilter(query.movie.id)
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
        if (query.screen.name) {
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
