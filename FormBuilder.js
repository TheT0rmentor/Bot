FormBuilder = {
    button: function(buttonDescr) {
        return $("<div/>")["append"]($("<a/>", {
            "class": "button_new" + (buttonDescr["class"] || ""),
            "href": "#",
            "style": "margin-top:1px;float:left;" + (buttonDescr["style"] || "")
        })["append"]($("<span/>", {
            "class": "left"
        }))["append"]($("<span/>", {
            "class": "right"
        }))["append"]($("<div/>", {
            "class": "caption js-caption"
        })["text"](buttonDescr["name"])));
    },
    checkbox: function(props, callback, prop) {
        return $("<div/>", {
            "class": "checkbox_new" + (props["checked"] ? " checked" : "") + (props["disabled"] ? " disabled" : ""),
            "style": "padding: 5px;" + (props["style"] || "")
        })["append"]($("<input/>", {
            "type": "checkbox",
            "name": props["name"],
            "id": props["id"],
            "checked": props["checked"],
            "style": "display: none;"
        }))["append"]($("<div/>", {
            "class": "cbx_icon",
            "rel": props["name"]
        }))["append"]($("<div/>", {
            "class": "cbx_caption"
        })["text"](props["text"]))["bind"]("click", function() {
            $(this)["toggleClass"]("checked");
            $(this)["find"]($('input[type="checkbox"]'))["prop"]("checked", $(this)["hasClass"]("checked"));
            if ($(this)["hasClass"]("checked")) {
                if (callback != undefined) {
                    callback();
                }
            } else {
                if (prop != undefined) {
                    prop();
                }
            }
        });
    },
    input: function(data) {
        return $("<div/>", {
            "style": "padding: 5px;"
        })["append"]($("<label/>", {
            "for": data["id"]
        })["text"](data["name"] + ": "))["append"]($("<div/>", {
            "class": "textbox",
            "style": data["style"]
        })["append"]($("<div/>", {
            "class": "left"
        }))["append"]($("<div/>", {
            "class": "right"
        }))["append"]($("<div/>", {
            "class": "middle"
        })["append"]($("<div/>", {
            "class": "ie7fix"
        })["append"]($("<input/>", {
            "type": data["type"],
            "tabindex": "1",
            "id": data["id"],
            "name": data["id"],
            "value": data["value"]
        })["attr"]("size", data["size"])))));
    },
    textarea: function(fields) {
        return $("<div/>", {
            "style": "padding: 5px;"
        })["append"]($("<label/>", {
            "for": fields["id"]
        })["text"](fields["name"] + ": "))["append"]($("<div/>")["append"]($("<textarea/>", {
            "name": fields["id"],
            "id": fields["id"]
        })));
    },
    inputMinMax: function(data) {
        return $("<div/>", {
            "class": "textbox"
        })["append"]($("<span/>", {
            "class": "grcrt_spinner_btn grcrt_spinner_down",
            "rel": data["name"]
        })["click"](function() {
            var values = $(this)["parent"]()["find"]("#" + $(this)["attr"]("rel"));
            if (parseInt($(values)["attr"]("min")) < parseInt($(values)["attr"]("value"))) {
                $(values)["attr"]("value", parseInt($(values)["attr"]("value")) - 1);
            }
        }))["append"]($("<div/>", {
            "class": "textbox",
            "style": data["style"]
        })["append"]($("<div/>", {
            "class": "left"
        }))["append"]($("<div/>", {
            "class": "right"
        }))["append"]($("<div/>", {
            "class": "middle"
        })["append"]($("<div/>", {
            "class": "ie7fix"
        })["append"]($("<input/>", {
            "type": "text",
            "tabindex": "1",
            "id": data["name"],
            "value": data["value"],
            "min": data["min"],
            "max": data["max"]
        })["attr"]("size", data["size"] || 10)["css"]("text-align", "right")))))["append"]($("<span/>", {
            "class": "grcrt_spinner_btn grcrt_spinner_up",
            "rel": data["name"]
        })["click"](function() {
            var values = $(this)["parent"]()["find"]("#" + $(this)["attr"]("rel"));
            if (parseInt($(values)["attr"]("max")) > parseInt($(values)["attr"]("value"))) {
                $(values)["attr"]("value", parseInt($(values)["attr"]("value")) + 1);
            }
        }));
    },
    inputSlider: function(input) {
        return $("<div/>", {
            "id": "grcrt_" + input["name"] + "_config"
        })["append"]($("<div/>", {
            "class": "slider_container"
        })["append"]($("<div/>", {
            "style": "float:left;width:120px;"
        })["html"](input["name"]))["append"](FormBuilder["input"]({
            "name": "grcrt_" + input["name"] + "_value",
            "style": "float:left;width:33px;"
        })["hide"]())["append"]($("<div/>", {
            "class": "windowmgr_slider",
            "style": "width: 200px;float: left;"
        })["append"]($("<div/>", {
            "class": "grepo_slider sound_volume"
        }))))["append"]($("<script/>", {
            "type": "text/javascript"
        })["text"]("" + "RepConv.slider = $('#grcrt_" + input["name"] + "_config .sound_volume').grepoSlider({\n" + "min: 0,\n" + "max: 100,\n" + "step: 5,\n" + "value: " + input["volume"] + ",\n" + "template: 'tpl_grcrt_slider'\n" + "}).on('sl:change:value', function (e, _sl, value) {\n" + "$('#grcrt_" + input["name"] + "_value').attr('value',value);\n" + "if (RepConv.audio.test != undefined){\n" + "RepConv.audio.test.volume = value/100;\n" + "}\n" + "}),\n" + "$('#grcrt_" + input["name"] + "_config .button_down').css('background-position','-144px 0px;'),\n" +
            "$('#grcrt_" + input["name"] + "_config .button_up').css('background-position','-126px 0px;')\n" + ""));
    },
    selectBox: function(options) {
        return $("<div/>", {
            "style": "padding: 5px"
        })["append"]($("<input/>", {
            "type": "hidden",
            "name": options["name"],
            "id": options["id"],
            "value": options["value"]
        }))["append"]($("<label/>", {
            "for": options["id"]
        })["text"](options["label"]))["append"]($("<div/>", {
            "id": options["id"],
            "class": "dropdown default",
            "style": options["styles"]
        })["dropdown"]({
            list_pos: "left",
            value: options["value"],
            disabled: options["disabled"] || false,
            options: options["options"]
        })["on"]("dd:change:value", function(canCreateDiscussions, value) {
            $("#" + options["id"])["attr"]("value", value);
        }));
    },
    timerBoxFull: function(map) {
        return $("<div/>", {
            "class": "single-progressbar instant_buy js-progressbar type_building_queue",
            "id": map["id"],
            "style": map["styles"]
        })["append"]($("<div/>", {
            "class": "border_l"
        }))["append"]($("<div/>", {
            "class": "border_r"
        }))["append"]($("<div/>", {
            "class": "body"
        }))["append"]($("<div/>", {
            "class": "progress"
        })["append"]($("<div/>", {
            "class": "indicator",
            "style": "width: 0%;"
        })))["append"]($("<div/>", {
            "class": "caption"
        })["append"]($("<span/>", {
            "class": "text"
        }))["append"]($("<span/>", {
            "class": "value_container"
        })["append"]($("<span/>", {
            "class": "curr"
        })["html"]("0%"))));
    },
    timerBoxSmall: function(tags) {
        return $("<div/>", {
            "class": "single-progressbar instant_buy js-progressbar type_building_queue",
            "id": tags["id"],
            "style": tags["styles"]
        })["append"]($("<div/>", {
            "class": "progress"
        })["append"]($("<div/>", {
            "class": "indicator",
            "style": "width: 0%;"
        })))["append"]($("<div/>", {
            "class": "caption"
        })["append"]($("<span/>", {
            "class": "text"
        }))["append"]($("<span/>", {
            "class": "value_container"
        })["append"]($("<span/>", {
            "class": "curr"
        })["html"](tags["text"] ? tags["text"] : "-"))));
    },
    gameWrapper: function(html, compressHead, val, opt_validate) {
        return $("<div/>", {
            "class": "game_inner_box",
            "style": opt_validate,
            "id": compressHead
        })["append"]($("<div/>", {
            "class": "game_border"
        })["append"]($("<div/>", {
            "class": "game_border_top"
        }))["append"]($("<div/>", {
            "class": "game_border_bottom"
        }))["append"]($("<div/>", {
            "class": "game_border_left"
        }))["append"]($("<div/>", {
            "class": "game_border_right"
        }))["append"]($("<div/>", {
            "class": "game_border_top"
        }))["append"]($("<div/>", {
            "class": "game_border_corner corner1"
        }))["append"]($("<div/>", {
            "class": "game_border_corner corner2"
        }))["append"]($("<div/>", {
            "class": "game_border_corner corner3"
        }))["append"]($("<div/>", {
            "class": "game_border_corner corner4"
        }))["append"]($("<div/>", {
            "class": "game_header bold",
            "id": "settings_header"
        })["html"](html))["append"]($("<div/>")["append"](val)));
    }
};