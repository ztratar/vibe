import FlowStepView from 'views/flowStepView';
import Cookies from 'helpers/cookies';

var TutorialHelper = {

	demoIntro: function() {
		if (Cookies.get('demo_shown') === 'true') {
			return;
		}

		var flowStepView = new FlowStepView({
			name: 'demo_intro',
			steps: [{
				icon: '#61875',
				title: 'Welcome to Demo, Inc',
				body: 'Vibe is the best way to stay aware of what your team really thinks and funnel the best ideas into group-oriented action.'
			}, {
				icon: '#61804',
				iconbg: '#2f557c',
				title: 'An anonymous suggestion box',
				body: 'Lets employees tell you how they really feel -- no awkwardness. Did they make an interesting suggestion? One click can turn it into a group discussion.'
			}, {
				icon: '#61753',
				iconbg: '#E69D30',
				title: 'Things change fast',
				body: 'So we designed a fun poll system that keeps pace. It\'s super light-weight and gives your team a constant stream of insights.'
			}, {
				icon: '#61725',
				iconbg: '#B93D3D',
				title: 'Time shouldn\'t be wasted',
				body: 'Vibe stays out of the way when you\'re in crunch mode. All actions are bite-sized and can be accessed anywhere, even your phone.'
			}],
			onFinish: function() {
				Cookies.set('demo_shown', 'true', 365);
			}
		});

		window.Vibe.appView.showOverlay(flowStepView);
	},

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
