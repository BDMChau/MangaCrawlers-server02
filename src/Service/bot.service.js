const e = require('cors');
const { v4: uuidv4 } = require('uuid');

const firebaseDB = require("../firebase/firebaseDB")
const jsonResFormat = require("../utils/jsonResFormat")


const botService = {
   postMessage: async (req, res) => {
      const message = req.body.message; // object
      let userId = req.body.userId;

      if (!userId) {
         userId = uuidv4();
      }


      try {
         const isUserExisted = await firebaseDB.isExisted(`users`, "userId", userId);
         if (!isUserExisted) {
            const data = {
               userId: userId,
               messages: [message]
            };

            firebaseDB.toSet(`users/${userId}`, data);

            res.status(200).json(jsonResFormat(200, "OK", {
               msg: "Add message OK!",
               user_id: userId
            }))

         } else {
            const obj = Object.values(isUserExisted);

            const data = {
               userId: userId,
               messages: message
            };

            let messagesArr = [];
            obj.forEach(val => {
               messagesArr = val.messages
            });
            messagesArr.push(data.messages)

            firebaseDB.toSet(`users/${userId}/messages`, messagesArr);

            res.status(200).json(jsonResFormat(200, "OK", {
               msg: "Add message OK!",
               user_id: userId
            }))
         }

      } catch (err) {
         console.log("post message err: ", err);
      }

   },

   addToQueue: async (req, res) => {
      const videoId = req.body.youtube_video_id; // object
      let userId = req.body.userId;


      try {
         const isUserExisted = await firebaseDB.isExisted(`users`, "userId", userId ? userId : "");
         if (!isUserExisted) {
            res.status(400).json(jsonResFormat(400, "BAD_REQUEST", {
               err: "Cannot add to queue, user does not exist!",
               user_id: ""
            }))
         }

         const obj = Object.values(isUserExisted);

         let queueArr = [];
         obj.forEach(val => {
            if (!val.queue) {
               val.queue = [];
            }

            queueArr = val.queue;
         });
         queueArr.push(videoId)


         firebaseDB.toSet(`users/${userId}/queue`, queueArr);

         res.status(200).json(jsonResFormat(200, "OK", {
            msg: "Add to queue OK!",
            user_id: userId
         }))

      } catch (err) {
         console.log("post message err: ", err);
      }

   },

   getHistoryMessages: async (req, res) => {
      const { offset, limit, userId } = req.body;

      try {
         const isUserExisted = await firebaseDB.isExisted(`users`, "userId", userId);
         if (!isUserExisted) {
            res.status(400).json(jsonResFormat(400, "BAD_REQUEST", {
               err: "No history messages, user does not exist!",
               user_id: userId
            }))

         } else {
            let resFromDatabase;
            let messagesToResponse = [];
            let countinueAt;


            if (offset === 0) {
               resFromDatabase = await firebaseDB.paginateFromEndInFirstTime(`users/${userId}`, "messages", limit);
               messagesToResponse = Object.values(resFromDatabase.val());
            } else {
               resFromDatabase = await firebaseDB.paginateFromEnd(`users/${userId}`, "messages", offset, limit);
               if (resFromDatabase) messagesToResponse = Object.values(resFromDatabase.val())
            }


            if (messagesToResponse.length === 0) {
               res.status(204).json(jsonResFormat(204, "OK", { msg: "no messages found", }))
               return;
            }

            const objKeys = Object.keys(resFromDatabase.val())
            countinueAt = parseInt(objKeys[objKeys.length - 1]) - limit;
            
            // end, no more messages
            if (countinueAt <= 0) {
               res.status(200).json(jsonResFormat(200, "OK", {
                  msg: "end of conversation",
                  messages: messagesToResponse
               }))
               return;
            }


            res.status(200).json(jsonResFormat(200, "OK", {
               msg: "Get history messages OK",
               countinue_at: countinueAt, // offset for the next query
               messages: messagesToResponse
            }))
            return;
         }
      } catch (err) {
         console.log("post message err: ", err);
      }
   },
}



module.exports = botService;