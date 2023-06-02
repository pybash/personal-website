const fs = require('fs')
let possibleViewActions = ["textbio"]
const sha256 = require('sha256')



const randomtoken = () => {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

const linkConstructor = (url,name) => {
    return ("<tr><td class=\"icon\"><img src=\"../classic_joke/link.png\" /></td><td><a href=\""+url+"\">"+name+"</a></td><td>-</td></tr>")
}

const userConstruct = (username,password) => {
    let salt = Math.random().toString(36);
    let passHash = Buffer.from(sha256(password + salt)).toString('base64')
    return {
        "access": ["global"],
        "list": {
            "buddies": [],
            "family": [],
            "coworkers": []
        },
        "salt": salt,
        "passHash": passHash
    }
}

const hashFunc = (inp) => {
    return Buffer.from(sha256(inp)).toString('base64')
}

const connectedUsers = {}

const attachClassic = (app) => {
    let database = JSON.parse(fs.readFileSync("./portfoliodb.json", 'utf-8'))
    let chatdb = JSON.parse(fs.readFileSync("./classic_joke/chatdb.json", 'utf-8'))

    const writetoDb = () => {
        fs.writeFileSync("./classic_Joke/chatdb.json", JSON.stringify(chatdb, null, 4))
    }

    app.ws("/chatws", (ws,req) => {
        let authToken = ""
        let uCID = randomtoken()
        connectedUsers[uCID] = ws;
        console.log("User connected, assigned: " + uCID)
        ws.on('close', () => {
            console.log("User disconnected, had: " + uCID)
            delete connectedUsers[uCID]
        })
        
        ws.on('message', (msg) => {
            // {
            //     "type": "auth",
            //     "content": ""
            // }
            let body = JSON.parse(msg);
            
            if(authToken == "") {
                if(body.type == "auth") {
                    if(Object.keys(chatdb.authTokens).includes(body.content)) {
                        authToken = body.content;
                        console.log("USER " + chatdb.authTokens[authToken] + " has logged in with uCID of " + uCID)
                        ws.send(JSON.stringify({
                            "type": "auth-update",
                            "content": "AUTHORIZED"
                        }))
                    } else {
                        ws.send(JSON.stringify({
                            "type": "auth-update",
                            "content": "INVALID"
                        }))
                    }
                } else {
                    ws.send(JSON.stringify({
                        "type": "auth-update",
                        "content": "UNAUTHORIZED"
                    }))
                }
            } else {
                if(body.type == "listfetch") {
                    ws.send(JSON.stringify({
                        "type": "inital-list-fetch",
                        "content": {
                            chatrooms: chatdb.users[chatdb.authTokens[authToken]].access,
                            list: chatdb.users[chatdb.authTokens[authToken]].list}
                    }))
                }
            }
        })
    })

    app.get("/classic/chat", (req,res) => {
        res.sendFile(__dirname + "/chat/login.html")
    })
    app.post("/classic/chat/account/auth", (req,res) => {
        let body = req.body

        if(Object.keys(chatdb.users).includes(body.user.toLowerCase())) {
            if(hashFunc(body.password + chatdb.users[body.user.toLowerCase()].salt) == chatdb.users[body.user].passHash) {
                let authToken = randomtoken();
                chatdb.authTokens[authToken] = body.user.toLowerCase()
                writetoDb()
                res.send({
                    status:200,
                    token: authToken
                })
            } else {
                res.send({status:400, error: "INVALID_USER_OR_PASS"})
            }
        } else {
            res.send({
                status: 400,
                error: "INVALID_USER_OR_PASS"
            })
        }
    })
    app.post("/classic/chat/account/create", (req,res) => {
        if(Object.keys(chatdb.users).includes(req.body.user)) {
            res.send({
                status:400,
                error: "NAME_TAKEN"
            })
        } else {
            chatdb.users[req.body.user.toLowerCase()] = userConstruct(req.body.user, req.body.password)
            writetoDb()
            res.send({
                status:200
            })
        }
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