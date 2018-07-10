var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
var inStock;
var quantity;
var item;


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
  console.log('---------------------------------------------');
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
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
    var data, output ;

    data = [
      ["Item ID", "Product name", "Department name", "Price", "In stock"]
    ];
        for (var i=0; i<res.length; i++){
          data.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
          output = table(data);
        }
        console.log(output);
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
          message: "How many items will you buy? : "
        }
  ])
    .then(function(answer) {
      connection.query("SELECT * FROM products", function(err, res) {
      inStock = parseInt(res[answer.id-1].stock_quantity);
      quantity = inStock - parseInt(answer.qty) ;
      item = parseInt(answer.id);

      if (quantity>0){
        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [quantity, item], function(err, res) {
          if (err) throw err;
          console.log("Thank you for tour purchase!");

            connection.query("SELECT * FROM products", function(err,res) {
              console.log('We hope you enjoy your brand new ' + res[answer.id-1].product_name + '! ');
              console.log('---------------------------------------------');
              console.log('Your total is: $' + (parseFloat(res[answer.id-1].price) )* parseFloat(item));

              console.log("We still have " + res[answer.id-1].stock_quantity + " in stock!");
              startApp();
            });
        });
      } else {
        console.log("Not enough items in stock");
        startApp();
      }
      });
    });
}

function exit(){
    console.log('Come back any time!');
    connection.end();
  }