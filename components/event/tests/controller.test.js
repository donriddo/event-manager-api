const mongoose = require('mongoose');
const chai = require('chai');
const _ = require('lodash');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const app = require('../../app.test');
chai.use(chaiHTTP);
let token;
let id;

const pictureUserObj = {
    email: "login@user.com",
    password: "dummy"
};

const pictureObj = {
    url: "dummy@picture.com",
    user: "dummy"
};

describe('Picture service', function () {
  after(function (done) {
    if (mongoose.connection.db.databaseName === 'photobook_test') {
        console.log('Dropping Test Database...');
        mongoose.connection.db.dropDatabase(done);
    }
  });

  describe('#Create', () => {
    it('should return 401: You need to be logged in to post a picture', (done) => {
      chai.request(app)
        .post('/api/picture')
        .set('Accept', 'application/json')
        .send({})
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('response');
            expect(res.body.response).to.have.property('message');
            expect(res.body.response.message).to.equal('No Authorization header was found');
            done();
        });
    });

    it('should return 201: User created', (done) => {
        chai.request(app)
          .post('/api/user')
          .set('Accept', 'application/json')
          .send(pictureUserObj)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('email');
            expect(res.body.email).to.equal('login@user.com');
            id = res.body._id;
            done();
          });
      });

    it('should return 200, Login successfully', (done) => {
        chai.request(app)
          .post('/api/login')
          .send(pictureUserObj)
          .set('Accept', 'application/json')
          .end((err, res) => {
            token = res.body.token;
            id = res.body.user._id;
            pictureObj.user = id;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
            expect(res.body.token).to.be.a('string');
            done();
          });
      });

    // it('should return 400: Url and User are required', (done) => {
    //     chai.request(app)
    //       .post('/api/picture')
    //       .set('Authorization', 'Bearer '.concat(token))
    //       .send({})
    //       .end((err, res) => {
    //         expect(res).to.have.status(400);
    //         expect(res.body).to.have.property('name');
    //         expect(res.body.name).to.equal('ValidationError');
    //         expect(res.body).to.have.property('message');
    //         expect(res.body.message).to.include('picture validation failed');
    //         expect(res.body).to.have.property('errors');
    //         expect(res.body.errors).to.be.an('object');
    //         expect(res.body.errors).to.have.all.keys('url', 'user');
    //         expect(res.body.errors.url).to.be.an('object');
    //         expect(res.body.errors.url).to.have.all.keys(
    //           'message', 'name', 'properties', 'kind', 'path', '$isValidatorError'
    //         );
    //         expect(res.body.errors.user).to.be.an('object');
    //         expect(res.body.errors.user).to.have.all.keys(
    //           'message', 'name', 'properties', 'kind', 'path', '$isValidatorError'
    //         );
    //         done();
    //       });
    //   });

    // it('should return 400: Url is required', (done) => {
    //   chai.request(app)
    //     .post('/api/picture')
    //     .set('Authorization', 'Bearer '.concat(token))
    //     .send(_.omit(pictureObj, 'url'))
    //     .end((err, res) => {
    //       expect(res).to.have.status(400);
    //       expect(res.body).to.have.property('name');
    //       expect(res.body.name).to.equal('ValidationError');
    //       expect(res.body).to.have.property('message');
    //       expect(res.body.message).to.include('picture validation failed');
    //       expect(res.body).to.have.property('errors');
    //       expect(res.body.errors).to.be.an('object');
    //       expect(res.body.errors).to.have.all.keys('url');
    //       expect(res.body.errors.url).to.be.an('object');
    //       expect(res.body.errors.url).to.include.keys(
    //         'message', 'name', 'properties', 'kind', 'path'
    //       );
    //       done();
    //     });
    // });

    // it('should return 400: User is required', (done) => {
    //   chai.request(app)
    //     .post('/api/picture')
    //     .set('Authorization', 'Bearer '.concat(token))
    //     .send(_.omit(pictureObj, 'user'))
    //     .end((err, res) => {
    //       expect(res).to.have.status(400);
    //       expect(res.body).to.have.property('name');
    //       expect(res.body.name).to.equal('ValidationError');
    //       expect(res.body).to.have.property('message');
    //       expect(res.body.message).to.include('picture validation failed');
    //       expect(res.body).to.have.property('errors');
    //       expect(res.body.errors).to.be.an('object');
    //       expect(res.body.errors).to.have.all.keys('user');
    //       expect(res.body.errors.user).to.be.an('object');
    //       expect(res.body.errors.user).to.include.keys(
    //         'message', 'name', 'properties', 'kind', 'path'
    //       );
    //       done();
    //     });
    // });

    // it('should return 201: Picture created', (done) => {
    //   chai.request(app)
    //     .post('/api/picture')
    //     .set('Authorization', 'Bearer '.concat(token))
    //     .send(pictureObj)
    //     .end((err, res) => {
    //       expect(res).to.have.status(201);
    //       expect(res.body).to.have.property('url');
    //       expect(res.body.url).to.equal('dummy@picture.com');
    //       id = res.body._id;
    //       done();
    //     });
    // });

  });

//   describe('#Read', () => {
    // it('should return 200, Pictures retrieved successfully', (done) => {
    //   chai.request(app)
    //     .get(`/api/picture/${id}`)
    //     .set('Authorization', 'Bearer '.concat(token))
    //     .end((err, res) => {
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.have.property('_id');
    //       expect(res.body._id).to.be.a('string');
    //       done();
    //     });
    // });
//   });

  describe('#Update', () => {
    it('should return 404: Picture not found', done => {
      chai.request(app)
        .put('/api/picture/58a58b41ccd50a3f0ec99ee2')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Picture not found');
          done();
        });
    });

    // it('should return 200: Picture updated successfully', done => {
    //   chai.request(app)
    //     .put(`/api/picture/${id}`)
    //     .send(pictureObj)
    //     .set('Authorization', 'Bearer '.concat(token))
    //     .end((err, res) => {
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.include.keys('_id', 'url');
    //       done();
    //     });
    // });
  });

  describe('#Delete', () => {
    it('should return 404: Picture not found', done => {
      chai.request(app)
        .delete('/api/picture/58a58b41ccd50a3f0ec99ee2')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Picture not found');
          done();
        });
    });

    // it('should return 200: Picture Soft-Deleted successfully', done => {
    //   chai.request(app)
    //     .delete(`/api/picture/${id}`)
    //     .set('Authorization', 'Bearer '.concat(token))
    //     .end((err, res) => {
    //       expect(res).to.have.status(200);
    //       expect(res.body).to.include.keys('url', 'isDeleted');
    //       expect(res.body.isDeleted).to.equal(true);
    //       done();
    //     });
    // });

    // it('should return 404: Picture already Soft-Deleted', done => {
    //   chai.request(app)
    //     .get(`/api/picture/${id}`)
    //     .set('Authorization', 'Bearer '.concat(token))
    //     .end((err, res) => {
    //       expect(res).to.have.status(404);
    //       expect(res.body).to.have.property('message');
    //       expect(res.body.message).to.equal('Picture not found');
    //       done();
    //     });
    // });

    // it('should return 404: Cannot update deleted picture', done => {
    //   chai.request(app)
    //     .put(`/api/picture/${id}`)
    //     .set('Authorization', 'Bearer '.concat(token))
    //     .send(pictureObj)
    //     .end((err, res) => {
    //       expect(res).to.have.status(404);
    //       expect(res.body).to.have.property('message');
    //       expect(res.body.message).to.equal('Picture not found');
    //       done();
    //     });
    // });

  });

});
