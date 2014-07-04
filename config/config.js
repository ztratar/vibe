var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	templatePath = path.normalize(__dirname + '/../app/mailer/templates');

module.exports = {
	development: {
		db: 'mongodb://localhost/vibe',
		static_path: 'http://localhost:3000',
		root: rootPath,
		app: {
			name: 'Vibe'
		},
		AWS: {
			accessKeyId: 'AKIAIHYKXSPDP5BBXYSA',
			secretAccessKey: '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',
			region: 'us-west-2',
			Bucket: 'vibe-app-dev',
			cloudfrontDomain: 'https://d10y1c0fzsnik8.cloudfront.net/'
		}
	},
	test: {
	},
	production: {
		db:	process.env.MONGOLAB_URI || 'mongodb://vibe:ksdiocskla@ds033487.mongolab.com:33487/heroku_app24476177/vibe',
		static_path: 'https://www.getvibe.com',
		root: rootPath,
		app: {
			name: 'Vibe'
		},
		AWS: {
			accessKeyId: 'AKIAIHYKXSPDP5BBXYSA',
			secretAccessKey: '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',
			region: 'us-west-2',
			Bucket: 'vibe-app',
			cloudfrontDomain: 'https://d3fqdte7vdetyg.cloudfront.net/'
		}
	}
};
