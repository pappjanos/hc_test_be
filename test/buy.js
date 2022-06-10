const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app')

//Assertion style
chai.should();

chai.use(chaiHttp);

describe('/v1/buy api in case of buyer account, buy not happens negative tests', () => {
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

  describe("POST /v1/buy", () => {
    it("Buy shall not happen as user is not authorized", (done) => {
      chai.request(server)
        .post("/v1/buy")
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.be.have.property('message');
          res.body.message.should.be.eq("User is not authorized")
          done();
        })
    })
  })

  describe("POST /v1/buy", () => {
    const params = [
      {},
      { id: 1 },
      { amount: 5 }
    ]
    params.forEach((param) => {
      it("Buy shall not happen with missing or improper parameters", (done) => {
        chai.request(server)
          .post("/v1/buy")
          .set('Authorization', 'Bearer ' + sessionToken)
          .send(param)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.be.have.property('message');
            res.body.message.should.be.eq("Product properties missing")
            done();
          })
      })
    })
  })
})


describe('/v1/buy api in case of seller account buy not happens because of improper privileges', () => {
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

  describe("POST /v1/buy", () => {
    it("Buy shall not happen as user is not privileged", (done) => {
      chai.request(server)
        .post("/v1/buy")
        .set('Authorization', 'Bearer ' + sessionToken)
        .send({id: 1, amount: 5})
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



describe('/v1/buy api in case of buyer account, buy happens positive tests', () => {
  let sessionToken = ''
  let testProductId = 0
  const product = {
    amountAvailable: 1,
    productName: "TestProduct1",
    cost: 20
  }
  before((done) => {
    //login with seller account
    let user = {
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

  describe("POST /v1/product", () => {
    it("Product shall be added for testing", (done) => {
      // add a product for testing
      chai.request(server)
        .post("/v1/product")
        .send(product)
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.message.should.be.eq("Product added succesfully!")
          res.body.product.productName.should.be.eq("TestProduct1")
          testProductId = res.body.product.id
          done();
        })
    })
  })

  describe("POST /v1/auth/login", () => {
    it("Login with buyer account", (done) => {
      const user = {
        email: "qwer@qwer.at",
        password: "qwerqwer"
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

  describe("POST /v1/buy", () => {
    it("Buy Testproduct is unsuccesfull, because of insufficient funds", (done) => {
      chai.request(server)
        .post("/v1/buy")
        .send({
          id: testProductId,
          amount: 1
        })
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.message.should.be.eq("Insufficient funds")
          done();
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

  describe("POST /v1/buy", () => {
    it("Try to buy a not presen product", (done) => {
      chai.request(server)
        .post("/v1/buy")
        .send({
          id: 9999,
          amount: 1
        })
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(404)
          res.body.message.should.be.eq("Product is missing")
          done();
        })
    })
  })


  describe("POST /v1/buy", () => {
    it("Buy Testproduct is succesfull", (done) => {
      chai.request(server)
        .post("/v1/buy")
        .send({
          id: testProductId,
          amount:1
        })
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.productName.should.be.eq(product.productName)
          res.body.currentCheckout.should.be.eq(product.cost)
          done();
        })
    })
  })

  describe("POST /v1/buy", () => {
    it("Buy Testproduct is unsuccesfull, because there is not enough products", (done) => {
      chai.request(server)
        .post("/v1/buy")
        .send({
          id: testProductId,
          amount: 1
        })
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(400)
          res.body.message.should.be.eq("Not enough products")
          done();
        })
    })
  })



  describe("POST /v1/auth/login", () => {
    it("Login with seller account", (done) => {
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



  describe("DELETE /v1/product/:id", () => {
    it("Test product shall be deleted", (done) => {      
      chai.request(server)
        .delete("/v1/product/"+testProductId)        
        .set('Authorization', 'Bearer ' + sessionToken)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.message.should.be.eq("Product entry deleted succesfully!")
          done();
        })
    })
  })

})