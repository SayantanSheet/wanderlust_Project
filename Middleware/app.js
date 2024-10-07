const express = require('express');
const app = express();
const ExpressError = require('./ExpressError');

// app.use((req,res,next)=>{
//     console.log("hi, i am middleware");
//     next();
// });

// app.use((req,res,next)=>{
//     console.log("hi, i am 2nd middleware");
//     next();
// });

const checkToken=(req, res, next)=>{
    let{token}=req.query;
    if(token ==="giveaccess"){
        next();
    }
    throw new ExpressError(401,"Access denied");
};

app.get("/err",(req,res)=>{
    abc=abc;
});

app.get("/admin",(req,res)=>{
    throw new ExpressError(403,"Access is Forbidden");
});

app.get("/api",checkToken,(req,res)=>{
    res.send("Hello, I am API");
});
// app.use((req,res,next)=>{
//     console.log(req.method,req.hostname,req.path);
//     next();
// });
app.get('/', (req, res) => {
    res.send('Hi,i am root');
});

app.get("/random", (req, res) => {
    res.send("this is a random page");
});

app.use((err, req, res,next)=>{
    let{status=500,message="some error occured"}=err;
    res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log("Server started on port 8080");
});