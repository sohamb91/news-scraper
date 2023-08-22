// list deps
const express = require("express");
const PORT = 5500;
const scraperRoutes = require("./routes/scraperRoutes.js");

const app = express();
app.listen(PORT, () => {
    console.log(`server listening at ${PORT}`);
})
// use app.use to compose routes and controlelrs
app.use(express.json())
app.use("/scraper", scraperRoutes);

