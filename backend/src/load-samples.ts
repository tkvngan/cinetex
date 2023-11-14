import {connectMongoDB, MongoDBRepositories} from "./infrastructure/repositories";
import fs from "fs";
import {Movie, Schedule, Theatre} from "shared/dist/domain/entities";

connectMongoDB().then(async () => {
    console.log("Connected to MongoDB")
});

async function loadSamples<T>(fileName: string): Promise<T[]> {
    return await new Promise<T[]>((resolve, reject) => {
        fs.readFile(fileName, "utf8", async (err, data: string) => {
            err ? reject(err) : resolve(JSON.parse(data) as T[])
        })
    })
}

async function storeSamples<T>(
    data: T[], deleteAll: (command?: any) => Promise<any>, add: (item: T) => Promise<any>): Promise<void> {
    await deleteAll()
    for (const item of data) {
        await add(item)
    }
    return
}

async function installSamples<T>(fileName: string, deleteAll: (command?: any) => Promise<any>, add: (item: T) => Promise<any>, getAll: () => Promise<T[]>): Promise<T[]> {
    const data = await loadSamples<T>(fileName)
    await storeSamples<T>(data, deleteAll, add)
    return await getAll()
}

async function main(): Promise<void> {
    const repositories = MongoDBRepositories()
    const {Movie, Schedule, Theatre} = repositories

    const movies = await installSamples<Movie>("SampleMovies.json", Movie.deleteAllMovies, Movie.addMovie, Movie.getAllMovies)
    console.log(JSON.stringify(movies, null, 2))

    const theatres = await installSamples("SampleTheatres.json", ()=>Theatre.deleteTheatresByQuery({}), Theatre.addTheatre, Theatre.getAllTheatres)
    console.log(JSON.stringify(theatres, null, 2))

    const schedules = await installSamples("SampleSchedules.json", ()=>Schedule.deleteSchedulesByQuery({}), Schedule.addSchedule, Schedule.getAllSchedules)
    console.log(JSON.stringify(schedules, null, 2))
}

main().then(() => {
    console.log("Done.")
    process.exit(0)
}).catch((err) => {
    console.error("Failed: " + err)
    process.exit(1)
});
