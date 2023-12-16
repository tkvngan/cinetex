/** @jsxImportSource @emotion/react */

import React, {ChangeEvent, KeyboardEvent, ReactElement, useEffect, useRef, useState} from "react";
import {SecurityContext} from "../security/SecurityContext";
import * as bootstrap from "bootstrap"
import {
    ApplicationException,
    InvalidPasswordException,
    UserAlreadyExistsException,
    UserNotFoundException
} from "cinetex-core/dist/application/exceptions/Exceptions";
import {SecurityCredentials} from "cinetex-core/dist/security/SecurityCredentials";
import validate from "validate.js";


export type UserSignInViewProps = {
    id: string,
    security: SecurityContext,
}

type Mode = "signIn" | "signUp" | "info"

type Field = {
    id: string,
    type: string,
    label: string,
    value: string,
    constraint?: any,
    message?: string,
}

export function UserSignInView({id, security}: UserSignInViewProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [credentials, setCredentials] = useState<SecurityCredentials|undefined>()
    const [mode, setMode] = useState<Mode>(security.isAuthenticated ? "info" : "signIn")
    const [errorMessage, setErrorMessage] = useState<string>("")

    const [emailField, setEmailField] = useState<Field>(
        {id: "email", label: "Email", type: "email", value: "", constraint: {presence: {allowEmpty: false}, email: true}})
    const [passwordField, setPasswordField] = useState<Field>(
        {id: "password", label: "Password", type: "password", value: "", constraint: {presence: {allowEmpty: false}, length: {minimum: 8, message: "must be at least 8 characters"}}})
    const [firstNameField, setFirstNameField] = useState<Field>(
        {id: "firstName", label: "First Name", type: "text", value: "", constraint: {presence: {allowEmpty: false}}})
    const [lastNameField, setLastNameField] = useState<Field>(
        {id: "lastName", label: "Last Name", type: "text", value: "", constraint: {presence: {allowEmpty: false}}})
    const [phoneNumberField, setPhoneNumberField] = useState<Field>(
        {id: "phoneNumber", label: "Phone Number", type: "text", value: "", constraint: {presence: {allowEmpty: false}}})

    function isSigningUp(): boolean {
        return mode === "signUp"
    }

    function updateFields(credentials?: SecurityCredentials) {
        const user = credentials?.user
        setEmailField({...emailField, value: user?.email??"", message: ""})
        setPasswordField({...passwordField, value: "", message: ""})
        setFirstNameField({...firstNameField, value: user?.firstName??"", message: ""})
        setLastNameField({...lastNameField, value: user?.lastName??"", message: ""})
        setPhoneNumberField({...phoneNumberField, value: user?.phoneNumber??"", message: ""})
    }

    useEffect(() => {
        const subscription = security.subscribe((credentials) => {
            setCredentials(credentials)
            updateFields(credentials)
            setMode(security.isAuthenticated ? "info" : "signIn")
        })
        setMode(security.isAuthenticated ? "info" : "signIn")
        updateFields(security.credentials)
        if (ref.current) {
            ref.current.addEventListener('hidden.bs.offcanvas', () => {
                setPasswordField({...passwordField, value: ""})
                clearMessages()
            })
            ref.current.addEventListener('show.bs.offcanvas', () => {
                updateFields(security.credentials)
            })
        }
        return () => {
            subscription.unsubscribe()
        }
    }, []);

    function onEmailInput(event: ChangeEvent<HTMLInputElement>) {
        setEmailField({...emailField, value: event.target.value})
    }

    function onPasswordInput(event: ChangeEvent<HTMLInputElement>) {
        setPasswordField({...passwordField, value: event.target.value})
    }

    function onFirstNameInput(event: ChangeEvent<HTMLInputElement>) {
        setFirstNameField({...firstNameField, value: event.target.value})
    }

    function onLastNameInput(event: ChangeEvent<HTMLInputElement>) {
        setLastNameField({...lastNameField, value: event.target.value})
    }

    function onPhoneNumberInput(event: ChangeEvent<HTMLInputElement>) {
        setPhoneNumberField({...phoneNumberField, value: event.target.value})
    }

    async function onKeyUpSubmit(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") await submit()
    }

    async function onSubmitButtonClick() {
        await submit()
    }

    async function submitSignIn(): Promise<void> {
        if (validateSignInForm()) {
            await security.signIn(emailField.value.trim(), passwordField.value.trim());
            dismiss()
        }
    }

    async function submitSignUp(): Promise<void> {
        if (validateSignUpForm()) {
            await security.signUp({
                email: emailField.value.trim(),
                password: passwordField.value.trim(),
                firstName: firstNameField.value.trim(),
                lastName: lastNameField.value.trim(),
                phoneNumber: phoneNumberField.value.trim(),
            });
            dismiss()
        }
    }

    async function submit(): Promise<void> {
        try {
            switch (mode) {
                case "signIn":
                    return await submitSignIn()
                case "signUp":
                    return await submitSignUp()
                case "info":
                    return await security.signOut();
            }
        } catch (e : any) {
            if (e instanceof UserNotFoundException) {
                setEmailField({...emailField, message: "User not found!"})
            } else if (e instanceof InvalidPasswordException) {
                setPasswordField({...passwordField, message: "Invalid password!"})
            } else if (e instanceof UserAlreadyExistsException) {
                setErrorMessage("User already registered!");
            } else if (e instanceof ApplicationException) {
                setErrorMessage(e.name + ": " + e.message);
            } else {
                setErrorMessage(e.message);
            }
        }
    }

    function dismiss() {
        if (ref.current) {
            bootstrap.Offcanvas.getInstance(ref.current)?.hide();
        }
        setMode(security.isAuthenticated ? "info" : "signIn")
        clearMessages()
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

    function clearFields() {
        setEmailField({...emailField, value: "", message: ""})
        setPasswordField({...passwordField, value: "", message: ""})
        setFirstNameField({...firstNameField, value: "", message: ""})
        setLastNameField({...lastNameField, value: "", message: ""})
        setPhoneNumberField({...phoneNumberField, value: "", message: ""})
    }

    function clearMessages() {
        setEmailField({...emailField, message: ""})
        setPasswordField({...passwordField, message: ""})
        setFirstNameField({...firstNameField, message: ""})
        setLastNameField({...lastNameField, message: ""})
        setPhoneNumberField({...phoneNumberField, message: ""})
    }

    function validateSignInForm(): boolean {
        const constraints = {
            email: emailField.constraint,
            password: passwordField.constraint,
        }
        const validation = validate.validate({
            email: emailField.value,
            password: passwordField.value
        }, constraints)
        if (validation) {
            setEmailField({...emailField, message: validation.email?.[0]})
            setPasswordField({...passwordField, message: validation.password?.[0]})
            return false
        }
        return true
    }

    function validateSignUpForm(): boolean {
        const constraints = {
            firstName: firstNameField.constraint,
            lastName: lastNameField.constraint,
            phoneNumber: phoneNumberField.constraint,
            email: emailField.constraint,
            password: passwordField.constraint,
        }
        const validation = validate.validate({
            firstName: firstNameField.value,
            lastName: lastNameField.value,
            phoneNumber: phoneNumberField.value,
            email: emailField.value,
            password: passwordField.value
        }, constraints)
        if (validation) {
            setFirstNameField({...firstNameField, message: validation.firstName?.[0]})
            setLastNameField({...lastNameField, message: validation.lastName?.[0]})
            setPhoneNumberField({...phoneNumberField, message: validation.phoneNumber?.[0]})
            setEmailField({...emailField, message: validation.email?.[0]})
            setPasswordField({...passwordField, message: validation.password?.[0]})
            return false
        }
        return true
    }

    function inputField(
        field: Field,
        modes: Mode[],
        onInput: (event: ChangeEvent<HTMLInputElement>) => void,
        onKeyUp: (event: KeyboardEvent<HTMLInputElement>) => void,
        readOnly: boolean = false): ReactElement {
        return (
            <div key={`${field.id}Field`} className={`form-field col ${displayFor(...modes)}`}>
                <label htmlFor={`${field.id}Input`} className="form-label">{field.label}:</label>
                <input
                    id={`${field.id}Input`}
                    type={field.type}
                    className="form-control"
                    value={field.value}
                    onInput={onInput}
                    onKeyUp={onKeyUp}
                    readOnly={readOnly}/>
                <p className="text-danger">{field.message}</p>
            </div>
        )
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
            <form className="offcanvas-body bg-transparent overflow-hidden" noValidate={true}
                css={{
                    ".form-field": {
                        ".form-control": {
                            width: "100%",
                        }
                    },
                    ".text-danger": {
                        fontSize: "14px",
                        height: "1rem",
                    },
                }}>
                <h2 className="text-center">{getTitle()}</h2>
                <div className="mt-4 mb-2 row row-cols-1 align-content-start">{[
                    inputField(firstNameField, ["info", "signUp"], onFirstNameInput, onKeyUpSubmit, mode === "info"),
                    inputField(lastNameField, ["info", "signUp"], onLastNameInput, onKeyUpSubmit, mode === "info"),
                    inputField(phoneNumberField, ["info", "signUp"], onPhoneNumberInput, onKeyUpSubmit, mode === "info"),
                    inputField(emailField, ["info", "signIn", "signUp"], onEmailInput, onKeyUpSubmit, mode === "info"),
                    inputField(passwordField, ["signIn","signUp"], onPasswordInput, onKeyUpSubmit),
                ]}
                </div>
                <div className="my-3">
                    <button type="button"
                        className="btn btn-primary w-100"
                        onClick={onSubmitButtonClick}>{
                           mode === "info" ? "Sign Out" : (mode === "signIn" ? "Sign In" : "Sign Up")
                    }</button>
                </div>
                <div className={`my-4 ${mode === "signIn" ? "" : "d-none"}`}>
                    <span>Don't have an account?</span>
                    <button type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => { setMode("signUp"); clearFields() }}>Sign Up</button>
                </div>
            </form>
        </div>
    )
}

export default UserSignInView
