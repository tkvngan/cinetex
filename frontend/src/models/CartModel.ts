import {Booking, Movie, SeatPosition, Theatre} from "cinetex-core/dist/domain/entities";
import {UseCaseCollection} from "cinetex-core/dist/application";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

export interface CartModel {
    readonly items: readonly CartItem[];
    readonly totalPrice: number;
    addItem(movie: Movie, theatre: Theatre, screenId: number, date: string, time: string, seat: SeatPosition, price: number): CartItem;
    removeItem(item: CartItem): void;
    updateItems(movie: Movie, theatre: Theatre, screenId: number, date: string, time: string, seats: SeatPosition[]): void;
    clear(): void;
    subscribe(listener: (this: this, change?: { action: 'add' | 'remove'; items: readonly CartItem[]}) => void): { readonly unsubscribe: () => void };
    checkout(interactors: UseCaseCollection, credentials: SecurityCredentials): Promise<void>;
}

export interface CartItem {
    readonly movie: Movie,
    readonly theatre: Theatre,
    readonly screenId: number,
    readonly date: string,
    readonly time: string,
    readonly seat: SeatPosition,
    readonly price: number
}

class CartModelImpl implements CartModel {
    private readonly _items: CartItem[];
    private _totalPrice: number;
    private _changeListeners: ((this: this, change?: { action: 'add' | 'remove'; items: readonly CartItem[]}) => void)[] = [];

    constructor(items: CartItem[], totalPrice: number) {
        this._items = items;
        this._totalPrice = totalPrice;
    }

    get items(): readonly CartItem[] {
        return this._items;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    addItem(movie: Movie, theatre: Theatre, screenId: number, date: string, time: string, seat: SeatPosition, price: number): CartItem {
        const item = <CartItem> { movie, theatre, screenId, date, time, seat, price }
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
            const item = <CartItem> { movie, theatre, screenId, date, time, seat, price: 10.0 }
            items.push(item);
        }
        this._items.splice(0, this._items.length);
        this._items.push(...items);
        this.notifyItemsRemoved(this._items)
    }

    removeItem(item: CartItem): boolean {
        const index = this._items.indexOf(item);
        if (index !== -1) {
            this._items.splice(index, 1);
            this._totalPrice -= item.price;
            this.notifyItemsRemoved([item])
            return true
        }
        return false
    }

    notifyChange(change?: { action: 'add' | 'remove'; items: readonly CartItem[] }): void {
        this._changeListeners.forEach(listener => listener.call(this, change))
    }

    notifyItemsAdded(items: CartItem[]): void {
        this.notifyChange({action: 'add', items})
    }

    notifyItemsRemoved(items: CartItem[]): void {
        this.notifyChange({action: 'remove', items})
    }

    subscribe(listener: (this: this, change?: { action: 'add' | 'remove'; items: readonly CartItem[] }) => void) {
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
        const itemsByTheatre: Record<string, CartItem[]> = {}
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
            this.clear();
        }
    }
}

export function CartModel(items: CartItem[] = [], totalPrice: number = 0): CartModel {
    return new CartModelImpl(items, totalPrice);
}
