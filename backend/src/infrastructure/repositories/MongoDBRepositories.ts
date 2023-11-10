import {MongoDBModels} from "./MongoDBModels";
import {Repositories} from "../../application/repositories/Repositories";
import {MongoDBMovieRepository} from "./MongoDBMovieRepository";
import {MongoDBTheatreRepository} from "./MongoDBTheatreRepository";
import {MongoDBScheduleRepository} from "./MongoDBScheduleRepository";
import {MongoDBBookingRepository} from "./MongoDBBookingRepository";
import {MongoDBUserRepository} from "./MongoDBUserRepository";

export class MongoDBRepositories implements Repositories {

    private readonly models: MongoDBModels = new MongoDBModels();

    readonly movie = new MongoDBMovieRepository(this.models.Movie);

    readonly theatre = new MongoDBTheatreRepository(this.models.Theatre);

    readonly schedule = new MongoDBScheduleRepository(this.models.Schedule)

    readonly booking = new MongoDBBookingRepository(this.models.Booking);

    readonly user = new MongoDBUserRepository(this.models.User);
}
