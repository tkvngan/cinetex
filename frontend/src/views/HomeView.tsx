/** @jsxImportSource @emotion/react */
import React from "react";
//
// const homeViewStyle = css({
//     marginTop: '20rem',
//     display: 'grid',
//     gridTemplateColumns: '.5fr .5fr',
//     ".left": {
//         article: {
//             width: 'auto',
//             h1: {
//                 marginBottom: '1.5rem',
//                 fontSize: '5rem'
//             },
//             p: {
//                 marginBottom: '4rem',
//                 fontSize: '2rem'
//             }
//         },
//     },
//     ".right": {
//         justifySelf: 'center',
//         img: {
//             width: '30rem'
//         }
//
//     },
// })

export default function HomeView() {
    return (
        <div id="HomeView" className="row row-cols-2 mt-5">
            <section className="w-50 mt-5">
                <article>
                    <h1 className="display-2 mb-3">Early Black Friday deal. Get 25% off.</h1>
                    <p className="fs-1 mb-5">
                        Buy tickets and save for the first six months.
                        US$12.50 <del>US$18.99</del> Ends Nov 30.
                    </p>
                </article>
            </section>
            <section className="justify-content-center mt-5 w-50">
                <img src="/assets/svg/hero.svg" alt="" srcSet="" className="object-fit-cover"/>
            </section>
        </div>
    )
}
