import React from 'react';
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";

function NavBar() {
    return (
        <nav className="my-nav container">
            <div id="logo"><Link to="/">Cinetex</Link></div>
            <ul className="my-list my-nav__list">
                <li className="my-nav__item"><Link to="/Theatres">Theatres</Link></li>
                <li className="my-nav__item"><Link to="/Movies">Movies</Link></li>
                <li className="my-nav__item"><Link to="/Schedule">Schedule</Link></li>
                <li className="my-nav__item"><Link to="/Tickets">Tickets</Link></li>
                <li className="my-nav__item"><Link to="/About">About</Link></li>
                <li className="my-nav__item"><Link to="/SignIn">Sign In</Link></li>
            </ul>
            <Link className="my-btn my-btn--primary nmy-av__button" to="/Tickets">Ticket Now</Link>
        </nav>
    )
}

function Home() {
    return (
        <section className="hero__contents my-grid grid--1x2">
            <section className="hero__left">
                <article className="hero__texts">
                    <h1 className="hero__tagline">
                        Early Black Friday deal. Get 25% off.
                    </h1>
                    <p className="hero__copy">
                        Buy tickets and save for the first six months. US$12.50
                        <span className="text--slash">US$18.99</span>
                        Ends Nov 17.
                    </p>
                </article>
                <Link to="/SaveNow" className="my-btn my-btn--primary">Save now</Link>
            </section>
            <section className="hero__right">
                <img
                    className="hero__image"
                    src="assets/svg/hero.svg"
                    alt=""
                    srcSet=""
                />
            </section>
        </section>
    )
}

function Movies() {
    return (
        <div id={"MoviesPage"}>
            <img src="images/Dune.jpg" alt="" srcSet=""/>
            <img src="images/Guardians.jpg" alt="" srcSet=""/>
            <img src="images/IndianaJones.jpg" alt="" srcSet=""/>
            <img src="images/JohnWick.jpg" alt="" srcSet=""/>
            <img src="images/Killers.jpg" alt="" srcSet=""/>
            <img src="images/Marvels.jpg" alt="" srcSet=""/>
            <img src="images/MissionImpossible.jpg" alt="" srcSet=""/>
            <img src="images/Oppenheimer.jpg" alt="" srcSet=""/>
            <img src="images/SpiderMan.jpg" alt="" srcSet=""/>
        </div>
    )
}
function Theatres() {
    return <h1>Theatres</h1>;
}

function Schedule() {
    return <h1>Schedule</h1>;
}

function Tickets() {
    return <h1>Tickets</h1>;
}

function About() {
    return (
        <h1>About</h1>
    )
}

function SignIn() {
    return <h1>Sign In</h1>;
}

export function App() {
    return (
        <BrowserRouter>
            <header>
                <NavBar/>
                <section className="hero container">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/Theatres" element={<Theatres/>}/>
                        <Route path="/Movies" element={<Movies/>}/>
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
