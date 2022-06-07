function errorHandler (error, req, res, next) {
  switch (error.type) {
    case '':
      
      break;
  
    default:
      next(error) // forwarding exceptional case to fail-safe middleware
      break;
  }
}
// function errorResponder(error, req, res, next) { // responding to client
//   if (error.type == 'redirect')
//       res.redirect('/error')
//   else if (error.type == 'time-out') // arbitrary condition check
//       res.status(408).send(error)
//   else
//       next(error) // forwarding exceptional case to fail-safe middleware
// }

module.exports = {
  errorHandler,
};