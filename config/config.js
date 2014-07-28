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
		db: 'mongodb://vibe:ksdiocskla@ds053429.mongolab.com:53429/vibe-dev',
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

//		db: 'mongodb://vibe:ksdiocskla@ds059559-a0.mongolab.com:59559/vibe,mongodb://vibe:ksdiocskla@ds059559-a1.mongolab.com:59559',
