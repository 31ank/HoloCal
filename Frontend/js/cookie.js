filePath = 'about.html';

// dontShowBanner = getCookie("cookieBanner");
if(true) {
    var cookieDiv = document.createElement('div');
    var cookieText = document.createElement('p');
    var closeButton = document.createElement('p');
    cookieDiv.id = "cookieText";
    cookieText.innerHTML = 'This site doesn\'t use cookies, but it still saves some basic informations.<a style="color:white;" href="' + filePath + '">Read more</a>';
    cookieText.style.cssText = 'margin:0;padding:0;display:inline-block;padding-right:20px;'
    closeButton.innerHTML = 'X';
    closeButton.onclick = function () {
        // setCookie("cookieBanner", "true", 10);
        cookieDiv.parentNode.removeChild(cookieDiv);
    };
    closeButton.style.cssText = 'margin:0;padding:0;display:inline-block;right: 10px;position:absolute;padding: 0px 0px 0px 50px;cursor:pointer;overflow:hidden;'
    cookieDiv.style.cssText = 'position:absolute;height:auto;z-index:100;background:#000000;color:white;left:0;right:0;top:0;line-height:30px;font-size:14px;padding-left:5px;font-family: "Roboto", "Arial", "sans serif";';
    cookieDiv.appendChild(cookieText);
    cookieDiv.appendChild(closeButton);
    document.body.appendChild(cookieDiv);
}

// function setCookie(cname, cvalue, exdays) {
//     var d = new Date();
//     d.setTime(d.getTime() + (exdays*24*60*60*1000));
//     var expires = "expires="+ d.toUTCString();
//     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }

// function getCookie(cname) {
//     var name = cname + "=";
//     var decodedCookie = decodeURIComponent(document.cookie);
//     var ca = decodedCookie.split(';');
//     for(var i = 0; i <ca.length; i++) {
//         var c = ca[i];
//         while (c.charAt(0) == ' ') {
//             c = c.substring(1);
//         }
//         if (c.indexOf(name) == 0) {
//             return c.substring(name.length, c.length);
//         }
//     }
//     return "";
// }