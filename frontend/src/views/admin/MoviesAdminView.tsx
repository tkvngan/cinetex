/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react';
import {UseCaseCollection} from "cinetex-core/dist/application";
import {Movie, Rating} from "cinetex-core/dist/domain/entities";
import * as Icons from "react-bootstrap-icons";
import {css, SerializedStyles} from "@emotion/react";
import {AdminToolbar} from "./AdminToolbar";
import {Credentials} from "cinetex-core/dist/security/Credentials";

type AdminMoviesViewProps = {
    interactors: UseCaseCollection,
    credentials?: Credentials
}

export function MoviesAdminView({interactors, credentials}: AdminMoviesViewProps) {

    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieSelected, setMovieSelected] = useState<Record<string, true>>({});
    const allSelectedCheckboxRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        interactors.GetAllMovies.invoke({}).then((movies: Movie[]) => {
            setMovies(movies)
        })
    }, []);

    useEffect(() => {
        if (allSelectedCheckboxRef.current) {
            if (Object.keys(movieSelected).length === 0) {
                allSelectedCheckboxRef.current.indeterminate = false
                allSelectedCheckboxRef.current.checked = false
            } else if (Object.keys(movieSelected).length === movies.length) {
                allSelectedCheckboxRef.current.indeterminate = false
                allSelectedCheckboxRef.current.checked = true
            } else {
                allSelectedCheckboxRef.current.indeterminate = true
            }
        }
    }, [movieSelected])

    function onMovieSelectionChange(e: React.ChangeEvent<HTMLInputElement>) {
        const id = e.target.id
        if (e.target.checked) {
            movieSelected[id] = true
        } else {
            delete movieSelected[id]
        }
        setMovieSelected({...movieSelected})
    }

    function onAllSelectionChange(e: React.ChangeEvent<HTMLInputElement>) {
        const allSelected = e.target.checked
        if (allSelected) {
            selectAll()
        } else {
            unselectAll()
        }
    }

    function selectAll() {
        movies.forEach((movie) => {
            movieSelected[movie.id] = true
        })
        setMovieSelected({...movieSelected})
    }

    function unselectAll() {
        movies.forEach((movie) => {
            delete movieSelected[movie.id]
        })
        setMovieSelected({...movieSelected})
    }

    function getRating(movie: Movie): string {
        const ratings: Rating[] = movie.ratings.filter((value: Rating) => (value.provinceCode === "ON"))
        return ratings.length > 0 ? ratings[0].rating : ""
    }

    function fixDate(date: string): string {
        return date.replaceAll("-", "\u2011")
    }

    function moviesSelectedCount(): number {
        return Object.keys(movieSelected).length
    }

    return (
        <div css={styles()}>
            <AdminToolbar>
                <span>
                    <a className="btn" role="button">
                        <Icons.FilePlus />
                    </a>
                </span>
                <span>
                    <button className={"btn"} role="button" data-bs-toggle={moviesSelectedCount() > 0 ? "modal" : ""} data-bs-target="#deleteMoviesModal">
                        <Icons.Trash />
                    </button>
                </span>
            </AdminToolbar>

            <div className={"movies-admin"}>
                {table()}
            </div>

            <div className="modal fade" id="deleteMoviesModal" tabIndex={-1} aria-labelledby="deleteMoviesModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deleteMoviesModalLabel">Confirm Deletion</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">{
                            moviesSelectedCount() === movies.length ?
                                "Are you sure you want to delete all movies?" :
                                moviesSelectedCount() === 1 ?
                                    "Are you sure you want to delete the selected movie?" :
                                    moviesSelectedCount() > 1 ?
                                        "Are you sure you want to delete the selected movies?" :
                                        ""
                        }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                onClick={() => {
                                    interactors.DeleteMovies.invoke(Object.keys(movieSelected), credentials)
                                        .then(() => {
                                            setMovieSelected({})
                                            interactors.GetAllMovies.invoke({}).then((movies: Movie[]) => {
                                                setMovies(movies)
                                            })
                                        })
                                    }
                                }>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    function styles(): SerializedStyles {
        return css({
            ".movies-admin": {
                paddingTop: '4rem',
            },
        })
    }


    function table() {
        return (
            <table className={"table"}>
                <thead>
                    <tr>
                        <th scope="col">
                            <div className="form-check">
                                <input
                                    ref={allSelectedCheckboxRef}
                                    className="form-check-input" type="checkbox" value=""
                                    onChange={onAllSelectionChange}
                                />
                            </div>
                        </th>
                        <th scope="col">Name</th>
                        <th scope="col">Release</th>
                        <th scope="col">Duration</th>
                        <th scope="col">Genres</th>
                        <th scope="col">Starring</th>
                        <th scope="col">Director</th>
                        <th scope="col">Producers</th>
                        <th scope="col">Writers</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Language</th>
                        <th scope="col">Subtitle</th>
                    </tr>
                </thead>
                <tbody>{
                    movies.map((movie) =>
                        <tr key={movie.id}>
                            <td>
                                <div className="form-check">
                                    <input
                                        className="form-check-input" type="checkbox" value=""
                                        id={`${movie.id}`}
                                        checked={(movieSelected[movie.id])}
                                        onChange={onMovieSelectionChange}
                                    />
                                </div>
                            </td>
                            <td>{movie.name}</td>
                            <td>{fixDate(movie.releaseDate)}</td>
                            <td>{movie.runtimeInMinutes}</td>
                            <td>{movie.genres.join(", ")}</td>
                            <td>{movie.starring}</td>
                            <td>{movie.director}</td>
                            <td>{movie.producers}</td>
                            <td>{movie.writers}</td>
                            <td>{getRating(movie)}</td>
                            <td>{movie.movieLanguage}</td>
                            <td>{movie.movieSubtitleLanguage}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }
}

export default MoviesAdminView;
