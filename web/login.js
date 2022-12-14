
const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');






const connection = mysql.createPool({
	connectionLimit: 10,
	host: "mysqldb",
	user: "root",
	password: "123456",
	database: "nodelogin"
  });

const app = express();

app.use(helmet());
app.use(xssClean());
app.use(hpp());



app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './static/style.css')));
app.use(express.static(path.join(__dirname, '/register.html')));
app.use(express.static(path.join(__dirname, '/login.html')));

// http://localhost:3000/
app.get('/', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/register.html'));

});

// http://localhost:3000/register.html
app.get('/register', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/register.html'));
});

// http://localhost:3000/style.css
app.get('/style.css', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/static/style.css'));
});

// http://localhost:3000/login.html
app.get('/login', function(request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});



// http://localhost:3000/auth
app.post('/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	connection.query('USE nodelogin',function(err,result){
			
		if (err) throw err;
		console.log("Database selected");
	  });
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});






// http://localhost:3000/reg
app.post('/reg', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
    let email = request.body.email;
	// Ensure the input fields exists and are not empty
	if (username && password && email) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		
		
		connection.query('CREATE DATABASE IF NOT EXISTS `nodelogin` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;', function (err, result) {
			if (err) throw err;
			console.log("Database created");
		  });
        connection.query('USE nodelogin',function(err,result){
			
			if (err) throw err;
			console.log("Database selected");
		  });


		  var sql = 'CREATE TABLE IF NOT EXISTS `accounts` (`id` int(11) NOT NULL AUTO_INCREMENT,`username` varchar(50) NOT NULL,`password` varchar(255) NOT NULL,`email` varchar(100) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8';
         connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Table created");
         });





		connection.query(
            'INSERT INTO `accounts` (`username`, `password`, `email`) VALUES ( ?, ?,?)', [username, password,email], function(error, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			//if (results.length > 0) {
				// Authenticate the user
			//	request.session.loggedin = true;
			//	request.session.username = username;
				// Redirect to home page
			//	response.redirect('/home');
			//} 
			else {
				response.redirect('/login');
			}			
			response.end();
		});
	} else {
		response.send('Please try again');
		response.end();
	}
});








// http://localhost:3000/home
app.get('/home', function(request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000, function()  {



	connection.query('CREATE DATABASE IF NOT EXISTS `nodelogin`', function (err, result) {
		if (err){
			console.log("Creation failed");
			throw err;
		}
		console.log("Database created");
	  });
	connection.query('USE nodelogin',function(err,result){
		if (err){
			console.log("Selection failed");
			throw err;
		}
		console.log("Database selected");
	  });


	  var sql = 'CREATE TABLE IF NOT EXISTS `accounts` (`id` int(11) NOT NULL AUTO_INCREMENT,`username` varchar(50) NOT NULL,`password` varchar(255) NOT NULL,`email` varchar(100) NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8';
	 connection.query(sql, function (err, result) {
		if (err){
			console.log("Table creation failed");
			throw err;
		}
	  console.log("Table created");
	 });




	console.log("listining on port 3000")
	
}
);