const express = require('express');
const route = express.Router();

const botService = require("../service/bot.service");


route.post("/postmessage", botService.postMessage);

route.post("/addtoqueue", botService.addToQueue);

route.post("/modifyerrorvideo", botService.modifyInQueueWhenVideoError);

route.post("/getqueue", botService.getQueue);

route.post("/gethistorymessages", botService.getHistoryMessages);


module.exports = route;