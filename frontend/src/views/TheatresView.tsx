/** @jsxImportSource @emotion/react */
import {UseCaseCollection} from "cinetex-core/dist/application";
import {Theatre} from "cinetex-core/dist/domain/entities";
import React, {useEffect, useState} from "react";
import {css} from "@emotion/react";
import * as Icons from "react-bootstrap-icons";


const theatresViewStyle = css({
    fontFamily: 'var(--cinetex-font-family)',
    ".theatres-toolbar": {
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

    ".theatres": {
        paddingTop: '2rem',

    },

    ".theatre": {
        margin: '2rem',
    },

    ".theatre-image-box": {
        boxShadow: '5px 10px 18px #000000',
        width: '300px',
        height: '200px',
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
    ".theatre-info-box": {
        margin: "0.25rem 1.5rem 0.25rem 1.5rem",
        ".theatre-title": {
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
    }
})

type OrderBy = "name" | "location"

export function TheatresView({interactors}: {interactors: UseCaseCollection}) {
    const {GetAllTheatres} = interactors
    const [theatres, setMoves] = useState<Theatre[]>([])
    const [isListView, setIsListView] = useState<boolean>(true)
    const [orderBy, setOrderBy] = useState<OrderBy>("name")
    const [orderDirection, setOrderDirection] = useState<number>(1)

    useEffect(() => {
        GetAllTheatres.invoke({}).then((theatres: Theatre[]) => {
            setMoves(sortTheatres(theatres))
        })
    }, [orderBy, orderDirection])

    function sortTheatres(theatres: Theatre[]): Theatre[] {
        const copy = [...theatres]
        const direction = orderDirection
        const by = orderBy
        return copy.sort((theatre1, theatre2) => {
            if (by === "name") {
                return theatre1.name.localeCompare(theatre2.name) * direction
            } else if (orderBy === "location") {
                const result = theatre1.location.state.localeCompare(theatre2.location.state) * direction
                if (result !== 0) {
                    return result
                }
                return theatre1.location.city.localeCompare(theatre2.location.city) * direction
            }
            return 0
        })
    }

    function toggleOrderBy(newOrderBy: OrderBy) {
        if (orderBy === newOrderBy) {
            setOrderDirection(orderDirection * -1)
        } else {
            setOrderBy(newOrderBy)
        }
    }

    function orderIcon(by: OrderBy) {
        const visible = visibleWhenOrderBy(by)
        return orderDirection === 1 ? <Icons.SortDown className={visible}/> : <Icons.SortUp className={visible}/>
    }

    function visibleWhenOrderBy(by: OrderBy) {
        return by === orderBy ? "visible" : "invisible"
    }

    return (
        <div id="TheatresView" className="container" css={theatresViewStyle}>
            <div className={"theatres-toolbar d-flex justify-content-end"}>
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
                               onClick={() => {toggleOrderBy("location")}}>{orderIcon("location")} Location
                            </a>
                        </li>
                    </ul>
                </span>
            </div>
            <div className={`theatres row row-cols-${isListView ? "1" : "auto"}`}>{theatres && theatres.map(theatre =>
                <div className={"theatre col row row-cols-2"}
                    key={theatre.id} >
                    <div className={"theatre-image-box col d-flex align-items-center"}>{
                        theatre.imageUrl ?
                            <img className="col" src={theatre.imageUrl} alt={theatre.name}/> :
                            <h4 className="col text-center">{theatre.name}</h4>
                    }
                    </div>
                    <div className={`theatre-info-box col ${isListView ? "" : "d-none"} col`}>
                        <h1 className={"theatre-title"}>{theatre.name}</h1>
                        <article className="row">
                            <article className="col">
                                <p className="caption">Location</p>
                                <p>
                                    <span>{theatre.location.street}</span><br/>
                                    <span>{theatre.location.city}</span><br/>
                                    <span>{theatre.location.state} {theatre.location.zip}</span>
                                </p>
                            </article>
                            <article className="col">
                                <p className="caption">Phone</p>
                                <p>{theatre.phone}</p>
                            </article>
                            <article className="col">
                                <p className="caption">Screens</p>
                                <p>{theatre.screens.map((screen) => screen.name).join(", ")}</p>
                            </article>
                        </article>
                    </div>
                </div>
            )}
            </div>
        </div>
    )

}

export default TheatresView
