import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import App from "./App";
import {AxiosUseCaseInteractorCollections} from "cinetex-shared/dist/infrastructure/interactors";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/index.css";

const client = axios.create({
    baseURL: "/service",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 1000,
})

const interactors = AxiosUseCaseInteractorCollections(client)
const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(<App interactors={interactors}/>)

reportWebVitals();
