import {Sequelize} from "sequelize";
import {Repositories} from "../../../application/repositories/Repositories";
import {MovieRepository} from "../../../application/repositories/MovieRepository";
import {TheatreRepository} from "../../../application/repositories/TheatreRepository";
import {ScheduleRepository} from "../../../application/repositories/ScheduleRepository";
import {BookingRepository} from "../../../application/repositories/BookingRepository";
import {SequelizeUserRepository, UserModel} from "./SequelizeUserRepository";
import {MovieModel, SequelizeMovieRepository} from "./SequelizeMovieRepository";
import {SequelizeTheatreRepository, TheatreModel} from "./SequelizeTheatreRepository";
import {ScheduleModel, SequelizeScheduleRepository} from "./SequelizeScheduleRepository";
import {BookingModel, SequelizeBookingRepository, TicketModel} from "./SequelizeBookingRepository";
import {SyncOptions} from "sequelize/types/sequelize";
import {UserRepository} from "../../../application/repositories/UserRepository";
import cls, {Namespace} from "cls-hooked";

export const CinetexTransactionNamespace: Namespace = cls.createNamespace("cinetex-transaction")

export class SequelizeRepositories implements Repositories {

    private readonly userRepository: SequelizeUserRepository
    private readonly movieRepository: SequelizeMovieRepository
    private readonly theatreRepository: SequelizeTheatreRepository
    private readonly scheduleRepository: SequelizeScheduleRepository
    private readonly bookingRepository: SequelizeBookingRepository

    constructor(private readonly sequelize: Sequelize) {
        Sequelize.useCLS(CinetexTransactionNamespace)
        this.userRepository = new SequelizeUserRepository(sequelize);
        this.movieRepository = new SequelizeMovieRepository(sequelize);
        this.theatreRepository = new SequelizeTheatreRepository(sequelize);
        this.scheduleRepository = new SequelizeScheduleRepository(sequelize);
        this.bookingRepository = new SequelizeBookingRepository(sequelize);
        TheatreModel.hasMany(ScheduleModel, { foreignKey: "theatreId" });
        TheatreModel.hasMany(BookingModel, { foreignKey: "theatreId" });
        MovieModel.hasMany(ScheduleModel, { foreignKey: "movieId" });
        MovieModel.hasMany(TicketModel, { foreignKey: "movieId" });
        UserModel.hasMany(BookingModel, { foreignKey: "userId" });
    }

    async sync(options?: SyncOptions): Promise<void> {
        await this.sequelize.sync(options);
        if (options?.force) {
            await this.userRepository.createUserCredentialsPackage();
            await this.userRepository.createUserCredentialsPackageBody();
            await this.bookingRepository.dropTicketSequence();
            await this.bookingRepository.createTicketSequence();
            await this.bookingRepository.createTicketTrigger();
        }
    }

    async transaction(callback: (tx: any) => Promise<void>): Promise<void> {
        await this.sequelize.transaction(async (tx: any) => {
            await callback(tx);
        });
    }

    get User(): UserRepository {
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
