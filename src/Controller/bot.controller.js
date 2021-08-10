const express = require('express');
const route = express.Router();

const botService = require("../service/bot.service");


route.post("/getbotmessage", botService.getBotMessage);


route.post("/postmessage", botService.postMessage);

route.post("/addtoqueue", botService.addToQueue);

route.get("/gethistorymessages", botService.getHistoryMessages);




module.exports = route;