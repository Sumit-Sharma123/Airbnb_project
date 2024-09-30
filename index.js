const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../MODELS/Listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("Connect to DB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongo_URL);
}
const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj,
        owner : "sumit",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();