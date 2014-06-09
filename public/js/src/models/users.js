import 'backbone';
import User from 'models/user';

var Users = Backbone.Collection.extend({

	model: User

});

export default = Users;
