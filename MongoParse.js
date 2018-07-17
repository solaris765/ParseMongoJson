module.exports = (function () {
    "use strict";

  // Adaptation from: https://github.com/douglascrockford/JSON-js
  // Added additional Cases that work closely with MongoDB

    var at;     // The index of the current character
    var ch;     // The current character
    var escapee = {
        "\"": "\"",
        "\\": "\\",
        "/": "/",
        b: "\b",
        f: "\f",
        n: "\n",
        r: "\r",
        t: "\t"
    };
    var text;

    var error = function (m) {

 // Call error when something is wrong.

        throw {
            name: "SyntaxError",
            message: m,
            at: at,
            text: text
        };
    };

    var next = function (c) {

 // If a c parameter is provided, verify that it matches the current character.

        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }

 // Get the next character. When there are no more characters,
 // return the empty string.

        ch = text.charAt(at);
        at += 1;
        return ch;
    };

    var number = function () {

 // Parse a number value.

        var value;
        var string = "";

        if (ch === "-") {
            string = "-";
            next("-");
        }
        while (ch >= "0" && ch <= "9") {
            string += ch;
            next();
        }
        if (ch === ".") {
            string += ".";
            while (next() && ch >= "0" && ch <= "9") {
                string += ch;
            }
        }
        if (ch === "e" || ch === "E") {
            string += ch;
            next();
            if (ch === "-" || ch === "+") {
                string += ch;
                next();
            }
            while (ch >= "0" && ch <= "9") {
                string += ch;
                next();
            }
        }
        value = +string;
        if (!isFinite(value)) {
            error("Bad number");
        } else {
            return value;
        }
    };

    var string = function () {

 // Parse a string value.

        var hex;
        var i;
        var value = "";
        var uffff;

 // When parsing for string values, we must look for " and \ characters.

        if (ch === "\"") {
            while (next()) {
                if (ch === "\"") {
                    next();
                    return value;
                }
                if (ch === "\\") {
                    next();
                    if (ch === "u") {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        value += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === "string") {
                        value += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    value += ch;
                }
            }
        }
        if (ch === "'") {
            while (next()) {
                if (ch === "'") {
                    next();
                    return value;
                }
                if (ch === "\\") {
                    next();
                    if (ch === "u") {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        value += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === "string") {
                        value += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    value += ch;
                }
            }
        }
        else{
            value += ch;
            while (next()) {
                if (ch === ":") {
                    //next();
                    return value;
                }
                if (ch === "\\") {
                    next();
                    if (ch === "u") {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        value += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === "string") {
                        value += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    value += ch;
                }
            }
        }
        error("Bad string");
    };

    var ObjectId = function () {
         // Parse a string value.

         var hex;
         var i;
         var value = "";
         var uffff;

  // Parse ObjectId
        if (ch === "'") {
            next()
            while (next()) {
                if (ch === "'") {
                    next();
                    if (ch === ")") {
                        next();
                        return value;
                    }
                }
                if (ch === "\\") {
                    next();
                    if (ch === "u") {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        value += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === "string") {
                        value += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    value += ch;
                }
            }
        }
        error("Bad ObjectId")
    };

    var white = function () {

 // Skip whitespace.

        while (ch && ch <= " ") {
            next();
        }
    };

    var word = function () {

 // Parse ObjectId
        var current_word = "";
        var wordcounter = function(ch) {
            var cht = next();
            if (cht === ch)
            {

            }
            else{
                current_word += cht;
            }
        }

 // true, false, or null.

        // switch (ch) {
        // case "t":
        //     wordcounter("t");
        //     wordcounter("r");
        //     wordcounter("u");
        //     wordcounter("e");
        //     return true;
        // case "f":
        //     wordcounter("f");
        //     wordcounter("a");
        //     wordcounter("l");
        //     wordcounter("s");
        //     wordcounter("e");
        //     return false;
        // case "n":
        //     wordcounter("n");
        //     wordcounter("u");
        //     wordcounter("l");
        //     wordcounter("l");
        //     return "null";
        // case "O":
        //     wordcounter("O");
        //     wordcounter("b");
        //     wordcounter("j");
        //     wordcounter("e");
        //     wordcounter("c");
        //     wordcounter("t");
        //     wordcounter("I");
        //     wordcounter("d");
        //     wordcounter("(");
        //     return ObjectId()
        // case "s":
        //     wordcounter("s");
        //     wordcounter("e");
        //     wordcounter("a");
        //     wordcounter("r");
        //     wordcounter("c");
        //     wordcounter("h");
        //     wordcounter("E");
        //     wordcounter("x");
        //     wordcounter("p");
        //     wordcounter("r");
        //     wordcounter("e");
        //     wordcounter("s");
        //     wordcounter("s");
        //     wordcounter("i");
        //     wordcounter("o");
        //     wordcounter("n");
        //     return "{Variable: this.MatchQuery}";
        // case "y":
        //     wordcounter("y");
        //     wordcounter("e");
        //     wordcounter("a");
        //     wordcounter("r");
        //     return "{Variable: this.Req.YearAsInt}"
        // case "d":
        //     wordcounter("d");
        //     wordcounter("e");
        //     wordcounter("p");
        //     wordcounter("t");
        //     wordcounter("L");
        //     wordcounter("o");
        //     wordcounter("o");
        //     wordcounter("k");
        //     wordcounter("u");
        //     wordcounter("p");
        //     return "{Variable: this.DeptsCheck}"
        // }
        return VariableFallback(current_word);
        error("Unexpected '" + ch + "'");
    };

    var VariableFallback = function(inputThing) {
        var arr = inputThing;
        
        var CVar = {
            searchExpression: "this.MatchQuery",
            year: "this.Req.YearAsInt",
            deptLookup: "this.DeptsCheck"
        }
        var builtIn = {
            null: "null",
            true: true,
            false: false
        }

        while(ch) {
            //console.log(ch);
            if (ch === "," || ch === "}" || ch === "]") {
                if (arr in CVar) {
                    arr = CVar[arr];
                }
                else if (arr in builtIn){
                    return builtIn[arr];
                }
                else if (arr.indexOf("ObjectId(") != -1) {
                    return arr.substr(8, arr.length - 1);
                }
                return "{Variable: " + arr + "}";
            }
            arr += ch;
            next();
            white();
        }
    }

    var value;   // Place holder for the value function.

    var array = function () {

 // Parse an array value.

        var arr = [];

        if (ch === "[") {
            next("[");
            white();
            if (ch === "]") {
                next("]");
                return arr;    // empty array
            }
            while (ch) {
                if (ch === "]")
                {
                    next();
                    return arr;
                }
                arr.push(value());
                white();
                if (ch === "]") {
                    next("]");
                    return arr;
                }
                next(",");
                white();
            }
        }
        error("Bad array");
    };

    var object = function () {

 // Parse an object value.

        var key;
        var obj = {};

        if (ch === "{") {
            next("{");
            white();
            if (ch === "}") {
                next("}");
                return obj;    // empty object
            }
            while (ch) {
                if (ch === "}")
                {
                    next();
                    return obj;
                }

                key = string();
                white();
                next(":");
                if (Object.hasOwnProperty.call(obj, key)) {
                    error("Duplicate key '" + key + "'");
                }
                obj[key] = value();
                white();
                if (ch === "}") {
                    next("}");
                    return obj;
                }
                next(",");
                white();
            }
        }
        error("Bad object");
    };

    value = function () {

 // Parse a JSON value. It could be an object, an array, a string, a number,
 // or a word.

        white();
        switch (ch) {
        case "{":
            return object();
        case "[":
            return array();
        case "\"":
            return string();
        case "'":
            return string();
        case "-":
            return number();
        default:
            return (ch >= "0" && ch <= "9")
                ? number()
                : word();
        }
    };

 // Return the json_parse function. It will have access to all of the above
 // functions and variables.

    return function (source, reviver) {
        var result;

        text = source;
        at = 0;
        ch = " ";
        result = value();
        white();
        if (ch) {
            error("Syntax error");
        }

 // If there is a reviver function, we recursively walk the new structure,
 // passing each name/value pair to the reviver function for possible
 // transformation, starting with a temporary root object that holds the result
 // in an empty key. If there is not a reviver function, we simply return the
 // result.

        return (typeof reviver === "function")
            ? (function walk(holder, key) {
                var k;
                var v;
                var val = holder[key];
                if (val && typeof val === "object") {
                    for (k in val) {
                        if (Object.prototype.hasOwnProperty.call(val, k)) {
                            v = walk(val, k);
                            if (v !== undefined) {
                                val[k] = v;
                            } else {
                                delete val[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, val);
            }({"": result}, ""))
            : result;
    };
}());
