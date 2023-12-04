/** @jsxImportSource @emotion/react */

import {SecurityContext} from "../security/SecurityContext";
import React, {useEffect, useState} from "react";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {Link, useLocation} from "react-router-dom";
import {ViewDescriptor} from "../App";
import bg from '../assets/svg/bg.svg'
import * as Icons from 'react-bootstrap-icons';
import {ThemeManager} from "../ThemeManager";
import * as bootstrap from "bootstrap"
import Tooltip from "bootstrap/js/dist/tooltip";

type NavigationBarViewProps = {
    viewDescriptors: ViewDescriptor[],
    security: SecurityContext,
    themeManager: ThemeManager,
    theme: 'light' | 'dark',
}


export function NavigationBarView({viewDescriptors, security, themeManager, theme}: NavigationBarViewProps) {
    const [credentials, setCredentials] = useState<SecurityCredentials|undefined>(undefined)
    const location = useLocation();
    const isActive: (path: string) => boolean = (path) => location.pathname === path
    const isDarkTheme = () => theme === 'dark'
    const signInViewButtonTooltip = React.useRef<Tooltip|null>(null)

    useEffect(() => {
        const signInViewButton = document.getElementById("UserSignInViewButton")
        if (signInViewButton) {
            signInViewButtonTooltip.current = new bootstrap.Tooltip(signInViewButton)
        }
        const credentialsObserver = security.subscribe((credentials) => {
            console.log("Credentials changed: ", credentials)
            console.log("Credentials.user.firstName: ", credentials?.user.firstName)
            setCredentials(credentials)
            const tooltip = signInViewButtonTooltip.current
            if (tooltip) {
                const tooltipMessage = credentials ? (credentials?.user.firstName??"") : "Sign In"
                tooltip.setContent({ '.tooltip-inner': tooltipMessage })
            }
        })
        return () => {
            credentialsObserver.unsubscribe()
        }
    }, [])

    return (
        <div className="navbar fixed-top navbar-expand-lg"
            css={{
                height: '6rem',
                paddingLeft: '4rem',
                paddingRight: '4rem',
                boxShadow: '0 0 2rem 0 rgba(0, 0, 0, .2)',
                fontFamily: 'var(--cinetex-font-family)',
                ...(isDarkTheme() ? {
                    backgroundAttachment: 'fixed',
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.217) 0%, var(--cinetex-solid-dark-color)), url(${bg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#e26fe4ba',
                    backgroundSize: '100% auto',
                } : {}),

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
                            marginRight:'1.5rem',
                            whiteSpace: 'nowrap',
                            transition: 'font-size, color .3s',
                            fontSize:   '1.25rem',
                            ...(isDarkTheme() ? {
                                color: 'var(--cinetex-solid-light-color)',
                            } : {}),
                            '&:hover, &.active': {
                                ...(isDarkTheme() ? {
                                    color:  'var(--cinetex-primary-light-color)',
                                } : {
                                }),
                            }
                        }
                    }}>{
                    viewDescriptors.filter(({hidden}) => !hidden).map(({name, path}) =>
                        <Link key={path}
                            className={"nav-link" + (isActive(path) ? " active" : "")}
                            aria-current={isActive(path) ? "page" : "false"} to={path}>
                            {name}
                        </Link>
                    )}
                    <span className="nav-link ms-auto me-0"
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

function log(...args: any[]): boolean {
    console.log(...args)
    return true
}
