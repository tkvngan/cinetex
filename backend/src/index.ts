import {MongoDBModels} from "./infrastructure/repositories/MongoDBModels";
import {SampleMovies} from "./infrastructure/repositories/SampleMovies";
import {SampleTheatres} from "./infrastructure/repositories/SampleTheatres";
import {MongoDBRepository} from "./infrastructure/repositories/MongoDBRepository";


MongoDBModels.connect().then(async () => {
    console.log("Connected to MongoDB")
});

const models = new MongoDBModels()
const repository = new MongoDBRepository()

async function storeSampleMovies(): Promise<void> {
    for (const movie of SampleMovies) {
        const createdMovie = await repository.addMovie(movie)
        console.log("Created movie: " + JSON.stringify(createdMovie, null, 4))
    }
    console.log("Number of movies: " + SampleMovies.length)
}

async function listAllMovies(): Promise<void> {
    const movies = await models.Movie.find({})
    for (const movie of movies) {
        console.log(JSON.stringify(movie, null, 4) + "\n,")
    }
}

function run(action: () => Promise<void>): Promise<void> {
    return action()
}

run (async () => {
    const count = await repository.deleteAllMovies()
    console.log("Deleted " + count + " movies.")
    // await storeSampleMovies()
}).then(() => {
    console.log("Done.")
    process.exit(0)
}).catch((err) => {
    console.error("Failed: " + err)
    process.exit(1)
});
