import {MovieRepository, MovieSearchCriteria} from "../../application/repositories/MovieRepository";
import {FilterQuery, Types} from "mongoose";
import {MongoDBModels} from "./MongoDBModels";
import {Movie} from "@cinetex/shared/domain/entities/Movie";
import {Theatre} from "@cinetex/shared/domain/entities/Theatre";
import {TheatreSearchCriteria} from "../../application/repositories/TheatreRepository";
import {Pattern, Range, Repository} from "../../application/repositories/Repository";
import {TheatreRepository} from "../../application/repositories/TheatreRepository";
import {ScheduleRepository, ScheduleSearchCriteria} from "../../application/repositories/ScheduleRepository";
import { Schedule } from "@cinetex/shared/domain/entities/Schedule";
import {Booking} from "@cinetex/shared/domain/entities/Booking";
import {BookingSearchCriteria} from "../../application/repositories/BookingRepository";
import {BookingRepository} from "../../application/repositories/BookingRepository";
import {UserRepository} from "../../application/repositories/UserRepository";
import {User} from "@cinetex/shared/domain/entities/User";
import {UserSearchCriteria} from "../../application/repositories/UserRepository";

function toObjectId(id: string) {
    return new Types.ObjectId(id);
}

function pattern(value: string | Pattern) {
    if (typeof value === "object") {
        return {$regex: value.pattern, $options: value.options}
    }
    return value;
}

function range<T>(value: T | Range<T>) {
    if (typeof value === "object") {
        const range = value as Range<T>;
        return {$gte: range.from, $lte: range.to}
    }
    return {$eq: value}
}

function createMovieFilter(criteria: MovieSearchCriteria): FilterQuery<Movie> {
    const filter: FilterQuery<any> = {}
    if (criteria.name) {
        filter.name = pattern(criteria.name)
    }
    if (criteria.genres) {
        filter.genres = { $all: criteria.genres }
    }
    if (criteria.rating) {
        filter.rating = { $in: criteria.rating }
    }
    if (criteria.director) {
        filter.director = pattern(criteria.director)
    }
    if (criteria.cast) {
        filter.cast = { $all: criteria.cast }
    }
    if (criteria.releaseDate) {
        filter.releaseDate = range(criteria.releaseDate)
    }
    return filter as FilterQuery<Movie>
}

function createTheatreFilter(criteria: TheatreSearchCriteria): FilterQuery<Theatre> {
    const filter: FilterQuery<any> = {}
    if (criteria.name) {
        filter.name = pattern(criteria.name)
    }
    if (criteria.screenCount) {
        filter.screen = { $size: range(criteria.screenCount) }
    }
    if (criteria.location) {
        filter.location = {
            $or: [
                {street: pattern(criteria.location)},
                {city: pattern(criteria.location)},
                {state: pattern(criteria.location)},
                {zip: pattern(criteria.location)}
            ]
        }
    }
    return filter as FilterQuery<Theatre>
}

function createScheduleFilter(criteria: ScheduleSearchCriteria): FilterQuery<Schedule> {
    const filter: FilterQuery<any> = {}
    if (criteria.movieId) {
        filter.movieId = new Types.ObjectId(criteria.movieId)
    }
    if (criteria.theatreId) {
        filter.theatreId = new Types.ObjectId(criteria.theatreId)
    }
    if (criteria.screenId) {
        filter.screenId = criteria.screenId
    }
    if (criteria.showDate) {
        filter.date = range(criteria.showDate)
    }
    if (criteria.showTime) {
        filter.showTime = { $all: criteria.showTime }
    }
    return filter as FilterQuery<Schedule>
}

function createBookingFilter(criteria: BookingSearchCriteria): FilterQuery<Booking> {
    const filter: FilterQuery<any> = {}
    if (criteria.userId) {
        filter.userId = new Types.ObjectId(criteria.userId)
    }
    if (criteria.theatreId) {
        filter.theatreId = new Types.ObjectId(criteria.theatreId)
    }
    if (criteria.movieId) {
        filter.movieId = new Types.ObjectId(criteria.movieId)
    }
    if (criteria.showDate) {
        filter.showDate = range(criteria.showDate)
    }
    if (criteria.showTime) {
        filter.showTime = { $all: criteria.showTime }
    }
    return filter as FilterQuery<Booking>
}

