import {ScheduleRepository} from "../../../application/repositories/ScheduleRepository";
import {Schedule, TimeSlot} from "cinetex-core/dist/domain/entities/Schedule";
import {BookingsQuery, SchedulesQuery} from "cinetex-core/dist/application/queries";
import {Attributes, DataTypes, Model, Op, Sequelize} from "sequelize";
import {bracket, queryField, sqlWherePredicate} from "./SequelizeUtils";
import dedent from "dedent";
import {createMovieSubqueryClause} from "./SequelizeMovieRepository";
import {createTheatreSubqueryClause} from "./SequelizeTheatreRepository";
import {WhereOptions} from "sequelize/types/model";
import {BookingModel} from "./SequelizeBookingRepository";

const TimeSlotAttributes: Attributes<Model> = {
    scheduleId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    date: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    time: { type: DataTypes.STRING, allowNull: false, primaryKey: true }
}

const ScheduleAttributes: Attributes<Model> = {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    movieId: { type: DataTypes.STRING, allowNull: false },
    theatreId: { type: DataTypes.STRING, allowNull: false },
    screenId: { type: DataTypes.NUMBER, allowNull: false },
}

type TimeSlotData = {
    scheduleId?: string,
    date: string,
    time: string
}

type ScheduleData = Omit<Schedule, "showTimes"> & {
    showTimes: TimeSlotData[]
}

function toTimeSlot(data: TimeSlotData): TimeSlot {
    return {date: data.date, times: [data.time]}
}

function toTimeSlotData(timeSlot: TimeSlot): TimeSlotData[] {
    return timeSlot.times.map((time: string) => ({ date: timeSlot.date, time }))
}

function toScheduleData(schedule: Schedule): ScheduleData {
    const scheduleData: ScheduleData = {
        ...schedule,
        showTimes: schedule.showTimes.flatMap(toTimeSlotData)
    }
    for (const timeSlot of scheduleData.showTimes) {
        timeSlot.scheduleId = schedule.id;
    }
    return scheduleData;
}

function toSchedule(data: ScheduleData): Schedule {
    return {
        ...data,
        showTimes: data.showTimes.reduce((timeSlots: TimeSlot[], timeSlotData: TimeSlotData) => {
            const index = timeSlots.findIndex(timeSlot => timeSlot.date === timeSlotData.date);
            if (index === -1) {
                timeSlots.push(toTimeSlot(timeSlotData));
            } else {
                timeSlots[index].times.push(timeSlotData.time);
            }
            return timeSlots;
        }, [] as TimeSlot[])
    }
}

export class TimeSlotModel extends Model<TimeSlotData> {
    toObject(): TimeSlot {
        const data = this.get({ plain: true, clone: true });
        return toTimeSlot(data);
    }
}

export class ScheduleModel extends Model<ScheduleData> {
    declare addTimeSlot: (timeSlot: TimeSlotModel) => Promise<void>
    declare setTimeSlots: (timeSlots: TimeSlotModel[]) => Promise<void>
    toObject(): Schedule {
        const data = this.get({ plain: true, clone: true });
        return toSchedule(data);
    }
}

export class SequelizeScheduleRepository implements ScheduleRepository {
    constructor(private readonly sequelize: Sequelize) {
        ScheduleModel.init(ScheduleAttributes, {
            sequelize,
            modelName: "Schedule",
            tableName: "SCHEDULE",
            timestamps: false,
            indexes: [
                { fields: ["movieId"], name: "SCHEDULE_movie_id" },
                { fields: ["theatreId"], name: "SCHEDULE_theatre_id" },
            ]
        });
        TimeSlotModel.init(TimeSlotAttributes, {
            sequelize,
            modelName: "TimeSlot",
            tableName: "SCHEDULE_TIMESLOT",
            timestamps: false
        });
        ScheduleModel.hasMany(TimeSlotModel, { foreignKey: "scheduleId", as: "showTimes" });
        TimeSlotModel.belongsTo(ScheduleModel, { foreignKey: "scheduleId" });
    }

    async getAllSchedules(): Promise<Schedule[]> {
        return await Promise.all((await ScheduleModel.findAll({
            include: [
                {model: TimeSlotModel, as: "showTimes"}
            ]
        })).map(model => model.toObject()));
    }

