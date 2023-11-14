import {Link} from "react-router-dom";
import React from "react";

export default function HomePage() {
    return (
        <section id="HomePage" className="hero__contents my-grid grid--1x2">
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
                    src="/assets/svg/hero.svg"
                    alt=""
                    srcSet=""
                />
            </section>
        </section>
    )
}
