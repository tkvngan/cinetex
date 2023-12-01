/** @jsxImportSource @emotion/react */
import React from 'react';
import {BrowserRouter, Link, Route, Routes, useLocation} from "react-router-dom";
import {UseCaseCollection} from "cinetex-core/dist/application";
import MoviesView from "./views/MoviesView";
import TheatresView from "./views/TheatresView";
import HomeView from "./views/HomeView";
import TicketsView from "./views/TicketsView";
import {UserSignInView} from "./views/UserSignInView";
import {SecurityContext} from "./security/SecurityContext";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import {NavigationBarView} from "./views/NavigationBarView";

export type ViewDescriptor = {
    path: string,
    name: string,
    hidden?: boolean,
    fc: React.FC<{interactors: UseCaseCollection}>
}

const viewDescriptors: ViewDescriptor[] = [
    {path: "/", name: "Home", hidden: true, fc: HomeView},
    {path: "/Movies", name: "Movies", fc: MoviesView},
    {path: "/Theatres", name: "Theatres", fc: TheatresView},
    {path: "/Tickets", name: "Tickets", fc: TicketsView},
    {path: "/About", name: "About", fc: AboutView},
]

export function App({interactors, security}: {interactors: UseCaseCollection, security: SecurityContext}) {

    const [credentials, setCredentials] = React.useState<SecurityCredentials|undefined>(undefined)

    React.useEffect(() => {
        const subscription = security.subscribe((credentials) => {
            setCredentials(credentials)
        })
        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <BrowserRouter>
            <div id="App" data-bs-theme="dark">
                <NavigationBarView security={security} viewDescriptors={viewDescriptors}/>
                <div className="content" css={{
                        marginTop: '6rem',
                        paddingLeft: '4rem',
                        paddingRight: '4rem',
                    }}>
                    <Routes>{
                        viewDescriptors.map(({path, name, fc}) =>
                            <Route key={path} path={path} element={fc({interactors})}/>
                        )
                    }
                    </Routes>
                </div>
                <div className="footer" css={{
                        marginTop: '8rem',
                        height: '8rem',
                        color: 'white',
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
        </BrowserRouter>
    );
}

export function AboutView({interactors}: { interactors: UseCaseCollection}) {
    return <h1>About</h1>
}

export default App;
