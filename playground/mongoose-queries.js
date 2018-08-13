const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5b71386806682630a67cf574';

if (!ObjectID.isValid(id)){
	console.log('ID not valid'); 
}

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log('Todos', todos);
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 	console.log('Todo', todo);
// });

User.findById(id).then((user) => {

	if (!user) {
		return console.log('ID not found!');
	}
	console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log(e));