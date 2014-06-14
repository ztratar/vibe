/// Module dependencies.
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	_ = require('underscore');

// MetaQuestion Schema
var MetaQuestionSchema = new Schema({
	body: String,
	suggested: { type: Boolean, default: false },
	creator: { type: Schema.Types.ObjectId, ref: 'User' }
});

// MetaQuestion Methods
MetaQuestionSchema.methods = {

	asQuestion: function() {
		var retObj = this.toObject();
		return {
			meta_question: retObj._id,
			body: retObj.body
		};
	}

};

mongoose.model('MetaQuestion', MetaQuestionSchema);
