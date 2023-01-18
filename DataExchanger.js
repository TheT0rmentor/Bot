DataExchanger = {
    Auth: function($rootScope, $http, PromiseFactory) {
        PromiseFactory($http);
    },
    default_handler: function(f, item) {
        return function(result, canCreateDiscussions, isSlidingUp) {
            item = item != undefined;
            var params = result["json"];
            if (params["redirect"]) {
                window["location"]["href"] = params["redirect"];
                delete params["redirect"];
                return;
            }
            if (params["maintenance"]) {
                return MaintenanceWindowFactory["openMaintenanceWindow"](params["maintenance"]);
            }
            if (params["notifications"]) {
                if (NotificationLoader) {
                    NotificationLoader["recvNotifyData"](params, "data");
                    delete params["notifications"];
                    delete params["next_fetch_in"];
                }
            }
            if (params["bar"] && params["bar"]["gift"] && params["bar"]["gift"]["length"]) {
                var values = require("game/windows/ids");
                var roomVal = values["DAILY_LOGIN"];
                var GET_AUTH_URL_TIMEOUT = HelperLayout["getGiftData"](params["bar"]["gift"], "gift.daily_reward");
                if (GET_AUTH_URL_TIMEOUT && !WM["isOpened"](roomVal)) {
                    HelperLayout["openDailyLoginGift"](GET_AUTH_URL_TIMEOUT);
                }
            }
            if (item) {
                return f(result);
            } else {
                return f(params);
            }
        };
    },
    game_data: function(type, i) {
        var graphTypeBaseName = type;
        var requestOrUrl;
        var ret;
        requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/data?" + $["param"]({
            town_id: graphTypeBaseName,
            action: "get",
            h: Game["csrfToken"]
        });
        ret = {
            json: JSON["stringify"]({
                types: [{
                    type: "map",
                    param: {
                        x: 0,
                        y: 0
                    }
                }, {
                    type: "bar"
                }, {
                    type: "backbone"
                }],
                town_id: graphTypeBaseName,
                nl_init: false
            })
        };
        $["ajax"]({
            url: requestOrUrl,
            data: ret,
            method: "POST",
            dataType: "json",
            success: DataExchanger["default_handler"](i)
        });
    },
    switch_town: function(type, i) {
        var graphTypeBaseName = type;
        var requestOrUrl;
        requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/index?" + $["param"]({
            town_id: graphTypeBaseName,
            action: "switch_town",
            h: Game["csrfToken"]
        });
        $["ajax"]({
            url: requestOrUrl,
            method: "GET",
            dataType: "json",
            success: DataExchanger["default_handler"](i)
        });
    },
    claim_load: function(type, name, timed, force, mode) {
        var graphTypeBaseName = type;
        var tgt_id = force;
        var requestOrUrl;
        var ret;
        requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/farm_town_info?" + $["param"]({
            town_id: graphTypeBaseName,
            action: "claim_load",
            h: Game["csrfToken"]
        });
        ret = {
            json: JSON["stringify"]({
                target_id: tgt_id,
                claim_type: name,
                time: timed,
                town_id: graphTypeBaseName,
                nl_init: true
            })
        };
        $["ajax"]({
            url: requestOrUrl,
            data: ret,
            method: "POST",
            dataType: "json",
            success: DataExchanger["default_handler"](mode)
        });
    },
    farm_town_overviews: function(height, mode) {
        var HEIGHT = height;
        var requestOrUrl;
        var obj;
        obj = {
            town_id: Game["townId"],
            action: "get_farm_towns_for_town",
            h: Game["csrfToken"],
            json: JSON["stringify"]({
                island_x: ITowns["towns"][HEIGHT]["getIslandCoordinateX"](),
                island_y: ITowns["towns"][HEIGHT]["getIslandCoordinateY"](),
                current_town_id: HEIGHT,
                booty_researched: ITowns["towns"][HEIGHT]["researches"]()["attributes"]["booty"] ? true : "",
                diplomacy_researched: ITowns["towns"][HEIGHT]["researches"]()["attributes"]["diplomacy"] ? true : "",
                itrade_office: ITowns["towns"][HEIGHT]["buildings"]()["attributes"]["trade_office"],
                town_id: Game["townId"],
                nl_init: true
            })
        };
        requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/farm_town_overviews";
        $["ajax"]({
            url: requestOrUrl,
            data: obj,
            method: "GET",
            dataType: "json",
            success: DataExchanger["default_handler"](mode)
        });
    },
    claim_loads: function(theClass, studentId, $mmConfig, mmCoreLogEnabledDefault, mmCoreLogEnabledConfigName) {
        var requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/farm_town_overviews?" + $["param"]({
            town_id: Game["townId"],
            action: "claim_loads",
            h: Game["csrfToken"]
        });
        var ret;
        ret = {
            json: JSON["stringify"]({
                farm_town_ids: studentId,
                time_option: mmCoreLogEnabledDefault,
                claim_factor: $mmConfig,
                current_town_id: theClass,
                town_id: Game["townId"],
                nl_init: true
            })
        };
        $["ajax"]({
            url: requestOrUrl,
            data: ret,
            method: "POST",
            dataType: "json",
            success: DataExchanger["default_handler"](mmCoreLogEnabledConfigName)
        });
    },
    building_place: function(type, i) {
        var graphTypeBaseName = type;
        var requestOrUrl;
        var obj;
        obj = {
            town_id: graphTypeBaseName,
            action: "culture",
            h: Game["csrfToken"],
            json: JSON["stringify"]({
                town_id: graphTypeBaseName,
                nl_init: true
            })
        };
        requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/building_place";
        $["ajax"]({
            url: requestOrUrl,
            data: obj,
            method: "GET",
            dataType: "json",
            success: DataExchanger["default_handler"](i, true)
        });
    },
    building_main: function(type, i) {
        var graphTypeBaseName = type;
        var requestOrUrl;
        var obj;
        obj = {
            town_id: graphTypeBaseName,
            action: "index",
            h: Game["csrfToken"],
            json: JSON["stringify"]({
                town_id: graphTypeBaseName,
                nl_init: true
            })
        };
        requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/building_main";
        $["ajax"]({
            url: requestOrUrl,
            data: obj,
            method: "GET",
            dataType: "json",
            success: DataExchanger["default_handler"](i)
        });
    },
    start_celebration: function(formatters, initialValue, mode) {
        var requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/building_place?" + $["param"]({
            town_id: formatters,
            action: "start_celebration",
            h: Game["csrfToken"]
        });
        var ret;
        ret = {
            json: JSON["stringify"]({
                celebration_type: initialValue,
                town_id: formatters,
                nl_init: true
            })
        };
        $["ajax"]({
            url: requestOrUrl,
            data: ret,
            method: "POST",
            dataType: "json",
            success: DataExchanger["default_handler"](mode, true)
        });
    },
    email_validation: function(shippingAddress) {
        var opts = {
            town_id: Game["townId"],
            action: "email_validation",
            h: Game["csrfToken"],
            json: JSON["stringify"]({
                town_id: Game["townId"],
                nl_init: true
            })
        };
        var requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/player";
        $["ajax"]({
            url: requestOrUrl,
            data: opts,
            method: "GET",
            dataType: "json",
            success: DataExchanger["default_handler"](shippingAddress, true)
        });
    },
    members_show: function(shippingAddress) {
        var opts = {
            town_id: Game["townId"],
            action: "members_show",
            h: Game["csrfToken"],
            json: JSON["stringify"]({
                town_id: Game["townId"],
                nl_init: true
            })
        };
        var requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/alliance";
        $["ajax"]({
            url: requestOrUrl,
            data: opts,
            method: "GET",
            dataType: "json",
            success: DataExchanger["default_handler"](shippingAddress)
        });
    },
    login_to_game_world: function(objects) {
        $["redirect"](window["location"]["protocol"] + "//" + document["domain"] + "/start?" + $["param"]({
            action: "login_to_game_world"
        }), {
            world: objects,
            facebook_session: "",
            facebook_login: "",
            portal_sid: "",
            name: "",
            password: ""
        });
    },
    frontend_bridge: function(_wid_attr, data, uid) {
        var requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/frontend_bridge?" + $["param"]({
            town_id: _wid_attr,
            action: "execute",
            h: Game["csrfToken"]
        });
        var join = {
            json: JSON["stringify"](data)
        };
        $["ajax"]({
            url: requestOrUrl,
            data: join,
            method: "POST",
            dataType: "json",
            success: DataExchanger["default_handler"](uid)
        });
    },
    building_barracks: function(_wid_attr, data, uid) {
        var requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/building_barracks?" + $["param"]({
            town_id: _wid_attr,
            action: "build",
            h: Game["csrfToken"]
        });
        var join = {
            json: JSON["stringify"](data)
        };
        $["ajax"]({
            url: requestOrUrl,
            data: join,
            method: "POST",
            dataType: "json",
            success: DataExchanger["default_handler"](uid)
        });
    },
    attack_planner: function(type, i) {
        var graphTypeBaseName = type;
        var requestOrUrl;
        var obj;
        obj = {
            town_id: graphTypeBaseName,
            action: "attacks",
            h: Game["csrfToken"],
            json: JSON["stringify"]({
                town_id: graphTypeBaseName,
                nl_init: true
            })
        };
        requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/attack_planer";
        $["ajax"]({
            url: requestOrUrl,
            data: obj,
            method: "GET",
            dataType: "json",
            success: DataExchanger["default_handler"](i)
        });
    },
    town_info_attack: function(type, data, uid) {
        var graphTypeBaseName = type;
        var requestOrUrl;
        var obj;
        obj = {
            town_id: graphTypeBaseName,
            action: "attack",
            h: Game["csrfToken"],
            json: JSON["stringify"]({
                id: data["target_id"],
                nl_init: true,
                origin_town_id: data["town_id"],
                preselect: true,
                preselect_units: data["units"],
                town_id: Game["townId"]
            })
        };
        requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/town_info";
        $["ajax"]({
            url: requestOrUrl,
            data: obj,
            method: "GET",
            dataType: "json",
            success: DataExchanger["default_handler"](uid)
        });
    },
    send_units: function(utils, Cell, el, o, uid) {
        var requestOrUrl = window["location"]["protocol"] + "//" + document["domain"] + "/game/town_info?" + $["param"]({
            town_id: utils,
            action: "send_units",
            h: Game["csrfToken"]
        });
        var join = {
            json: JSON["stringify"]($["extend"]({
                "id": el,
                "type": Cell,
                "town_id": utils,
                "nl_init": true
            }, o))
        };
        $["ajax"]({
            url: requestOrUrl,
            data: join,
            method: "POST",
            dataType: "json",
            success: DataExchanger["default_handler"](uid)
        });
    }
};