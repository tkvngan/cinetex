/** @jsxImportSource @emotion/react */
import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import App from "./App";
import {AxiosUseCaseInvokerFactory} from "cinetex-shared/dist/infrastructure/interactors";
import {UseCaseCollection, UseCaseCollectionClient} from "cinetex-core/dist/application";
import {SecurityContext} from "./security/SecurityContext";
import {css} from "@emotion/react";
import {injectGlobal} from "@emotion/css";
import bg from './assets/svg/bg.svg'
import "bootstrap/dist/css/bootstrap.min.css"

const masterStyle = css`
    :root {
        --cinetex-primary-color: #5f0f4f;
        --cinetex-primary-light-color: #ED70EF;
        --cinetex-solid-light-color: white;
        --cinetex-solid-dark-color: black;
        --cinetex-font-size: 2rem;
        --cinetex-font-family: Raleway, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        --cinetex-font-weight: 500;
    }
    html {
        text-rendering: optimizeLegibility;
    }
    body {
        background-attachment: fixed;
        background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.217) 0%, var(--cinetex-solid-dark-color)), url(${bg});
        background-repeat: no-repeat;
        background-color: #e26fe4ba;
        background-size: 100% auto;
    }
`
injectGlobal(masterStyle)

const axiosInstance = axios.create({
    baseURL: "/service",
    headers: {
        "Content-Type": "application/json",
        "Accept": ["application/json", "text/plain", "*/*"],
    },
    timeout: 1000,
})

const invokerFactory = AxiosUseCaseInvokerFactory(axiosInstance)
const interactors: UseCaseCollection = new UseCaseCollectionClient(invokerFactory)
const security = new SecurityContext(interactors.SignIn, interactors.SignUp)

document.documentElement.setAttribute('data-bs-theme', 'dark')
const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
    <App interactors={interactors} security={security}/>
)

reportWebVitals();
