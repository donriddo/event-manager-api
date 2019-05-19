const expect = require('chai').expect;
const _ = require('lodash');

const User = require('../model');

const userObj = {
    email: "dummy@user.com",
    password: "dummy",
    firstName: "Dummy",
    lastName: "User",
};
 
describe('user', function() {
    it('should reject with error if body is empty', function(done) {
        var user = new User();
 
        user.validate(function(err) {
            expect(err.errors.email).to.exist;
            expect(err.errors.password).to.exist;
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.exist;
            done();
        });
    });

    it('should reject with error if firstName is empty', function(done) {
        var user = new User(_.omit(userObj, 'firstName'));
 
        user.validate(function(err) {
            expect(err.errors.firstName).to.exist;
            expect(err.errors.lastName).to.not.exist;
            expect(err.errors.email).to.not.exist;
            expect(err.errors.password).to.not.exist;
            done();
        });
    });

    it('should reject with error if firstName is empty', function(done) {
        var user = new User(_.omit(userObj, 'lastName'));
 
        user.validate(function(err) {
            expect(err.errors.lastName).to.exist;
            expect(err.errors.firstName).to.not.exist;
            expect(err.errors.email).to.not.exist;
            expect(err.errors.password).to.not.exist;
            done();
        });
    });

    it('should reject with error if email is empty', function(done) {
        var user = new User(_.omit(userObj, 'email'));
 
        user.validate(function(err) {
            expect(err.errors.email).to.exist;
            expect(err.errors.firstName).to.not.exist;
            expect(err.errors.lastName).to.not.exist;
            expect(err.errors.password).to.not.exist;
            done();
        });
    });

    it('should reject with error if password is empty', function(done) {
        var user = new User(_.omit(userObj, 'password'));
 
        user.validate(function(err) {
            expect(err.errors.email).to.not.exist;
            expect(err.errors.firstName).to.not.exist;
            expect(err.errors.lastName).to.not.exist;
            expect(err.errors.password).to.exist;
            done();
        });
    });

    it('should validate user successfully', function(done) {
        var user = new User(userObj);
 
        user.validate(function(err) {
            expect(err).to.be.a('null')
            done();
        });
    });
});