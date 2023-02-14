const express = require('express')
const app = express();
const { attachPortfolio } = require('./portfolio/portfolio')

app.use(express.static(__dirname +"/static"))
attachPortfolio(app);

app.listen(3300, () => {
    console.log("running server")
})