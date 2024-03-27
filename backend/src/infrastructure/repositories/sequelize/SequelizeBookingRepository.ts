import {Attributes, DataTypes, Model, Op, Sequelize} from "sequelize";
import {BookingRepository} from "../../../application/repositories/BookingRepository";
import {Booking, Ticket} from "cinetex-core/dist/domain/entities/Booking";
import {BookingsQuery} from "cinetex-core/dist/application/queries";

import {bracket, queryField, sqlWherePredicate} from "./SequelizeUtils";
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
    price: { type: DataTypes.NUMBER, allowNull: false }
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

export class SequelizeBookingRepository implements BookingRepository {

    constructor(private readonly sequelize: Sequelize) {
        TicketModel.init(TicketAttributes, {
            sequelize,
            modelName: "Ticket",
            tableName: "TICKET",
            timestamps: false
        })
        BookingModel.init(BookingAttributes, {
            sequelize,
            modelName: "Booking",
            tableName: "BOOKING",
            timestamps: false
        })
        BookingModel.hasMany(TicketModel, { foreignKey: "bookingId", as: "tickets" })
        TicketModel.belongsTo(BookingModel, { foreignKey: "bookingId" })
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

