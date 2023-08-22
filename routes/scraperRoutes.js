const express = require("express");
const router = express.Router();
const { getNewsItems } = require("../controllers/scraperController.js")

router.get("/", getNewsItems);


module.exports = router;