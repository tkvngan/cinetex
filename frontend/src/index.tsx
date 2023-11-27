import React from "react";
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import App from "./App";
import {AxiosUseCaseInteractorCollections} from "cinetex-shared/dist/infrastructure/interactors";
require("bootstrap/dist/css/bootstrap.min.css");
require("bootstrap/dist/js/bootstrap.bundle.min.js");
require("./css/index.css");

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
