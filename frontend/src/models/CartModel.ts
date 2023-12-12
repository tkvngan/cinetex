import {SeatModel} from "./AuditoriumModel";
import {Booking, Movie, SeatPosition, SeatType, Theatre} from "cinetex-core/dist/domain/entities";
import {UseCaseCollection} from "cinetex-core/dist/application";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

export interface CartModel {
    readonly items: readonly CartItemModel[];
    readonly totalPrice: number;

    addItem(movie: Movie, theatre: Theatre, screenId: number, date: string, time: string, seat: SeatPosition, price: number): CartItemModel;
    removeItem(item: CartItemModel): void;

    updateItems(movie: Movie, theatre: Theatre, screenId: number, date: string, time: string, seats: SeatPosition[]): void;

    subscribe(listener: (this: this, change?: { action: 'add' | 'remove'; items: readonly CartItemModel[]}) => void): { readonly unsubscribe: () => void };

    clear(): void;

    checkout(interactors: UseCaseCollection, credentials: SecurityCredentials): Promise<void>;

}

export interface CartItemModel {
    readonly movie: Movie;
    readonly theatre: Theatre;
    readonly screenId: number;
    readonly date: string;
    readonly time: string;
    readonly seat: SeatPosition
    readonly price: number;
}

class CartItemModelImpl implements CartItemModel {
    readonly movie: Movie;
    readonly theatre: Theatre;
    readonly screenId: number;
    readonly date: string;
    readonly time: string;
    readonly seat: SeatPosition;
    readonly price: number;


    constructor(movie: Movie, theatre: Theatre, screenId: number, date: string, time: string, seat: SeatPosition, price: number) {
        this.movie = movie;
        this.theatre = theatre;
        this.screenId = screenId;
        this.date = date;
        this.time = time;
        this.seat = seat;
        this.price = price;
    }
}

class CartModelImpl implements CartModel {
    private readonly _items: CartItemModel[];
    private _totalPrice: number;
    private _changeListeners: ((this: this, change?: { action: 'add' | 'remove'; items: readonly CartItemModel[]}) => void)[] = [];

    constructor(items: CartItemModel[], totalPrice: number) {
        this._items = items;
        this._totalPrice = totalPrice;
    }

    get items(): readonly CartItemModel[] {
        return this._items;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    addItem(movie: Movie, theatre: Theatre, screenId: number, date: string, time: string, seat: SeatPosition, price: number): CartItemModel {
        const item = new CartItemModelImpl(movie, theatre, screenId, date, time, seat, price);
        this._items.push(item);
        this._totalPrice += price;
        this.notifyItemsAdded([item])
        return item;
    }

    updateItems(movie: Movie, theatre: Theatre, screenId: number, date: string, time: string, seats: SeatPosition[]) {
        const items = this._items.filter(item => {
            return item.movie.id !== movie.id ||
                item.theatre.id !== theatre.id ||
                item.screenId !== screenId ||
                item.date !== date ||
                item.time !== time
        });
        for (const seat of seats) {
            const item = new CartItemModelImpl(movie, theatre, screenId, date, time, seat, 10.0);
            items.push(item);
        }
        this._items.splice(0, this._items.length);
        this._items.push(...items);
        this.notifyItemsRemoved(this._items)
    }

    removeItem(item: CartItemModel): boolean {
        const index = this._items.indexOf(item);
        if (index !== -1) {
            this._items.splice(index, 1);
            this._totalPrice -= item.price;
            this.notifyItemsRemoved([item])
            return true
        }
        return false
    }

    notifyChange(change?: { action: 'add' | 'remove'; items: readonly CartItemModel[] }): void {
        this._changeListeners.forEach(listener => listener.call(this, change))
    }

    notifyItemsAdded(items: CartItemModel[]): void {
        this.notifyChange({action: 'add', items})
    }

    notifyItemsRemoved(items: CartItemModel[]): void {
        this.notifyChange({action: 'remove', items})
    }

    subscribe(listener: (this: this, change?: { action: 'add' | 'remove'; items: readonly CartItemModel[] }) => void) {
        this._changeListeners.push(listener);
        return {
            unsubscribe: () => {
                this._changeListeners = this._changeListeners.filter(l => l !== listener)
            }
        }
    }

    clear(): void {
        const items = [...this._items];
        this._items.splice(0, this._items.length);
        this._totalPrice = 0;
        this.notifyItemsRemoved(items);
    }

    async checkout(interactors: UseCaseCollection, credentials: SecurityCredentials): Promise<void> {

        const itemsByTheatre: Record<string, CartItemModel[]> = {}

        for  (const item of this._items) {
            if (!itemsByTheatre[item.theatre.id]) {
                itemsByTheatre[item.theatre.id] = []
            }
            itemsByTheatre[item.theatre.id].push(item)
        }

        for (const theatreId in itemsByTheatre) {
            const items = itemsByTheatre[theatreId]
            const tickets = items.map(item => ({
                movieId: item.movie.id,
                screenId: item.screenId,
                showDate: item.date,
                showTime: item.time,
                seat: item.seat,
                price: item.price
            }));
            const booking: Omit<Booking, "id"> = {
                userId: credentials.user.id,
                theatreId: theatreId,
                bookingTime: new Date().toISOString(),
                totalPrice: items.reduce((acc, item) => acc + item.price, 0),
                tickets
            }
            await interactors.CreateBooking.invoke(booking, credentials);
        }
    }
}

export function createCartModel(items: CartItemModel[] = [], totalPrice: number = 0): CartModel {
    return new CartModelImpl(items, totalPrice);
}
