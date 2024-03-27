import fs from "fs";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {Repositories} from "./application/repositories/Repositories";
import {generateSchedules} from "./generate-schedules";

export async function loadSamplesFromFile<T>(fileName: string): Promise<T[]> {
    return await new Promise<T[]>((resolve, reject) => {
        fs.readFile(fileName, "utf8", async (err, data: string) => {
            err ? reject(err) : resolve(JSON.parse(data) as T[])
        })
    })
}

export async function installSamplesFromFile<T>(fileName: string, deleteAll: (command?: any) => Promise<any>, add: (item: T) => Promise<any>, getAll: () => Promise<T[]>): Promise<T[]> {
    return await installSamples<T>(await loadSamplesFromFile<T>(fileName), deleteAll, add, getAll)
}

export async function installSamples<T>(
    data: T[], deleteAll: (command?: any) => Promise<any>, add: (item: T) => Promise<any>, getAll: () => Promise<T[]>): Promise<T[]> {
    await deleteAll()
    for (const item of data) {
        await add(item)
    }
    return await getAll()
}

export async function installAllSamples(repositories: Repositories): Promise<void> {
    const { Movie, Schedule, Theatre } = repositories
    const allMovies = await installSamplesFromFile<Movie>(
        "data/movies.json",
        () => Movie.deleteAllMovies(),
        (movie) => {
            console.log("Adding movie: ", movie.id, "synopsis:", movie.synopsis?.length)
            return Movie.addMovie(movie)
        },
        () => Movie.getAllMovies()
    )
    const allTheatres = await installSamplesFromFile(
        "data/theatres.json",
        () => Theatre.deleteTheatresByQuery({}),
        (theatre) => Theatre.addTheatre(theatre),
        () => Theatre.getAllTheatres()
    )
    const schedules = generateSchedules(allMovies, allTheatres)
    const allSchedule = await installSamples(schedules,
        () => Schedule.deleteSchedulesByQuery({}),
        (schedule) =>Schedule.addSchedule(schedule),
        () => Schedule.getAllSchedules()
    )
    const data = {
        movies: allMovies,
        theatres: allTheatres,
        schedules: allSchedule
    }
    await new Promise<void>((resolve, reject) => {
        fs.writeFile("data/data.json", JSON.stringify(data, null, 4), (err) => {
            if (err) {
                console.error(err)
                reject(err)
            } else {
                resolve()
            }
        })
    })
}
