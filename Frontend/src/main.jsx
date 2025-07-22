<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
=======
import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
>>>>>>> 1f5815c16160a86ea1b0c5d9ee4009b83b4d963c

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
