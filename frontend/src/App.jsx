import React from 'react';
import './App.css';
import {MovieListView} from "./views/MovieListView";

function App({interactors}) {
    const [current, setCurrent] = React.useState("Home");

    function switchTo(page) {
        setCurrent(page);
    }

    function isActive(page) {
        return current === page ? "active" : "";
    }

    return (<div className={"container"}>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">Cinetex</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className={"nav-link " + isActive("Home")} aria-current="page" href="#" onClick={()=> switchTo("Home")}>Home</a>
                        </li>
                        <li className="nav-item">
                            <a className={"nav-link " + isActive("Movies")} href="#" onClick={()=> switchTo("Movies")}>Movies</a>
                        </li>
                        <li className="nav-item">
                            <a className={"nav-link " + isActive("Schedules")} href="#" onClick={()=>switchTo("Schedules")}>Schedules</a>
                        </li>
                        <li className="nav-item">
                            <a className={"nav-link " + isActive("Bookings")} href="#" onClick={()=>switchTo("Bookings")}>Bookings</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div>
            {current === "Home" &&
                <div>
                    <h1 className={"text-center"}>Welcome to Cinetex</h1>
                </div>
            }
            {current === "Movies" &&
                <div className="row">
                    <MovieListView interactors={interactors} />
                </div>
            }
        </div>
    </div>);
}

export default App;
