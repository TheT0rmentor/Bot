ModuleManager = {
  models: {
      Town: function() {
          this["key"] = null;
          this["id"] = null;
          this["name"] = null;
          this["farmTowns"] = {};
          this["relatedTowns"] = [];
          this["currentFarmCount"] = 0;
          this["modules"] = {
              Autofarm: {
                  isReadyTime: 0
              },
              Autoculture: {
                  isReadyTime: 0
              },
              Autobuild: {
                  isReadyTime: 0
              }
          };
          this["startFarming"] = function() {
              Autofarm["startFarming"](this);
          };
          this["startCulture"] = function() {
              Autoculture["startCulture"](this);
          };
          this["startBuild"] = function() {
              Autobuild["startBuild"](this);
          };
      }
  },
  Queue: {
      total: 0,
      queue: [],
      add: function(value) {
          this["total"]++;
          this["queue"]["push"](value);
      },
      start: function() {
          this["next"]();
      },
      stop: function() {
          this["queue"] = [];
      },
      isRunning: function() {
          return this["queue"]["length"] > 0 || this["total"] > 0;
      },
      next: function() {
          ModuleManager["updateTimer"]();
          var res = this["queue"]["shift"]();
          if (res) {
              res["fx"]();
          } else {
              if (this["queue"]["length"] <= 0) {
                  this["total"] = 0;
                  ModuleManager["finished"]();
              }
          }
      }
  },
  currentTown: null,
  playerTowns: [],
  interval: false,
  modules: {
      Autofarm: {
          isOn: false
      },
      Autoculture: {
          isOn: false
      },
      Autobuild: {
          isOn: false
      },
      Autoattack: {
          isOn: false
      }
  },
  init: function() {
      ModuleManager["loadPlayerTowns"]();
      ModuleManager["initButtons"]();
      ModuleManager["initTimer"]();
  },
  start: function() {
      var _0xa6b2x3 = false;
      var keyMinAngle = null;
      $["each"](ModuleManager["playerTowns"], function(canCreateDiscussions, i) {
          if (typeof Autofarm !== "undefined") {
              var angle = Autofarm["checkReady"](i);
              if (angle == true) {
                  _0xa6b2x3 = true;
                  ModuleManager["Queue"]["add"]({
                      townId: i["id"],
                      fx: function() {
                          i["startFarming"]();
                      }
                  });
              } else {
                  if (angle != false && (keyMinAngle == null || angle < keyMinAngle)) {
                      keyMinAngle = angle;
                  }
              }
          }
          if (typeof Autoculture !== "undefined") {
              var angle = Autoculture["checkReady"](i);
              if (angle == true) {
                  _0xa6b2x3 = true;
                  ModuleManager["Queue"]["add"]({
                      townId: i["id"],
                      fx: function() {
                          i["startCulture"]();
                      }
                  });
              } else {
                  if (angle != false && (keyMinAngle == null || angle < keyMinAngle)) {
                      keyMinAngle = angle;
                  }
              }
          }
          if (typeof Autobuild !== "undefined") {
              var angle = Autobuild["checkReady"](i);
              if (angle == true) {
                  _0xa6b2x3 = true;
                  ModuleManager["Queue"]["add"]({
                      townId: i["id"],
                      fx: function() {
                          i["startBuild"]();
                      }
                  });
              } else {
                  if (angle != false && (keyMinAngle == null || angle < keyMinAngle)) {
                      keyMinAngle = angle;
                  }
              }
          }
      });
      if (keyMinAngle === null && !_0xa6b2x3) {
          ConsoleLog.Log("Nothing is ready yet!", 0);
          ModuleManager["startTimer"](30, function() {
              ModuleManager["start"]();
          });
      } else {
          if (!_0xa6b2x3) {
              var artistTrack = keyMinAngle - Timestamp["now"]() + 10;
              ModuleManager["startTimer"](artistTrack, function() {
                  ModuleManager["start"]();
              });
          } else {
              ModuleManager["Queue"]["start"]();
          }
      }
  },
  stop: function() {
      clearInterval(ModuleManager["interval"]);
      ModuleManager["Queue"]["stop"]();
      $("#time_autobot .caption .value_container .curr")["html"]("Stopped");
  },
  finished: function() {
      ModuleManager["start"]();
  },
  initTimer: function() {
      $(".nui_main_menu")["css"]("top", "276px");
      $("#time_autobot")["append"](FormBuilder["timerBoxSmall"]({
          "id": "Autofarm_timer",
          "styles": "",
          "text": "Start Autobot"
      }))["show"]();
  },
  updateTimer: function(step, start) {
      var value = 0;
      if (typeof step !== "undefined" && typeof start !== "undefined") {
          value = (ModuleManager["Queue"]["total"] - (ModuleManager["Queue"]["queue"]["length"] + 1) + start / step) / ModuleManager["Queue"]["total"] * 100;
      } else {
          value = (ModuleManager["Queue"]["total"] - ModuleManager["Queue"]["queue"]["length"]) / ModuleManager["Queue"]["total"] * 100;
      }
      if (!isNaN(value)) {
          $("#time_autobot .progress .indicator")["width"](value + "%");
          $("#time_autobot .caption .value_container .curr")["html"](Math["round"](value) + "%");
      }
  },
  checkAutostart: function() {
      if (Autofarm["settings"]["autostart"]) {
          ModuleManager["modules"]["Autofarm"]["isOn"] = true;
          var $wrapper = $("#Autofarm_onoff");
          $wrapper["addClass"]("on");
          $wrapper["find"]("span")["mousePopup"](new MousePopup("Stop Autofarm"));
      }
      if (Autoculture["settings"]["autostart"]) {
          ModuleManager["modules"]["Autoculture"]["isOn"] = true;
          $wrapper = $("#Autoculture_onoff");
          $wrapper["addClass"]("on");
          $wrapper["find"]("span")["mousePopup"](new MousePopup("Stop Autoculture"));
      }
      if (Autobuild["settings"]["autostart"]) {
          ModuleManager["modules"]["Autobuild"]["isOn"] = true;
          $wrapper = $("#Autobuild_onoff");
          $wrapper["addClass"]("on");
          $wrapper["find"]("span")["mousePopup"](new MousePopup("Stop Autobuild"));
      }
      if (Autofarm["settings"]["autostart"] || Autoculture["settings"]["autostart"] || Autobuild["settings"]["autostart"]) {
          ModuleManager["start"]();
      }
  },
  startTimer: function(event, callback) {
      var expected = event;
      ModuleManager["interval"] = setInterval(function() {
          $("#time_autobot .caption .value_container .curr")["html"](Autobot["toHHMMSS"](event));
          $("#time_autobot .progress .indicator")["width"]((expected - event) / expected * 100 + "%");
          event--;
          if (event < 0) {
              clearInterval(ModuleManager["interval"]);
              callback();
          }
      }, 1000);
  },
  initButtons: function(url) {
      var p = $("#" + url + "_onoff");
      p["removeClass"]("disabled");
      p["on"]("click", function(result) {
          result["preventDefault"]();
          if (url == "Autoattack" && !Autobot["checkPremium"]("captain")) {
              HumanMessage["error"](Game["premium_data"]["captain"]["name"] + " " + DM["getl10n"]("premium")["advisors"]["not_activated"]["toLowerCase"]() + ".");
              return false;
          }
          if (ModuleManager["modules"][url]["isOn"] == true) {
              ModuleManager["modules"][url]["isOn"] = false;
              p["removeClass"]("on");
              p["find"]("span")["mousePopup"](new MousePopup("Start " + url));
              HumanMessage["success"](url + " is deactivated.");
              ConsoleLog.Log(url + " is deactivated.", 0);
              if (url == "Autofarm") {
                  Autofarm["stop"]();
              } else {
                  if (url == "Autoculture") {
                      Autoculture["stop"]();
                  } else {
                      if (url == "Autobuild") {
                          Autobuild["stop"]();
                      } else {
                          if (url == "Autoattack") {
                              Autoattack["stop"]();
                          }
                      }
                  }
              }
          } else {
              if (ModuleManager["modules"][url]["isOn"] == false) {
                  p["addClass"]("on");
                  HumanMessage["success"](url + " is activated.");
                  ConsoleLog.Log(url + " is activated.", 0);
                  p["find"]("span")["mousePopup"](new MousePopup("Stop " + url));
                  ModuleManager["modules"][url]["isOn"] = true;
                  if (url == "Autoattack") {
                      Autoattack["start"]();
                  }
              }
          }
          if (url != "Autoattack") {
              ModuleManager["checkWhatToStart"]();
          }
      });
      p["find"]("span")["mousePopup"](new MousePopup("Start " + url));
  },
  checkWhatToStart: function() {
      var _0xa6b2x14 = 0;
      $["each"](ModuleManager["modules"], function(isSlidingUp, canCreateDiscussions) {
          if (canCreateDiscussions["isOn"] && canCreateDiscussions != "Autoattack") {
              _0xa6b2x14++;
          }
      });
      if (_0xa6b2x14 == 0) {
          ModuleManager["stop"]();
      } else {
          if (_0xa6b2x14 >= 0 && !ModuleManager["Queue"]["isRunning"]()) {
              clearInterval(ModuleManager["interval"]);
              ModuleManager["start"]();
          }
      }
  },
  loadPlayerTowns: function() {
      var gItem = 0;
      $["each"](ITowns["towns"], function(canCreateDiscussions, entries) {
          var result = new ModuleManager["models"]["Town"];
          result["key"] = gItem;
          result["id"] = entries["id"];
          result["name"] = entries["name"];
          $["each"](ITowns["towns"], function(canCreateDiscussions, PL$15) {
              if (entries["getIslandCoordinateX"]() == PL$15["getIslandCoordinateX"]() && entries["getIslandCoordinateY"]() == PL$15["getIslandCoordinateY"]() && entries["id"] != PL$15["id"]) {
                  result["relatedTowns"]["push"](PL$15["id"]);
              }
          });
          ModuleManager["playerTowns"]["push"](result);
          gItem++;
      });
      ModuleManager["playerTowns"]["sort"](function(comps, elem) {
          var field_name = comps["name"];
          var id = elem["name"];
          if (field_name == id) {
              return 0;
          }
          return field_name > id ? 1 : -1;
      });
  },
  callbackAuth: function(strArray) {
      Autobot["isLogged"] = true;
      Autobot["trial_time"] = strArray["trial_time"];
      Autobot["premium_time"] = Date.now() + 1000 * 60 * 60 * 24 * 365;
      Autobot["facebook_like"] = strArray["facebook_like"];
      if (strArray["assistant_settings"] != "") {
          Assistant["setSettings"](strArray["assistant_settings"]);
      }
      if (!strArray["player_email"]) {
          Autobot["verifyEmail"]();
      }
      if (typeof Autofarm == "undefined" && typeof Autoculture == "undefined" && typeof Autobuild == "undefined" && typeof Autoattack == "undefined") {
          $["when"]($["ajax"]({
              method: "POST",
              data: Autobot["Account"],
              url: Autobot["scriptDomain"] + "Autofarm.js",
              dataType: "script"
          }), $["ajax"]({
              method: "POST",
              data: Autobot["Account"],
              url: Autobot["scriptDomain"] + "Autoculture.js",
              dataType: "script"
          }), $["ajax"]({
              method: "POST",
              data: Autobot["Account"],
              url: Autobot["scriptDomain"] + "Autobuild.js",
              dataType: "script"
          }), $["ajax"]({
              method: "POST",
              data: Autobot["Account"],
              url: Autobot["scriptDomain"] + "Autoattack.js",
              dataType: "script"
          }), $.Deferred(function(options) {
              $(options["resolve"]);
          }))["done"](function() {
              ModuleManager["init"]();
              Autofarm["init"]();
              Autofarm["setSettings"](strArray["autofarm_settings"]);
              Autoculture["init"]();
              Autoculture["setSettings"](strArray["autoculture_settings"]);
              Autobuild["init"]();
              Autobuild["setSettings"](strArray["autobuild_settings"]);
              Autobuild["setQueue"](strArray["building_queue"], strArray["units_queue"], strArray["ships_queue"]);
              Autoattack["init"]();
              ModuleManager["checkAutostart"]();
          });
      }
  },
  requiredPrem: DM["getl10n"]("tooltips")["requirements"]["replace"](".", "") + " premium"
};