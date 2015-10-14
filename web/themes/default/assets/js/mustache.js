/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
;
var Mustache = (typeof module !== "undefined" && module.exports) || {}; (function(w) {
    w.name = "mustache.js";
    w.version = "0.5.0-dev";
    w.tags = ["<%", "%>"];
    w.parse = m;
    w.compile = e;
    w.render = v;
    w.clearCache = u;
    w.to_html = function(A, y, z, B) {
        var x = v(A, y, z);
        if (typeof B === "function") {
            B(x)
        } else {
            return x
        }
    };
    var s = Object.prototype.toString;
    var f = Array.isArray;
    var b = Array.prototype.forEach;
    var g = String.prototype.trim;
    var i;
    if (f) {
        i = f
    } else {
        i = function(x) {
            return s.call(x) === "[object Array]"
        }
    }
    var r;
    if (b) {
        r = function(y, z, x) {
            return b.call(y, z, x)
        }
    } else {
        r = function(A, B, z) {
            for (var y = 0,
            x = A.length; y < x; ++y) {
                B.call(z, A[y], y, A)
            }
        }
    }
    var k = /^\s*$/;
    function c(x) {
        return k.test(x)
    }
    var p;
    if (g) {
        p = function(x) {
            return x == null ? "": g.call(x)
        }
    } else {
        var n, h;
        if (c("\xA0")) {
            n = /^\s+/;
            h = /\s+$/
        } else {
            n = /^[\s\xA0]+/;
            h = /[\s\xA0]+$/
        }
        p = function(x) {
            return x == null ? "": String(x).replace(n, "").replace(h, "")
        }
    }
    var d = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };
    function o(x) {
        return String(x).replace(/&(?!\w+;)|[<>"']/g,
        function(y) {
            return d[y] || y
        })
    }
    function l(D, F, G, z) {
        z = z || "<template>";
        var H = F.split("\n"),
        x = Math.max(G - 3, 0),
        A = Math.min(H.length, G + 3),
        y = H.slice(x, A);
        var E;
        for (var B = 0,
        C = y.length; B < C; ++B) {
            E = B + x + 1;
            y[B] = (E === G ? " >> ": "    ") + y[B]
        }
        D.template = F;
        D.line = G;
        D.file = z;
        D.message = [z + ":" + G, y.join("\n"), "", D.message].join("\n");
        return D
    }
    function t(x, F, E) {
        if (x === ".") {
            return F[F.length - 1]
        }
        var D = x.split(".");
        var B = D.length - 1;
        var C = D[B];
        var G, y, A = F.length,
        z, H;
        while (A) {
            H = F.slice(0);
            y = F[--A];
            z = 0;
            while (z < B) {
                y = y[D[z++]];
                if (y == null) {
                    break
                }
                H.push(y)
            }
            if (y && typeof y === "object" && C in y) {
                G = y[C];
                break
            }
        }
        if (typeof G === "function") {
            G = G.call(H[H.length - 1])
        }
        if (G == null) {
            return E
        }
        return G
    }
    function j(A, x, E, z) {
        var y = "";
        var C = t(A, x);
        if (z) {
            if (C == null || C === false || (i(C) && C.length === 0)) {
                y += E()
            }
        } else {
            if (i(C)) {
                r(C,
                function(F) {
                    x.push(F);
                    y += E();
                    x.pop()
                })
            } else {
                if (typeof C === "object") {
                    x.push(C);
                    y += E();
                    x.pop()
                } else {
                    if (typeof C === "function") {
                        var B = x[x.length - 1];
                        var D = function(F) {
                            return v(F, B)
                        };
                        y += C.call(B, E(), D) || ""
                    } else {
                        if (C) {
                            y += E()
                        }
                    }
                }
            }
        }
        return y
    }
    function m(Z, B) {
        B = B || {};
        var K = B.tags || w.tags,
        L = K[0],
        G = K[K.length - 1];
        var y = ['var buffer = "";', "\nvar line = 1;", "\ntry {", '\nbuffer += "'];
        var F = [],
        aa = false,
        X = false;
        var V = function() {
            if (aa && !X && !B.space) {
                while (F.length) {
                    y.splice(F.pop(), 1)
                }
            } else {
                F = []
            }
            aa = false;
            X = false
        };
        var S = [],
        P,
        C,
        M;
        var U = function(ab) {
            K = p(ab).split(/\s+/);
            C = K[0];
            M = K[K.length - 1]
        };
        var J = function(ab) {
            y.push('";', P, '\nvar partial = partials["' + p(ab) + '"];', "\nif (partial) {", "\n  buffer += render(partial,stack[stack.length - 1],partials);", "\n}", '\nbuffer += "')
        };
        var x = function(ad, ab) {
            var ac = p(ad);
            if (ac === "") {
                throw l(new Error("Section name may not be empty"), Z, I, B.file)
            }
            S.push({
                name: ac,
                inverted: ab
            });
            y.push('";', P, '\nvar name = "' + ac + '";', "\nvar callback = (function () {", "\n  return function () {", '\n    var buffer = "";', '\nbuffer += "')
        };
        var E = function(ab) {
            x(ab, true)
        };
        var T = function(ac) {
            var ab = p(ac);
            var ae = S.length != 0 && S[S.length - 1].name;
            if (!ae || ab != ae) {
                throw l(new Error('Section named "' + ab + '" was never opened'), Z, I, B.file)
            }
            var ad = S.pop();
            y.push('";', "\n    return buffer;", "\n  };", "\n})();");
            if (ad.inverted) {
                y.push("\nbuffer += renderSection(name,stack,callback,true);")
            } else {
                y.push("\nbuffer += renderSection(name,stack,callback);")
            }
            y.push('\nbuffer += "')
        };
        var W = function(ab) {
            y.push('";', P, '\nbuffer += lookup("' + p(ab) + '",stack,"");', '\nbuffer += "')
        };
        var z = function(ab) {
            y.push('";', P, '\nbuffer += escapeHTML(lookup("' + p(ab) + '",stack,""));', '\nbuffer += "')
        };
        var I = 1,
        Y, D;
        for (var Q = 0,
        R = Z.length; Q < R; ++Q) {
            if (Z.slice(Q, Q + L.length) === L) {
                Q += L.length;
                Y = Z.substr(Q, 1);
                P = "\nline = " + I + ";";
                C = L;
                M = G;
                aa = true;
                switch (Y) {
                case "!":
                    Q++;
                    D = null;
                    break;
                case "=":
                    Q++;
                    G = "=" + G;
                    D = U;
                    break;
                case ">":
                    Q++;
                    D = J;
                    break;
                case "#":
                    Q++;
                    D = x;
                    break;
                case "^":
                    Q++;
                    D = E;
                    break;
                case "/":
                    Q++;
                    D = T;
                    break;
                case "{":
                    G = "}" + G;
                case "&":
                    Q++;
                    X = true;
                    D = W;
                    break;
                default:
                    X = true;
                    D = z
                }
                var A = Z.indexOf(G, Q);
                if (A === -1) {
                    throw l(new Error('Tag "' + L + '" was not closed properly'), Z, I, B.file)
                }
                var O = Z.substring(Q, A);
                if (D) {
                    D(O)
                }
                var N = 0;
                while (~ (N = O.indexOf("\n", N))) {
                    I++;
                    N++
                }
                Q = A + G.length - 1;
                L = C;
                G = M
            } else {
                Y = Z.substr(Q, 1);
                switch (Y) {
                case '"':
                case "\\":
                    X = true;
                    y.push("\\" + Y);
                    break;
                case "\r":
                    break;
                case "\n":
                    F.push(y.length);
                    y.push("\\n");
                    V();
                    I++;
                    break;
                default:
                    if (c(Y)) {
                        F.push(y.length)
                    } else {
                        X = true
                    }
                    y.push(Y)
                }
            }
        }
        if (S.length != 0) {
            throw l(new Error('Section "' + S[S.length - 1].name + '" was not closed properly'), Z, I, B.file)
        }
        V();
        y.push('";', "\nreturn buffer;", "\n} catch (e) { throw {error: e, line: line}; }");
        var H = y.join("").replace(/buffer \+= "";\n/g, "");
        if (B.debug) {
            if (typeof console != "undefined" && console.log) {
                console.log(H)
            } else {
                if (typeof print === "function") {
                    print(H)
                }
            }
        }
        return H
    }
    function q(B, z) {
        var y = "view,partials,stack,lookup,escapeHTML,renderSection,render";
        var x = m(B, z);
        var A = new Function(y, x);
        return function(D, E) {
            E = E || {};
            var C = [D];
            try {
                return A(D, E, C, t, o, j, v)
            } catch(F) {
                throw l(F.error, B, F.line, z.file)
            }
        }
    }
    var a = {};
    function u() {
        a = {}
    }
    function e(y, x) {
        x = x || {};
        if (x.cache !== false) {
            if (!a[y]) {
                a[y] = q(y, x)
            }
            return a[y]
        }
        return q(y, x)
    }
    function v(z, x, y) {
        return e(z)(x, y)
    }
})(Mustache);