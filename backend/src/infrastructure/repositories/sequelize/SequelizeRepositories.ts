import {Sequelize} from "sequelize";
import {Repositories} from "../../../application/repositories/Repositories";
import {MovieRepository} from "../../../application/repositories/MovieRepository";
import {TheatreRepository} from "../../../application/repositories/TheatreRepository";
import {ScheduleRepository} from "../../../application/repositories/ScheduleRepository";
import {BookingRepository} from "../../../application/repositories/BookingRepository";
import {SequelizeUserRepository} from "./SequelizeUserRepository";
import {SequelizeMovieRepository} from "./SequelizeMovieRepository";
import {SequelizeTheatreRepository} from "./SequelizeTheatreRepository";
import {SequelizeScheduleRepository} from "./SequelizeScheduleRepository";
import {SequelizeBookingRepository} from "./SequelizeBookingRepository";

export class SequelizeRepositories implements Repositories {

    private readonly userRepository: SequelizeUserRepository
    private readonly movieRepository: SequelizeMovieRepository
    private readonly theatreRepository: SequelizeTheatreRepository
    private readonly scheduleRepository: SequelizeScheduleRepository
    private readonly bookingRepository: SequelizeBookingRepository

    constructor(private readonly sequelize: Sequelize) {
        this.userRepository = new SequelizeUserRepository(sequelize);
        this.movieRepository = new SequelizeMovieRepository(sequelize);
        this.theatreRepository = new SequelizeTheatreRepository(sequelize);
        this.scheduleRepository = new SequelizeScheduleRepository(sequelize);
        this.bookingRepository = new SequelizeBookingRepository(sequelize);
    }

    async sync(): Promise<void> {
        await this.sequelize.sync();
    }

    get User(): SequelizeUserRepository {
        return this.userRepository;
    }

    get Movie(): MovieRepository {
        return this.movieRepository;
    }

    get Theatre(): TheatreRepository {
        return this.theatreRepository;
    }

    get Schedule(): ScheduleRepository {
        return this.scheduleRepository;
    }

    get Booking(): BookingRepository {
        return this.bookingRepository;
    }
}
