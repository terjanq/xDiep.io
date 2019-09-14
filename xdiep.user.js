// ==UserScript==
// @name         xDiep.io (github)
// @description  Diep.io extension (sectored-minimap, zoom, play-with-friends, custom-theming, kill counter)
// @version      3.1
// @author       terjanq
// @match        http://diep.io/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      diep.io
// @connect      github.com
// @namespace    https://raw.githubusercontent.com/terjanq/xDiep.io/master/xdiep.user.js
// ==/UserScript==

window.stop();

GM_xmlhttpRequest({
    method: "GET",
    url: "http://diep.io",
    onload: function(e) {
         document.open(), document.write("<script src='https://raw.githack.com/terjanq/xDiep.io/master/head.js'></script>" + e.responseText), document.close();
    }
});
