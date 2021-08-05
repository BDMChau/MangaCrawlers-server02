const firebaseDB = require("../firebase/firebaseDB")

const botService = {
   getMessage: async (req, res) => {
      console.log("ok bot sertvice")

  

      const message = await firebaseDB.toReadByAKey("bot_messages", "hello");

      const newArr = message;

      console.log(newArr)

      res.status(200).json(jsonResFormat(200, "OK", {a:"ok"}))
   }
}



const jsonResFormat = (httpCode, statusCode, bodyData) => {
   return {
      http_code: httpCode,
      http_status: statusCode,
      content: bodyData
   }
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