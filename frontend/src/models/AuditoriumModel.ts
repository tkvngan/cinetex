import {Booking, Movie, Screen, SeatPosition, SeatType, Theatre, Ticket} from "cinetex-core/dist/domain/entities";
import {UseCaseCollection} from "cinetex-core/dist/application";

export interface SeatModel extends SeatPosition {
    readonly row: number;
    readonly column: number;
    readonly type: SeatType;
    readonly isOccupied: boolean;
    readonly isSelected: boolean;
}

export interface AuditoriumModel {
    readonly movie: Movie,
    readonly theatre: Theatre
    readonly screenId: number;
    readonly screen: Screen;
    readonly rows: number;
    readonly columns: number;
    readonly seats: readonly (readonly SeatModel[])[];

    getSelectedSeats(): readonly SeatModel[];
    getAvailableSeats(): readonly SeatModel[];

    isFrontRowSeat(seat: SeatModel): boolean;
    isSideColumnSeat(seat: SeatModel): boolean;

    subscribe(listener: (this: this, seats?: SeatModel[]) => void): { readonly unsubscribe: () => void};

    selectSeat(row: number, column: number): void;
    unselectSeat(row: number, column: number): void;
}

class SeatModelImpl implements SeatModel {
    readonly row: number;
    readonly column: number;
    readonly type: SeatType;
    private _isOccupied: boolean;
    private _isSelected: boolean;

    constructor(row: number, column: number, type: SeatType, isOccupied?: boolean, isSelected?: boolean) {
        this.row = row;
        this.column = column;
        this.type = type;
        this._isOccupied = isOccupied ?? false;
        this._isSelected = isSelected ?? false;
    }

    get isOccupied(): boolean {
        return this._isOccupied
    }

    set isOccupied(value: boolean) {
        this._isOccupied = value
    }

    get isSelected(): boolean {
        return this._isSelected
    }

    set isSelected(value: boolean) {
        this._isSelected = value
    }

}

class AuditoriumModelImpl implements AuditoriumModel {
    readonly interactors: UseCaseCollection
    readonly movie: Movie
    readonly theatre: Theatre
    readonly screenId: number;
    readonly screen: Screen;

    private readonly _seats: SeatModelImpl[][]
    private changeListeners: ((this: this, seats?: SeatModel[]) => void)[] = []

    constructor(interactors: UseCaseCollection, movie: Movie, theatre: Theatre, screenId: number, occupiedSeats: SeatPosition[]) {
        this.interactors = interactors
        this.movie = movie
        this.theatre = theatre
        this.screenId = screenId
        this.screen = theatre.screens[screenId]
        this._seats = this.screen.seats.map((row, rowIndex) => row.map((seatType, columnIndex) =>
            new SeatModelImpl(
                rowIndex, columnIndex, seatType, occupiedSeats.some(({row, column}) => row === rowIndex && column === columnIndex)
            )
        ))
    }

    get rows(): number {
        return this.screen.rows
    }

    get columns(): number {
        return this.screen.columns
    }

    get seats(): readonly (readonly SeatModel[])[] {
        return this._seats
    }

    subscribe(listener: (this: this, seats?: SeatModel[]) => void): { readonly unsubscribe: () => void } {
        this.changeListeners.push(listener)
        return {
            unsubscribe: () => {
                this.changeListeners = this.changeListeners.filter(l => l !== listener)
            }
        }
    }

    notifyChange(seats?: SeatModel[]) {
        this.changeListeners.forEach(listener => listener.call(this, seats))
    }

    selectSeat(row: number, column: number): void {
        const seat = this._seats[row][column]
        if (seat.isOccupied) {
            return
        }
        seat.isSelected = true
        this.notifyChange([seat])
    }

    unselectSeat(row: number, column: number) {
        const seat = this._seats[row][column]
        seat.isSelected = false
        this.notifyChange([seat])
    }

    getSelectedSeats(): readonly SeatModel[] {
        return this._seats.flatMap(row => row.filter(seat => seat.isSelected))
    }

    getAvailableSeats(): readonly SeatModel[] {
        return this._seats.flatMap(row => row.filter(seat => seat.type !== SeatType.Unavailable && !seat.isOccupied && !seat.isSelected))
    }



    isFrontRowSeat(seat: SeatModel): boolean {
        return seat.row < this.screen.frontRows
    }

    isSideColumnSeat(seat: SeatModel): boolean {
        return seat.column < this.screen.sideColumns || seat.column >= this.screen.columns - this.screen.sideColumns
    }

}

function error(message: string): never {
    throw new Error(message)
}

export async function createAuditoriumModel(interactors: UseCaseCollection, movieId: string, theatreId: string, screenId: number, date: string, time: string): Promise<AuditoriumModel> {
    const movie = await interactors.GetMovieById.invoke({id: movieId}) ?? error(`Movie with id ${movieId} not found`)
    const theatre = await interactors.GetTheatreById.invoke({id: theatreId}) ?? error(`Theatre with id ${theatreId} not found`)
    const occupiedSeats = (await interactors.GetBookingsByTheatreId.invoke({theatreId: theatreId}))
        .flatMap((booking: Booking) => booking.tickets)
        .filter((ticket: Ticket) => ticket.screenId === screenId && ticket.showDate === date && ticket.showTime === time)
        .map(ticket => ticket.seat)
    return new AuditoriumModelImpl(interactors, movie, theatre, screenId, occupiedSeats)
}

export default createAuditoriumModel
