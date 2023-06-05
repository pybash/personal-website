const websocket = new WebSocket("ws://localhost:8080/chatws", 'echo-protocol')

document.addEventListener("DOMContentLoaded", () => {

    // !! https://www.w3schools.com/howto/howto_js_draggable.asp
    // Make the DIV element draggable:
    dragElement(document.getElementById("signonWindow"));
    dragElement(document.getElementById("buddyListWindow"));
    dragElement(document.getElementById("getScreenNameWindow"))

    let checkedSignon = false;
    let username = "";
    let password = "";
    var authtoken = ""
    let displayname = ""
    function openChat(type, name) {
        console.log(type,name)
    }
    function setDisplayName(name) {
        displayname = name;
    }

    function initalizeBuddyList() {
        let buddyList = []
        function listFetchresponse (msg) {
            body = JSON.parse(msg.data)
            if(body.type == "inital-list-fetch") {
                buddyList = body.content
            }
            console.log(body.content)
            for(let chat of body.content.chatrooms) {
                let elem = document.createElement("li")
                let strong = document.createElement("strong")
                strong.classList = ["buddyClick"]
                strong.innerText = chat
                elem.appendChild(strong)
                elem.onclick = function() {
                    openChat("chatroom", chat)
                }
                document.getElementById("chatroomListUL").appendChild(elem)
            }
            let activeBuddiesN = 0;
            for(let chat of body.content.list.buddies) {
                let elem = document.createElement("li")
                let strong = document.createElement("strong")
                if(body.content.activeBuddies.includes(chat)) {
                    strong.classList.add("buddyClick")
                    activeBuddiesN++
                } else {
                    strong.classList.add("buddyClick")
                    strong.classList.add("offlineUser")
                }
                strong.innerText = chat
                elem.appendChild(strong)
                elem.onclick = function() {
                    openChat("pm", chat)
                }
                document.getElementById("buddiesListUL").appendChild(elem)
            }
            document.getElementById("buddiesListLabel").innerText = "Buddies (" + String(activeBuddiesN) + "/" + String(body.content.list.buddies.length) + ")"
            
            let activeFamilyN = 0;
            for(let chat of body.content.list.family) {
                let elem = document.createElement("li")
                let strong = document.createElement("strong")
                if(body.content.activeBuddies.includes(chat)) {
                    strong.classList.add("buddyClick")
                    activeFamilyN++;
                } else {
                    strong.classList.add("buddyClick")
                    strong.classList.add("offlineUser")
                }
                strong.innerText = chat
                elem.appendChild(strong)
                elem.onclick = function() {
                    openChat("pm", chat)
                }
                document.getElementById("familyListUL").appendChild(elem)
            }
            document.getElementById("familyListLabel").innerText = "Family (" + String(activeFamilyN) + "/" + String(body.content.list.family.length) + ")"
            
            let activecowN = 0;
            for(let chat of body.content.list.coworkers) {
                let elem = document.createElement("li")
                let strong = document.createElement("strong")
                if(body.content.activeBuddies.includes(chat)) {
                    strong.classList.add("buddyClick")
                    activecowN++;
                } else {
                    strong.classList.add("buddyClick")
                    strong.classList.add("offlineUser")
                }
                strong.innerText = chat
                elem.appendChild(strong)
                elem.onclick = function() {
                    openChat("pm", chat)
                }
                document.getElementById("coworkersListUL").appendChild(elem)
            }
            document.getElementById("coworkersListLabel").innerText = "Coworkers (" + String(activecowN) + "/" + String(body.content.list.coworkers.length) + ")"

            let offlineUsers = [...body.content.list.buddies, ...body.content.list.family, ...body.content.list.coworkers]

            for(let online of body.content.activeBuddies) {
                offlineUsers.splice(offlineUsers.indexOf(online), 1)
            }

            for(let chat of offlineUsers) {
                let elem = document.createElement("li")
                let strong = document.createElement("strong")
                strong.classList.add("buddyClick")
                strong.classList.add("offlineUser")
                strong.innerText = chat
                elem.appendChild(strong)
                elem.onclick = function() {
                    openChat("pm", chat)
                }
                document.getElementById("offlineUserListUL").appendChild(elem)
            }
            document.getElementById("offlineListLabel").innerText = "Offline (" + String(offlineUsers.length) + ")";


            websocket.removeEventListener("message", listFetchresponse)
        }
        websocket.send(JSON.stringify({
            type: "listfetch"
        }))
        websocket.addEventListener("message",listFetchresponse)
    }

    function hideWindow(name) {
        document.getElementById(name).style.display = "none";
    }
    function showWindow(name, type) {
        document.getElementById(name).style.display = type;
    }
    document.getElementById("savepassword").addEventListener("click", () => {
        if(document.getElementById("savepassword").checked) {
            document.getElementById("autologin").disabled = false
        } else {
            document.getElementById("autologin").disabled = true;
            document.getElementById("autologin").checked = false;
        }
    })

    document.getElementById("passwordinput").addEventListener("input", () => {
        let passwordinput = document.getElementById("passwordinput").value
        if(passwordinput != "") {
            document.getElementById("savepassword").disabled = false;
            document.getElementById("signon").style.opacity = 1;
            checkedSignon = true;

        } else {
            document.getElementById("savepassword").disabled = true;
            document.getElementById("savepassword").checked = false
            document.getElementById("autologin").disabled = true;
            document.getElementById("autologin").checked = false;
            document.getElementById("signon").style.opacity = 0.5;
            checkedSignon = false;

        }
    })

    function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "Bar")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "Bar").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        if(0 < elmnt.offsetTop - pos2 ) {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";

        }
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        if(pos4 < 10) {
            pos4 = 0;
            document.getElementById("signonWindow").style.top = 0;
        }
    }
    }
    document.getElementById("closeSignonWindow").addEventListener("click", () => {
        document.getElementById("signonWindow").style.display = "none"
    })
    document.getElementById("signon").addEventListener("click", () => {
        if(checkedSignon) {
            // alert(document.getElementById("usernameinput").value + ", " + document.getElementById("passwordinput").value)
            username = document.getElementById("usernameinput").value
            password = document.getElementById("passwordinput").value
            
            fetch("/classic/chat/account/auth", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({"user": username, "password": password})
            })
            .then(resp => resp.json())
            .then(response => {
                console.log(response)
                if(response.status == 200) {
                    let token = response.token
                    authtoken = response.token
                    if(document.getElementById("savepassword").checked) {
                        document.cookie = "authtoken=" + response.token
                        if(document.getElementById("autologin").checked) {
                            document.cookie = "autologin=true"
                        }
                    }
                    document.getElementById("connectionUsername").innerText = username;
                    // document.getElementById("buddyListWindowTitle").innerText = username;
                    if(response.displayName.endsWith("s")) {
                        document.getElementById("buddyListWindowTitle").innerText = response.displayName + "' Buddy List";
                    } else {
                        document.getElementById("buddyListWindowTitle").innerText = response.displayName + "'s Buddy List";
                    }
                    setDisplayName(response.displayName)
                    document.getElementById("connectionStatus").innerText = "1. Contacting websocket";

                    // get websocket
                    document.getElementById("sectionOne").style.display = "none";
                    document.getElementById("connectionSection").style.display = "flex"
                    websocket.send(JSON.stringify({
                        type: "auth",
                        content: token
                    }))
                    function onAuth (msg) {
                        setTimeout(() => {
                            document.getElementById("connectionStatus").innerText = "2. Starting services";                           
                            initalizeBuddyList()
                            setTimeout(() => {
            
                                document.getElementById("buddyListWindow").style.display = "block";
                                // lol
                                document.getElementById("buddyListWindow").style.top = (parseInt(document.getElementById("signonWindow").style.top.substring(0,parseInt(document.getElementById("signonWindow").style.top.length - 2))) + 30).toString() + "px";
                                document.getElementById("buddyListWindow").style.left = (parseInt(document.getElementById("signonWindow").style.left.substring(0,parseInt(document.getElementById("signonWindow").style.left.length - 2))) + 30).toString() + "px";
            
                                document.getElementById("signonWindow").style.display = "none";
                            }, 900);
                        }, 600)
                        websocket.removeEventListener("message", onAuth)
                    }
                    websocket.addEventListener("message", onAuth)
                    }
                if(response.status == 400) {

                }
            })
        }
    })
    document.getElementById("closeBuddyListWindow").addEventListener("click", () => {
        document.getElementById("buddyListWindow").style.display = "none"
    })

    function initalizeResizeDrag(dragElem, window, minWidth, maxWidth=99999) {
        let currentWidth = parseInt(window.style.width.substring(0,parseInt(window.style.width.length - 2)))
        let pos1 = 0,pos2 = 0;
        let widthChange;
        let dragActivated = false;
        function eventLis (mouse) {
            if(dragActivated) {
                pos2 = mouse.clientX

                if(minWidth < (currentWidth + (pos2 - pos1)) && (currentWidth + (pos2 - pos1)) < maxWidth ) {
                    widthChange = currentWidth + (pos2 - pos1)
                    window.style.width = widthChange + "px"
                }
            }
        }
        dragElem.onmousedown = function (mouse) {
            pos1 = mouse.clientX
            dragActivated = true;
            document.addEventListener("mousemove",eventLis)
            document.addEventListener("mouseup", (mouse) => {
                currentWidth = widthChange
                dragActivated = false;
                document.removeEventListener("mousemove", eventLis)
            })
        }



    }

    document.getElementById("closeGetScreenNameWindow").addEventListener("click", () => {hideWindow("getScreenNameWindow")})
    document.getElementById("getScreenNameHref").addEventListener("click", () => { showWindow("getScreenNameWindow", "block"); hideWindow("getscreensectiontwo"); showWindow("getscreensectionone", "block")})
    initalizeResizeDrag(document.getElementById("buddylistResize"), document.getElementById("buddyListWindow"), 150, 350)
    initalizeResizeDrag(document.getElementById("getScreenNameResize"), document.getElementById("getScreenNameWindow"), 150, 350)

    let onTab = ""
    let toggledHover = false;
    let buddytabmenus = []


    
    for(let x = 1; x < document.getElementById("buddyListTabs").childNodes.length; x += 2) {
        let elem = document.getElementById("buddyListTabs").childNodes[x]
        buddytabmenus.push(elem);
    }

    function setVisible(tabName) {
        for(let x = 0; x < buddytabmenus.length; x++) {
            buddytabmenus[x].style.display = "none";
        }
        if(tabName != "none") {
            document.getElementById(tabName).style.display = "flex"
        }
    }
    // Buddy list logout
    document.getElementById("aimbuddyLogout").addEventListener("click", () => {
        hideWindow("buddyListWindow")
        hideWindow("connectionSection")
        showWindow("sectionOne", "flex")
        showWindow("signonWindow", "block")
        document.getElementById("usernameinput").value = ""
        document.getElementById("passwordinput").value = ""
    }) 

    document.addEventListener("click", (e) => {
        if(toggledHover && 
            e.target.className != "menu-selection" && 
            e.target.className != "unavailable" &&
            e.target.parentNode.className != "menuTabs") {
            toggledHover = false;
            setVisible("none")
        }
    })
    for(let x = 0; x < document.getElementsByClassName("menu-selection").length; x++) {
        let elem = document.getElementsByClassName("menu-selection")[x];
        elem.onmouseenter = function () {
            if(toggledHover) {
                setVisible(elem.getAttribute("showsMenu"))
            }
        }
        elem.onclick = function () {
            toggledHover = !toggledHover
            setVisible(elem.getAttribute("showsMenu"))
        }
    }
    document.getElementById("registerScreenNameButton").addEventListener("click", () => {
        let newUsername = document.getElementById("newusername").value
        let newPassword = document.getElementById("newPassword").value
        let invalid = false;
        if(newUsername == "") {
            document.getElementById("newusername").style.border = "1px solid red"
            invalid = true;
        }
        if(newPassword == "") {
            document.getElementById("newPassword").style.border = "1px solid red"
            invalid = true;
        }
        if(invalid) return;
        fetch("/classic/chat/account/create", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"user": newUsername, "password": newPassword})
        })
        .then(resp => resp.json())
        .then(response => {
            if(response.status == 400) {
                if(response.error = "NAME_TAKEN") {
                    document.getElementById("getScreenNameStatus").innerText = "Name is taken already!"
                }
                document.getElementById("newusername").style.border = "1px solid red"
                return;
            }
            hideWindow("getscreensectionone")
            showWindow("getscreensectiontwo", "block")
        })
    })
})