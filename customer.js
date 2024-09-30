const mongoose = require("mongoose");
const { Schema } = mongoose;

main()
   .then(()=>{
    console.log("Connection Sucessful");
   }).catch((err) => { console.log(err)});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

const orderSchema = new Schema ({
    items :String,
    price : Number,
});

const customerSchema = new Schema({
    name : String,
    orders : [
        {
            type : Schema.Types.ObjectId,
            ref : "Order"
        },
    ],
});

//handling Deletion

// customerSchema.pre("findOneAndDelete" ,async()=>{
//     console.log("PRE Middleware");
// });

customerSchema.post("findOneAndDelete" ,async(Customer)=>{
     if(Customer.orders.length){
        let res = await Order.deleteMany({_id :{ $in : Customer.orders }});
        console.log(res);
     }
});



const Order = mongoose.model("Order" , orderSchema);
const Customer = mongoose.model("Customer" , customerSchema);

// const addCustomers = async() =>{
//     // let cust1 = new Customer({
//     //     name : "Rahul Kumar",
//     // });

//     // let order1 = await Order.findOne({item : "chips"});
//     // let order2 = await Order.findOne({item : "pepsi"});

//     // cust1.orders.push(order1);
//     // cust1.orders.push(order2);

//     // let result = await cust1.save();
//     // console.log(result);

//     let result = await Customer.find({}).populate("orders");
//     console.log(result[0]);
// };
// addCustomers();

// const addOrders = async()=>{
//     let res = await Order.insertMany(
//         [
//             {items : "samosha" , price : 15},
//             {items : "chips" , price : 25},
//             {items : "pepsi" , price : 90},
//         ]);
//         console.log(res);
// };
// addOrders();

const addCust = async()=>{
    let newCust = new Customer({
        name : "karan Arjun",
    });

    let newOrder = new Order({
        items : "pizza",
        price : 250,
    });
    newCust.orders.push(newOrder);

    await newCust.save();
    await newOrder.save();

    console.log("added new Customer");
};
//addCust();

const delcust = async()=>{
    let data = await Customer.findById('66e31b49f1ad4e9a94fc0ed4');
    console.log(data);
};

delcust();

