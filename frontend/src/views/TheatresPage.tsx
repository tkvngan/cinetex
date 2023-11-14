import {UseCaseCollections} from "shared/dist/application/usecases";
import {Theatre} from "shared/dist/domain/entities";
import {useEffect, useState} from "react";

export default function TheatresPage({interactors}: {interactors: UseCaseCollections}) {
    const [theatres, setTheatres] = useState<Theatre[]>([])
    useEffect(() => {
        interactors.GetAllTheatres.invoke({}).then((theatres: Theatre[]) => {
            setTheatres(theatres)
        })
    })
    return (
        <div id={"TheatresPage"}>
            <ul>
                {theatres && theatres.map((theatre) =>
                    <li key={theatre.id}>
                        <div>
                            <h2>{theatre.name}</h2>
                            <img src={theatre.imageUrl} alt={theatre.name}/>
                        </div>

                    </li>
                )}
            </ul>
        </div>
    );


}
