const controller = require('../controllers/spy-controller.js');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

testInvalidEmail = (emailAddress) => {
    let db = {
        createSpy: sinon.spy(),
        maxNameLength: 30,
        maxEmailLength: 100
    };

    let request = {
        body: {
            name: 'tim',
            emailAddress: emailAddress,
            age: 35
        },
        files: {
            file: {
            }
        }
    };

    let response = {
        status: (code) => { },
        send: (data) => { }
    };

    let stub = sinon.stub(response);
    stub.status.returns(stub);

    controller.createNewSpy(db, request, stub);

    expect(db.createSpy.calledOnce).to.be.false;
    expect(stub.status.calledOnce).to.be.true;
    expect(stub.send.calledOnce).to.be.true;
    expect(stub.status.firstCall.args[0]).to.be.equal(400);
    expect(stub.send.firstCall.args[0].err).to.be.equal('Invalid email address');
}

describe('Spy Controller Tests', () => {
    it('should create spy and return 200 on POST', () => {
        let db = {
            createSpy: sinon.spy()
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'email@email.com',
                age: 35
            },
            files: {
                file: {
                    mv: sinon.spy()
                }
            }
        };

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let stub = sinon.stub(response);
        stub.status.returns(stub);

        controller.createNewSpy(db, request, stub);

        expect(db.createSpy.calledOnce).to.be.false;
        expect(stub.status.calledOnce).to.be.false;

        request.files.file.mv.firstCall.args[1](null);

        expect(db.createSpy.calledOnce).to.be.true;
        expect(stub.status.calledOnce).to.be.false;

        //invoke the database callback
        db.createSpy.firstCall.args[4](null);

        expect(stub.status.calledOnce).to.be.true;
        expect(stub.status.firstCall.args[0]).to.be.equal(200);
    });

    it('should return spies on GET', () => {
        const db = {
            getAllSpies: sinon.spy()
        };

        const request = {};

        let response = {
            send: sinon.spy(),
            status: sinon.spy()
        };

        controller.getAllSpies(db, response);

        expect(db.getAllSpies.calledOnce).to.be.true;
        expect(response.status.calledOnce).to.be.false;
        expect(response.send.calledOnce).to.be.false;

        const spies = [
            {
                name: 'user1',
                emailAddress: 'user1@email.com',
                age: 24
            },
            {
                name: 'user2',
                emailAddress: 'user2@email.com',
                age: 22
            }
        ]

        //invoke the database callback
        db.getAllSpies.firstCall.args[0](null, spies);

        expect(response.send.calledOnce).to.be.true;

        let responseArgs = response.send.firstCall.args[0];
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
            createSpy: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 100
        };

        let request = {
            body: {
                name: 'name_should_not_exceed_30characters_but_this_exceeds_30characters',
                emailAddress: 'email@email.com',
                age: 35
            }
        };

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let stub = sinon.stub(response);
        stub.status.returns(stub);

        controller.createNewSpy(db, request, stub);

        expect(db.createSpy.calledOnce).to.be.false;
        expect(stub.status.calledOnce).to.be.true;
        expect(stub.status.firstCall.args[0]).to.be.equal(400);
        expect(stub.send.firstCall.args[0].err).to.be.equal('Name cannot exceed 30 characters');

    });

    it('should return 400 when email is too long', () => {
        let db = {
            createSpy: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 30
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'name_should_not_exceed_30characters_but_this_exceeds_30characters@email.com',
                age: 35
            }
        };

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let stub = sinon.stub(response);
        stub.status.returns(stub);

        controller.createNewSpy(db, request, stub);

        expect(db.createSpy.calledOnce).to.be.false;
        expect(stub.status.calledOnce).to.be.true;
        expect(stub.send.calledOnce).to.be.true;
        expect(stub.status.firstCall.args[0]).to.be.equal(400);
        expect(stub.send.firstCall.args[0].err).to.be.equal('Email cannot exceed 30 characters');
    });

    it('should return 500 on POST error', () => {
        let db = {
            createSpy: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 30
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'email@email.com',
                age: 35
            },
            files: {
                file: {
                    mv: sinon.spy()
                }
            }
        };

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let responseStub = sinon.stub(response);
        responseStub.status.returns(responseStub);

        controller.createNewSpy(db, request, responseStub);
        expect(db.createSpy.calledOnce).to.be.false;
        expect(responseStub.status.calledOnce).to.be.false;

        request.files.file.mv.firstCall.args[1](null);

        expect(db.createSpy.calledOnce).to.be.true;
        expect(responseStub.status.calledOnce).to.be.false;

        db.createSpy.firstCall.args[4]({
            err: 'something bad happened'
        });

        expect(responseStub.status.calledOnce).to.be.true;
        expect(responseStub.send.calledOnce).to.be.true;
        expect(responseStub.status.firstCall.args[0]).to.be.equal(500);
        expect(responseStub.send.firstCall.args[0].err).to.be.equal('An error occurred during sign up');
    });

    it('should return 500 when photo cannot be saved', () => {
        let db = {
            createSpy: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 30
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'email@email.com',
                age: 35
            },
            files: {
                file: {
                    mv: sinon.spy()
                }
            }
        }

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let stub = sinon.stub(response);
        stub.status.returns(stub);

        controller.createNewSpy(db, request, stub);

        expect(stub.status.calledOnce).to.be.false;
        expect(stub.send.calledOnce).to.be.false;

        request.files.file.mv.firstCall.args[1]({ err: 'could not save to disk' });

        expect(stub.status.calledOnce).to.be.true;
        expect(stub.send.calledOnce).to.be.true;
        expect(stub.status.firstCall.args[0]).to.be.equal(500);
        expect(stub.send.firstCall.args[0].err).to.be.equal('An error occurred while saving your photo');
    });

    it('should return 400 when age is NaN', () => {
        let db = {
            createSpy: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 30
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'email@email.com',
                age: "abcd"
            }
        }

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let stub = sinon.stub(response);
        stub.status.returns(stub);

        controller.createNewSpy(db, request, stub);

        expect(stub.status.calledOnce).to.be.true;
        expect(stub.send.calledOnce).to.be.true;

        expect(stub.status.firstCall.args[0]).to.be.equal(400);
        expect(stub.send.firstCall.args[0].err).to.be.equal('Invalid age');

    });

    it('should return 400 when age is under the minimum', () => {
        let db = {
            createSpy: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 30,
            minAge: 18
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'email@email.com',
                age: 17
            }
        }

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let stub = sinon.stub(response);
        stub.status.returns(stub);

        controller.createNewSpy(db, request, stub);

        expect(stub.status.calledOnce).to.be.true;
        expect(stub.send.calledOnce).to.be.true;

        expect(stub.status.firstCall.args[0]).to.be.equal(400);
        expect(stub.send.firstCall.args[0].err).to.be.equal('Must be at least 18 years old');
    });

    it('should return 400 when photo is missing', () => {
        let db = {
            createSpy: sinon.spy(),
            maxNameLength: 30,
            maxEmailLength: 30,
            minAge: 18
        };

        let request = {
            body: {
                name: 'tim',
                emailAddress: 'email@email.com',
                age: 35
            }
        }

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let stub = sinon.stub(response);
        stub.status.returns(stub);

        controller.createNewSpy(db, request, stub);

        expect(stub.status.calledOnce).to.be.true;
        expect(stub.send.calledOnce).to.be.true;

        expect(stub.status.firstCall.args[0]).to.be.equal(400);
        expect(stub.send.firstCall.args[0].err).to.be.equal('A photo is required');
    });


    it('should return 500 on GET error', () => {
        const db = {
            getAllSpies: sinon.spy()
        };

        const request = {};

        let response = {
            status: (code) => { },
            send: (data) => { }
        };

        let stub = sinon.stub(response);
        stub.status.returns(stub);

        controller.getAllSpies(db, stub);

        expect(db.getAllSpies.calledOnce).to.be.true;
        expect(stub.status.calledOnce).to.be.false;
        expect(stub.send.calledOnce).to.be.false;

        //invoke the database callback
        db.getAllSpies.firstCall.args[0]({ err: 'something bad happened' }, null);

        expect(stub.status.calledOnce).to.be.true;
        expect(stub.send.calledOnce).to.be.true;
        expect(stub.status.firstCall.args[0]).to.be.equal(500);
        expect(stub.send.firstCall.args[0].err).to.be.equal('An error occurred retrieving the spies');
    });
});