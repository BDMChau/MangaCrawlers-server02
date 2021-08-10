const e = require('cors');
const { v4: uuidv4 } = require('uuid');

const firebaseDB = require("../firebase/firebaseDB")
const jsonResFormat = require("../utils/jsonResFormat")


const botService = {
   getBotMessage: async (req, res) => {
      const data = {
         userId: "",
         message: {}
      }
   },

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
      const arr = [
         {
            role: "user",
            cmd: "play",
            content: "bla bla"
         },
         {
            role: "user",
            cmd: "play",
            content: "bla bla"
         },

      ]

      const data = {
         userId: uuidv4(),
         arr: arr
      }

      // const aaa = await firebaseDB.toSet(`users/1/arr`, arr)
      const aaa = await firebaseDB.isExisted(`users`, "userId", "")
      console.log(aaa)
      //   const obj = Object.values(aaa);

      //   obj.forEach(e => {
      //      console.log(e.arr)
      //   });

      console.log()



      res.status(200).json(jsonResFormat(200, "OK", { a: "ok" }))
   },
}



module.exports = botService;