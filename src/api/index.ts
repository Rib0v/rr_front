import axios from "axios";
const apiPort = "8000";

export const api = axios.create({
    baseURL: `http://localhost:${apiPort}/api`,

    headers: {
        Accept: "application/json",
    },
});
