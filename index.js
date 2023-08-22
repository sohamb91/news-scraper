// list deps
const express = require("express");
const PORT = 5500;
const scraperRoutes = require("./routes/scraperRoutes.js");
const { getNewsItems } = require("./controllers/scraperController.js");
const cron = require('node-cron');


const app = express();
app.listen(PORT, () => {
    console.log(`server listening at ${PORT}`);
})
// use app.use to compose routes and controlelrs
app.use(express.json())
app.use("/scraper", scraperRoutes);

getNewsItems();
cron.schedule('*/30 * * * * *', getNewsItems);