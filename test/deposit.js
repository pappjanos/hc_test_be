const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')

//Assertion style
chai.should();

chai.use(chaiHttp);

describe('/v1/deposit api in case of buyer account', () => {
  let sessionToken = ''
  
  before((done) => {
    //login with buyer account
    const user = {
      email: "qwer@qwer.at",
      password: "qwerqwer"
    }
    chai.request(server)
      .post("/v1/auth/login")
      .send(user)
      .end((err, res) => {
        sessionToken = res.body.token
        done();
      })
  })

  describe("GET /v1/deposit", () => {
    it("It shall not return the deposit as user is not authorized", (done) => {
      chai.request(server)
        .get("/v1/deposit")
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("User is not authorized")          
          done();
        })
      })
    })
    
    describe("DELETE /v1/deposit/reset", () => {
      it("It shall reset the deposit to zero", (done) => {
        chai.request(server)
        .delete("/v1/deposit/reset")
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("Deposit reseted succesfully!")     
          res.body.currentDeposit.should.be.eq(0)     
          done();
        })
      })
    })
    
    describe("GET /v1/deposit", () => {
      it("It shall return the amount of current deposit, which shall be 0 after reset", (done) => {
        chai.request(server)
        .get("/v1/deposit")
        .set('Authorization','Bearer '+sessionToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.have.property('deposit');
          res.body.deposit.should.be.eq(0)     
          done();
        })
    })
  })

  //improper paraameter testing
  describe("POST /v1/deposit", () => {
    it("It shall NOT add 20 to the current deposit, because of missing parameter", (done) => {
      chai.request(server)
        .post("/v1/deposit")
        .send({})
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("Deposit shall be 5, 10, 20, 50 or 100")
          done();
        })
    })
  })  

  describe("POST /v1/deposit", () => {
    const improperParameters = [0, 4, 6, 9, 11, 19, 21, 49, 51, 99, 65, 43]
    improperParameters.forEach((params) => {
      it("It shall NOT add 20 to the current deposit, because of improper parameter", (done) => {
        chai.request(server)
          .post("/v1/deposit")
          .send({ deposit: params})
          .set('Authorization', 'Bearer ' + sessionToken)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.be.have.property('message');
            res.body.message.should.be.eq("Deposit shall be 5, 10, 20, 50 or 100")
            done();
          })
      })
    })
  })   

  describe("POST /v1/deposit", () => {
    it("It shall add 20 to the current deposit, 0 was previously returned", (done) => {
      chai.request(server)
        .post("/v1/deposit")
        .send({ deposit: 20 })
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("Deposit updated succesfully!")  
          res.body.should.be.have.property('deposit');
          res.body.deposit.should.be.eq(20)
          done();
        })
    })
  })

  describe("GET /v1/deposit", () => {
    it("It shall return the amount of current deposit, which shall be 20 after performing deposit before", (done) => {
      chai.request(server)
        .get("/v1/deposit")
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.have.property('deposit');
          res.body.deposit.should.be.eq(20)
          done();
        })
    })
  })

  describe("DELETE /v1/deposit/reset", () => {
    it("It shall reset the deposit to zero", (done) => {
      chai.request(server)
        .delete("/v1/deposit/reset")
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("Deposit reseted succesfully!")
          res.body.currentDeposit.should.be.eq(0)
          res.body.changeAmount.should.be.eq(20)
          res.body.changeCoins.should.be.a('array')
          done();
        })
    })
  })  

  describe("GET /v1/deposit", () => {
    it("It shall return the amount of current deposit, which shall be 0 after reset", (done) => {
      chai.request(server)
        .get("/v1/deposit")
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.be.have.property('deposit');
          res.body.deposit.should.be.eq(0)
          done();
        })
    })
  })
})


describe('/v1/deposit api in case of seller account', () => {
  let sessionToken = ''

  before((done) => {
    //login with seller account
    const user = {
      email: "asdf@asdf.at",
      password: "asdfasdf"
    }
    chai.request(server)
      .post("/v1/auth/login")
      .send(user)
      .end((err, res) => {
        sessionToken = res.body.token
        done();
      })
  })

  describe("GET /v1/deposit", () => {
    it("It shall not return the deposit as user is not authorized", (done) => {
      chai.request(server)
        .get("/v1/deposit")
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("User is not authorized")
          done();
        })
    })
  })

  describe("GET /v1/deposit", () => {
    it("It shall not return the amount of current deposit with seller account", (done) => {
      chai.request(server)
        .get("/v1/deposit")
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("User does not have the right privilige")
          done();
        })
    })
  })

  describe("DELETE /v1/deposit/reset", () => {
    it("It shall NOT reset the deposit with seller account", (done) => {
      chai.request(server)
        .delete("/v1/deposit/reset")
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("User does not have the right privilige")
          done();
        })
    })
  })
  
  describe("POST /v1/deposit", () => {
    it("It shall NOT add 20 to the current deposit with seller account", (done) => {
      chai.request(server)
        .post("/v1/deposit")
        .send({ deposit: 20 })
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("User does not have the right privilige")
          done();
        })
    })
  })

})