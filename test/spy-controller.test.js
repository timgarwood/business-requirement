const controller = require('../controllers/spy-controller.js');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

testInvalidEmail = (emailAddress) => {
    let db = {
        createUser: sinon.spy(),
        maxNameLength: 30,
        maxEmailLength: 100
    };

    let request = {
        body: {
            name: 'tim',
            emailAddress: emailAddress,
            age: 35,
            photo: 'base64encodedphoto'
        }
    };

    let response = {
        sendStatus: sinon.spy()
    };

    controller.createNewUser(db, request, response);

    expect(db.createUser.calledOnce).to.be.false;
    expect(response.sendStatus.calledOnce).to.be.true;
    expect(response.sendStatus.firstCall.args[0]).to.be.equal(400);
}

describe('Spy Controller Tests', () => {
    it('should create user and return 200 on POST', () => {
        let db = {
            createUser: sinon.spy()
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'email@email.com',
                age: 35,
                photo: 'base64encodedphoto'
            }
        };

        let response = {
            sendStatus: sinon.spy()
        };

        controller.createNewUser(db, request, response);

        expect(db.createUser.calledOnce).to.be.true;
        expect(response.sendStatus.calledOnce).to.be.false;

        //invoke the database callback
        db.createUser.firstCall.args[4](null);

        expect(response.sendStatus.calledOnce).to.be.true;
        expect(response.sendStatus.firstCall.args[0]).to.be.equal(200);
    });

    it('should return users on GET', () => {
        const db = {
            getAllUsers: sinon.spy()
        };

        const request = {};

        let response = {
            json: sinon.spy(),
            sendStatus: sinon.spy()
        };

        controller.getAllUsers(db, request, response);

        expect(db.getAllUsers.calledOnce).to.be.true;
        expect(response.sendStatus.calledOnce).to.be.false;
        expect(response.json.calledOnce).to.be.false;

        const users = [
            {
                name: 'user1',
                emailAddress: 'user1@email.com',
                age: 24,
                photo: "base64encodedimage"
            },
            {
                name: 'user2',
                emailAddress: 'user2@email.com',
                age: 22,
                photo: "base64encodedimage"
            }
        ]

        //invoke the database callback
        db.getAllUsers.firstCall.args[0](null, users);

        expect(response.json.calledOnce).to.be.true;

        let responseArgs = response.json.firstCall.args[0];
        expect(responseArgs.rows[0].name).to.be.equal('user1');
        expect(responseArgs.rows[0].emailAddress).to.be.equal('user1@email.com');
        expect(responseArgs.rows[0].age).to.be.equal(24);
        expect(responseArgs.rows[1].name).to.be.equal('user2');
        expect(responseArgs.rows[1].emailAddress).to.be.equal('user2@email.com');
        expect(responseArgs.rows[1].age).to.be.equal(22);
    });

    it('should return 400 when email is invalid', () => {
        testInvalidEmail('invalidemail');
        testInvalidEmail('email-@email.com');
        testInvalidEmail(',@email.com');
        testInvalidEmail('email@com');
        testInvalidEmail('  @email.com');
        testInvalidEmail('tim,@email.com');
    });

    it('should return 400 when name is too long', () => {
        let db = {
            createUser: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 100
        };

        let request = {
            body: {
                name: 'name_should_not_exceed_30characters_but_this_exceeds_30characters',
                emailAddress: 'email@email.com',
                age: 35,
                photo: 'base64encodedphoto'
            }
        };

        let response = {
            sendStatus: sinon.spy()
        };

        controller.createNewUser(db, request, response);

        expect(db.createUser.calledOnce).to.be.false;
        expect(response.sendStatus.calledOnce).to.be.true;
        expect(response.sendStatus.firstCall.args[0]).to.be.equal(400);

    });

    it('should return 400 when email is too long', () => {
        let db = {
            createUser: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 30
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'name_should_not_exceed_30characters_but_this_exceeds_30characters@email.com',
                age: 35,
                photo: 'base64encodedphoto'
            }
        };

        let response = {
            sendStatus: sinon.spy()
        };

        controller.createNewUser(db, request, response);

        expect(db.createUser.calledOnce).to.be.false;
        expect(response.sendStatus.calledOnce).to.be.true;
        expect(response.sendStatus.firstCall.args[0]).to.be.equal(400);

    });

    it('should return 500 on POST error', () => {
        let db = {
            createUser: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 30
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'email@email.com',
                age: 35,
                photo: 'base64encodedphoto'
            }
        };

        let response = {
            sendStatus: sinon.spy()
        };

        controller.createNewUser(db, request, response);
        expect(db.createUser.calledOnce).to.be.true;
        expect(response.sendStatus.calledOnce).to.be.false;

        db.createUser.firstCall.args[4]({
            err: 'something bad happened'
        });

        expect(response.sendStatus.calledOnce).to.be.true;
        expect(response.sendStatus.firstCall.args[0]).to.be.equal(500);
    });

    it('should return 500 on GET error', () => {
        const db = {
            getAllUsers: sinon.spy()
        };

        const request = {};

        let response = {
            json: sinon.spy(),
            sendStatus: sinon.spy()
        };

        controller.getAllUsers(db, request, response);

        expect(db.getAllUsers.calledOnce).to.be.true;
        expect(response.sendStatus.calledOnce).to.be.false;
        expect(response.json.calledOnce).to.be.false;

        //invoke the database callback
        db.getAllUsers.firstCall.args[0]({ err: 'something bad happened' }, null);

        expect(response.json.calledOnce).to.be.false;
        expect(response.sendStatus.calledOnce).to.be.true;
        expect(response.sendStatus.firstCall.args[0]).to.be.equal(500);
    });
});