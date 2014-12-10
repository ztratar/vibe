var path = require('path'),
	rootPath = path.normalize(__dirname + '/..'),
	templatePath = path.normalize(__dirname + '/../app/mailer/templates');

module.exports = {
	development: {
		mongoosedb: 'mongodb://localhost/vibe',
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
		frontendCacheVersion: '1.0.2',
		mongoosedb: 'mongodb://heroku_app24476177:80cqqo8p1631qqbrcfsn4ui08u@ds063330.mongolab.com:63330/heroku_app24476177'
		db: 'mongodb://heroku_app24476177:80cqqo8p1631qqbrcfsn4ui08u@ds063330.mongolab.com:63330/heroku_app24476177',
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
