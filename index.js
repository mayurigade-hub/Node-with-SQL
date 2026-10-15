const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password: 'mayuri@123'
});

let q = 'INSERT INTO user (id, username, email, password) VALUES(?,?,?,?)';
let user = ["123", "mayuri", "mayuri@example.com", "password123"];

try{
  connection.query(q, user,(err, result) => {
  console.log(result);
});
}catch(err){
  console.log(err);
}

connection.end(); 

let getRandomUser = () => {
  return {
    id: faker.string.uuid(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}

console.log(getRandomUser());