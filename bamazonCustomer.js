var mysql = require("mysql");
var Table = require("easy-table");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
 startApp();
});

function startApp(){

    inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "List items",
        "Buy item",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
      case "List items":
        list();
        break;

      case "Buy item":
        buy();
        break;

      case "Exit":
        exit();
        break;

      default:
        break;
      }
    });


}


function list(){
    console.log('You chose to list all items');
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {

        for (var i=0; i<res.length; i++){
            console.log(res[i].product_name);
        }
        startApp();
        }

    )


}

function buy(){
    console.log('You chose to buy items');
    inquirer
    .prompt([
        { name: "id",
          type: "input",
          message: "Please provide the Product ID: ",
        },
        { name: "qty",
          type: "input",
          message: "How many products will you buy? : "
        }
  ])
    .then(function(answer) {
      console.log(answer.id);
      console.log(answer.qty);
      var query = "SELECT * FROM products";
      connection.query(query, function(err, res) {
      console.log(res[answer.id-1].product_name);
      startApp();
      });
    });


}

function exit(){

    console.log('Come back any time!');
    connection.end();

}