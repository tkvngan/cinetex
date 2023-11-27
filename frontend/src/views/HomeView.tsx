/** @jsxImportSource @emotion/react */
import {Link} from "react-router-dom";
import React from "react";
import { css } from '@emotion/react'

const homeViewStyle = css({
    marginTop: '20rem',
    display: 'grid',
    gridTemplateColumns: '.5fr .5fr',
    ".left": {
        article: {
            width: 'auto',
            h1: {
                marginBottom: '1.5rem',
                fontSize: '5rem'
            },
            p: {
                marginBottom: '4rem',
                fontSize: '2rem'
            }
        },
    },
    ".right": {
        justifySelf: 'center',
        img: {
            width: '50rem'
        }

    },
})

export default function HomeView() {
    return (
        <div id="HomeView" css={homeViewStyle}>
            <section className="left">
                <article>
                    <h1>Early Black Friday deal. Get 25% off.</h1>
                    <p>
                        Buy tickets and save for the first six months.
                        US$12.50 <del>US$18.99</del> Ends Nov 30.
                    </p>
                </article>
                <Link to="/SaveNow" className="btn btn-primary cinetex ">Save now</Link>
            </section>
            <section className="right">
                <img src="/assets/svg/hero.svg" alt="" srcSet=""/>
            </section>
        </div>
    )
}
