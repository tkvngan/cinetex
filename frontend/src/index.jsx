import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css'
import './index.css';
import reportWebVitals from './reportWebVitals';
import Axios from 'axios';
import { AxiosClientUseCaseInteractors } from 'shared/dist/infrastructure/interactors'
import {MovieListView} from "./views/MovieListView";
import App from "./App";


const client = Axios.create({
    baseURL: 'http://localhost:3001/service',
    headers: {
        'Content-Type': 'application/json',
    },
});

const interactors = new AxiosClientUseCaseInteractors(client);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App interactors={interactors}/>
        {/*<div className="container">*/}
        {/*    <MovieListView interactors={interactors} />*/}
        {/*</div>*/}
    </React.StrictMode>
);

reportWebVitals();
