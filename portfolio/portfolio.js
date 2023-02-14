const fs = require('fs')
const { WebsiteButton, GitHubButton} = require("../SVGComponents")

const attachPortfolio = (app) => {

    let database = JSON.parse(fs.readFileSync("./portfoliodb.json", 'utf-8'))
    app.get("/portfolio", (req,res) => {
        if(req.query.page != undefined && Object.keys(database).includes(req.query.page)) {
            let template = fs.readFileSync("./portfolio/template.html", 'utf-8')
            template = template.replaceAll("[{Project Title}]", database[req.query.page].title)
            template = template.replace("[{Project Image}]", database[req.query.page].coverImage)
            template = template.replace("[{Project Icon}]", database[req.query.page].icon)
            template = template.replace("[{Project QuickSummary}]", database[req.query.page].quickSummary)
            template = template.replace("[{Project Links}]", WebsiteButton(database[req.query.page].links.website) + GitHubButton(database[req.query.page].links.github))
            res.send(template)
        } else {  
            res.sendFile(__dirname + "/home.html")
        }
    })
}

module.exports = {
    attachPortfolio:attachPortfolio
}