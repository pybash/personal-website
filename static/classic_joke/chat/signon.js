document.addEventListener("DOMContentLoaded", () => {

    // !! https://www.w3schools.com/howto/howto_js_draggable.asp
    // Make the DIV element draggable:
    dragElement(document.getElementById("signonWindow"));

    let checkedSignon = false;
    let username = "";
    let password = "";

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
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
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
            document.getElementById("connectionUsername").innerText = username;
            document.getElementById("connectionStatus").innerText = "1. Contacting websocket";
            setTimeout(() => {
                document.getElementById("connectionStatus").innerText = "2. Starting services";

            }, 900)
            // get websocket
            document.getElementById("sectionOne").style.display = "none";
            document.getElementById("connectionSection").style.display = "flex"
        }
    })
    
})