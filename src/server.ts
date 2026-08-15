//import http from "node:http";
import app from "./app.js";

const port = 3000;

app.listen(port, () => {
    console.log(`Servidor executanto em http://localhost:${port}`);
})