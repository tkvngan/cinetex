/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from "react";
import {Movie} from "cinetex-core/dist/domain/entities";
import * as Icons from 'react-bootstrap-icons';
import {css} from "@emotion/react";
import {UseCaseCollection} from "cinetex-core/dist/application";

const moviesViewStyle = css({
    fontFamily: 'var(--cinetex-font-family)',
    ".movies-toolbar": {
        paddingLeft: '4rem',
        paddingRight: '4rem',
        width: '100%',
        position: "fixed",
        left: '0px',
        span: {
            margin: 0,
            padding: 8,
            ".btn": {
                padding: 0,
                svg: {
                    fontSize: '1.25rem',
                },
            },
            "&:hover": {
                cursor: "pointer",
            }
        },
        ".dropdown-menu": {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        ".dropdown-item": {
            fontSize: "1rem",
            svg: {
                fontSize: "1rem",
            }
        }
    },

    ".movies": {
        paddingTop: '2rem',

    },

    ".movie": {
        margin: '2rem',
    },

    ".movie-image-box": {
        boxShadow: '5px 10px 18px #000000',
        height: '300px',
        width: '200px',
        padding: '0',
        textAlign: 'center',
        verticalAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        color: 'var(--cinetex-primary-light-color)',
        img: {
            objectFit: 'cover',
            height: '100%',
            width: '100%',
            padding: '0',
            backgroundColor: "transparent",
        }
    },
    ".movie-info-box": {
        margin: "0.25rem 1.5rem 0.25rem 1.5rem",
        ".movie-title": {
            fontSize: '1.75rem',
            fontWeight: 'bold',
            marginTop: '0rem',
            marginBottom: '1rem'
        },
        caption: {
            fontSize: '10px',
            lineHeight: '12px',
            fontWeight: 700,
            marginTop: '0',
            marginBottom: '0.25rem',
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem',
            textTransform: 'uppercase',
        },
        article: {
            margin: '0 0 2rem 0',
            p: {
                fontSize: '1rem',
                fontWeight: 'normal',
                margin: '0',
            },
            "& > article": {
                marginBottom: 0,
                paddingLeft: 0,
                paddingRight: '1rem',
            }
        },
    }
})

export default function MoviesView({interactors}: {interactors: UseCaseCollection}) {
    const {GetAllMovies} = interactors
    const [movies, setMoves] = useState<Movie[]>([])
    const [isListView, setIsListView] = useState<boolean>(false)
    const [orderBy, setOrderBy] = useState<string>("name")
    const [orderDirection, setOrderDirection] = useState<number>(1)

    useEffect(() => {
        GetAllMovies.invoke({}).then((movies: Movie[]) => {
            setMoves(sortMovies(movies))
        })
    }, [orderBy, orderDirection])

    function sortMovies(movies: Movie[]): Movie[] {
        const copy = [...movies]
        const direction = orderDirection
        const by = orderBy
        return copy.sort((movie1, movie2) => {
            if (by === "name") {
                return movie1.name.localeCompare(movie2.name) * direction
            } else if (orderBy === "releaseDate") {
                return movie1.releaseDate.localeCompare(movie2.releaseDate) * direction
            }
            return 0
        })
    }

    function toggleOrderBy(newOrderBy: string) {
        if (orderBy === newOrderBy) {
            setOrderDirection(orderDirection * -1)
        } else {
            setOrderBy(newOrderBy)
        }
    }

    function orderIcon(by: string) {
        const visible = visibleWhenOrderBy(by)
        return orderDirection === 1 ? <Icons.SortDown className={visible}/> : <Icons.SortUp className={visible}/>
    }

    function visibleWhenOrderBy(by: string) {
        return by === orderBy ? "visible" : "invisible"
    }

    return (
        <div id="MoviesView" className="container" css={moviesViewStyle}>
            <div className={"movies-toolbar d-flex justify-content-end"}>
                <span className="dropdown">
                    <a className="btn" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        <Icons.FilterRight/>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li>
                            <a className={"dropdown-item"}
                                onClick={() => {toggleOrderBy("name")}}>{orderIcon("name")} Name
                            </a>
                        </li>
                        <li>
                            <a className={"dropdown-item"}
                                onClick={() => {toggleOrderBy("releaseDate")}}>{orderIcon("releaseDate")} Release Date
                            </a>
                        </li>
                    </ul>
                </span>
                <span>
                    <a className="btn" role="button"> { isListView ?
                        <Icons.Grid onClick = {() => setIsListView(false)}/> :
                        <Icons.List onClick = {() => setIsListView(true)} />
                    }
                    </a>
                </span>
            </div>
            <div className={`movies row row-cols-${isListView ? "1" : "auto"}`}>{movies && movies.map(movie =>
                <div className={"movie col row row-cols-2"} key={movie.id} >
                    <div className={"movie-image-box col d-flex align-items-center"}>{
                        movie.mediumPosterImageUrl ?
                            <img className="col" src={movie.mediumPosterImageUrl} alt={movie.name}/> :
                            <h4 className="col text-center">{movie.name}</h4>
                    }
                    </div>
                    <div className={`movie-info-box col ${isListView ? "" : "d-none"} col`}>
                        <h1 className={"movie-title"}>{movie.name}</h1>
                        <article className="row">
                            <article className="col">
                                <caption>Length</caption>
                                <p>{movie.runtimeInMinutes}min</p>
                            </article>
                            <article className="col">
                                <caption>Rating</caption>
                                <p>PG</p>
                            </article>
                            <article className="col">
                                <caption>Genre</caption>
                                <p>{movie.genres.join(", ")}</p>
                            </article>
                            <article className="col">
                                <caption>Release Date</caption>
                                <p>{movie.releaseDate.replaceAll("-", "\u2011")}</p>
                            </article>
                            <article className="col">
                                <caption>Show Time</caption>
                                <p>{"2:30pm 6:00pm 9:15pm"}</p>
                            </article>
                        </article>
                        <article className={movie.synopsis && movie.synopsis.length > 0 ? "" : "d-none"}>
                            <p>{movie.synopsis}</p>
                        </article>
                        <article className={movie.director && movie.director.length > 0 ? "" : "d-none"}>
                            <caption>Director</caption>
                            <p>{movie.director}</p>
                        </article>
                        <article className={movie.starring && movie.starring.length > 0 ? "" : "d-none"}>
                            <caption>Cast</caption>
                            <p>{movie.starring}</p>
                        </article>
                    </div>
                </div>
            )}
            </div>
        </div>
    )

}
