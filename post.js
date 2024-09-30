const mongoose = require("mongoose");
const { Schema } = mongoose;

main()
   .then(()=>{
    console.log("Connection Sucessful");
   }).catch((err) => { console.log(err)});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

const userSchema = new Schema ({
   username : String,
   email : String,
});

const postSchema = new Schema ({
    content : String,
    likes : Number,
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
});

const User = mongoose.model("User" , userSchema);
const Post = mongoose.model("Post" , postSchema);

const addData = async()=>{
    let user = await User.findOne({username : "sumitKumar"});

    let post2 = new Post ({
        content : "Bye Bye ",
        likes : 27,
    });

    post2.user = user;

    await post2.save();
};
addData();

// const del = async() =>{
//     await Post.findByIdAndDelete("66e31ad6dd9e9c4603eebae3");
// };
// del();

const getData = async()=>{
    let result = await Post.findOne({}).populate("user");
    console.log(result);
};
getData();