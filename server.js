const httpError = require('http-errors');
const express = require('express');
const port = process.env.PORT || 5000;

const app = express();
const server = require('http').createServer(app);

const axios = require("axios")


///// bodyParser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

///// cors
const cors = require('cors');
const corsOptions = require('./src/config/cors');
app.use(cors(corsOptions));


///// firebase
require("./src/firebase/firebaseConfig");


///// controllers
app.use('/api/bot', require('./src/controller/bot.controller'));

app.get('/', (req, res) => {
    res.status(200).send("MyUploader server api")
});

app.get('/herokuwakeup', (req, res) => {
    res.status(200).json("Wake up app on heroku every 25 minutes")
});

app.use((req, res, next) => {
    next(httpError(404, "Page Not Found!"));
});




///// auto call request to wake up app on heroku every 25 minutes
// const autoCallRequest = () => {
//     setInterval(() => {
//         axios.get('https://myuploader-api.herokuapp.com/herokuwakeup')
//             .then(res => console.log(res.data))
//             .catch(err => console.log(err))
//     }, 1500000)
// }
// autoCallRequest();

////////////
server.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
})
