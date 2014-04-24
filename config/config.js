
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates');

module.exports = {
  development: {
    db: 'mongodb://localhost/vibe',
    root: rootPath,
    app: {
      name: 'Vibe'
    },
    // facebook: {
    //   clientID: "APP_ID",
    //   clientSecret: "APP_SECRET",
    //   callbackURL: "http://APP_URL/auth/facebook/callback"
    // },
    // twitter: {
    //   clientID: "CONSUMER_KEY",
    //   clientSecret: "CONSUMER_SECRET",
    //   callbackURL: "http://APP_URL/auth/twitter/callback"
    // },
    // github: {
    //   clientID: 'APP_ID',
    //   clientSecret: 'APP_SECRET',
    //   callbackURL: 'http://APP_URL/auth/github/callback'
    // },
    // google: {
    //   clientID: "APP_ID",
    //   clientSecret: "APP_SECRET",
    //   callbackURL: "http://APP_URL/auth/google/callback"
    // },
  },
  test: {
    // db: 'mongodb://localhost/noobjs_test',
    // root: rootPath,
    // app: {
    //   name: 'Nodejs Express Mongoose Demo'
    // },
    // facebook: {
    //   clientID: "APP_ID",
    //   clientSecret: "APP_SECRET",
    //   callbackURL: "http://localhost:3000/auth/facebook/callback"
    // },
    // twitter: {
    //   clientID: "CONSUMER_KEY",
    //   clientSecret: "CONSUMER_SECRET",
    //   callbackURL: "http://localhost:3000/auth/twitter/callback"
    // },
    // github: {
    //   clientID: 'APP_ID',
    //   clientSecret: 'APP_SECRET',
    //   callbackURL: 'http://localhost:3000/auth/github/callback'
    // },
    // google: {
    //   clientID: "APP_ID",
    //   clientSecret: "APP_SECRET",
    //   callbackURL: "http://localhost:3000/auth/google/callback"
    // }
  },
  production: {
    db:  process.env.MONGOLAB_URI || 'mongodb://vibe:ksdiocskla@ds033487.mongolab.com:33487/heroku_app24476177/vibe',
    root: rootPath,
    app: {
      name: 'Vibe'
    },
  }
}
