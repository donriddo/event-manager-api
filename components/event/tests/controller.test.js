const mongoose = require('mongoose');
const chai = require('chai');
const _ = require('lodash');
const chaiHTTP = require('chai-http');
const expect = chai.expect;
const app = require('../../app.test');
chai.use(chaiHTTP);
let token;
let id;

const eventUserObj = {
  email: "login@user.com",
  password: "dummy",
  firstName: "Dummy",
  lastName: "User"
};

const eventObj = {
  title: 'dummy title',
  details: 'dummy details',
  address: 'dummy address',
  coordinates: { lat: 5.678, long: 3.456 },
  from: new Date(),
  to: new Date()

}

describe('Event service', function () {
  after(function (done) {
    if (mongoose.connection.db.databaseName === 'event_manager_test') {
        console.log('Dropping Test Database...');
        mongoose.connection.db.dropDatabase(done);
    }
  });

  describe('#Create', () => {
    it('should return 401: You need to be logged in to post a event', (done) => {
      chai.request(app)
        .post('/api/event')
        .set('Accept', 'application/json')
        .send({})
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('No Authorization header was found');
            done();
        });
    });

    it('should return 201: User created', (done) => {
        chai.request(app)
          .post('/api/user')
          .set('Accept', 'application/json')
          .send(eventUserObj)
          .end((err, res) => {
            expect(err).to.be.a('null');
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('User created successfully');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('email');
            expect(res.body.data.email).to.equal('login@user.com');
            id = res.body._id;
            done();
          });
      });

    it('should return 200, Login successfully', (done) => {
        chai.request(app)
          .post('/api/login')
          .send(eventUserObj)
          .set('Accept', 'application/json')
          .end((err, res) => {
            expect(err).to.be.a('null');
            token = res.body.token;
            id = res.body.user._id;
            eventObj.user = id;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
            expect(res.body.token).to.be.a('string');
            done();
          });
      });

    it('should return 400: Some fields are required', (done) => {
        chai.request(app)
          .post('/api/event')
          .set('Authorization', 'Bearer '.concat(token))
          .send({})
          .end((err, res) => {
            expect(err).to.be.a('null');
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('message');
            expect(res.body.message).to.equal('Some required fields are missing');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.include.members([ 'address', 'coordinates', 'from', 'to', 'title', 'details' ]);
            done();
          });
      });

    it('should return 400: Address is required', (done) => {
      chai.request(app)
        .post('/api/event')
        .set('Authorization', 'Bearer '.concat(token))
        .send(_.omit(eventObj, 'address'))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Some required fields are missing');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.include.members([ 'address' ]);
          done();
        });
    });

    it('should return 400: Coordinates are required', (done) => {
      chai.request(app)
        .post('/api/event')
        .set('Authorization', 'Bearer '.concat(token))
        .send(_.omit(eventObj, 'coordinates'))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Some required fields are missing');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.include.members([ 'coordinates' ]);
          done();
        });
    });

    it('should return 400: From is required', (done) => {
      chai.request(app)
        .post('/api/event')
        .set('Authorization', 'Bearer '.concat(token))
        .send(_.omit(eventObj, 'from'))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Some required fields are missing');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.include.members([ 'from' ]);
          done();
        });
    });

    it('should return 400: To is required', (done) => {
      chai.request(app)
        .post('/api/event')
        .set('Authorization', 'Bearer '.concat(token))
        .send(_.omit(eventObj, 'to'))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Some required fields are missing');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.include.members([ 'to' ]);
          done();
        });
    });

    it('should return 400: Title is required', (done) => {
      chai.request(app)
        .post('/api/event')
        .set('Authorization', 'Bearer '.concat(token))
        .send(_.omit(eventObj, 'title'))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Some required fields are missing');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.include.members([ 'title' ]);
          done();
        });
    });

    it('should return 400: Details is required', (done) => {
      chai.request(app)
        .post('/api/event')
        .set('Authorization', 'Bearer '.concat(token))
        .send(_.omit(eventObj, 'details'))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Some required fields are missing');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          expect(res.body.data).to.include.members([ 'details' ]);
          done();
        });
    });

    it('should return 201: Event created', (done) => {
      chai.request(app)
        .post('/api/event')
        .set('Authorization', 'Bearer '.concat(token))
        .send(eventObj)
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Event created successfully');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('_id');
          id = res.body.data._id;
          done();
        });
    });

  });

  describe('#Read', () => {
    it('should return 200, Event retrieved successfully', (done) => {
      chai.request(app)
        .get(`/api/event/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Event retrieved successfully');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('_id');
          expect(res.body.data._id).to.be.a('string');
          done();
        });
    });
  });

  describe('#Update', () => {
    it('should return 404: Event not found', done => {
      chai.request(app)
        .put('/api/event/58a58b41ccd50a3f0ec99ee2')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Event not found');
          done();
        });
    });

    it('should return 200: Event updated successfully', done => {
      chai.request(app)
        .put(`/api/event/${id}`)
        .send(eventObj)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Event updated successfully');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.include.keys('_id', 'title');
          done();
        });
    });
  });

  describe('#Delete', () => {
    it('should return 404: Event not found', done => {
      chai.request(app)
        .delete('/api/event/58a58b41ccd50a3f0ec99ee2')
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Event not found');
          done();
        });
    });

    it('should return 200: Event Soft-Deleted successfully', done => {
      chai.request(app)
        .delete(`/api/event/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Event deleted successfully');
          expect(res.body.data).to.include.keys('title', 'isDeleted');
          done();
        });
    });

    it('should return 404: Event already Soft-Deleted', done => {
      chai.request(app)
        .get(`/api/event/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Event not found');
          done();
        });
    });

    it('should return 404: Cannot update deleted event', done => {
      chai.request(app)
        .put(`/api/event/${id}`)
        .set('Authorization', 'Bearer '.concat(token))
        .send(eventObj)
        .end((err, res) => {
          expect(err).to.be.a('null');
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Event not found');
          done();
        });
    });

  });

});
