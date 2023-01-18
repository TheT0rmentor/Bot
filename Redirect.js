(function($) {
    $["redirect"] = function(el, result, context, value) {
      context = context && context["toUpperCase"]() === "GET" ? "GET" : "POST";
      if (!result) {
        var params = $["parseUrl"](el);
        el = params["url"];
        result = params["params"];
      }
      var key = $("<form>")["attr"]("method", context)["attr"]("action", el);
      if (value) {
        key["attr"]("target", value);
      }
      parse(result, [], key);
      $("body")["append"](key);
      key[0]["submit"]();
    };
    $["parseUrl"] = function($) {
      if ($["indexOf"]("?") === -1) {
        return {
          url : $,
          params : {}
        };
      }
      var tiledImageBRs = $["split"]("?");
      var tiledImageBR = tiledImageBRs[1];
      var params = tiledImageBR["split"]("&");
      $ = tiledImageBRs[0];
      var i;
      var env_data;
      var img_envs = {};
      i = 0;
      for (; i < params["length"]; i = i + 1) {
        env_data = params[i]["split"]("=");
        img_envs[env_data[0]] = env_data[1];
      }
      return {
        url : $,
        params : img_envs
      };
    };
    var callback = function(result, value, next, prop) {
      var s;
      if (next["length"] > 0) {
        s = next[0];
        var i;
        i = 1;
        for (; i < next["length"]; i = i + 1) {
          s = s + ("[" + next[i] + "]");
        }
        if (prop) {
          result = s + "[]";
        } else {
          result = s + "[" + result + "]";
        }
      }
      return $("<input>")["attr"]("type", "hidden")["attr"]("name", result)["attr"]("value", value);
    };
    var parse = function(data, p, d, process) {
      var x;
      var a = [];
      for (x in data) {
        if (typeof data[x] === "object") {
          a = p["slice"]();
          if (process) {
            a["push"]("");
          } else {
            a["push"](x);
          }
          parse(data[x], a, d, Array["isArray"](data[x]));
        } else {
          d["append"](callback(x, data[x], p, process));
        }
      }
    };
  })(window["jQuery"] || window["Zepto"] || window["jqlite"]);
  