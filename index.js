const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password: 'mayuri@123'
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

console.log(getRandomUser());

//fetch and show total number of users on our app
app.get('/', (req, res) => {
  let q = 'SELECT COUNT(*) FROM user';
  try{
  connection.query(q, (err, result) => { 
  let count = result[0]['COUNT(*)'];
  res.render("home.ejs", {count});
  });
  }
  catch(err){
  console.log(err);
  res.send('Error occurred while fetching data');
}
});

//show route - show the id, username, email if all users 
app.get('/users', (req, res) => {
  let q = 'SELECT * FROM user';
  try{
  connection.query(q, (err, users) => { 
  res.render("showusers.ejs", {users});
  });
  }
  catch(err){
  console.log(err);
  res.send('Error occurred while fetching data');
  }
});

//Edit route
app.get('/user/:id/edit', (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try{
  connection.query(q, (err, result) => { 
  let user = result[0];
  res.render("edit.ejs", {user});
  });
  }
  catch(err){
  console.log(err);
  res.send('Error occurred while fetching data');
  }
});

//Update username
app.patch('/user/:id/edit', (req, res) => {
  let { id } = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try{
  connection.query(q, (err, result) => { 
  let user = result[0];
  if(user.password != formPass){
    res.send('Password is incorrect');
  }
  else{
    let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
    connection.query(q2, (err, result) => { 
      res.redirect('/users');
    });
  }
  });
  }
  catch(err){
  console.log(err);
  res.send('Error occurred while fetching data');
  }
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');  
})

