


var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')
  , fs = require('fs');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var models_path = __dirname + '/../app/models'
fs.readdirSync(models_path).forEach(function (file) {
  require(models_path+'/'+file);
});

var Async = require('async')
  , User = mongoose.model('User')
  , MetaQuestion = mongoose.model('MetaQuestion')
  , Question = mongoose.model('Question')
  , Comment = mongoose.model('Comment')
  , Company = mongoose.model('Company')
  , Survey = mongoose.model('Survey')
  , Answer = mongoose.model('Answer');

mongoose.connection.once('open', function(){




var save = function(v, cb){
	v.save(function(err, obj){
		if(err){
			console.log(err);
			cb();
		} else {
			console.log(obj);
			cb();
		}
	});
}


var company = new Company({
	name: 'Vibe',
	domain: 'vibeapp.org',
	size: 5
});

company.save();

var users = [
	new User({
		name: "Matt Green",
		email: 'mgreen9@gmail.com',
		password: 'testtest',
		isAdmin: true,
		provider: 'local',
		company: company._id
	}),
	new User({
		name: "Jake Hsu",
		email: 'jakehsu@vibeapp.org',
		password: 'testtest',
		isAdmin: false,
		provider: 'local',
		company: company._id
	}),
	new User({
		name: "Eric Hsu",
		email: 'erichsu@vibeapp.org',
		password: 'testtest',
		isAdmin: false,
		provider: 'local',
		company: company._id
	})
]
Async.each(users, save, function(err){});


// begin meta questions
var metaQuestion1 = new MetaQuestion({
	title: "Process",
	body: "how is the process?"
});

var metaQuestion2 = new MetaQuestion({
	title: "productivity",
	body: "do you like your life?"
});

var metaQuestion3 = new MetaQuestion({
	title: "mangement",
	body: "is your CEO full of rainbows?"
});

metaQuestion1.save();
metaQuestion2.save();
metaQuestion3.save();
// End meta questions


var questions = [
	new Question({
		metaQuestion: metaQuestion1._id,
		title: metaQuestion1.title,
		body: metaQuestion1.body,
		creator: users[0]._id,
		company: company._id
	}),
	new Question({
		metaQuestion: metaQuestion1._id,
		title: metaQuestion2.title,
		body: metaQuestion2.body,
		creator: users[0]._id,
		company: company._id
	}),
	new Question({
		metaQuestion: metaQuestion1._id,
		title: metaQuestion3.title,
		body: metaQuestion3.body,
		creator: users[0]._id,
		company: company._id
	})
]

Async.each(questions, save, function(err){});

// end questions


var i;
var j;

var oneWeek = 604800000;

for(i = 0; i < 10; i++){
	for(j = 0; j < questions.length; j++){

		var dateDue = Date.now() - i * oneWeek;

		var survey = new Survey({
			questions: [questions[0]._id,questions[1]._id,questions[2]._id],
			creator: users[0]._id,
			company: company._id,
			recipient: users[j]._id,
			timeDue: dateDue
		});

		var answers = [
			new Answer({
				creator: users[0]._id,
				question: questions[0]._id,
				survey: survey._id,
				anonymous: true,
				type: 'scale',
				body: Math.floor(Math.random()*10),
				timeDue: survey.timeDue
			}),
			new Answer({
				creator: users[0]._id,
				question: questions[1]._id,
				survey: survey._id,
				anonymous: true,
				type: 'scale',
				body: Math.floor(Math.random()*10),
				timeDue: survey.timeDue
			}),
			new Answer({
				creator: users[0]._id,
				question: questions[2]._id,
				survey: survey._id,
				anonymous: true,
				type: 'scale',
				body: Math.floor(Math.random()*10),
				timeDue: survey.timeDue
			})
		]

		survey.save();
		Async.each(answers, save, function(err){});
		
	}
}

//process.exit();
})
