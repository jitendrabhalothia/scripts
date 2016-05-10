var chai = require('chai'),
    expect = require('chai').expect,
    chaiHttp = require('chai-http'),
    should = chai.should();
    
chai.use(chaiHttp);

describe('CollectionController',function(){
  var invalidName = 'invalidname',
      invalidId = 'invalidid';
  
	describe('#create()', function() {
    	var name;
    it('should create an empty collection', function(done) {
      chai.request(sails.hooks.http.app)
        .post('/v1/collections')
        .send({
          'name': 'testGroup1',
          'type': 'UserObjectType'
        })
        .end(function(err, result) {
          should.not.exist(err);
          result.should.have.status(200);
          result.should.be.json;
          expect(result.ok).to.equal(true);
          result.body.should.have.property('name');
          result.body.should.have.property('id');
          result.body.name.should.equal('testGroup1');
          name = result.body.name;
          done();
        });
    });

      it('should not create a collection with same name', function(done) {
      chai.request(sails.hooks.http.app)
        .post('/v1/collections')
        .send({
          'name': 'testGroup1',
          'type': 'UserObjectType'
        })
        .end(function(err, result) {
          result.should.have.status(400);
          result.should.be.json;
          expect(result.ok).to.equal(false);
          result.body.message[0].short_message.should.equal('1 attribute is invalid name');
          done();
        });
    });

      it('should not create a collection without type if collection is homogeneous', function(done) {
      chai.request(sails.hooks.http.app)
        .post('/v1/collections')
        .send({
          'name': 'testGroup10'
        })
        .end(function(err, result) {
          result.should.have.status(400);
          result.should.be.json;
          expect(result.ok).to.equal(false);
          result.body.message[0].short_message.should.equal('No type provided for the collection since it is homogeneous collection');
          done();
        });
    });

      it('should create a collection without type if collection is homogeneous', function(done) {
      chai.request(sails.hooks.http.app)
        .post('/v1/collections')
        .send({
          'name': 'testGroup10',
          'homogeneous' : 'false'
        })
        .end(function(err, result) {
          result.should.have.status(200);
          result.should.be.json;
          expect(result.ok).to.equal(true);
          result.body.name.should.equal('testGroup10');
          result.body.homogeneous.should.equal(false);
          done();
        });
    });



   // after(function(done) {
   //    chai.request(sails.hooks.http.app)
   //      .delete('/collections/'+name)
   //      .end(function(err, result) {
   //        done();
   //      });
   //  });
  });

  describe('#findbyName()', function(){
    var name;
    before(function(done) {
      chai.request(sails.hooks.http.app)
        .post('/v1/collections')
        .send({
          'name': 'testGroup2',
          'type' : 'UserObjectType'
        })
        .end(function(err, result) {
          name = result.body.name;
          done();
        });
    });
    it('should return a collection based on name', function(done) {
      chai.request(sails.hooks.http.app)
        .get('/v1/collections/'+name)
        .end(function(err, result) {
          should.not.exist(err);
          result.should.have.status(200);
          expect(result.ok).to.equal(true);
          result.body.should.be.a('array');
          result.body.should.have.length(1);
          result.body[0].should.have.property('id');
          result.body[0].should.have.property('name');
          result.body[0].name.should.equal('testGroup2');
          result.body[0].name.should.equal(name);
          done();
        });
    });

    it('should not return a collection if name is invalid', function(done) {
      chai.request(sails.hooks.http.app)
        .get('/v1/collections/'+invalidName)
        .end(function(err, result) {
          result.should.have.status(400);
          expect(result.ok).to.equal(false);
          done();
        });
    });

    
    
    // after(function(done) {
    //   chai.request(sails.hooks.http.app)
    //     .delete('/v1/collections/'+name)
    //     .end(function(err, result) {
    //       done();
    //     });
    //  });
   });  

  describe('#find()', function(){
    var name;
    before(function(done) {
      chai.request(sails.hooks.http.app)
        .post('/v1/collections')
        .send({
          'name': 'testGroup3',
          'type' : 'UserObjectType'
        })
        .end(function(err, result) {
          name = result.body.name;
          done();
        });
    });
    it('should return all the collections', function(done) {
      chai.request(sails.hooks.http.app)
        .get('/v1/collections')
        .end(function(err, result) {
          should.not.exist(err);
          result.should.have.status(200);
          expect(result.ok).to.equal(true);
          result.body.should.be.a('array');
          result.body[0].should.have.property('id');
          done();
        });
     });
    // after(function(done) {
    //   chai.request(sails.hooks.http.app)
    //     .delete('/v1/collections/'+name)
    //     .end(function(err, result) {
    //       done();
    //     });
    //  });
   });

  describe('#update()', function(){
    var name;
    before(function(done) {
      chai.request(sails.hooks.http.app)
        .post('/v1/collections')
        .send({
          'name': 'testGroup4',
          'type': 'UserObjectType'
        })
        .end(function(err, result) {
          name = result.body.name;
          done();
        });
    });

    it('should update the collection', function(done){
       chai.request(sails.hooks.http.app)
        .put('/v1/collections/'+name)
        .send({
          'element': '[{"id": "123352w434eq535","objectType": "UserObjectType"},{"id": "yutduw7898899889","objectType": "UserObjectType"}]'
        })
        .end(function(err, result) {
          should.not.exist(err);
          result.should.have.status(200);
          expect(result.ok).to.equal(true);
          result.body.should.be.a('array');
          result.body[0].should.have.property('id');
          result.body[0].should.have.property('name');
          result.body[0].name.should.equal('testGroup4');
          done();
        });
    });

    it('should not update the collection with invalid name', function(done){
       chai.request(sails.hooks.http.app)
        .put('/v1/collections/'+invalidName)
        .send({
          'element': '[{"id": "123352w434eq535","objectType": "UserObjectType"},{"id": "yutduw7898899889","objectType": "UserObjectType"}]'
        })
        .end(function(err, result) {
          result.should.have.status(400);
          expect(result.ok).to.equal(false);
          done();
        });
     });

    it('should not update the collection without name', function(done){
       chai.request(sails.hooks.http.app)
        .put('/v1/collections/')
        .send({
          'element': '[{"id": "123352w434eq535","objectType": "UserObjectType"},{"id": "yutduw7898899889","objectType": "UserObjectType"}]'
        })
        .end(function(err, result) {
          result.should.have.status(404);
          expect(result.ok).to.equal(false);
          done();
        });
     });

    // after(function(done) {
    //   chai.request(sails.hooks.http.app)
    //     .delete('/v1/collections/'+name)
    //     .end(function(err, result) {
    //       done();
    //     });
    //  });
   });

  describe('#delete()', function(){
    var name;
    before(function(done) {
      chai.request(sails.hooks.http.app)
        .post('/v1/collections')
        .send({
          'name': 'testGroup5',
          'type': 'UserObjectType'
        })
        .end(function(err, result) {
          name = result.body.name;
          done();
        });
     });
    it('should delete collection based on name', function(done){
      chai.request(sails.hooks.http.app)
        .delete('/v1/collections/'+name)
        .end(function(err,result){
           should.not.exist(err);
           result.should.have.status(200);
           expect(result.ok).to.equal(true);
           result.body.should.be.a('array');
           result.body[0].should.have.property('id');
           result.body[0].should.have.property('name');
           result.body[0].name.should.equal('testGroup5');
           result.body[0].logicalDelete.should.equal(true);
          done();
        });
     });

    it('should not delete the collection with invalid name', function(done){
       chai.request(sails.hooks.http.app)
        .put('/v1/collections/'+invalidName)
        .end(function(err, result) {
          result.should.have.status(400);
          expect(result.ok).to.equal(false);
          done();
        });
     });

    it('should not delete the collection without name', function(done){
       chai.request(sails.hooks.http.app)
        .delete('/v1/collections/')
        .end(function(err, result) {
          result.should.have.status(404);
          expect(result.ok).to.equal(false);
          done();
        });
     });
   });

  // describe('#add()', function(){
  //   var name;
  //   before(function(done) {
  //     chai.request(sails.hooks.http.app)
  //       .post('/v1/collections')
  //       .send({
  //         'name': 'testGroup6',
  //         'type' : 'UserObjectType'
  //       })
  //       .end(function(err, result) {
  //         name = result.body.name;
  //         done();
  //       });
  //    });
  //   it('should add element in a collection', function(done){
  //     chai.request(sails.hooks.http.app)
  //     .post('/v1/collections/'+name+'/add')
  //     .send({
  //       'element': '[{"id": "123352w434eq535","objectType": "UserObjectType"},{"id": "yutduw7898899889","objectType": "UserObjectType"}]'
  //      })
  //     .end(function(err,result){
  //       console.log(result.body);
  //       result.should.have.status(200);
  //       expect(result.ok).to.equal(true);
  //       done();
  //     });
  //   });
  // });

  // describe('#remove()', function(){
  //   var name;
  //   before(function(done) {
  //     chai.request(sails.hooks.http.app)
  //       .post('/v1/collections')
  //       .send({
  //         'name': 'testGroup7',
  //         'type': 'UserObjectType',
  //         'element': '[{"id": "123352w434eq535","objectType": "UserObjectType"},{"id": "yutduw7898899889","objectType": "UserObjectType"}]'  
  //       })
  //       .end(function(err, result) {
  //         name = result.body.name;
  //         done();
  //       });
  //    });
  //   it('should remove element from a collection', function(done){
  //     chai.request(sails.hooks.http.app)
  //     .delete('/v1/collections/'+name+'/remove')
  //     .send({
  //       'element' : '[{"id": "123352w434eq535","objectType": "UserObjectType"}]'
  //      })
  //     .end(function(err,result){
  //       result.should.have.status(200);
  //       expect(result.ok).to.equal(true);
  //       done();
  //     });
  //   });
  // });

  // describe('#findElement()', function(){
  //    var name,
  //        id;
  //   before(function(done) {
  //     chai.request(sails.hooks.http.app)
  //       .post('/v1/collections')
  //       .send({
  //         'name': 'testGroup7',
  //         'type': 'UserObjectType',
  //         'element': '[{"id": "12335jdjdeq535","objectType": "UserObjectType"},{"id": "dxk474847","objectType": "UserObjectType"}]'
  //       })
  //       .end(function(err, result) {
  //         name = result.body.name;
  //         id = result.body.element[0].id;
  //         done();
  //       });
  //    });
    
  //   it('should find element based on id and group name', function(done){
  //     chai.request(sails.hooks.http.app)
  //     .get('/v1/collections/'+name+'/find/'+id)
  //     .end(function(err,result){
  //       result.should.have.status(200);
  //       expect(result.ok).to.equal(true);
  //       done();
  //     });
  //   });
  //   it('should not find element with wrong id', function(done){
  //     chai.request(sails.hooks.http.app)
  //     .get('/v1/collections/'+name+'/find/'+invalidId)
  //     .end(function(err,result){
  //       result.should.have.status(400);
  //       expect(result.ok).to.equal(false);
  //       done();
  //     });
  //   });
  //   it('should not find element with wrong collection name', function(done){
  //     chai.request(sails.hooks.http.app)
  //     .get('/v1/collections/'+invalidName+'/find/'+id)
  //     .end(function(err,result){
  //       result.should.have.status(400);
  //       expect(result.ok).to.equal(false);
  //       done();
  //     });
  //   });
  // });    
});
