/** @jsxImportSource @emotion/react */

import {SecurityContext} from "../security/SecurityContext";
import React from "react";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {Link, useLocation} from "react-router-dom";
import {ViewDescriptor} from "../App";
import bg from '../assets/svg/bg.svg'

export function NavigationBarView({security, viewDescriptors}: {security: SecurityContext; viewDescriptors: ViewDescriptor[]}) {
    const [credentials, setCredentials] = React.useState<SecurityCredentials|undefined>(undefined)
    const location = useLocation();
    const isActive: (path: string) => boolean = (path) => location.pathname === path

    React.useEffect(() => {
        const subscription = security.subscribe((credentials) => {
            setCredentials(credentials)
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <div className="navbar fixed-top navbar-expand-lg"
            css={{
                height: '6rem',
                backgroundAttachment: 'fixed',
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.217) 0%, var(--cinetex-solid-dark-color)), url(${bg})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: '#e26fe4ba',
                backgroundSize: '100% auto',
                paddingLeft: '4rem',
                paddingRight: '4rem',
                boxShadow: '0 0 2rem 0 rgba(0, 0, 0, .2)',
                fontFamily: 'var(--cinetex-font-family)',
            }}>
            <Link className="navbar-brand" to="/"
                css={{
                    fontSize:   '2.5rem',
                    transition: 'font-size, color .3s',
                    marginLeft: '0rem',
                    marginRight:'3rem',
                    fontWeight: 'bold',
                    color: 'var(--cinetex-solid-light-color)',
                }}>Cinetex</Link>
            <button className="navbar-toggler" type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav"
                    css={{
                        ".nav-link": {
                            marginRight:'1.5rem',
                            whiteSpace: 'nowrap',
                            transition: 'font-size, color .3s',
                            fontSize:   '1.25rem',
                            color:      'var(--cinetex-solid-light-color)',
                            '&:hover, &.active': {
                                color:  'var(--cinetex-primary-light-color)',
                            }
                        }
                    }}>
                    {viewDescriptors.filter(({hidden}) => !hidden).map(({name, path}) =>
                        <Link key={path}
                            className={"nav-link" + (isActive(path) ? " active" : "")}
                            aria-current={isActive(path) ? "page" : "false"} to={path}>
                            {name}
                        </Link>
                    )}
                    <a className="nav-link"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#UserSignInView"
                        aria-controls="UserSignInView">{credentials ? "Sign Off" : "Sign In"}</a>
                </div>
            </div>
        </div>
    )
}
