const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

dotenv.config();

// connect to css
app.use("/static", express.static("public"))

//return information from json
app.use(express.urlencoded({ extended: true }));

//connection to db
mongoose.set("useFindAndModify", false)

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to db!");
})

app.listen(3000, () => console.log("Server Up and running"));

//view engine configuration
app.set("view engine", "ejs");

//GET method 
app.get('/',(req, res) => {
    TodoTask.find({}, (err, tasks) =>{
    res.render('todo.ejs', { todoTasks: tasks});

    })
    ;});

//POST method 
app.post('/', async(req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });   
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

// //test: this will print the data input through form (Request Body is the part of the HTTP Request where additional content can be sent to the server
// app.post('/',(req, res) => {
//     console.log(req.body);
// })

// // UPDATE
app
.route("/edit/:id")
.get((req, res) =>{
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id})
    })
})
.post((req, res)=>{
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if(err) return res.send(500, err);
        res.redirect("/");
    })
})

// // DELETE

app.route('/remove/:id').get((req,res)=>{
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id,err => {
        if(err) return res.send(500,err);
        res.redirect("/")
    })
})