import {CartModel} from "../models/CartModel";
import React, {useEffect} from "react";
import * as bootstrap from "bootstrap"
import {AuthenticationModel} from "../models/AuthenticationModel";

export function CartView({ id, cart, authentication }: {
    id: string,
    cart: CartModel,
    authentication: AuthenticationModel
}) {

    const ref = React.useRef<HTMLDivElement>(null)
    const [cartState, setCartState] = React.useState(cart.state)
    const [credentials, setCredentials] = React.useState(authentication.state.credentials)

    useEffect(() => {
        const cartSubscriber = cart.subscribe((state) => {
            setCartState(state)
        })
        const authenticationSubscriber = authentication.subscribe((state) => {
            setCredentials(state.credentials)
        })
        return () => {
            cartSubscriber.dispose()
            authenticationSubscriber.dispose()
        }
    }, [])

    function dismiss() {
        const element = ref.current
        console.log("CartView: dismiss(): element =", element)
        if (element) {
            bootstrap.Offcanvas.getInstance(ref.current)?.hide();

        }
    }

    async function onCheckout() {
        if (credentials) {
            await cart.handle({ action: 'checkout', credentials })
        }
        dismiss()
    }

    return (
        <div id={id}
             className="offcanvas offcanvas-end w-50"
             ref={ref}
             tabIndex={-1} aria-labelledby={`${id}Title`}
             data-bs-theme="light">
            <div className="offcanvas-header">
                <button type="button"
                        className="btn btn-close"
                        onClick={()=>dismiss()}
                        aria-label="Close"
                        style={{filter: "none"}} // remove this if dark theme is used
                >
                </button>
            </div>
            <form className="offcanvas-body bg-transparent overflow-hidden" noValidate={true}>
                <div className="row">
                    <div className="col-12">
                        <h1>Cart</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Movie</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            { cartState.items.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item.movie.name}</td>
                                        <td>{item.theatre.name}</td>
                                        <td>{item.date} {item.time}</td>
                                        <td>ROW: {item.seat.row} SEAT: {item.seat.column}</td>
                                        <td>{item.price}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <h3>Total: {cart.state.totalPrice}</h3>
                    </div>
                </div>
                <div className="my-3">
                    <button type="button"
                            className={`btn btn-primary w-100`}
                            disabled={credentials === undefined}
                            onClick={onCheckout}>Checkout</button>
                </div>
            </form>

        </div>
    )
}
