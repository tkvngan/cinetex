import {Booking, SeatPosition, Ticket} from "cinetex-core/dist/domain/entities/Booking";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {Screen, SeatType, Theatre} from "cinetex-core/dist/domain/entities/Theatre";

import {ViewModel} from "./ViewModel";
import {GetBookingsByTheatreId, GetMovieById, GetTheatreById} from "cinetex-core/dist/application";

export type SeatPositions = Readonly<Record<number, Readonly<Record<number, true>>>> & {
    addedSeat(row: number, column: number): SeatPositions
    removedSeat(row: number, column: number): SeatPositions
    getSeats(): SeatPosition[]
}

export const SeatPositions: { new(): SeatPositions } = function() {
    return <SeatPositions> {
        addedSeat: function(this: SeatPositions, row: number, column: number): SeatPositions {
            return {
                ...this,
                [row]: {
                    ...this[row],
                    [column]: true
                }
            }
        },
        removedSeat: function(this: SeatPositions, row: number, column: number): SeatPositions {
            const newRow = {...this[row]}
            delete newRow[column]
            return {
                ...this,
                [row]: newRow
            }
        },
        getSeats: function(this: SeatPositions): SeatPosition[] {
            return Object.entries(this).flatMap(([row, columns]) =>
                Object.keys(columns).map(column => ({row: parseInt(row), column: parseInt(column)})))
        }
    }
} as any

export interface AuditoriumState {
    readonly movie: Movie,
    readonly theatre: Theatre
    readonly screen: Screen;
    readonly date: string;
    readonly time: string;
    readonly selectedSeatPositions: SeatPositions
    readonly occupiedSeatPositions: SeatPositions

    isSeatOccupied(row: number, column: number): boolean
    isSeatSelected(row: number, column: number): boolean

    isFrontRowSeat(row: number): boolean
    isSideColumnSeat(column: number): boolean

    getSeatType(row: number, column: number): SeatType
}

export const AuditoriumState: { new(): AuditoriumState } = function() {
    return <AuditoriumState> {
        isSeatOccupied: function(this: AuditoriumState, row: number, column: number): boolean {
            return this.occupiedSeatPositions[row]?.[column] === true
        },
        isSeatSelected: function(this: AuditoriumState, row: number, column: number): boolean {
            return this.selectedSeatPositions[row]?.[column] === true
        },
        isFrontRowSeat: function(this: AuditoriumState, row: number): boolean {
            return row < this.screen.frontRows
        },
        isSideColumnSeat: function(this: AuditoriumState, column: number): boolean {
            return column < this.screen.sideColumns || column >= this.screen.columns - this.screen.sideColumns
        },
        getSeatType: function(this: AuditoriumState, row: number, column: number): SeatType {
            return this.screen.seats[row][column]
        }
    }
} as any

export type AuditoriumIntent = {
    readonly action: 'initialize'
    readonly movieId: string
    readonly theatreId: string
    readonly screenId: number
    readonly date: string
    readonly time: string
} | {
    readonly action: 'selectSeat' | 'unselectSeat'
    readonly row: number
    readonly column: number
}

export class AuditoriumModel extends ViewModel<AuditoriumState | undefined, AuditoriumIntent> {

    public constructor(
        readonly GetMovieById: GetMovieById,
        readonly GetTheatreById: GetTheatreById,
        readonly GetBookingsByTheatreId: GetBookingsByTheatreId) {
        super(undefined)
    }

    public async handle(intent: AuditoriumIntent): Promise<void> {
        switch (intent.action) {
            case 'initialize':
                await this.initialize(intent.movieId, intent.theatreId, intent.screenId, intent.date, intent.time)
                break
            case 'selectSeat':
                this.selectSeat(intent.row, intent.column)
                break
            case 'unselectSeat':
                this.unselectSeat(intent.row, intent.column)
                break
        }
    }

    private isSeatOccupied(row: number, column: number): boolean {
        return this.state !== undefined ? this.state.isSeatOccupied(row, column) : false
    }

    private isSeatSelected(row: number, column: number): boolean {
        return this.state != undefined ? this.state.isSeatSelected(row, column) : false
    }

    private selectSeat(row: number, column: number): void {
        if (this.state === undefined || this.isSeatOccupied(row, column) || this.isSeatSelected(row, column)) {
            return
        }
        this.state = {
            ...this.state,
            selectedSeatPositions: this.state.selectedSeatPositions.addedSeat(row, column),
        }
    }

    private unselectSeat(row: number, column: number) {
        if (this.state == undefined || this.isSeatOccupied(row, column) || !this.isSeatSelected(row, column)) {
            return
        }
        this.state = {
            ...this.state,
            selectedSeatPositions: this.state.selectedSeatPositions.removedSeat(row, column),
        }
    }

    private async initialize(movieId: string, theatreId: string, screenId: number, date: string, time: string) {
        const movie = await this.GetMovieById.invoke({id: movieId})
        if (movie === undefined) {
            throw new Error(`Movie with id ${movieId} not found`)
        }
        const theatre = await this.GetTheatreById.invoke({id: theatreId})
        if (theatre === undefined) {
            throw new Error(`Theatre with id ${theatreId} not found`)
        }
        const screen = theatre.screens.find(screen => screen.id === screenId)
        if (screen === undefined) {
            throw new Error(`Screen with id ${screenId} not found`)
        }
        const bookings = await this.GetBookingsByTheatreId.invoke({theatreId: theatreId})
        const selectedSeatPositions = new SeatPositions()
        const occupiedSeatPositions = bookings
            .flatMap((booking: Booking) => booking.tickets)
            .filter((ticket: Ticket) =>
                ticket.screenId === screenId &&
                ticket.showDate === date &&
                ticket.showTime === time)
            .map(ticket => ticket.seat)
            .reduce<SeatPositions>((positions, seat) =>
                positions.addedSeat(seat.row, seat.column), new SeatPositions()
            )
        this.state = {
            ... new AuditoriumState(),
            movie, theatre, screen, date, time,
            selectedSeatPositions,
            occupiedSeatPositions,
        }
    }
}

