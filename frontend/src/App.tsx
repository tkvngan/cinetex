/** @jsxImportSource @emotion/react */

import React, {useEffect} from 'react';
import {Route, Routes, useLocation} from "react-router-dom";
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import {UserSignInView} from "./views/UserSignInView";
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {AppNavigationBar} from "./AppNavigationBar";
import {AppThemeManager} from "./AppThemeManager";
import {AppFeatures} from "./AppFeatures";
import {CartView} from "./views/CartView";
import {SecurityModel} from "./models/SecurityModel";
import {CartModel} from "./models/CartModel";

export type AppProps = {
    interactors: UseCaseCollection,
    security: SecurityModel,
    cart: CartModel,
    themeManager: AppThemeManager,
}

export function App({interactors, security, cart, themeManager,}: AppProps) {
    const features = AppFeatures(interactors, security, cart)
    const [credentials, setCredentials] = React.useState<Credentials|undefined>(undefined)
    const [theme, setTheme] = React.useState<'light' | 'dark'>(themeManager.theme)
    const location = useLocation();

    useEffect(() => {
        const credentialsObserver = security.subscribe((credentials) => {
            if (credentials) {
                setCredentials({...credentials})
            } else {
                setCredentials(undefined)
            }
        })
        const themeObserver = themeManager.subscribe((theme) => {
            setTheme(theme)
        })
        return () => {
            credentialsObserver.unsubscribe()
            themeObserver.unsubscribe()
        }
    }, [])

    useEffect(() => {
        for (const feature of features) {
            if (feature.path === location.pathname) {
                themeManager.setTheme(feature.theme ?? 'dark')
                break
            }
        }
    }, [location]);

    return (
        <div id="App">
            <AppNavigationBar features={features} credentials={credentials} cart={cart} theme={"dark"}/>
            <div className="content" css={{
                    marginTop: '6rem',
                    paddingLeft: '3rem',
                    paddingRight: '3rem',
                }} data-bs-theme={theme}>
                <Routes>{
                    features.map(({name, path, view, roles}) => {
                        const userRoles = credentials?.user.roles ?? []
                        if (view && (roles === undefined || roles.length === 0 || roles.some(role => userRoles.includes(role)) )) {
                            return <Route key={path} path={path} element={
                                view instanceof Function ? view() : view
                            }/>
                        }
                        return undefined
                    })
                }
                </Routes>
            </div>
            <div className="footer" css={{
                    marginTop: '5rem',
                    height: '5rem',
                    backgroundColor: 'transparent',
                    article: {
                        textAlign: 'center',
                    }
                }} data-bs-theme={theme}>
                <article>
                    <p>&copy;Code Crafters 2023</p>
                </article>
            </div>
            <UserSignInView id="UserSignInView" security={security}/>
            <CartView id={"CartView"} interactors={interactors} cart={cart} credentials={security.credentials}/>
        </div>
    );
}

export default App;
