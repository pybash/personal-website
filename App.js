const express = require('express')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json())
const { attachPortfolio } = require('./portfolio/portfolio');
const { attachClassic } = require('./classic_joke/attachclassic');

app.use(express.static(__dirname +"/static"))
attachPortfolio(app);
attachClassic(app);

app.listen(3300, () => {
    console.log("running server")
})