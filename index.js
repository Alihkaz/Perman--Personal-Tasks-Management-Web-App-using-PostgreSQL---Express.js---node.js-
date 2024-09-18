// 


import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;


// databse set up
const db = new pg.Client({
  user:process.env.PG_USER,
  host:process.env.PG_HOST,
  database:process.env.PG_DATABASE,
  password:process.env.PG_PASSWORD,
  port:process.env.PG_PORT,
});
db.connect();

// to get the certain day:

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const d = new Date();
let day = weekday[d.getDay()];




app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));







// the function that will read the databse and return the result as a form of data related to tasks 
async function checkTasks() {
  const result = await db.query("SELECT * FROM tasks_table ORDER BY id ASC"); 
  let items = [];
  result.rows.forEach((item) => {items.push(item);});
  console.log(items);
  return items;
  
};



// home page
app.get("/", async(req, res) => {

  const items=await checkTasks();
  res.render("index.ejs", {listTitle: day, listItems: items,});

});






// adding a new task 
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try{
  await db.query("INSERT INTO tasks_table (tasks) VALUES ($1)", [item] );
  res.redirect("/");

  } catch (err) {
    console.log(err);
  }
});







// editing an existing task
app.post("/edit", async (req, res) => {


    
  const itemId= req.body.updatedItemId; 
  const newTitle = req.body.updatedItemTitle;
  try{
  await db.query("UPDATE tasks_table SET tasks=($1) WHERE id=($2);",[newTitle,itemId]); 
  res.redirect("/");}

 catch (err) {
  console.log(err);
}


});









// deleting task 
app.post("/delete", async (req, res) => {

  const itemId= req.body.deleteItemId; 

  try{
  const result = await db.query("DELETE FROM tasks_table WHERE id=($1);",[itemId]); 
  res.redirect("/");}

  catch (err) {
  console.log(err);
   }

});




// listening on the local port 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
