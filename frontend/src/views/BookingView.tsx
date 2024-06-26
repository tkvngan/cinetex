/** @jsxImportSource @emotion/react */
import {useParams} from "react-router-dom";
import React, {MouseEvent, useEffect, useState} from "react";
import {AuditoriumModel} from "../models/AuditoriumModel";
import {SeatPosition} from "cinetex-core/dist/domain/entities/Booking";
import {SeatType} from "cinetex-core/dist/domain/entities/Theatre";
import {CartModel} from "../models/CartModel";


type BookingViewParams = {
    movieId: string,
    theatreId: string,
    screenId: string,
    date: string,
    time: string
}

function error(msg: string): never {
    throw new Error(msg)
}

function renderSeat(color: string = "#1985FF") {
    return (
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                {/*<rect width="12" height="12" fill="white"/>*/}
                <g transform="translate(0.25,0.5) scale(1.1)">
                    <path
                        d="M3.78976 0H6.62369C7.67985 0 8.53528 1.01762 8.53528 2.27402V7.45594H1.87817V2.27402C1.87817 1.01762 2.736 0 3.78976 0Z"
                        fill={color}/>
                    <path
                        d="M10.2078 8.01296V1.92427C10.2078 1.92427 10.2508 1.2307 9.62476 1.2307C8.99872 1.2307 9.00111 1.9527 9.00111 1.9527V8.00443L5.15643 8.0158L1.41688 8.00443V1.94417C1.41688 1.94417 1.41688 1.22217 0.793223 1.22217C0.169567 1.22217 0.210189 1.91574 0.210189 1.91574V8.00443C0.210189 8.00443 0.0835458 9.99135 2.42763 9.99135H7.98797C7.98797 9.99135 5.64388 10.0027 7.98797 10.0027C10.3321 10.0027 10.2054 8.0158 10.2054 8.0158L10.2078 8.01296Z"
                        fill={color}/>
                </g>
            </g>
        </svg>
    )
}

