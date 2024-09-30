if(process.env.NODE_ENV != "production"){    //env = enviroment
    require('dotenv').config();
}


const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./MODELS/user.js");


const listingsRouter = require("./Routes/listing.js");
const reviewsRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");

//const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbURL = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connect to DB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dbURL);
};

const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
     secret : process.env.SECRET
    },
    touchAfter : 24 * 3600 ,//for lazy updates
});

store.on( "error" , () =>{
    console.log("Error in Mongo Session store" , err);
})

const sessionOptions = {
    store,
    secret :process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 *24 * 60 * 60 * 1000,
        maxAge : 7 *24 * 60 * 60 * 1000,
        httpOnly : true,
    } 
};
// app.get("/", (req , res)=> {
//     console.log("HI , i am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));   //  authenticate() : Generates a function that is used in Passport's LocalStrategy

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//serializeUser() : Generates a function that is used by Passport to serialize users into the session
//deserializeUser() : Generates a function that is used by Passport to deserialize users into the session

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser" ,async(req, res) =>{
//     let fakeuser = new User({
//         email : "sumit@gamil.com",
//         username : "sigma-batch",
//     });

//     let registerUser = await User.register(fakeuser , "helloworld");
//     res.send(registerUser);
// })

//--------------------------------MOST IMPORTANT --------------------------------//
app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewsRouter);
app.use("/" , userRouter);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



app.all("*" , (req , res , next)=>{
    next( new ExpressError(404 , "Page not Found"));
});

app.use((err , res ,req , next)=>{
    let {statusCode=500, message = "Something went wrong !"} = err;
    res.status(statusCode).render("error.ejs" , {message }) ;
   // res.status(statusCode).send(message);
})
 app.use((err , req , res , next) =>{
    console.log("Error went Wrong !");
 })
app.listen(8080 , ()=>{
    console.log("server is listening to port 8080");
})