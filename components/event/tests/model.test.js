const expect = require('chai').expect;
const _ = require('lodash');

const User = require('../../user/model');
const Event = require('../model');

const userObj = {
    email: "dummy@user.com",
    password: "dummy",
    firstName: "Dummy",
    lastName: "User"
};

const eventObj = {
    title: 'dummy title',
    details: 'dummy details',
    address: 'dummy address',
    location: { type: 'Point', coordinates: [5.678, 3.456] },
    from: new Date(),
    to: new Date()

}
 
describe('event', function() {
    it('should reject with error if body is empty', function(done) {
        var event = new Event();
 
        event.validate(function(err) {
            expect(err.errors.title).to.exist;
            expect(err.errors.details).to.exist;
            expect(err.errors.address).to.exist;
            expect(err.errors['location.type']).to.exist;
            expect(err.errors['location.coordinates']).to.exist;
            expect(err.errors.from).to.exist;
            expect(err.errors.to).to.exist;
            expect(err.errors.user).to.exist;
            done();
        });
    });

    it('should reject with error if user is empty', function(done) {
        var event = new Event(eventObj);
 
        event.validate(function(err) {
            expect(err.errors.title).to.not.exist;
            expect(err.errors.user).to.exist;
            done();
        });
    });

    it('should reject with error if title is empty', function(done) {
        const user = new User(userObj);
        var event = new Event(_.omit(Object.assign(eventObj, { user: user._id }), 'title'));
 
        event.validate(function(err) {
            expect(err.errors.user).to.not.exist;
            expect(err.errors.details).to.not.exist;
            expect(err.errors.address).to.not.exist;
            expect(err.errors['location.type']).to.not.exist;
            expect(err.errors['location.coordinates']).to.not.exist;
            expect(err.errors.from).to.not.exist;
            expect(err.errors.to).to.not.exist;
            expect(err.errors.title).to.exist;
            done();
        });
    });

    it('should reject with error if details is empty', function(done) {
        const user = new User(userObj);
        var event = new Event(_.omit(Object.assign(eventObj, { user: user._id }), 'details'));
 
        event.validate(function(err) {
            expect(err.errors.user).to.not.exist;
            expect(err.errors.address).to.not.exist;
            expect(err.errors['location.type']).to.not.exist;
            expect(err.errors['location.coordinates']).to.not.exist;
            expect(err.errors.from).to.not.exist;
            expect(err.errors.to).to.not.exist;
            expect(err.errors.title).to.not.exist;
            expect(err.errors.details).to.exist;
            done();
        });
    });

    it('should reject with error if address is empty', function(done) {
        const user = new User(userObj);
        var event = new Event(_.omit(Object.assign(eventObj, { user: user._id }), 'address'));
 
        event.validate(function(err) {
            expect(err.errors.user).to.not.exist;
            expect(err.errors.details).to.not.exist;
            expect(err.errors['location.type']).to.not.exist;
            expect(err.errors['location.coordinates']).to.not.exist;
            expect(err.errors.from).to.not.exist;
            expect(err.errors.to).to.not.exist;
            expect(err.errors.title).to.not.exist;
            expect(err.errors.address).to.exist;
            done();
        });
    });

    it('should reject with error if location is empty', function(done) {
        const user = new User(userObj);
        var event = new Event(_.omit(Object.assign(eventObj, { user: user._id }), 'location'));
 
        event.validate(function(err) {
            expect(err.errors.user).to.not.exist;
            expect(err.errors.details).to.not.exist;
            expect(err.errors['location.type']).to.exist;
            expect(err.errors['location.coordinates']).to.exist;
            expect(err.errors.from).to.not.exist;
            expect(err.errors.to).to.not.exist;
            expect(err.errors.title).to.not.exist;
            expect(err.errors.address).to.not.exist;
            done();
        });
    });

    it('should reject with error if from is empty', function(done) {
        const user = new User(userObj);
        var event = new Event(_.omit(Object.assign(eventObj, { user: user._id }), 'from'));
 
        event.validate(function(err) {
            expect(err.errors.user).to.not.exist;
            expect(err.errors.details).to.not.exist;
            expect(err.errors['location.type']).to.not.exist;
            expect(err.errors['location.coordinates']).to.not.exist;
            expect(err.errors.to).to.not.exist;
            expect(err.errors.title).to.not.exist;
            expect(err.errors.address).to.not.exist;
            expect(err.errors.from).to.exist;
            done();
        });
    });

    it('should reject with error if to is empty', function(done) {
        const user = new User(userObj);
        var event = new Event(_.omit(Object.assign(eventObj, { user: user._id }), 'to'));
 
        event.validate(function(err) {
            expect(err.errors.user).to.not.exist;
            expect(err.errors.details).to.not.exist;
            expect(err.errors['location.type']).to.not.exist;
            expect(err.errors['location.coordinates']).to.not.exist;
            expect(err.errors.from).to.not.exist;
            expect(err.errors.title).to.not.exist;
            expect(err.errors.address).to.not.exist;
            expect(err.errors.to).to.exist;
            done();
        });
    });

    it('should validate event successfully', function(done) {
        const user = new User(userObj);
        var event = new Event(Object.assign(eventObj, { user: user._id }));
 
        event.validate(function(err) {
            expect(err).to.be.a('null')
            done();
        });
    });
});