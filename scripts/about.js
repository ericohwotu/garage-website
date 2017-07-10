/// file to run the scripts
//===================================== round image ===========================
window.onload = function () {
    setUpLinks();
    var proPic = document.getElementById("profilepic")
    proPic.addEventListener("mouseenter", showSubMenu)
    proPic.addEventListener("mouseout", hideSubMenu)
}

function setUpLinks() {
    var proPic = document.getElementById("profilepic")

    var cvTop = document.getElementById("cv-top")
    cvTop.style.left = (proPic.offsetLeft + (proPic.offsetWidth / 2) - 35) + "px"
    cvTop.style.top = (proPic.offsetTop - 80) + "px"

    var cvBottom = document.getElementById("cv-bottom")
    cvBottom.style.left = (proPic.offsetLeft + (proPic.offsetWidth / 2) - 35) + "px"
    cvBottom.style.top = (proPic.offsetTop + proPic.offsetHeight + 10) + "px"

    var cvRight = document.getElementById("cv-right")
    cvRight.style.left = (proPic.offsetLeft + proPic.offsetWidth + 10) + "px"
    cvRight.style.top = (proPic.offsetTop + (proPic.offsetHeight / 2) - 35) + "px"

    var cvLeft = document.getElementById("cv-left")
    cvLeft.style.left = (proPic.offsetLeft - 80) + "px"
    cvLeft.style.top = (proPic.offsetTop + (proPic.offsetHeight / 2) - 35) + "px"
}

function showSubMenu() {
    console.log("entered mouseenter")
    var subs = document.getElementsByClassName("cv-icon")
    for (var i = 0; i < subs.length; i++) {
        subs[i].style.width = "70px";
        subs[i].style.height = "70px";
    }
}

function hideSubMenu() {
    var subs = document.getElementsByClassName("cv-icon")
    for (var i = 0; i < subs.length; i++) {
        subs[i].style.width = "0px";
        subs[i].style.height = "0px";
    }
}