const expect = require('chai').expect;
const _ = require('lodash');

const User = require('../../user/model');
const Picture = require('../model');

const userObj = {
    email: "dummy@user.com",
    password: "dummy",
    name: "Dummy User",
};

const pictureObj = {
    url: 'dummy url'
}
 
describe('picture', function() {
    it('should reject with error if body is empty', function(done) {
        var picture = new Picture();
 
        picture.validate(function(err) {
            expect(err.errors.url).to.exist;
            expect(err.errors.user).to.exist;
            done();
        });
    });

    it('should reject with error if user is empty', function(done) {
        var picture = new Picture(pictureObj);
 
        picture.validate(function(err) {
            expect(err.errors.url).to.not.exist;
            expect(err.errors.user).to.exist;
            done();
        });
    });

    it('should reject with error if url is empty', function(done) {
        const user = new User(userObj);
        var picture = new Picture(_.omit(Object.assign(pictureObj, { user: user._id }), 'url'));
 
        picture.validate(function(err) {
            expect(err.errors.user).to.not.exist;
            expect(err.errors.url).to.exist;
            done();
        });
    });

    it('should validate picture successfully', function(done) {
        const user = new User(userObj);
        var picture = new Picture(Object.assign(pictureObj, { user: user._id }));
 
        picture.validate(function(err) {
            expect(err).to.be.a('null')
            done();
        });
    });
});