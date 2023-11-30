import {Link} from "react-router-dom";
import React from "react";
import {SecurityContext} from "../security/SecurityContext";

export type SignInViewProps = {
    id: string
    security: SecurityContext
}

export function SignInView({id, security}: SignInViewProps) {
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")

    const offCanvasSignInRef = React.useRef<HTMLDivElement>(null)

    function onEmailInput(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }

    function onPasswordInput(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }

    async function onSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        console.log("Sign In, email: " + email + ", password: " + password)
        const credentials = await security.signIn(email, password)
        console.log("Credentials: " + JSON.stringify(credentials))
    }

    return (
        <div id={id}
             className="offcanvas offcanvas-end"
             ref={offCanvasSignInRef}
             tabIndex={-1} aria-labelledby={id + "Title"}
             style={{backgroundColor: "rgba(0,0,0,0.75)", width: "50rem"}}>
            <div className="offcanvas-header">
                <h2 className="offcanvas-title" id={id + "Title"}></h2>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body mt-5 row row-cols-1 align-content-start bg-transparent">
                <h1 className="col text-center">Sign In</h1>
                <div className="col m-5">
                    <label htmlFor="emailInput text-start" className="form-label fs-4">Email</label>
                    <input
                        id="emailInput"
                        type="email" className="form-control fs-3 w-50"
                        onInput={onEmailInput}>

                    </input>
                </div>
                <div className="col m-5 text-start">
                    <label htmlFor="passwordInput" className="form-label fs-4">Password</label>
                    <input
                        id="passwordInput"
                        type="password" className="form-control fs-3 w-50"
                        onInput={onPasswordInput}></input>
                </div>
                <div className="col m-5">
                    <button
                        type="submit" className="btn btn-primary w-50"
                        data-bs-dismiss="offcanvas"
                        onClick={onSubmit}
                    >Sign In</button>
                </div>
                <article className="col m-5">
                    <p>Don't have an account? <Link className="text-decoration-none" data-bs-dismiss="offcanvas" to={"/SignUp"}>Sign Up</Link></p>
                </article>
            </div>
        </div>
    )
}
