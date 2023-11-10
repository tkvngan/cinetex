import {SeatType, Theatre} from "@cinetex/shared/domain/entities";
import {Types} from "mongoose";

export const SampleTheatres: Theatre[] = [
    {
        id: "654d86124c67be25bc7cf408",
        name: "Centennial Grand Theatre",
        location: {
            street: "941 Progress Ave",
            city: "Toronto",
            state: "ON",
            zip: "M1G 3T8"
        },
        screens: [
            {
                id: 1,
                name: "Screen 1",
                rows: 15,
                columns: 20,
                seats: generateSeats(15, 20)
            },
            {
                id: 2,
                name: "Screen 2",
                rows: 20,
                columns: 30,
                seats: generateSeats(20, 30)
            }
        ]
    }
]

function generateSeats(rows: number, columns: number): SeatType[][] {
    const seats: SeatType[][] = [];
    const sideMax = columns / 4;
    for (let row = 0; row < rows; row++) {
        const seatClass = (row < rows / 3) ? SeatType.Economy : (row < rows / 3 * 2) ? SeatType.Standard : SeatType.Luxury;
        const side = sideMax - sideMax * (row / rows);
        const rowSeats: SeatType[] = [];
        for (let col = 0; col < columns; col++) {
            if (col < side || col >= columns - side) {
                rowSeats.push(SeatType.Unavailable);
            } else {
                rowSeats.push(seatClass);
            }
        }
        seats.push(rowSeats);
    }
    return seats;
}


