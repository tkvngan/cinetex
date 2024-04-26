/** @jsxImportSource @emotion/react */

import React, {useEffect} from 'react';
import {Route, Routes, useLocation} from "react-router-dom";
import {UserSignInView} from "./views/UserSignInView";
import {Credentials} from "cinetex-core/dist/security/Credentials";
import {AppNavigationBar} from "./AppNavigationBar";
import {AppThemeManager} from "./AppThemeManager";
import {AppFeature} from "./AppFeatures";
import {CartView} from "./views/CartView";
import {AuthenticationModel} from "./models/AuthenticationModel";
import {CartModel} from "./models/CartModel";

export type AppProps = {
    features: readonly AppFeature[],
    authentication: AuthenticationModel,
    cart: CartModel,
    themeManager: AppThemeManager,
}

export function App({features, authentication, cart, themeManager,}: AppProps) {
    const [credentials, setCredentials] = React.useState<Credentials | undefined>(authentication.state.credentials)
    const [theme, setTheme] = React.useState<'light' | 'dark'>(themeManager.theme)
    const location = useLocation();

    useEffect(() => {
        const authenticationSubscriber = authentication.subscribe((state) => {
            setCredentials(state.credentials)
        })
        const themeSubscriber = themeManager.subscribe((theme) => {
            setTheme(theme)
        })
        return () => {
            authenticationSubscriber.dispose()
            themeSubscriber.unsubscribe()
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
            <AppNavigationBar
                features={features}
                authentication={authentication}
                cart={cart}
                theme={"dark"}/>
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
            <UserSignInView id="UserSignInView" authentication={authentication}/>
            <CartView id={"CartView"} cart={cart} authentication={authentication}/>
        </div>
    );
}

export default App;
