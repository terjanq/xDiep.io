(function(){
    var lpath = "http://diephack.tk/";
    var rand = ~~(Math.random()*10000);

    var _hp = HTMLElement.prototype;
    var _cp = CanvasRenderingContext2D.prototype;
    var _WS = WebSocket;

    var _toString = Function.prototype.toString;
    var _shadowRootGet = _hp.__lookupGetter__('shadowRoot');
    var _createShadowRoot = _hp.createShadowRoot;
    var _shadowHost = ShadowRoot.prototype.__lookupGetter__('host');
    var _focus = _hp.focus;
    var _fillText = _cp.fillText;
    var _strokeText = _cp.strokeText;
    var _fillStyle = _cp.__lookupSetter__('fillStyle');
    var _strokeStyle = _cp.__lookupSetter__('strokeStyle');
    var _scale = _cp.scale;
    var _translate = _cp.translate;
    var _strokeRect = _cp.strokeRect;
    var _setTyping;

    var __shadowRootGet;
    var __createShadowRoot;
    var __toString;
    var __shadowHost;
    var __fillText;
    var __strokeText;
    var __focus;
    var __fillStyle;
    var __strokeStyle;
    var __scale;
    var __translate;
    var __strokeRect;
    var __WS;

    var bodyShadowRoot = undefined;


    var Decoder = new TextDecoder("utf-8");

    var myDoc;
    var welcomeDiv = createElement("div", {"class": 'welcome-div'});

    var spanInfoKills = createElement("span", {"id": 'span-kills'}, "0");
    var spanInfo = createElement("span", {"class": 'span-info'}, ["Kills: ", spanInfoKills]);;
    var partyCodeInput = createElement("input", {"class": 'party-code', "type": "text", "spellcheck": false, "autocomplete": 'off'});
        preventInput(partyCodeInput);
    var partyJoinButton = createElement("button", {"class": 'party-join'}, "join");
    var darkThemeCheck = createElement("input", {"type": 'checkbox'});
    var darkThemeSpan = createElement("span", {"class": 'dark-theme-option'}, [darkThemeCheck, "Dark Theme"]);;
    var minimapCheck = createElement("input", {"type": "checkbox"});
    var minimapSpan = createElement("span", {"class": 'dark-theme-option'}, [minimapCheck, "Sectored Minimap"]);
    var customThemeCheck = createElement("input", {"type": "checkbox"});
    var customThemeLink = createElement("a", {"class": "my-link"}, "Custom Theme");
    var customThemeSpan = createElement("span", {"class": "dark-theme-option"}, [customThemeCheck, customThemeLink]);
    var hideStatsCheck = createElement("input", {"type": "checkbox"});
    var hideStatsSpan = createElement("span", {"class": 'dark-theme-option'}, [hideStatsCheck, "Hide Stats"]);




    var creatorSpan = createElement("span", {"style": "font-size: 14px; position:absolute; bottom:2px; right:6px;"}, 'Made by <a style="text-decoration:none; color:red" href="http://diephack.tk" target="_blank">diephack.tk</a>');
    var minimapCanvas = createElement("canvas", {"class": "minimap"});
    var minimapCtx = minimapCanvas.getContext("2d");

    var customThemePopup;

            welcomeDiv.appendChild(partyCodeInput);
            welcomeDiv.appendChild(partyJoinButton);
            welcomeDiv.appendChild(darkThemeSpan);
            welcomeDiv.appendChild(minimapSpan);
            welcomeDiv.appendChild(customThemeSpan);
            welcomeDiv.appendChild(hideStatsSpan);
            welcomeDiv.appendChild(creatorSpan);


    var nickInput;
    var canvas;

    var fakeBody = document.createElement('body');

    var game = {
        player: {
            alive: false,
            kills: 0
        },
        preventFocus: false,
        theme: {
            originalColors: {},
            darkColors: {},
            json: {
                "author": "Gall Anonim",
                "name" : "Custom Theme",
                "dictionary" : {},
                "replaced" :{}
            },
            dark: false,
            custom: false,
            minimapSize: 170,
            minimap: false
        },
        zoom: 1.0,
        hideStats: false,
        boardLength: -12500,
        started: false,
        socket: null
    };

    game.theme.originalColors = {
        "rgb(205,205,205)"   :  "background",
        "rgb(252,118,119)"   :  "triangles",
        "rgb(153,153,153)"   :  "foo1",
        "rgb(0,178,225)"       :  "cell",
        "rgb(241,78,84)"       :   "bullet",
        "rgb(255,232,105)"   :  "squares",
        "rgb(118,141,252)"   :  "blueshape",
        "rgb(85,85,85)"         :  "cellborder",
        "rgb(238,238,238)"   :  "input",
        "rgb(255,255,255)"   :  "whiteColor",
        "rgb(0,0,0)"               :  "blackColor",
        "rgb(245,245,245)"   :  "playerNamer",
        "rgb(153,153,153)"   :  "weapon",
        "rgb(252,173,118)"     :  "upgradeRegen",
        "rgb(249,67,255)"     :  "upgradeHealth",
        "rgb(133,67,255)"       :  "upgradeBodydamage",
        "rgb(67,127,255)"       :  "upgradeBulletspeed",
        "rgb(255,222,67)"     :  "upgradePenetration",
        "rgb(255,67,67)"       :  "upgradeBulletdamage",
        "rgb(130,255,67)"       :  "upgradeReload",
        "rgb(67,255,249)"     :  "upgradeMovspeed",
        "rgb(241,119,221)"   :  "patrol",
        "rgb(0,0,255)"          :   "autofireAlert",
        "!rgb(134,198,128)" : "healthStroke",
        "!rgb(67,255,145)" : "leaderboardStroke",
        "!rgb(255,222,67)" : "levelStroke", //level
        "!rgb(0,178,225)" : "blueTeam",
        "!rgb(241,78,84)" : "redTeam"

    };



    game.theme.darkColors = {
        "background"          :   "rgb(20,20,20)",
        "bullet"                    :   "rgb(230, 10, 10)",
        "squares"                 :   "rgb(230, 1, 1)",
        "cell"                        :  "rgb(255, 102, 0)",
        "cellborder"             :  "rgb(0, 0, 0)",
        "input"                     :  "rgba(0, 0, 0, 0.1)",
        "weapon"           : "rgb(0,100, 0)",
        "patrol"                     : "rgb(157, 0, 122)",
        "blueshape"                     :   "#0b16a7",
        "playerNamer"                       :  "rgb(0, 51, 0)",
        "whiteColor" : "#5f0a0a",
        "teambullet"             :    "#b80483",
        "teamweapon"          :    "#2c761e",
        "autofireAlert"     :     "#f2f25a",
        "defaultFill"        : "rgb(230, 0, 0)",
        "healthStroke"   : "rgb(0, 0, 180)",
        "leaderboardStroke" : "rgba(0, 0, 180, 0.8)",
        "levelStroke"      :      "#d6b500",
        "blueTeam"          :        "default",
        "redTeam"        :       "default",
        "defaultStroke"    :       "rgb(255,255,255)"
    };


    var TAB = {keyCode: 9, preventDefault: function(){}};
    var ENTER = {keyCode: 13, preventDefault: function(){}};

    var observerConfig = { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] };


    Function.prototype.toString = function(){
        if(this === Function.prototype.toString) return _toString.call(_toString);
        if(this === __shadowRootGet) return _toString.call(_shadowRootGet);
        if(this === __createShadowRoot) return _toString.call(_createShadowRoot);
        if(this === __shadowHost) return _toString.call(_shadowHost);
        if(this === __fillText) return _toString.call(_fillText);
        if(this === __strokeText) return _toString.call(_strokeText);
        if(this === __focus) return _toString.call(_focus);
        if(this === __strokeStyle) return _toString.call(_strokeStyle);
        if(this === __fillStyle) return _toString.call(_fillStyle);
        if(this === __scale) return _toString.call(_scale);
        if(this === __translate) return _toString.call(_translate);
        if(this === __strokeRect) return _toString.call(_strokeRect);
        if(this === __WS) return _toString.call(_WS);
        return _toString.call(this);
    };


     var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if(mutation.type == "childList" && mutation.addedNodes.length > 0){
            for(var i in mutation.addedNodes){
                if(mutation.addedNodes[i].nodeName == "BODY") onBodyStart(mutation.addedNodes[i]);
                if(mutation.addedNodes[i].nodeName == "SCRIPT") onScriptHandle(mutation.addedNodes[i]);
            }
        }else
        if(mutation.type == "attributes" && mutation.attributeName == "style" && mutation.target === document.getElementById('textInputContainer')) onNickContainerChange(mutation.target.style);
      });
    });

    observer.observe(document.documentElement, observerConfig);





    function onBodyStart(e){
        myDoc = e.createShadowRoot();
        myDoc.innerHTML = `<content select="link"></content><content select="#fontdetectHelper"></content><content select="span"></content><content select="#canvas"></content><content select="#textInputContainer"></content><style> @import "`+lpath+`xdiep.css"; </style>`;
                                    // <iframe id='_ga' class="ga" src="`+lpath+`ga.html"></iframe>`;
    }

    window.addEventListener("load", function(){
        nickInput = document.getElementById("textInput");
        canvas = document.getElementById("canvas");
        myDoc.appendChild(welcomeDiv);
        myDoc.appendChild(spanInfo);
        myDoc.appendChild(minimapCanvas);

        createCustomThemePopup();

        myDoc.appendChild(customThemePopup);

       setTimeout(function(){ renderMinimap();}, 3000);

        document.body.addEventListener("mousewheel", WheelHandler, true);

        setTimeout(function(){ game.preventFocus = true;}, 3000);
        _setTyping = window["setTyping"];

        makeDragable(customThemePopup);
        makeDragable(minimapCanvas);

    });




     _hp.__defineGetter__('shadowRoot', function(){
            if(this === document.body)  return bodyShadowRoot;
            return _shadowRootGet.call(this);
        });
     __shadowRootGet = _hp.__lookupGetter__('shadowRoot');


    _hp.createShadowRoot = __createShadowRoot = function(){
        if(this === document.body && bodyShadowRoot === undefined) {
            bodyShadowRoot = null;
            return  _createShadowRoot.call(this);
        }
        var x = _createShadowRoot.call(fakeBody);
        bodyShadowRoot = x;
        return x;
    };

    _hp.focus = __focus = function(){
        if(this === nickInput && game.preventFocus) return ;
        _focus.call(this);
    };

    ShadowRoot.prototype.__defineGetter__('host', function(){
        if(this === fakeBody.shadowRoot) return document.body;
        return _shadowHost.call(this);
    });

    __shadowHost = ShadowRoot.prototype.__lookupGetter__('host');

    var tempkilled = {};
    var name;

    _cp.fillText= __fillText = function() {
          if(arguments[0].indexOf("You've killed") != -1) {
            name = arguments[0].split("You've killed")[1];
            if(!tempkilled[name]){
                tempkilled[name] = true;
                incrasePlayerKills();
                setTimeout(function(){
                    delete tempkilled[name];
                }, 7E3);
            }
        }else
        if(arguments[0].indexOf("diep.io/#") !=- 1) partyCodeHandler(arguments[0]);

        if(arguments[0].indexOf("Diep.io")!=-1) return;
        if(arguments[0].indexOf("players")!=-1) return;

        _fillText.apply(this, arguments);
    };

    _cp.strokeText= __strokeText = function() {
        if(arguments[0].indexOf("Diep.io")!=-1) return;
        if(arguments[0].indexOf("players")!=-1) return;
        _strokeText.apply(this, arguments);
    };


   _cp.__defineSetter__("fillStyle", function(){
        var rgb = styleHandler(arguments[0]);
        _fillStyle.call(this, rgb);
   });   __fillStyle = _cp.__lookupSetter__("fillStyle");

   _cp.__defineSetter__("strokeStyle", function(){
        var rgb = styleHandler(arguments[0], "!");
        _strokeStyle.call(this, rgb);
   }); __strokeStyle = _cp.__lookupSetter__("strokeStyle");

   var lastScale = [];

    _cp.scale = __scale = function() {
        if(game.theme.minimap && this.canvas.parentElement == null && arguments[0] > 50 && arguments[1]  > 50) {
            lastScale[0] = arguments[0];
            lastScale[1] = arguments[1];
            arguments[0] = game.theme.minimapSize - 14;
            arguments[1] = game.theme.minimapSize - 14;
        }
         if(this.canvas.parentElement === document.body && this.canvas != minimapCanvas) {
            arguments[0] = gameScale(arguments[0]);
            arguments[1] = gameScale(arguments[1]);
        }
        _scale.apply(this, arguments);
    };


    _cp.translate = __translate = function() {
          if(game.theme.minimap && this.canvas.parentElement == null && Math.abs(window.innerWidth - lastScale[0] - arguments[0]) < window.innerWidth/20 && Math.abs(window.innerHeight - lastScale[1] - arguments[1]) < window.innerWidth/20  ) arguments[0] = window.innerWidth - game.theme.minimapSize + 7, arguments[1] = window.innerHeight - game.theme.minimapSize + 7;

          _translate.apply(this, arguments);
    };

    _cp.strokeRect = __strokeRect = function() {
         if(game.theme.minimap && this.canvas.parentElement == null) { return; }
           _strokeRect.apply(this, arguments);
    };


    window.WebSocket = __WS = function(url, protocol){
        var s = new _WS(url, protocol);
        s.addEventListener("message", function(e){
            var dv = new DataView(e.data);
            if(dv.getUint8(0) == 4) {
                console.log(Decoder.decode(new Uint8Array(dv.buffer)));
                game.socket = this;
            }
        },true);
        return s
    };


    // _ws.__defineSetter__("onmessage", function(data){
    //     console.log(data);
    //     _wsOnmessage.call(this, data);
    // }); __wsOnmessage = _ws.__lookupSetter__("onmessage");

     window.addEventListener("keyup", function(e) {
        switch(e.key){
            case 'Escape':
                if(welcomeDiv.style.display == "block") hidePanels(); else showPanels();
                break;
        }
    });

    function onScriptHandle(e){
        // if(e.innerHTML.indexOf("UA-76454247-1")!=-1) e.innerHTML = e.innerHTML.replace("UA-76454247-1", "UA-78233995-1");
        // setTimeout(function(){
        //     e.innerHTML = e.innerHTML.replace("UA-78233995-1","UA-76454247-1");
        // },10000);
    }

    function onNickContainerChange(e){
        if(e.display == "none") { if(!game.player.alive) resetPlayerKills();  game.player.alive = true; if(!game.started) game.started=true; }
        if(e.display == "block") game.player.alive = false;

        welcomeDiv.style.display = e.display;
        welcomeDiv.style.top = (parseInt(e.top) + 60) + "px";
    }

    function resetPlayerKills(){
        spanInfoKills.innerHTML = game.player.kills  = 0;
    }

    function incrasePlayerKills(){
            spanInfoKills.innerHTML = (game.player.kills += 1);
    }

    function showPanels(){
        welcomeDiv.style.display = "block";
        welcomeDiv.style.top = "calc(50% + 60px)";
    }

    function hidePanels(){
        welcomeDiv.style.display = "none";
    }

    function partyCodeHandler(e){
        partyCodeInput.value = e;
        setTimeout(function(){
            removeHash();
        }, 2000);
    }

    function removeHash () {
         location.hash = "";
         history.pushState("", document.title, window.location.pathname + window.location.search);
    }


    function styleHandler(rgb, b){
        if(!game.theme.dark && !game.theme.custom) return rgb;
        if(!b) b = "";
        rgb = rgb.replace(/\s/g, "");
        var replaced = (game.theme.custom ? game.theme.json["replaced"] : game.theme.darkColors);
        var def = (b=="!" ? "defaultStroke" : "defaultFill");
        var orygName = (game.theme.custom ? game.theme.json["dictionary"][b + rgb]: game.theme.originalColors[b + rgb]);

        if(!orygName || !replaced[orygName] || replaced[orygName] == def){
            if(!replaced[def] || replaced[def] == "default") return rgb;
            return replaced[def];
        }

        if(replaced[orygName] == "default") return rgb;

        return replaced[orygName];
    }



    function gameScale(e){
        return e * game.zoom;
    }

    function WheelHandler(event) {
            var zoom = game.zoom * Math.pow(0.93, event.wheelDelta / -120 || event.detail || 0);
            game.zoom = zoom;
            if(zoom < 0.78) game.zoom = 0.8;
            if(zoom > 1.0) game.zoom = 1.0;

    }

    function rgbToHex(col){
         var rgb = col.match(/rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
         return (rgb && rgb.length === 4) ? "#" +
          ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : col;
    }

    function createElement(element,attribute,inner){if(typeof(element) === "undefined"){return false;}if(typeof(inner) === "undefined"){inner = "";}var el = document.createElement(element);if(typeof(attribute) === 'object'){for(var key in attribute){el.setAttribute(key,attribute[key]);}}if(!Array.isArray(inner)){inner = [inner];}for(var k = 0;k < inner.length;k++){if(inner[k].tagName){el.appendChild(inner[k]);}else{el.insertAdjacentHTML("beforeEnd", inner[k]);}}return el;}

    function compareColors(a, b){
        var c, d;
        if(a.indexOf("#") != -1) c = hexToInt(a);
        else c = rgbToInt(a);

        if(b.indexOf("#") != -1) d = hexToInt(b);
        else d = rgbToInt(b);

        return (c == d);
    }
    function rgbToInt(a){
        var re = /(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/;
        var res = re.exec(a);
        return res[1] << 16 | res[2] << 8 | res[3];
    }

    function hexToRgb(a){
        if(a[0] == "#")
            return "rgb("+parseInt(a.substr(1, 2), 16)+","+parseInt(a.substr(3, 2), 16)+","+parseInt(a.substr(5, 2), 16)+")"
        return a;
    }
    function hexToInt(a){
        return rgbToInt(hexToRgb(a));
    }

    function setActive(){
        this.classList.toggle('active');
        if(this.parentElement._active)
            this.parentElement._active.classList.toggle('active');
         this.parentElement._active = this;
    }

    function getJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
          if (xhr.status == 200) {
            callback(xhr.response);
          }
        };
        xhr.send();
    };

    // ########### GAME ################


    partyJoinButton.addEventListener("click", function(){

        var t = partyCodeInput.value.split("#");
        if(t.length>1) {
            location.hash = t[1];
            if(game.socket && game.socket.readyState == 1){
                game.socket.close();
            }
            else{
                window.onkeydown(TAB);
                window.onkeyup(TAB);
            }
        }

        setTimeout(function(){
            removeHash();
        }, 2000);
    });

    partyCodeInput.addEventListener("click", function(){
        partyCodeInput.select();
    });

    // partyCodeInput.addEventListener("focus", function(){
    //     game.preventFocus = true;

    // });

    // partyCodeInput.addEventListener("blur", function(){
    //     game.preventFocus = false;
    // });

    darkThemeCheck.onchange = function(){
        game.theme.dark = darkThemeCheck.checked;
    };

    customThemeCheck.onchange = function(e){
        game.theme.custom = customThemeCheck.checked;
    };

    minimapCheck.onchange = function(){
        game.theme.minimap = minimapCheck.checked;
        if(game.theme.minimap) minimapCanvas.style.display = "block";
        else minimapCanvas.style.display = "none";
    };

    hideStatsCheck.onchange = function(){
        game.hideStats = hideStatsCheck.checked;
    };



    customThemeLink.addEventListener("click", function(){
        customThemeCheck.checked = true;
        game.theme.custom = customThemeCheck.checked;

        customThemePopup.classList.toggle("visible");
    });

    function draw() {
        var dx = minimapCanvas.width / (- game.boardLength*2);
        var dy = minimapCanvas.height / (- game.boardLength*2);

        minimapCtx.save();

        minimapCtx.scale(dx, dy);
        minimapCtx.translate(-game.boardLength, -game.boardLength);

        minimapCtx.clearRect(game.boardLength, game.boardLength, -2 * game.boardLength, -2 * game.boardLength);
        minimapCtx.beginPath();
        minimapCtx.arc(pla.x, pla.y, 800, 0, 2 * Math.PI);
        minimapCtx.fillStyle = "#ffcc00";
        minimapCtx.globalAlpha = 0.8;
        minimapCtx.fill();
        minimapCtx.closePath();

        minimapCtx.restore();
        requestAnimationFrame(draw);

    }


    function renderMinimap(){

        var letters = "ABCDEFGH".split('');
        minimapCanvas.width = game.theme.minimapSize;
        minimapCanvas.height = game.theme.minimapSize;
        var girds = 6;
        var tile = minimapCanvas.width / girds;

        minimapCtx.clearRect(0,0, minimapCanvas.width, minimapCanvas.height);

        minimapCtx.save();


        var dx = minimapCanvas.width / (- game.boardLength*2);
        var dy = minimapCanvas.height / (- game.boardLength*2);

        minimapCtx.save();

        minimapCtx.scale(dx, dy);
        minimapCtx.translate(-game.boardLength, -game.boardLength);

        if(true || server.indexOf(":dom:") != -1 || server.indexOf(":teams:") != -1){
            minimapCtx.fillStyle = "#ff0000";
            minimapCtx.globalAlpha = 0.1;
            minimapCtx.fillRect(game.boardLength, game.boardLength, 7000, 7000);
            minimapCtx.fillRect(5150, 5150, 7000, 7000);
        }


        minimapCtx.beginPath();
        minimapCtx.fillStyle = "#0b16a7";
        minimapCtx.globalAlpha = 0.2;
        minimapCtx.arc(0, 0, 4000, 0, 2* Math.PI);
        minimapCtx.fill();
        minimapCtx.closePath();

        minimapCtx.restore();


        minimapCtx.fillStyle = "#660033";
        minimapCtx.globalAlpha = 0.2;
        minimapCtx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);

        minimapCtx.lineWidth = 2;
        minimapCtx.textAlign = 'center';
        minimapCtx.textBaseline = 'middle';
        minimapCtx.globalAlpha = 0.2;
        minimapCtx.font = (0.55 * tile) + 'px Ubuntu';
        minimapCtx.fillStyle = '#FFFFFF';


        // minimapCtx.strokeRect(0, 0, 100, 100);

        for(var i = 0; i < girds; i++)
            for(var j = 0; j < girds; j++){
                minimapCtx.fillText(letters[j] + (i + 1), (tile * i) + (tile / 2), (tile * j) + (tile / 2));
            }

        minimapCtx.restore();


        // minimapCtx.clearRect(game.boardLength, game.boardLength, -4*game.boardLength, -4*game.boardLength);

        minimapCanvas.style.backgroundImage = "url(" + minimapCanvas.toDataURL() + ")";

    }




    function createCustomThemePopup(){

        customThemePopup = createElement("div", {"class": "custom-theme-popup"}, `<div class="nav"><a class="tab">Editor</a><a class="tab">JSON</a><a class="tab">Templates</a><a>Save</a><a>Restore</a><a></a></div>
            <div class="custom-theme-body my-scroll"><div class="custom-theme-table"></div><div class="custom-theme-json"><textarea></textarea></div><div class="custom-theme-templates"><ul class="my-ul"></ul></div></div><a class="close"></a>`);


        var nav = customThemePopup.firstChild;
        var tabEditor = nav.firstChild;
        var tabJSON = nav.children[1];
        var tabTemplates = nav.children[2];
        var tabSave = nav.children[3];
        var tabRestore = nav.children[4];
        var customThemeBody = customThemePopup.querySelector(".custom-theme-body");
        var customTable = customThemeBody.querySelector(".custom-theme-table");
        var customJSON = customThemeBody.querySelector(".custom-theme-json");
        var customTemplates = customThemeBody.querySelector(".custom-theme-templates");
              var customTemplatesUl = customTemplates.querySelector("ul");

        var templatesJSON;

        getJSON("http://diephack.tk/jsons/themes.json", function(e){
            templatesJSON = e;
            for(var i in e){
                var a = createElement("a", {"class":"my-link author", "data-content": e[i]["author"]}, e[i]["name"]);
                var li = createElement("li", {}, [a]);
                a.no = i;
                a.onclick = templateLoad;
                customTemplatesUl.appendChild(li);
            }
        });

        var close = customThemePopup.querySelector(".close");
        var textarea = customJSON.firstChild;

         var table = createElement("table");

        game.theme.json["dictionary"] = game.theme.originalColors;
        // game.theme.json["replaced"] = game.theme.darkColors;

        setActive.call(tabEditor);
        setActive.call(customTable);

        createTable();

        function colorHandler(){
            game.theme.json["replaced"][this.parentElement.parentElement.firstChild.innerHTML] = this.value;
            createTable();
        }

        tabEditor.onclick = proceedEditor;
        tabJSON.onclick = proceedJSON;
        tabTemplates.onclick = proceedTemplates;

        close.onclick = function(){customThemePopup.classList.remove("visible");};
        textarea.onchange = function(){ proceedLoad() };
        textarea.onpaste = function(){ proceedLoad() };
        textarea.onkeydown = function(){ proceedLoad() };
        textarea.ondrop = function(){ proceedLoad() };

        preventInput(textarea);

        function proceedEditor(){
            createTable();
            setActive.call(tabEditor);
            setActive.call(customTable);

        }

         function proceedJSON(){
            textarea.value = JSON.stringify(game.theme.json, null, 1);
            setActive.call(tabJSON);
            setActive.call(customJSON);
        }

        function proceedTemplates(){
            setActive.call(tabTemplates);
            setActive.call(customTemplates);
        }

        function templateLoad(){
            textarea.value = JSON.stringify(templatesJSON[this.no], null, 1);
            proceedLoad(function(){
                proceedEditor();
            });

        }


        var proceeding = false;
        function proceedLoad(callback){
            if(proceeding) return;
            proceeding = true;
            setTimeout(function(){
                try{
                    var tmp = textarea.value;
                    if(tmp.trim() == "") tmp = "{}";
                    tmp = JSON.parse(tmp);
                    if(tmp["dictionary"] && tmp["replaced"]) game.theme.json = tmp;
                    else{
                        game.theme.json["author"] = "Gall Anonim";
                        game.theme.json["name"] = "Custom Theme";
                        game.theme.json["dictionary"] = game.theme.originalColors;
                        game.theme.json["replaced"] = {};
                    }
                }
                catch(e){
                   console.error(e);
                }
                finally{
                    proceeding = false;
                    if(callback) callback();
                }
            }, 100);
        }

        function createTable(){
            table.innerHTML = "";
            var dict = game.theme.json["dictionary"];
            var rep = game.theme.json["replaced"];

            for(var i in dict){
                var value = (rep[dict[i]]? rgbToHex(rep[dict[i]]) : (i[0] == '!'? "defaultStroke" : "defaultFill"));
                var value2 = (rep[dict[i]]? hexToRgb(rep[dict[i]]) : (i[0] == '!'? "defaultStroke" : "defaultFill"));
                var input0 = createElement("input", {"type": "text", "class": "input-change-color", "value": value2});
                var input1 = createElement("input", {"type": "color", "value": (value[0]=="#" ? value: (rep[value] && rep[value] != "default" ? rgbToHex(rep[value]) : rgbToHex(i)))});
                var td0 = createElement("td", {}, dict[i]);
                var td1 = createElement("td", {}, [input0]);
                var td2 = createElement("td", {}, [input1]);
                var tr = createElement("tr", {}, [td0, td1, td2]);
                table.appendChild(tr);
                input1.onchange = colorHandler;
                input0.onchange = colorHandler;

                preventInput(input0);
            }

            var value = (rep["defaultFill"]? rgbToHex(rep["defaultFill"]) : "default");
            var value2 = (rep["defaultFill"]? hexToRgb(rep["defaultFill"]) : "default");
            var input0 = createElement("input", {"type": "text", "class": "input-change-color", "value": value2});
            var input1 = createElement("input", {"type": "color", "value": (value[0]=="#" ? value: "#000000")});
            var td0 = createElement("td", {}, "defaultFill");
            var td1 = createElement("td", {}, [input0]);
            var td2 = createElement("td", {}, [input1]);
            var tr = createElement("tr", {}, [td0, td1, td2]);
            table.appendChild(tr);
            input1.onchange = colorHandler;
            input0.onchange = colorHandler;

            preventInput(input0);

            var value = (rep["defaultStroke"]? rgbToHex(rep["defaultStroke"]) : "default");
            var value2 = (rep["defaultStroke"]? hexToRgb(rep["defaultStroke"]) : "default");
            var input0 = createElement("input", {"type": "text", "class": "input-change-color", "value": value2});
            var input1 = createElement("input", {"type": "color", "value": (value[0]=="#" ? value: "#000000")});
            var td0 = createElement("td", {}, "defaultStroke");
            var td1 = createElement("td", {}, [input0]);
            var td2 = createElement("td", {}, [input1]);
            var tr = createElement("tr", {}, [td0, td1, td2]);
            table.appendChild(tr);
            input1.onchange = colorHandler;
            input0.onchange = colorHandler;

            preventInput(input0);
            customTable.appendChild(table);

        }
    }

    function preventInput(el){
        el.addEventListener("focus", function(){
            game.preventFocus = true;
            _setTyping(true);
        });

        el.addEventListener("blur", function(){
            game.preventFocus = false;
            _setTyping(false);
        });
    }

    function makeDragable(el){
        return ;
        var dx = 0, dy = 0;
        el.addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);

        function mouseUp(){
            window.removeEventListener('mousemove', divMove, true);
        }

        function mouseDown(e){
            dx = e.offsetX; dy = e.offsetY;
            window.addEventListener('mousemove', divMove, true);
        }

        function divMove(e){
            el.style.position = 'absolute';
            el.style.top = (e.clientY - dy) + 'px';
            el.style.left = (e.clientX -dx) + 'px';
        }
    }

    document.currentScript.remove();
})();

