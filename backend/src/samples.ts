import {connectMongoDB, MongoDBRepositories} from "./infrastructure/repositories";
import fs from "fs";
import {Movie, Schedule, Theatre} from "core/dist/domain/entities";
import {Repositories} from "./application/repositories";

export async function loadSamples<T>(fileName: string): Promise<T[]> {
    return await new Promise<T[]>((resolve, reject) => {
        fs.readFile(fileName, "utf8", async (err, data: string) => {
            err ? reject(err) : resolve(JSON.parse(data) as T[])
        })
    })
}

export async function storeSamples<T>(
    data: T[], deleteAll: (command?: any) => Promise<any>, add: (item: T) => Promise<any>): Promise<void> {
    await deleteAll()
    for (const item of data) {
        await add(item)
    }
    return
}

export async function installSamples<T>(fileName: string, deleteAll: (command?: any) => Promise<any>, add: (item: T) => Promise<any>, getAll: () => Promise<T[]>): Promise<T[]> {
    const data = await loadSamples<T>(fileName)
    await storeSamples<T>(data, deleteAll, add)
    return await getAll()
}

export async function installAllSamples(repositories: Repositories): Promise<void> {
    const {Movie, Schedule, Theatre} = repositories
    await installSamples<Movie>("SampleMovies.json", Movie.deleteAllMovies, Movie.addMovie, Movie.getAllMovies)
    await installSamples("SampleTheatres.json", ()=>Theatre.deleteTheatresByQuery({}), Theatre.addTheatre, Theatre.getAllTheatres)
    await installSamples("SampleSchedules.json", ()=>Schedule.deleteSchedulesByQuery({}), Schedule.addSchedule, Schedule.getAllSchedules)
}
