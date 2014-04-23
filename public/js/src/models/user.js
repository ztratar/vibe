import BaseModel from 'models/baseModel';

var User = BaseModel.extend({
	defaults: {
		name: 'Zach Tratar',
		img: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn1/t1.0-1/c0.0.160.160/p160x160/1920515_2252277543625_455505174_n.jpg',
		email: 'ztratar@gmail.com',
		company: {
			name: 'Vibe',
			domain: 'vibeapp.org',
			size: 42
		},
		seenTutorial: false
	}
});

export default = User;