    async getScheduleById(id: string): Promise<Schedule | undefined> {
        return (await ScheduleModel.findByPk(id, {
            include: [
                {model: TimeSlotModel, as: "showTimes"}
            ]
        }))?.toObject();
    }

    async getSchedulesByQuery(query: SchedulesQuery): Promise<Schedule[]> {
        const where = createScheduleWhereClause(query);
        return await Promise.all((await ScheduleModel.findAll({ where,
            include: [
                {model: TimeSlotModel, as: "showTimes"}
            ]
        })).map(scheduleModel => scheduleModel.toObject()));
    }

    async deleteScheduleById(id: string): Promise<Schedule | undefined> {
        const scheduleModel = (await ScheduleModel.findByPk(id, {
            include: [
                {model: TimeSlotModel, as: "showTimes"}
            ]
        }));
        if (scheduleModel) {
            const schedule = scheduleModel.toObject()
            await scheduleModel.destroy();
            return schedule
        }
        return undefined;
    }

    async deleteSchedulesByQuery(query: SchedulesQuery): Promise<number> {
        const where = createScheduleWhereClause(query);
        return await ScheduleModel.destroy({ where });
    }

    async addSchedule(schedule: Schedule): Promise<Schedule> {
        const scheduleData = toScheduleData(schedule)
        const scheduleModel = ScheduleModel.build(scheduleData, {
            include: [
                {model: TimeSlotModel, as: "showTimes"},
            ]
        })
        await scheduleModel.save()
        return scheduleModel.toObject();
    }

    async updateScheduleById(id: string, schedule: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined> {
        const scheduleModel = await ScheduleModel.findByPk(id, {
            include: [
                {model: TimeSlotModel, as: "showTimes"}
            ]
        });
        if (scheduleModel) {
            if (schedule.showTimes) {
                await scheduleModel.setTimeSlots(
                    schedule.showTimes
                        .flatMap(toTimeSlotData)
                        .map((timeSlotData: TimeSlotData) => TimeSlotModel.build(timeSlotData))

                );
                delete (schedule as any).showTimes
            }
            await scheduleModel.update({
                ...(schedule as any)
            });
            return scheduleModel.toObject();
        }
        return undefined;
    }
}

function createScheduleWhereClause(query: SchedulesQuery): WhereOptions<typeof ScheduleAttributes> {
    const predicates: any[] = []
    if (query.id) {
        predicates.push(queryField(ScheduleModel, "id", query.id));
    }
    if (query.movie) {
        if (query.movie.id) {
            predicates.push(queryField(ScheduleModel, "movieId", query.movie.id));
        }
        const movieSubquery = createMovieSubqueryClause(query.movie);
        if (movieSubquery) {
            predicates.push({
                ["movieId"]: {[Op.in]: Sequelize.literal(movieSubquery)}
            });
        }
    }
    if (query.theatre) {
        const theatreSubquery = createTheatreSubqueryClause(query.theatre);
        if (theatreSubquery) {
            predicates.push({
                ["theatreId"]: {[Op.in]: Sequelize.literal(theatreSubquery)}
            });
        }
    }
    if (query.screenId) {
        predicates.push(queryField(ScheduleModel, "screenId", query.screenId));
    }

    const showDateTimeSubquery = createShowDateTimeSubqueryClause(query);
    if (showDateTimeSubquery) {
        predicates.push(Sequelize.literal(showDateTimeSubquery));
    }
    return { [Op.and]: predicates };
}

export function createShowDateTimeSubqueryClause(query: SchedulesQuery): string | undefined {
    const predicates: string[] = []
    if (query.showDate) {
        predicates.push(sqlWherePredicate("date", query.showDate))
    }
    if (query.showTime) {
        predicates.push(sqlWherePredicate("time", query.showTime))
    }
    if (predicates.length > 0) {
        return dedent`
            EXISTS (SELECT * FROM "${TimeSlotModel.tableName}" 
                WHERE "${TimeSlotModel.tableName}"."scheduleId" = "${ScheduleModel.name}"."id" 
                  AND ${predicates.map(bracket).join(" AND ")})
            `
    } return undefined;
}
