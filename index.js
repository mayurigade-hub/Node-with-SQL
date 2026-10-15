const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password: 'mayuri@123'
});

let q = 'INSERT INTO user (id, username, email, password) VALUES ?';


let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

console.log(getRandomUser());

let data = [];

for (let i = 0; i <= 100; i++) {
  data.push(getRandomUser()); //get 100 users
} 

try{
  connection.query(q, [data],(err, result) => {
  console.log(result);
});
}catch(err){
  console.log(err);
}

connection.end(); 


