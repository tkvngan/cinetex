import {Attributes, DatabaseError, DataTypes, Model, Op, Sequelize} from "sequelize";
import {BookingRepository} from "../../../application/repositories/BookingRepository";
import {Booking, Ticket} from "cinetex-core/dist/domain/entities/Booking";
import {BookingsQuery} from "cinetex-core/dist/application/queries";

import {bracket, queryField, removeNulls, sqlWherePredicate} from "./SequelizeUtils";
import {createMovieSubqueryClause} from "./SequelizeMovieRepository";
import {createTheatreSubqueryClause} from "./SequelizeTheatreRepository";
import {createUserSubqueryClause} from "./SequelizeUserRepository";
import {WhereOptions} from "sequelize/types/model";
import dedent from "dedent";

const BookingAttributes: Attributes<Model> = {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    userId: { type: DataTypes.STRING, allowNull: false },
    theatreId: { type: DataTypes.STRING, allowNull: false },
    bookingTime: { type: DataTypes.STRING, allowNull: false },
    totalPrice: { type: DataTypes.NUMBER, allowNull: false }
}

const TicketAttributes: Attributes<Model> = {
    bookingId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    movieId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    screenId: { type: DataTypes.NUMBER, allowNull: false, primaryKey: true },
    showDate: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    showTime: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    row: { type: DataTypes.NUMBER, allowNull: false, primaryKey: true },
    column: { type: DataTypes.NUMBER, allowNull: false, primaryKey: true },
    price: { type: DataTypes.NUMBER, allowNull: false },
    ticketNo: { type: DataTypes.NUMBER, allowNull: true },
    token: { type: DataTypes.STRING(1000), allowNull: true }
}

type TicketData = Omit<Ticket, "seat"> & {
    bookingId: string
    row: number,
    column: number
}

function compareTicketData(a: TicketData, b: TicketData): number {
    let result = a.movieId.localeCompare(b.movieId);
    if (result !== 0) return result;

    result = a.screenId - b.screenId;
    if (result !== 0) return result;

    result = a.showDate.localeCompare(b.showDate);
    if (result !== 0) return result;

    result = a.showTime.localeCompare(b.showTime);
    if (result !== 0) return result;

    result = a.row - b.row;
    if (result !== 0) return result;

    return a.column - b.column;
}

type BookingData = Omit<Booking, "tickets"> & {
    tickets: TicketData[]
}

function toTicketData(bookingId: string, ticket: Ticket): TicketData {
    const ticketData: any = {
        ...ticket,
        bookingId,
        row: ticket.seat.row,
        column: ticket.seat.column
    }
    delete ticketData.seat
    return ticketData as TicketData;
}

function toTicket(ticketData: TicketData): Ticket {
    const ticket: any = {
        ...ticketData,
        seat: {
            row: ticketData.row,
            column: ticketData.column
        }
    }
    delete ticket.bookingId
    delete ticket.row
    delete ticket.column
    if (ticket.ticketNo === null) {
        delete ticket.ticketNo
    }
    return ticket as Ticket
}

function toBookingData(booking: Booking): BookingData {
    return {
        ...booking,
        tickets: booking.tickets
            .map((ticket: Ticket) => toTicketData(booking.id, ticket))
            .sort(compareTicketData)
    } as BookingData;
}

function toBooking(bookingData: BookingData): Booking {
    bookingData.tickets.sort(compareTicketData)
    const booking: any = {
        ...bookingData,
        tickets: bookingData.tickets.map(toTicket)
    }
    return booking as Booking;
}

export class TicketModel extends Model<TicketData> {
    toObject(): Ticket {
        return toTicket(this.get({ plain: true, clone: true }));
    }
}

export class BookingModel extends Model<BookingData> {
    toObject(): Booking {
        return toBooking(this.get({ plain: true, clone: true }));
    }
}

function sqlErrorCode(e: any): number | undefined {
    if (e instanceof DatabaseError) {
        const original = e.original as Error & { errorNum?: number };
        return original.errorNum
    }
    throw e;
}

export class SequelizeBookingRepository implements BookingRepository {

    constructor(private readonly sequelize: Sequelize) {
        TicketModel.init(TicketAttributes, {
            sequelize,
            modelName: "Ticket",
            tableName: "TICKET",
            timestamps: false,
            indexes: [
                { fields: ["movieId"], name: "TICKET_movie_id" },
            ]
        })
        BookingModel.init(BookingAttributes, {
            sequelize,
            modelName: "Booking",
            tableName: "BOOKING",
            timestamps: false,
            indexes: [
                { fields: ["userId"], name: "BOOKING_user_id" },
                { fields: ["theatreId"], name: "BOOKING_theatre_id" },
                { fields: ["bookingTime"], name: "BOOKING_booking_time" }
            ]
        })
        BookingModel.hasMany(TicketModel, { foreignKey: "bookingId", as: "tickets" })
        TicketModel.belongsTo(BookingModel, { foreignKey: "bookingId" })
    }

    async createTicketSequence(): Promise<void> {
        try {
            await this.sequelize.query(
                "CREATE SEQUENCE TICKET_SEQ START WITH 1000 INCREMENT BY 1 MAXVALUE 999999999", {raw: true});
        } catch (e) {
            console.log(e)
            if (sqlErrorCode(e) === 955) {
                return;
            }
            throw e;
        }
    }

    async createTicketTrigger(): Promise<void> {
        try {
            await this.sequelize.query(dedent`
                CREATE OR REPLACE TRIGGER TICKET_TRIGGER
                BEFORE INSERT ON TICKET
                FOR EACH ROW
                BEGIN
                    SELECT TICKET_SEQ.NEXTVAL, USER_CREDENTIALS.GetToken() 
                    INTO :NEW."ticketNo", :NEW."token" FROM DUAL;
                END;
            `, {raw: true});
        } catch (e) {
            console.log(e)
            if (sqlErrorCode(e) === 4080) {
                return;
            }
            throw e;
        }
    }

