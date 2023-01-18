Assistant = {
    settings: {
        town_names: true,
        player_name: true,
        alliance_name: false,
        auto_relogin: 0
    },
    init: function() {
        ConsoleLog.Log("Initialize Assistant", 0);
    },
    setSettings: function(data) {
        if (data != "" && data != null) {
            $["extend"](Assistant["settings"], JSON["parse"](data));
        }
        Assistant["initSettings"]();
    },
    initSettings: function() {
        if (Assistant["settings"]["town_names"]) {
            $("#map_towns .flag")["addClass"]("active_town");
        } else {
            $("#map_towns .flag")["removeClass"]("active_town");
        }
        if (Assistant["settings"]["player_name"]) {
            $("#map_towns .flag")["addClass"]("active_player");
        } else {
            $("#map_towns .flag")["removeClass"]("active_player");
        }
        if (Assistant["settings"]["alliance_name"]) {
            $("#map_towns .flag")["addClass"]("active_alliance");
        } else {
            $("#map_towns .flag")["removeClass"]("active_alliance");
        }
    },
    contentSettings: function() {
        return $("<fieldset/>", {
            "id": "Assistant_settings",
            "style": "float:left; width:472px;height: 270px;"
        })["append"]($("<legend/>")["html"]("Assistant Settings"))["append"](FormBuilder["checkbox"]({
            "text": "Show town names on island view.",
            "id": "assistant_town_names",
            "name": "assistant_town_names",
            "checked": Assistant["settings"]["town_names"]
        }))["append"](FormBuilder["checkbox"]({
            "text": "Show player names on island view.",
            "id": "assistant_player_names",
            "name": "assistant_player_names",
            "checked": Assistant["settings"]["player_name"]
        }))["append"](FormBuilder["checkbox"]({
            "text": "Show alliance names on island view.",
            "id": "assistant_alliance_names",
            "name": "assistant_alliance_names",
            "checked": Assistant["settings"]["alliance_name"]
        }))["append"](FormBuilder["selectBox"]({
            id: "assistant_auto_relogin",
            name: "assistant_auto_relogin",
            label: "Auto re-login: ",
            styles: "width: 120px;",
            value: Assistant["settings"]["auto_relogin"],
            options: [{
                value: "0",
                name: "Disabled"
            }, {
                value: "120",
                name: "After 2 minutes"
            }, {
                value: "300",
                name: "After 5 minutes"
            }, {
                value: "600",
                name: "After 10 minutes"
            }, {
                value: "900",
                name: "After 15 minutes"
            }]
        }))["append"](FormBuilder["button"]({
            name: DM["getl10n"]("notes")["btn_save"],
            style: "top: 120px;"
        })["on"]("click", function() {
            var sArrDayId = $("#Assistant_settings")["serializeObject"]();
            Assistant["settings"]["town_names"] = sArrDayId["assistant_town_names"] != undefined;
            Assistant["settings"]["player_name"] = sArrDayId["assistant_player_names"] != undefined;
            Assistant["settings"]["alliance_name"] = sArrDayId["assistant_alliance_names"] != undefined;
            Assistant["settings"]["auto_relogin"] = parseInt(sArrDayId["assistant_auto_relogin"]);
            DataExchanger.Auth("saveAssistant", {
                player_id: Autobot["Account"]["player_id"],
                world_id: Autobot["Account"]["world_id"],
                csrfToken: Autobot["Account"]["csrfToken"],
                assistant_settings: Autobot["stringify"](Assistant["settings"])
            }, Assistant["callbackSave"]);
        }));
    },
    callbackSave: function() {
        HumanMessage["success"]("The settings were saved!");
        Assistant["initSettings"]();
    }
};