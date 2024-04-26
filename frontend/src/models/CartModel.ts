import {Booking, SeatPosition} from "cinetex-core/dist/domain/entities/Booking";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import {Theatre} from "cinetex-core/dist/domain/entities/Theatre";

import {Credentials} from "cinetex-core/dist/security/Credentials";
import {newObjectId} from "cinetex-core/dist/domain/types";
import {ViewModel} from "./ViewModel";
import {CreateBooking} from "cinetex-core/dist/application";

export interface CartState {
    readonly items: readonly CartItem[];
    readonly totalPrice: number;
}

export type CardAddItemIntent = {
    readonly action: 'add',
    readonly movie: Movie,
    readonly theatre: Theatre,
    readonly screenId: number,
    readonly date: string,
    readonly time: string,
    readonly seat: SeatPosition,
    readonly price: number
}

export type CartRemoveItemIntent = {
    readonly action: 'remove',
    readonly item: CartItem
}

export type CartUpdateIntent = {
    readonly action: 'update'
    readonly movie: Movie,
    readonly theatre: Theatre,
    readonly screenId: number,
    readonly date: string,
    readonly time: string,
    readonly seats: SeatPosition[]
}

export type CartCheckoutIntent = {
    readonly action: 'checkout',
    readonly credentials: Credentials
}

export type CartClearIntent = {
    readonly action: 'clear'
}

export type CartIntent =
    | CardAddItemIntent
    | CartRemoveItemIntent
    | CartUpdateIntent
    | CartCheckoutIntent
    | CartClearIntent

export interface CartItem {
    readonly movie: Movie,
    readonly theatre: Theatre,
    readonly screenId: number,
    readonly date: string,
    readonly time: string,
    readonly seat: SeatPosition,
    readonly price: number
}

export class CartModel extends ViewModel<CartState, CartIntent> {

    public constructor(readonly CreateBooking: CreateBooking) {
        super({items: [], totalPrice: 0})
    }

    public async handle(intent: CartIntent): Promise<void> {
        switch (intent.action) {
            case 'add':
                this.addItem(intent)
                break;
            case 'remove':
                this.removeItem(intent)
                break;
            case 'update':
                this.update(intent)
                break;
            case 'checkout':
                await this.checkout(intent)
                break;
            case 'clear':
                this.clear(intent)
                break;
        }
    }

    private addItem(intent: CardAddItemIntent) {
        const { movie, theatre, screenId, date, time, seat, price } = intent;
        const item = <CartItem> { movie, theatre, screenId, date, time, seat, price }
        this.state = {
            items: [...this.state.items, item],
            totalPrice: this.state.totalPrice + price
        }
    }

    private removeItem(intent : CartRemoveItemIntent) {
        const { item } = intent;
        const index = this.state.items.indexOf(item);
        if (index !== -1) {
            this.state = {
                items: [...this.state.items].splice(index, 1),
                totalPrice: this.state.totalPrice - item.price
            }
        }
        return false
    }

    private update(intent: CartUpdateIntent) {
        const { movie, theatre, screenId, date, time, seats } = intent;
        const items = this.state.items.filter(item => (
            item.movie.id !== movie.id
            || item.theatre.id !== theatre.id
            || item.screenId !== screenId
            || item.date !== date
            || item.time !== time
        ));
        for (const seat of seats) {
            items.push(<CartItem> { movie, theatre, screenId, date, time, seat, price: 10.0 });
        }
        this.state = {
            items,
            totalPrice: items.reduce((acc, item) => acc + item.price, 0)
        }
    }

    private clear(intent: CartClearIntent): void {
        this.state = { items: [], totalPrice: 0 }
    }

    private async checkout(intent: CartCheckoutIntent): Promise<void> {
        const itemsByTheatre: Record<string, CartItem[]> = {}
        for  (const item of this.state.items) {
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
            const booking: Booking = {
                id: newObjectId(),
                userId: intent.credentials.user.id,
                theatreId: theatreId,
                bookingTime: new Date().toISOString(),
                totalPrice: items.reduce((acc, item) => acc + item.price, 0),
                tickets
            }
            await this.CreateBooking.invoke(booking, intent.credentials);
            this.state = { items: [], totalPrice: 0 }
        }
    }
}
