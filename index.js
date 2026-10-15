const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password: 'mayuri@123'
});

let q = 'INSERT INTO user (id, username, email, password) VALUES ?';
let users = [["123b", "mayurib", "mayuri@example.comb", "password123b"], ["123c", "mayuric", "mayuri@example.comc", "password123c"]];

try{
  connection.query(q, [users],(err, result) => {
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