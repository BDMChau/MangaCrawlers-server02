const firebaseDB = require("../firebase/firebaseDB");
const jsonResponse = require("../utils/jsonResponse");

const isUserExist = async (res, key, value) => {
    const user =  await firebaseDB.isExist("users", key, value);
    if (!user.exists()) {
        jsonResponse(res, 202, "userExisted_fail", false, {});  
        return;
    }

    return user.val();
}

module.exports = isUserExist;