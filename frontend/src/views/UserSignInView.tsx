/** @jsxImportSource @emotion/react */

import React, {ReactElement, useState, useEffect, useRef, KeyboardEvent, ChangeEvent} from "react";
import {SecurityContext} from "../security/SecurityContext";
import * as bootstrap from "bootstrap"
import {
    ApplicationException,
    InvalidPasswordException,
    UserAlreadyExistsException,
    UserNotFoundException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";

export type UserSignInViewProps = {
    id: string,
    security: SecurityContext,
}

type Mode = "signIn" | "signUp" | "info"

export function UserSignInView({id, security}: UserSignInViewProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [credentials, setCredentials] = useState<SecurityCredentials|undefined>()
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [firstName, setFirstName] = useState<string>("")
    const [lastName, setLastName] = useState<string>("")
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [errorMessages, setErrorMessages] = useState<string>("")
    const [mode, setMode] = useState<Mode>(security.isAuthenticated ? "info" : "signIn")

    function isSigningUp(): boolean {
        return mode === "signUp"
    }

    function updateFields(credentials?: SecurityCredentials) {
        setEmail(credentials ? credentials.user.email : "")
        setFirstName(credentials ? credentials.user.firstName??"" : "")
        setLastName(credentials ? credentials.user.lastName??"" : "")
        setPhoneNumber(credentials ? credentials.user.phoneNumber??"" : "")
    }

    useEffect(() => {
        const subscription = security.subscribe((credentials) => {
            setCredentials(credentials)
            updateFields(credentials)
        })
        setMode(security.isAuthenticated ? "info" : "signIn")
        updateFields(security.credentials)
        setErrorMessages("")
        setPassword("")
        if (ref.current) {
            ref.current.addEventListener('hidden.bs.offcanvas', () => {
                setPassword("")
                if (mode === "signUp") setMode("signIn")
            })
        }
        return () => {
            subscription.unsubscribe()
        }
    }, []);

    function onEmailInput(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value)
    }

    function onPasswordInput(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value)
    }

    function onFirstNameInput(event: ChangeEvent<HTMLInputElement>) {
        setFirstName(event.target.value)
    }

    function onLastNameInput(event: ChangeEvent<HTMLInputElement>) {
        setLastName(event.target.value)
    }

    function onPhoneNumberInput(event: ChangeEvent<HTMLInputElement>) {
        setPhoneNumber(event.target.value)
    }

    async function onKeyUpSubmit(event: KeyboardEvent<HTMLInputElement>) {
        // if (event.key === "Enter") await submit()
    }

    async function onSubmitButtonClick() {
        await submit()
    }

    async function submit(): Promise<void> {
        try {
            switch (mode) {
                case "signIn":
                    await security.signIn(email, password);
                    break;
                case "signUp":
                    await security.signUp({email, password, firstName, lastName, phoneNumber});
                    break;
                case "info":
                    await security.signOut();
                    break;
            }
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
        setMode(security.isAuthenticated ? "info" : "signIn")
        setErrorMessages("")
    }

    function getTitle(): string {
        switch (mode) {
            case "signIn":
                return "Sign In"
            case "signUp":
                return "Sign Up"
            case "info":
                return "User Info"
        }
    }

    function displayFor(...modes: Mode[]): string {
        return modes.includes(mode) ? "" : "d-none"
    }

    return (
        <div id={id}
             className="offcanvas offcanvas-end"
             ref={ref}
             tabIndex={-1} aria-labelledby={`${id}Title`}
             data-bs-theme="light">
            <div className="offcanvas-header">
                <button type="button"
                    className="btn btn-close"
                    onClick={dismiss}
                    aria-label="Close"
                    style={{filter: "none"}} // remove this if dark theme is used
                >
                </button>
            </div>
            <form className="offcanvas-body my-1 row row-cols-1 align-content-start bg-transparent overflow-hidden" noValidate={true}>
                <h2 className="col text-center">{getTitle()}</h2>
                <div className={`col my-3 ${displayFor("info", "signUp")}`}>
                    <label htmlFor={"firstNameInput"} className="form-label ">First Name:</label>
                    <input
                        id={"firstNameInput"}
                        type={"text"} className="form-control w-100"
                        value={firstName}
                        onInput={onFirstNameInput}
                        onKeyUp={onKeyUpSubmit}
                        readOnly={mode === "info"}
                    >
                    </input>
                </div>
                <div className={`col my-3 ${displayFor("info", "signUp")}`}>
                    <label htmlFor={"lastNameInput"} className="form-label ">Last Name:</label>
                    <input
                        id={"lastNameInput"}
                        type={"text"} className="form-control w-100"
                        value={lastName}
                        onInput={onLastNameInput}
                        onKeyUp={onKeyUpSubmit}
                        readOnly={mode === "info"}
                    >
                    </input>
                </div>
                <div className={`col my-3 ${displayFor("info", "signUp")}`}>
                    <label htmlFor={"phoneNumberInput"} className="form-label ">Phone Number:</label>
                    <input
                        id={"phoneNumberInput"}
                        type={"tel"} className="form-control w-100"
                        value={phoneNumber}
                        onInput={onPhoneNumberInput}
                        onKeyUp={onKeyUpSubmit}
                        readOnly={mode === "info"}
                    >
                    </input>
                </div>
                <div className={`col my-3 ${displayFor("info", "signIn", "signUp")}`}>
                    <label htmlFor={"emailInput"} className="form-label ">Email:</label>
                    <input
                        id={"emailInput"}
                        type={"email"} className="form-control w-100"
                        value={email}
                        onInput={onEmailInput}
                        onKeyUp={onKeyUpSubmit}
                        readOnly={mode === "info"}
                    >
                    </input>
                </div>
                <div className={`col my-3 ${displayFor("signUp", "signIn")}`}>
                    <label htmlFor={"passwordInput"} className="form-label ">Password:</label>
                    <input
                        id={"passwordInput"}
                        type={"password"} className="form-control w-100"
                        value={password}
                        onInput={onPasswordInput}
                        onKeyUp={onKeyUpSubmit}
                        readOnly={mode === "info"}
                    >
                    </input>
                </div>

                <div className="col my-1" css={{height: "2rem"}}>
                    <p className="text-danger ">{errorMessages}</p>
                </div>
                <div className="col my-3">
                    <button type="button"
                        className="btn btn-primary w-100"
                        onClick={onSubmitButtonClick}>{
                           mode === "info" ? "Sign off" : (
                                 mode === "signIn" ? "Sign in" : "Sign up"
                           )
                    }</button>
                </div>
                <div className={`col my-4 ${isSigningUp() ? "d-none" : ""}`}>
                    <span>Don't have an account?</span>
                    <button type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => setMode("signUp")}>Sign Up</button>
                </div>
            </form>
        </div>
    )
}
