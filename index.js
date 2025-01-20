const express = require("express");
const app = express;
const port = 3000;

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

const pasienRouter = require("./routes/pasien");
app.use("/api/pasien", pasienRouter);

const terapisRouter = require("./routes/terapis");
app.use("/api/terapis", terapisRouter);

const jenisTrapiRouter = require("./routes/jenisTrapi");
app.use("/api/jenisTrapi", jenisTrapiRouter);

const sesiRouter = require("./routes/sesi");
app.use("/api/sesi", sesiRouter);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
