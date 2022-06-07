// generic handler
const failSafeHandler = (error, req, res, next) => {
  res.status(500).send(error)
}

module.exports = {
  failSafeHandler,
};