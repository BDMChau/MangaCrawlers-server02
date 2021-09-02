const express = require('express');
const route = express.Router();

const botService = require("../service/bot.service");


route.get("/getmessage", botService.getMessage);


route.post("/postmessage", botService.postMessage);


route.post("/gethistorymessages",  botService.getHistoryMessage);




module.exports = route;