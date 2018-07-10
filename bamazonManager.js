var mysql = require("mysql");
var inquirer = require("inquirer");
const {table} = require('table');
var clear = require('clear');


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
        message: "Please choose from the following options:",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ]
      })
      .then(function(answerMain) {
        switch (answerMain.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          lowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          newProduct();
          break;

        case "Exit":
          exit();
          break;

        default:
          break;
        }
      });
      console.log("\n------------------------------------------------------------\n");

    }



  function viewProducts(){
    clear();
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
    var data, output ;

    data = [
      ["Item ID", "Product name", "Department name", "Price", "In stock"]
    ]
        for (var i=0; i<res.length; i++){
          data.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
          output = table(data);
        }
        console.log(output);

    });
    console.log("\n------------------------------------------------------------\n\n"); 
    startApp();
  }

  function lowInventory(){
    clear();
    connection.query("SELECT * FROM products", function(err, res) {
      console.log(res.length);

      data = [
        ["Item ID", "Product name", "Department name", "Price", "In stock"]
      ];
      for (var i=0; i<res.length; i++){
        if(parseInt(res[i].stock_quantity) < 5){
          data.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
          output = table(data);
        }
      }
      console.log(output);

      });
      startApp();

}

function addInventory(){
  clear();
    console.log('You chose to Add inventory');
    inquirer
    .prompt([
        { name: "id",
          type: "input",
          message: "Please provide the Product ID: ",
        },
        { name: "qty",
          type: "input",
          message: "How many items will you add? : "
        }
  ])
    .then(function(answer) {
      clear();
      connection.query("SELECT * FROM products", function(err, res) {
      inStock = parseInt(res[answer.id-1].stock_quantity);
      quantity = inStock + parseInt(answer.qty) ;
      item = parseInt(answer.id);

        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [quantity, item], function(err, res) {
          if (err) throw err;
            connection.query("SELECT * FROM products", function(err,res) {
              console.log('---------------------------------------------');
              console.log("The new stock for the item selected is " + res[answer.id-1].stock_quantity);
            });
        });
        startApp();
      });
    });


}

function newProduct(){
  clear();
  console.log('You chose to Add a product');
  inquirer
  .prompt([
      { name: "name",
        type: "input",
        message: "Product name?: ",
      },
      { name: "dept",
        type: "input",
        message: "Department?: "
      },
      {
      name: "price",
      type: "input",
      message: "Price?: ",
    },
    { name: "qty",
      type: "input",
      message: "Quantity? : "
    }
])
  .then(function(answer) {
    var productName = answer.name;
    var productDept = answer.dept;
    var productPrice = parseFloat(answer.price);
    var productQty = parseInt(answer.qty);
    connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES (?,?,?,?)", [productName, productDept, productPrice, productQty], function(err, res) {
        if (err) throw err;
        console.log("item has been aded");
      });

  });

}

  function exit(){
    console.log('Good bye!');
    connection.end();
  }