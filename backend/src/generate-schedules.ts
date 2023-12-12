import {Movie, Schedule, Theatre, TimeSlot} from "cinetex-core/dist/domain/entities";
import {ObjectId} from "mongodb";

const dates: readonly string[] = [
    "2023-12-01",
    "2023-12-02",
    "2023-12-03",
    "2023-12-04",
    "2023-12-05",
    "2023-12-06",
    "2023-12-07",
    "2023-12-08",
    "2023-12-09",
    "2023-12-10",
    "2023-12-11",
    "2023-12-12",
    "2023-12-13",
    "2023-12-14",
    "2023-12-15",
    "2023-12-16",
    "2023-12-17",
    "2023-12-18",
    "2023-12-19",
    "2023-12-20",
    "2023-12-21",
    "2023-12-22",
    "2023-12-23",
    "2023-12-24",
    "2023-12-25",
    "2023-12-26",
    "2023-12-27",
    "2023-12-28",
    "2023-12-29",
    "2023-12-30",
    "2023-12-31",
    "2024-01-01",
    "2024-01-02",
    "2024-01-03",
    "2024-01-04",
    "2024-01-05",
    "2024-01-06",
    "2024-01-07",
    "2024-01-08",
    "2024-01-09",
    "2024-01-10",
    "2024-01-11",
    "2024-01-12",
    "2024-01-13",
    "2024-01-14",
    "2024-01-15",
    "2024-01-16",
    "2024-01-17",
    "2024-01-18",
    "2024-01-19",
    "2024-01-20",
    "2024-01-21",
    "2024-01-22",
    "2024-01-23",
    "2024-01-24",
    "2024-01-25",
    "2024-01-26",
    "2024-01-27",
    "2024-01-28",
    "2024-01-29",
    "2024-01-30",
    "2024-01-31"
]

function shuffle(array: readonly any[]): any[] {
    let shuffledArray = [...array];
    let currentIndex = shuffledArray.length, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[currentIndex]];
    }
    return shuffledArray;
}

const T1 = "14:30"
const T2 = "18:00"
const T3 = "21:15"

type Entry = {
    movieId: string;
    theatreId: string;
    screenId: number;
    slots: Map<string, string[]>
}

export function generateSchedules(movies: Movie[], theatres: Theatre[]): Schedule[] {
    console.log("generateSchedules: ", JSON.stringify(movies[0], null, 2))
    const entries = new Map<string, Entry>()
    const movieBlock = 2
    let movieIxStart = 0
    for (const date of dates) {
        for (const theatre of theatres) {
            for (let screenId = 0; screenId < theatre.screens.length; screenId++) {
                for (const time of [T1, T2, T3]) {
                    const movieIx = Math.min(movieIxStart + Math.trunc(Math.random() * movieBlock), movies.length - 1)
                    const movieId = movies[movieIx].id
                    const key = `${movieId}-${theatre.id}-${screenId}`
                    let entry = entries.get(key)
                    if (entry === undefined) {
                        entry = <Entry> {
                            movieId: movieId,
                            theatreId: theatre.id,
                            screenId: screenId,
                            slots: new Map<string, string[]>()
                        }
                        entries.set(key, entry)
                    }
                    let slots = entry.slots.get(date)
                    if (slots === undefined) {
                        slots = []
                        entry.slots.set(date, slots)
                    }
                    slots.push(time)
                }
            }
        }
        movieIxStart++;
    }
    const schedules: Schedule[] = []
    for (const [key, entry] of entries.entries()) {
        const slots: TimeSlot[] = []
        for (const [date, times] of entry.slots.entries()) {
            slots.push({date: date, times: times})
        }
        schedules.push({
            id: new ObjectId().toHexString(),
            movieId: entry.movieId,
            theatreId: entry.theatreId,
            screenId: entry.screenId,
            showTimes: slots
        })
    }
    return schedules
}
//
// function main() {
//     const fs = require('fs');
//     fs.readFile('../data/theatres.json', 'utf8', async function (err: any, data: any) {
//         if (err) {
//             return console.log(err);
//         }
//         const theatres: Theatre[] = JSON.parse(data);
//         const schedules: Schedule[] = generateScheduleForTheatre(theatres)
//         console.log(JSON.stringify(schedules, null, 2))
//     })
// }
//
// main();