    async getAllBookings(): Promise<Booking[]> {
        return await Promise.all((await BookingModel.findAll({
            include: [
                {model: TicketModel, as: "tickets"}
            ]
        })).map(model => model.toObject()));
    }

    async getBookingById(id: string): Promise<Booking | undefined> {
        return (await BookingModel.findByPk(id, {
            include: [
                {model: TicketModel, as: "tickets"}
            ]
        }))?.toObject();
    }

    async getBookingsByQuery(query: BookingsQuery): Promise<Booking[]> {
        const where = createBookingWhereClause(query);
        return await Promise.all((await BookingModel.findAll({ where,
            include: [
                {model: TicketModel, as: "tickets"}
            ]
        })).map(bookingModel => bookingModel.toObject()));
    }

    async deleteBookingById(id: string): Promise<Booking | undefined> {
        const bookingModel = (await BookingModel.findByPk(id, {
            include: [
                {model: TicketModel, as: "tickets"}
            ]
        }));
        if (bookingModel) {
            const booking = bookingModel.toObject()
            await bookingModel.destroy();
            return booking
        }
        return undefined;
    }

    async deleteBookingsByQuery(query: BookingsQuery): Promise<number> {
        const where = createBookingWhereClause(query);
        return await BookingModel.destroy({ where });
    }

    async addBooking(booking: Booking): Promise<Booking> {
        const bookingData = toBookingData(booking)
        const bookingModel = await BookingModel.create(bookingData, {
            include: [
                {model: TicketModel, as: "tickets"},
            ]
        })
        await bookingModel.save()
        return bookingModel.toObject();
    }

    async updateBookingById(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined> {
        const bookingModel = await BookingModel.findByPk(id, {
            include: [
                {model: TicketModel, as: "tickets"}
            ]
        });
        if (bookingModel) {
            const bookingData: any = {
                ...bookingModel.get({ plain: true, clone: true }) as BookingData,
                ...booking
            }
            if (booking.tickets) {
                bookingData.tickets = booking.tickets.map((ticket: Ticket) => toTicketData(id, ticket))
            }
            await bookingModel.update(bookingData, {
                include: [
                    {model: TicketModel, as: "tickets"},
                ]
            });
            return bookingModel.toObject();
        }
        return undefined;
    }

    async getBookingsByMovieId(movieId: string): Promise<Booking[]> {
        const where = createBookingWhereClause({ movie: { id: movieId } });
        return await Promise.all((await BookingModel.findAll({ where,
            include: [
                {model: TicketModel, as: "tickets"}
            ]
        })).map(bookingModel => bookingModel.toObject()));
    }

    async getBookingsByTheatreId(theatreId: string): Promise<Booking[]> {
        const where = createBookingWhereClause({ theatre: { id: theatreId } });
        return await Promise.all((await BookingModel.findAll({ where,
            include: [
                {model: TicketModel, as: "tickets"}
            ]
        })).map(bookingModel => bookingModel.toObject()));
    }

    async getBookingsByUserId(userId: string): Promise<Booking[]> {
        const where = createBookingWhereClause({ user: { id: userId } });
        return await Promise.all((await BookingModel.findAll({ where,
            include: [
                {model: TicketModel, as: "tickets"}
            ]
        })).map(bookingModel => bookingModel.toObject()));
    }
}

function createBookingWhereClause(query: BookingsQuery): WhereOptions<typeof BookingAttributes> {
    const predicates: any[] = []
    if (query.id) {
        predicates.push(queryField(BookingModel, "id", query.id));
    }
    if (query.theatre) {
        const theatreSubquery = createTheatreSubqueryClause(query.theatre);
        if (theatreSubquery) {
            predicates.push({
                ["theatreId"]: {[Op.in]: Sequelize.literal(theatreSubquery)}
            });
        }
    }
    if (query.user) {
        const userSubquery = createUserSubqueryClause(query.user);
        if (userSubquery) {
            predicates.push({
                ["userId"]: {[Op.in]: Sequelize.literal(userSubquery)}
            });
        }
    }
    const ticketPredicates: string[] = []

    if (query.movie) {
        const movieSubquery = createMovieSubqueryClause(query.movie);
        if (movieSubquery) {
            ticketPredicates.push(
                `"movieId" IN ${movieSubquery}`
            )
        }
    }
    if (query.ticket) {
        if (query.ticket.screenId) {
            ticketPredicates.push(
                sqlWherePredicate(`"screenId"`, query.ticket.screenId)
            )
        }
        if (query.ticket.showDate) {
            ticketPredicates.push(
                sqlWherePredicate('"showDate"', query.ticket.showDate)
            )
        }
        if (query.ticket.showTime) {
            ticketPredicates.push(
                sqlWherePredicate('"showTime"', query.ticket.showTime)
            )
        }
        if (query.ticket.row) {
            ticketPredicates.push(
                sqlWherePredicate('."row"', query.ticket.row)
            )
        }
        if (query.ticket.column) {
            ticketPredicates.push(
                sqlWherePredicate('"column"', query.ticket.column)
            )
        }
    }
    if (ticketPredicates.length > 0) {
        const ticketSubquery = Sequelize.literal(dedent(`(
            SELECT "bookingId" 
            FROM "${TicketModel.tableName}" 
            WHERE ${ticketPredicates.map(bracket).join(" AND ")}
        )`))
        predicates.push({
            ["id"]: { [Op.in]: ticketSubquery }
        })
    }

    return { [Op.and]: predicates };
}

