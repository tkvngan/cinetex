/** @jsxImportSource @emotion/react */
import {useParams} from "react-router-dom";
import {UseCaseCollection} from "cinetex-core/dist/application/UseCaseCollection";
import React, {MouseEvent, useEffect, useReducer, useState} from "react";
import {AuditoriumModel, createAuditoriumModel, SeatModel} from "../models/AuditoriumModel";
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

export function BookingView({interactors, cart}: { interactors: UseCaseCollection, cart: CartModel }) {
    const params = useParams<BookingViewParams>()
    const movieId = params.movieId ? params.movieId : error("movieId is undefined")
    const theatreId = params.theatreId ?? error("theatreId is undefined")
    const screenId = params.screenId ? parseInt(params.screenId) : error("screenId is undefined")
    const date = params.date ?? error("date is undefined")
    const time = params.time ?? error("time is undefined")

    const [model, setModel] = useState<AuditoriumModel>()
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        async function createModel() {
            const model = await createAuditoriumModel(interactors, movieId, theatreId, screenId, date, time)
            for (const item of cart.items) {
                if (item.movie.id === model.movie.id &&
                    item.theatre.id === model.theatre.id &&
                    item.screenId === model.screen.id &&
                    item.date === date &&
                    item.time === time) {
                    model.selectSeat(item.seat.row, item.seat.column)
                }
            }
            model.subscribe(() => {
                const selectedSeats = model.getSelectedSeats()
                console.log("BookingView: selectedSeats =", selectedSeats)
                const cartSeats: SeatPosition[] = selectedSeats.map((seat) => {
                    return {row: seat.row, column: seat.column}
                })
                console.log("BookingView: cartSeats =", cartSeats);
                cart.updateItems(model.movie, model.theatre, model.screenId, date, time, cartSeats)
                forceUpdate()
            })
            setModel(model)
        }

        createModel().then().catch((err) => {
            console.error("BookingView: error creating model:", err)
        })
    }, [])

    function seatClassName(seat: SeatModel): string {
        let className = "seat"
        if (seat.type === SeatType.Unavailable) {
            className += " seat-unavailable"
        }
        if (seat.isOccupied) {
            className += " seat-occupied"
        }
        if (seat.isSelected) {
            className += " seat-selected"
        }
        return className
    }

    function seatKey(seat: SeatModel): string {
        return `seat-${seat.row}-${seat.column}`
    }

    function onClickSeat(event: MouseEvent, seat: SeatModel) {
        if (seat.isOccupied || seat.type === SeatType.Unavailable) {
            return
        }
        if (seat.isSelected) {
            model?.unselectSeat(seat.row, seat.column)
        } else {
            model?.selectSeat(seat.row, seat.column)
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
                <img className="movie-image col-3" src={model?.movie.mediumPosterImageUrl} alt={model?.movie.name}/>
                <div className={"col-9"}>
                    <h1 className={""}>{model?.movie.name}</h1>
                    <h5  className={""}>{model?.theatre.name}</h5>
                    {/*<p  className={'col-1'}>{model?.movie?.ratings?.filter(r => r.provinceCode === 'ON')[0]?.rating}</p>*/}
                    <p  className={"col"}>{date.replaceAll("-", "\u2011")} {time}</p>
                </div>
            </div>

            <div className={"row row-cols-1 justify-content-center"}>
                <div className={"col col-auto"}>
                    {renderScreen("screen", "50rem", model?.screen.name)}
                </div>
                <table className="col-auto" cellSpacing={0} cellPadding={0}>
                    <tbody>
                    { model?.seats.map((row, rowIndex) =>
                        <tr key={"row-" + row[0].row}>
                            <td className={"row-index"}>{rowIndex}</td>
                            { row.map((seat, colIndex) =>
                                <td
                                    key={seatKey(seat)}
                                    className={
                                        seatClassName(seat)
                                        // +
                                        //     (rowIndex === model.screen.frontRows ? " after-front-rows" : "") +
                                        //     (colIndex === model.screen.sideColumns ? " side-columns-right" : "") +
                                        //     (colIndex === model.screen.columns - model.screen.sideColumns - 1? " side-columns-left" : "")
                                    }
                                    onClick={(e) => onClickSeat(e, seat)}>
                                    {
                                        seat.type === SeatType.Unavailable ? <div/> :
                                            seat.isOccupied ? renderSeat("#262c38") :
                                                seat.isSelected ? renderSeat("#FFFF00") : renderSeat()
                                    }
                                </td>
                            )}
                        </tr>
                    )}
                    <tr>
                        <td/>
                        { model?.seats[0].map((seat, colIndex) =>
                            <td key={colIndex} className={"column-index"}>{colIndex}</td>
                        )}
                    </tr>
                   </tbody>
                </table>
            </div>
        </div>
    )
}
