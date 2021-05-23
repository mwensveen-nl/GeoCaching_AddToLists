// ==UserScript==
// @name         Geocaching Add to List
// @namespace    nl.mwensveen.geocaching
// @version      0.2
// @description  Add option to add the geocache to a number of lists. The lists are set in the config using the tempermonkey menu.
// @author       mwensveen
// @match        https://www.geocaching.com/geocache/*
// @icon         https://www.google.com/s2/favicons?domain=geocaching.com
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @require     https://greasyfork.org/scripts/38445-monkeyconfig/code/MonkeyConfig.js
// @include     http://www.geocaching.com/geocache/*
// @require     https://raw.github.com/odyniec/MonkeyConfig/master/monkeyconfig.js
// @include     https://www.geocaching.com/geocache/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// ==/UserScript==

(function () {
  "use strict";
  const LINK_ID_PREFIX = "addToDefaultLists_";
  const LIST_ID_PREFIX = "addToDefaultListsWrapper_";
  const ADD_LINK_AFTER_ID = "#ctl00_ContentBody_GeoNav_uxAddToListBtn";
  var userLists = new Array();
  var defaultListsFromConfig = {};
  var gccode = $(
    "#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode"
  ).html();

  function getListsFromConfig() {
    var cfg = new MonkeyConfig({
      title: "Default lists",
      menuCommand: true,
      params: {
        defaulLists: {
          type: "text",
          default: "Example=My List",
        },
      },
    });
    var listsArray = cfg.get("defaulLists").split(";");
    listsArray.forEach((element) => {
      var elems = element.split("=");
      var name = elems[0];
      var lists = elems[1].split(",");
      defaultListsFromConfig[name] = lists;
    });

    for (const [key, value] of Object.entries(defaultListsFromConfig)) {
      console.log(key, value);
    }
  }

  function addAllLinks() {
    var keys = Object.keys(defaultListsFromConfig).reverse();
    keys.forEach((key) => {
      addLink(key, defaultListsFromConfig[key]);
    });
  }

  function addLink(name, defaultLists) {
    console.log(name, defaultLists);
    var a = document.createElement("a");
    a.id = LINK_ID_PREFIX + name;
    a.appendChild(getLinkText(name, defaultLists));
    a.title = defaultLists.join(", ");
    a.href = "javascript:void(0);";
    a.onclick = () => {
      addCacheToDefaultLists(name);
      return false;
    };

    var li = document.createElement("li");
    li.id = LIST_ID_PREFIX + name;
    li.style.backgroundImage = "url('/images/icons/16/bookmark_list.png')";
    li.style.backgroundRepeat = "no-repeat";
    li.style.backgroundPosition = "0 50%";
    li.appendChild(a);
    $(ADD_LINK_AFTER_ID).after(li);
  }

  function addCacheToDefaultLists(name) {
    console.log("adding to ", name);
    var listsToAdd = defaultListsFromConfig[name];
    for (const [key, value] of Object.entries(userLists)) {
      if (listsToAdd.includes(key)) {
        console.log(key, value);
        addCacheToList(value);
      }
    }

    var span = document.createElement("span");
    span.appendChild(getLinkText(name, listsToAdd));
    span.style.color = "#02874d";
    span.style.textDecoration = "none";
    span.style.cursor = "default";
    var linkId = "#" + LINK_ID_PREFIX + name;
    var listItemId = "#" + LIST_ID_PREFIX + name;
    $(linkId).replaceWith(span);
    $(listItemId).css("background-size", "16px 16px");
    $(listItemId).css(
      "background-image",
      "url('https://www.geocaching.com/images/logtypes/48/2.png')"
    );
  }

  function addCacheToList(listId) {
    var url =
      "https://www.geocaching.com/api/proxy/web/v1/lists/" +
      listId +
      "/geocaches";

    console.log(url);
    var jsonBody = [];
    jsonBody.push({ referenceCode: gccode });
    console.log(JSON.stringify(jsonBody));

    $.ajax({
      type: "PUT",
      url: url,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(jsonBody),
      success: function (result) {
        return false;
      },
      error: function (err) {
        console.log(err);
      },
    });
  }

  function getUserLists() {
    $.get(
      "https://www.geocaching.com/api/proxy/web/v1/lists?type=bm&skip=0&take=100",
      function (data) {
        data.data.forEach((item) => {
          console.log(item.name);
          userLists[item.name] = item.referenceCode;
        });
      }
    );
  }

  function getLinkText(name, defaultLists) {
    return document.createTextNode(
      "Add to " + name + " (" + defaultLists.length + ")"
    );
  }
  getUserLists();
  getListsFromConfig();
  addAllLinks();
})();
