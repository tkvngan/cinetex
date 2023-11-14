import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {UseCaseCollections} from "shared/dist/application/usecases";
import MoviesPage from "./views/MoviesPage";
import TheatresPage from "./views/TheatresPage";
import HomePage from "./views/HomePage";
import NavBar from "./views/NavBar";

function Schedule() {
    return <h1>Schedule</h1>;
}

function Tickets() {
    return <h1>Tickets</h1>;
}

function About() {
    return <h1>About</h1>
}

function SignIn() {
    return <h1>Sign In</h1>;
}

export function App({interactors}: {interactors: UseCaseCollections}) {
    return (
        <BrowserRouter>
            <header>
                <NavBar/>
                <section className="hero container">
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/Movies" element={<MoviesPage interactors={interactors}/>}/>
                        <Route path="/Theatres" element={<TheatresPage interactors={interactors}/>}/>
                        <Route path="/Schedule" element={<Schedule/>}/>
                        <Route path="/Tickets" element={<Tickets/>}/>
                        <Route path="/About" element={<About/>}/>
                        <Route path="/SignIn" element={<SignIn/>}/>
                        <Route path="/SaveNow" element={<h1>Save Now</h1>}/>
                    </Routes>
                </section>
            </header>
            <footer className="my-footer">
                <article className="my-footer__content">
                    <p className="my-footer__copyright">&copy; Code Crafters 2023</p>
                </article>
            </footer>
        </BrowserRouter>
    );
}
export default App;
