var mySql = require('mysql');
var displayProducts;

var inquirer = require('inquirer');

var connection = mySql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Jt1234",
	database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    showProducts();
})

var showProducts = function() {
	connection.query('SELECT * FROM Products', function(err, data) {
		displayProducts = data.length;
		for (var i = 0; i < displayProducts; i++) {
			console.log("Item Id: " +data[i].ItemID);
			console.log("Product: " +data[i].ProductName);
			console.log("Price: " +data[i].Price);
		}
		console.log(" ");
		askUser();
	});
}

var askUser = function(){
	inquirer.prompt([

	{
		type: "checkbox",
		message: "What is the Item ID of the Product you wish to purchase?",
		choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
		name: "ItemNum"
	},

	{
		type: "input",
		message: "How many would you like to buy?",
		name: "numProducts"
	},

]).then(function (answer) {
	connection.query("SELECT * FROM Products WHERE ItemID = " + answer.productID, function(err, data) {
            if(data[0].StockQuantity < answer.numProducts)
            	console.log("Insufficient quantity!");
            else{
            	connection.query("UPDATE Products SET ? WHERE ?", 
            		[{StockQuantity: data[0].StockQuantity - answer.numProducts
		        },
		        {
		        	ItemID: answer.productID
		        }], function(err, resp) {
		            console.log("Thank you for purchasing from Bamazon! You have spent $" + data[0].Price*answer.numProducts+ ". Please come again!");
		        });
            }
        });
	});
}