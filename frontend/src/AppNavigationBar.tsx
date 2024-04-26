/** @jsxImportSource @emotion/react */

import React, {useEffect} from "react";
import {Link, useMatch} from "react-router-dom";
import * as Icons from 'react-bootstrap-icons';
import * as bootstrap from "bootstrap"
import Tooltip from "bootstrap/js/dist/tooltip";
import bg from './assets/svg/bg.svg'
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {AppFeature} from "./AppFeatures";
import {CartModel} from "./models/CartModel";
import {AuthenticationModel} from "./models/AuthenticationModel";

type AppNavigationBarProps = {
    readonly features: readonly AppFeature[],
    readonly authentication: AuthenticationModel,
    readonly cart: CartModel,
    readonly theme: 'dark' | 'light',
}

export function AppNavigationBar({features, authentication, cart, theme}: AppNavigationBarProps) {
    const isDarkTheme = () => (theme === 'dark')
    const signInViewButtonTooltip = React.useRef<Tooltip|null>(null)
    const currentPathMatch = features.map(({path}) => useMatch(path)).find((match) => match !== null)
    const [credentials, setCredentials] = React.useState<Credentials|undefined>(authentication.state.credentials)
    const [cartItems, setCartItems] = React.useState<number>(cart.state.items.length)
    function isActive(path: string) {
        return currentPathMatch?.pattern?.path === path
    }

    useEffect(() => {
        const signInViewButton = document.getElementById("UserSignInViewButton")
        if (signInViewButton) {
            signInViewButtonTooltip.current = new bootstrap.Tooltip(signInViewButton)
        }
        const signInTooltip = signInViewButtonTooltip.current
        if (signInTooltip) {
            const tooltipMessage = credentials ? (credentials?.user.firstName??"") : "Sign In"
            signInTooltip.setContent({ '.tooltip-inner': tooltipMessage })
        }

        const cartSubscriber = cart.subscribe(() => {
            setCartItems(cart.state.items.length)
        })
        const credentialsSubscriber = authentication.subscribe(() => {
            setCredentials(authentication.state.credentials)
        })
        return () => {
            cartSubscriber.dispose()
            credentialsSubscriber.dispose()
        }
    }, [])

    console.log("AppNavigationBar: theme =", theme)
    return (
        <div className="navbar fixed-top navbar-expand-lg"
            css={{
                height: '6rem',
                paddingLeft: '3rem',
                paddingRight: '3rem',
                ...(isDarkTheme() ? {
                    boxShadow: '0 0 2rem 0 rgba(0, 0, 0, .2)'
                } : {}),
                fontFamily: 'var(--cinetex-font-family)',
                ...(isDarkTheme() ? {
                    backgroundAttachment: 'fixed',
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.217) 0%, var(--cinetex-solid-dark-color)), url(${bg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#e26fe4ba',
                    backgroundSize: '100% auto',
                } : {
                    backgroundColor: 'var(--cinetex-primary-color)',
                }),

                ".navbar-brand": {
                    fontSize:   '2.5rem',
                    transition: 'font-size, color .3s',
                    marginLeft: '0rem',
                    marginRight:'3rem',
                    fontWeight: 'bold',
                    ...(isDarkTheme() ? {
                        color: 'var(--cinetex-solid-light-color)',
                    } : {}),
                },
                ".nav-link": {
                },
            }}>
            <Link className="navbar-brand" to="/">Cinetex</Link>
            <button className="navbar-toggler" type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav align-items-center w-100"
                     css={{
                         ".nav-link": {
                             marginRight: '1.5rem',
                             whiteSpace: 'nowrap',
                             transition: 'font-size, color .3s',
                             fontSize: '1.25rem',
                             ...(isDarkTheme() ? {
                                 color: 'var(--cinetex-solid-light-color)',
                             } : {}),
                             '&:hover, &.active': {
                                 ...(isDarkTheme() ? {
                                     color: 'var(--cinetex-primary-light-color)',
                                 } : {}),
                             }
                         }
                     }}>{
                    features.map(({name, path, visible, roles}) => {
                        if (visible === "never" ||
                            visible === "when-active" && !isActive(path)) {
                            return <span key={path}></span>
                        }
                        const userRoles: readonly string[] = credentials?.user.roles ?? []
                        const userHasRole = userRoles.some(userRole => roles?.includes(userRole) ?? false)
                        if (roles && roles.length > 0 && !userHasRole) {
                            return <span key={path}></span>
                        }
                        return (
                            <Link key={path}
                                  className={"nav-link" + (isActive(path) ? " active" : "")}
                                  aria-current={isActive(path) ? "page" : "false"} to={isActive(path) ? "#" : path}>
                                {name}
                            </Link>
                        )
                    })}
                    <span
                        className={"nav-link ms-auto me-0"}
                        key={"CartView"}
                        data-bs-toggle="offcanvas"
                        data-bs-target="#CartView">
                        <a id={"cartViewButton"}
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title={"Check out"}
                            aria-controls="CartView">
                            {cartItems === 0 ? <Icons.Cart/> : <Icons.CartFill/>}
                        </a>
                    </span>
                    <span
                        className="nav-link ms-2 me-0"
                        key={"UserSignInView"}
                        data-bs-toggle="offcanvas"
                        data-bs-target="#UserSignInView">
                        <a id={"UserSignInViewButton"}
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title={credentials ? credentials.user.firstName : "Sign In"}
                            aria-controls="UserSignInView">{credentials ? <Icons.PersonFill/> : <Icons.Person/>}
                        </a>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AppNavigationBar
