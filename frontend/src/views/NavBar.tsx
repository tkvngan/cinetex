import {Link, useLocation} from "react-router-dom";
import React from "react";

export default function NavBar() {
    const location = useLocation();
    const navItems = [
        {path: "/Movies", name: "Movies"},
        {path: "/Theatres", name: "Theatres"},
        {path: "/Schedule", name: "Schedule"},
        {path: "/Tickets", name: "Tickets"},
        {path: "/About", name: "About"},
        {path: "/SignIn", name: "Sign In"},
    ]

    function navItemClassName(path: string) {
        return "my-nav__item " + (location.pathname === path ? "my-active" : "")
    }

    return (
        <nav className="my-nav container">
            <div id="logo"><Link to="/">Cinetex</Link></div>
            <ul className="my-list my-nav__list">
                {navItems.map(({name, path}) =>
                    <li className={navItemClassName(path)} key={path}>
                        <Link to={path}>{name}</Link>
                    </li>
                )}
            </ul>
            <Link className="my-btn my-btn--primary nmy-av__button" to="/Tickets">Ticket Now</Link>
        </nav>
    )
}