function renderScreen(className: string, width: string, screenName: string = "SCREEN") {
    return (
        <svg className={className} width={width}>
            <g className="screen">
                <svg width={width} height="198.0515759312321" viewBox="0 0 349 48" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <svg viewBox="0 0 349 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity=".4" filter="url(#a)">
                            <path d="M18.5 29.42h312l-16.471-6.315c-93.638-6.372-188.778-6.372-278.41.796L18.5 29.421Z"
                                  fill="#EEE"></path>
                        </g>
                        <path opacity=".4"
                              d="M35.69 24.786 6 15.59c116.287-11.226 217.251-11.418 336 0l-29.168 9.19c-134.756-11.749-244.85-3.685-277.143.007Z"
                              fill="#D9EBFF"></path>
                        <path
                        d="M6 10.298c134.009-11.473 205.755-10.647 336 0v5.291C211.139 4.506 137.586 4.387 6 15.59v-5.291Z"
                        fill="#545557"></path>
                    <defs>
                        <filter id="a" x=".819" y=".74" width="347.362" height="46.362" filterUnits="userSpaceOnUse"
                                colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                            <feGaussianBlur stdDeviation="8.841"
                                            result="effect1_foregroundBlur_2158_127687"></feGaussianBlur>
                        </filter>
                    </defs>
                </svg>
                <text x="174.5" y="27" dominantBaseline="middle" textAnchor="middle" fill="#9DACC1" fontSize="8px"
                      fontWeight="lighter" fontFamily="MarkOT, sans-serif">SCREEN {screenName}
                </text>
            </svg>
        </g>
        </svg>
    )
}

export interface BookingViewProps {
    cart: CartModel
    auditorium: AuditoriumModel
}

export function BookingView({cart, auditorium}: BookingViewProps) {
    const params = useParams<BookingViewParams>()
    const movieId = params.movieId ? params.movieId : error("movieId is undefined")
    const theatreId = params.theatreId ?? error("theatreId is undefined")
    const screenId = params.screenId ? parseInt(params.screenId) : error("screenId is undefined")
    const date = params.date ?? error("date is undefined")
    const time = params.time ?? error("time is undefined")
    const [auditoriumState, setAuditoriumState] = useState(auditorium.state)

    async function initializeAuditorium() {
        await auditorium.handle({
            action: 'initialize',
            movieId, theatreId, screenId, date, time
        })
        for (const item of cart.state.items) {
            if (item.movie.id === movieId &&
                item.theatre.id === theatreId &&
                item.screenId === screenId &&
                item.date === date &&
                item.time === time) {
                await auditorium.handle({
                    action: 'selectSeat',
                    row: item.seat.row,
                    column: item.seat.column
                })
            }
        }
    }

    useEffect(() => {
        initializeAuditorium().catch()
        const auditoriumSubscriber = auditorium.subscribe(async (state) => {
            if (state !== undefined) {
                await cart.handle({
                    action: 'update',
                    movie: state.movie,
                    theatre: state.theatre,
                    screenId: state.screen.id,
                    date: date,
                    time: time,
                    seats: state.selectedSeatPositions.getSeats()
                })
                setAuditoriumState(state)
            }
        })
        return () => {
            auditoriumSubscriber.dispose()
        }
    }, [])

    function seatClassName(seat: SeatPosition): string {
        let className = "seat"
        if (auditoriumState === undefined) {
            return className;
        }
        if (auditoriumState.getSeatType(seat.row, seat.column) === SeatType.Unavailable) {
            className += " seat-unavailable"
        }
        if (auditoriumState.isSeatOccupied(seat.row, seat.column)) {
            className += " seat-occupied"
        }
        if (auditoriumState.isSeatSelected(seat.row, seat.column)) {
            className += " seat-selected"
        }
        return className
    }

    function seatKey(seat: SeatPosition): string {
        return `seat-${seat.row}-${seat.column}`
    }

    async function onClickSeat(event: MouseEvent, seat: SeatPosition) {
        if (auditoriumState === undefined) {
            return
        }
        if (auditoriumState.isSeatOccupied(seat.row, seat.column) ||
            auditoriumState.getSeatType(seat.row, seat.column) === SeatType.Unavailable) {
            return
        }
        if (auditoriumState.isSeatSelected(seat.row, seat.column)) {
            console.log("unselectSeat", seat)
            await auditorium.handle({action: 'unselectSeat', row: seat.row, column: seat.column})
        } else {
            console.log("selectSeat", seat)
            await auditorium.handle({action: 'selectSeat', row: seat.row, column: seat.column})
        }
    }

    return (
        <div
            className=""
            css={{
                td: {
                    backgroundColor: 'transparent',
                },
                ".screen": {
                    marginTop: "-100px"
                },

                ".movie-image": {
                    width: "10rem",
                    height: "15rem",
                    objectFit: "cover",
                },
                ".seat": {
                    padding: '2px',
                    svg: {
                        width: '2rem',
                        height: '2rem',
                        cursor: 'pointer',
                        backgroundColor: 'transparent',
                        "&:hover": {
                            backgroundColor: 'var(--cinetex-primary-color)',
                        },
                    }
                },
                ".seat-unavailable": {
                    div: {
                        backgroundColor: 'transparent',
                        cursor: 'default',
                    }
                },
                ".seat-occupied": {
                    svg: {
                    }
                },
                ".seat-selected": {
                    svg: {
                        backgroundColor: 'transparent',
                        "&:hover": {
                            backgroundColor: 'transparent',
                        },
                    }
                },
                ".after-front-rows": {
                    paddingTop: '1rem',
                },
                ".side-columns-right": {
                    paddingLeft: '1rem',
                },
                ".side-columns-left": {
                    paddingRight: '1rem',
                },
                ".row-index": {
                    fontSize: '10px',
                    paddingRight: '0.5rem',
                },
                ".column-index": {
                    fontSize: '10px',
                    paddingTop: '0.5rem',
                    textAlign: 'center',
                },
            }}>
            <div className={"row row-cols-2"}>
                <img className="movie-image col-3" src={auditoriumState?.movie.mediumPosterImageUrl} alt={auditoriumState?.movie.name}/>
                <div className={"col-9"}>
                    <h1 className={""}>{auditoriumState?.movie.name}</h1>
                    <h5  className={""}>{auditoriumState?.theatre.name}</h5>
                    {/*<p  className={'col-1'}>{model?.movie?.ratings?.filter(r => r.provinceCode === 'ON')[0]?.rating}</p>*/}
                    <p  className={"col"}>{date.replaceAll("-", "\u2011")} {time}</p>
                </div>
            </div>

            <div className={"row row-cols-1 justify-content-center"}>
                <div className={"col col-auto"}>
                    {renderScreen("screen", "800px", auditoriumState?.screen.name)}
                </div>
                <table className="col-auto" cellSpacing={0} cellPadding={0}>
                    <tbody>
                    { auditoriumState?.screen?.seats.map((seatTypes, row) =>
                        <tr key={"row-" + row}>
                            <td className={"row-index"}>{row}</td>
                            { seatTypes.map((seatType, column) =>
                                <td
                                    key={seatKey({row, column})}
                                    className={
                                        seatClassName({row, column})
                                        // +
                                        //     (rowIndex === model.screen.frontRows ? " after-front-rows" : "") +
                                        //     (colIndex === model.screen.sideColumns ? " side-columns-right" : "") +
                                        //     (colIndex === model.screen.columns - model.screen.sideColumns - 1? " side-columns-left" : "")
                                    }
                                    onClick={(e) => onClickSeat(e, {row, column})}>
                                    {
                                        seatType === SeatType.Unavailable ? <div/> :
                                            auditoriumState.isSeatOccupied(row, column) ? renderSeat("#262c38") :
                                                auditoriumState.isSeatSelected(row, column) ? renderSeat("#FFFF00") :
                                                    renderSeat()
                                    }
                                </td>
                            )}
                        </tr>
                    )}
                    <tr>
                        <td/>
                        { auditoriumState?.screen.seats[0].map((seatType, column) =>
                            <td key={column} className="column-index">{column}</td>
                        )}
                    </tr>
                   </tbody>
                </table>
            </div>
        </div>
    )
}
