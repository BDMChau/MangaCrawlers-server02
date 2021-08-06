const firebaseDB = require("../firebase/firebaseDB")
const jsonResFormat = require("../utils/jsonResFormat")

const botService = {
   getBotMessage: async (req, res) => {
      console.log("ok bot sertvice")


      const data = [
         "hello 01",
         "hello 02"
      ]

      firebaseDB.toSet(`bot_messages/hello`, data)
  

      const message = await firebaseDB.toReadByAKey("users", 123);


    

      const newArr = message;

      console.log(newArr)

      res.status(200).json(jsonResFormat(200, "OK", {a:"ok"}))
   },

   postMessage: async (req, res) => {
      const data ={
         uid: 123,
         message:"acacasc"
      }
      firebaseDB.toSet(`users/${data.uid}`, data)

      res.status(200).json(jsonResFormat(200, "OK", {a:"ok"}))
   },

   getHistoryMessage: async (req, res) => {
    
      res.status(200).json(jsonResFormat(200, "OK", {a:"ok"}))
   },
}





const findMessage = async (res, key, value) => {
   const user =  await firebaseDB.isExist("bot_messages", key, value);
   if (!user.exists()) {
       jsonResponse(res, 202, "userExisted_fail", false, {});  
       return;
   }

   return user.val();
}

module.exports = botService;