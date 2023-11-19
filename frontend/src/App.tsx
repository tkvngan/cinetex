import React from 'react';
import {BrowserRouter, Link, Route, Routes, useLocation} from "react-router-dom";
import {UseCaseCollections} from "core/dist/application/usecases";
import MoviesView from "./views/MoviesView";
import TheatresView from "./views/TheatresView";
import HomeView from "./views/HomeView";
import TicketsView from "./views/TicketsView";
import "./css/App.css"

type ViewDescriptor = {
    path: string,
    name: string,
    hidden?: boolean,
    fc: React.FC<{interactors: UseCaseCollections}>
}

const viewDescriptors: ViewDescriptor[] = [
    {path: "/", name: "Home", hidden: true, fc: HomeView},
    {path: "/Movies", name: "Movies", fc: MoviesView},
    {path: "/Theatres", name: "Theatres", fc: TheatresView},
    {path: "/Tickets", name: "Tickets", fc: TicketsView},
    {path: "/About", name: "About", fc: AboutView},
    {path: "/SignIn", name: "Sign In", fc: SignInView},
]

export function App({interactors}: {interactors: UseCaseCollections}) {
    return (
        <BrowserRouter>
            <div id="App">
                <NavigationBar/>
                <div className="container content">
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
            </div>
        </BrowserRouter>
    );
}

function NavigationBar() {
    const location = useLocation();
    const isActive: (path: string) => boolean = (path) => location.pathname === path
    return (
        <div className="navbar fixed-top navbar-expand-lg navbar-light container">
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
                <div className="navbar-nav"> {
                    viewDescriptors.filter(({hidden}) => !hidden).map(({name, path}) =>
                        <Link key={path}
                            className={"nav-link" + (isActive(path) ? " active" : "")}
                            aria-current={isActive(path) ? "page" : "false"} to={path}>
                            {name}
                        </Link>
                    )
                }
                </div>
                <Link className="btn btn-primary" tabIndex={-1} role="button" to="/Tickets">Ticket Now</Link>
            </div>
        </div>
    )
}

export function AboutView({interactors}: { interactors: UseCaseCollections}) {
    return <h1>About</h1>
}

function SignInView({interactors}: { interactors: UseCaseCollections}) {
    return <h1>Sign In</h1>;
}

export default App;
