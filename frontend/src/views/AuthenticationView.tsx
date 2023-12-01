import React from "react";
import {SecurityContext} from "../security/SecurityContext";
import * as bootstrap from "bootstrap"
import {
    ApplicationException,
    InvalidPasswordException,
    UserAlreadyExistsException,
    UserNotFoundException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {SignIn, SignUp} from "cinetex-core/dist/application/requests";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

export type AuthenticationViewProps = {
    id: string,
    signIn: SignIn,
    signUp: SignUp,
    security: SecurityContext,
}

export function AuthenticationView({id, signIn, signUp, security}: AuthenticationViewProps) {
    const ref = React.useRef<HTMLDivElement>(null)
    const [credentials, setCredentials] = React.useState<SecurityCredentials|undefined>()
    const [email, setEmail] = React.useState<string>("")
    const [password, setPassword] = React.useState<string>("")
    const [firstName, setFirstName] = React.useState<string>("")
    const [lastName, setLastName] = React.useState<string>("")
    const [phoneNumber, setPhoneNumber] = React.useState<string>("")
    const [errorMessages, setErrorMessages] = React.useState<string>("")
    const [isSigningUp, setSigningUp] = React.useState<boolean>(false)

    React.useEffect(() => {
        security.onCredentialsChanged = (credentials) => {
            setCredentials(credentials)
        }
        if (ref.current) {
            ref.current.addEventListener('hidden.bs.offcanvas', () => {
                setEmail("")
                setPassword("")
                setFirstName("")
                setLastName("")
                setPhoneNumber("")
                setErrorMessages("")
                setSigningUp(false)
            })
        }
    }, [])

    function onEmailInput(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }

    function onPasswordInput(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }

    function onFirstNameInput(event: React.ChangeEvent<HTMLInputElement>) {
        setFirstName(event.target.value)
    }

    function onLastNameInput(event: React.ChangeEvent<HTMLInputElement>) {
        setLastName(event.target.value)
    }

    function onPhoneNumberInput(event: React.ChangeEvent<HTMLInputElement>) {
        setPhoneNumber(event.target.value)
    }

    async function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            await submit()
        }
    }

    async function onSubmitButtonClick() {
        await submit()
    }

    async function submit(): Promise<void> {
        try {
            if (isSigningUp) {
                await signUp.invoke({email, password, firstName, lastName, phoneNumber});
            }
            await security.signIn(email, password);
            dismiss()
        } catch (e : any) {
            if (e instanceof UserNotFoundException) {
                setErrorMessages("Invalid username!");
            } else if (e instanceof InvalidPasswordException) {
                setErrorMessages("Invalid password!");
            } else if (e instanceof UserAlreadyExistsException) {
                setErrorMessages("User already registered!");
            } else if (e instanceof ApplicationException) {
                setErrorMessages(e.name + ": " + e.message);
            } else {
                setErrorMessages(e.message);
            }
        }
    }

    function dismiss() {
        if (ref.current) {
            bootstrap.Offcanvas.getInstance(ref.current)?.hide();
        }
    }

    function isSignedIn(): boolean {
        return credentials !== undefined
    }

    return (
        <div id={id}
             className="offcanvas offcanvas-end"
             ref={ref}
             tabIndex={-1} aria-labelledby={`${id}Title`}
             data-bs-theme="light">
            <div className="offcanvas-header">
                <h2 className="offcanvas-title" id={`${id}Title`}></h2>
                <button type="button" className="btn-close" onClick={dismiss} aria-label="Close"></button>
            </div>
            <form className="offcanvas-body mx-2 my-5 row row-cols-1 align-content-start bg-transparent"
                  style={{overflow: "hidden"}} noValidate={true}>
                <h1 className="col text-center">{isSigningUp ? "Sign Up" : "Sign In"}</h1>
                <div className={`col my-4 ms-5 ${isSignedIn() ? "" : "d-none"}`}>
                    <label htmlFor="firstNameInput" className="form-label fs-4">First Name</label>
                    <input
                        id="firstNameInput"
                        type="text" className="form-control fs-5 w-75"
                        onInput={onFirstNameInput}
                        onKeyUp={onKeyUp}
                    >
                    </input>
                </div>
                <div className={`col my-4 ms-5 ${isSigningUp ? "" : "d-none"}`}>
                    <label htmlFor="lastNameInput" className="form-label fs-4">Last Name</label>
                    <input
                        id="lastNameInput"
                        type="text" className="form-control fs-5 w-75"
                        onInput={onLastNameInput}
                        onKeyUp={onKeyUp}
                    >
                    </input>
                </div>
                <div className={`col my-4 ms-5 ${isSigningUp ? "" : "d-none"}`}>
                    <label htmlFor="phoneNumberInput text-start" className="form-label fs-4">Phone Number</label>
                    <input
                        id="phoneNumberInput"
                        type="tel" className="form-control fs-5 w-75"
                        onInput={onPhoneNumberInput}
                        onKeyUp={onKeyUp}
                    >
                    </input>
                </div>
                <div className="col my-4 ms-5">
                    <label htmlFor="emailInput text-start" className="form-label fs-4">Email</label>
                    <input
                        id="emailInput"
                        type="email" className="form-control fs-5 w-75"
                        onInput={onEmailInput}
                        onKeyUp={onKeyUp}
                    >
                    </input>
                </div>
                <div className="col my-4 ms-5">
                    <label htmlFor="passwordInput" className="form-label fs-4">Password</label>
                    <input
                        id="passwordInput"
                        type="password" className="form-control fs-5 w-75"
                        onInput={onPasswordInput}></input>
                </div>
                <div className="col my-2 ms-5">
                    <p className="text-danger fs-4">{errorMessages}</p>
                </div>
                <div className="col my-4 ms-5">
                    <button
                        type="button" className="btn btn-primary w-75"
                        onClick={onSubmitButtonClick}>{isSigningUp ? "Sign Up" : "Sign In"}</button>
                </div>
                <article className={`col my-4 ms-5 fs-4 ${isSigningUp ? "d-none" : ""}`}>
                    <p>Don't have an account? <a className="text-decoration-none" onClick={() => setSigningUp(false)}>Sign Up</a></p>
                </article>
            </form>
        </div>
    )
}
