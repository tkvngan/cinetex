/** @jsxImportSource @emotion/react */
import React from 'react';
import {BrowserRouter, Link, Route, Routes, useLocation} from "react-router-dom";
import {UseCaseCollection} from "cinetex-core/dist/application";
import MoviesView from "./views/MoviesView";
import TheatresView from "./views/TheatresView";
import HomeView from "./views/HomeView";
import TicketsView from "./views/TicketsView";
import "./css/App.css"
import {AuthenticationView} from "./views/AuthenticationView";
import {SecurityContext} from "./security/SecurityContext";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

type ViewDescriptor = {
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
        security.onCredentialsChanged = (credentials) => {
            setCredentials(credentials)
        }
    }, [])

    return (
        <BrowserRouter>
            <div id="App" data-bs-theme="dark">
                <NavigationBar security={security}/>
                <div className="content">
                    <Routes>{
                        viewDescriptors.map(({path, name, fc}) =>
                            <Route key={path} path={path} element={fc({interactors})}/>
                        )
                    }
                    </Routes>
                </div>
                <div className="footer">
                    <article>
                        <p>&copy;Code Crafters 2023</p>
                    </article>
                </div>
                <AuthenticationView id="AuthenticationView" signIn={interactors.SignIn} signUp={interactors.SignUp} security={security}/>
            </div>
        </BrowserRouter>
    );
}

function NavigationBar({security}: {security: SecurityContext}) {
    const [credentials, setCredentials] = React.useState<SecurityCredentials|undefined>(undefined)
    const location = useLocation();
    const isActive: (path: string) => boolean = (path) => location.pathname === path

    React.useEffect(() => {
        security.onCredentialsChanged = (credentials) => {
            setCredentials(credentials)
        }
    }, [])

    return (
        <div className="navbar fixed-top navbar-expand-lg">
            <Link className="navbar-brand" to="/">Cinetex</Link>
            <button
                className="navbar-toggler" type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    {viewDescriptors.filter(({hidden}) => !hidden).map(({name, path}) =>
                        <Link key={path}
                            className={"nav-link" + (isActive(path) ? " active" : "")}
                            aria-current={isActive(path) ? "page" : "false"} to={path}>
                            {name}
                        </Link>
                    )}
                    <a className="nav-link"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#AuthenticationView"
                        aria-controls="AuthenticationView">{credentials ? "Sign Off" : "Sign In"}</a>
                </div>
            </div>
        </div>
    )
}

export function AboutView({interactors}: { interactors: UseCaseCollection}) {
    return <h1>About</h1>
}

export default App;