function createUserFilter(criteria: UserSearchCriteria): FilterQuery<User> {
    const filter: FilterQuery<any> = {}
    if (criteria.name) {
        filter.name = pattern(criteria.name)
    }
    if (criteria.email) {
        filter.email = pattern(criteria.email)
    }
    if (criteria.phoneNumber) {
        filter.phoneNumber = pattern(criteria.phoneNumber)
    }
    return filter as FilterQuery<User>
}

export class MongoDBRepository implements Repository {

    private readonly models: MongoDBModels = new MongoDBModels();

    private readonly MovieModel = this.models.Movie;

    private readonly TheatreModel = this.models.Theatre;

    private readonly ScheduleModel = this.models.Schedule;

    private readonly BookingModel = this.models.Booking;

    private readonly UserModel = this.models.User;

    async getAllMovies(): Promise<Movie[]> {
        return (await this.MovieModel.find()).map(movie => movie.toObject());
    }

    async getMovie(id: string): Promise<Movie | undefined> {
        return (await this.MovieModel.findById(toObjectId(id)))?.toObject();
    }

    async getMovieByName(name: string): Promise<Movie | undefined> {
        return (await this.MovieModel.findOne({name: name}))?.toObject();
    }

    async getMovies(criteria: MovieSearchCriteria): Promise<Movie[]> {
        const filter = createMovieFilter(criteria);
        return (await this.MovieModel.find(filter)).map(movie => movie.toObject());
    }

    async addMovie(movie: Movie): Promise<Movie> {
        return (await this.MovieModel.create(movie)).toObject();
    }

