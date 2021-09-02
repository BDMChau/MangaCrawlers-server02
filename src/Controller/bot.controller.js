const express = require('express');
const route = express.Router();

const botService = require("../Service/bot.service");


route.post("/postmessage", botService.postMessage);

route.put("/addtoqueue", botService.addToQueue);

route.put("/modifyerrorvideo", botService.modifyInQueueWhenVideoError);

route.post("/getqueue", botService.getQueue);

route.delete("/removequeue", botService.removeQueue);

route.post("/gethistorymessages", botService.getHistoryMessages);


module.exports = route;