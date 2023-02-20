

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("mousemove", (m) => {
        document.getElementById("floaty_cursor").style.top = m.pageY +"px"
        document.getElementById("floaty_cursor").style.left = m.pageX +"px"
    
    })
    
    // Shout out to this guy <3
    //https://www.superhi.com/video/smooth-movements-with-javascript
    
    const ball = document.getElementById("floaty_cursor_outline");
    
    let ismouseoverelement = false;
    let mouseX = 0;
    let mouseY = 0;
    
    let ballX = 0;
    let ballY = 0;
    
    let speed = 0.08;
    
    
    function animate(){
    
        let distX = mouseX - ballX;
        let distY = mouseY - ballY;
        
        
        ballX = ballX + (distX * speed);
        ballY = ballY + (distY * speed);
        
        if(!ismouseoverelement) {
            if((-4 < (distX * speed)&&(distX * speed) <  4) && (-4 < (distY * speed)&&(distY * speed) <  4)) {
                ball.style.borderColor = "rgba(255,255,255,0.3)"
            } else {
                ball.style.borderColor = "#fff"
            }
        }
        ball.style.left = ballX + "px";
        ball.style.top = ballY + "px";
        
        requestAnimationFrame(animate);
    }
    animate();
    
    document.addEventListener("mousemove", function(event){
        mouseX = event.pageX;
        mouseY = event.pageY;
    })
    for(let x = 0; x < document.getElementsByTagName("a").length; x++) {
        document.getElementsByTagName("a")[x].addEventListener("mouseover", () => {
            document.getElementById("floaty_cursor").style.width = "40px"
            document.getElementById("floaty_cursor").style.height = "40px"
            document.getElementById("floaty_cursor").style.backgroundColor = "rgba(255,255,255,0)"
            document.getElementById("floaty_cursor").style.border = "5px solid rgba(255,255,255,1)"
            document.getElementById("floaty_cursor_outline").style.borderColor = "rgba(255,255,255,0)"
            ismouseoverelement = true;
        })
        document.getElementsByTagName("a")[x].addEventListener("mouseleave", () => {
            document.getElementById("floaty_cursor").style.width = "10px"
            document.getElementById("floaty_cursor").style.height = "10px"
            document.getElementById("floaty_cursor").style.backgroundColor = "rgba(255,255,255,1)"
            document.getElementById("floaty_cursor").style.border = "none"
            document.getElementById("floaty_cursor_outline").style.borderColor = "rgba(255,255,255,0.3)"
            ismouseoverelement = false;
        })
    }
})