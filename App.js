const express = require('express')
const app = express();

app.use(express.static(__dirname +"/static"))


app.listen(3300, () => {
    console.log("running server")
})