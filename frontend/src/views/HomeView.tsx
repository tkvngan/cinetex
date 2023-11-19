import {Link} from "react-router-dom";
import React from "react";
import "../css/HomeView.css"

export default function HomeView() {
    return (
        <div id="HomeView">
            <section>
                <article>
                    <h1>Early Black Friday deal. Get 25% off.</h1>
                    <p>
                        Buy tickets and save for the first six months.
                        US$12.50 <del>US$18.99</del> Ends Nov 30.
                    </p>
                </article>
                <Link to="/SaveNow" className="btn btn-primary cinetex ">Save now</Link>
            </section>
            <section>
                <img src="/assets/svg/hero.svg" alt="" srcSet=""/>
            </section>
        </div>
    )
}
