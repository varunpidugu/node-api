var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {

	Todo.find().then((todos) => {
		res.send({todos});
	}, (e) => {
		res.status(400).send(e);
	});

});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		res.status(404).send("Invalid ID!");
	}

	Todo.findById(id).then((todo) => {
		if (!todo) return res.status(404).send();

		res.send({todo});

	}).catch((e) => {
		res.status(400).send();
	})
	//validate ID
});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)) {
		return res.status(404).send("Invalid ID!");
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) return res.status(404).send();

		console.log(todo);
		res.send({todo});

	}).catch((e) => {
		res.status(400).send();
	})
})

app.get('/users/:id', (req, res) => {
	var id = req.params.id;

	if (!ObjectID.isValid(id)){
	 return res.status(404).send('Invalid ID!');
	}

	User.findById(id).then((user) => {
		if (!user) return res.status(404).send();

		res.send({user});

	}).catch((e) => {
		res.status(400).send();
	})
})

app.post('/users', (req, res) => {
	var user = new User({
		email: req.body.email
	});

	user.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	})
})

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
