const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const bodyParser = require('body-parser');


app.set('port', (process.env.PORT || 1993));

app.use(express.static(path.join(__dirname, 'dist/')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(__dirname + "/dist/index.html");
});

app.post('/charts', (req, res) => {
	console.log("charts");
	console.log(req.body);
	res.send({
		msg: "successfully saved!"
	});
});


http.listen(app.get('port'), function () {
	console.log("Server in up on PORT : ", app.get("port"));
});
