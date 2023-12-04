/** @jsxImportSource @emotion/react */
import React from "react";
import hero from '../assets/svg/hero.svg';

export default function HomeView() {
    return (
        <div id="HomeView"
            className="row row-cols-2"
            css={{
                marginTop: '12rem',
                fontFamily: 'var(--cinetex-font-family)',
            }}>
            <section className=" left w-50">
                <article>
                    <h1 className="mb-3">Early Boxing Day deal. Get 25% off.</h1>
                    <p className="fs-3 mb-5">
                        Buy tickets and save for the first six months.
                        US$12.50 <del>US$18.99</del> Ends Dec 31.
                    </p>
                </article>
            </section>
            <section className="right justify-content-center w-50">
                <img src={hero} alt="" srcSet="" className="object-fit-cover"/>
            </section>
        </div>
    )
}
