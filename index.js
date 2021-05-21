if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express=require('express');
const app=express();
const mongoose =require('mongoose');
const bankSchema =require('./model/bankModel');
const path = require('path');

//import body parser
let bodyParser = require('body-parser');
const { env } = require('process');

//configure bodyparser to hande the post requests
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

//EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static("public"));


mongoose.connect(process.env.DB_Url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
        useCreateIndex:true
    })
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.log("OH NO ERROR!!!");
        console.log(err);
    });


app.route("/")
.get(async(req, res)=> {
    res.render("home");

    try{
        const bank = await bankSchema.findOne();
        res.render('home', {bank});
    }
    catch (e) 
    {
        console.log("Something Went Wrong");
        res.send('error');

})
.post((req, res)=> {
    //Declare variables
    let hint = "";
    let response = "";
    let searchQ = req.body.search.toLowerCase(); 
    let filterNum = 1;

    if(searchQ.length > 0){
    bankSchema.find(function(err, results){
        if(err){
            console.log(err);
        }else{
            results.forEach(function(sResult){

                if(sResult.branch.indexOf(searchQ) !== -1){
                    if(hint === ""){
                        hint="<a href='" + sResult.city + "' target='_blank'>" + sResult.branch + "</a>";
                    }else if(filterNum < 6){
                        hint = hint + "<br /><a href='" + sResult.city + "' target='_blank'>" + sResult.branch + "</a>";
                        filterNum++;
                    }
                }
            })
        }
        if(hint === ""){
            response = "no suggestion"
        }else{
            response = hint;
        }
    
        res.send({response: response});
    });

    }
});




//Start Server
app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log("Server running at port 3000");
})
