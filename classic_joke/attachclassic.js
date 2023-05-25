const fs = require('fs')
let possibleViewActions = ["textbio"]


const linkConstructor = (url,name) => {
    return ("<tr><td class=\"icon\"><img src=\"../classic_joke/link.png\" /></td><td><a href=\""+url+"\">"+name+"</a></td><td>-</td></tr>")
}

const attachClassic = (app) => {
    let database = JSON.parse(fs.readFileSync("./portfoliodb.json", 'utf-8'))

    app.get("/classic/chat", (req,res) => {
        res.sendFile(__dirname + "/chat/login.html")
    })
    app.post("/classic/chat/account/auth", (req,res) => {
        console.log(req.body)
        res.send("lol")
    })
    app.get("/classic", (req,res) => {
        res.sendFile(__dirname + "/index.html")
    })
    
    app.get("/classic/projects", (req,res) => {
        let file = fs.readFileSync(__dirname + "/projects.html", 'utf-8')
        res.send(file)
    })
    app.get("/classic/portfolio", (req,res) => {
        if(req.query.page != undefined && Object.keys(database).includes(req.query.page)) {
            let template = fs.readFileSync(__dirname + "/template.html", 'utf-8')
            template = template.replaceAll("[{classicname}]", database[req.query.page].classicname)
            links = database[req.query.page].links;
            if(Object.keys(links).length != 0) {
                let linkString = ""

                for(let a = 0; a < Object.keys(links).length; a++) {
                    linkString = linkString + linkConstructor(links[Object.keys(links)[a]], Object.keys(links)[a])
                }
                template = template.replace("[{extraLinks}]", linkString)
            } else {
                template.replace("[{extraLinks}]", "")
            }
            template = template.replace("[{portfolioPage}]", req.query.page)
            if(req.query.view != undefined && possibleViewActions.includes(req.query.view)) {
                if(req.query.view == "textbio") {
                    res.send(database[req.query.page].description)
                } else {
                    res.send(template)
                }
            } else {
                res.send(template)
            }
        } else {
            res.sendFile(__dirname + "/projects.html")
        }
    })
}
module.exports = {attachClassic: attachClassic}