/** @jsxImportSource @emotion/react */
import {UseCaseCollection} from "cinetex-core/dist/application";
import {Theatre} from "cinetex-core/dist/domain/entities";
import {useEffect, useState} from "react";
import {css} from "@emotion/react";

const theatresViewStyle = css({
    p: {
        color: 'var(--cinetex-primary-light-color)',
        fontSize: '2.5rem',
        margin: '4px 4px 8px 4px',
    },
    ".image-box": {
        width: '300px',
        height: '200px',
        margin: '8px',
        boxShadow: '5px 10px 18px #000000',
        img: {
            height: '100%',
            width: '100%',
            objectFit: 'cover',
        }
    },
    ul: {
        width: '100%',
        padding: '18px 18px 24px 18px',
        listStyleType: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
})

export default function TheatresView({interactors}: {interactors: UseCaseCollection}) {
    const [theatres, setTheatres] = useState<Theatre[]>([])
    useEffect(() => {
        interactors.GetAllTheatres.invoke({}).then((theatres: Theatre[]) => {
            setTheatres(theatres)
        })
    }, [])

    return (
        <div id="TheatresView" css={theatresViewStyle}>
            <ul>
                {theatres && theatres.map((theatre) =>
                    <li key={theatre.id}>
                        <div>
                            <p>{theatre.name}</p>
                            <div className="image-box">
                                <img src={theatre.imageUrl} alt={theatre.name}/>
                            </div>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}
