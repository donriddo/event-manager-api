const mongoose = require('mongoose');
const chai = require('chai');
const _ = require('lodash');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const app = require('../../app.test');
chai.use(chaiHTTP);
let token;
let id;

const userObj = {
    firstName: "dummy",
    lastName: "user",
    email: "dummy@user.com",
    password: "dummy"
};

describe('User service', function () {
  after(function (done) {
    if (mongoose.connection.db.databaseName === 'event_manager_test') {
        console.log('Dropping Test Database...');
        mongoose.connection.db.dropDatabase(done);
    }
  });

  describe('#Create', () => {
    it('should return 400: FirstName, LastName, Email and Password are required', (done) => {
      chai.request(app)
        .post('/api/user')
        .set('Accept', 'application/json')
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('ValidationError');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('email', 'password');
          expect(res.body.errors.email).to.be.an('object');
          expect(res.body.errors.email).to.have.all.keys(
            'message', 'name', 'properties', 'kind', 'path', '$isValidatorError'
          );
          expect(res.body.errors.password).to.be.an('object');
          expect(res.body.errors.password).to.have.all.keys(
            'message', 'name', 'properties', 'kind', 'path', '$isValidatorError'
          );
          done();
        });
    });

    it('should return 400: First Name is required', (done) => {
      chai.request(app)
        .post('/api/user')
        .set('Accept', 'application/json')
        .send(_.omit(userObj, 'firstName'))
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('ValidationError');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('firstName');
          expect(res.body.errors.email).to.be.an('object');
          expect(res.body.errors.email).to.include.keys(
            'message', 'name', 'properties', 'kind', 'path', '$isValidatorError'
          );
          done();
        });
    });

    it('should return 400: Last Name is required', (done) => {
      chai.request(app)
        .post('/api/user')
        .set('Accept', 'application/json')
        .send(_.omit(userObj, 'lastName'))
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('ValidationError');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('lastName');
          expect(res.body.errors.email).to.be.an('object');
          expect(res.body.errors.email).to.include.keys(
            'message', 'name', 'properties', 'kind', 'path', '$isValidatorError'
          );
          done();
        });
    });

    it('should return 400: Email is required', (done) => {
      chai.request(app)
        .post('/api/user')
        .set('Accept', 'application/json')
        .send(_.omit(userObj, 'email'))
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('ValidationError');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('email');
          expect(res.body.errors.email).to.be.an('object');
          expect(res.body.errors.email).to.include.keys(
            'message', 'name', 'properties', 'kind', 'path', '$isValidatorError'
          );
          done();
        });
    });

    it('should return 400: Password is required', (done) => {
      chai.request(app)
        .post('/api/user')
        .set('Accept', 'application/json')
        .send(_.omit(userObj, 'password'))
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('name');
          expect(res.body.name).to.equal('ValidationError');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.include('user validation failed');
          expect(res.body).to.have.property('errors');
          expect(res.body.errors).to.be.an('object');
          expect(res.body.errors).to.have.all.keys('password');
          expect(res.body.errors.password).to.be.an('object');
          expect(res.body.errors.password).to.include.keys(
            'message', 'name', 'properties', 'kind', 'path'
          );
          done();
        });
    });

    it('should return 201: User created', (done) => {
      chai.request(app)
        .post('/api/user')
        .set('Accept', 'application/json')
        .send(userObj)
        .end((err, res) => {
            console.log(res.body);
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('email');
          expect(res.body.email).to.equal('dummy@user.com');
          id = res.body._id;
          done();
        });
    });

    // it('should return 400: Email already exists', (done) => {
    //   chai.request(app)
    //     .post('/api/user')
    //     .set('Accept', 'application/json')
    //     .send(userObj)
    //     .end((err, res) => {
    //         console.log(res.body);
    //       expect(res).to.have.status(400);
    //       expect(res.body).to.have.property('message');
    //       expect(res.body).to.have.property('reason');
    //       expect(res.body.reason).to.equal('Email exists');
    //       expect(res.body.message).to.have.string('Validation error has occured');
    //       done();
    //     });
    // });

  });

  describe('Login', () => {
    it('should return 401, Unauthorized', (done) => {
      chai.request(app)
        .get(`/api/user/${id}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('response');
          expect(res.body.response).to.have.property('message');
          expect(res.body.response.message).to.equal('No Authorization header was found');
          done();
        });
    });

    it('should return 200, Login successfully', (done) => {
      chai.request(app)
        .post('/api/login')
        .send(userObj)
        .set('Accept', 'application/json')
        .end((err, res) => {
          token = res.body.token;
          id = res.body.user._id;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body.token).to.be.a('string');
          done();
        });
    });
  });

  describe('#Read', () => {
    it('should return 200, Users retrieved successfully', (done) => {
      chai.request(app)
        .get(`/api/user/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('_id');
          expect(res.body._id).to.be.a('string');
          done();
        });
    });
  });

  describe('#Update', () => {
    it('should return 404: User not found', done => {
      chai.request(app)
        .put('/api/user/58a58b41ccd50a3f0ec99ee2')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return 200: User updated successfully', done => {
      chai.request(app)
        .put(`/api/user/${id}`)
        .send(userObj)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('_id', 'email');
          done();
        });
    });
  });

  describe('#Delete', () => {
    it('should return 404: User not found', done => {
      chai.request(app)
        .delete('/api/user/58a58b41ccd50a3f0ec99ee2')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return 200: User Soft-Deleted successfully', done => {
      chai.request(app)
        .delete(`/api/user/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.include.keys('email', 'isDeleted');
          expect(res.body.isDeleted).to.equal(true);
          done();
        });
    });

    it('should return 404: User already Soft-Deleted', done => {
      chai.request(app)
        .get(`/api/user/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

    it('should return 404: Cannot update deleted user', done => {
      chai.request(app)
        .put(`/api/user/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .send(userObj)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('User not found');
          done();
        });
    });

  });

});
