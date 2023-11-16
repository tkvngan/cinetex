import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import App from "./App";
import {AxiosUseCaseInteractorCollections} from "shared/dist/infrastructure/interactors";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";

const client = axios.create({
    baseURL: "/service",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 1000,
})
const interactors = AxiosUseCaseInteractorCollections(client)

ReactDOM.createRoot(document.getElementById('root') as HTMLLinkElement).render(
    <App interactors={interactors}/>
)

reportWebVitals();
