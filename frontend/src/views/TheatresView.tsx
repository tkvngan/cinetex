import {UseCaseCollections} from "cinetex-core/dist/application";
import {Theatre} from "cinetex-core/dist/domain/entities";
import {useEffect, useState} from "react";
import "../css/TheatresView.css"

export default function TheatresView({interactors}: {interactors: UseCaseCollections}) {
    const [theatres, setTheatres] = useState<Theatre[]>([])
    useEffect(() => {
        interactors.GetAllTheatres.invoke({}).then((theatres: Theatre[]) => {
            setTheatres(theatres)
        })
    }, [])

    return (
        <div id="TheatresView">
            <ul>
                {theatres && theatres.map((theatre) =>
                    <li key={theatre.id}>
                        <div>
                            <p>{theatre.name}</p>
                            <img src={theatre.imageUrl} alt={theatre.name}/>
                        </div>
                    </li>
                )}
            </ul>
        </div>
    );
}
