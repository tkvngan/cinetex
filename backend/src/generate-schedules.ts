import {Schedule, Theatre, TimeSlot} from "cinetex-core/dist/domain/entities";
import {ObjectId} from "mongodb";

const movieIds: readonly string[] = [
   "6563a43f92c740d467db925b",
    "6563a43f92c740d467db925d",
    "6563a43f92c740d467db9269",
    "6563a43f92c740d467db9275",
    "6563a43f92c740d467db9277",
    "6563a43f92c740d467db9279",
    "6563a43f92c740d467db927b",
    "6563a43f92c740d467db9287",
    "6563a43f92c740d467db9294",
    "6563a43f92c740d467db92a0",
    "6563a43f92c740d467db92ac",
    "6563a43f92c740d467db92b8",
    "6563a43f92c740d467db92ba",
    "6563a43f92c740d467db92c7",
    "6563a43f92c740d467db92d3",
    "6563a43f92c740d467db92df",
    "6563a43f92c740d467db92e1",
    "6563a43f92c740d467db92ed",
    "6563a43f92c740d467db92fa",
    "6563a43f92c740d467db92fc",
    "6563a43f92c740d467db9308",
    "6563a43f92c740d467db9315",
    "6563a43f92c740d467db9321",
    "6563a43f92c740d467db9323",
    "6563a43f92c740d467db932f",
    "6563a43f92c740d467db9331",
    "6563a43f92c740d467db9333",
    "6563a43f92c740d467db933f",
    "6563a43f92c740d467db934b",
    "6563a43f92c740d467db9357",
    "6563a43f92c740d467db9359",
    "6563a43f92c740d467db9366",
    "6563a43f92c740d467db9368",
    "6563a43f92c740d467db9374",
    "6563a43f92c740d467db9381",
    "6563a43f92c740d467db9383",
    "6563a43f92c740d467db9390",
    "6563a43f92c740d467db9393",
    "6563a43f92c740d467db9395",
    "6563a43f92c740d467db93a1",
    "6563a43f92c740d467db93ad",
    "6563a43f92c740d467db93ba",
    "6563a43f92c740d467db93c6",
    "6563a43f92c740d467db93d2",
    "6563a43f92c740d467db93df",
    "6563a43f92c740d467db93eb",
    "6563a43f92c740d467db93f7",
    "6563a43f92c740d467db93f9",
    "6563a43f92c740d467db93fb",
    "6563a43f92c740d467db93fd",
    "6563a43f92c740d467db9409",
    "6563a43f92c740d467db940b",
    "6563a43f92c740d467db940d",
    "6563a43f92c740d467db9419",
    "6563a43f92c740d467db9426",
    "6563a43f92c740d467db9432",
    "6563a43f92c740d467db943e",
    "6563a43f92c740d467db9440",
    "6563a43f92c740d467db944d",
    "6563a43f92c740d467db945a",
    "6563a43f92c740d467db9466",
    "6563a43f92c740d467db9472",
    "6563a43f92c740d467db9474",
    "6563a43f92c740d467db9476",
    "6563a43f92c740d467db9478",
    "6563a43f92c740d467db9484",
    "6563a43f92c740d467db9490",
    "6563a43f92c740d467db949c",
    "6563a43f92c740d467db949e",
    "6563a43f92c740d467db94aa",
]


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

function generateScheduleForTheatre(theatres: Theatre[]): Schedule[] {
    const entries = new Map<string, {movieId: string; theatreId: string; screenId: number; slots: Map<string, string[]>}>()
    const movieBlock = 2
    let movieIxStart = 0
    for (const date of dates) {
        for (const theatre of theatres) {
            for (const screen of theatre.screens) {
                for (const time of [T1, T2, T3]) {
                    const movieIx = Math.min(movieIxStart + Math.trunc(Math.random() * movieBlock), movieIds.length - 1)
                    const movieId = movieIds[movieIx]
                    const key = `${movieId}-${theatre.id}-${screen.id}`
                    let entry = entries.get(key)
                    if (entry === undefined) {
                        entry = {
                            movieId: movieId,
                            theatreId: theatre.id,
                            screenId: screen.id,
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

function main() {
    const fs = require('fs');
    fs.readFile('../data/theatres.json', 'utf8', async function (err: any, data: any) {
        if (err) {
            return console.log(err);
        }
        const theatres: Theatre[] = JSON.parse(data);
        const schedules: Schedule[] = generateScheduleForTheatre(theatres)
        console.log(JSON.stringify(schedules, null, 2))
    })
}

main();
