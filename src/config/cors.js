
// A root domain like "https://www.facebook.com/", remove the last "/" when add to allowDomainList
const allowDomainList = [
    "http://localhost:3000"
];

const corsOptions = {
    origin: "*" /*function (origin, callback) {
        if (allowDomainList.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }*/ ,
    methods: "GET, PUT, PATCH, POST, DELETE",
}

module.exports = corsOptions;