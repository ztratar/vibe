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
				title: 'An anonymous feedback box',
				body: 'Lets employees tell you how they really feel -- no awkwardness. Did they give interesting feedback? One click can turn it into a group discussion.'
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
				body: 'You\'re one of my first users. What you want and think mean absolutely everything to me.<br><br> Email me day or night at zach@getvibe.com!'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user/1.png',
				body: 'Vibe has an anonymous feedback box so you can test ideas and thoughts without expectations or awkwardness.'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user/2.png',
				body: 'The best feedback might be broadcasted out! These will show up in your feed -- you can anonymously agree with them.'
			}, {
				img: window.staticRoute + 'img/tutorials/first_time_user/3.png',
				body: 'Turns out everyone loved the idea? Great! Discussion uses your real identity.'
			}, {
				icon: '#61753',
				iconbg: '#E69D30',
				title: 'One last thing!',
				body: 'Do you know what your coworkers think? Vibe has one-click, anonymous polls so you can have a say with minimal effort.'
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
				icon: '#61875',
				title: 'Welcome!',
				body: 'You\'re one of the first admins! Vibe is the best way to stay aware of what your team really thinks and funnel the best ideas into group-oriented action.'
			}, {
				icon: '#61804',
				iconbg: '#2f557c',
				title: 'An anonymous feedback box',
				body: 'Lets employees tell you how they really feel -- no awkwardness. Did they give interesting feedback? One click can turn it into a group discussion.'
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
				window.Vibe.user.setTutorialFinished('fte_admin');
			}
		});

		window.Vibe.appView.showOverlay(flowStepView);
	}

};

export default = TutorialHelper;
