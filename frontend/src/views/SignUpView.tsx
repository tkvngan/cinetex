import {UseCaseCollection} from "cinetex-core/dist/application";
import React from "react";
import {SecurityContext} from "../security/SecurityContext";

export function SignUpView({interactors, securityContext}: { interactors: UseCaseCollection, securityContext: SecurityContext }) {
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [firstName, setFirstName] = React.useState<string>("")
    const [lastName, setLastName] = React.useState<string>("")

    return (
        <div>
            <div className="row row-cols-1 p-5" style={{backgroundColor: "rgba(0, 0, 0, 0.25"}}>
                <h1 className="text-center">Sign Up</h1>
                <div className="col m-4">
                    <label htmlFor="emailInput" className="form-label">Email</label>
                    <input type="email" className="form-control fs-2" id="emailInput"
                           style={{width: "40rem"}}
                           value={email}
                           placeholder="">
                    </input>
                </div>
                <div className="col m-4">
                    <label htmlFor="passwordInput" className="form-label">Password</label>
                    <input type="password" className="form-control fs-2" id="passwordInput"
                           style={{width: "40rem"}}
                           value={password}>

                    </input>
                </div>
                <div className="col m-4">
                    <label htmlFor="firstNameInput" className="form-label">First Name</label>
                    <input type="text" className="form-control fs-2" id="firstNameInput"
                           style={{width: "40rem"}}
                           value={firstName}
                           placeholder="John"></input>
                </div>
                <div className="col m-4">
                    <label htmlFor="lastNameInput" className="form-label">Last Name</label>
                    <input type="text" className="form-control fs-2" id="lastNameInput"
                           style={{width: "40rem"}}
                           value={lastName}
                           placeholder="Doe"></input>
                </div>
                <div className="col m-4">
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>
            </div>
        </div>
    )
}
