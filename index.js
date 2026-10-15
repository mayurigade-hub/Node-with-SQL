const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');

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

app.listen(8080, () => {
  console.log('Server is running on port 8080');  
})

