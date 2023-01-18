ConsoleLog = {
    Logs: [],
    Types: ["Autobot", "Farming", "Culture", "Builder", "Attack "],
    scrollInterval: "",
    scrollUpdate: true,
    contentConsole: function() {
        var nums = $("<fieldset/>", {
            "style": "float:left; width:472px;"
        })["append"]($("<legend/>")["html"]("Autobot Console"))["append"]($("<div/>", {
            "class": "terminal"
        })["append"]($("<div/>", {
            "class": "terminal-output"
        }))["scroll"](function() {
            ConsoleLog.LogScrollBottom();
        }));
        var a = nums["find"](".terminal-output");
        $["each"](ConsoleLog.Logs, function(canCreateDiscussions, x) {
            a["append"](x);
        });
        return nums;
    },
    Log: function(level, text) {
        function log(i) {
            return i < 10 ? "0" + i : i;
        }
        if (this["Logs"]["length"] >= 500) {
            this["Logs"]["shift"]();
        }
        var expected_date2 = new Date;
        var _0x7a76xa = log(expected_date2["getHours"]()) + ":" + log(expected_date2["getMinutes"]()) + ":" + log(expected_date2["getSeconds"]());
        var scrollbarHelpers = $("<div/>")["append"]($("<div/>", {
            "style": "width: 100%;"
        })["html"](_0x7a76xa + " - " + "[" + ConsoleLog["Types"][text] + "]: " + level));
        this["Logs"]["push"](scrollbarHelpers);
        var $wrapper = $(".terminal-output");
        if ($wrapper["length"]) {
            $wrapper["append"](scrollbarHelpers);
            if (this["scrollUpdate"]) {
                var $area = $(".terminal");
                var scroll = $(".terminal-output")[0]["scrollHeight"];
                $area["scrollTop"](scroll);
            }
        }
    },
    LogScrollBottom: function() {
        clearInterval(this["scrollInterval"]);
        var element = $(".terminal");
        var style = $(".terminal-output");
        if (element["scrollTop"]() + element["height"]() == style["height"]()) {
            this["scrollUpdate"] = true;
        } else {
            this["scrollUpdate"] = false;
        }
        var selector = style[0]["scrollHeight"];
        this["scrollInterval"] = setInterval(function() {
            element["scrollTop"](selector);
        }, 7000);
    }
};