    async deleteMovie(id: string): Promise<Movie | undefined> {
        return (await this.MovieModel
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteMovieByName(name: string): Promise<Movie | undefined> {
        return (await this.MovieModel
            .findOneAndDelete({name: name}, {returnDocument: "before"}))?.toObject();
    }

    async deleteMovies(criteria: MovieSearchCriteria): Promise<number> {
        const filter= createMovieFilter(criteria);
        return (await this.MovieModel.deleteMany(filter)).deletedCount || 0
    }


    async updateMovie(id: string, movie: Partial<Omit<Movie, "id">>): Promise<Movie | undefined> {
        delete (movie as any).id
        return (await this.MovieModel
            .findByIdAndUpdate(toObjectId(id), {$set: movie}, {returnDocument: "after"}))?.toObject()
    }

    async deleteAllMovies(): Promise<number> {
        return (await this.MovieModel.deleteMany({})).deletedCount || 0
    }



    async getAllTheatres(): Promise<Theatre[]> {
        return (await this.TheatreModel.find()).map(theatre => theatre.toObject());
    }

    async getTheatre(id: string): Promise<Theatre | undefined> {
        return (await this.TheatreModel.findById(toObjectId(id)))?.toObject();
    }

    async getTheatreByName(name: string): Promise<Theatre | undefined> {
        return (await this.TheatreModel.findOne({name: name}))?.toObject();
    }

    async getTheatres(criteria: TheatreSearchCriteria): Promise<Theatre[]> {
        const filter = createTheatreFilter(criteria);
        return (await this.TheatreModel.find(filter)).map(theatre => theatre.toObject());
    }

    async addTheatre(theatre: Theatre): Promise<Theatre> {
        return (await this.TheatreModel.create(theatre)).toObject();
    }

    async deleteTheatre(id: string): Promise<Theatre | undefined> {
        return (await this.TheatreModel
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteTheatreByName(name: string): Promise<Theatre | undefined> {
        return (await this.TheatreModel
            .findOneAndDelete({name: name}, {returnDocument: "before"}))?.toObject();
    }

    async deleteTheatres(criteria: TheatreSearchCriteria): Promise<number> {
        const filter= createTheatreFilter(criteria);
        return (await this.TheatreModel.deleteMany(filter)).deletedCount || 0
    }

    async updateTheatre(id: string, theatre: Partial<Omit<Theatre, "id">>): Promise<Theatre | undefined> {
        delete (theatre as any).id
        return (await this.TheatreModel.findByIdAndUpdate(toObjectId(id), {$set: theatre}, {returnDocument: "after"}))?.toObject()
    }



    async getAllSchedules(): Promise<any[]> {
        return (await this.ScheduleModel.find()).map(schedule => schedule.toObject());
    }

    async getSchedule(id: string): Promise<any | undefined> {
        return (await this.ScheduleModel.findById(toObjectId(id)))?.toObject();
    }

    async getSchedules(criteria: ScheduleSearchCriteria): Promise<Schedule[]> {
        const filter = createScheduleFilter(criteria);
        return (await this.ScheduleModel.find(filter)).map(schedule => schedule.toObject());
    }

    async addSchedule(schedule: Schedule): Promise<Schedule> {
        return (await this.ScheduleModel.create(schedule)).toObject();
    }

    async deleteSchedule(id: string): Promise<Schedule | undefined> {
        return (await this.ScheduleModel
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteSchedules(criteria: ScheduleSearchCriteria): Promise<number> {
        const filter= createScheduleFilter(criteria);
        return (await this.ScheduleModel.deleteMany(filter)).deletedCount || 0
    }

    async updateSchedule(id: string, schedule: Partial<Omit<Schedule, "id">>): Promise<Schedule | undefined> {
        delete (schedule as any).id
        return (await this.ScheduleModel.findByIdAndUpdate(toObjectId(id), {$set: schedule}, {returnDocument: "after"}))?.toObject()
    }


    async getAllBookings(): Promise<Booking[]> {
        return (await this.BookingModel.find()).map(booking => booking.toObject());
    }

    async getBooking(id: string): Promise<Booking | undefined> {
        return (await this.BookingModel.findById(toObjectId(id)))?.toObject();
    }

    async getBookingsByUserId(userId: string): Promise<Booking[]> {
        return (await this.BookingModel.find({userId: new Types.ObjectId(userId)})).map(booking => booking.toObject());
    }

    async getBookingsByTheatreId(theatreId: string): Promise<Booking[]> {
        return (await this.BookingModel.find({theatreId: new Types.ObjectId(theatreId)})).map(booking => booking.toObject());
    }

    async getBookingsByMovieId(movieId: string): Promise<Booking[]> {
        return (await this.BookingModel.find({movieId: new Types.ObjectId(movieId)})).map(booking => booking.toObject());
    }

    async getBookings(criteria: BookingSearchCriteria): Promise<Booking[]> {
        const filter = createBookingFilter(criteria);
        return (await this.BookingModel.find(filter)).map(booking => booking.toObject());
    }

    async addBooking(booking: Booking): Promise<Booking> {
        return (await this.BookingModel.create(booking)).toObject();
    }

    async deleteBooking(id: string): Promise<Booking | undefined> {
        return (await this.BookingModel
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteBookings(criteria: BookingSearchCriteria): Promise<number> {
        const filter= createBookingFilter(criteria);
        return (await this.BookingModel.deleteMany(filter)).deletedCount || 0
    }

    async updateBooking(id: string, booking: Partial<Omit<Booking, "id">>): Promise<Booking | undefined> {
        delete (booking as any).id
        return (await this.BookingModel.findByIdAndUpdate(toObjectId(id), {$set: booking}, {returnDocument: "after"}))?.toObject()
    }

    async getAllUsers(): Promise<User[]> {
        return (await this.UserModel.find()).map(user => user.toObject());
    }

    async getUser(id: string): Promise<User | undefined> {
        return (await this.UserModel.findById(toObjectId(id)))?.toObject();
    }

    async getUserByEmail(email: string): Promise<User | undefined> {
        return (await this.UserModel.findOne({email: email}))?.toObject();
    }

    async getUsers(criteria: UserSearchCriteria): Promise<User[]> {
        const filter = createUserFilter(criteria);
        return (await this.UserModel.find(filter)).map(user => user.toObject());
    }

    async addUser(user: User): Promise<User> {
        return (await this.UserModel.create(user)).toObject();
    }

    async deleteUser(id: string): Promise<User | undefined> {
        return (await this.UserModel
            .findByIdAndDelete(toObjectId(id), {returnDocument: "before"}))?.toObject();
    }

    async deleteUsers(criteria: UserSearchCriteria): Promise<number> {
        const filter= createUserFilter(criteria);
        return (await this.UserModel.deleteMany(filter)).deletedCount || 0
    }

    async updateUser(id: string, user: Partial<Omit<User, "id">>): Promise<User | undefined> {
        delete (user as any).id
        return (await this.UserModel.findByIdAndUpdate(toObjectId(id), {$set: user}, {returnDocument: "after"}))?.toObject()
    }
}
