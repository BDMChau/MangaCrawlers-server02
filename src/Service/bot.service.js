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
               messages: message,
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
         console.error("post message err: ", err);
      }

   },


   addToQueue: async (req, res) => {
      const videoId = req.body.youtube_video_id; // object
      const videoTitle = req.body.youtube_video_title; // object
      let userId = req.body.user_id;


      try {
         const isUserExisted = await firebaseDB.isExisted(`users`, "userId", userId ? userId : "");
         if (!isUserExisted) {
            res.status(400).json(jsonResFormat(400, "BAD_REQUEST", {
               err: "Cannot add to queue, user does not exist!",
               user_id: ""
            }))
            return;
         }

         const obj = Object.values(isUserExisted);

         let queueArr = [];
         obj.forEach(val => {
            if (!val.queue) {
               val.queue = [];
            }

            queueArr = val.queue;
         });

         const newItem = {
            queue_id: uuidv4(),
            video_id: videoId,
            video_title: videoTitle,
            is_error: false
         };

         queueArr.push(newItem);


         firebaseDB.toSet(`users/${userId}/queue`, queueArr);

         res.status(201).json(jsonResFormat(201, "OK", {
            msg: "Add to queue OK!",
            new_item: newItem,
            user_id: userId
         }))

      } catch (err) {
         console.error("add queue err: ", err);
      }

   },


   modifyInQueueWhenVideoError: async (req, res) => {
      const queueId = req.body.queue_id; // object
      let userId = req.body.user_id;


      try {
         const isUserExisted = await firebaseDB.isExisted(`users`, "userId", userId ? userId : "");
         if (!isUserExisted) {
            res.status(400).json(jsonResFormat(400, "BAD_REQUEST", {
               err: "User does not exist!",
               queue_id: queueId ? queueId : ""
            }))
            return;
         }
         const obj = Object.values(isUserExisted);

         let queueArr = [];
         obj.forEach(val => {
            queueArr = val.queue;
         });

         let modifiedItem;
         for (let i = 0; i < queueArr.length; i++) {
            if (queueArr[i].queue_id === queueId) {
               queueArr[i].is_error = true;
               modifiedItem = queueArr[i];
               break;
            }
         }


         firebaseDB.toSet(`users/${userId}/queue/`, queueArr);

         res.status(200).json(jsonResFormat(200, "OK", {
            msg: "modify error video OK!",
            modified_item: modifiedItem,
         }))

      } catch (err) {
         console.error("add queue err: ", err);
      }

   },


   getQueue: async (req, res) => {
      const userId = req.body.user_id;

      try {
         const isUserExisted = await firebaseDB.isExisted(`users`, "userId", userId ? userId : "");
         if (!isUserExisted) {
            res.status(400).json(jsonResFormat(400, "BAD_REQUEST", {
               err: "Cannot get queue, user does not exist!",
               user_id: ""
            }))
         }

         const queue = await firebaseDB.toReadByAKey(`users/${userId}`, "queue");

         res.status(200).json(jsonResFormat(200, "OK", {
            msg: "Get list items in queue OK",
            videos_id_queue: queue
         }))

      } catch (err) {
         console.error("add queue err: ", err);
      }
   },


   removeQueue: async (req, res) => {
      const userId = req.body.user_id;

      try {
         const isUserExisted = await firebaseDB.isExisted(`users`, "userId", userId ? userId : "");
         if (!isUserExisted) {
            res.status(400).json(jsonResFormat(400, "BAD_REQUEST", {
               err: "Cannot remove queue, user does not exist!",
               user_id: ""
            }))
         }

         firebaseDB.toSet(`users/${userId}/queue`, []);

         res.status(200).json(jsonResFormat(200, "OK", {
            msg: "Remove all items in queue OK",
            queue: []
         }))

      } catch (err) {
         console.error("add queue err: ", err);
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
         console.error("get history messages err: ", err);
      }
   },
}



module.exports = botService;