// Get our dependencies
const express = require('express');
const pug = require('pug');
const fs = require('fs');
const mc = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectID;

// The limit of questions we allow to be displayed
const limit = 25;

// Set our app and db variable
let app = express();
let db;

// Use our JSON parser
app.use(express.json());

// Set our static folders
app.use(express.static("public"));

// Set pug view director
app.set('views', './views')
app.set('view engine', 'pug');

// Database connection
mc.connect("mongodb://localhost:27017/", function(err, client)
{
	if(err) throw err;
	console.log("Connected to database.");

	//in here, you can select a database and start querying
  db = client.db('a4');
	db.createCollection("quizzes");
});

// === Route Handlers

// 404 Checking
app.get('/', function (req, res)
{
  console.log("404");
  res.status(404).send("404");
});

// Grab 25 questions based on query paramters
app.get('/questions', function (req, res)
{
  // Get our queries
  let cat  = req.query.category;
  let diff = req.query.difficulty;

  // Look for all entries if queries are null
  if (cat == null){ cat = {$ne:null}; }
  if (diff == null){ diff = {$ne:null}; }

  db.collection("questions").find({category:cat, difficulty:diff}).limit(limit).toArray(function(err, questions)
  {
    console.log(questions);

		// Format for JSON and HTML
    res.format({
  	  'text/html': () => { res.render('questions', { questions: questions }); },
  	  'application/json': () => { res.send(JSON.stringify(questions)); },
  	  'default': () => { res.status(406).send('Not Acceptable') }
  	});
  });
});

// Get a question based on ID
app.get('/questions/:qID', function (req, res)
{
	let qID = "";

	// Grab the question ID
	// We are also testing to make sure it is a proper objectID
	if(/[a-f0-9]{24}/.test(req.params.qID)) { qID = ObjectId(req.params.qID); }

	// Find the question using the ID
  db.collection("questions").findOne({ _id: qID }, (err, result) =>
  {
    console.log(result);

		// 404 if ID doesn't exist
		if (result == null) { res.status(404).send("404"); }
		else
		{
			// Format in JSON and HTML
	    res.format({
	  	  'text/html': () => { res.render('question', { question: result }); },
	  	  'application/json': () => { res.send(JSON.stringify(result)); },
	  	  'default': () => { res.status(406).send('Not Acceptable'); }
	  	});
		}
  });
});

// Just call the createQuiz HTML
app.get('/createquiz', function (req, res) { res.sendFile('public/createquiz.html', {root: __dirname }); });

// List all of the created quizzes based on queries
app.get('/quizzes', function (req, res)
{
	// Get our queries
	let name = req.query.name;
	let tag  = req.query.tag;

	// Look for all entries if queries are null
	// Else regex our name: case-insensitive, partial matching
	if (name == null){ name = {$ne:null}; }
	else { name = {$regex:new RegExp("^" + name.toLowerCase(), "i")}; }

	// Else regex our name: case-insensitive
	if (tag == null){ tag = {$ne:null}; }
	else { tag = {$regex:new RegExp("^" + tag.toLowerCase() + "$", "i")}; }

	db.collection("quizzes").find({creator:name,tags: tag}).toArray((err, quizzes) =>
  {
		console.log(quizzes);

		// We need to use the key quizzes and pass the array of quizzes
		let jObj = {quizzes: quizzes};

		// Format for JSOn and HTML
		res.format({
  	  'text/html': () => { res.render('quizzes', { quizzes: quizzes }); },
  	  'application/json': () => { res.send(JSON.stringify(jObj)); },
  	  'default': () => { res.status(406).send('Not Acceptable'); }
  	});
	});
});

// Get a quiz based on ID
app.get('/quizzes/:quizID', function (req, res)
{
	let qID = ""//ObjectId(req.params.quizID);

	// Grab the question ID
	// We are also testing to make sure it is a proper objectID
	if(/[a-f0-9]{24}/.test(req.params.quizID)) { qID = ObjectId(req.params.quizID); }

  db.collection("quizzes").findOne({ _id: qID }, (err, result) =>
  {
    console.log(result);

		// 404 if ID doesn't exist
		if (result == null) { res.status(404).send("404"); }
		else
		{
			// Format JSON and HTML
	    res.format({
	  	  'text/html': () => { res.render('quiz', { quiz: result }); },
	  	  'application/json': () => { res.send(JSON.stringify(result)); },
	  	  'default': () => { res.status(406).send('Not Acceptable'); }
	  	});
		}
  });
});

// Add a quiz to the database collection "quizzes"
app.post('/quizzes', function (req, res)
{
	// Get our quiz and set an ID
	jObj = req.body;
	jObj._id = ObjectId();

	let isValid = true;

	// Run a few validity checks
	if(jObj.creator.length > 0 && jObj.tags.length > 0 && jObj.questions.length > 0)
	{
		jObj.questions.forEach((q) =>
		{
			if(q.category.length 						== 0
				|| q.difficulty.length 				== 0
				|| q.question.length 					== 0
				|| q.correct_answer.length 		== 0
				|| q.incorrect_answers.length == 0) { isValid = false; }
		});
	}
	else { isValid = false; }

	// If everything seems to be in order, add the quizz to the database
	if(isValid)
	{
		// Insert into the database and redirect the user to the new quiz
		db.collection("quizzes").insertOne(jObj, (err, result) =>
		{
		  if(err) throw err;
			console.log(jObj._id);
			res.setHeader("Content-Type", "text/html")
			res.send('/quizzes/' + jObj._id);
		});
	}
});

// Route for getting difficulties and categories
app.get('/criteria', function (req, res)
{
	// Just use this to grab the criteria
	// TODO: Change this to use distinct functionality
	db.collection("questions").find({}).toArray(function(err, questions)
  {
		let diff   = [];
		let cat    = [];
		let resObj = {difficulties: [], categories: []};

		// Check difficulty and category for each question
		questions.forEach((q) =>
		{
			let newDiff = true;
			let newCat  = true;

			diff.forEach((d) => { if (d === q.difficulty) { newDiff = false; } });
			cat.forEach((c)  => { if (c === q.category)   { newCat  = false; } });

			// If the difficulty or category is unique, add it
			if (newDiff) { diff.push(q.difficulty); }
			if (newCat)  { cat.push(q.category); }
		});

		diff.sort();
		cat.sort();

		resObj.difficulties = diff;
		resObj.categories 	= cat;

		console.log(resObj);

		res.send(JSON.stringify(resObj));
  });
});

//Start server
app.listen(3000);
console.log("Server listening at http://localhost:3000");
