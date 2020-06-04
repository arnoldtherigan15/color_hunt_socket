const app = require('../app')
const http = require("http").createServer(app)
app.io.attach(http);

const PORT = process.env.PORT || 3000

http.listen(PORT, function(){
  console.log("server is running on PORT " + PORT)
})

module.exports = http