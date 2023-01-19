var Autobot = {
    title: "GrepoBot",
    version: "5.1",
    domain: window.location.protocol + "//bot.grepobot.com/",
    scriptDomain: window.location.protocol + "//cdn.jsdelivr.net/gh/TheT0rmentor/Bot/",
    botWnd: "",
    botPremWnd: "",
    botEmailWnd: "",
    facebookWnd: "",
    isLogged: false,
    Account: {
        player_id: Game.player_id,
        player_name: Game.player_name,
        world_id: Game.world_id,
        locale_lang: Game.locale_lang,
        premium_grepolis: Game.premium_user,
        csrfToken: Game.csrfToken
    },
    trial_time: 0,
    premium_time: 0,
    facebook_like: 0,
    toolbox_element: null,
    init: function() {
        ConsoleLog.Log("Initialize Autobot", 0);
        Autobot.authenticate();
        Autobot.obServer();
        Autobot.isActive();
        Autobot.setToolbox();
        Autobot.initAjax();
        Autobot.initMapTownFeature();
        Autobot.fixMessage();
        Assistant.init();
    },
    setToolbox: function() {
        Autobot.toolbox_element = $(".nui_bot_toolbox");
    },
    authenticate: function() {
        DataExchanger.Auth("login", Autobot.Account, function(modules) {
            ModuleManager.callbackAuth(modules);
        });
    },
    obServer: function() {
        $.Observer(GameEvents.notification.push).subscribe("GRCRTNotification", function() {
            $("#notification_area>.notification.getPremiumNotification").on("click", function() {
                Autobot.getPremium();
            });
        });
    },
    initWnd: function() {
        if (Autobot.isLogged) {
            if (void 0 !== Autobot.botWnd) {
                try {
                    Autobot.botWnd.close();
                } catch (t) {}
                Autobot.botWnd = void 0;
            }
            if (void 0 !== Autobot.botPremWnd) {
                try {
                    Autobot.botPremWnd.close();
                } catch (t) {}
                Autobot.botPremWnd = void 0;
            }
            Autobot.botWnd = Layout.dialogWindow.open("", Autobot.title , 500, 350, "", false);
            Autobot.botWnd.setHeight([350]);
            Autobot.botWnd.setPosition(["center", "center"]);
            var $jRate = Autobot.botWnd.getJQElement();
            $jRate.append($("<div/>", {
                class: "menu_wrapper",
                style: "left: -42px; top: 8px; right: 14px;"
            }).append($("<ul/>", {
                class: "menu_inner"
            }).prepend(Autobot.addMenuItem("AUTHORIZE", "Account", "Account")).prepend(Autobot.addMenuItem("CONSOLE", "Assistant", "Assistant")).prepend(Autobot.addMenuItem("ASSISTANT", "Console", "Console"))));
            if ("undefined" != typeof Autoattack) {
                $jRate.find(".menu_inner li:last-child").before(Autobot.addMenuItem("ATTACKMODULE", "Attack", "Autoattack"));
            }
            if ("undefined" != typeof Autobuild) {
                $jRate.find(".menu_inner li:last-child").before(Autobot.addMenuItem("CONSTRUCTMODULE", "Build", "Autobuild"));
            }
            if ("undefined" != typeof Autoculture) {
                $jRate.find(".menu_inner li:last-child").before(Autobot.addMenuItem("CULTUREMODULE", "Culture", "Autoculture"));
            }
            if ("undefined" != typeof Autofarm) {
                $jRate.find(".menu_inner li:last-child").before(Autobot.addMenuItem("FARMMODULE", "Farm", "Autofarm"));
            }
            $("#Autobot-AUTHORIZE").click();
        }
    },
    addMenuItem: function(db, name, id) {
        return $("<li/>").append($("<a/>", {
            class: "submenu_link",
            href: "#",
            id: "Autobot-" + db,
            rel: id
        }).click(function() {
            if (Autobot.botWnd.getJQElement().find("li a.submenu_link").removeClass("active"), $(this).addClass("active"), Autobot.botWnd.setContent2(Autobot.getContent($(this).attr("rel"))), "Console" == $(this).attr("rel")) {
                var objConversationBlock = $(".terminal");
                var height = $(".terminal-output")[0].scrollHeight;
                objConversationBlock.scrollTop(height);
            }
        }).append(function() {
            return "Support" != id ? $("<span/>", {
                class: "left"
            }).append($("<span/>", {
                class: "right"
            }).append($("<span/>", {
                class: "middle"
            }).html(name))) : '<a id="help-button" onclick="return false;" class="confirm"></a>';
        }));
    },
    getContent: function(id) {
        return "Console" == id ? ConsoleLog.contentConsole() : "Account" == id ? Autobot.contentAccount() : "Support" != id ? void 0 !== window[id] ? window[id].contentSettings() : "" : void console.log("GrepoBot: SupportBTN Clicked");
    },
    contentAccount: function() {
        var list = {
            "Name:": Game.player_name,
            "World:": Game.world_id,
            "Rank:": Game.player_rank,
            "Towns:": Game.player_villages,
            "Language:": Game.locale_lang,
            "Premium: ": "[JDM TEAM]"
        };
        var id4 = $("<table/>", {
            class: "game_table layout_main_sprite",
            cellspacing: "0",
            width: "100%"
        }).append(function() {
            var o = 0;
            var dest = $("<tbody/>");
            return $.each(list, function(newTabContent, n) {
                dest.append($("<tr/>", {
                    class: o % 2 ? "game_table_even" : "game_table_odd"
                }).append($("<td/>", {
                    style: "background-color: #DFCCA6;width: 30%;"
                }).html(newTabContent)).append($("<td/>").html(n)));
                o++;
            }), dest;
        });
        var html = FormBuilder.gameWrapper("Account", "account_property_wrapper", id4, "margin-bottom:9px;")[0].outerHTML;
        return html = html + $("<div/>", {
            id: "grepobanner",
            style: ""
        })[0].outerHTML;
    },
    contentSupport: function() {
        console.log("GrepoBot: Support Window would load.");
    },
    checkAlliance: function() {
        if (!$(".allianceforum.main_menu_item").hasClass("disabled")) {
            DataExchanger.members_show(function(res) {
                if (null != res.plain.html) {
                    jQuery.each($(res.plain.html).find("#ally_members_body .ally_name a"), function() {
                        var plainText = atob($(this).attr("href"));
                        console.log(JSON.parse(plainText.substr(0, plainText.length - 3)));
                    });
                }
            });
        }
    },
    fixMessage: function() {
        var oldSetupComputes;
        HumanMessage._initialize = (oldSetupComputes = HumanMessage._initialize, function() {
            oldSetupComputes.apply(this, arguments);
            $(window).unbind("click");
        });
    },
    getPremium: function() {
        if (Autobot.isLogged) {
            if ($.Observer(GameEvents.menu.click).publish({
                    option_id: "premium"
                }), void 0 !== Autobot.botPremWnd) {
                try {
                    Autobot.botPremWnd.close();
                } catch (t) {}
                Autobot.botPremWnd = void 0;
            }
            if (void 0 !== Autobot.botWnd) {
                try {
                    Autobot.botWnd.close();
                } catch (t) {}
                Autobot.botWnd = void 0;
            }
            Autobot.botPremWnd = Layout.dialogWindow.open("", "Autobot v" + Autobot.version + " - Premium", 500, 350, "", false);
            Autobot.botPremWnd.setHeight([350]);
            Autobot.botPremWnd.setPosition(["center", "center"]);
            var artistTrack = $("<div/>", {
                id: "payment"
            }).append($("<div/>", {
                id: "left"
            }).append($("<ul/>", {
                id: "time_options"
            }).append($("<li/>", {
                class: "active"
            }).append($("<span/>", {
                class: "amount"
            }).html("1 Month")).append($("<span/>", {
                class: "price"
            }).html("\u20ac&nbsp;4,99"))).append($("<li/>").append($("<span/>", {
                class: "amount"
            }).html("2 Month")).append($("<span/>", {
                class: "price"
            }).html("\u20ac&nbsp;9,99")).append($("<div/>", {
                class: "referenceAmount"
            }).append($("<div/>", {
                class: "reference",
                style: "transform: rotate(17deg);"
            }).html("+12 Days&nbsp;")))).append($("<li/>").append($("<span/>", {
                class: "amount"
            }).html("4 Months")).append($("<span/>", {
                class: "price"
            }).html("\u20ac&nbsp;19,99")).append($("<div/>", {
                class: "referenceAmount"
            }).append($("<div/>", {
                class: "reference",
                style: "transform: rotate(17deg);"
            }).html("+36 Days&nbsp;")))).append($("<li/>").append($("<span/>", {
                class: "amount"
            }).html("10 Months")).append($("<span/>", {
                class: "price"
            }).html("\u20ac&nbsp;49,99")).append($("<div/>", {
                class: "referenceAmount"
            }).append($("<div/>", {
                class: "reference",
                style: "transform: rotate(17deg);"
            }).html("+120 Days&nbsp;")))))).append($("<div/>", {
                id: "right"
            }).append($("<div/>", {
                id: "pothead"
            })).append($("<div/>", {
                id: "information"
            }).append($("<span/>", {
                class: "text"
            }).html("1 month for only \u20ac4,99")).append($("<span/>", {
                class: "button"
            }).html("Buy"))));
            Autobot.botPremWnd.setContent2(artistTrack);
            var o = 0;
            $("#time_options li").on("click", function() {
                $("#time_options li").removeClass("active");
                $(this).addClass("active");
                o = $(this).index();
                var subtitles_selector = $("#payment #information .text");
                if (0 == o) {
                    subtitles_selector.html("1 month for only \u20ac4,99");
                } else {
                    if (1 == o) {
                        subtitles_selector.html("2 month +12 days for only \u20ac9,99");
                    } else {
                        if (2 == o) {
                            subtitles_selector.html("4 months +36 days for only \u20ac19,99");
                        } else {
                            if (3 == o) {
                                subtitles_selector.html("10 months +120 days for only \u20ac49,99");
                            }
                        }
                    }
                }
            });
            $("#payment #information").on("click", function() {
                var _oauthWindow = window.open(Autobot.domain + "paypal/process.php?payment=" + o + "&player_id=" + Autobot.Account.player_id, "grepolis_payment", "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,height=650,width=800");
                var chat_retry = setInterval(function() {
                    if (!(_oauthWindow && !_oauthWindow.closed)) {
                        clearInterval(chat_retry);
                        Autobot.authenticate();
                    }
                }, 500);
            });
        }
    },
    botFacebookWnd: function() {
        console.log("GrepoBot: Facebook Window would show");
    },
    upgrade3Days: function() {
        console.log("GrepoBot: 3day Upgrade called.");
    },
    initAjax: function() {
        $(document).ajaxComplete(function(canCreateDiscussions, xhr, lbit) {
            if (-1 == lbit.url.indexOf(Autobot.domain) && -1 == lbit.url.indexOf(Autobot.scriptDomain) && -1 != lbit.url.indexOf("/game/") && 4 == xhr.readyState && 200 == xhr.status) {
                var tableMatches = lbit.url.split("?");
                var otherCall = tableMatches[0].substr(6) + "/" + tableMatches[1].split("&")[1].substr(7);
                if ("undefined" != typeof Autobuild) {
                    Autobuild.calls(otherCall);
                }
                if ("undefined" != typeof Autoattack) {
                    Autoattack.calls(otherCall, xhr.responseText);
                }
            }
        });
    },
    verifyEmail: function() {
        if (Autobot.isLogged) {
            DataExchanger.email_validation(function(res) {
                if (null != res.plain.html) {
                    DataExchanger.Auth("verifyEmail", {
                        key: btoa(Autobot.stringify({
                            player_id: Autobot.Account.player_id,
                            player_email: $(res.plain.html).find("#current_email_adress").html()
                        }))
                    }, function(SMessage) {
                        if (null != SMessage.success) {
                            Autobot.arrowActivated();
                        }
                    });
                }
            });
        }
    },
    randomize: function(src, dst) {
        return Math.floor(Math.random() * (dst - src + 1)) + src;
    },
    secondsToTime: function(secs) {
        var weeks = Math.floor(secs / 86400);
        var days = Math.floor(secs % 86400 / 3600);
        var inPropertyPath = Math.floor(secs % 86400 % 3600 / 60);
        return (weeks ? weeks + " days " : "") + (days ? days + " hours " : "") + (inPropertyPath ? inPropertyPath + " minutes " : "");
    },
    timeToSeconds: function(hhmmss) {
        var deadPool = hhmmss.split(":");
        var currentSamplingIntervalMs = 0;
        var alpha = 1;
        for (; deadPool.length > 0;) {
            currentSamplingIntervalMs = currentSamplingIntervalMs + alpha * parseInt(deadPool.pop(), 10);
            alpha = alpha * 60;
        }
        return currentSamplingIntervalMs;
    },
    arrowActivated: function() {
        var focusOverlay = $("<div/>", {
            class: "helpers helper_arrow group_quest d_w animate bounce",
            "data-direction": "w",
            style: "top: 0; left: 360px; visibility: visible; display: none;"
        });
        Autobot.toolbox_element.append(focusOverlay);
        focusOverlay.show().animate({
            left: "138px"
        }, "slow").delay(1E4).fadeOut("normal");
        setTimeout(function() {
            Autobot.botFacebookWnd();
        }, 25E3);
    },
    createNotification: function(notificationVersion, targetUserApiKey) {
        (void 0 === Layout.notify ? new NotificationHandler : Layout).notify($("#notification_area>.notification").length + 1, notificationVersion, "<span><b>Autobot</b></span>" + targetUserApiKey + "<span class='small notification_date'>Version " + Autobot.version + "</span>");
    },
    toHHMMSS: function(seconds) {
        var casesCount = ~~(seconds / 3600);
        var curHour = ~~(seconds % 3600 / 60);
        var s = seconds % 60;
        return ret = "", casesCount > 0 && (ret = ret + (casesCount + ":" + (curHour < 10 ? "0" : ""))), ret = ret + (curHour + ":" + (s < 10 ? "0" : "")), ret = ret + ("" + s), ret;
    },
    stringify: function(obj) {
        var t = typeof obj;
        if ("string" === t) {
            return '"' + obj + '"';
        }
        if ("boolean" === t || "number" === t) {
            return obj;
        }
        if ("function" === t) {
            return obj.toString();
        }
        var drilldownLevelLabels = [];
        var i;
        for (i in obj) {
            drilldownLevelLabels.push('"' + i + '":' + this.stringify(obj[i]));
        }
        return "{" + drilldownLevelLabels.join(",") + "}";
    },
    isActive: function() {
        setTimeout(function() {
            DataExchanger.Auth("isActive", Autobot.Account, Autobot.isActive);
        }, 18E4);
    },
    town_map_info: function(obj, json) {
        if (null != obj && obj.length > 0 && json.player_name) {
            var i = 0;
            for (; i < obj.length; i++) {
                if ("flag town" == obj[i].className) {
                    if ("undefined" != typeof Assistant) {
                        if (Assistant.settings.town_names) {
                            $(obj[i]).addClass("active_town");
                        }
                        if (Assistant.settings.player_name) {
                            $(obj[i]).addClass("active_player");
                        }
                        if (Assistant.settings.alliance_name) {
                            $(obj[i]).addClass("active_alliance");
                        }
                    }
                    $(obj[i]).append('<div class="player_name">' + (json.player_name || "") + "</div>");
                    $(obj[i]).append('<div class="town_name">' + json.name + "</div>");
                    $(obj[i]).append('<div class="alliance_name">' + (json.alliance_name || "") + "</div>");
                    break;
                }
            }
        }
        return obj;
    },
    checkPremium: function(prefix) {
        return $(".advisor_frame." + prefix + " div").hasClass(prefix + "_active");
    },
    initWindow: function() {
        $(".nui_main_menu").css("top", "249px");
        $("<div/>", {
            class: "nui_bot_toolbox"
        }).append($("<div/>", {
            class: "bot_menu layout_main_sprite"
        }).append($("<ul/>").append($("<li/>", {
            id: "Autofarm_onoff",
            class: "disabled"
        }).append($("<span/>", {
            class: "autofarm farm_town_status_0"
        }))).append($("<li/>", {
            id: "Autoculture_onoff",
            class: "disabled"
        }).append($("<span/>", {
            class: "autoculture farm_town_status_0"
        }))).append($("<li/>", {
            id: "Autobuild_onoff",
            class: "disabled"
        }).append($("<span/>", {
            class: "autobuild toolbar_activities_recruits"
        }))).append($("<li/>", {
            id: "Autoattack_onoff",
            class: "disabled"
        }).append($("<span/>", {
            class: "autoattack sword_icon"
        }))).append($("<li/>").append($("<span/>", {
            href: "#",
            class: "botsettings circle_button_settings"
        }).on("click", function() {
            if (Autobot.isLogged) {
                Autobot.initWnd();
            }
        }).mousePopup(new MousePopup(DM.getl10n("COMMON").main_menu.settings)))))).append($("<div/>", {
            id: "time_autobot",
            class: "time_row"
        })).append($("<div/>", {
            class: "bottom"
        })).insertAfter(".nui_left_box");
    },
    initMapTownFeature: function() {
        var oldSetupComputes;
        MapTiles.createTownDiv = (oldSetupComputes = MapTiles.createTownDiv, function() {
            var boundFunction = oldSetupComputes.apply(this, arguments);
            return Autobot.town_map_info(boundFunction, arguments[0]);
        });
    },
    checkAutoRelogin: function() {
        if (void 0 !== $.cookie("pid") && void 0 !== $.cookie("ig_conv_last_site")) {
            var initialMock = $.cookie("ig_conv_last_site").match(/\/\/(.*?)\.grepolis\.com/g)[0].replace("//", "").replace(".grepolis.com", "");
            DataExchanger.Auth("checkAutorelogin", {
                player_id: $.cookie("pid"),
                world_id: initialMock
            }, function(delayedBy) {
                if (0 != delayedBy) {
                    setTimeout(function() {
                        DataExchanger.login_to_game_world(initialMock);
                    }, 1E3 * delayedBy);
                }
            });
        }
    }
};
! function() {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        return $.each(a, function() {
            if (void 0 !== o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || "");
            } else {
                o[this.name] = this.value || "";
            }
        }), o;
    };
    var chat_retry = setInterval(function() {
        if (null != window) {
            if ($(".nui_main_menu").length && !$.isEmptyObject(ITowns.towns)) {
                clearInterval(chat_retry);
                Autobot.initWindow();
                Autobot.initMapTownFeature();
                $.getScript(Autobot.scriptDomain + "Evaluate.js", function() {
                    $.when($.getScript(Autobot.scriptDomain + "DataExchanger.js"), $.getScript(Autobot.scriptDomain + "ConsoleLog.js"), $.getScript(Autobot.scriptDomain + "FormBuilder.js"), $.getScript(Autobot.scriptDomain + "ModuleManager.js"), $.getScript(Autobot.scriptDomain + "Assistant.js"), $.Deferred(function(t) {
                        $(t.resolve);
                    })).done(function() {
                        Autobot.init();
                    });
                });
            } else {
                if (/grepolis\.com\/start\?nosession/g.test(window.location.href)) {
                    clearInterval(chat_retry);
                    $.getScript(Autobot.scriptDomain + "Evaluate.js", function() {
                        $.when($.getScript(Autobot.scriptDomain + "DataExchanger.js"), $.getScript(Autobot.scriptDomain + "Redirect.js"), $.Deferred(function(t) {
                            $(t.resolve);
                        })).done(function() {
                            Autobot.checkAutoRelogin();
                        });
                    });
                }
            }
        }
    }, 1E3);
}();
