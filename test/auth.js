const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')

//Assertion style
chai.should();

chai.use(chaiHttp);

let sessionToken = ''

describe('auth/login api', () => {

  describe("POST /v1/auth/login", () => {
    it("It should retrieve auth token", (done) => {
      const user = {
        email: "asdf@asdf.at",
        password: "asdfasdf"
      }
      chai.request(server)
        .post("/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.should.be.have.property('token');
          res.body.message.should.be.eq("Login succesfull")
          sessionToken = res.body.token
          done();
        })
    })
  })

  describe("POST /v1/auth/login", () => {
    it("It should not retrieve auth token with not registered account", (done) => {
      const user = {
        email: "asdf@yxcv.at",
        password: "asdfasdf"
      }
      chai.request(server)
        .post("/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.should.be.have.property('msg_id');
          res.body.should.not.have.property('token');
          res.body.message.should.be.eq("Not registered")
          done();
        })
    })
  })

  describe("POST /v1/auth/login", () => {
    it("Missing credentials in login request", (done) => {
      const user = {
      }
      chai.request(server)
        .post("/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.should.be.have.property('msg_id');
          res.body.should.not.have.property('token');
          res.body.message.should.be.eq("Bad request")
          done();
        })
    })
  })

  describe("POST /v1/auth/login", () => {
    it("Password does not match", (done) => {
      const user = {
        email: "asdf@asdf.at",
        password: "yxcvyxcv"
      }
      chai.request(server)
        .post("/v1/auth/login")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.should.be.have.property('msg_id');
          res.body.should.not.have.property('token');
          res.body.message.should.be.eq("Password does not match")
          done();
        })
    })
  })
})




describe('auth/register api', () => {

  describe("POST /v1/auth/register", () => {
    it("It should not retrieve user info as user is already registered", (done) => {
      const user = {
        email: "asdf@asdf.at",
        password: "asdfasdf",
        role: "seller"
      }
      chai.request(server)
        .post("/v1/auth/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.should.not.have.property('user');
          res.body.message.should.be.eq("Already registered")
          done();
        })
    })
  })

  describe("POST /v1/auth/register", () => {
    it("It should not retrieve user info as email is missing", (done) => {
      const user = {
        password: "asdfasdf",
        role: "seller"
      }
      chai.request(server)
        .post("/v1/auth/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.should.not.have.property('user');
          res.body.message.should.be.eq("Bad request")
          done();
        })
    })
  })

  describe("POST /v1/auth/register", () => {
    it("It should not retrieve user info as password is missing", (done) => {
      const user = {
        email: "asdf@asdf.at",
        role: "seller"
      }
      chai.request(server)
        .post("/v1/auth/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.should.not.have.property('user');
          res.body.message.should.be.eq("Bad request")
          done();
        })
    })
  })

  describe("POST /v1/auth/register", () => {
    it("It should not retrieve user info as role is missing", (done) => {
      const user = {
        email: "asdf@asdf.at",
        password: "asdfasdf"
      }
      chai.request(server)
        .post("/v1/auth/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.should.not.have.property('user');
          res.body.message.should.be.eq("Bad request")
          done();
        })
    })
  })
})