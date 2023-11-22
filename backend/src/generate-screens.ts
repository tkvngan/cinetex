import { Theatre } from 'cinetex-core/dist/domain/entities';

export function generateScreen(id: number, name: string) {
    const rowCount = 5 * Math.trunc(Math.random() * 3 + 3);
    const columnCount = 5 * Math.trunc(Math.random() * 3 + 4);
    const frontRows = Math.trunc(rowCount / 5)
    const sideColumns = Math.trunc(columnCount / 5)

    function generateSeats(rowCount: number, columnCount: number) {
        const seats = [];
        for (let i = 0; i < rowCount; i++) {
            const row = [];
            let seatType = 2;
            if (i < frontRows) {
                seatType = 1;
            } else if (i >= rowCount - frontRows) {
                seatType = 3;
            } else {
                seatType = 2;
            }
            for (let j = 0; j < columnCount; j++) {
                let st = seatType;
                if (seatType === 1) {
                    if (j < sideColumns || j >= columnCount - sideColumns) {
                        st = 0;
                    }
                } else if (seatType === 2) {
                    const voidColumns = Math.trunc(sideColumns / 2);
                    if (j < voidColumns || j >= columnCount - voidColumns) {
                        st = 0;
                    }
                }
                row.push(st);
            }
            seats.push(row);
        }
        return seats;
    }

    return {
        id: id,
        name: name,
        rows: rowCount,
        columns: columnCount,
        frontRows: frontRows,
        sideColumns: sideColumns,
        seats: generateSeats(rowCount, columnCount),
    };

}

const SCREEN_NAMES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function main() {
    const fs = require('fs');
    fs.readFile('../SampleTheatres.json', 'utf8', async function (err: any, data: any) {
        if (err) {
            return console.log(err);
        }
        const theatres: Theatre[] = JSON.parse(data);
        for (let i = 0; i < theatres.length; i++) {
            const theatre = theatres[i];
            const screenCount = Math.trunc(Math.random() * 3) + 1;
            const screens = [];
            for (let id = 0; id < screenCount; id++) {
                const screen = generateScreen(id, SCREEN_NAMES[id]);
                screens.push(screen);
            }
            theatres[i] = { ...theatre, screens: screens };
        }
        console.log(JSON.stringify(theatres));

    })
}

main();
