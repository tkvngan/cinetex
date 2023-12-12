/** @jsxImportSource @emotion/react */
import {Movie, Schedule, Theatre, TimeSlot} from "cinetex-core/dist/domain/entities";
import {UseCaseCollection} from "cinetex-core/dist/application";
import React, {ReactElement, useEffect} from "react";
import {Link} from "react-router-dom";

export type MovieViewMode = "compact" | "normal" | "expanded"

type ShowTimeDateEntry = {
    date: string,
    screenTimes: {
        screenId: number,
        time: string
    }[]
}

export function MovieView({movie, viewMode, interactors}: {
    movie: Movie,
    viewMode: MovieViewMode,
    interactors: UseCaseCollection
}) {
    const [theatres, setTheatres] = React.useState<Theatre[]>([])
    const [schedules, setSchedules] = React.useState<Schedule[]>([])

    useEffect(() => {
        if (viewMode === "expanded") {
            (async () => {
                setTheatres((await interactors.GetAllTheatres.invoke({})).sort((a: Theatre, b: Theatre) => a.name.localeCompare(b.name)))
                setSchedules((await interactors.GetSchedulesByMovieId.invoke({movieId: movie.id})))
            })().then()
        }
    }, [])

    return (
        <div id="MovieView" className={"movie row row-cols-2"} css={{
             fontFamily: 'var(--cinetex-font-family)',
             margin: '2rem 1.5rem 2rem 1.5rem',
             ".movie-image-block": {
                 boxShadow: '5px 10px 18px #000000',
                 width: '200px',
                 height: '300px',
                 padding: '0',
                 textAlign: 'center',
                 verticalAlign: 'center',
                 backgroundColor: 'rgba(0, 0, 0, 0.25)',
                 img: {
                     objectFit: 'cover',
                     height: '100%',
                     width: '100%',
                     padding: '0',
                     backgroundColor: "transparent",
                 }
             },
             ".movie-info-block": {
                 margin: "0.25rem 1.5rem 0.25rem 1.5rem",
                 ".movie-title": {
                     fontSize: '1.75rem',
                     fontWeight: 'bold',
                     marginTop: '0rem',
                     marginBottom: '1rem'
                 },
                 ".caption": {
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

                 ".movie-theatres-info": {
                     margin: '0 0 0 0',
                     padding: 0,
                     p: {
                         margin: 0,
                         padding: 0,
                         fontSize: '1rem'
                     },
                     ".movie-theatres-info-header": {
                         margin: '0 0 0.5rem 0',
                         padding: 0,
                         p: {
                             fontSize: '10px'
                         }
                     },
                     ".movie-theatre-block": {
                         margin: 0,
                         padding: 0,

                         "a": {
                             paddingLeft: 0,
                             textDecoration: 'none',
                             transition: 'font-size, color .3s',
                             color: 'var(--bs-body-color)',
                             '&:hover': {
                                 color: 'var(--cinetex-primary-light-color)',
                             },
                             fontSize: '1rem',

                         },
                         "a.movie-show-time-link": {
                             borderRadius: '0.25rem',
                             marginRight: '0.25rem',
                             marginBottom: '0.25rem',
                             padding: '2px 4px 2px 0px',
                             '&:hover': {
                                 color: 'var(--cinetex-primary-light-color)',
                             },
                         }
                     }
                 },
             }
        }}>
        {
            [ renderMovieImage(), renderMovieInfo() ]
        }
        </div>
    )

    function renderMovieImage() {
        return (
            <div className={"movie-image-block col-md-5 col-lg-4 col-xl-3 d-flex align-items-center"}>{
                movie.mediumPosterImageUrl ?
                    <img className="col" src={movie.mediumPosterImageUrl} alt={movie.name}/> :
                    <h4 className="col text-center">{movie.name}</h4>
            }
            </div>
        )
    }

    function renderMovieInfo() {
        return (
            <div
                className={`movie-info-block  col-md-7 col-lg-8 col-xl-9 ${viewMode === "compact" ? "d-none" : ""} col`}>
                <h1 className={"movie-title"}>{movie.name}</h1>
                <article className="row">
                    <article className="col">
                        <p className="caption">Length</p>
                        <p>{movie.runtimeInMinutes}min</p>
                    </article>
                    <article className="col">
                        <p className="caption">Rating</p>
                        <p>PG</p>
                    </article>
                    <article className="col">
                        <p className="caption">Genre</p>
                        <p>{movie.genres.join(", ")}</p>
                    </article>
                    <article className="col">
                        <p className="caption">Release Date</p>
                        <p>{movie.releaseDate.replaceAll("-", "\u2011")}</p>
                    </article>
                    <article className="col">
                        <p className="caption">Show Time</p>
                        <p>{"2:30pm 6:00pm 9:15pm"}</p>
                    </article>
                </article>
                <article className={movie.synopsis && movie.synopsis.length > 0 ? "" : "d-none"}>
                    <p>{movie.synopsis}</p>
                </article>
                <article className={movie.director && movie.director.length > 0 ? "" : "d-none"}>
                    <p className="caption">Director</p>
                    <p>{movie.director}</p>
                </article>
                <article className={movie.starring && movie.starring.length > 0 ? "" : "d-none"}>
                    <p className="caption">Cast</p>
                    <p>{movie.starring}</p>
                </article>
                {
                    renderTheatresInfo()
                }
            </div>
        )
    }

    function renderTheatresInfo() {
        if (viewMode !== "expanded") {
            return
        }
        return (
            <div className="movie-theatres-info row row-cols-1">
                <article className="movie-theatres-info-header col row row-cols-2">
                    <p className="caption col-5">Theatre</p>
                    <div className={"col-7 row row-cols-2"}>
                        <p className="caption col-3">Date</p>
                        <p className="caption col-9">Time (Screen)</p>
                    </div>
                </article>
                {
                    renderTheatres()
                }
            </div>
        )
    }

    function renderTheatres() {
        return theatres.map((theatre: Theatre) => renderTheatre(theatre))
    }

    function renderTheatre(theatre: Theatre): ReactElement {
        return (
            <div key={theatre.id} className="movie-theatre-block col row row-cols-2">
                <Link className="movie-theatre-name col-5" to={`/Theatre/${theatre.id}`}>{theatre.name}</Link>
                <div className="movie-show-dates-block col-7">
                {
                    reduceSchedules(theatre).map((entry: ShowTimeDateEntry) => {
                        return renderTimeSlot(theatre, entry)
                    })
                }
                </div>
            </div>
        )
    }

    function renderTimeSlot(theatre: Theatre, entry: ShowTimeDateEntry) {
        return (
            <div className={"movie-show-date-block col row row-cols-2"} key={`${theatre.id}-${entry.date}}`}>
                <p className={"movie-show-date col-3"}>
                    {entry.date.replaceAll("-", "\u2011")}
                </p>
                <div className={"movie-show-times-block col-9 row row-cols-auto"}>
                {
                    entry.screenTimes.map(({screenId, time}) => (
                        <Link
                            className="movie-show-time-link col"
                            key={`${theatre.id}-${entry.date}-${time}-${screenId}`}
                            to={`/Booking/movie/${movie.id}/theatre/${theatre.id}/${screenId}/${entry.date}/${time}`}>
                            <span>{time}({theatre.screens[screenId].name}) </span>
                        </Link>
                    ))
                }
                </div>
            </div>
        )
    }

    function reduceSchedules(theatre: Theatre): ShowTimeDateEntry[] {
        const entries = schedules.filter((schedule: Schedule) => schedule.theatreId === theatre.id).reduce((acc: Record<string, ShowTimeDateEntry>, schedule: Schedule) => {
            for (const timeSlot of schedule.showTimes) {
                if (!acc[timeSlot.date]) {
                    acc[timeSlot.date] = {date: timeSlot.date, screenTimes: []}
                }
                for (const time of timeSlot.times) {
                    acc[timeSlot.date].screenTimes.push({
                        screenId: schedule.screenId,
                        time: time
                    })
                }
            }
            return acc
        }, {})
        for (const entry of Object.values(entries)) {
            entry.screenTimes.sort((a, b) => {
                const result = a.time.localeCompare(b.time)
                if (result !== 0) {
                    return result
                }
                return a.screenId - b.screenId
            })
        }
        return Object.values(entries).sort((a, b) => a.date.localeCompare(b.date))
    }

}

export default MovieView
