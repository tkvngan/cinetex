/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from "react";
import {Movie} from "cinetex-core/dist/domain/entities/Movie";
import * as Icons from 'react-bootstrap-icons';
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import {MovieView, MovieViewMode} from "./MovieView";
import {Link} from "react-router-dom";
import Toolbar from "./Toolbar";

export function MoviesView({interactors}: {interactors: UseCaseCollection}) {
    const {GetAllMovies} = interactors
    const [movies, setMovies] = useState<Movie[]>([])
    const [viewMode, setViewMode] = useState<MovieViewMode>("compact")
    const [orderBy, setOrderBy] = useState<string>("name")
    const [orderDirection, setOrderDirection] = useState<number>(1)

    useEffect(() => {
        GetAllMovies.invoke({}).then((movies: Movie[]) => {
            const sortedMovies = sortMovies(movies)
            setMovies(sortedMovies)
        })
    }, [orderBy, orderDirection])

    function sortMovies(movies: Movie[]): Movie[] {
        const copy = [...movies]
        const direction = orderDirection
        const by = orderBy
        const sortedMovies = copy.sort((movie1, movie2) => {
            if (by === "name") {
                return movie1.name.localeCompare(movie2.name) * direction
            } else if (orderBy === "releaseDate") {
                return movie1.releaseDate.localeCompare(movie2.releaseDate) * direction
            }
            return 0
        })
        return sortedMovies
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
        <div id="MoviesView" className="container-fuild"
            css={{
                padding: 0,
                marginLeft: "1rem",
                marginRight: "1rem",
                ".dropdown-menu": {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                },
                ".dropdown-item": {
                    fontSize: "1rem",
                    svg: {
                        fontSize: "1rem",
                    }
                },
                ".movies": {
                    paddingTop: '2rem',
                }
            }}>
            <Toolbar tabs={[]} theme={"dark"}>
                <span className="dropdown">
                    <a className="btn" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        <Icons.FilterRight/>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <li>
                            <a className={"dropdown-item"}
                                onClick={() => toggleOrderBy("name")}>
                                {orderIcon("name")} Name
                            </a>
                        </li>
                        <li>
                            <a className={"dropdown-item"}
                                onClick={() => toggleOrderBy("releaseDate")}>
                                {orderIcon("releaseDate")} Release Date
                            </a>
                        </li>
                    </ul>
                </span>
                <span>
                    <a className="btn" role="button"> {viewMode === "compact" ?
                        <Icons.List onClick={() => setViewMode("normal")}/> :
                        <Icons.Grid onClick={() => setViewMode("compact")}/>
                    }
                    </a>
                </span>
            </Toolbar>
            <div
                className={`movies row row-cols-${viewMode === "compact" ? "auto" : "1"}`}>{movies && movies.map(movie =>
                <Link key={`movie-${movie.id}`} className="col text-decoration-none" to={`/Movie/${movie.id}`}
                      css={{color: "inherit"}}>
                    <MovieView key={`movie-${movie.id}`} movie={movie} viewMode={viewMode} interactors={interactors}/>
                </Link>
            )}
            </div>
        </div>
    )

}

export default MoviesView
