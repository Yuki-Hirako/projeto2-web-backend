const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello world22");
});

app.listen(port, () => {
    console.log(`sever is running in port: ${port}`);
});