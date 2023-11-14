import React from "react";
import ReactDOM, {Root} from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";
import App from "./App";


ReactDOM.createRoot(document.getElementById('root') as HTMLLinkElement).render(
    <App/>
)

reportWebVitals();
