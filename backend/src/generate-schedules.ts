import fs from "fs";
import {generateScreen} from "./generate-screens";
import {Schedule, Theatre, TimeSlot} from "cinetex-core/dist/domain/entities";
import {ObjectId} from "mongodb";

const movieIds: readonly string[] = [
    "6551992414c9e2796127f60e",
    "6551992414c9e2796127f612",
    "6551992414c9e2796127f60a",
    "6551992414c9e2796127f616",
    "6551992414c9e2796127f60c",
    "6551992414c9e2796127f607",
    "6551992414c9e2796127f618",
    "6551992414c9e2796127f610",
    "6551992414c9e2796127f614",
]

const dates: readonly string[] = [
    "2023-11-21",
    "2023-11-22",
    "2023-11-23",
    "2023-11-24",
    "2023-11-25",
    "2023-11-26",
    "2023-11-27",
    "2023-11-28",
    "2023-11-29",
    "2023-11-30",
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

function generateScheduleForTheatre(theatre: Theatre): Schedule[] {
    const schedules: Schedule[] = []
    const theatreId = theatre.id
    for (const screen of theatre.screens) {
        const screenId = screen.id
        const movieDateTimes: Record<string, Record<string, Record<string, true>>> = {}
        for (const date of dates) {
            for (const time of ["14:30", "18:00", "21:15"]) {
                const movieId = movieIds[Math.trunc(movieIds.length * Math.random())]
                const dateTimes = movieDateTimes[movieId] ?? {}
                const times = dateTimes[date] ?? {}
                times[time] = true
                dateTimes[date] = times
                movieDateTimes[movieId] = dateTimes
            }
        }
        for (const movieId in movieDateTimes) {
            const timeSlots: TimeSlot[] = []
            for (const date in movieDateTimes[movieId]) {
                const times: string[] = []
                for (const time in movieDateTimes[movieId][date]) {
                    times.push(time)
                }
                timeSlots.push({date: date, times: times})
            }
            const schedule = <Schedule> {
                id: new ObjectId().toHexString(),
                movieId: movieId,
                theatreId: theatreId,
                screenId: screenId,
                showTimes: timeSlots
            }
            schedules.push(schedule)
        }
    }
    return schedules
}

function main() {
    const fs = require('fs');
    fs.readFile('../SampleTheatres.json', 'utf8', async function (err: any, data: any) {
        if (err) {
            return console.log(err);
        }
        const theatres: Theatre[] = JSON.parse(data);
        const schedules: Schedule[] = [];
        for (const theatre of theatres) {
            for (const schedule of generateScheduleForTheatre(theatre)) {
                schedules.push(schedule)
            }
        }
        console.log(JSON.stringify(schedules, null, 2))
    })
}

main();
