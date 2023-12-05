/** @jsxImportSource @emotion/react */
import React, {ReactElement, useEffect} from 'react';
import {BrowserRouter, Link, Route, Routes, useLocation, useParams} from "react-router-dom";
import {UseCaseCollection} from "cinetex-core/dist/application";
import MoviesView from "./views/MoviesView";
import TheatresView from "./views/TheatresView";
import HomeView from "./views/HomeView";
import TicketsView from "./views/TicketsView";
import {UserSignInView} from "./views/UserSignInView";
import {SecurityContext} from "./security/SecurityContext";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {NavigationBarView} from "./views/NavigationBarView";
import {ThemeManager} from "./ThemeManager";
import {MovieViewByPath} from "./views/MovieView";

export type NavigationBarVisibility = "always" | "never" | "whenSignedIn" | "whenSignedOut" | "whenActive" | "whenAuthorized" | undefined

export type ViewDescriptor = {
    path: string,
    name: string,
    roles?: string[],
    navBarVisible?: NavigationBarVisibility,
    theme?: 'light' | 'dark',
    viewFactory: ViewFactory,
}

export type AppProps = {
    interactors: UseCaseCollection,
    security: SecurityContext,
    themeManager: ThemeManager,
}

export type ViewFactory = () => ReactElement

export function App({interactors, security, themeManager}: AppProps) {

    const viewDescriptors: ViewDescriptor[] = [
        {path: "/", name: "Home", navBarVisible: "never", viewFactory: () => <HomeView/>},
        {path: "/Movies", name: "Movies", viewFactory: () => <MoviesView interactors={interactors}/>},
        {path: "/Movie/:id", name: "Movie", navBarVisible: "whenActive", viewFactory: () => <MovieViewByPath viewMode="expanded" interactors={interactors}/>},
        {path: "/Theatres", name: "Theatres", viewFactory: () => <TheatresView interactors={interactors}/>},
        {path: "/Tickets", name: "Tickets", viewFactory: () => <TicketsView interactors={interactors}/>},
        {path: "/About", name: "About", theme: "light", viewFactory: () => <AboutView/> }
    ]

    const [credentials, setCredentials] = React.useState<SecurityCredentials|undefined>(undefined)
    const [theme, setTheme] = React.useState<'light' | 'dark'>(themeManager.theme)
    const location = useLocation();

    useEffect(() => {
        const credentialsObserver = security.subscribe((credentials) => {
            setCredentials(credentials)
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
        for (const viewDescriptor of viewDescriptors) {
            if (viewDescriptor.path === location.pathname) {
                themeManager.setTheme(viewDescriptor.theme ?? 'dark')
                break
            }
        }
    }, [location]);

    return (
        <div id="App">
            <NavigationBarView viewDescriptors={viewDescriptors} security={security} theme={theme} themeManager={themeManager}/>
            <div className="content" css={{
                    marginTop: '6rem',
                    paddingLeft: '4rem',
                    paddingRight: '4rem',
                }}>
                <Routes>{
                    viewDescriptors.map(({path, name, viewFactory}) =>
                        <Route key={path} path={path} element={viewFactory()}/>
                    )
                }
                </Routes>
            </div>
            <div className="footer" css={{
                    marginTop: '8rem',
                    height: '8rem',
                    backgroundColor: 'transparent',
                    article: {
                        textAlign: 'center',
                    }
                }}>
                <article>
                    <p>&copy;Code Crafters 2023</p>
                </article>
            </div>
            <UserSignInView id="UserSignInView" security={security}/>
        </div>
    );
}

export function AboutView() {
    return <h1>About</h1>
}

export default App;
