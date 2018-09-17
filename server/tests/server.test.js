const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');


const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: 'First test todo'
}, {
	_id: new ObjectID(),
	text: 'Second test todo'
}];

beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it ('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it ('should not create Todo with invalid body data', (done) => {

		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((e) => done(e));
				
			});
	});
});

describe('GET /todos', () => {

	it('should get all todos', (done) => {

		request(app)
			.get('/todos')
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {

	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	})

	it('should return 404 if todo not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done)
	});

	it('should return 404 if invalid ObjectID', (done) => {
		request(app)
			.get('/todos/123')
			.expect(404)
			.end(done)
	})
});

describe('PATCH /todos/:id', () => {


	it('should modify a valid todo', (done) => {

		request(app)
			.patch(`/todos/${todos[0]._id.toHexString()}`)
			.send({completed: true})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completed).toBe(true);
			})
			.end(done);
	})

	it('should return with status 404 with invalid id', (done) => {

		request(app)
			.patch(`/todos/${new ObjectID().toHexString()};`)
			.send({completed: true})
			.expect(404)
			.end(done)
	})
})

describe('DELETE /todos/:id', () => {

	it('should delete a todo', (done) => {

		request(app)
			.delete(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end((err, res) => {
				if (err) return done(err);
				Todo.findById(`${todos[0]._id.toHexString()}`).then((todo) => {
					expect(todo).toBeFalsy();
					done();
				}).catch((e) => done(e));
			})
	})

	it('should return 404 if todo not found', (done) => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.end(done)
	});

	it('should return 404 if invalid ObjectID', (done) => {
		request(app)
			.delete('/todos/123')
			.expect(404)
			.end(done)
	})
})