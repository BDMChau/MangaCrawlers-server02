const express = require('express');
const route = express.Router();

const botService = require("../Service/bot.service");


route.get("/getmessage", botService.getMessage);




module.exports = route;