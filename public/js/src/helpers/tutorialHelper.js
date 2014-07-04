import FlowStepView from 'views/flowStepView';

var TutorialHelper = {

	firstTimeUser: function() {
		if (window.Vibe.user.get('isAdmin')) {
			return TutorialHelper.firstTimeAdmin();
		}

		if (window.Vibe.user.get('tutorial').fte) {
			return;
		}

		var flowStepView = new FlowStepView({
			name: 'first_time_user',
			steps: [{
				title: 'First a quick note...',
				body: 'You\'re one of my first users! My goal for Vibe is to build you tools that you\'ll actually love to use. This is my life, so your feedback -- what you want -- means absolutely everything to me.<br><br> Email me day or night at zach@getvibe.com. :)'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user/1.png',
				body: 'Sometimes it\'s hard to communicate thoughts, so Vibe wants to make it dead simple and give you freedom. No expectations &amp; no rules -- have a thought? Just say it, anonymously.'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user/2.png',
				body: 'When suggestions are chosen from the box, they\'re blasted out to everyone. You can agree with suggestions anonymously as well!'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user/3.png',
				body: 'If something is catching on, go ahead and discuss it with your real identity!'
			}],
			onFinish: function() {
				window.Vibe.user.setTutorialFinished('fte');
			}
		});

		window.Vibe.appView.showOverlay(flowStepView);
	},

	firstTimeAdmin: function() {
		if (window.Vibe.user.get('tutorial').fte_admin) {
			return;
		}

		var flowStepView = new FlowStepView({
			name: 'first_time_user_admin',
			steps: [{
				title: 'Hey there, admin.',
				body: 'You\'re one of my first admins! Making Vibe great <strong>for you</strong> is my life, so your feedback -- what you want -- means absolutely everything to me.<br><br> Email me day or night at zach@getvibe.com. :)'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user/1.png',
				body: 'The suggestion box is anonymous, which means you can start it off right! As suggestions come in, don\'t forget to approve a couple!'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user_admin/2.png',
				body: 'You can blast out super-simple polls with 2 clicks. Get a pulse on things, fast!'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user_admin/3.png',
				body: 'Manage the team at any time by going into settings and then "Manage Team".'
			}],
			onFinish: function() {
				window.Vibe.user.setTutorialFinished('fte_admin');
			}
		});

		window.Vibe.appView.showOverlay(flowStepView);
	}

};

export default = TutorialHelper;
