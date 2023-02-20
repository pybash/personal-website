document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("lunarnetYoutube").addEventListener("click", () => {
        window.open("https://www.youtube.com/watch?v=JuP8PNZsAcM")
    })
    document.getElementById("atiReplit").addEventListener("click", () => {
        window.open("https://replit.com/@oktres/ATIinterpreter-Public-Version?v=1")
    })
    
    let topCharacters = "REACT HTML CSS JAVASCRIPT&";
    let topClassSpan = document.createElement("span");
    topClassSpan.className = "scrollingText";
    for(let x = 0; x < topCharacters.length; x++) {
        // <span class="scrollingText">REACT HTML CSS JAVASCRIPT&nbsp;</span>
        let charSpan = document.createElement("span");
        if(topCharacters[x] != "&")
            charSpan.innerText = topCharacters[x];
        else charSpan.innerHTML = "&nbsp;";
        charSpan.className = "hoverLetter"
        topClassSpan.appendChild(charSpan);
    }
    for(let x = 0; x < 5; x++) {
        document.getElementById("topScrollingSection").appendChild(topClassSpan.cloneNode(true))
    }

    let bottomCharacters = "C++ PYTHON NODEJS DIGITAL OCEAN&";
    let bottomClassSpan = document.createElement("span");
    bottomClassSpan.className = "scrollingTextReverse";
    for(let x = 0; x < bottomCharacters.length; x++) {
        // <span class="scrollingText">REACT HTML CSS JAVASCRIPT&nbsp;</span>
        let charSpan = document.createElement("span");
        if(bottomCharacters[x] != "&")
            charSpan.innerText = bottomCharacters[x];
        else charSpan.innerHTML = "&nbsp;";
        charSpan.className = "hoverLetter"
        bottomClassSpan.appendChild(charSpan);
    }
    for(let x = 0; x < 5; x++) {
        document.getElementById("bottomScrollingSection").appendChild(bottomClassSpan.cloneNode(true))
    }

})