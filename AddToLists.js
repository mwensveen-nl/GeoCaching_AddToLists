// ==UserScript==
// @name         Geocaching Add to List
// @namespace    nl.mwensveen.geocaching
// @version      0.1
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
  var addedToDefaultList = false;
  var gccode = "";
  var userLists = new Array();

  var cfg = new MonkeyConfig({
    title: "Default lists (comma seperated)",
    menuCommand: true,
    params: {
      defaulLists: {
        type: "text",
        default: "TestList",
      },
    },
  });
  var defaultListsFromConfig = cfg.get("defaulLists").split(",");

  gccode = $("#ctl00_ContentBody_CoordInfoLinkControl1_uxCoordInfoCode").html();

  function addButton() {
    var a = document.createElement("a");
    a.id = "addToDefaulLists";
    a.appendChild(
      document.createTextNode(
        "Add to Default Lists (" + defaultListsFromConfig.length + ")"
      )
    );
    a.title = defaultListsFromConfig.join(", ");
    a.href = "javascript:void(0);";
    a.onclick = () => {
      addCacheToDefaultLists();
      return false;
    };

    var li = document.createElement("li");
    li.id = "addToDefaulListsWrapper";
    li.style.backgroundImage = "url('/images/icons/16/bookmark_list.png')";
    li.style.backgroundRepeat = "no-repeat";
    li.style.backgroundPosition = "0 50%";
    li.appendChild(a);
    $("#ctl00_ContentBody_GeoNav_uxAddToListBtn").after(li);
  }

  function addCacheToDefaultLists() {
    if (addedToDefaultList) {
      return;
    }
    for (const [key, value] of Object.entries(userLists)) {
      if (defaultListsFromConfig.includes(key)) {
        console.log(key, value);
        addCacheToList(value);
      }
    }
    addedToDefaultList = true;

    var span = document.createElement("span");
    var text = document.createTextNode(
      "Add to Default Lists (" + defaultListsFromConfig.length + ")"
    );
    span.appendChild(text);
    span.style.color = "#02874d";
    span.style.textDecoration = "none";
    span.style.cursor = "default";
    $("#addToDefaulLists").replaceWith(span);
    $("#addToDefaulListsWrapper").css("background-size", "16px 16px");
    $("#addToDefaulListsWrapper").css(
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

  getUserLists();
  addButton();
})();
