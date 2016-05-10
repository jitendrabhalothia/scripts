var Sails = require('sails'),
  sails;

before(function(done) {
  Sails.lift({
      environment: 'test',
      port: 1337,
      log: {
        level: 'error'
      },
      connections: {
        TestMongo: {
          adapter: 'sails-mongo',
          host: 'localhost',
          port: 27017,
          database: 'test-sciex-core'
        }
      },
      models: {
        connection: 'TestMongo',
        migrate: 'drop'
      }
    },
    function(err, server) {
      sails = server;
      if (err) return done(err);
      done();
    });
});

after(function(done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});

