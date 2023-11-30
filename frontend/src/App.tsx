/** @jsxImportSource @emotion/react */
import React from 'react';
import {BrowserRouter, Link, Route, Routes, useLocation} from "react-router-dom";
import {UseCaseCollection} from "cinetex-core/dist/application";
import MoviesView from "./views/MoviesView";
import TheatresView from "./views/TheatresView";
import HomeView from "./views/HomeView";
import TicketsView from "./views/TicketsView";
import "./css/App.css"
import {css} from "@emotion/react";
import {User} from "cinetex-core/dist/domain/entities";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

const bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js")

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
    {path: "/SignUp", name: "Sign Up", hidden:true, fc: SignUpView},
]

export function App({interactors}: {interactors: UseCaseCollection}) {
    const [credentials, setCredentials] = React.useState<SecurityCredentials | null>(null)
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const offcanvasSignInRef = React.useRef<HTMLDivElement>(null)

    function onEmailInput(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }

    function onPasswordInput(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }

    async function onSignInSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        console.log("Sign In, email: " + email + ", password: " + password)
        const {user, jwtToken} = await interactors.SignIn.invoke({email: email, password: password})
        console.log("User: " + user + ", token: " + jwtToken)
    }

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
                <div className="offcanvas offcanvas-end"
                     style={{backgroundColor: "rgba(0,0,0,0.5)", width: "50rem"}}
                     tabIndex={-1} id="offcanvasSignIn" aria-labelledby="offcanvasSignInTitle"
                     ref={offcanvasSignInRef}>
                    <div className="offcanvas-header">
                        <h2 className="offcanvas-title" id="offcanvasSignInTitle"></h2>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body fs-2 mt-5 row row-cols-1 align-content-start bg-transparent">
                        <h1 className="col text-center">Sign In</h1>
                        <div className="col m-5">
                            <label htmlFor="emailInput text-start" className="form-label">Email:</label>
                            <input type="email" className="form-control fs-2" id="emailInput"
                                style={{width: "80%"}}
                                placeholder="name@example.com" onInput={onEmailInput}>

                            </input>
                        </div>
                        <div className="col m-5 text-start">
                            <label htmlFor="passwordInput" className="form-label">Password:</label>
                            <input
                                type="password" className="form-control fs-2" id="passwordInput"
                                onInput={onPasswordInput}
                                style={{width: "80%"}}></input>
                        </div>
                        <div className="col m-5">
                            <button
                                type="submit" className="btn btn-primary"
                                data-bs-dismiss="offcanvas"
                                onClick={onSignInSubmit}
                            >Sign In</button>
                        </div>
                        <article className="col m-5">
                            <p>Don't have an account? <Link className="text-decoration-none" data-bs-dismiss="offcanvas" to={"/SignUp"}>Sign Up</Link></p>
                        </article>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

function NavigationBar() {
    const location = useLocation();
    const isActive: (path: string) => boolean = (path) => location.pathname === path
    return (
        <div className="navbar fixed-top navbar-expand-lg navbar-dark container">
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
                        data-bs-target="#offcanvasSignIn"
                        aria-controls="offcanvasSignIn">Sign In</a>
                </div>
                <Link className="btn btn-primary" tabIndex={-1} role="button" to="/Tickets">Ticket Now</Link>
            </div>
        </div>
    )
}

export function AboutView({interactors}: { interactors: UseCaseCollection}) {
    return <h1>About</h1>
}

function SignUpView({interactors}: { interactors: UseCaseCollection}) {
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [firstName, setFirstName] = React.useState<string>("")
    const [lastName, setLastName] = React.useState<string>("")

    return (
        <div>
            <div className="row row-cols-1 p-5" style={{backgroundColor: "rgba(0, 0, 0, 0.25"}}>
                <h1 className="text-center">Sign Up</h1>
                <div className="col m-4">
                    <label htmlFor="emailInput" className="form-label">Email</label>
                    <input type="email" className="form-control fs-2" id="emailInput"
                           style={{width: "40rem"}}
                           value={email}
                           placeholder="">
                    </input>
                </div>
                <div className="col m-4">
                    <label htmlFor="passwordInput" className="form-label">Password</label>
                    <input type="password" className="form-control fs-2" id="passwordInput"
                           style={{width: "40rem"}}
                           value={password}>

                    </input>
                </div>
                <div className="col m-4">
                    <label htmlFor="firstNameInput" className="form-label">First Name</label>
                    <input type="text" className="form-control fs-2" id="firstNameInput"
                        style={{width: "40rem"}}
                        value={firstName}
                        placeholder="John"></input>
                </div>
                <div className="col m-4">
                    <label htmlFor="lastNameInput" className="form-label">Last Name</label>
                    <input type="text" className="form-control fs-2" id="lastNameInput"
                        style={{width: "40rem"}}
                        value={lastName}
                        placeholder="Doe"></input>
                </div>
                <div className="col m-4">
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>
            </div>

        </div>
    )
}

export default App;
