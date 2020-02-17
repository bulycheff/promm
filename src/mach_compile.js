//!\ DECLARE ALIAS AFTER assign prototype !
Object.assign(Na.prototype, {
    beforeStart_: Na.prototype.copySampleValue_,
    afterEnd_: Na.prototype.copySampleValue_
}), Da.prototype = Object.assign(Object.create(Na.prototype), {
    constructor: Da,
    DefaultSettings_: {
        endingStart: 2400,
        endingEnd: 2400
    },
    intervalChanged_: function(e, t, n) {
        var r = this.parameterPositions,
            i = e - 2,
            o = e + 1,
            a = r[i],
            s = r[o];
        if (void 0 === a) switch (this.getSettings_().endingStart) {
            case 2401:
                i = e, a = 2 * t - n;
                break;
            case 2402:
                a = t + r[i = r.length - 2] - r[i + 1];
                break;
            default:
                i = e, a = n
        }
        if (void 0 === s) switch (this.getSettings_().endingEnd) {
            case 2401:
                o = e, s = 2 * n - t;
                break;
            case 2402:
                o = 1, s = n + r[1] - r[0];
                break;
            default:
                o = e - 1, s = t
        }
        var c = .5 * (n - t),
            l = this.valueSize;
        this._weightPrev = c / (t - a), this._weightNext = c / (s - n), this._offsetPrev = i * l, this._offsetNext = o * l
    },
    interpolate_: function(e, t, n, r) {
        for (var i = this.resultBuffer, o = this.sampleValues, a = this.valueSize, s = e * a, c = s - a, l = this._offsetPrev, u = this._offsetNext, h = this._weightPrev, p = this._weightNext, d = (n - t) / (r - t), f = d * d, m = f * d, v = -h * m + 2 * h * f - h * d, g = (1 + h) * m + (-1.5 - 2 * h) * f + (-.5 + h) * d + 1, y = (-1 - p) * m + (1.5 + p) * f + .5 * d, x = p * m - p * f, _ = 0; _ !== a; ++_) i[_] = v * o[l + _] + g * o[c + _] + y * o[s + _] + x * o[u + _];
        return i
    }
}), Fa.prototype = Object.assign(Object.create(Na.prototype), {
    constructor: Fa,
    interpolate_: function(e, t, n, r) {
        for (var i = this.resultBuffer, o = this.sampleValues, a = this.valueSize, s = e * a, c = s - a, l = (n - t) / (r - t), u = 1 - l, h = 0; h !== a; ++h) i[h] = o[c + h] * u + o[s + h] * l;
        return i
    }
}), za.prototype = Object.assign(Object.create(Na.prototype), {
    constructor: za,
    interpolate_: function(e) {
        return this.copySampleValue_(e - 1)
    }
}), Object.assign(Ua, {
    toJSON: function(e) {
        var t, n = e.constructor;
        if (void 0 !== n.toJSON) t = n.toJSON(e);
        else {
            t = {
                name: e.name,
                times: Ia.convertArray(e.times, Array),
                values: Ia.convertArray(e.values, Array)
            };
            var r = e.getInterpolation();
            r !== e.DefaultInterpolation && (t.interpolation = r)
        }
        return t.type = e.ValueTypeName, t
    }
}), Object.assign(Ua.prototype, {
    constructor: Ua,
    TimeBufferType: Float32Array,
    ValueBufferType: Float32Array,
    DefaultInterpolation: 2301,
    InterpolantFactoryMethodDiscrete: function(e) {
        return new za(this.times, this.values, this.getValueSize(), e)
    },
    InterpolantFactoryMethodLinear: function(e) {
        return new Fa(this.times, this.values, this.getValueSize(), e)
    },
    InterpolantFactoryMethodSmooth: function(e) {
        return new Da(this.times, this.values, this.getValueSize(), e)
    },
    setInterpolation: function(e) {
        var t;
        switch (e) {
            case 2300:
                t = this.InterpolantFactoryMethodDiscrete;
                break;
            case 2301:
                t = this.InterpolantFactoryMethodLinear;
                break;
            case 2302:
                t = this.InterpolantFactoryMethodSmooth
        }
        if (void 0 === t) {
            var n = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
            if (void 0 === this.createInterpolant) {
                if (e === this.DefaultInterpolation) throw new Error(n);
                this.setInterpolation(this.DefaultInterpolation)
            }
            return console.warn("THREE.KeyframeTrack:", n), this
        }
        return this.createInterpolant = t, this
    },
    getInterpolation: function() {
        switch (this.createInterpolant) {
            case this.InterpolantFactoryMethodDiscrete:
                return 2300;
            case this.InterpolantFactoryMethodLinear:
                return 2301;
            case this.InterpolantFactoryMethodSmooth:
                return 2302
        }
    },
    getValueSize: function() {
        return this.values.length / this.times.length
    },
    shift: function(e) {
        if (0 !== e)
            for (var t = this.times, n = 0, r = t.length; n !== r; ++n) t[n] += e;
        return this
    },
    scale: function(e) {
        if (1 !== e)
            for (var t = this.times, n = 0, r = t.length; n !== r; ++n) t[n] *= e;
        return this
    },
    trim: function(e, t) {
        for (var n = this.times, r = n.length, i = 0, o = r - 1; i !== r && n[i] < e;) ++i;
        for (; - 1 !== o && n[o] > t;) --o;
        if (++o, 0 !== i || o !== r) {
            i >= o && (i = (o = Math.max(o, 1)) - 1);
            var a = this.getValueSize();
            this.times = Ia.arraySlice(n, i, o), this.values = Ia.arraySlice(this.values, i * a, o * a)
        }
        return this
    },
    validate: function() {
        var e = !0,
            t = this.getValueSize();
        t - Math.floor(t) != 0 && (console.error("THREE.KeyframeTrack: Invalid value size in track.", this), e = !1);
        var n = this.times,
            r = this.values,
            i = n.length;
        0 === i && (console.error("THREE.KeyframeTrack: Track is empty.", this), e = !1);
        for (var o = null, a = 0; a !== i; a++) {
            var s = n[a];
            if ("number" == typeof s && isNaN(s)) {
                console.error("THREE.KeyframeTrack: Time is not a valid number.", this, a, s), e = !1;
                break
            }
            if (null !== o && o > s) {
                console.error("THREE.KeyframeTrack: Out of order keys.", this, a, s, o), e = !1;
                break
            }
            o = s
        }
        if (void 0 !== r && Ia.isTypedArray(r)) {
            a = 0;
            for (var c = r.length; a !== c; ++a) {
                var l = r[a];
                if (isNaN(l)) {
                    console.error("THREE.KeyframeTrack: Value is not a valid number.", this, a, l), e = !1;
                    break
                }
            }
        }
        return e
    },
    optimize: function() {
        for (var e = this.times, t = this.values, n = this.getValueSize(), r = 2302 === this.getInterpolation(), i = 1, o = e.length - 1, a = 1; a < o; ++a) {
            var s = !1,
                c = e[a];
            if (c !== e[a + 1] && (1 !== a || c !== c[0]))
                if (r) s = !0;
                else
                    for (var l = a * n, u = l - n, h = l + n, p = 0; p !== n; ++p) {
                        var d = t[l + p];
                        if (d !== t[u + p] || d !== t[h + p]) {
                            s = !0;
                            break
                        }
                    }
                if (s) {
                    if (a !== i) {
                        e[i] = e[a];
                        var f = a * n,
                            m = i * n;
                        for (p = 0; p !== n; ++p) t[m + p] = t[f + p]
                    }++i
                }
        }
        if (o > 0) {
            e[i] = e[o];
            for (f = o * n, m = i * n, p = 0; p !== n; ++p) t[m + p] = t[f + p];
            ++i
        }
        return i !== e.length && (this.times = Ia.arraySlice(e, 0, i), this.values = Ia.arraySlice(t, 0, i * n)), this
    },
    clone: function() {
        var e = Ia.arraySlice(this.times, 0),
            t = Ia.arraySlice(this.values, 0),
            n = new(0, this.constructor)(this.name, e, t);
        return n.createInterpolant = this.createInterpolant, n
    }
}), Ba.prototype = Object.assign(Object.create(Ua.prototype), {
    constructor: Ba,
    ValueTypeName: "bool",
    ValueBufferType: Array,
    DefaultInterpolation: 2300,
    InterpolantFactoryMethodLinear: void 0,
    InterpolantFactoryMethodSmooth: void 0
}), ka.prototype = Object.assign(Object.create(Ua.prototype), {
    constructor: ka,
    ValueTypeName: "color"
}), Ga.prototype = Object.assign(Object.create(Ua.prototype), {
    constructor: Ga,
    ValueTypeName: "number"
}), Ha.prototype = Object.assign(Object.create(Na.prototype), {
    constructor: Ha,
    interpolate_: function(e, t, n, r) {
        for (var i = this.resultBuffer, o = this.sampleValues, a = this.valueSize, s = e * a, c = (n - t) / (r - t), l = s + a; s !== l; s += 4) m.slerpFlat(i, 0, o, s - a, o, s, c);
        return i
    }
}), ja.prototype = Object.assign(Object.create(Ua.prototype), {
    constructor: ja,
    ValueTypeName: "quaternion",
    DefaultInterpolation: 2301,
    InterpolantFactoryMethodLinear: function(e) {
        return new Ha(this.times, this.values, this.getValueSize(), e)
    },
    InterpolantFactoryMethodSmooth: void 0
}), Va.prototype = Object.assign(Object.create(Ua.prototype), {
    constructor: Va,
    ValueTypeName: "string",
    ValueBufferType: Array,
    DefaultInterpolation: 2300,
    InterpolantFactoryMethodLinear: void 0,
    InterpolantFactoryMethodSmooth: void 0
}), Wa.prototype = Object.assign(Object.create(Ua.prototype), {
    constructor: Wa,
    ValueTypeName: "vector"
}), Object.assign(Xa, {
    parse: function(e) {
        for (var t = [], n = e.tracks, r = 1 / (e.fps || 1), i = 0, o = n.length; i !== o; ++i) t.push(qa(n[i]).scale(r));
        return new Xa(e.name, e.duration, t)
    },
    toJSON: function(e) {
        for (var t = [], n = e.tracks, r = {
                name: e.name,
                duration: e.duration,
                tracks: t,
                uuid: e.uuid
            }, i = 0, o = n.length; i !== o; ++i) t.push(Ua.toJSON(n[i]));
        return r
    },
    CreateFromMorphTargetSequence: function(e, t, n, r) {
        for (var i = t.length, o = [], a = 0; a < i; a++) {
            var s = [],
                c = [];
            s.push((a + i - 1) % i, a, (a + 1) % i), c.push(0, 1, 0);
            var l = Ia.getKeyframeOrder(s);
            s = Ia.sortedArray(s, 1, l), c = Ia.sortedArray(c, 1, l), r || 0 !== s[0] || (s.push(i), c.push(c[0])), o.push(new Ga(".morphTargetInfluences[" + t[a].name + "]", s, c).scale(1 / n))
        }
        return new Xa(e, -1, o)
    },
    findByName: function(e, t) {
        var n = e;
        if (!Array.isArray(e)) {
            var r = e;
            n = r.geometry && r.geometry.animations || r.animations
        }
        for (var i = 0; i < n.length; i++)
            if (n[i].name === t) return n[i];
        return null
    },
    CreateClipsFromMorphTargetSequences: function(e, t, n) {
        for (var r = {}, i = /^([\w-]*?)([\d]+)$/, o = 0, a = e.length; o < a; o++) {
            var s = e[o],
                c = s.name.match(i);
            if (c && c.length > 1) {
                var l = r[h = c[1]];
                l || (r[h] = l = []), l.push(s)
            }
        }
        var u = [];
        for (var h in r) u.push(Xa.CreateFromMorphTargetSequence(h, r[h], t, n));
        return u
    },
    parseAnimation: function(e, t) {
        if (!e) return console.error("THREE.AnimationClip: No animation in JSONLoader data."), null;
        for (var n = function(e, t, n, r, i) {
                if (0 !== n.length) {
                    var o = [],
                        a = [];
                    Ia.flattenJSON(n, o, a, r), 0 !== o.length && i.push(new e(t, o, a))
                }
            }, r = [], i = e.name || "default", o = e.length || -1, a = e.fps || 30, s = e.hierarchy || [], c = 0; c < s.length; c++) {
            var l = s[c].keys;
            if (l && 0 !== l.length)
                if (l[0].morphTargets) {
                    for (var u = {}, h = 0; h < l.length; h++)
                        if (l[h].morphTargets)
                            for (var p = 0; p < l[h].morphTargets.length; p++) u[l[h].morphTargets[p]] = -1;
                    for (var d in u) {
                        var f = [],
                            m = [];
                        for (p = 0; p !== l[h].morphTargets.length; ++p) {
                            var v = l[h];
                            f.push(v.time), m.push(v.morphTarget === d ? 1 : 0)
                        }
                        r.push(new Ga(".morphTargetInfluence[" + d + "]", f, m))
                    }
                    o = u.length * (a || 1)
                } else {
                    var g = ".bones[" + t[c].name + "]";
                    n(Wa, g + ".position", l, "pos", r), n(ja, g + ".quaternion", l, "rot", r), n(Wa, g + ".scale", l, "scl", r)
                }
        }
        return 0 === r.length ? null : new Xa(i, o, r)
    }
}), Object.assign(Xa.prototype, {
    resetDuration: function() {
        for (var e = 0, t = 0, n = this.tracks.length; t !== n; ++t) {
            var r = this.tracks[t];
            e = Math.max(e, r.times[r.times.length - 1])
        }
        return this.duration = e, this
    },
    trim: function() {
        for (var e = 0; e < this.tracks.length; e++) this.tracks[e].trim(0, this.duration);
        return this
    },
    validate: function() {
        for (var e = !0, t = 0; t < this.tracks.length; t++) e = e && this.tracks[t].validate();
        return e
    },
    optimize: function() {
        for (var e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
        return this
    },
    clone: function() {
        for (var e = [], t = 0; t < this.tracks.length; t++) e.push(this.tracks[t].clone());
        return new Xa(this.name, this.duration, e)
    }
});
var Ya = {
    enabled: !1,
    files: {},
    add: function(e, t) {
        !1 !== this.enabled && (this.files[e] = t)
    },
    get: function(e) {
        if (!1 !== this.enabled) return this.files[e]
    },
    remove: function(e) {
        delete this.files[e]
    },
    clear: function() {
        this.files = {}
    }
};

function Za(e, t, n) {
    var r = this,
        i = !1,
        o = 0,
        a = 0,
        s = void 0,
        c = [];
    this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = n, this.itemStart = function(e) {
        a++, !1 === i && void 0 !== r.onStart && r.onStart(e, o, a), i = !0
    }, this.itemEnd = function(e) {
        o++, void 0 !== r.onProgress && r.onProgress(e, o, a), o === a && (i = !1, void 0 !== r.onLoad && r.onLoad())
    }, this.itemError = function(e) {
        void 0 !== r.onError && r.onError(e)
    }, this.resolveURL = function(e) {
        return s ? s(e) : e
    }, this.setURLModifier = function(e) {
        return s = e, this
    }, this.addHandler = function(e, t) {
        return c.push(e, t), this
    }, this.removeHandler = function(e) {
        var t = c.indexOf(e);
        return -1 !== t && c.splice(t, 2), this
    }, this.getHandler = function(e) {
        for (var t = 0, n = c.length; t < n; t += 2) {
            var r = c[t],
                i = c[t + 1];
            if (r.global && (r.lastIndex = 0), r.test(e)) return i
        }
        return null
    }
}
var Ja = new Za;

function Ka(e) {
    this.manager = void 0 !== e ? e : Ja, this.crossOrigin = "anonymous", this.path = "", this.resourcePath = ""
}
Object.assign(Ka.prototype, {
    load: function() {},
    parse: function() {},
    setCrossOrigin: function(e) {
        return this.crossOrigin = e, this
    },
    setPath: function(e) {
        return this.path = e, this
    },
    setResourcePath: function(e) {
        return this.resourcePath = e, this
    }
});
var Qa = {};

function $a(e) {
    Ka.call(this, e)
}

function es(e) {
    Ka.call(this, e)
}

function ts(e) {
    Ka.call(this, e)
}

function ns(e) {
    Ka.call(this, e)
}

function rs(e) {
    Ka.call(this, e)
}

function is(e) {
    Ka.call(this, e)
}

function os(e) {
    Ka.call(this, e)
}

function as() {
    this.type = "Curve", this.arcLengthDivisions = 200
}

function ss(e, t, n, r, i, o, a, s) {
    as.call(this), this.type = "EllipseCurve", this.aX = e || 0, this.aY = t || 0, this.xRadius = n || 1, this.yRadius = r || 1, this.aStartAngle = i || 0, this.aEndAngle = o || 2 * Math.PI, this.aClockwise = a || !1, this.aRotation = s || 0
}

function cs(e, t, n, r, i, o) {
    ss.call(this, e, t, n, n, r, i, o), this.type = "ArcCurve"
}

function ls() {
    var e = 0,
        t = 0,
        n = 0,
        r = 0;

    function i(i, o, a, s) {
        e = i, t = a, n = -3 * i + 3 * o - 2 * a - s, r = 2 * i - 2 * o + a + s
    }
    return {
        initCatmullRom: function(e, t, n, r, o) {
            i(t, n, o * (n - e), o * (r - t))
        },
        initNonuniformCatmullRom: function(e, t, n, r, o, a, s) {
            var c = (t - e) / o - (n - e) / (o + a) + (n - t) / a,
                l = (n - t) / a - (r - t) / (a + s) + (r - n) / s;
            i(t, n, c *= a, l *= a)
        },
        calc: function(i) {
            var o = i * i;
            return e + t * i + n * o + r * (o * i)
        }
    }
}
$a.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: $a,
    load: function(e, t, n, r) {
        void 0 === e && (e = ""), void 0 !== this.path && (e = this.path + e), e = this.manager.resolveURL(e);
        var i = this,
            o = Ya.get(e);
        if (void 0 !== o) return i.manager.itemStart(e), setTimeout((function() {
            t && t(o), i.manager.itemEnd(e)
        }), 0), o;
        if (void 0 === Qa[e]) {
            var a = e.match(/^data:(.*?)(;base64)?,(.*)$/);
            if (a) {
                var s = a[1],
                    c = !!a[2],
                    l = a[3];
                l = decodeURIComponent(l), c && (l = atob(l));
                try {
                    var u, h = (this.responseType || "").toLowerCase();
                    switch (h) {
                        case "arraybuffer":
                        case "blob":
                            for (var p = new Uint8Array(l.length), d = 0; d < l.length; d++) p[d] = l.charCodeAt(d);
                            u = "blob" === h ? new Blob([p.buffer], {
                                type: s
                            }) : p.buffer;
                            break;
                        case "document":
                            var f = new DOMParser;
                            u = f.parseFromString(l, s);
                            break;
                        case "json":
                            u = JSON.parse(l);
                            break;
                        default:
                            u = l
                    }
                    setTimeout((function() {
                        t && t(u), i.manager.itemEnd(e)
                    }), 0)
                } catch (t) {
                    setTimeout((function() {
                        r && r(t), i.manager.itemError(e), i.manager.itemEnd(e)
                    }), 0)
                }
            } else {
                Qa[e] = [], Qa[e].push({
                    onLoad: t,
                    onProgress: n,
                    onError: r
                });
                var m = new XMLHttpRequest;
                for (var v in m.open("GET", e, !0), m.addEventListener("load", (function(t) {
                        var n = this.response,
                            r = Qa[e];
                        if (delete Qa[e], 200 === this.status || 0 === this.status) {
                            0 === this.status && console.warn("THREE.FileLoader: HTTP Status 0 received."), Ya.add(e, n);
                            for (var o = 0, a = r.length; o < a; o++) {
                                (s = r[o]).onLoad && s.onLoad(n)
                            }
                            i.manager.itemEnd(e)
                        } else {
                            for (o = 0, a = r.length; o < a; o++) {
                                var s;
                                (s = r[o]).onError && s.onError(t)
                            }
                            i.manager.itemError(e), i.manager.itemEnd(e)
                        }
                    }), !1), m.addEventListener("progress", (function(t) {
                        for (var n = Qa[e], r = 0, i = n.length; r < i; r++) {
                            var o = n[r];
                            o.onProgress && o.onProgress(t)
                        }
                    }), !1), m.addEventListener("error", (function(t) {
                        var n = Qa[e];
                        delete Qa[e];
                        for (var r = 0, o = n.length; r < o; r++) {
                            var a = n[r];
                            a.onError && a.onError(t)
                        }
                        i.manager.itemError(e), i.manager.itemEnd(e)
                    }), !1), m.addEventListener("abort", (function(t) {
                        var n = Qa[e];
                        delete Qa[e];
                        for (var r = 0, o = n.length; r < o; r++) {
                            var a = n[r];
                            a.onError && a.onError(t)
                        }
                        i.manager.itemError(e), i.manager.itemEnd(e)
                    }), !1), void 0 !== this.responseType && (m.responseType = this.responseType), void 0 !== this.withCredentials && (m.withCredentials = this.withCredentials), m.overrideMimeType && m.overrideMimeType(void 0 !== this.mimeType ? this.mimeType : "text/plain"), this.requestHeader) m.setRequestHeader(v, this.requestHeader[v]);
                m.send(null)
            }
            return i.manager.itemStart(e), m
        }
        Qa[e].push({
            onLoad: t,
            onProgress: n,
            onError: r
        })
    },
    setResponseType: function(e) {
        return this.responseType = e, this
    },
    setWithCredentials: function(e) {
        return this.withCredentials = e, this
    },
    setMimeType: function(e) {
        return this.mimeType = e, this
    },
    setRequestHeader: function(e) {
        return this.requestHeader = e, this
    }
}), es.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: es,
    load: function(e, t, n, r) {
        var i = this,
            o = new $a(i.manager);
        o.setPath(i.path), o.load(e, (function(e) {
            t(i.parse(JSON.parse(e)))
        }), n, r)
    },
    parse: function(e) {
        for (var t = [], n = 0; n < e.length; n++) {
            var r = Xa.parse(e[n]);
            t.push(r)
        }
        return t
    }
}), ts.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: ts,
    load: function(e, t, n, r) {
        var i = this,
            o = [],
            a = new oo;
        a.image = o;
        var s = new $a(this.manager);

        function c(c) {
            s.load(e[c], (function(e) {
                var n = i.parse(e, !0);
                o[c] = {
                    width: n.width,
                    height: n.height,
                    format: n.format,
                    mipmaps: n.mipmaps
                }, 6 === (l += 1) && (1 === n.mipmapCount && (a.minFilter = 1006), a.format = n.format, a.needsUpdate = !0, t && t(a))
            }), n, r)
        }
        if (s.setPath(this.path), s.setResponseType("arraybuffer"), Array.isArray(e))
            for (var l = 0, u = 0, h = e.length; u < h; ++u) c(u);
        else s.load(e, (function(e) {
            var n = i.parse(e, !0);
            if (n.isCubemap)
                for (var r = n.mipmaps.length / n.mipmapCount, s = 0; s < r; s++) {
                    o[s] = {
                        mipmaps: []
                    };
                    for (var c = 0; c < n.mipmapCount; c++) o[s].mipmaps.push(n.mipmaps[s * n.mipmapCount + c]), o[s].format = n.format, o[s].width = n.width, o[s].height = n.height
                } else a.image.width = n.width, a.image.height = n.height, a.mipmaps = n.mipmaps;
            1 === n.mipmapCount && (a.minFilter = 1006), a.format = n.format, a.needsUpdate = !0, t && t(a)
        }), n, r);
        return a
    }
}), ns.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: ns,
    load: function(e, t, n, r) {
        var i = this,
            o = new $t,
            a = new $a(this.manager);
        return a.setResponseType("arraybuffer"), a.setPath(this.path), a.load(e, (function(e) {
            var n = i.parse(e);
            n && (void 0 !== n.image ? o.image = n.image : void 0 !== n.data && (o.image.width = n.width, o.image.height = n.height, o.image.data = n.data), o.wrapS = void 0 !== n.wrapS ? n.wrapS : 1001, o.wrapT = void 0 !== n.wrapT ? n.wrapT : 1001, o.magFilter = void 0 !== n.magFilter ? n.magFilter : 1006, o.minFilter = void 0 !== n.minFilter ? n.minFilter : 1006, o.anisotropy = void 0 !== n.anisotropy ? n.anisotropy : 1, void 0 !== n.format && (o.format = n.format), void 0 !== n.type && (o.type = n.type), void 0 !== n.mipmaps && (o.mipmaps = n.mipmaps, o.minFilter = 1008), 1 === n.mipmapCount && (o.minFilter = 1006), o.needsUpdate = !0, t && t(o, n))
        }), n, r), o
    }
}), rs.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: rs,
    load: function(e, t, n, r) {
        void 0 !== this.path && (e = this.path + e), e = this.manager.resolveURL(e);
        var i = this,
            o = Ya.get(e);
        if (void 0 !== o) return i.manager.itemStart(e), setTimeout((function() {
            t && t(o), i.manager.itemEnd(e)
        }), 0), o;
        var a = document.createElementNS("http://www.w3.org/1999/xhtml", "img");

        function s() {
            a.removeEventListener("load", s, !1), a.removeEventListener("error", c, !1), Ya.add(e, this), t && t(this), i.manager.itemEnd(e)
        }

        function c(t) {
            a.removeEventListener("load", s, !1), a.removeEventListener("error", c, !1), r && r(t), i.manager.itemError(e), i.manager.itemEnd(e)
        }
        return a.addEventListener("load", s, !1), a.addEventListener("error", c, !1), "data:" !== e.substr(0, 5) && void 0 !== this.crossOrigin && (a.crossOrigin = this.crossOrigin), i.manager.itemStart(e), a.src = e, a
    }
}), is.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: is,
    load: function(e, t, n, r) {
        var i = new wn,
            o = new rs(this.manager);
        o.setCrossOrigin(this.crossOrigin), o.setPath(this.path);
        var a = 0;

        function s(n) {
            o.load(e[n], (function(e) {
                i.images[n] = e, 6 === ++a && (i.needsUpdate = !0, t && t(i))
            }), void 0, r)
        }
        for (var c = 0; c < e.length; ++c) s(c);
        return i
    }
}), os.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: os,
    load: function(e, t, n, r) {
        var i = new S,
            o = new rs(this.manager);
        return o.setCrossOrigin(this.crossOrigin), o.setPath(this.path), o.load(e, (function(n) {
            i.image = n;
            var r = e.search(/\.jpe?g($|\?)/i) > 0 || 0 === e.search(/^data\:image\/jpeg/);
            i.format = r ? 1022 : 1023, i.needsUpdate = !0, void 0 !== t && t(i)
        }), n, r), i
    }
}), Object.assign(as.prototype, {
    getPoint: function() {
        return console.warn("THREE.Curve: .getPoint() not implemented."), null
    },
    getPointAt: function(e, t) {
        var n = this.getUtoTmapping(e);
        return this.getPoint(n, t)
    },
    getPoints: function(e) {
        void 0 === e && (e = 5);
        for (var t = [], n = 0; n <= e; n++) t.push(this.getPoint(n / e));
        return t
    },
    getSpacedPoints: function(e) {
        void 0 === e && (e = 5);
        for (var t = [], n = 0; n <= e; n++) t.push(this.getPointAt(n / e));
        return t
    },
    getLength: function() {
        var e = this.getLengths();
        return e[e.length - 1]
    },
    getLengths: function(e) {
        if (void 0 === e && (e = this.arcLengthDivisions), this.cacheArcLengths && this.cacheArcLengths.length === e + 1 && !this.needsUpdate) return this.cacheArcLengths;
        this.needsUpdate = !1;
        var t, n, r = [],
            i = this.getPoint(0),
            o = 0;
        for (r.push(0), n = 1; n <= e; n++) o += (t = this.getPoint(n / e)).distanceTo(i), r.push(o), i = t;
        return this.cacheArcLengths = r, r
    },
    updateArcLengths: function() {
        this.needsUpdate = !0, this.getLengths()
    },
    getUtoTmapping: function(e, t) {
        var n, r = this.getLengths(),
            i = 0,
            o = r.length;
        n = t || e * r[o - 1];
        for (var a, s = 0, c = o - 1; s <= c;)
            if ((a = r[i = Math.floor(s + (c - s) / 2)] - n) < 0) s = i + 1;
            else {
                if (!(a > 0)) {
                    c = i;
                    break
                }
                c = i - 1
            }
        if (r[i = c] === n) return i / (o - 1);
        var l = r[i];
        return (i + (n - l) / (r[i + 1] - l)) / (o - 1)
    },
    getTangent: function(e) {
        var t = e - 1e-4,
            n = e + 1e-4;
        t < 0 && (t = 0), n > 1 && (n = 1);
        var r = this.getPoint(t);
        return this.getPoint(n).clone().sub(r).normalize()
    },
    getTangentAt: function(e) {
        var t = this.getUtoTmapping(e);
        return this.getTangent(t)
    },
    computeFrenetFrames: function(e, t) {
        var n, r, i, o = new y,
            a = [],
            s = [],
            c = [],
            l = new y,
            u = new D;
        for (n = 0; n <= e; n++) r = n / e, a[n] = this.getTangentAt(r), a[n].normalize();
        s[0] = new y, c[0] = new y;
        var h = Number.MAX_VALUE,
            p = Math.abs(a[0].x),
            f = Math.abs(a[0].y),
            m = Math.abs(a[0].z);
        for (p <= h && (h = p, o.set(1, 0, 0)), f <= h && (h = f, o.set(0, 1, 0)), m <= h && o.set(0, 0, 1), l.crossVectors(a[0], o).normalize(), s[0].crossVectors(a[0], l), c[0].crossVectors(a[0], s[0]), n = 1; n <= e; n++) s[n] = s[n - 1].clone(), c[n] = c[n - 1].clone(), l.crossVectors(a[n - 1], a[n]), l.length() > Number.EPSILON && (l.normalize(), i = Math.acos(d.clamp(a[n - 1].dot(a[n]), -1, 1)), s[n].applyMatrix4(u.makeRotationAxis(l, i))), c[n].crossVectors(a[n], s[n]);
        if (!0 === t)
            for (i = Math.acos(d.clamp(s[0].dot(s[e]), -1, 1)), i /= e, a[0].dot(l.crossVectors(s[0], s[e])) > 0 && (i = -i), n = 1; n <= e; n++) s[n].applyMatrix4(u.makeRotationAxis(a[n], i * n)), c[n].crossVectors(a[n], s[n]);
        return {
            tangents: a,
            normals: s,
            binormals: c
        }
    },
    clone: function() {
        return (new this.constructor).copy(this)
    },
    copy: function(e) {
        return this.arcLengthDivisions = e.arcLengthDivisions, this
    },
    toJSON: function() {
        var e = {
            metadata: {
                version: 4.5,
                type: "Curve",
                generator: "Curve.toJSON"
            }
        };
        return e.arcLengthDivisions = this.arcLengthDivisions, e.type = this.type, e
    },
    fromJSON: function(e) {
        return this.arcLengthDivisions = e.arcLengthDivisions, this
    }
}), ss.prototype = Object.create(as.prototype), ss.prototype.constructor = ss, ss.prototype.isEllipseCurve = !0, ss.prototype.getPoint = function(e, t) {
    for (var n = t || new f, r = 2 * Math.PI, i = this.aEndAngle - this.aStartAngle, o = Math.abs(i) < Number.EPSILON; i < 0;) i += r;
    for (; i > r;) i -= r;
    i < Number.EPSILON && (i = o ? 0 : r), !0 !== this.aClockwise || o || (i === r ? i = -r : i -= r);
    var a = this.aStartAngle + e * i,
        s = this.aX + this.xRadius * Math.cos(a),
        c = this.aY + this.yRadius * Math.sin(a);
    if (0 !== this.aRotation) {
        var l = Math.cos(this.aRotation),
            u = Math.sin(this.aRotation),
            h = s - this.aX,
            p = c - this.aY;
        s = h * l - p * u + this.aX, c = h * u + p * l + this.aY
    }
    return n.set(s, c)
}, ss.prototype.copy = function(e) {
    return as.prototype.copy.call(this, e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this
}, ss.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    return e.aX = this.aX, e.aY = this.aY, e.xRadius = this.xRadius, e.yRadius = this.yRadius, e.aStartAngle = this.aStartAngle, e.aEndAngle = this.aEndAngle, e.aClockwise = this.aClockwise, e.aRotation = this.aRotation, e
}, ss.prototype.fromJSON = function(e) {
    return as.prototype.fromJSON.call(this, e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this
}, cs.prototype = Object.create(ss.prototype), cs.prototype.constructor = cs, cs.prototype.isArcCurve = !0;
var us = new y,
    hs = new ls,
    ps = new ls,
    ds = new ls;

function fs(e, t, n, r) {
    as.call(this), this.type = "CatmullRomCurve3", this.points = e || [], this.closed = t || !1, this.curveType = n || "centripetal", this.tension = r || .5
}

function ms(e, t, n, r, i) {
    var o = .5 * (r - t),
        a = .5 * (i - n),
        s = e * e;
    return (2 * n - 2 * r + o + a) * (e * s) + (-3 * n + 3 * r - 2 * o - a) * s + o * e + n
}

function vs(e, t, n, r) {
    return function(e, t) {
        var n = 1 - e;
        return n * n * t
    }(e, t) + function(e, t) {
        return 2 * (1 - e) * e * t
    }(e, n) + function(e, t) {
        return e * e * t
    }(e, r)
}

function gs(e, t, n, r, i) {
    return function(e, t) {
        var n = 1 - e;
        return n * n * n * t
    }(e, t) + function(e, t) {
        var n = 1 - e;
        return 3 * n * n * e * t
    }(e, n) + function(e, t) {
        return 3 * (1 - e) * e * e * t
    }(e, r) + function(e, t) {
        return e * e * e * t
    }(e, i)
}

function ys(e, t, n, r) {
    as.call(this), this.type = "CubicBezierCurve", this.v0 = e || new f, this.v1 = t || new f, this.v2 = n || new f, this.v3 = r || new f
}

function xs(e, t, n, r) {
    as.call(this), this.type = "CubicBezierCurve3", this.v0 = e || new y, this.v1 = t || new y, this.v2 = n || new y, this.v3 = r || new y
}

function _s(e, t) {
    as.call(this), this.type = "LineCurve", this.v1 = e || new f, this.v2 = t || new f
}

function bs(e, t) {
    as.call(this), this.type = "LineCurve3", this.v1 = e || new y, this.v2 = t || new y
}

function ws(e, t, n) {
    as.call(this), this.type = "QuadraticBezierCurve", this.v0 = e || new f, this.v1 = t || new f, this.v2 = n || new f
}

function Ms(e, t, n) {
    as.call(this), this.type = "QuadraticBezierCurve3", this.v0 = e || new y, this.v1 = t || new y, this.v2 = n || new y
}

function Ss(e) {
    as.call(this), this.type = "SplineCurve", this.points = e || []
}
fs.prototype = Object.create(as.prototype), fs.prototype.constructor = fs, fs.prototype.isCatmullRomCurve3 = !0, fs.prototype.getPoint = function(e, t) {
    var n, r, i, o, a = t || new y,
        s = this.points,
        c = s.length,
        l = (c - (this.closed ? 0 : 1)) * e,
        u = Math.floor(l),
        h = l - u;
    if (this.closed ? u += u > 0 ? 0 : (Math.floor(Math.abs(u) / c) + 1) * c : 0 === h && u === c - 1 && (u = c - 2, h = 1), this.closed || u > 0 ? n = s[(u - 1) % c] : (us.subVectors(s[0], s[1]).add(s[0]), n = us), r = s[u % c], i = s[(u + 1) % c], this.closed || u + 2 < c ? o = s[(u + 2) % c] : (us.subVectors(s[c - 1], s[c - 2]).add(s[c - 1]), o = us), "centripetal" === this.curveType || "chordal" === this.curveType) {
        var p = "chordal" === this.curveType ? .5 : .25,
            d = Math.pow(n.distanceToSquared(r), p),
            f = Math.pow(r.distanceToSquared(i), p),
            m = Math.pow(i.distanceToSquared(o), p);
        f < 1e-4 && (f = 1), d < 1e-4 && (d = f), m < 1e-4 && (m = f), hs.initNonuniformCatmullRom(n.x, r.x, i.x, o.x, d, f, m), ps.initNonuniformCatmullRom(n.y, r.y, i.y, o.y, d, f, m), ds.initNonuniformCatmullRom(n.z, r.z, i.z, o.z, d, f, m)
    } else "catmullrom" === this.curveType && (hs.initCatmullRom(n.x, r.x, i.x, o.x, this.tension), ps.initCatmullRom(n.y, r.y, i.y, o.y, this.tension), ds.initCatmullRom(n.z, r.z, i.z, o.z, this.tension));
    return a.set(hs.calc(h), ps.calc(h), ds.calc(h)), a
}, fs.prototype.copy = function(e) {
    as.prototype.copy.call(this, e), this.points = [];
    for (var t = 0, n = e.points.length; t < n; t++) {
        var r = e.points[t];
        this.points.push(r.clone())
    }
    return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this
}, fs.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    e.points = [];
    for (var t = 0, n = this.points.length; t < n; t++) {
        var r = this.points[t];
        e.points.push(r.toArray())
    }
    return e.closed = this.closed, e.curveType = this.curveType, e.tension = this.tension, e
}, fs.prototype.fromJSON = function(e) {
    as.prototype.fromJSON.call(this, e), this.points = [];
    for (var t = 0, n = e.points.length; t < n; t++) {
        var r = e.points[t];
        this.points.push((new y).fromArray(r))
    }
    return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this
}, ys.prototype = Object.create(as.prototype), ys.prototype.constructor = ys, ys.prototype.isCubicBezierCurve = !0, ys.prototype.getPoint = function(e, t) {
    var n = t || new f,
        r = this.v0,
        i = this.v1,
        o = this.v2,
        a = this.v3;
    return n.set(gs(e, r.x, i.x, o.x, a.x), gs(e, r.y, i.y, o.y, a.y)), n
}, ys.prototype.copy = function(e) {
    return as.prototype.copy.call(this, e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this
}, ys.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e
}, ys.prototype.fromJSON = function(e) {
    return as.prototype.fromJSON.call(this, e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this
}, xs.prototype = Object.create(as.prototype), xs.prototype.constructor = xs, xs.prototype.isCubicBezierCurve3 = !0, xs.prototype.getPoint = function(e, t) {
    var n = t || new y,
        r = this.v0,
        i = this.v1,
        o = this.v2,
        a = this.v3;
    return n.set(gs(e, r.x, i.x, o.x, a.x), gs(e, r.y, i.y, o.y, a.y), gs(e, r.z, i.z, o.z, a.z)), n
}, xs.prototype.copy = function(e) {
    return as.prototype.copy.call(this, e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this
}, xs.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e
}, xs.prototype.fromJSON = function(e) {
    return as.prototype.fromJSON.call(this, e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this
}, _s.prototype = Object.create(as.prototype), _s.prototype.constructor = _s, _s.prototype.isLineCurve = !0, _s.prototype.getPoint = function(e, t) {
    var n = t || new f;
    return 1 === e ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(e).add(this.v1)), n
}, _s.prototype.getPointAt = function(e, t) {
    return this.getPoint(e, t)
}, _s.prototype.getTangent = function() {
    return this.v2.clone().sub(this.v1).normalize()
}, _s.prototype.copy = function(e) {
    return as.prototype.copy.call(this, e), this.v1.copy(e.v1), this.v2.copy(e.v2), this
}, _s.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e
}, _s.prototype.fromJSON = function(e) {
    return as.prototype.fromJSON.call(this, e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this
}, bs.prototype = Object.create(as.prototype), bs.prototype.constructor = bs, bs.prototype.isLineCurve3 = !0, bs.prototype.getPoint = function(e, t) {
    var n = t || new y;
    return 1 === e ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(e).add(this.v1)), n
}, bs.prototype.getPointAt = function(e, t) {
    return this.getPoint(e, t)
}, bs.prototype.copy = function(e) {
    return as.prototype.copy.call(this, e), this.v1.copy(e.v1), this.v2.copy(e.v2), this
}, bs.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e
}, bs.prototype.fromJSON = function(e) {
    return as.prototype.fromJSON.call(this, e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this
}, ws.prototype = Object.create(as.prototype), ws.prototype.constructor = ws, ws.prototype.isQuadraticBezierCurve = !0, ws.prototype.getPoint = function(e, t) {
    var n = t || new f,
        r = this.v0,
        i = this.v1,
        o = this.v2;
    return n.set(vs(e, r.x, i.x, o.x), vs(e, r.y, i.y, o.y)), n
}, ws.prototype.copy = function(e) {
    return as.prototype.copy.call(this, e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this
}, ws.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e
}, ws.prototype.fromJSON = function(e) {
    return as.prototype.fromJSON.call(this, e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this
}, Ms.prototype = Object.create(as.prototype), Ms.prototype.constructor = Ms, Ms.prototype.isQuadraticBezierCurve3 = !0, Ms.prototype.getPoint = function(e, t) {
    var n = t || new y,
        r = this.v0,
        i = this.v1,
        o = this.v2;
    return n.set(vs(e, r.x, i.x, o.x), vs(e, r.y, i.y, o.y), vs(e, r.z, i.z, o.z)), n
}, Ms.prototype.copy = function(e) {
    return as.prototype.copy.call(this, e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this
}, Ms.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e
}, Ms.prototype.fromJSON = function(e) {
    return as.prototype.fromJSON.call(this, e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this
}, Ss.prototype = Object.create(as.prototype), Ss.prototype.constructor = Ss, Ss.prototype.isSplineCurve = !0, Ss.prototype.getPoint = function(e, t) {
    var n = t || new f,
        r = this.points,
        i = (r.length - 1) * e,
        o = Math.floor(i),
        a = i - o,
        s = r[0 === o ? o : o - 1],
        c = r[o],
        l = r[o > r.length - 2 ? r.length - 1 : o + 1],
        u = r[o > r.length - 3 ? r.length - 1 : o + 2];
    return n.set(ms(a, s.x, c.x, l.x, u.x), ms(a, s.y, c.y, l.y, u.y)), n
}, Ss.prototype.copy = function(e) {
    as.prototype.copy.call(this, e), this.points = [];
    for (var t = 0, n = e.points.length; t < n; t++) {
        var r = e.points[t];
        this.points.push(r.clone())
    }
    return this
}, Ss.prototype.toJSON = function() {
    var e = as.prototype.toJSON.call(this);
    e.points = [];
    for (var t = 0, n = this.points.length; t < n; t++) {
        var r = this.points[t];
        e.points.push(r.toArray())
    }
    return e
}, Ss.prototype.fromJSON = function(e) {
    as.prototype.fromJSON.call(this, e), this.points = [];
    for (var t = 0, n = e.points.length; t < n; t++) {
        var r = e.points[t];
        this.points.push((new f).fromArray(r))
    }
    return this
};
var Es = Object.freeze({
    __proto__: null,
    ArcCurve: cs,
    CatmullRomCurve3: fs,
    CubicBezierCurve: ys,
    CubicBezierCurve3: xs,
    EllipseCurve: ss,
    LineCurve: _s,
    LineCurve3: bs,
    QuadraticBezierCurve: ws,
    QuadraticBezierCurve3: Ms,
    SplineCurve: Ss
});

function Ts() {
    as.call(this), this.type = "CurvePath", this.curves = [], this.autoClose = !1
}

function As(e) {
    Ts.call(this), this.type = "Path", this.currentPoint = new f, e && this.setFromPoints(e)
}

function Ls(e) {
    As.call(this, e), this.uuid = d.generateUUID(), this.type = "Shape", this.holes = []
}

function Rs(e, t) {
    $.call(this), this.type = "Light", this.color = new Ve(e), this.intensity = void 0 !== t ? t : 1, this.receiveShadow = void 0
}

function Ps(e, t, n) {
    Rs.call(this, e, n), this.type = "HemisphereLight", this.castShadow = void 0, this.position.copy($.DefaultUp), this.updateMatrix(), this.groundColor = new Ve(t)
}

function Cs(e) {
    this.camera = e, this.bias = 0, this.radius = 1, this.mapSize = new f(512, 512), this.map = null, this.mapPass = null, this.matrix = new D, this._frustum = new nn, this._frameExtents = new f(1, 1), this._viewportCount = 1, this._viewports = [new E(0, 0, 1, 1)]
}

function Os() {
    Cs.call(this, new Jt(50, 1, .5, 500))
}

function Is(e, t, n, r, i, o) {
    Rs.call(this, e, t), this.type = "SpotLight", this.position.copy($.DefaultUp), this.updateMatrix(), this.target = new $, Object.defineProperty(this, "power", {
        get: function() {
            return this.intensity * Math.PI
        },
        set: function(e) {
            this.intensity = e / Math.PI
        }
    }), this.distance = void 0 !== n ? n : 0, this.angle = void 0 !== r ? r : Math.PI / 3, this.penumbra = void 0 !== i ? i : 0, this.decay = void 0 !== o ? o : 1, this.shadow = new Os
}

function Ns() {
    Cs.call(this, new Jt(90, 1, .5, 500)), this._frameExtents = new f(4, 2), this._viewportCount = 6, this._viewports = [new E(2, 1, 1, 1), new E(0, 1, 1, 1), new E(3, 1, 1, 1), new E(1, 1, 1, 1), new E(3, 0, 1, 1), new E(1, 0, 1, 1)], this._cubeDirections = [new y(1, 0, 0), new y(-1, 0, 0), new y(0, 0, 1), new y(0, 0, -1), new y(0, 1, 0), new y(0, -1, 0)], this._cubeUps = [new y(0, 1, 0), new y(0, 1, 0), new y(0, 1, 0), new y(0, 1, 0), new y(0, 0, 1), new y(0, 0, -1)]
}

function Ds(e, t, n, r) {
    Rs.call(this, e, t), this.type = "PointLight", Object.defineProperty(this, "power", {
        get: function() {
            return 4 * this.intensity * Math.PI
        },
        set: function(e) {
            this.intensity = e / (4 * Math.PI)
        }
    }), this.distance = void 0 !== n ? n : 0, this.decay = void 0 !== r ? r : 1, this.shadow = new Ns
}

function Fs(e, t, n, r, i, o) {
    Zt.call(this), this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = void 0 !== e ? e : -1, this.right = void 0 !== t ? t : 1, this.top = void 0 !== n ? n : 1, this.bottom = void 0 !== r ? r : -1, this.near = void 0 !== i ? i : .1, this.far = void 0 !== o ? o : 2e3, this.updateProjectionMatrix()
}

function zs() {
    Cs.call(this, new Fs(-5, 5, 5, -5, .5, 500))
}

function Us(e, t) {
    Rs.call(this, e, t), this.type = "DirectionalLight", this.position.copy($.DefaultUp), this.updateMatrix(), this.target = new $, this.shadow = new zs
}

function Bs(e, t) {
    Rs.call(this, e, t), this.type = "AmbientLight", this.castShadow = void 0
}

function ks(e, t, n, r) {
    Rs.call(this, e, t), this.type = "RectAreaLight", this.width = void 0 !== n ? n : 10, this.height = void 0 !== r ? r : 10
}

function Gs(e) {
    Ka.call(this, e), this.textures = {}
}
Ts.prototype = Object.assign(Object.create(as.prototype), {
    constructor: Ts,
    add: function(e) {
        this.curves.push(e)
    },
    closePath: function() {
        var e = this.curves[0].getPoint(0),
            t = this.curves[this.curves.length - 1].getPoint(1);
        e.equals(t) || this.curves.push(new _s(t, e))
    },
    getPoint: function(e) {
        for (var t = e * this.getLength(), n = this.getCurveLengths(), r = 0; r < n.length;) {
            if (n[r] >= t) {
                var i = n[r] - t,
                    o = this.curves[r],
                    a = o.getLength(),
                    s = 0 === a ? 0 : 1 - i / a;
                return o.getPointAt(s)
            }
            r++
        }
        return null
    },
    getLength: function() {
        var e = this.getCurveLengths();
        return e[e.length - 1]
    },
    updateArcLengths: function() {
        this.needsUpdate = !0, this.cacheLengths = null, this.getCurveLengths()
    },
    getCurveLengths: function() {
        if (this.cacheLengths && this.cacheLengths.length === this.curves.length) return this.cacheLengths;
        for (var e = [], t = 0, n = 0, r = this.curves.length; n < r; n++) t += this.curves[n].getLength(), e.push(t);
        return this.cacheLengths = e, e
    },
    getSpacedPoints: function(e) {
        void 0 === e && (e = 40);
        for (var t = [], n = 0; n <= e; n++) t.push(this.getPoint(n / e));
        return this.autoClose && t.push(t[0]), t
    },
    getPoints: function(e) {
        e = e || 12;
        for (var t, n = [], r = 0, i = this.curves; r < i.length; r++)
            for (var o = i[r], a = o && o.isEllipseCurve ? 2 * e : o && (o.isLineCurve || o.isLineCurve3) ? 1 : o && o.isSplineCurve ? e * o.points.length : e, s = o.getPoints(a), c = 0; c < s.length; c++) {
                var l = s[c];
                t && t.equals(l) || (n.push(l), t = l)
            }
        return this.autoClose && n.length > 1 && !n[n.length - 1].equals(n[0]) && n.push(n[0]), n
    },
    copy: function(e) {
        as.prototype.copy.call(this, e), this.curves = [];
        for (var t = 0, n = e.curves.length; t < n; t++) {
            var r = e.curves[t];
            this.curves.push(r.clone())
        }
        return this.autoClose = e.autoClose, this
    },
    toJSON: function() {
        var e = as.prototype.toJSON.call(this);
        e.autoClose = this.autoClose, e.curves = [];
        for (var t = 0, n = this.curves.length; t < n; t++) {
            var r = this.curves[t];
            e.curves.push(r.toJSON())
        }
        return e
    },
    fromJSON: function(e) {
        as.prototype.fromJSON.call(this, e), this.autoClose = e.autoClose, this.curves = [];
        for (var t = 0, n = e.curves.length; t < n; t++) {
            var r = e.curves[t];
            this.curves.push((new Es[r.type]).fromJSON(r))
        }
        return this
    }
}), As.prototype = Object.assign(Object.create(Ts.prototype), {
    constructor: As,
    setFromPoints: function(e) {
        this.moveTo(e[0].x, e[0].y);
        for (var t = 1, n = e.length; t < n; t++) this.lineTo(e[t].x, e[t].y);
        return this
    },
    moveTo: function(e, t) {
        return this.currentPoint.set(e, t), this
    },
    lineTo: function(e, t) {
        var n = new _s(this.currentPoint.clone(), new f(e, t));
        return this.curves.push(n), this.currentPoint.set(e, t), this
    },
    quadraticCurveTo: function(e, t, n, r) {
        var i = new ws(this.currentPoint.clone(), new f(e, t), new f(n, r));
        return this.curves.push(i), this.currentPoint.set(n, r), this
    },
    bezierCurveTo: function(e, t, n, r, i, o) {
        var a = new ys(this.currentPoint.clone(), new f(e, t), new f(n, r), new f(i, o));
        return this.curves.push(a), this.currentPoint.set(i, o), this
    },
    splineThru: function(e) {
        var t = new Ss([this.currentPoint.clone()].concat(e));
        return this.curves.push(t), this.currentPoint.copy(e[e.length - 1]), this
    },
    arc: function(e, t, n, r, i, o) {
        var a = this.currentPoint.x,
            s = this.currentPoint.y;
        return this.absarc(e + a, t + s, n, r, i, o), this
    },
    absarc: function(e, t, n, r, i, o) {
        return this.absellipse(e, t, n, n, r, i, o), this
    },
    ellipse: function(e, t, n, r, i, o, a, s) {
        var c = this.currentPoint.x,
            l = this.currentPoint.y;
        return this.absellipse(e + c, t + l, n, r, i, o, a, s), this
    },
    absellipse: function(e, t, n, r, i, o, a, s) {
        var c = new ss(e, t, n, r, i, o, a, s);
        if (this.curves.length > 0) {
            var l = c.getPoint(0);
            l.equals(this.currentPoint) || this.lineTo(l.x, l.y)
        }
        this.curves.push(c);
        var u = c.getPoint(1);
        return this.currentPoint.copy(u), this
    },
    copy: function(e) {
        return Ts.prototype.copy.call(this, e), this.currentPoint.copy(e.currentPoint), this
    },
    toJSON: function() {
        var e = Ts.prototype.toJSON.call(this);
        return e.currentPoint = this.currentPoint.toArray(), e
    },
    fromJSON: function(e) {
        return Ts.prototype.fromJSON.call(this, e), this.currentPoint.fromArray(e.currentPoint), this
    }
}), Ls.prototype = Object.assign(Object.create(As.prototype), {
    constructor: Ls,
    getPointsHoles: function(e) {
        for (var t = [], n = 0, r = this.holes.length; n < r; n++) t[n] = this.holes[n].getPoints(e);
        return t
    },
    extractPoints: function(e) {
        return {
            shape: this.getPoints(e),
            holes: this.getPointsHoles(e)
        }
    },
    copy: function(e) {
        As.prototype.copy.call(this, e), this.holes = [];
        for (var t = 0, n = e.holes.length; t < n; t++) {
            var r = e.holes[t];
            this.holes.push(r.clone())
        }
        return this
    },
    toJSON: function() {
        var e = As.prototype.toJSON.call(this);
        e.uuid = this.uuid, e.holes = [];
        for (var t = 0, n = this.holes.length; t < n; t++) {
            var r = this.holes[t];
            e.holes.push(r.toJSON())
        }
        return e
    },
    fromJSON: function(e) {
        As.prototype.fromJSON.call(this, e), this.uuid = e.uuid, this.holes = [];
        for (var t = 0, n = e.holes.length; t < n; t++) {
            var r = e.holes[t];
            this.holes.push((new As).fromJSON(r))
        }
        return this
    }
}), Rs.prototype = Object.assign(Object.create($.prototype), {
    constructor: Rs,
    isLight: !0,
    copy: function(e) {
        return $.prototype.copy.call(this, e), this.color.copy(e.color), this.intensity = e.intensity, this
    },
    toJSON: function(e) {
        var t = $.prototype.toJSON.call(this, e);
        return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, void 0 !== this.groundColor && (t.object.groundColor = this.groundColor.getHex()), void 0 !== this.distance && (t.object.distance = this.distance), void 0 !== this.angle && (t.object.angle = this.angle), void 0 !== this.decay && (t.object.decay = this.decay), void 0 !== this.penumbra && (t.object.penumbra = this.penumbra), void 0 !== this.shadow && (t.object.shadow = this.shadow.toJSON()), t
    }
}), Ps.prototype = Object.assign(Object.create(Rs.prototype), {
    constructor: Ps,
    isHemisphereLight: !0,
    copy: function(e) {
        return Rs.prototype.copy.call(this, e), this.groundColor.copy(e.groundColor), this
    }
}), Object.assign(Cs.prototype, {
    _projScreenMatrix: new D,
    _lightPositionWorld: new y,
    _lookTarget: new y,
    getViewportCount: function() {
        return this._viewportCount
    },
    getFrustum: function() {
        return this._frustum
    },
    updateMatrices: function(e) {
        var t = this.camera,
            n = this.matrix,
            r = this._projScreenMatrix,
            i = this._lookTarget,
            o = this._lightPositionWorld;
        o.setFromMatrixPosition(e.matrixWorld), t.position.copy(o), i.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(i), t.updateMatrixWorld(), r.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._frustum.setFromMatrix(r), n.set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1), n.multiply(t.projectionMatrix), n.multiply(t.matrixWorldInverse)
    },
    getViewport: function(e) {
        return this._viewports[e]
    },
    getFrameExtents: function() {
        return this._frameExtents
    },
    copy: function(e) {
        return this.camera = e.camera.clone(), this.bias = e.bias, this.radius = e.radius, this.mapSize.copy(e.mapSize), this
    },
    clone: function() {
        return (new this.constructor).copy(this)
    },
    toJSON: function() {
        var e = {};
        return 0 !== this.bias && (e.bias = this.bias), 1 !== this.radius && (e.radius = this.radius), 512 === this.mapSize.x && 512 === this.mapSize.y || (e.mapSize = this.mapSize.toArray()), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e
    }
}), Os.prototype = Object.assign(Object.create(Cs.prototype), {
    constructor: Os,
    isSpotLightShadow: !0,
    updateMatrices: function(e) {
        var t = this.camera,
            n = 2 * d.RAD2DEG * e.angle,
            r = this.mapSize.width / this.mapSize.height,
            i = e.distance || t.far;
        n === t.fov && r === t.aspect && i === t.far || (t.fov = n, t.aspect = r, t.far = i, t.updateProjectionMatrix()), Cs.prototype.updateMatrices.call(this, e)
    }
}), Is.prototype = Object.assign(Object.create(Rs.prototype), {
    constructor: Is,
    isSpotLight: !0,
    copy: function(e) {
        return Rs.prototype.copy.call(this, e), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.shadow = e.shadow.clone(), this
    }
}), Ns.prototype = Object.assign(Object.create(Cs.prototype), {
    constructor: Ns,
    isPointLightShadow: !0,
    updateMatrices: function(e, t) {
        void 0 === t && (t = 0);
        var n = this.camera,
            r = this.matrix,
            i = this._lightPositionWorld,
            o = this._lookTarget,
            a = this._projScreenMatrix;
        i.setFromMatrixPosition(e.matrixWorld), n.position.copy(i), o.copy(n.position), o.add(this._cubeDirections[t]), n.up.copy(this._cubeUps[t]), n.lookAt(o), n.updateMatrixWorld(), r.makeTranslation(-i.x, -i.y, -i.z), a.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse), this._frustum.setFromMatrix(a)
    }
}), Ds.prototype = Object.assign(Object.create(Rs.prototype), {
    constructor: Ds,
    isPointLight: !0,
    copy: function(e) {
        return Rs.prototype.copy.call(this, e), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this
    }
}), Fs.prototype = Object.assign(Object.create(Zt.prototype), {
    constructor: Fs,
    isOrthographicCamera: !0,
    copy: function(e, t) {
        return Zt.prototype.copy.call(this, e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = null === e.view ? null : Object.assign({}, e.view), this
    },
    setViewOffset: function(e, t, n, r, i, o) {
        null === this.view && (this.view = {
            enabled: !0,
            fullWidth: 1,
            fullHeight: 1,
            offsetX: 0,
            offsetY: 0,
            width: 1,
            height: 1
        }), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = i, this.view.height = o, this.updateProjectionMatrix()
    },
    clearViewOffset: function() {
        null !== this.view && (this.view.enabled = !1), this.updateProjectionMatrix()
    },
    updateProjectionMatrix: function() {
        var e = (this.right - this.left) / (2 * this.zoom),
            t = (this.top - this.bottom) / (2 * this.zoom),
            n = (this.right + this.left) / 2,
            r = (this.top + this.bottom) / 2,
            i = n - e,
            o = n + e,
            a = r + t,
            s = r - t;
        if (null !== this.view && this.view.enabled) {
            var c = this.zoom / (this.view.width / this.view.fullWidth),
                l = this.zoom / (this.view.height / this.view.fullHeight),
                u = (this.right - this.left) / this.view.width,
                h = (this.top - this.bottom) / this.view.height;
            o = (i += u * (this.view.offsetX / c)) + u * (this.view.width / c), s = (a -= h * (this.view.offsetY / l)) - h * (this.view.height / l)
        }
        this.projectionMatrix.makeOrthographic(i, o, a, s, this.near, this.far), this.projectionMatrixInverse.getInverse(this.projectionMatrix)
    },
    toJSON: function(e) {
        var t = $.prototype.toJSON.call(this, e);
        return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, null !== this.view && (t.object.view = Object.assign({}, this.view)), t
    }
}), zs.prototype = Object.assign(Object.create(Cs.prototype), {
    constructor: zs,
    isDirectionalLightShadow: !0,
    updateMatrices: function(e) {
        Cs.prototype.updateMatrices.call(this, e)
    }
}), Us.prototype = Object.assign(Object.create(Rs.prototype), {
    constructor: Us,
    isDirectionalLight: !0,
    copy: function(e) {
        return Rs.prototype.copy.call(this, e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this
    }
}), Bs.prototype = Object.assign(Object.create(Rs.prototype), {
    constructor: Bs,
    isAmbientLight: !0
}), ks.prototype = Object.assign(Object.create(Rs.prototype), {
    constructor: ks,
    isRectAreaLight: !0,
    copy: function(e) {
        return Rs.prototype.copy.call(this, e), this.width = e.width, this.height = e.height, this
    },
    toJSON: function(e) {
        var t = Rs.prototype.toJSON.call(this, e);
        return t.object.width = this.width, t.object.height = this.height, t
    }
}), Gs.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: Gs,
    load: function(e, t, n, r) {
        var i = this,
            o = new $a(i.manager);
        o.setPath(i.path), o.load(e, (function(e) {
            t(i.parse(JSON.parse(e)))
        }), n, r)
    },
    parse: function(e) {
        var t = this.textures;

        function n(e) {
            return void 0 === t[e] && console.warn("THREE.MaterialLoader: Undefined texture", e), t[e]
        }
        var r = new Oa[e.type];
        if (void 0 !== e.uuid && (r.uuid = e.uuid), void 0 !== e.name && (r.name = e.name), void 0 !== e.color && r.color.setHex(e.color), void 0 !== e.roughness && (r.roughness = e.roughness), void 0 !== e.metalness && (r.metalness = e.metalness), void 0 !== e.sheen && (r.sheen = (new Ve).setHex(e.sheen)), void 0 !== e.emissive && r.emissive.setHex(e.emissive), void 0 !== e.specular && r.specular.setHex(e.specular), void 0 !== e.shininess && (r.shininess = e.shininess), void 0 !== e.clearcoat && (r.clearcoat = e.clearcoat), void 0 !== e.clearcoatRoughness && (r.clearcoatRoughness = e.clearcoatRoughness), void 0 !== e.vertexColors && (r.vertexColors = e.vertexColors), void 0 !== e.fog && (r.fog = e.fog), void 0 !== e.flatShading && (r.flatShading = e.flatShading), void 0 !== e.blending && (r.blending = e.blending), void 0 !== e.combine && (r.combine = e.combine), void 0 !== e.side && (r.side = e.side), void 0 !== e.opacity && (r.opacity = e.opacity), void 0 !== e.transparent && (r.transparent = e.transparent), void 0 !== e.alphaTest && (r.alphaTest = e.alphaTest), void 0 !== e.depthTest && (r.depthTest = e.depthTest), void 0 !== e.depthWrite && (r.depthWrite = e.depthWrite), void 0 !== e.colorWrite && (r.colorWrite = e.colorWrite), void 0 !== e.stencilWrite && (r.stencilWrite = e.stencilWrite), void 0 !== e.stencilWriteMask && (r.stencilWriteMask = e.stencilWriteMask), void 0 !== e.stencilFunc && (r.stencilFunc = e.stencilFunc), void 0 !== e.stencilRef && (r.stencilRef = e.stencilRef), void 0 !== e.stencilFuncMask && (r.stencilFuncMask = e.stencilFuncMask), void 0 !== e.stencilFail && (r.stencilFail = e.stencilFail), void 0 !== e.stencilZFail && (r.stencilZFail = e.stencilZFail), void 0 !== e.stencilZPass && (r.stencilZPass = e.stencilZPass), void 0 !== e.wireframe && (r.wireframe = e.wireframe), void 0 !== e.wireframeLinewidth && (r.wireframeLinewidth = e.wireframeLinewidth), void 0 !== e.wireframeLinecap && (r.wireframeLinecap = e.wireframeLinecap), void 0 !== e.wireframeLinejoin && (r.wireframeLinejoin = e.wireframeLinejoin), void 0 !== e.rotation && (r.rotation = e.rotation), 1 !== e.linewidth && (r.linewidth = e.linewidth), void 0 !== e.dashSize && (r.dashSize = e.dashSize), void 0 !== e.gapSize && (r.gapSize = e.gapSize), void 0 !== e.scale && (r.scale = e.scale), void 0 !== e.polygonOffset && (r.polygonOffset = e.polygonOffset), void 0 !== e.polygonOffsetFactor && (r.polygonOffsetFactor = e.polygonOffsetFactor), void 0 !== e.polygonOffsetUnits && (r.polygonOffsetUnits = e.polygonOffsetUnits), void 0 !== e.skinning && (r.skinning = e.skinning), void 0 !== e.morphTargets && (r.morphTargets = e.morphTargets), void 0 !== e.morphNormals && (r.morphNormals = e.morphNormals), void 0 !== e.dithering && (r.dithering = e.dithering), void 0 !== e.visible && (r.visible = e.visible), void 0 !== e.toneMapped && (r.toneMapped = e.toneMapped), void 0 !== e.userData && (r.userData = e.userData), void 0 !== e.uniforms)
            for (var i in e.uniforms) {
                var o = e.uniforms[i];
                switch (r.uniforms[i] = {}, o.type) {
                    case "t":
                        r.uniforms[i].value = n(o.value);
                        break;
                    case "c":
                        r.uniforms[i].value = (new Ve).setHex(o.value);
                        break;
                    case "v2":
                        r.uniforms[i].value = (new f).fromArray(o.value);
                        break;
                    case "v3":
                        r.uniforms[i].value = (new y).fromArray(o.value);
                        break;
                    case "v4":
                        r.uniforms[i].value = (new E).fromArray(o.value);
                        break;
                    case "m3":
                        r.uniforms[i].value = (new b).fromArray(o.value);
                    case "m4":
                        r.uniforms[i].value = (new D).fromArray(o.value);
                        break;
                    default:
                        r.uniforms[i].value = o.value
                }
            }
        if (void 0 !== e.defines && (r.defines = e.defines), void 0 !== e.vertexShader && (r.vertexShader = e.vertexShader), void 0 !== e.fragmentShader && (r.fragmentShader = e.fragmentShader), void 0 !== e.extensions)
            for (var a in e.extensions) r.extensions[a] = e.extensions[a];
        if (void 0 !== e.shading && (r.flatShading = 1 === e.shading), void 0 !== e.size && (r.size = e.size), void 0 !== e.sizeAttenuation && (r.sizeAttenuation = e.sizeAttenuation), void 0 !== e.map && (r.map = n(e.map)), void 0 !== e.matcap && (r.matcap = n(e.matcap)), void 0 !== e.alphaMap && (r.alphaMap = n(e.alphaMap), r.transparent = !0), void 0 !== e.bumpMap && (r.bumpMap = n(e.bumpMap)), void 0 !== e.bumpScale && (r.bumpScale = e.bumpScale), void 0 !== e.normalMap && (r.normalMap = n(e.normalMap)), void 0 !== e.normalMapType && (r.normalMapType = e.normalMapType), void 0 !== e.normalScale) {
            var s = e.normalScale;
            !1 === Array.isArray(s) && (s = [s, s]), r.normalScale = (new f).fromArray(s)
        }
        return void 0 !== e.displacementMap && (r.displacementMap = n(e.displacementMap)), void 0 !== e.displacementScale && (r.displacementScale = e.displacementScale), void 0 !== e.displacementBias && (r.displacementBias = e.displacementBias), void 0 !== e.roughnessMap && (r.roughnessMap = n(e.roughnessMap)), void 0 !== e.metalnessMap && (r.metalnessMap = n(e.metalnessMap)), void 0 !== e.emissiveMap && (r.emissiveMap = n(e.emissiveMap)), void 0 !== e.emissiveIntensity && (r.emissiveIntensity = e.emissiveIntensity), void 0 !== e.specularMap && (r.specularMap = n(e.specularMap)), void 0 !== e.envMap && (r.envMap = n(e.envMap)), void 0 !== e.envMapIntensity && (r.envMapIntensity = e.envMapIntensity), void 0 !== e.reflectivity && (r.reflectivity = e.reflectivity), void 0 !== e.refractionRatio && (r.refractionRatio = e.refractionRatio), void 0 !== e.lightMap && (r.lightMap = n(e.lightMap)), void 0 !== e.lightMapIntensity && (r.lightMapIntensity = e.lightMapIntensity), void 0 !== e.aoMap && (r.aoMap = n(e.aoMap)), void 0 !== e.aoMapIntensity && (r.aoMapIntensity = e.aoMapIntensity), void 0 !== e.gradientMap && (r.gradientMap = n(e.gradientMap)), void 0 !== e.clearcoatNormalMap && (r.clearcoatNormalMap = n(e.clearcoatNormalMap)), void 0 !== e.clearcoatNormalScale && (r.clearcoatNormalScale = (new f).fromArray(e.clearcoatNormalScale)), r
    },
    setTextures: function(e) {
        return this.textures = e, this
    }
});
var Hs = function(e) {
        if ("undefined" != typeof TextDecoder) return (new TextDecoder).decode(e);
        for (var t = "", n = 0, r = e.length; n < r; n++) t += String.fromCharCode(e[n]);
        try {
            return decodeURIComponent(escape(t))
        } catch (e) {
            return t
        }
    },
    js = function(e) {
        var t = e.lastIndexOf("/");
        return -1 === t ? "./" : e.substr(0, t + 1)
    };

function Vs() {
    yt.call(this), this.type = "InstancedBufferGeometry", this.maxInstancedCount = void 0
}

function Ws(e, t, n, r) {
    "number" == typeof n && (r = n, n = !1, console.error("THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.")), $e.call(this, e, t, n), this.meshPerAttribute = r || 1
}

function Xs(e) {
    Ka.call(this, e)
}
Vs.prototype = Object.assign(Object.create(yt.prototype), {
    constructor: Vs,
    isInstancedBufferGeometry: !0,
    copy: function(e) {
        return yt.prototype.copy.call(this, e), this.maxInstancedCount = e.maxInstancedCount, this
    },
    clone: function() {
        return (new this.constructor).copy(this)
    },
    toJSON: function() {
        var e = yt.prototype.toJSON.call(this);
        return e.maxInstancedCount = this.maxInstancedCount, e.isInstancedBufferGeometry = !0, e
    }
}), Ws.prototype = Object.assign(Object.create($e.prototype), {
    constructor: Ws,
    isInstancedBufferAttribute: !0,
    copy: function(e) {
        return $e.prototype.copy.call(this, e), this.meshPerAttribute = e.meshPerAttribute, this
    },
    toJSON: function() {
        var e = $e.prototype.toJSON.call(this);
        return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e
    }
}), Xs.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: Xs,
    load: function(e, t, n, r) {
        var i = this,
            o = new $a(i.manager);
        o.setPath(i.path), o.load(e, (function(e) {
            t(i.parse(JSON.parse(e)))
        }), n, r)
    },
    parse: function(e) {
        var t = e.isInstancedBufferGeometry ? new Vs : new yt,
            n = e.data.index;
        if (void 0 !== n) {
            var r = new qs[n.type](n.array);
            t.setIndex(new $e(r, 1))
        }
        var i = e.data.attributes;
        for (var o in i) {
            var a = i[o],
                s = (r = new qs[a.type](a.array), new(a.isInstancedBufferAttribute ? Ws : $e)(r, a.itemSize, a.normalized));
            void 0 !== a.name && (s.name = a.name), t.setAttribute(o, s)
        }
        var c = e.data.morphAttributes;
        if (c)
            for (var o in c) {
                for (var l = c[o], u = [], h = 0, p = l.length; h < p; h++) {
                    a = l[h], s = new $e(r = new qs[a.type](a.array), a.itemSize, a.normalized);
                    void 0 !== a.name && (s.name = a.name), u.push(s)
                }
                t.morphAttributes[o] = u
            }
        e.data.morphTargetsRelative && (t.morphTargetsRelative = !0);
        var d = e.data.groups || e.data.drawcalls || e.data.offsets;
        if (void 0 !== d) {
            h = 0;
            for (var f = d.length; h !== f; ++h) {
                var m = d[h];
                t.addGroup(m.start, m.count, m.materialIndex)
            }
        }
        var v = e.data.boundingSphere;
        if (void 0 !== v) {
            var g = new y;
            void 0 !== v.center && g.fromArray(v.center), t.boundingSphere = new ge(g, v.radius)
        }
        return e.name && (t.name = e.name), e.userData && (t.userData = e.userData), t
    }
});
var qs = {
    Int8Array: Int8Array,
    Uint8Array: Uint8Array,
    Uint8ClampedArray: "undefined" != typeof Uint8ClampedArray ? Uint8ClampedArray : Uint8Array,
    Int16Array: Int16Array,
    Uint16Array: Uint16Array,
    Int32Array: Int32Array,
    Uint32Array: Uint32Array,
    Float32Array: Float32Array,
    Float64Array: Float64Array
};

function Ys(e) {
    Ka.call(this, e)
}
Ys.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: Ys,
    load: function(e, t, n, r) {
        var i = this,
            o = "" === this.path ? js(e) : this.path;
        this.resourcePath = this.resourcePath || o;
        var a = new $a(i.manager);
        a.setPath(this.path), a.load(e, (function(n) {
            var o = null;
            try {
                o = JSON.parse(n)
            } catch (t) {
                return void 0 !== r && r(t), void console.error("THREE:ObjectLoader: Can't parse " + e + ".", t.message)
            }
            var a = o.metadata;
            void 0 !== a && void 0 !== a.type && "geometry" !== a.type.toLowerCase() ? i.parse(o, t) : console.error("THREE.ObjectLoader: Can't load " + e)
        }), n, r)
    },
    parse: function(e, t) {
        var n = this.parseShape(e.shapes),
            r = this.parseGeometries(e.geometries, n),
            i = this.parseImages(e.images, (function() {
                void 0 !== t && t(s)
            })),
            o = this.parseTextures(e.textures, i),
            a = this.parseMaterials(e.materials, o),
            s = this.parseObject(e.object, r, a);
        return e.animations && (s.animations = this.parseAnimations(e.animations)), void 0 !== e.images && 0 !== e.images.length || void 0 !== t && t(s), s
    },
    parseShape: function(e) {
        var t = {};
        if (void 0 !== e)
            for (var n = 0, r = e.length; n < r; n++) {
                var i = (new Ls).fromJSON(e[n]);
                t[i.uuid] = i
            }
        return t
    },
    parseGeometries: function(e, t) {
        var n = {};
        if (void 0 !== e)
            for (var r = new Xs, i = 0, o = e.length; i < o; i++) {
                var a, s = e[i];
                switch (s.type) {
                    case "PlaneGeometry":
                    case "PlaneBufferGeometry":
                        a = new ba[s.type](s.width, s.height, s.widthSegments, s.heightSegments);
                        break;
                    case "BoxGeometry":
                    case "BoxBufferGeometry":
                    case "CubeGeometry":
                        a = new ba[s.type](s.width, s.height, s.depth, s.widthSegments, s.heightSegments, s.depthSegments);
                        break;
                    case "CircleGeometry":
                    case "CircleBufferGeometry":
                        a = new ba[s.type](s.radius, s.segments, s.thetaStart, s.thetaLength);
                        break;
                    case "CylinderGeometry":
                    case "CylinderBufferGeometry":
                        a = new ba[s.type](s.radiusTop, s.radiusBottom, s.height, s.radialSegments, s.heightSegments, s.openEnded, s.thetaStart, s.thetaLength);
                        break;
                    case "ConeGeometry":
                    case "ConeBufferGeometry":
                        a = new ba[s.type](s.radius, s.height, s.radialSegments, s.heightSegments, s.openEnded, s.thetaStart, s.thetaLength);
                        break;
                    case "SphereGeometry":
                    case "SphereBufferGeometry":
                        a = new ba[s.type](s.radius, s.widthSegments, s.heightSegments, s.phiStart, s.phiLength, s.thetaStart, s.thetaLength);
                        break;
                    case "DodecahedronGeometry":
                    case "DodecahedronBufferGeometry":
                    case "IcosahedronGeometry":
                    case "IcosahedronBufferGeometry":
                    case "OctahedronGeometry":
                    case "OctahedronBufferGeometry":
                    case "TetrahedronGeometry":
                    case "TetrahedronBufferGeometry":
                        a = new ba[s.type](s.radius, s.detail);
                        break;
                    case "RingGeometry":
                    case "RingBufferGeometry":
                        a = new ba[s.type](s.innerRadius, s.outerRadius, s.thetaSegments, s.phiSegments, s.thetaStart, s.thetaLength);
                        break;
                    case "TorusGeometry":
                    case "TorusBufferGeometry":
                        a = new ba[s.type](s.radius, s.tube, s.radialSegments, s.tubularSegments, s.arc);
                        break;
                    case "TorusKnotGeometry":
                    case "TorusKnotBufferGeometry":
                        a = new ba[s.type](s.radius, s.tube, s.tubularSegments, s.radialSegments, s.p, s.q);
                        break;
                    case "TubeGeometry":
                    case "TubeBufferGeometry":
                        a = new ba[s.type]((new Es[s.path.type]).fromJSON(s.path), s.tubularSegments, s.radius, s.radialSegments, s.closed);
                        break;
                    case "LatheGeometry":
                    case "LatheBufferGeometry":
                        a = new ba[s.type](s.points, s.segments, s.phiStart, s.phiLength);
                        break;
                    case "PolyhedronGeometry":
                    case "PolyhedronBufferGeometry":
                        a = new ba[s.type](s.vertices, s.indices, s.radius, s.details);
                        break;
                    case "ShapeGeometry":
                    case "ShapeBufferGeometry":
                        for (var c = [], l = 0, u = s.shapes.length; l < u; l++) {
                            var h = t[s.shapes[l]];
                            c.push(h)
                        }
                        a = new ba[s.type](c, s.curveSegments);
                        break;
                    case "ExtrudeGeometry":
                    case "ExtrudeBufferGeometry":
                        for (c = [], l = 0, u = s.shapes.length; l < u; l++) {
                            h = t[s.shapes[l]];
                            c.push(h)
                        }
                        var p = s.options.extrudePath;
                        void 0 !== p && (s.options.extrudePath = (new Es[p.type]).fromJSON(p)), a = new ba[s.type](c, s.options);
                        break;
                    case "BufferGeometry":
                    case "InstancedBufferGeometry":
                        a = r.parse(s);
                        break;
                    case "Geometry":
                        if ("THREE" in window && "LegacyJSONLoader" in THREE) a = (new THREE.LegacyJSONLoader).parse(s, this.resourcePath).geometry;
                        else console.error('THREE.ObjectLoader: You have to import LegacyJSONLoader in order load geometry data of type "Geometry".');
                        break;
                    default:
                        console.warn('THREE.ObjectLoader: Unsupported geometry type "' + s.type + '"');
                        continue
                }
                a.uuid = s.uuid, void 0 !== s.name && (a.name = s.name), !0 === a.isBufferGeometry && void 0 !== s.userData && (a.userData = s.userData), n[s.uuid] = a
            }
        return n
    },
    parseMaterials: function(e, t) {
        var n = {},
            r = {};
        if (void 0 !== e) {
            var i = new Gs;
            i.setTextures(t);
            for (var o = 0, a = e.length; o < a; o++) {
                var s = e[o];
                if ("MultiMaterial" === s.type) {
                    for (var c = [], l = 0; l < s.materials.length; l++) {
                        var u = s.materials[l];
                        void 0 === n[u.uuid] && (n[u.uuid] = i.parse(u)), c.push(n[u.uuid])
                    }
                    r[s.uuid] = c
                } else void 0 === n[s.uuid] && (n[s.uuid] = i.parse(s)), r[s.uuid] = n[s.uuid]
            }
        }
        return r
    },
    parseAnimations: function(e) {
        for (var t = [], n = 0; n < e.length; n++) {
            var r = e[n],
                i = Xa.parse(r);
            void 0 !== r.uuid && (i.uuid = r.uuid), t.push(i)
        }
        return t
    },
    parseImages: function(e, t) {
        var n = this,
            r = {};

        function i(e) {
            return n.manager.itemStart(e), o.load(e, (function() {
                n.manager.itemEnd(e)
            }), void 0, (function() {
                n.manager.itemError(e), n.manager.itemEnd(e)
            }))
        }
        if (void 0 !== e && e.length > 0) {
            var o = new rs(new Za(t));
            o.setCrossOrigin(this.crossOrigin);
            for (var a = 0, s = e.length; a < s; a++) {
                var c = e[a],
                    l = c.url;
                if (Array.isArray(l)) {
                    r[c.uuid] = [];
                    for (var u = 0, h = l.length; u < h; u++) {
                        var p = l[u],
                            d = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(p) ? p : n.resourcePath + p;
                        r[c.uuid].push(i(d))
                    }
                } else {
                    d = /^(\/\/)|([a-z]+:(\/\/)?)/i.test(c.url) ? c.url : n.resourcePath + c.url;
                    r[c.uuid] = i(d)
                }
            }
        }
        return r
    },
    parseTextures: function(e, t) {
        function n(e, t) {
            return "number" == typeof e ? e : (console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.", e), t[e])
        }
        var r = {};
        if (void 0 !== e)
            for (var i = 0, o = e.length; i < o; i++) {
                var a, s = e[i];
                void 0 === s.image && console.warn('THREE.ObjectLoader: No "image" specified for', s.uuid), void 0 === t[s.image] && console.warn("THREE.ObjectLoader: Undefined image", s.image), (a = Array.isArray(t[s.image]) ? new wn(t[s.image]) : new S(t[s.image])).needsUpdate = !0, a.uuid = s.uuid, void 0 !== s.name && (a.name = s.name), void 0 !== s.mapping && (a.mapping = n(s.mapping, Js)), void 0 !== s.offset && a.offset.fromArray(s.offset), void 0 !== s.repeat && a.repeat.fromArray(s.repeat), void 0 !== s.center && a.center.fromArray(s.center), void 0 !== s.rotation && (a.rotation = s.rotation), void 0 !== s.wrap && (a.wrapS = n(s.wrap[0], Ks), a.wrapT = n(s.wrap[1], Ks)), void 0 !== s.format && (a.format = s.format), void 0 !== s.type && (a.type = s.type), void 0 !== s.encoding && (a.encoding = s.encoding), void 0 !== s.minFilter && (a.minFilter = n(s.minFilter, Qs)), void 0 !== s.magFilter && (a.magFilter = n(s.magFilter, Qs)), void 0 !== s.anisotropy && (a.anisotropy = s.anisotropy), void 0 !== s.flipY && (a.flipY = s.flipY), void 0 !== s.premultiplyAlpha && (a.premultiplyAlpha = s.premultiplyAlpha), void 0 !== s.unpackAlignment && (a.unpackAlignment = s.unpackAlignment), r[s.uuid] = a
            }
        return r
    },
    parseObject: function(e, t, n) {
        var r;

        function i(e) {
            return void 0 === t[e] && console.warn("THREE.ObjectLoader: Undefined geometry", e), t[e]
        }

        function o(e) {
            if (void 0 !== e) {
                if (Array.isArray(e)) {
                    for (var t = [], r = 0, i = e.length; r < i; r++) {
                        var o = e[r];
                        void 0 === n[o] && console.warn("THREE.ObjectLoader: Undefined material", o), t.push(n[o])
                    }
                    return t
                }
                return void 0 === n[e] && console.warn("THREE.ObjectLoader: Undefined material", e), n[e]
            }
        }
        switch (e.type) {
            case "Scene":
                r = new ee, void 0 !== e.background && Number.isInteger(e.background) && (r.background = new Ve(e.background)), void 0 !== e.fog && ("Fog" === e.fog.type ? r.fog = new si(e.fog.color, e.fog.near, e.fog.far) : "FogExp2" === e.fog.type && (r.fog = new ai(e.fog.color, e.fog.density)));
                break;
            case "PerspectiveCamera":
                r = new Jt(e.fov, e.aspect, e.near, e.far), void 0 !== e.focus && (r.focus = e.focus), void 0 !== e.zoom && (r.zoom = e.zoom), void 0 !== e.filmGauge && (r.filmGauge = e.filmGauge), void 0 !== e.filmOffset && (r.filmOffset = e.filmOffset), void 0 !== e.view && (r.view = Object.assign({}, e.view));
                break;
            case "OrthographicCamera":
                r = new Fs(e.left, e.right, e.top, e.bottom, e.near, e.far), void 0 !== e.zoom && (r.zoom = e.zoom), void 0 !== e.view && (r.view = Object.assign({}, e.view));
                break;
            case "AmbientLight":
                r = new Bs(e.color, e.intensity);
                break;
            case "DirectionalLight":
                r = new Us(e.color, e.intensity);
                break;
            case "PointLight":
                r = new Ds(e.color, e.intensity, e.distance, e.decay);
                break;
            case "RectAreaLight":
                r = new ks(e.color, e.intensity, e.width, e.height);
                break;
            case "SpotLight":
                r = new Is(e.color, e.intensity, e.distance, e.angle, e.penumbra, e.decay);
                break;
            case "HemisphereLight":
                r = new Ps(e.color, e.groundColor, e.intensity);
                break;
            case "SkinnedMesh":
                console.warn("THREE.ObjectLoader.parseObject() does not support SkinnedMesh yet.");
            case "Mesh":
                var a = i(e.geometry),
                    s = o(e.material);
                r = a.bones && a.bones.length > 0 ? new Pi(a, s) : new Ft(a, s);
                break;
            case "InstancedMesh":
                a = i(e.geometry), s = o(e.material);
                var c = e.count,
                    l = e.instanceMatrix;
                (r = new Bi(a, s, c)).instanceMatrix = new $e(new Float32Array(l.array), 16);
                break;
            case "LOD":
                r = new Ri;
                break;
            case "Line":
                r = new Xi(i(e.geometry), o(e.material), e.mode);
                break;
            case "LineLoop":
                r = new Ji(i(e.geometry), o(e.material));
                break;
            case "LineSegments":
                r = new Zi(i(e.geometry), o(e.material));
                break;
            case "PointCloud":
            case "Points":
                r = new no(i(e.geometry), o(e.material));
                break;
            case "Sprite":
                r = new Ei(o(e.material));
                break;
            case "Group":
                r = new ri;
                break;
            default:
                r = new $
        }
        if (r.uuid = e.uuid, void 0 !== e.name && (r.name = e.name), void 0 !== e.matrix ? (r.matrix.fromArray(e.matrix), void 0 !== e.matrixAutoUpdate && (r.matrixAutoUpdate = e.matrixAutoUpdate), r.matrixAutoUpdate && r.matrix.decompose(r.position, r.quaternion, r.scale)) : (void 0 !== e.position && r.position.fromArray(e.position), void 0 !== e.rotation && r.rotation.fromArray(e.rotation), void 0 !== e.quaternion && r.quaternion.fromArray(e.quaternion), void 0 !== e.scale && r.scale.fromArray(e.scale)), void 0 !== e.castShadow && (r.castShadow = e.castShadow), void 0 !== e.receiveShadow && (r.receiveShadow = e.receiveShadow), e.shadow && (void 0 !== e.shadow.bias && (r.shadow.bias = e.shadow.bias), void 0 !== e.shadow.radius && (r.shadow.radius = e.shadow.radius), void 0 !== e.shadow.mapSize && r.shadow.mapSize.fromArray(e.shadow.mapSize), void 0 !== e.shadow.camera && (r.shadow.camera = this.parseObject(e.shadow.camera))), void 0 !== e.visible && (r.visible = e.visible), void 0 !== e.frustumCulled && (r.frustumCulled = e.frustumCulled), void 0 !== e.renderOrder && (r.renderOrder = e.renderOrder), void 0 !== e.userData && (r.userData = e.userData), void 0 !== e.layers && (r.layers.mask = e.layers), void 0 !== e.children)
            for (var u = e.children, h = 0; h < u.length; h++) r.add(this.parseObject(u[h], t, n));
        if ("LOD" === e.type) {
            void 0 !== e.autoUpdate && (r.autoUpdate = e.autoUpdate);
            for (var p = e.levels, d = 0; d < p.length; d++) {
                var f = p[d],
                    m = r.getObjectByProperty("uuid", f.object);
                void 0 !== m && r.addLevel(m, f.distance)
            }
        }
        return r
    }
});
var Zs, Js = {
        UVMapping: 300,
        CubeReflectionMapping: 301,
        CubeRefractionMapping: 302,
        EquirectangularReflectionMapping: 303,
        EquirectangularRefractionMapping: 304,
        SphericalReflectionMapping: 305,
        CubeUVReflectionMapping: 306,
        CubeUVRefractionMapping: 307
    },
    Ks = {
        RepeatWrapping: 1e3,
        ClampToEdgeWrapping: 1001,
        MirroredRepeatWrapping: 1002
    },
    Qs = {
        NearestFilter: 1003,
        NearestMipmapNearestFilter: 1004,
        NearestMipmapLinearFilter: 1005,
        LinearFilter: 1006,
        LinearMipmapNearestFilter: 1007,
        LinearMipmapLinearFilter: 1008
    };

function $s(e) {
    "undefined" == typeof createImageBitmap && console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."), "undefined" == typeof fetch && console.warn("THREE.ImageBitmapLoader: fetch() not supported."), Ka.call(this, e), this.options = void 0
}

function ec() {
    this.type = "ShapePath", this.color = new Ve, this.subPaths = [], this.currentPath = null
}

function tc(e) {
    this.type = "Font", this.data = e
}

function nc(e, t, n, r, i) {
    var o = i.glyphs[e] || i.glyphs["?"];
    if (o) {
        var a, s, c, l, u, h, p, d, f = new ec;
        if (o.o)
            for (var m = o._cachedOutline || (o._cachedOutline = o.o.split(" ")), v = 0, g = m.length; v < g;) {
                switch (m[v++]) {
                    case "m":
                        a = m[v++] * t + n, s = m[v++] * t + r, f.moveTo(a, s);
                        break;
                    case "l":
                        a = m[v++] * t + n, s = m[v++] * t + r, f.lineTo(a, s);
                        break;
                    case "q":
                        c = m[v++] * t + n, l = m[v++] * t + r, u = m[v++] * t + n, h = m[v++] * t + r, f.quadraticCurveTo(u, h, c, l);
                        break;
                    case "b":
                        c = m[v++] * t + n, l = m[v++] * t + r, u = m[v++] * t + n, h = m[v++] * t + r, p = m[v++] * t + n, d = m[v++] * t + r, f.bezierCurveTo(u, h, p, d, c, l)
                }
            }
        return {
            offsetX: o.ha * t,
            path: f
        }
    }
    console.error('THREE.Font: character "' + e + '" does not exists in font family ' + i.familyName + ".")
}

function rc(e) {
    Ka.call(this, e)
}
$s.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: $s,
    setOptions: function(e) {
        return this.options = e, this
    },
    load: function(e, t, n, r) {
        void 0 === e && (e = ""), void 0 !== this.path && (e = this.path + e), e = this.manager.resolveURL(e);
        var i = this,
            o = Ya.get(e);
        if (void 0 !== o) return i.manager.itemStart(e), setTimeout((function() {
            t && t(o), i.manager.itemEnd(e)
        }), 0), o;
        fetch(e).then((function(e) {
            return e.blob()
        })).then((function(e) {
            return void 0 === i.options ? createImageBitmap(e) : createImageBitmap(e, i.options)
        })).then((function(n) {
            Ya.add(e, n), t && t(n), i.manager.itemEnd(e)
        })).catch((function(t) {
            r && r(t), i.manager.itemError(e), i.manager.itemEnd(e)
        })), i.manager.itemStart(e)
    }
}), Object.assign(ec.prototype, {
    moveTo: function(e, t) {
        return this.currentPath = new As, this.subPaths.push(this.currentPath), this.currentPath.moveTo(e, t), this
    },
    lineTo: function(e, t) {
        return this.currentPath.lineTo(e, t), this
    },
    quadraticCurveTo: function(e, t, n, r) {
        return this.currentPath.quadraticCurveTo(e, t, n, r), this
    },
    bezierCurveTo: function(e, t, n, r, i, o) {
        return this.currentPath.bezierCurveTo(e, t, n, r, i, o), this
    },
    splineThru: function(e) {
        return this.currentPath.splineThru(e), this
    },
    toShapes: function(e, t) {
        function n(e) {
            for (var t = [], n = 0, r = e.length; n < r; n++) {
                var i = e[n],
                    o = new Ls;
                o.curves = i.curves, t.push(o)
            }
            return t
        }

        function r(e, t) {
            for (var n = t.length, r = !1, i = n - 1, o = 0; o < n; i = o++) {
                var a = t[i],
                    s = t[o],
                    c = s.x - a.x,
                    l = s.y - a.y;
                if (Math.abs(l) > Number.EPSILON) {
                    if (l < 0 && (a = t[o], c = -c, s = t[i], l = -l), e.y < a.y || e.y > s.y) continue;
                    if (e.y === a.y) {
                        if (e.x === a.x) return !0
                    } else {
                        var u = l * (e.x - a.x) - c * (e.y - a.y);
                        if (0 === u) return !0;
                        if (u < 0) continue;
                        r = !r
                    }
                } else {
                    if (e.y !== a.y) continue;
                    if (s.x <= e.x && e.x <= a.x || a.x <= e.x && e.x <= s.x) return !0
                }
            }
            return r
        }
        var i = Jo.isClockWise,
            o = this.subPaths;
        if (0 === o.length) return [];
        if (!0 === t) return n(o);
        var a, s, c, l = [];
        if (1 === o.length) return s = o[0], (c = new Ls).curves = s.curves, l.push(c), l;
        var u = !i(o[0].getPoints());
        u = e ? !u : u;
        var h, p, d = [],
            f = [],
            m = [],
            v = 0;
        f[v] = void 0, m[v] = [];
        for (var g = 0, y = o.length; g < y; g++) a = i(h = (s = o[g]).getPoints()), (a = e ? !a : a) ? (!u && f[v] && v++, f[v] = {
            s: new Ls,
            p: h
        }, f[v].s.curves = s.curves, u && v++, m[v] = []) : m[v].push({
            h: s,
            p: h[0]
        });
        if (!f[0]) return n(o);
        if (f.length > 1) {
            for (var x = !1, _ = [], b = 0, w = f.length; b < w; b++) d[b] = [];
            for (b = 0, w = f.length; b < w; b++)
                for (var M = m[b], S = 0; S < M.length; S++) {
                    for (var E = M[S], T = !0, A = 0; A < f.length; A++) r(E.p, f[A].p) && (b !== A && _.push({
                        froms: b,
                        tos: A,
                        hole: S
                    }), T ? (T = !1, d[A].push(E)) : x = !0);
                    T && d[b].push(E)
                }
            _.length > 0 && (x || (m = d))
        }
        g = 0;
        for (var L = f.length; g < L; g++) {
            c = f[g].s, l.push(c);
            for (var R = 0, P = (p = m[g]).length; R < P; R++) c.holes.push(p[R].h)
        }
        return l
    }
}), Object.assign(tc.prototype, {
    isFont: !0,
    generateShapes: function(e, t) {
        void 0 === t && (t = 100);
        for (var n = [], r = function(e, t, n) {
                for (var r = Array.from ? Array.from(e) : String(e).split(""), i = t / n.resolution, o = (n.boundingBox.yMax - n.boundingBox.yMin + n.underlineThickness) * i, a = [], s = 0, c = 0, l = 0; l < r.length; l++) {
                    var u = r[l];
                    if ("\n" === u) s = 0, c -= o;
                    else {
                        var h = nc(u, i, s, c, n);
                        s += h.offsetX, a.push(h.path)
                    }
                }
                return a
            }(e, t, this.data), i = 0, o = r.length; i < o; i++) Array.prototype.push.apply(n, r[i].toShapes());
        return n
    }
}), rc.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: rc,
    load: function(e, t, n, r) {
        var i = this,
            o = new $a(this.manager);
        o.setPath(this.path), o.load(e, (function(e) {
            var n;
            try {
                n = JSON.parse(e)
            } catch (t) {
                console.warn("THREE.FontLoader: typeface.js support is being deprecated. Use typeface.json instead."), n = JSON.parse(e.substring(65, e.length - 2))
            }
            var r = i.parse(n);
            t && t(r)
        }), n, r)
    },
    parse: function(e) {
        return new tc(e)
    }
});
var ic = function() {
    return void 0 === Zs && (Zs = new(window.AudioContext || window.webkitAudioContext)), Zs
};

function oc(e) {
    Ka.call(this, e)
}

function ac() {
    this.coefficients = [];
    for (var e = 0; e < 9; e++) this.coefficients.push(new y)
}

function sc(e, t) {
    Rs.call(this, void 0, t), this.sh = void 0 !== e ? e : new ac
}

function cc(e, t, n) {
    sc.call(this, void 0, n);
    var r = (new Ve).set(e),
        i = (new Ve).set(t),
        o = new y(r.r, r.g, r.b),
        a = new y(i.r, i.g, i.b),
        s = Math.sqrt(Math.PI),
        c = s * Math.sqrt(.75);
    this.sh.coefficients[0].copy(o).add(a).multiplyScalar(s), this.sh.coefficients[1].copy(o).sub(a).multiplyScalar(c)
}

function lc(e, t) {
    sc.call(this, void 0, t);
    var n = (new Ve).set(e);
    this.sh.coefficients[0].set(n.r, n.g, n.b).multiplyScalar(2 * Math.sqrt(Math.PI))
}
oc.prototype = Object.assign(Object.create(Ka.prototype), {
    constructor: oc,
    load: function(e, t, n, r) {
        var i = new $a(this.manager);
        i.setResponseType("arraybuffer"), i.setPath(this.path), i.load(e, (function(e) {
            var n = e.slice(0);
            ic().decodeAudioData(n, (function(e) {
                t(e)
            }))
        }), n, r)
    }
}), Object.assign(ac.prototype, {
    isSphericalHarmonics3: !0,
    set: function(e) {
        for (var t = 0; t < 9; t++) this.coefficients[t].copy(e[t]);
        return this
    },
    zero: function() {
        for (var e = 0; e < 9; e++) this.coefficients[e].set(0, 0, 0);
        return this
    },
    getAt: function(e, t) {
        var n = e.x,
            r = e.y,
            i = e.z,
            o = this.coefficients;
        return t.copy(o[0]).multiplyScalar(.282095), t.addScale(o[1], .488603 * r), t.addScale(o[2], .488603 * i), t.addScale(o[3], .488603 * n), t.addScale(o[4], n * r * 1.092548), t.addScale(o[5], r * i * 1.092548), t.addScale(o[6], .315392 * (3 * i * i - 1)), t.addScale(o[7], n * i * 1.092548), t.addScale(o[8], .546274 * (n * n - r * r)), t
    },
    getIrradianceAt: function(e, t) {
        var n = e.x,
            r = e.y,
            i = e.z,
            o = this.coefficients;
        return t.copy(o[0]).multiplyScalar(.886227), t.addScale(o[1], 1.023328 * r), t.addScale(o[2], 1.023328 * i), t.addScale(o[3], 1.023328 * n), t.addScale(o[4], .858086 * n * r), t.addScale(o[5], .858086 * r * i), t.addScale(o[6], .743125 * i * i - .247708), t.addScale(o[7], .858086 * n * i), t.addScale(o[8], .429043 * (n * n - r * r)), t
    },
    add: function(e) {
        for (var t = 0; t < 9; t++) this.coefficients[t].add(e.coefficients[t]);
        return this
    },
    scale: function(e) {
        for (var t = 0; t < 9; t++) this.coefficients[t].multiplyScalar(e);
        return this
    },
    lerp: function(e, t) {
        for (var n = 0; n < 9; n++) this.coefficients[n].lerp(e.coefficients[n], t);
        return this
    },
    equals: function(e) {
        for (var t = 0; t < 9; t++)
            if (!this.coefficients[t].equals(e.coefficients[t])) return !1;
        return !0
    },
    copy: function(e) {
        return this.set(e.coefficients)
    },
    clone: function() {
        return (new this.constructor).copy(this)
    },
    fromArray: function(e, t) {
        void 0 === t && (t = 0);
        for (var n = this.coefficients, r = 0; r < 9; r++) n[r].fromArray(e, t + 3 * r);
        return this
    },
    toArray: function(e, t) {
        void 0 === e && (e = []), void 0 === t && (t = 0);
        for (var n = this.coefficients, r = 0; r < 9; r++) n[r].toArray(e, t + 3 * r);
        return e
    }
}), Object.assign(ac, {
    getBasisAt: function(e, t) {
        var n = e.x,
            r = e.y,
            i = e.z;
        t[0] = .282095, t[1] = .488603 * r, t[2] = .488603 * i, t[3] = .488603 * n, t[4] = 1.092548 * n * r, t[5] = 1.092548 * r * i, t[6] = .315392 * (3 * i * i - 1), t[7] = 1.092548 * n * i, t[8] = .546274 * (n * n - r * r)
    }
}), sc.prototype = Object.assign(Object.create(Rs.prototype), {
    constructor: sc,
    isLightProbe: !0,
    copy: function(e) {
        return Rs.prototype.copy.call(this, e), this.sh.copy(e.sh), this.intensity = e.intensity, this
    },
    toJSON: function(e) {
        return Rs.prototype.toJSON.call(this, e)
    }
}), cc.prototype = Object.assign(Object.create(sc.prototype), {
    constructor: cc,
    isHemisphereLightProbe: !0,
    copy: function(e) {
        return sc.prototype.copy.call(this, e), this
    },
    toJSON: function(e) {
        return sc.prototype.toJSON.call(this, e)
    }
}), lc.prototype = Object.assign(Object.create(sc.prototype), {
    constructor: lc,
    isAmbientLightProbe: !0,
    copy: function(e) {
        return sc.prototype.copy.call(this, e), this
    },
    toJSON: function(e) {
        return sc.prototype.toJSON.call(this, e)
    }
});
var uc = new D,
    hc = new D;

function pc(e) {
    this.autoStart = void 0 === e || e, this.startTime = 0, this.oldTime = 0, this.elapsedTime = 0, this.running = !1
}
Object.assign(function() {
    this.type = "StereoCamera", this.aspect = 1, this.eyeSep = .064, this.cameraL = new Jt, this.cameraL.layers.enable(1), this.cameraL.matrixAutoUpdate = !1, this.cameraR = new Jt, this.cameraR.layers.enable(2), this.cameraR.matrixAutoUpdate = !1, this._cache = {
        focus: null,
        fov: null,
        aspect: null,
        near: null,
        far: null,
        zoom: null,
        eyeSep: null
    }
}.prototype, {
    update: function(e) {
        var t = this._cache;
        if (t.focus !== e.focus || t.fov !== e.fov || t.aspect !== e.aspect * this.aspect || t.near !== e.near || t.far !== e.far || t.zoom !== e.zoom || t.eyeSep !== this.eyeSep) {
            t.focus = e.focus, t.fov = e.fov, t.aspect = e.aspect * this.aspect, t.near = e.near, t.far = e.far, t.zoom = e.zoom, t.eyeSep = this.eyeSep;
            var n, r, i = e.projectionMatrix.clone(),
                o = t.eyeSep / 2,
                a = o * t.near / t.focus,
                s = t.near * Math.tan(d.DEG2RAD * t.fov * .5) / t.zoom;
            hc.elements[12] = -o, uc.elements[12] = o, n = -s * t.aspect + a, r = s * t.aspect + a, i.elements[0] = 2 * t.near / (r - n), i.elements[8] = (r + n) / (r - n), this.cameraL.projectionMatrix.copy(i), n = -s * t.aspect - a, r = s * t.aspect - a, i.elements[0] = 2 * t.near / (r - n), i.elements[8] = (r + n) / (r - n), this.cameraR.projectionMatrix.copy(i)
        }
        this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(hc), this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(uc)
    }
}), Object.assign(pc.prototype, {
    start: function() {
        this.startTime = ("undefined" == typeof performance ? Date : performance).now(), this.oldTime = this.startTime, this.elapsedTime = 0, this.running = !0
    },
    stop: function() {
        this.getElapsedTime(), this.running = !1, this.autoStart = !1
    },
    getElapsedTime: function() {
        return this.getDelta(), this.elapsedTime
    },
    getDelta: function() {
        var e = 0;
        if (this.autoStart && !this.running) return this.start(), 0;
        if (this.running) {
            var t = ("undefined" == typeof performance ? Date : performance).now();
            e = (t - this.oldTime) / 1e3, this.oldTime = t, this.elapsedTime += e
        }
        return e
    }
});
var dc = new y,
    fc = new m,
    mc = new y,
    vc = new y;

function gc() {
    $.call(this), this.type = "AudioListener", this.context = ic(), this.gain = this.context.createGain(), this.gain.connect(this.context.destination), this.filter = null, this.timeDelta = 0, this._clock = new pc
}

function yc(e) {
    $.call(this), this.type = "Audio", this.listener = e, this.context = e.context, this.gain = this.context.createGain(), this.gain.connect(e.getInput()), this.autoplay = !1, this.buffer = null, this.detune = 0, this.loop = !1, this.loopStart = 0, this.loopEnd = 0, this.offset = 0, this.duration = void 0, this.playbackRate = 1, this.isPlaying = !1, this.hasPlaybackControl = !0, this.sourceType = "empty", this._startedAt = 0, this._pausedAt = 0, this.filters = []
}
gc.prototype = Object.assign(Object.create($.prototype), {
    constructor: gc,
    getInput: function() {
        return this.gain
    },
    removeFilter: function() {
        return null !== this.filter && (this.gain.disconnect(this.filter), this.filter.disconnect(this.context.destination), this.gain.connect(this.context.destination), this.filter = null), this
    },
    getFilter: function() {
        return this.filter
    },
    setFilter: function(e) {
        return null !== this.filter ? (this.gain.disconnect(this.filter), this.filter.disconnect(this.context.destination)) : this.gain.disconnect(this.context.destination), this.filter = e, this.gain.connect(this.filter), this.filter.connect(this.context.destination), this
    },
    getMasterVolume: function() {
        return this.gain.gain.value
    },
    setMasterVolume: function(e) {
        return this.gain.gain.setTargetAtTime(e, this.context.currentTime, .01), this
    },
    updateMatrixWorld: function(e) {
        $.prototype.updateMatrixWorld.call(this, e);
        var t = this.context.listener,
            n = this.up;
        if (this.timeDelta = this._clock.getDelta(), this.matrixWorld.decompose(dc, fc, mc), vc.set(0, 0, -1).applyQuaternion(fc), t.positionX) {
            var r = this.context.currentTime + this.timeDelta;
            t.positionX.linearRampToValueAtTime(dc.x, r), t.positionY.linearRampToValueAtTime(dc.y, r), t.positionZ.linearRampToValueAtTime(dc.z, r), t.forwardX.linearRampToValueAtTime(vc.x, r), t.forwardY.linearRampToValueAtTime(vc.y, r), t.forwardZ.linearRampToValueAtTime(vc.z, r), t.upX.linearRampToValueAtTime(n.x, r), t.upY.linearRampToValueAtTime(n.y, r), t.upZ.linearRampToValueAtTime(n.z, r)
        } else t.setPosition(dc.x, dc.y, dc.z), t.setOrientation(vc.x, vc.y, vc.z, n.x, n.y, n.z)
    }
}), yc.prototype = Object.assign(Object.create($.prototype), {
    constructor: yc,
    getOutput: function() {
        return this.gain
    },
    setNodeSource: function(e) {
        return this.hasPlaybackControl = !1, this.sourceType = "audioNode", this.source = e, this.connect(), this
    },
    setMediaElementSource: function(e) {
        return this.hasPlaybackControl = !1, this.sourceType = "mediaNode", this.source = this.context.createMediaElementSource(e), this.connect(), this
    },
    setMediaStreamSource: function(e) {
        return this.hasPlaybackControl = !1, this.sourceType = "mediaStreamNode", this.source = this.context.createMediaStreamSource(e), this.connect(), this
    },
    setBuffer: function(e) {
        return this.buffer = e, this.sourceType = "buffer", this.autoplay && this.play(), this
    },
    play: function(e) {
        if (void 0 === e && (e = 0), !0 !== this.isPlaying) {
            if (!1 !== this.hasPlaybackControl) {
                this._startedAt = this.context.currentTime + e;
                var t = this.context.createBufferSource();
                return t.buffer = this.buffer, t.loop = this.loop, t.loopStart = this.loopStart, t.loopEnd = this.loopEnd, t.onended = this.onEnded.bind(this), t.start(this._startedAt, this._pausedAt + this.offset, this.duration), this.isPlaying = !0, this.source = t, this.setDetune(this.detune), this.setPlaybackRate(this.playbackRate), this.connect()
            }
            console.warn("THREE.Audio: this Audio has no playback control.")
        } else console.warn("THREE.Audio: Audio is already playing.")
    },
    pause: function() {
        if (!1 !== this.hasPlaybackControl) return !0 === this.isPlaying && (this._pausedAt = (this.context.currentTime - this._startedAt) * this.playbackRate, this.source.stop(), this.source.onended = null, this.isPlaying = !1), this;
        console.warn("THREE.Audio: this Audio has no playback control.")
    },
    stop: function() {
        if (!1 !== this.hasPlaybackControl) return this._pausedAt = 0, this.source.stop(), this.source.onended = null, this.isPlaying = !1, this;
        console.warn("THREE.Audio: this Audio has no playback control.")
    },
    connect: function() {
        if (this.filters.length > 0) {
            this.source.connect(this.filters[0]);
            for (var e = 1, t = this.filters.length; e < t; e++) this.filters[e - 1].connect(this.filters[e]);
            this.filters[this.filters.length - 1].connect(this.getOutput())
        } else this.source.connect(this.getOutput());
        return this
    },
    disconnect: function() {
        if (this.filters.length > 0) {
            this.source.disconnect(this.filters[0]);
            for (var e = 1, t = this.filters.length; e < t; e++) this.filters[e - 1].disconnect(this.filters[e]);
            this.filters[this.filters.length - 1].disconnect(this.getOutput())
        } else this.source.disconnect(this.getOutput());
        return this
    },
    getFilters: function() {
        return this.filters
    },
    setFilters: function(e) {
        return e || (e = []), !0 === this.isPlaying ? (this.disconnect(), this.filters = e, this.connect()) : this.filters = e, this
    },
    setDetune: function(e) {
        if (this.detune = e, void 0 !== this.source.detune) return !0 === this.isPlaying && this.source.detune.setTargetAtTime(this.detune, this.context.currentTime, .01), this
    },
    getDetune: function() {
        return this.detune
    },
    getFilter: function() {
        return this.getFilters()[0]
    },
    setFilter: function(e) {
        return this.setFilters(e ? [e] : [])
    },
    setPlaybackRate: function(e) {
        if (!1 !== this.hasPlaybackControl) return this.playbackRate = e, !0 === this.isPlaying && this.source.playbackRate.setTargetAtTime(this.playbackRate, this.context.currentTime, .01), this;
        console.warn("THREE.Audio: this Audio has no playback control.")
    },
    getPlaybackRate: function() {
        return this.playbackRate
    },
    onEnded: function() {
        this.isPlaying = !1
    },
    getLoop: function() {
        return !1 === this.hasPlaybackControl ? (console.warn("THREE.Audio: this Audio has no playback control."), !1) : this.loop
    },
    setLoop: function(e) {
        if (!1 !== this.hasPlaybackControl) return this.loop = e, !0 === this.isPlaying && (this.source.loop = this.loop), this;
        console.warn("THREE.Audio: this Audio has no playback control.")
    },
    setLoopStart: function(e) {
        return this.loopStart = e, this
    },
    setLoopEnd: function(e) {
        return this.loopEnd = e, this
    },
    getVolume: function() {
        return this.gain.gain.value
    },
    setVolume: function(e) {
        return this.gain.gain.setTargetAtTime(e, this.context.currentTime, .01), this
    }
});
var xc = new y,
    _c = new m,
    bc = new y,
    wc = new y;

function Mc(e) {
    yc.call(this, e), this.panner = this.context.createPanner(), this.panner.panningModel = "HRTF", this.panner.connect(this.gain)
}

function Sc(e, t) {
    this.analyser = e.context.createAnalyser(), this.analyser.fftSize = void 0 !== t ? t : 2048, this.data = new Uint8Array(this.analyser.frequencyBinCount), e.getOutput().connect(this.analyser)
}

function Ec(e, t, n) {
    this.binding = e, this.valueSize = n;
    var r, i = Float64Array;
    switch (t) {
        case "quaternion":
            r = this._slerp;
            break;
        case "string":
        case "bool":
            i = Array, r = this._select;
            break;
        default:
            r = this._lerp
    }
    this.buffer = new i(4 * n), this._mixBufferRegion = r, this.cumulativeWeight = 0, this.useCount = 0, this.referenceCount = 0
}
Mc.prototype = Object.assign(Object.create(yc.prototype), {
    constructor: Mc,
    getOutput: function() {
        return this.panner
    },
    getRefDistance: function() {
        return this.panner.refDistance
    },
    setRefDistance: function(e) {
        return this.panner.refDistance = e, this
    },
    getRolloffFactor: function() {
        return this.panner.rolloffFactor
    },
    setRolloffFactor: function(e) {
        return this.panner.rolloffFactor = e, this
    },
    getDistanceModel: function() {
        return this.panner.distanceModel
    },
    setDistanceModel: function(e) {
        return this.panner.distanceModel = e, this
    },
    getMaxDistance: function() {
        return this.panner.maxDistance
    },
    setMaxDistance: function(e) {
        return this.panner.maxDistance = e, this
    },
    setDirectionalCone: function(e, t, n) {
        return this.panner.coneInnerAngle = e, this.panner.coneOuterAngle = t, this.panner.coneOuterGain = n, this
    },
    updateMatrixWorld: function(e) {
        if ($.prototype.updateMatrixWorld.call(this, e), !0 !== this.hasPlaybackControl || !1 !== this.isPlaying) {
            this.matrixWorld.decompose(xc, _c, bc), wc.set(0, 0, 1).applyQuaternion(_c);
            var t = this.panner;
            if (t.positionX) {
                var n = this.context.currentTime + this.listener.timeDelta;
                t.positionX.linearRampToValueAtTime(xc.x, n), t.positionY.linearRampToValueAtTime(xc.y, n), t.positionZ.linearRampToValueAtTime(xc.z, n), t.orientationX.linearRampToValueAtTime(wc.x, n), t.orientationY.linearRampToValueAtTime(wc.y, n), t.orientationZ.linearRampToValueAtTime(wc.z, n)
            } else t.setPosition(xc.x, xc.y, xc.z), t.setOrientation(wc.x, wc.y, wc.z)
        }
    }
}), Object.assign(Sc.prototype, {
    getFrequencyData: function() {
        return this.analyser.getByteFrequencyData(this.data), this.data
    },
    getAverageFrequency: function() {
        for (var e = 0, t = this.getFrequencyData(), n = 0; n < t.length; n++) e += t[n];
        return e / t.length
    }
}), Object.assign(Ec.prototype, {
    accumulate: function(e, t) {
        var n = this.buffer,
            r = this.valueSize,
            i = e * r + r,
            o = this.cumulativeWeight;
        if (0 === o) {
            for (var a = 0; a !== r; ++a) n[i + a] = n[a];
            o = t
        } else {
            var s = t / (o += t);
            this._mixBufferRegion(n, i, 0, s, r)
        }
        this.cumulativeWeight = o
    },
    apply: function(e) {
        var t = this.valueSize,
            n = this.buffer,
            r = e * t + t,
            i = this.cumulativeWeight,
            o = this.binding;
        if (this.cumulativeWeight = 0, i < 1) {
            var a = 3 * t;
            this._mixBufferRegion(n, r, a, 1 - i, t)
        }
        for (var s = t, c = t + t; s !== c; ++s)
            if (n[s] !== n[s + t]) {
                o.setValue(n, r);
                break
            }
    },
    saveOriginalState: function() {
        var e = this.binding,
            t = this.buffer,
            n = this.valueSize,
            r = 3 * n;
        e.getValue(t, r);
        for (var i = n, o = r; i !== o; ++i) t[i] = t[r + i % n];
        this.cumulativeWeight = 0
    },
    restoreOriginalState: function() {
        var e = 3 * this.valueSize;
        this.binding.setValue(this.buffer, e)
    },
    _select: function(e, t, n, r, i) {
        if (r >= .5)
            for (var o = 0; o !== i; ++o) e[t + o] = e[n + o]
    },
    _slerp: function(e, t, n, r) {
        m.slerpFlat(e, t, e, t, e, n, r)
    },
    _lerp: function(e, t, n, r, i) {
        for (var o = 1 - r, a = 0; a !== i; ++a) {
            var s = t + a;
            e[s] = e[s] * o + e[n + a] * r
        }
    }
});
var Tc = new RegExp("[\\[\\]\\.:\\/]", "g"),
    Ac = "[^" + "\\[\\]\\.:\\/".replace("\\.", "") + "]",
    Lc = /((?:WC+[\/:])*)/.source.replace("WC", "[^\\[\\]\\.:\\/]"),
    Rc = /(WCOD+)?/.source.replace("WCOD", Ac),
    Pc = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", "[^\\[\\]\\.:\\/]"),
    Cc = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", "[^\\[\\]\\.:\\/]"),
    Oc = new RegExp("^" + Lc + Rc + Pc + Cc + "$"),
    Ic = ["material", "materials", "bones"];

function Nc(e, t, n) {
    var r = n || Dc.parseTrackName(t);
    this._targetGroup = e, this._bindings = e.subscribe_(t, r)
}

function Dc(e, t, n) {
    this.path = t, this.parsedPath = n || Dc.parseTrackName(t), this.node = Dc.findNode(e, this.parsedPath.nodeName) || e, this.rootNode = e
}

function Fc(e, t, n) {
    this._mixer = e, this._clip = t, this._localRoot = n || null;
    for (var r = t.tracks, i = r.length, o = new Array(i), a = {
            endingStart: 2400,
            endingEnd: 2400
        }, s = 0; s !== i; ++s) {
        var c = r[s].createInterpolant(null);
        o[s] = c, c.settings = a
    }
    this._interpolantSettings = a, this._interpolants = o, this._propertyBindings = new Array(i), this._cacheIndex = null, this._byClipCacheIndex = null, this._timeScaleInterpolant = null, this._weightInterpolant = null, this.loop = 2201, this._loopCount = -1, this._startTime = null, this.time = 0, this.timeScale = 1, this._effectiveTimeScale = 1, this.weight = 1, this._effectiveWeight = 1, this.repetitions = 1 / 0, this.paused = !1, this.enabled = !0, this.clampWhenFinished = !1, this.zeroSlopeAtStart = !0, this.zeroSlopeAtEnd = !0
}

function zc(e) {
    this._root = e, this._initMemoryManager(), this._accuIndex = 0, this.time = 0, this.timeScale = 1
}

function Uc(e) {
    "string" == typeof e && (console.warn("THREE.Uniform: Type parameter is no longer needed."), e = arguments[1]), this.value = e
}

function Bc(e, t, n) {
    ci.call(this, e, t), this.meshPerAttribute = n || 1
}

function kc(e, t) {
    return e.distance - t.distance
}

function Gc(e, t, n, r) {
    if (!1 !== e.visible && (e.raycast(t, n), !0 === r))
        for (var i = e.children, o = 0, a = i.length; o < a; o++) Gc(i[o], t, n, !0)
}

function Hc(e, t, n) {
    return this.radius = void 0 !== e ? e : 1, this.phi = void 0 !== t ? t : 0, this.theta = void 0 !== n ? n : 0, this
}
Object.assign(Nc.prototype, {
        getValue: function(e, t) {
            this.bind();
            var n = this._targetGroup.nCachedObjects_,
                r = this._bindings[n];
            void 0 !== r && r.getValue(e, t)
        },
        setValue: function(e, t) {
            for (var n = this._bindings, r = this._targetGroup.nCachedObjects_, i = n.length; r !== i; ++r) n[r].setValue(e, t)
        },
        bind: function() {
            for (var e = this._bindings, t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].bind()
        },
        unbind: function() {
            for (var e = this._bindings, t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].unbind()
        }
    }), Object.assign(Dc, {
        Composite: Nc,
        create: function(e, t, n) {
            return e && e.isAnimationObjectGroup ? new Dc.Composite(e, t, n) : new Dc(e, t, n)
        },
        sanitizeNodeName: function(e) {
            return e.replace(/\s/g, "_").replace(Tc, "")
        },
        parseTrackName: function(e) {
            var t = Oc.exec(e);
            if (!t) throw new Error("PropertyBinding: Cannot parse trackName: " + e);
            var n = {
                    nodeName: t[2],
                    objectName: t[3],
                    objectIndex: t[4],
                    propertyName: t[5],
                    propertyIndex: t[6]
                },
                r = n.nodeName && n.nodeName.lastIndexOf(".");
            if (void 0 !== r && -1 !== r) {
                var i = n.nodeName.substring(r + 1); - 1 !== Ic.indexOf(i) && (n.nodeName = n.nodeName.substring(0, r), n.objectName = i)
            }
            if (null === n.propertyName || 0 === n.propertyName.length) throw new Error("PropertyBinding: can not parse propertyName from trackName: " + e);
            return n
        },
        findNode: function(e, t) {
            if (!t || "" === t || "root" === t || "." === t || -1 === t || t === e.name || t === e.uuid) return e;
            if (e.skeleton) {
                var n = e.skeleton.getBoneByName(t);
                if (void 0 !== n) return n
            }
            if (e.children) {
                var r = function(e) {
                        for (var n = 0; n < e.length; n++) {
                            var i = e[n];
                            if (i.name === t || i.uuid === t) return i;
                            var o = r(i.children);
                            if (o) return o
                        }
                        return null
                    },
                    i = r(e.children);
                if (i) return i
            }
            return null
        }
    }), Object.assign(Dc.prototype, {
        _getValue_unavailable: function() {},
        _setValue_unavailable: function() {},
        BindingType: {
            Direct: 0,
            EntireArray: 1,
            ArrayElement: 2,
            HasFromToArray: 3
        },
        Versioning: {
            None: 0,
            NeedsUpdate: 1,
            MatrixWorldNeedsUpdate: 2
        },
        GetterByBindingType: [function(e, t) {
            e[t] = this.node[this.propertyName]
        }, function(e, t) {
            for (var n = this.resolvedProperty, r = 0, i = n.length; r !== i; ++r) e[t++] = n[r]
        }, function(e, t) {
            e[t] = this.resolvedProperty[this.propertyIndex]
        }, function(e, t) {
            this.resolvedProperty.toArray(e, t)
        }],
        SetterByBindingTypeAndVersioning: [
            [function(e, t) {
                this.targetObject[this.propertyName] = e[t]
            }, function(e, t) {
                this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = !0
            }, function(e, t) {
                this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0
            }],
            [function(e, t) {
                for (var n = this.resolvedProperty, r = 0, i = n.length; r !== i; ++r) n[r] = e[t++]
            }, function(e, t) {
                for (var n = this.resolvedProperty, r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
                this.targetObject.needsUpdate = !0
            }, function(e, t) {
                for (var n = this.resolvedProperty, r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
                this.targetObject.matrixWorldNeedsUpdate = !0
            }],
            [function(e, t) {
                this.resolvedProperty[this.propertyIndex] = e[t]
            }, function(e, t) {
                this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = !0
            }, function(e, t) {
                this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0
            }],
            [function(e, t) {
                this.resolvedProperty.fromArray(e, t)
            }, function(e, t) {
                this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = !0
            }, function(e, t) {
                this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = !0
            }]
        ],
        getValue: function(e, t) {
            this.bind(), this.getValue(e, t)
        },
        setValue: function(e, t) {
            this.bind(), this.setValue(e, t)
        },
        bind: function() {
            var e = this.node,
                t = this.parsedPath,
                n = t.objectName,
                r = t.propertyName,
                i = t.propertyIndex;
            if (e || (e = Dc.findNode(this.rootNode, t.nodeName) || this.rootNode, this.node = e), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, e) {
                if (n) {
                    var o = t.objectIndex;
                    switch (n) {
                        case "materials":
                            if (!e.material) return void console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.", this);
                            if (!e.material.materials) return void console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
                            e = e.material.materials;
                            break;
                        case "bones":
                            if (!e.skeleton) return void console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
                            e = e.skeleton.bones;
                            for (var a = 0; a < e.length; a++)
                                if (e[a].name === o) {
                                    o = a;
                                    break
                                }
                            break;
                        default:
                            if (void 0 === e[n]) return void console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.", this);
                            e = e[n]
                    }
                    if (void 0 !== o) {
                        if (void 0 === e[o]) return void console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, e);
                        e = e[o]
                    }
                }
                var s = e[r];
                if (void 0 !== s) {
                    var c = this.Versioning.None;
                    this.targetObject = e, void 0 !== e.needsUpdate ? c = this.Versioning.NeedsUpdate : void 0 !== e.matrixWorldNeedsUpdate && (c = this.Versioning.MatrixWorldNeedsUpdate);
                    var l = this.BindingType.Direct;
                    if (void 0 !== i) {
                        if ("morphTargetInfluences" === r) {
                            if (!e.geometry) return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
                            if (e.geometry.isBufferGeometry) {
                                if (!e.geometry.morphAttributes) return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
                                for (a = 0; a < this.node.geometry.morphAttributes.position.length; a++)
                                    if (e.geometry.morphAttributes.position[a].name === i) {
                                        i = a;
                                        break
                                    }
                            } else {
                                if (!e.geometry.morphTargets) return void console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphTargets.", this);
                                for (a = 0; a < this.node.geometry.morphTargets.length; a++)
                                    if (e.geometry.morphTargets[a].name === i) {
                                        i = a;
                                        break
                                    }
                            }
                        }
                        l = this.BindingType.ArrayElement, this.resolvedProperty = s, this.propertyIndex = i
                    } else void 0 !== s.fromArray && void 0 !== s.toArray ? (l = this.BindingType.HasFromToArray, this.resolvedProperty = s) : Array.isArray(s) ? (l = this.BindingType.EntireArray, this.resolvedProperty = s) : this.propertyName = r;
                    this.getValue = this.GetterByBindingType[l], this.setValue = this.SetterByBindingTypeAndVersioning[l][c]
                } else {
                    var u = t.nodeName;
                    console.error("THREE.PropertyBinding: Trying to update property for track: " + u + "." + r + " but it wasn't found.", e)
                }
            } else console.error("THREE.PropertyBinding: Trying to update node for track: " + this.path + " but it wasn't found.")
        },
        unbind: function() {
            this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound
        }
    }),
    //!\ DECLARE ALIAS AFTER assign prototype !
    Object.assign(Dc.prototype, {
        _getValue_unbound: Dc.prototype.getValue,
        _setValue_unbound: Dc.prototype.setValue
    }), Object.assign(function() {
        this.uuid = d.generateUUID(), this._objects = Array.prototype.slice.call(arguments), this.nCachedObjects_ = 0;
        var e = {};
        this._indicesByUUID = e;
        for (var t = 0, n = arguments.length; t !== n; ++t) e[arguments[t].uuid] = t;
        this._paths = [], this._parsedPaths = [], this._bindings = [], this._bindingsIndicesByPath = {};
        var r = this;
        this.stats = {
            objects: {get total() {
                    return r._objects.length
                },
                get inUse() {
                    return this.total - r.nCachedObjects_
                }
            },
            get bindingsPerObject() {
                return r._bindings.length
            }
        }
    }.prototype, {
        isAnimationObjectGroup: !0,
        add: function() {
            for (var e = this._objects, t = e.length, n = this.nCachedObjects_, r = this._indicesByUUID, i = this._paths, o = this._parsedPaths, a = this._bindings, s = a.length, c = void 0, l = 0, u = arguments.length; l !== u; ++l) {
                var h = arguments[l],
                    p = h.uuid,
                    d = r[p];
                if (void 0 === d) {
                    d = t++, r[p] = d, e.push(h);
                    for (var f = 0, m = s; f !== m; ++f) a[f].push(new Dc(h, i[f], o[f]))
                } else if (d < n) {
                    c = e[d];
                    var v = --n,
                        g = e[v];
                    r[g.uuid] = d, e[d] = g, r[p] = v, e[v] = h;
                    for (f = 0, m = s; f !== m; ++f) {
                        var y = a[f],
                            x = y[v],
                            _ = y[d];
                        y[d] = x, void 0 === _ && (_ = new Dc(h, i[f], o[f])), y[v] = _
                    }
                } else e[d] !== c && console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")
            }
            this.nCachedObjects_ = n
        },
        remove: function() {
            for (var e = this._objects, t = this.nCachedObjects_, n = this._indicesByUUID, r = this._bindings, i = r.length, o = 0, a = arguments.length; o !== a; ++o) {
                var s = arguments[o],
                    c = s.uuid,
                    l = n[c];
                if (void 0 !== l && l >= t) {
                    var u = t++,
                        h = e[u];
                    n[h.uuid] = l, e[l] = h, n[c] = u, e[u] = s;
                    for (var p = 0, d = i; p !== d; ++p) {
                        var f = r[p],
                            m = f[u],
                            v = f[l];
                        f[l] = m, f[u] = v
                    }
                }
            }
            this.nCachedObjects_ = t
        },
        uncache: function() {
            for (var e = this._objects, t = e.length, n = this.nCachedObjects_, r = this._indicesByUUID, i = this._bindings, o = i.length, a = 0, s = arguments.length; a !== s; ++a) {
                var c = arguments[a],
                    l = c.uuid,
                    u = r[l];
                if (void 0 !== u)
                    if (delete r[l], u < n) {
                        var h = --n,
                            p = e[h],
                            d = e[y = --t];
                        r[p.uuid] = u, e[u] = p, r[d.uuid] = h, e[h] = d, e.pop();
                        for (var f = 0, m = o; f !== m; ++f) {
                            var v = (x = i[f])[h],
                                g = x[y];
                            x[u] = v, x[h] = g, x.pop()
                        }
                    } else {
                        var y;
                        r[(d = e[y = --t]).uuid] = u, e[u] = d, e.pop();
                        for (f = 0, m = o; f !== m; ++f) {
                            var x;
                            (x = i[f])[u] = x[y], x.pop()
                        }
                    }
            }
            this.nCachedObjects_ = n
        },
        subscribe_: function(e, t) {
            var n = this._bindingsIndicesByPath,
                r = n[e],
                i = this._bindings;
            if (void 0 !== r) return i[r];
            var o = this._paths,
                a = this._parsedPaths,
                s = this._objects,
                c = s.length,
                l = this.nCachedObjects_,
                u = new Array(c);
            r = i.length, n[e] = r, o.push(e), a.push(t), i.push(u);
            for (var h = l, p = s.length; h !== p; ++h) {
                var d = s[h];
                u[h] = new Dc(d, e, t)
            }
            return u
        },
        unsubscribe_: function(e) {
            var t = this._bindingsIndicesByPath,
                n = t[e];
            if (void 0 !== n) {
                var r = this._paths,
                    i = this._parsedPaths,
                    o = this._bindings,
                    a = o.length - 1,
                    s = o[a];
                t[e[a]] = n, o[n] = s, o.pop(), i[n] = i[a], i.pop(), r[n] = r[a], r.pop()
            }
        }
    }), Object.assign(Fc.prototype, {
        play: function() {
            return this._mixer._activateAction(this), this
        },
        stop: function() {
            return this._mixer._deactivateAction(this), this.reset()
        },
        reset: function() {
            return this.paused = !1, this.enabled = !0, this.time = 0, this._loopCount = -1, this._startTime = null, this.stopFading().stopWarping()
        },
        isRunning: function() {
            return this.enabled && !this.paused && 0 !== this.timeScale && null === this._startTime && this._mixer._isActiveAction(this)
        },
        isScheduled: function() {
            return this._mixer._isActiveAction(this)
        },
        startAt: function(e) {
            return this._startTime = e, this
        },
        setLoop: function(e, t) {
            return this.loop = e, this.repetitions = t, this
        },
        setEffectiveWeight: function(e) {
            return this.weight = e, this._effectiveWeight = this.enabled ? e : 0, this.stopFading()
        },
        getEffectiveWeight: function() {
            return this._effectiveWeight
        },
        fadeIn: function(e) {
            return this._scheduleFading(e, 0, 1)
        },
        fadeOut: function(e) {
            return this._scheduleFading(e, 1, 0)
        },
        crossFadeFrom: function(e, t, n) {
            if (e.fadeOut(t), this.fadeIn(t), n) {
                var r = this._clip.duration,
                    i = e._clip.duration,
                    o = i / r,
                    a = r / i;
                e.warp(1, o, t), this.warp(a, 1, t)
            }
            return this
        },
        crossFadeTo: function(e, t, n) {
            return e.crossFadeFrom(this, t, n)
        },
        stopFading: function() {
            var e = this._weightInterpolant;
            return null !== e && (this._weightInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this
        },
        setEffectiveTimeScale: function(e) {
            return this.timeScale = e, this._effectiveTimeScale = this.paused ? 0 : e, this.stopWarping()
        },
        getEffectiveTimeScale: function() {
            return this._effectiveTimeScale
        },
        setDuration: function(e) {
            return this.timeScale = this._clip.duration / e, this.stopWarping()
        },
        syncWith: function(e) {
            return this.time = e.time, this.timeScale = e.timeScale, this.stopWarping()
        },
        halt: function(e) {
            return this.warp(this._effectiveTimeScale, 0, e)
        },
        warp: function(e, t, n) {
            var r = this._mixer,
                i = r.time,
                o = this._timeScaleInterpolant,
                a = this.timeScale;
            null === o && (o = r._lendControlInterpolant(), this._timeScaleInterpolant = o);
            var s = o.parameterPositions,
                c = o.sampleValues;
            return s[0] = i, s[1] = i + n, c[0] = e / a, c[1] = t / a, this
        },
        stopWarping: function() {
            var e = this._timeScaleInterpolant;
            return null !== e && (this._timeScaleInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this
        },
        getMixer: function() {
            return this._mixer
        },
        getClip: function() {
            return this._clip
        },
        getRoot: function() {
            return this._localRoot || this._mixer._root
        },
        _update: function(e, t, n, r) {
            if (this.enabled) {
                var i = this._startTime;
                if (null !== i) {
                    var o = (e - i) * n;
                    if (o < 0 || 0 === n) return;
                    this._startTime = null, t = n * o
                }
                t *= this._updateTimeScale(e);
                var a = this._updateTime(t),
                    s = this._updateWeight(e);
                if (s > 0)
                    for (var c = this._interpolants, l = this._propertyBindings, u = 0, h = c.length; u !== h; ++u) c[u].evaluate(a), l[u].accumulate(r, s)
            } else this._updateWeight(e)
        },
        _updateWeight: function(e) {
            var t = 0;
            if (this.enabled) {
                t = this.weight;
                var n = this._weightInterpolant;
                if (null !== n) {
                    var r = n.evaluate(e)[0];
                    t *= r, e > n.parameterPositions[1] && (this.stopFading(), 0 === r && (this.enabled = !1))
                }
            }
            return this._effectiveWeight = t, t
        },
        _updateTimeScale: function(e) {
            var t = 0;
            if (!this.paused) {
                t = this.timeScale;
                var n = this._timeScaleInterpolant;
                if (null !== n) t *= n.evaluate(e)[0], e > n.parameterPositions[1] && (this.stopWarping(), 0 === t ? this.paused = !0 : this.timeScale = t)
            }
            return this._effectiveTimeScale = t, t
        },
        _updateTime: function(e) {
            var t = this.time + e,
                n = this._clip.duration,
                r = this.loop,
                i = this._loopCount,
                o = 2202 === r;
            if (0 === e) return -1 === i ? t : o && 1 == (1 & i) ? n - t : t;
            if (2200 === r) {
                -1 === i && (this._loopCount = 0, this._setEndings(!0, !0, !1));
                e: {
                    if (t >= n) t = n;
                    else {
                        if (!(t < 0)) {
                            this.time = t;
                            break e
                        }
                        t = 0
                    }
                    this.clampWhenFinished ? this.paused = !0 : this.enabled = !1,
                    this.time = t,
                    this._mixer.dispatchEvent({
                        type: "finished",
                        action: this,
                        direction: e < 0 ? -1 : 1
                    })
                }
            } else {
                if (-1 === i && (e >= 0 ? (i = 0, this._setEndings(!0, 0 === this.repetitions, o)) : this._setEndings(0 === this.repetitions, !0, o)), t >= n || t < 0) {
                    var a = Math.floor(t / n);
                    t -= n * a, i += Math.abs(a);
                    var s = this.repetitions - i;
                    if (s <= 0) this.clampWhenFinished ? this.paused = !0 : this.enabled = !1, t = e > 0 ? n : 0, this.time = t, this._mixer.dispatchEvent({
                        type: "finished",
                        action: this,
                        direction: e > 0 ? 1 : -1
                    });
                    else {
                        if (1 === s) {
                            var c = e < 0;
                            this._setEndings(c, !c, o)
                        } else this._setEndings(!1, !1, o);
                        this._loopCount = i, this.time = t, this._mixer.dispatchEvent({
                            type: "loop",
                            action: this,
                            loopDelta: a
                        })
                    }
                } else this.time = t;
                if (o && 1 == (1 & i)) return n - t
            }
            return t
        },
        _setEndings: function(e, t, n) {
            var r = this._interpolantSettings;
            n ? (r.endingStart = 2401, r.endingEnd = 2401) : (r.endingStart = e ? this.zeroSlopeAtStart ? 2401 : 2400 : 2402, r.endingEnd = t ? this.zeroSlopeAtEnd ? 2401 : 2400 : 2402)
        },
        _scheduleFading: function(e, t, n) {
            var r = this._mixer,
                i = r.time,
                o = this._weightInterpolant;
            null === o && (o = r._lendControlInterpolant(), this._weightInterpolant = o);
            var a = o.parameterPositions,
                s = o.sampleValues;
            return a[0] = i, s[0] = t, a[1] = i + e, s[1] = n, this
        }
    }), zc.prototype = Object.assign(Object.create(u.prototype), {
        constructor: zc,
        _bindAction: function(e, t) {
            var n = e._localRoot || this._root,
                r = e._clip.tracks,
                i = r.length,
                o = e._propertyBindings,
                a = e._interpolants,
                s = n.uuid,
                c = this._bindingsByRootAndName,
                l = c[s];
            void 0 === l && (l = {}, c[s] = l);
            for (var u = 0; u !== i; ++u) {
                var h = r[u],
                    p = h.name,
                    d = l[p];
                if (void 0 !== d) o[u] = d;
                else {
                    if (void 0 !== (d = o[u])) {
                        null === d._cacheIndex && (++d.referenceCount, this._addInactiveBinding(d, s, p));
                        continue
                    }
                    var f = t && t._propertyBindings[u].binding.parsedPath;
                    ++(d = new Ec(Dc.create(n, p, f), h.ValueTypeName, h.getValueSize())).referenceCount, this._addInactiveBinding(d, s, p), o[u] = d
                }
                a[u].resultBuffer = d.buffer
            }
        },
        _activateAction: function(e) {
            if (!this._isActiveAction(e)) {
                if (null === e._cacheIndex) {
                    var t = (e._localRoot || this._root).uuid,
                        n = e._clip.uuid,
                        r = this._actionsByClip[n];
                    this._bindAction(e, r && r.knownActions[0]), this._addInactiveAction(e, n, t)
                }
                for (var i = e._propertyBindings, o = 0, a = i.length; o !== a; ++o) {
                    var s = i[o];
                    0 == s.useCount++ && (this._lendBinding(s), s.saveOriginalState())
                }
                this._lendAction(e)
            }
        },
        _deactivateAction: function(e) {
            if (this._isActiveAction(e)) {
                for (var t = e._propertyBindings, n = 0, r = t.length; n !== r; ++n) {
                    var i = t[n];
                    0 == --i.useCount && (i.restoreOriginalState(), this._takeBackBinding(i))
                }
                this._takeBackAction(e)
            }
        },
        _initMemoryManager: function() {
            this._actions = [], this._nActiveActions = 0, this._actionsByClip = {}, this._bindings = [], this._nActiveBindings = 0, this._bindingsByRootAndName = {}, this._controlInterpolants = [], this._nActiveControlInterpolants = 0;
            var e = this;
            this.stats = {
                actions: {get total() {
                        return e._actions.length
                    },
                    get inUse() {
                        return e._nActiveActions
                    }
                },
                bindings: {get total() {
                        return e._bindings.length
                    },
                    get inUse() {
                        return e._nActiveBindings
                    }
                },
                controlInterpolants: {get total() {
                        return e._controlInterpolants.length
                    },
                    get inUse() {
                        return e._nActiveControlInterpolants
                    }
                }
            }
        },
        _isActiveAction: function(e) {
            var t = e._cacheIndex;
            return null !== t && t < this._nActiveActions
        },
        _addInactiveAction: function(e, t, n) {
            var r = this._actions,
                i = this._actionsByClip,
                o = i[t];
            if (void 0 === o) o = {
                knownActions: [e],
                actionByRoot: {}
            }, e._byClipCacheIndex = 0, i[t] = o;
            else {
                var a = o.knownActions;
                e._byClipCacheIndex = a.length, a.push(e)
            }
            e._cacheIndex = r.length, r.push(e), o.actionByRoot[n] = e
        },
        _removeInactiveAction: function(e) {
            var t = this._actions,
                n = t[t.length - 1],
                r = e._cacheIndex;
            n._cacheIndex = r, t[r] = n, t.pop(), e._cacheIndex = null;
            var i = e._clip.uuid,
                o = this._actionsByClip,
                a = o[i],
                s = a.knownActions,
                c = s[s.length - 1],
                l = e._byClipCacheIndex;
            c._byClipCacheIndex = l, s[l] = c, s.pop(), e._byClipCacheIndex = null, delete a.actionByRoot[(e._localRoot || this._root).uuid], 0 === s.length && delete o[i], this._removeInactiveBindingsForAction(e)
        },
        _removeInactiveBindingsForAction: function(e) {
            for (var t = e._propertyBindings, n = 0, r = t.length; n !== r; ++n) {
                var i = t[n];
                0 == --i.referenceCount && this._removeInactiveBinding(i)
            }
        },
        _lendAction: function(e) {
            var t = this._actions,
                n = e._cacheIndex,
                r = this._nActiveActions++,
                i = t[r];
            e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i
        },
        _takeBackAction: function(e) {
            var t = this._actions,
                n = e._cacheIndex,
                r = --this._nActiveActions,
                i = t[r];
            e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i
        },
        _addInactiveBinding: function(e, t, n) {
            var r = this._bindingsByRootAndName,
                i = r[t],
                o = this._bindings;
            void 0 === i && (i = {}, r[t] = i), i[n] = e, e._cacheIndex = o.length, o.push(e)
        },
        _removeInactiveBinding: function(e) {
            var t = this._bindings,
                n = e.binding,
                r = n.rootNode.uuid,
                i = n.path,
                o = this._bindingsByRootAndName,
                a = o[r],
                s = t[t.length - 1],
                c = e._cacheIndex;
            s._cacheIndex = c, t[c] = s, t.pop(), delete a[i], 0 === Object.keys(a).length && delete o[r]
        },
        _lendBinding: function(e) {
            var t = this._bindings,
                n = e._cacheIndex,
                r = this._nActiveBindings++,
                i = t[r];
            e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i
        },
        _takeBackBinding: function(e) {
            var t = this._bindings,
                n = e._cacheIndex,
                r = --this._nActiveBindings,
                i = t[r];
            e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i
        },
        _lendControlInterpolant: function() {
            var e = this._controlInterpolants,
                t = this._nActiveControlInterpolants++,
                n = e[t];
            return void 0 === n && ((n = new Fa(new Float32Array(2), new Float32Array(2), 1, this._controlInterpolantsResultBuffer)).__cacheIndex = t, e[t] = n), n
        },
        _takeBackControlInterpolant: function(e) {
            var t = this._controlInterpolants,
                n = e.__cacheIndex,
                r = --this._nActiveControlInterpolants,
                i = t[r];
            e.__cacheIndex = r, t[r] = e, i.__cacheIndex = n, t[n] = i
        },
        _controlInterpolantsResultBuffer: new Float32Array(1),
        clipAction: function(e, t) {
            var n = t || this._root,
                r = n.uuid,
                i = "string" == typeof e ? Xa.findByName(n, e) : e,
                o = null !== i ? i.uuid : e,
                a = this._actionsByClip[o],
                s = null;
            if (void 0 !== a) {
                var c = a.actionByRoot[r];
                if (void 0 !== c) return c;
                s = a.knownActions[0], null === i && (i = s._clip)
            }
            if (null === i) return null;
            var l = new Fc(this, i, t);
            return this._bindAction(l, s), this._addInactiveAction(l, o, r), l
        },
        existingAction: function(e, t) {
            var n = t || this._root,
                r = n.uuid,
                i = "string" == typeof e ? Xa.findByName(n, e) : e,
                o = i ? i.uuid : e,
                a = this._actionsByClip[o];
            return void 0 !== a && a.actionByRoot[r] || null
        },
        stopAllAction: function() {
            var e = this._actions,
                t = this._nActiveActions,
                n = this._bindings,
                r = this._nActiveBindings;
            this._nActiveActions = 0, this._nActiveBindings = 0;
            for (var i = 0; i !== t; ++i) e[i].reset();
            for (i = 0; i !== r; ++i) n[i].useCount = 0;
            return this
        },
        update: function(e) {
            e *= this.timeScale;
            for (var t = this._actions, n = this._nActiveActions, r = this.time += e, i = Math.sign(e), o = this._accuIndex ^= 1, a = 0; a !== n; ++a) {
                t[a]._update(r, e, i, o)
            }
            var s = this._bindings,
                c = this._nActiveBindings;
            for (a = 0; a !== c; ++a) s[a].apply(o);
            return this
        },
        setTime: function(e) {
            this.time = 0;
            for (var t = 0; t < this._actions.length; t++) this._actions[t].time = 0;
            return this.update(e)
        },
        getRoot: function() {
            return this._root
        },
        uncacheClip: function(e) {
            var t = this._actions,
                n = e.uuid,
                r = this._actionsByClip,
                i = r[n];
            if (void 0 !== i) {
                for (var o = i.knownActions, a = 0, s = o.length; a !== s; ++a) {
                    var c = o[a];
                    this._deactivateAction(c);
                    var l = c._cacheIndex,
                        u = t[t.length - 1];
                    c._cacheIndex = null, c._byClipCacheIndex = null, u._cacheIndex = l, t[l] = u, t.pop(), this._removeInactiveBindingsForAction(c)
                }
                delete r[n]
            }
        },
        uncacheRoot: function(e) {
            var t = e.uuid,
                n = this._actionsByClip;
            for (var r in n) {
                var i = n[r].actionByRoot[t];
                void 0 !== i && (this._deactivateAction(i), this._removeInactiveAction(i))
            }
            var o = this._bindingsByRootAndName[t];
            if (void 0 !== o)
                for (var a in o) {
                    var s = o[a];
                    s.restoreOriginalState(), this._removeInactiveBinding(s)
                }
        },
        uncacheAction: function(e, t) {
            var n = this.existingAction(e, t);
            null !== n && (this._deactivateAction(n), this._removeInactiveAction(n))
        }
    }), Uc.prototype.clone = function() {
        return new Uc(void 0 === this.value.clone ? this.value : this.value.clone())
    }, Bc.prototype = Object.assign(Object.create(ci.prototype), {
        constructor: Bc,
        isInstancedInterleavedBuffer: !0,
        copy: function(e) {
            return ci.prototype.copy.call(this, e), this.meshPerAttribute = e.meshPerAttribute, this
        }
    }), Object.assign(function(e, t, n, r) {
        this.ray = new Ee(e, t), this.near = n || 0, this.far = r || 1 / 0, this.camera = null, this.params = {
            Mesh: {},
            Line: {},
            LOD: {},
            Points: {
                threshold: 1
            },
            Sprite: {}
        }, Object.defineProperties(this.params, {
            PointCloud: {
                get: function() {
                    return console.warn("THREE.Raycaster: params.PointCloud has been renamed to params.Points."), this.Points
                }
            }
        })
    }.prototype, {
        linePrecision: 1,
        set: function(e, t) {
            this.ray.set(e, t)
        },
        setFromCamera: function(e, t) {
            t && t.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(e.x, e.y, .5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t) : t && t.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, (t.near + t.far) / (t.near - t.far)).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t) : console.error("THREE.Raycaster: Unsupported camera type.")
        },
        intersectObject: function(e, t, n) {
            var r = n || [];
            return Gc(e, this, r, t), r.sort(kc), r
        },
        intersectObjects: function(e, t, n) {
            var r = n || [];
            if (!1 === Array.isArray(e)) return console.warn("THREE.Raycaster.intersectObjects: objects is not an Array."), r;
            for (var i = 0, o = e.length; i < o; i++) Gc(e[i], this, r, t);
            return r.sort(kc), r
        }
    }), Object.assign(Hc.prototype, {
        set: function(e, t, n) {
            return this.radius = e, this.phi = t, this.theta = n, this
        },
        clone: function() {
            return (new this.constructor).copy(this)
        },
        copy: function(e) {
            return this.radius = e.radius, this.phi = e.phi, this.theta = e.theta, this
        },
        makeSafe: function() {
            return this.phi = Math.max(1e-6, Math.min(Math.PI - 1e-6, this.phi)), this
        },
        setFromVector3: function(e) {
            return this.setFromCartesianCoords(e.x, e.y, e.z)
        },
        setFromCartesianCoords: function(e, t, n) {
            return this.radius = Math.sqrt(e * e + t * t + n * n), 0 === this.radius ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(e, n), this.phi = Math.acos(d.clamp(t / this.radius, -1, 1))), this
        }
    }), Object.assign(function(e, t, n) {
        return this.radius = void 0 !== e ? e : 1, this.theta = void 0 !== t ? t : 0, this.y = void 0 !== n ? n : 0, this
    }.prototype, {
        set: function(e, t, n) {
            return this.radius = e, this.theta = t, this.y = n, this
        },
        clone: function() {
            return (new this.constructor).copy(this)
        },
        copy: function(e) {
            return this.radius = e.radius, this.theta = e.theta, this.y = e.y, this
        },
        setFromVector3: function(e) {
            return this.setFromCartesianCoords(e.x, e.y, e.z)
        },
        setFromCartesianCoords: function(e, t, n) {
            return this.radius = Math.sqrt(e * e + n * n), this.theta = Math.atan2(e, n), this.y = t, this
        }
    });
var jc = new f;

function Vc(e, t) {
    this.min = void 0 !== e ? e : new f(1 / 0, 1 / 0), this.max = void 0 !== t ? t : new f(-1 / 0, -1 / 0)
}
Object.assign(Vc.prototype, {
    set: function(e, t) {
        return this.min.copy(e), this.max.copy(t), this
    },
    setFromPoints: function(e) {
        this.makeEmpty();
        for (var t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
        return this
    },
    setFromCenterAndSize: function(e, t) {
        var n = jc.copy(t).multiplyScalar(.5);
        return this.min.copy(e).sub(n), this.max.copy(e).add(n), this
    },
    clone: function() {
        return (new this.constructor).copy(this)
    },
    copy: function(e) {
        return this.min.copy(e.min), this.max.copy(e.max), this
    },
    makeEmpty: function() {
        return this.min.x = this.min.y = 1 / 0, this.max.x = this.max.y = -1 / 0, this
    },
    isEmpty: function() {
        return this.max.x < this.min.x || this.max.y < this.min.y
    },
    getCenter: function(e) {
        return void 0 === e && (console.warn("THREE.Box2: .getCenter() target is now required"), e = new f), this.isEmpty() ? e.set(0, 0) : e.addVectors(this.min, this.max).multiplyScalar(.5)
    },
    getSize: function(e) {
        return void 0 === e && (console.warn("THREE.Box2: .getSize() target is now required"), e = new f), this.isEmpty() ? e.set(0, 0) : e.subVectors(this.max, this.min)
    },
    expandByPoint: function(e) {
        return this.min.min(e), this.max.max(e), this
    },
    expandByVector: function(e) {
        return this.min.sub(e), this.max.add(e), this
    },
    expandByScalar: function(e) {
        return this.min.addScalar(-e), this.max.addScalar(e), this
    },
    containsPoint: function(e) {
        return !(e.x < this.min.x || e.x > this.max.x || e.y < this.min.y || e.y > this.max.y)
    },
    containsBox: function(e) {
        return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y
    },
    getParameter: function(e, t) {
        return void 0 === t && (console.warn("THREE.Box2: .getParameter() target is now required"), t = new f), t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y))
    },
    intersectsBox: function(e) {
        return !(e.max.x < this.min.x || e.min.x > this.max.x || e.max.y < this.min.y || e.min.y > this.max.y)
    },
    clampPoint: function(e, t) {
        return void 0 === t && (console.warn("THREE.Box2: .clampPoint() target is now required"), t = new f), t.copy(e).clamp(this.min, this.max)
    },
    distanceToPoint: function(e) {
        return jc.copy(e).clamp(this.min, this.max).sub(e).length()
    },
    intersect: function(e) {
        return this.min.max(e.min), this.max.min(e.max), this
    },
    union: function(e) {
        return this.min.min(e.min), this.max.max(e.max), this
    },
    translate: function(e) {
        return this.min.add(e), this.max.add(e), this
    },
    equals: function(e) {
        return e.min.equals(this.min) && e.max.equals(this.max)
    }
});
var Wc = new y,
    Xc = new y;

function qc(e, t) {
    this.start = void 0 !== e ? e : new y, this.end = void 0 !== t ? t : new y
}

function Yc(e) {
    $.call(this), this.material = e, this.render = function() {}
}
Object.assign(qc.prototype, {
    set: function(e, t) {
        return this.start.copy(e), this.end.copy(t), this
    },
    clone: function() {
        return (new this.constructor).copy(this)
    },
    copy: function(e) {
        return this.start.copy(e.start), this.end.copy(e.end), this
    },
    getCenter: function(e) {
        return void 0 === e && (console.warn("THREE.Line3: .getCenter() target is now required"), e = new y), e.addVectors(this.start, this.end).multiplyScalar(.5)
    },
    delta: function(e) {
        return void 0 === e && (console.warn("THREE.Line3: .delta() target is now required"), e = new y), e.subVectors(this.end, this.start)
    },
    distanceSq: function() {
        return this.start.distanceToSquared(this.end)
    },
    distance: function() {
        return this.start.distanceTo(this.end)
    },
    at: function(e, t) {
        return void 0 === t && (console.warn("THREE.Line3: .at() target is now required"), t = new y), this.delta(t).multiplyScalar(e).add(this.start)
    },
    closestPointToPointParameter: function(e, t) {
        Wc.subVectors(e, this.start), Xc.subVectors(this.end, this.start);
        var n = Xc.dot(Xc),
            r = Xc.dot(Wc) / n;
        return t && (r = d.clamp(r, 0, 1)), r
    },
    closestPointToPoint: function(e, t, n) {
        var r = this.closestPointToPointParameter(e, t);
        return void 0 === n && (console.warn("THREE.Line3: .closestPointToPoint() target is now required"), n = new y), this.delta(n).multiplyScalar(r).add(this.start)
    },
    applyMatrix4: function(e) {
        return this.start.applyMatrix4(e), this.end.applyMatrix4(e), this
    },
    equals: function(e) {
        return e.start.equals(this.start) && e.end.equals(this.end)
    }
}), Yc.prototype = Object.create($.prototype), Yc.prototype.constructor = Yc, Yc.prototype.isImmediateRenderObject = !0;
var Zc = new y;

function Jc(e, t) {
    $.call(this), this.light = e, this.light.updateMatrixWorld(), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1, this.color = t;
    for (var n = new yt, r = [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, -1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, -1, 1], i = 0, o = 1; i < 32; i++, o++) {
        var a = i / 32 * Math.PI * 2,
            s = o / 32 * Math.PI * 2;
        r.push(Math.cos(a), Math.sin(a), 1, Math.cos(s), Math.sin(s), 1)
    }
    n.setAttribute("position", new st(r, 3));
    var c = new ki({
        fog: !1
    });
    this.cone = new Zi(n, c), this.add(this.cone), this.update()
}
Jc.prototype = Object.create($.prototype), Jc.prototype.constructor = Jc, Jc.prototype.dispose = function() {
    this.cone.geometry.dispose(), this.cone.material.dispose()
}, Jc.prototype.update = function() {
    this.light.updateMatrixWorld();
    var e = this.light.distance ? this.light.distance : 1e3,
        t = e * Math.tan(this.light.angle);
    this.cone.scale.set(t, t, e), Zc.setFromMatrixPosition(this.light.target.matrixWorld), this.cone.lookAt(Zc), void 0 !== this.color ? this.cone.material.color.set(this.color) : this.cone.material.color.copy(this.light.color)
};
var Kc = new y,
    Qc = new D,
    $c = new D;

function el(e) {
    for (var t = function e(t) {
            var n = [];
            t && t.isBone && n.push(t);
            for (var r = 0; r < t.children.length; r++) n.push.apply(n, e(t.children[r]));
            return n
        }(e), n = new yt, r = [], i = [], o = new Ve(0, 0, 1), a = new Ve(0, 1, 0), s = 0; s < t.length; s++) {
        var c = t[s];
        c.parent && c.parent.isBone && (r.push(0, 0, 0), r.push(0, 0, 0), i.push(o.r, o.g, o.b), i.push(a.r, a.g, a.b))
    }
    n.setAttribute("position", new st(r, 3)), n.setAttribute("color", new st(i, 3));
    var l = new ki({
        vertexColors: 2,
        depthTest: !1,
        depthWrite: !1,
        transparent: !0
    });
    Zi.call(this, n, l), this.root = e, this.bones = t, this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1
}

function tl(e, t, n) {
    this.light = e, this.light.updateMatrixWorld(), this.color = n;
    var r = new aa(t, 4, 2),
        i = new Ke({
            wireframe: !0,
            fog: !1
        });
    Ft.call(this, r, i), this.matrix = this.light.matrixWorld, this.matrixAutoUpdate = !1, this.update()
}
el.prototype = Object.create(Zi.prototype), el.prototype.constructor = el, el.prototype.updateMatrixWorld = function(e) {
    var t = this.bones,
        n = this.geometry,
        r = n.getAttribute("position");
    $c.getInverse(this.root.matrixWorld);
    for (var i = 0, o = 0; i < t.length; i++) {
        var a = t[i];
        a.parent && a.parent.isBone && (Qc.multiplyMatrices($c, a.matrixWorld), Kc.setFromMatrixPosition(Qc), r.setXYZ(o, Kc.x, Kc.y, Kc.z), Qc.multiplyMatrices($c, a.parent.matrixWorld), Kc.setFromMatrixPosition(Qc), r.setXYZ(o + 1, Kc.x, Kc.y, Kc.z), o += 2)
    }
    n.getAttribute("position").needsUpdate = !0, $.prototype.updateMatrixWorld.call(this, e)
}, tl.prototype = Object.create(Ft.prototype), tl.prototype.constructor = tl, tl.prototype.dispose = function() {
    this.geometry.dispose(), this.material.dispose()
}, tl.prototype.update = function() {
    void 0 !== this.color ? this.material.color.set(this.color) : this.material.color.copy(this.light.color)
};
var nl = new y,
    rl = new Ve,
    il = new Ve;

function ol(e, t, n) {
    $.call(this), this.light = e, this.light.updateMatrixWorld(), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1, this.color = n;
    var r = new go(t);
    r.rotateY(.5 * Math.PI), this.material = new Ke({
        wireframe: !0,
        fog: !1
    }), void 0 === this.color && (this.material.vertexColors = 2);
    var i = r.getAttribute("position"),
        o = new Float32Array(3 * i.count);
    r.setAttribute("color", new $e(o, 3)), this.add(new Ft(r, this.material)), this.update()
}

function al(e, t, n, r) {
    e = e || 10, t = t || 10, n = new Ve(void 0 !== n ? n : 4473924), r = new Ve(void 0 !== r ? r : 8947848);
    for (var i = t / 2, o = e / t, a = e / 2, s = [], c = [], l = 0, u = 0, h = -a; l <= t; l++, h += o) {
        s.push(-a, 0, h, a, 0, h), s.push(h, 0, -a, h, 0, a);
        var p = l === i ? n : r;
        p.toArray(c, u), u += 3, p.toArray(c, u), u += 3, p.toArray(c, u), u += 3, p.toArray(c, u), u += 3
    }
    var d = new yt;
    d.setAttribute("position", new st(s, 3)), d.setAttribute("color", new st(c, 3));
    var f = new ki({
        vertexColors: 2
    });
    Zi.call(this, d, f)
}

function sl(e, t, n, r, i, o) {
    e = e || 10, t = t || 16, n = n || 8, r = r || 64, i = new Ve(void 0 !== i ? i : 4473924), o = new Ve(void 0 !== o ? o : 8947848);
    var a, s, c, l, u, h, p, d = [],
        f = [];
    for (l = 0; l <= t; l++) c = l / t * (2 * Math.PI), a = Math.sin(c) * e, s = Math.cos(c) * e, d.push(0, 0, 0), d.push(a, 0, s), p = 1 & l ? i : o, f.push(p.r, p.g, p.b), f.push(p.r, p.g, p.b);
    for (l = 0; l <= n; l++)
        for (p = 1 & l ? i : o, h = e - e / n * l, u = 0; u < r; u++) c = u / r * (2 * Math.PI), a = Math.sin(c) * h, s = Math.cos(c) * h, d.push(a, 0, s), f.push(p.r, p.g, p.b), c = (u + 1) / r * (2 * Math.PI), a = Math.sin(c) * h, s = Math.cos(c) * h, d.push(a, 0, s), f.push(p.r, p.g, p.b);
    var m = new yt;
    m.setAttribute("position", new st(d, 3)), m.setAttribute("color", new st(f, 3));
    var v = new ki({
        vertexColors: 2
    });
    Zi.call(this, m, v)
}
ol.prototype = Object.create($.prototype), ol.prototype.constructor = ol, ol.prototype.dispose = function() {
    this.children[0].geometry.dispose(), this.children[0].material.dispose()
}, ol.prototype.update = function() {
    var e = this.children[0];
    if (void 0 !== this.color) this.material.color.set(this.color);
    else {
        var t = e.geometry.getAttribute("color");
        rl.copy(this.light.color), il.copy(this.light.groundColor);
        for (var n = 0, r = t.count; n < r; n++) {
            var i = n < r / 2 ? rl : il;
            t.setXYZ(n, i.r, i.g, i.b)
        }
        t.needsUpdate = !0
    }
    e.lookAt(nl.setFromMatrixPosition(this.light.matrixWorld).negate())
}, al.prototype = Object.assign(Object.create(Zi.prototype), {
    constructor: al,
    copy: function(e) {
        return Zi.prototype.copy.call(this, e), this.geometry.copy(e.geometry), this.material.copy(e.material), this
    },
    clone: function() {
        return (new this.constructor).copy(this)
    }
}), sl.prototype = Object.create(Zi.prototype), sl.prototype.constructor = sl;
var cl = new y,
    ll = new y,
    ul = new y;

function hl(e, t, n) {
    $.call(this), this.light = e, this.light.updateMatrixWorld(), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1, this.color = n, void 0 === t && (t = 1);
    var r = new yt;
    r.setAttribute("position", new st([-t, t, 0, t, t, 0, t, -t, 0, -t, -t, 0, -t, t, 0], 3));
    var i = new ki({
        fog: !1
    });
    this.lightPlane = new Xi(r, i), this.add(this.lightPlane), (r = new yt).setAttribute("position", new st([0, 0, 0, 0, 0, 1], 3)), this.targetLine = new Xi(r, i), this.add(this.targetLine), this.update()
}
hl.prototype = Object.create($.prototype), hl.prototype.constructor = hl, hl.prototype.dispose = function() {
    this.lightPlane.geometry.dispose(), this.lightPlane.material.dispose(), this.targetLine.geometry.dispose(), this.targetLine.material.dispose()
}, hl.prototype.update = function() {
    cl.setFromMatrixPosition(this.light.matrixWorld), ll.setFromMatrixPosition(this.light.target.matrixWorld), ul.subVectors(ll, cl), this.lightPlane.lookAt(ll), void 0 !== this.color ? (this.lightPlane.material.color.set(this.color), this.targetLine.material.color.set(this.color)) : (this.lightPlane.material.color.copy(this.light.color), this.targetLine.material.color.copy(this.light.color)), this.targetLine.lookAt(ll), this.targetLine.scale.z = ul.length()
};
var pl = new y,
    dl = new Zt;

function fl(e) {
    var t = new yt,
        n = new ki({
            color: 16777215,
            vertexColors: 1
        }),
        r = [],
        i = [],
        o = {},
        a = new Ve(16755200),
        s = new Ve(16711680),
        c = new Ve(43775),
        l = new Ve(16777215),
        u = new Ve(3355443);

    function h(e, t, n) {
        p(e, n), p(t, n)
    }

    function p(e, t) {
        r.push(0, 0, 0), i.push(t.r, t.g, t.b), void 0 === o[e] && (o[e] = []), o[e].push(r.length / 3 - 1)
    }
    h("n1", "n2", a), h("n2", "n4", a), h("n4", "n3", a), h("n3", "n1", a), h("f1", "f2", a), h("f2", "f4", a), h("f4", "f3", a), h("f3", "f1", a), h("n1", "f1", a), h("n2", "f2", a), h("n3", "f3", a), h("n4", "f4", a), h("p", "n1", s), h("p", "n2", s), h("p", "n3", s), h("p", "n4", s), h("u1", "u2", c), h("u2", "u3", c), h("u3", "u1", c), h("c", "t", l), h("p", "c", u), h("cn1", "cn2", u), h("cn3", "cn4", u), h("cf1", "cf2", u), h("cf3", "cf4", u), t.setAttribute("position", new st(r, 3)), t.setAttribute("color", new st(i, 3)), Zi.call(this, t, n), this.camera = e, this.camera.updateProjectionMatrix && this.camera.updateProjectionMatrix(), this.matrix = e.matrixWorld, this.matrixAutoUpdate = !1, this.pointMap = o, this.update()
}

function ml(e, t, n, r, i, o, a) {
    pl.set(i, o, a).unproject(r);
    var s = t[e];
    if (void 0 !== s)
        for (var c = n.getAttribute("position"), l = 0, u = s.length; l < u; l++) c.setXYZ(s[l], pl.x, pl.y, pl.z)
}
fl.prototype = Object.create(Zi.prototype), fl.prototype.constructor = fl, fl.prototype.update = function() {
    var e = this.geometry,
        t = this.pointMap;
    dl.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse), ml("c", t, e, dl, 0, 0, -1), ml("t", t, e, dl, 0, 0, 1), ml("n1", t, e, dl, -1, -1, -1), ml("n2", t, e, dl, 1, -1, -1), ml("n3", t, e, dl, -1, 1, -1), ml("n4", t, e, dl, 1, 1, -1), ml("f1", t, e, dl, -1, -1, 1), ml("f2", t, e, dl, 1, -1, 1), ml("f3", t, e, dl, -1, 1, 1), ml("f4", t, e, dl, 1, 1, 1), ml("u1", t, e, dl, .7, 1.1, -1), ml("u2", t, e, dl, -.7, 1.1, -1), ml("u3", t, e, dl, 0, 2, -1), ml("cf1", t, e, dl, -1, 0, 1), ml("cf2", t, e, dl, 1, 0, 1), ml("cf3", t, e, dl, 0, -1, 1), ml("cf4", t, e, dl, 0, 1, 1), ml("cn1", t, e, dl, -1, 0, -1), ml("cn2", t, e, dl, 1, 0, -1), ml("cn3", t, e, dl, 0, -1, -1), ml("cn4", t, e, dl, 0, 1, -1), e.getAttribute("position").needsUpdate = !0
};
var vl = new fe;

function gl(e, t) {
    this.object = e, void 0 === t && (t = 16776960);
    var n = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]),
        r = new Float32Array(24),
        i = new yt;
    i.setIndex(new $e(n, 1)), i.setAttribute("position", new $e(r, 3)), Zi.call(this, i, new ki({
        color: t
    })), this.matrixAutoUpdate = !1, this.update()
}

function yl(e, t) {
    this.type = "Box3Helper", this.box = e, t = t || 16776960;
    var n = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]),
        r = new yt;
    r.setIndex(new $e(n, 1)), r.setAttribute("position", new st([1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1], 3)), Zi.call(this, r, new ki({
        color: t
    })), this.geometry.computeBoundingSphere()
}

function xl(e, t, n) {
    this.type = "PlaneHelper", this.plane = e, this.size = void 0 === t ? 1 : t;
    var r = void 0 !== n ? n : 16776960,
        i = new yt;
    i.setAttribute("position", new st([1, -1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0], 3)), i.computeBoundingSphere(), Xi.call(this, i, new ki({
        color: r
    }));
    var o = new yt;
    o.setAttribute("position", new st([1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1], 3)), o.computeBoundingSphere(), this.add(new Ft(o, new Ke({
        color: r,
        opacity: .2,
        transparent: !0,
        depthWrite: !1
    })))
}
gl.prototype = Object.create(Zi.prototype), gl.prototype.constructor = gl, gl.prototype.update = function(e) {
    if (void 0 !== e && console.warn("THREE.BoxHelper: .update() has no longer arguments."), void 0 !== this.object && vl.setFromObject(this.object), !vl.isEmpty()) {
        var t = vl.min,
            n = vl.max,
            r = this.geometry.attributes.position,
            i = r.array;
        i[0] = n.x, i[1] = n.y, i[2] = n.z, i[3] = t.x, i[4] = n.y, i[5] = n.z, i[6] = t.x, i[7] = t.y, i[8] = n.z, i[9] = n.x, i[10] = t.y, i[11] = n.z, i[12] = n.x, i[13] = n.y, i[14] = t.z, i[15] = t.x, i[16] = n.y, i[17] = t.z, i[18] = t.x, i[19] = t.y, i[20] = t.z, i[21] = n.x, i[22] = t.y, i[23] = t.z, r.needsUpdate = !0, this.geometry.computeBoundingSphere()
    }
}, gl.prototype.setFromObject = function(e) {
    return this.object = e, this.update(), this
}, gl.prototype.copy = function(e) {
    return Zi.prototype.copy.call(this, e), this.object = e.object, this
}, gl.prototype.clone = function() {
    return (new this.constructor).copy(this)
}, yl.prototype = Object.create(Zi.prototype), yl.prototype.constructor = yl, yl.prototype.updateMatrixWorld = function(e) {
    var t = this.box;
    t.isEmpty() || (t.getCenter(this.position), t.getSize(this.scale), this.scale.multiplyScalar(.5), $.prototype.updateMatrixWorld.call(this, e))
}, xl.prototype = Object.create(Xi.prototype), xl.prototype.constructor = xl, xl.prototype.updateMatrixWorld = function(e) {
    var t = -this.plane.constant;
    Math.abs(t) < 1e-8 && (t = 1e-8), this.scale.set(.5 * this.size, .5 * this.size, t), this.children[0].material.side = t < 0 ? 1 : 0, this.lookAt(this.plane.normal), $.prototype.updateMatrixWorld.call(this, e)
};
var _l, bl, wl = new y;

function Ml(e, t, n, r, i, o) {
    $.call(this), void 0 === e && (e = new y(0, 0, 1)), void 0 === t && (t = new y(0, 0, 0)), void 0 === n && (n = 1), void 0 === r && (r = 16776960), void 0 === i && (i = .2 * n), void 0 === o && (o = .2 * i), void 0 === _l && ((_l = new yt).setAttribute("position", new st([0, 0, 0, 0, 1, 0], 3)), (bl = new va(0, .5, 1, 5, 1)).translate(0, -.5, 0)), this.position.copy(t), this.line = new Xi(_l, new ki({
        color: r
    })), this.line.matrixAutoUpdate = !1, this.add(this.line), this.cone = new Ft(bl, new Ke({
        color: r
    })), this.cone.matrixAutoUpdate = !1, this.add(this.cone), this.setDirection(e), this.setLength(n, i, o)
}

function Sl(e) {
    var t = [0, 0, 0, e = e || 1, 0, 0, 0, 0, 0, 0, e, 0, 0, 0, 0, 0, 0, e],
        n = new yt;
    n.setAttribute("position", new st(t, 3)), n.setAttribute("color", new st([1, 0, 0, 1, .6, 0, 0, 1, 0, .6, 1, 0, 0, 0, 1, 0, .6, 1], 3));
    var r = new ki({
        vertexColors: 2
    });
    Zi.call(this, n, r)
}
Ml.prototype = Object.create($.prototype), Ml.prototype.constructor = Ml, Ml.prototype.setDirection = function(e) {
    if (e.y > .99999) this.quaternion.set(0, 0, 0, 1);
    else if (e.y < -.99999) this.quaternion.set(1, 0, 0, 0);
    else {
        wl.set(e.z, 0, -e.x).normalize();
        var t = Math.acos(e.y);
        this.quaternion.setFromAxisAngle(wl, t)
    }
}, Ml.prototype.setLength = function(e, t, n) {
    void 0 === t && (t = .2 * e), void 0 === n && (n = .2 * t), this.line.scale.set(1, Math.max(1e-4, e - t), 1), this.line.updateMatrix(), this.cone.scale.set(n, t, n), this.cone.position.y = e, this.cone.updateMatrix()
}, Ml.prototype.setColor = function(e) {
    this.line.material.color.set(e), this.cone.material.color.set(e)
}, Ml.prototype.copy = function(e) {
    return $.prototype.copy.call(this, e, !1), this.line.copy(e.line), this.cone.copy(e.cone), this
}, Ml.prototype.clone = function() {
    return (new this.constructor).copy(this)
}, Sl.prototype = Object.create(Zi.prototype), Sl.prototype.constructor = Sl;
var El, Tl, Al, Ll, Rl = Math.pow(2, 8),
    Pl = [.125, .215, .35, .446, .526, .582],
    Cl = 5 + Pl.length,
    Ol = {
        3e3: 0,
        3001: 1,
        3002: 2,
        3004: 3,
        3005: 4,
        3006: 5,
        3007: 6
    },
    Il = new Fs,
    Nl = (El = 20, Tl = new Float32Array(El), Al = new y(0, 1, 0), (Ll = new Ma({
        defines: {
            n: El
        },
        uniforms: {
            envMap: {
                value: null
            },
            samples: {
                value: 1
            },
            weights: {
                value: Tl
            },
            latitudinal: {
                value: !1
            },
            dTheta: {
                value: 0
            },
            mipInt: {
                value: 0
            },
            poleAxis: {
                value: Al
            },
            inputEncoding: {
                value: Ol[3e3]
            },
            outputEncoding: {
                value: Ol[3e3]
            }
        },
        vertexShader: nu(),
        fragmentShader: `\nprecision mediump float;\nprecision mediump int;\nvarying vec3 vOutputDirection;\nuniform sampler2D envMap;\nuniform int samples;\nuniform float weights[n];\nuniform bool latitudinal;\nuniform float dTheta;\nuniform float mipInt;\nuniform vec3 poleAxis;\n\n${ru()}\n\n#define ENVMAP_TYPE_CUBE_UV\n#include <cube_uv_reflection_fragment>\n\nvoid main() {\n\tgl_FragColor = vec4(0.0);\n\tfor (int i = 0; i < n; i++) {\n\t\tif (i >= samples)\n\t\t\tbreak;\n\t\tfor (int dir = -1; dir < 2; dir += 2) {\n\t\t\tif (i == 0 && dir == 1)\n\t\t\t\tcontinue;\n\t\t\tvec3 axis = latitudinal ? poleAxis : cross(poleAxis, vOutputDirection);\n\t\t\tif (all(equal(axis, vec3(0.0))))\n\t\t\t\taxis = cross(vec3(0.0, 1.0, 0.0), vOutputDirection);\n\t\t\taxis = normalize(axis);\n\t\t\tfloat theta = dTheta * float(dir * i);\n\t\t\tfloat cosTheta = cos(theta);\n\t\t\t// Rodrigues' axis-angle rotation\n\t\t\tvec3 sampleDirection = vOutputDirection * cosTheta\n\t\t\t\t\t+ cross(axis, vOutputDirection) * sin(theta)\n\t\t\t\t\t+ axis * dot(axis, vOutputDirection) * (1.0 - cosTheta);\n\t\t\tgl_FragColor.rgb +=\n\t\t\t\t\tweights[i] * bilinearCubeUV(envMap, sampleDirection, mipInt);\n\t\t}\n\t}\n\tgl_FragColor = linearToOutputTexel(gl_FragColor);\n}\n\t\t`,
        blending: 0,
        depthTest: !1,
        depthWrite: !1
    })).type = "SphericalGaussianBlur", Ll),
    Dl = null,
    Fl = null,
    {
        _lodPlanes: zl,
        _sizeLods: Ul,
        _sigmas: Bl
    } = function() {
        for (var e = [], t = [], n = [], r = 8, i = 0; i < Cl; i++) {
            var o = Math.pow(2, r);
            t.push(o);
            var a = 1 / o;
            i > 4 ? a = Pl[i - 8 + 4 - 1] : 0 == i && (a = 0), n.push(a);
            for (var s = 1 / (o - 1), c = -s / 2, l = 1 + s / 2, u = [c, c, l, c, l, l, c, c, l, l, c, l], h = new Float32Array(108), p = new Float32Array(72), d = new Float32Array(36), f = 0; f < 6; f++) {
                var m = f % 3 * 2 / 3 - 1,
                    v = f > 2 ? 0 : -1,
                    g = [m, v, 0, m + 2 / 3, v, 0, m + 2 / 3, v + 1, 0, m, v, 0, m + 2 / 3, v + 1, 0, m, v + 1, 0];
                h.set(g, 18 * f), p.set(u, 12 * f);
                var y = [f, f, f, f, f, f];
                d.set(y, 6 * f)
            }
            var x = new yt;
            x.setAttribute("position", new $e(h, 3)), x.setAttribute("uv", new $e(p, 2)), x.setAttribute("faceIndex", new $e(d, 1)), e.push(x), r > 4 && r--
        }
        return {
            _lodPlanes: e,
            _sizeLods: t,
            _sigmas: n
        }
    }(),
    kl = null,
    Gl = null,
    Hl = (1 + Math.sqrt(5)) / 2,
    jl = 1 / Hl,
    Vl = [new y(1, 1, 1), new y(-1, 1, 1), new y(1, 1, -1), new y(-1, 1, -1), new y(0, Hl, jl), new y(0, Hl, -jl), new y(jl, 0, Hl), new y(-jl, 0, Hl), new y(Hl, jl, 0), new y(-Hl, jl, 0)];

function Wl(e) {
    Gl = e, Yl(Nl)
}

function Xl(e) {
    var t = {
            magFilter: 1003,
            minFilter: 1003,
            generateMipmaps: !1,
            type: e ? e.type : 1009,
            format: e ? e.format : 1023,
            encoding: e ? e.encoding : 3002,
            depthBuffer: !1,
            stencilBuffer: !1
        },
        n = Zl(t);
    return n.depthBuffer = !e, kl = Zl(t), n
}

function ql() {
    kl.dispose(), Gl.setRenderTarget(null);
    var e = Gl.getSize(new f);
    Gl.setViewport(0, 0, e.x, e.y)
}

function Yl(e) {
    var t = new ee;
    t.add(new Ft(zl[0], e)), Gl.compile(t, Il)
}

function Zl(e) {
    var t = new T(3 * Rl, 3 * Rl, e);
    return t.texture.mapping = 306, t.texture.name = "PMREM.cubeUv", t.scissorTest = !0, t
}

function Jl(e, t, n, r) {
    var i = 1 / Gl.getPixelRatio();
    e *= i, t *= i, n *= i, r *= i, Gl.setViewport(e, t, n, r), Gl.setScissor(e, t, n, r)
}

function Kl(e) {
    var t = Gl.autoClear;
    Gl.autoClear = !1;
    for (var n = 1; n < Cl; n++) {
        Ql(e, n - 1, n, Math.sqrt(Bl[n] * Bl[n] - Bl[n - 1] * Bl[n - 1]), Vl[(n - 1) % Vl.length])
    }
    Gl.autoClear = t
}

function Ql(e, t, n, r, i) {
    $l(e, kl, t, n, r, "latitudinal", i), $l(kl, e, n, n, r, "longitudinal", i)
}

function $l(e, t, n, r, i, o, a) {
    "latitudinal" !== o && "longitudinal" !== o && console.error("blur direction must be either latitudinal or longitudinal!");
    var s = new ee;
    s.add(new Ft(zl[r], Nl));
    var c = Nl.uniforms,
        l = Ul[n] - 1,
        u = isFinite(i) ? Math.PI / (2 * l) : 2 * Math.PI / 39,
        h = i / u,
        p = isFinite(i) ? 1 + Math.floor(3 * h) : 20;
    p > 20 && console.warn(`sigmaRadians, ${i}, is too large and will clip, as it requested ${p} samples when the maximum is set to 20`);
    for (var d = [], f = 0, m = 0; m < 20; ++m) {
        var v = m / h,
            g = Math.exp(-v * v / 2);
        d.push(g), 0 == m ? f += g : m < p && (f += 2 * g)
    }
    for (m = 0; m < d.length; m++) d[m] = d[m] / f;
    c.envMap.value = e.texture, c.samples.value = p, c.weights.value = d, c.latitudinal.value = "latitudinal" === o, a && (c.poleAxis.value = a), c.dTheta.value = u, c.mipInt.value = 8 - n, c.inputEncoding.value = Ol[e.texture.encoding], c.outputEncoding.value = Ol[e.texture.encoding];
    var y = Ul[r],
        x = (v = 3 * Math.max(0, Rl - 2 * y), (0 === r ? 0 : 2 * Rl) + 2 * y * (r > 4 ? r - 8 + 4 : 0));
    Gl.setRenderTarget(t), Jl(v, x, 3 * y, 2 * y), Gl.render(s, Il)
}

function eu() {
    var e = new Ma({
        uniforms: {
            envMap: {
                value: null
            },
            texelSize: {
                value: new f(1, 1)
            },
            inputEncoding: {
                value: Ol[3e3]
            },
            outputEncoding: {
                value: Ol[3e3]
            }
        },
        vertexShader: nu(),
        fragmentShader: `\nprecision mediump float;\nprecision mediump int;\nvarying vec3 vOutputDirection;\nuniform sampler2D envMap;\nuniform vec2 texelSize;\n\n${ru()}\n\n#define RECIPROCAL_PI 0.31830988618\n#define RECIPROCAL_PI2 0.15915494\n\nvoid main() {\n\tgl_FragColor = vec4(0.0);\n\tvec3 outputDirection = normalize(vOutputDirection);\n\tvec2 uv;\n\tuv.y = asin(clamp(outputDirection.y, -1.0, 1.0)) * RECIPROCAL_PI + 0.5;\n\tuv.x = atan(outputDirection.z, outputDirection.x) * RECIPROCAL_PI2 + 0.5;\n\tvec2 f = fract(uv / texelSize - 0.5);\n\tuv -= f * texelSize;\n\tvec3 tl = envMapTexelToLinear(texture2D(envMap, uv)).rgb;\n\tuv.x += texelSize.x;\n\tvec3 tr = envMapTexelToLinear(texture2D(envMap, uv)).rgb;\n\tuv.y += texelSize.y;\n\tvec3 br = envMapTexelToLinear(texture2D(envMap, uv)).rgb;\n\tuv.x -= texelSize.x;\n\tvec3 bl = envMapTexelToLinear(texture2D(envMap, uv)).rgb;\n\tvec3 tm = mix(tl, tr, f.x);\n\tvec3 bm = mix(bl, br, f.x);\n\tgl_FragColor.rgb = mix(tm, bm, f.y);\n\tgl_FragColor = linearToOutputTexel(gl_FragColor);\n}\n\t\t`,
        blending: 0,
        depthTest: !1,
        depthWrite: !1
    });
    return e.type = "EquirectangularToCubeUV", e
}

function tu() {
    var e = new Ma({
        uniforms: {
            envMap: {
                value: null
            },
            inputEncoding: {
                value: Ol[3e3]
            },
            outputEncoding: {
                value: Ol[3e3]
            }
        },
        vertexShader: nu(),
        fragmentShader: `\nprecision mediump float;\nprecision mediump int;\nvarying vec3 vOutputDirection;\nuniform samplerCube envMap;\n\n${ru()}\n\nvoid main() {\n\tgl_FragColor = vec4(0.0);\n\tgl_FragColor.rgb = envMapTexelToLinear(textureCube(envMap, vec3( - vOutputDirection.x, vOutputDirection.yz ))).rgb;\n\tgl_FragColor = linearToOutputTexel(gl_FragColor);\n}\n\t\t`,
        blending: 0,
        depthTest: !1,
        depthWrite: !1
    });
    return e.type = "CubemapToCubeUV", e
}

function nu() {
    return "\nprecision mediump float;\nprecision mediump int;\nattribute vec3 position;\nattribute vec2 uv;\nattribute float faceIndex;\nvarying vec3 vOutputDirection;\nvec3 getDirection(vec2 uv, float face) {\n\tuv = 2.0 * uv - 1.0;\n\tvec3 direction = vec3(uv, 1.0);\n\tif (face == 0.0) {\n\t\tdirection = direction.zyx;\n\t\tdirection.z *= -1.0;\n\t} else if (face == 1.0) {\n\t\tdirection = direction.xzy;\n\t\tdirection.z *= -1.0;\n\t} else if (face == 3.0) {\n\t\tdirection = direction.zyx;\n\t\tdirection.x *= -1.0;\n\t} else if (face == 4.0) {\n\t\tdirection = direction.xzy;\n\t\tdirection.y *= -1.0;\n\t} else if (face == 5.0) {\n\t\tdirection.xz *= -1.0;\n\t}\n\treturn direction;\n}\nvoid main() {\n\tvOutputDirection = getDirection(uv, faceIndex);\n\tgl_Position = vec4( position, 1.0 );\n}\n\t"
}

function ru() {
    return "\nuniform int inputEncoding;\nuniform int outputEncoding;\n\n#include <encodings_pars_fragment>\n\nvec4 inputTexelToLinear(vec4 value){\n\tif(inputEncoding == 0){\n\t\treturn value;\n\t}else if(inputEncoding == 1){\n\t\treturn sRGBToLinear(value);\n\t}else if(inputEncoding == 2){\n\t\treturn RGBEToLinear(value);\n\t}else if(inputEncoding == 3){\n\t\treturn RGBMToLinear(value, 7.0);\n\t}else if(inputEncoding == 4){\n\t\treturn RGBMToLinear(value, 16.0);\n\t}else if(inputEncoding == 5){\n\t\treturn RGBDToLinear(value, 256.0);\n\t}else{\n\t\treturn GammaToLinear(value, 2.2);\n\t}\n}\n\nvec4 linearToOutputTexel(vec4 value){\n\tif(outputEncoding == 0){\n\t\treturn value;\n\t}else if(outputEncoding == 1){\n\t\treturn LinearTosRGB(value);\n\t}else if(outputEncoding == 2){\n\t\treturn LinearToRGBE(value);\n\t}else if(outputEncoding == 3){\n\t\treturn LinearToRGBM(value, 7.0);\n\t}else if(outputEncoding == 4){\n\t\treturn LinearToRGBM(value, 16.0);\n\t}else if(outputEncoding == 5){\n\t\treturn LinearToRGBD(value, 256.0);\n\t}else{\n\t\treturn LinearToGamma(value, 2.2);\n\t}\n}\n\nvec4 envMapTexelToLinear(vec4 color) {\n\treturn inputTexelToLinear(color);\n}\n\t"
}
Wl.prototype = {
    constructor: Wl,
    fromScene: function(e, t = 0, n = .1, r = 100) {
        var i = Xl();
        return function(e, t, n, r) {
            var i = new Jt(90, 1, t, n),
                o = [1, 1, 1, 1, -1, 1],
                a = [1, 1, -1, -1, -1, 1],
                s = Gl.outputEncoding,
                c = Gl.toneMapping,
                l = Gl.toneMappingExposure,
                u = Gl.getClearColor(),
                h = Gl.getClearAlpha();
            Gl.toneMapping = 1, Gl.toneMappingExposure = 1, Gl.outputEncoding = 3e3, e.scale.z *= -1;
            var p = e.background;
            if (p && p.isColor) {
                p.convertSRGBToLinear();
                var d = Math.max(p.r, p.g, p.b),
                    f = Math.min(Math.max(Math.ceil(Math.log2(d)), -128), 127);
                p = p.multiplyScalar(Math.pow(2, -f));
                var m = (f + 128) / 255;
                Gl.setClearColor(p, m), e.background = null
            }
            Gl.setRenderTarget(r);
            for (var v = 0; v < 6; v++) {
                var g = v % 3;
                0 == g ? (i.up.set(0, o[v], 0), i.lookAt(a[v], 0, 0)) : 1 == g ? (i.up.set(0, 0, o[v]), i.lookAt(0, a[v], 0)) : (i.up.set(0, o[v], 0), i.lookAt(0, 0, a[v])), Jl(g * Rl, v > 2 ? Rl : 0, Rl, Rl), Gl.render(e, i)
            }
            Gl.toneMapping = c, Gl.toneMappingExposure = l, Gl.outputEncoding = s, Gl.setClearColor(u, h), e.scale.z *= -1
        }(e, n, r, i), t > 0 && Ql(i, 0, 0, t), Kl(i), ql(), i.scissorTest = !1, i
    },
    fromEquirectangular: function(e) {
        return e.magFilter = 1003, e.minFilter = 1003, e.generateMipmaps = !1, this.fromCubemap(e)
    },
    fromCubemap: function(e) {
        var t = Xl(e);
        return function(e, t) {
            var n = new ee;
            e.isCubeTexture ? null == Fl && (Fl = tu()) : null == Dl && (Dl = eu());
            var r = e.isCubeTexture ? Fl : Dl;
            n.add(new Ft(zl[0], r));
            var i = r.uniforms;
            i.envMap.value = e, e.isCubeTexture || i.texelSize.value.set(1 / e.image.width, 1 / e.image.height);
            i.inputEncoding.value = Ol[e.encoding], i.outputEncoding.value = Ol[e.encoding], Gl.setRenderTarget(t), Jl(0, 0, 3 * Rl, 2 * Rl), Gl.render(n, Il)
        }(e, t), Kl(t), ql(), t.scissorTest = !1, t
    },
    compileCubemapShader: function() {
        null == Fl && Yl(Fl = tu())
    },
    compileEquirectangularShader: function() {
        null == Dl && Yl(Dl = eu())
    },
    dispose: function() {
        Nl.dispose(), null != Fl && Fl.dispose(), null != Dl && Dl.dispose();
        for (var e = 0; e < zl.length; e++) zl[e].dispose()
    }
};

function iu(e) {
    console.warn("THREE.Spline has been removed. Use THREE.CatmullRomCurve3 instead."), fs.call(this, e), this.type = "catmullrom"
}
as.create = function(e, t) {
    return console.log("THREE.Curve.create() has been deprecated"), e.prototype = Object.create(as.prototype), e.prototype.constructor = e, e.prototype.getPoint = t, e
}, Object.assign(Ts.prototype, {
    createPointsGeometry: function(e) {
        console.warn("THREE.CurvePath: .createPointsGeometry() has been removed. Use new THREE.Geometry().setFromPoints( points ) instead.");
        var t = this.getPoints(e);
        return this.createGeometry(t)
    },
    createSpacedPointsGeometry: function(e) {
        console.warn("THREE.CurvePath: .createSpacedPointsGeometry() has been removed. Use new THREE.Geometry().setFromPoints( points ) instead.");
        var t = this.getSpacedPoints(e);
        return this.createGeometry(t)
    },
    createGeometry: function(e) {
        console.warn("THREE.CurvePath: .createGeometry() has been removed. Use new THREE.Geometry().setFromPoints( points ) instead.");
        for (var t = new jt, n = 0, r = e.length; n < r; n++) {
            var i = e[n];
            t.vertices.push(new y(i.x, i.y, i.z || 0))
        }
        return t
    }
}), Object.assign(As.prototype, {
    fromPoints: function(e) {
        return console.warn("THREE.Path: .fromPoints() has been renamed to .setFromPoints()."), this.setFromPoints(e)
    }
}), Object.create(fs.prototype), Object.create(fs.prototype), iu.prototype = Object.create(fs.prototype), Object.assign(iu.prototype, {
    initFromArray: function() {
        console.error("THREE.Spline: .initFromArray() has been removed.")
    },
    getControlPointsArray: function() {
        console.error("THREE.Spline: .getControlPointsArray() has been removed.")
    },
    reparametrizeByArcLength: function() {
        console.error("THREE.Spline: .reparametrizeByArcLength() has been removed.")
    }
}), al.prototype.setColors = function() {
    console.error("THREE.GridHelper: setColors() has been deprecated, pass them in the constructor instead.")
}, el.prototype.update = function() {
    console.error("THREE.SkeletonHelper: update() no longer needs to be called.")
}, Object.assign(Ka.prototype, {
    extractUrlBase: function(e) {
        return console.warn("THREE.Loader: .extractUrlBase() has been deprecated. Use THREE.LoaderUtils.extractUrlBase() instead."), js(e)
    }
}), Ka.Handlers = {
    add: function() {
        console.error("THREE.Loader: Handlers.add() has been removed. Use LoadingManager.addHandler() instead.")
    },
    get: function() {
        console.error("THREE.Loader: Handlers.get() has been removed. Use LoadingManager.getHandler() instead.")
    }
}, Object.assign(Ys.prototype, {
    setTexturePath: function(e) {
        return console.warn("THREE.ObjectLoader: .setTexturePath() has been renamed to .setResourcePath()."), this.setResourcePath(e)
    }
}), Object.assign(Vc.prototype, {
    center: function(e) {
        return console.warn("THREE.Box2: .center() has been renamed to .getCenter()."), this.getCenter(e)
    },
    empty: function() {
        return console.warn("THREE.Box2: .empty() has been renamed to .isEmpty()."), this.isEmpty()
    },
    isIntersectionBox: function(e) {
        return console.warn("THREE.Box2: .isIntersectionBox() has been renamed to .intersectsBox()."), this.intersectsBox(e)
    },
    size: function(e) {
        return console.warn("THREE.Box2: .size() has been renamed to .getSize()."), this.getSize(e)
    }
}), Object.assign(fe.prototype, {
    center: function(e) {
        return console.warn("THREE.Box3: .center() has been renamed to .getCenter()."), this.getCenter(e)
    },
    empty: function() {
        return console.warn("THREE.Box3: .empty() has been renamed to .isEmpty()."), this.isEmpty()
    },
    isIntersectionBox: function(e) {
        return console.warn("THREE.Box3: .isIntersectionBox() has been renamed to .intersectsBox()."), this.intersectsBox(e)
    },
    isIntersectionSphere: function(e) {
        return console.warn("THREE.Box3: .isIntersectionSphere() has been renamed to .intersectsSphere()."), this.intersectsSphere(e)
    },
    size: function(e) {
        return console.warn("THREE.Box3: .size() has been renamed to .getSize()."), this.getSize(e)
    }
}), qc.prototype.center = function(e) {
    return console.warn("THREE.Line3: .center() has been renamed to .getCenter()."), this.getCenter(e)
}, Object.assign(d, {
    random16: function() {
        return console.warn("THREE.Math: .random16() has been deprecated. Use Math.random() instead."), Math.random()
    },
    nearestPowerOfTwo: function(e) {
        return console.warn("THREE.Math: .nearestPowerOfTwo() has been renamed to .floorPowerOfTwo()."), d.floorPowerOfTwo(e)
    },
    nextPowerOfTwo: function(e) {
        return console.warn("THREE.Math: .nextPowerOfTwo() has been renamed to .ceilPowerOfTwo()."), d.ceilPowerOfTwo(e)
    }
}), Object.assign(b.prototype, {
    flattenToArrayOffset: function(e, t) {
        return console.warn("THREE.Matrix3: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."), this.toArray(e, t)
    },
    multiplyVector3: function(e) {
        return console.warn("THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead."), e.applyMatrix3(this)
    },
    multiplyVector3Array: function() {
        console.error("THREE.Matrix3: .multiplyVector3Array() has been removed.")
    },
    applyToBuffer: function(e) {
        return console.warn("THREE.Matrix3: .applyToBuffer() has been removed. Use matrix.applyToBufferAttribute( attribute ) instead."), this.applyToBufferAttribute(e)
    },
    applyToVector3Array: function() {
        console.error("THREE.Matrix3: .applyToVector3Array() has been removed.")
    }
}), Object.assign(D.prototype, {
    extractPosition: function(e) {
        return console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."), this.copyPosition(e)
    },
    flattenToArrayOffset: function(e, t) {
        return console.warn("THREE.Matrix4: .flattenToArrayOffset() has been deprecated. Use .toArray() instead."), this.toArray(e, t)
    },
    getPosition: function() {
        return console.warn("THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead."), (new y).setFromMatrixColumn(this, 3)
    },
    setRotationFromQuaternion: function(e) {
        return console.warn("THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion()."), this.makeRotationFromQuaternion(e)
    },
    multiplyToArray: function() {
        console.warn("THREE.Matrix4: .multiplyToArray() has been removed.")
    },
    multiplyVector3: function(e) {
        return console.warn("THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) instead."), e.applyMatrix4(this)
    },
    multiplyVector4: function(e) {
        return console.warn("THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead."), e.applyMatrix4(this)
    },
    multiplyVector3Array: function() {
        console.error("THREE.Matrix4: .multiplyVector3Array() has been removed.")
    },
    rotateAxis: function(e) {
        console.warn("THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead."), e.transformDirection(this)
    },
    crossVector: function(e) {
        return console.warn("THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead."), e.applyMatrix4(this)
    },
    translate: function() {
        console.error("THREE.Matrix4: .translate() has been removed.")
    },
    rotateX: function() {
        console.error("THREE.Matrix4: .rotateX() has been removed.")
    },
    rotateY: function() {
        console.error("THREE.Matrix4: .rotateY() has been removed.")
    },
    rotateZ: function() {
        console.error("THREE.Matrix4: .rotateZ() has been removed.")
    },
    rotateByAxis: function() {
        console.error("THREE.Matrix4: .rotateByAxis() has been removed.")
    },
    applyToBuffer: function(e) {
        return console.warn("THREE.Matrix4: .applyToBuffer() has been removed. Use matrix.applyToBufferAttribute( attribute ) instead."), this.applyToBufferAttribute(e)
    },
    applyToVector3Array: function() {
        console.error("THREE.Matrix4: .applyToVector3Array() has been removed.")
    },
    makeFrustum: function(e, t, n, r, i, o) {
        return console.warn("THREE.Matrix4: .makeFrustum() has been removed. Use .makePerspective( left, right, top, bottom, near, far ) instead."), this.makePerspective(e, t, r, n, i, o)
    }
}), Re.prototype.isIntersectionLine = function(e) {
    return console.warn("THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine()."), this.intersectsLine(e)
}, m.prototype.multiplyVector3 = function(e) {
    return console.warn("THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead."), e.applyQuaternion(this)
}, Object.assign(Ee.prototype, {
    isIntersectionBox: function(e) {
        return console.warn("THREE.Ray: .isIntersectionBox() has been renamed to .intersectsBox()."), this.intersectsBox(e)
    },
    isIntersectionPlane: function(e) {
        return console.warn("THREE.Ray: .isIntersectionPlane() has been renamed to .intersectsPlane()."), this.intersectsPlane(e)
    },
    isIntersectionSphere: function(e) {
        return console.warn("THREE.Ray: .isIntersectionSphere() has been renamed to .intersectsSphere()."), this.intersectsSphere(e)
    }
}), Object.assign(ke.prototype, {
    area: function() {
        return console.warn("THREE.Triangle: .area() has been renamed to .getArea()."), this.getArea()
    },
    barycoordFromPoint: function(e, t) {
        return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."), this.getBarycoord(e, t)
    },
    midpoint: function(e) {
        return console.warn("THREE.Triangle: .midpoint() has been renamed to .getMidpoint()."), this.getMidpoint(e)
    },
    normal: function(e) {
        return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."), this.getNormal(e)
    },
    plane: function(e) {
        return console.warn("THREE.Triangle: .plane() has been renamed to .getPlane()."), this.getPlane(e)
    }
}), Object.assign(ke, {
    barycoordFromPoint: function(e, t, n, r, i) {
        return console.warn("THREE.Triangle: .barycoordFromPoint() has been renamed to .getBarycoord()."), ke.getBarycoord(e, t, n, r, i)
    },
    normal: function(e, t, n, r) {
        return console.warn("THREE.Triangle: .normal() has been renamed to .getNormal()."), ke.getNormal(e, t, n, r)
    }
}), Object.assign(Ls.prototype, {
    extractAllPoints: function(e) {
        return console.warn("THREE.Shape: .extractAllPoints() has been removed. Use .extractPoints() instead."), this.extractPoints(e)
    },
    extrude: function(e) {
        return console.warn("THREE.Shape: .extrude() has been removed. Use ExtrudeGeometry() instead."), new $o(this, e)
    },
    makeGeometry: function(e) {
        return console.warn("THREE.Shape: .makeGeometry() has been removed. Use ShapeGeometry() instead."), new ha(this, e)
    }
}), Object.assign(f.prototype, {
    fromAttribute: function(e, t, n) {
        return console.warn("THREE.Vector2: .fromAttribute() has been renamed to .fromBufferAttribute()."), this.fromBufferAttribute(e, t, n)
    },
    distanceToManhattan: function(e) {
        return console.warn("THREE.Vector2: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."), this.manhattanDistanceTo(e)
    },
    lengthManhattan: function() {
        return console.warn("THREE.Vector2: .lengthManhattan() has been renamed to .manhattanLength()."), this.manhattanLength()
    }
}), Object.assign(y.prototype, {
    setEulerFromRotationMatrix: function() {
        console.error("THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.")
    },
    setEulerFromQuaternion: function() {
        console.error("THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.")
    },
    getPositionFromMatrix: function(e) {
        return console.warn("THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition()."), this.setFromMatrixPosition(e)
    },
    getScaleFromMatrix: function(e) {
        return console.warn("THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale()."), this.setFromMatrixScale(e)
    },
    getColumnFromMatrix: function(e, t) {
        return console.warn("THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn()."), this.setFromMatrixColumn(t, e)
    },
    applyProjection: function(e) {
        return console.warn("THREE.Vector3: .applyProjection() has been removed. Use .applyMatrix4( m ) instead."), this.applyMatrix4(e)
    },
    fromAttribute: function(e, t, n) {
        return console.warn("THREE.Vector3: .fromAttribute() has been renamed to .fromBufferAttribute()."), this.fromBufferAttribute(e, t, n)
    },
    distanceToManhattan: function(e) {
        return console.warn("THREE.Vector3: .distanceToManhattan() has been renamed to .manhattanDistanceTo()."), this.manhattanDistanceTo(e)
    },
    lengthManhattan: function() {
        return console.warn("THREE.Vector3: .lengthManhattan() has been renamed to .manhattanLength()."), this.manhattanLength()
    }
}), Object.assign(E.prototype, {
    fromAttribute: function(e, t, n) {
        return console.warn("THREE.Vector4: .fromAttribute() has been renamed to .fromBufferAttribute()."), this.fromBufferAttribute(e, t, n)
    },
    lengthManhattan: function() {
        return console.warn("THREE.Vector4: .lengthManhattan() has been renamed to .manhattanLength()."), this.manhattanLength()
    }
}), Object.assign(jt.prototype, {
    computeTangents: function() {
        console.error("THREE.Geometry: .computeTangents() has been removed.")
    },
    computeLineDistances: function() {
        console.error("THREE.Geometry: .computeLineDistances() has been removed. Use THREE.Line.computeLineDistances() instead.")
    }
}), Object.assign($.prototype, {
    getChildByName: function(e) {
        return console.warn("THREE.Object3D: .getChildByName() has been renamed to .getObjectByName()."), this.getObjectByName(e)
    },
    renderDepth: function() {
        console.warn("THREE.Object3D: .renderDepth has been removed. Use .renderOrder, instead.")
    },
    translate: function(e, t) {
        return console.warn("THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead."), this.translateOnAxis(t, e)
    },
    getWorldRotation: function() {
        console.error("THREE.Object3D: .getWorldRotation() has been removed. Use THREE.Object3D.getWorldQuaternion( target ) instead.")
    }
}), Object.defineProperties($.prototype, {
    eulerOrder: {
        get: function() {
            return console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."), this.rotation.order
        },
        set: function(e) {
            console.warn("THREE.Object3D: .eulerOrder is now .rotation.order."), this.rotation.order = e
        }
    },
    useQuaternion: {
        get: function() {
            console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")
        },
        set: function() {
            console.warn("THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.")
        }
    }
}), Object.assign(Ft.prototype, {
    setDrawMode: function() {
        console.error("THREE.Mesh: .setDrawMode() has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")
    }
}), Object.defineProperties(Ft.prototype, {
    drawMode: {
        get: function() {
            return console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode."), 0
        },
        set: function() {
            console.error("THREE.Mesh: .drawMode has been removed. The renderer now always assumes THREE.TrianglesDrawMode. Transform your geometry via BufferGeometryUtils.toTrianglesDrawMode() if necessary.")
        }
    }
}), Object.defineProperties(Ri.prototype, {
    objects: {
        get: function() {
            return console.warn("THREE.LOD: .objects has been renamed to .levels."), this.levels
        }
    }
}), Object.defineProperty(Ii.prototype, "useVertexTexture", {
    get: function() {
        console.warn("THREE.Skeleton: useVertexTexture has been removed.")
    },
    set: function() {
        console.warn("THREE.Skeleton: useVertexTexture has been removed.")
    }
}), Pi.prototype.initBones = function() {
    console.error("THREE.SkinnedMesh: initBones() has been removed.")
}, Object.defineProperty(as.prototype, "__arcLengthDivisions", {
    get: function() {
        return console.warn("THREE.Curve: .__arcLengthDivisions is now .arcLengthDivisions."), this.arcLengthDivisions
    },
    set: function(e) {
        console.warn("THREE.Curve: .__arcLengthDivisions is now .arcLengthDivisions."), this.arcLengthDivisions = e
    }
}), Jt.prototype.setLens = function(e, t) {
    console.warn("THREE.PerspectiveCamera.setLens is deprecated. Use .setFocalLength and .filmGauge for a photographic setup."), void 0 !== t && (this.filmGauge = t), this.setFocalLength(e)
}, Object.defineProperties(Rs.prototype, {
    onlyShadow: {
        set: function() {
            console.warn("THREE.Light: .onlyShadow has been removed.")
        }
    },
    shadowCameraFov: {
        set: function(e) {
            console.warn("THREE.Light: .shadowCameraFov is now .shadow.camera.fov."), this.shadow.camera.fov = e
        }
    },
    shadowCameraLeft: {
        set: function(e) {
            console.warn("THREE.Light: .shadowCameraLeft is now .shadow.camera.left."), this.shadow.camera.left = e
        }
    },
    shadowCameraRight: {
        set: function(e) {
            console.warn("THREE.Light: .shadowCameraRight is now .shadow.camera.right."), this.shadow.camera.right = e
        }
    },
    shadowCameraTop: {
        set: function(e) {
            console.warn("THREE.Light: .shadowCameraTop is now .shadow.camera.top."), this.shadow.camera.top = e
        }
    },
    shadowCameraBottom: {
        set: function(e) {
            console.warn("THREE.Light: .shadowCameraBottom is now .shadow.camera.bottom."), this.shadow.camera.bottom = e
        }
    },
    shadowCameraNear: {
        set: function(e) {
            console.warn("THREE.Light: .shadowCameraNear is now .shadow.camera.near."), this.shadow.camera.near = e
        }
    },
    shadowCameraFar: {
        set: function(e) {
            console.warn("THREE.Light: .shadowCameraFar is now .shadow.camera.far."), this.shadow.camera.far = e
        }
    },
    shadowCameraVisible: {
        set: function() {
            console.warn("THREE.Light: .shadowCameraVisible has been removed. Use new THREE.CameraHelper( light.shadow.camera ) instead.")
        }
    },
    shadowBias: {
        set: function(e) {
            console.warn("THREE.Light: .shadowBias is now .shadow.bias."), this.shadow.bias = e
        }
    },
    shadowDarkness: {
        set: function() {
            console.warn("THREE.Light: .shadowDarkness has been removed.")
        }
    },
    shadowMapWidth: {
        set: function(e) {
            console.warn("THREE.Light: .shadowMapWidth is now .shadow.mapSize.width."), this.shadow.mapSize.width = e
        }
    },
    shadowMapHeight: {
        set: function(e) {
            console.warn("THREE.Light: .shadowMapHeight is now .shadow.mapSize.height."), this.shadow.mapSize.height = e
        }
    }
}), Object.defineProperties($e.prototype, {
    length: {
        get: function() {
            return console.warn("THREE.BufferAttribute: .length has been deprecated. Use .count instead."), this.array.length
        }
    },
    dynamic: {
        get: function() {
            return console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."), 35048 === this.usage
        },
        set: function() {
            console.warn("THREE.BufferAttribute: .dynamic has been deprecated. Use .usage instead."), this.setUsage(35048)
        }
    }
}), Object.assign($e.prototype, {
    setDynamic: function(e) {
        return console.warn("THREE.BufferAttribute: .setDynamic() has been deprecated. Use .setUsage() instead."), this.setUsage(!0 === e ? 35048 : 35044), this
    },
    copyIndicesArray: function() {
        console.error("THREE.BufferAttribute: .copyIndicesArray() has been removed.")
    },
    setArray: function() {
        console.error("THREE.BufferAttribute: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")
    }
}), Object.assign(yt.prototype, {
    addIndex: function(e) {
        console.warn("THREE.BufferGeometry: .addIndex() has been renamed to .setIndex()."), this.setIndex(e)
    },
    addAttribute: function(e, t) {
        return console.warn("THREE.BufferGeometry: .addAttribute() has been renamed to .setAttribute()."), t && t.isBufferAttribute || t && t.isInterleavedBufferAttribute ? "index" === e ? (console.warn("THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute."), this.setIndex(t), this) : this.setAttribute(e, t) : (console.warn("THREE.BufferGeometry: .addAttribute() now expects ( name, attribute )."), this.setAttribute(e, new $e(arguments[1], arguments[2])))
    },
    addDrawCall: function(e, t, n) {
        void 0 !== n && console.warn("THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset."), console.warn("THREE.BufferGeometry: .addDrawCall() is now .addGroup()."), this.addGroup(e, t)
    },
    clearDrawCalls: function() {
        console.warn("THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups()."), this.clearGroups()
    },
    computeTangents: function() {
        console.warn("THREE.BufferGeometry: .computeTangents() has been removed.")
    },
    computeOffsets: function() {
        console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.")
    },
    removeAttribute: function(e) {
        return console.warn("THREE.BufferGeometry: .removeAttribute() has been renamed to .deleteAttribute()."), this.deleteAttribute(e)
    }
}), Object.defineProperties(yt.prototype, {
    drawcalls: {
        get: function() {
            return console.error("THREE.BufferGeometry: .drawcalls has been renamed to .groups."), this.groups
        }
    },
    offsets: {
        get: function() {
            return console.warn("THREE.BufferGeometry: .offsets has been renamed to .groups."), this.groups
        }
    }
}), Object.defineProperties(ci.prototype, {
    dynamic: {
        get: function() {
            return console.warn("THREE.InterleavedBuffer: .length has been deprecated. Use .usage instead."), 35048 === this.usage
        },
        set: function(e) {
            console.warn("THREE.InterleavedBuffer: .length has been deprecated. Use .usage instead."), this.setUsage(e)
        }
    }
}), Object.assign(ci.prototype, {
    setDynamic: function(e) {
        return console.warn("THREE.InterleavedBuffer: .setDynamic() has been deprecated. Use .setUsage() instead."), this.setUsage(!0 === e ? 35048 : 35044), this
    },
    setArray: function() {
        console.error("THREE.InterleavedBuffer: .setArray has been removed. Use BufferGeometry .setAttribute to replace/resize attribute buffers")
    }
}), Object.assign(ea.prototype, {
    getArrays: function() {
        console.error("THREE.ExtrudeBufferGeometry: .getArrays() has been removed.")
    },
    addShapeList: function() {
        console.error("THREE.ExtrudeBufferGeometry: .addShapeList() has been removed.")
    },
    addShape: function() {
        console.error("THREE.ExtrudeBufferGeometry: .addShape() has been removed.")
    }
}), Object.defineProperties(Uc.prototype, {
    dynamic: {
        set: function() {
            console.warn("THREE.Uniform: .dynamic has been removed. Use object.onBeforeRender() instead.")
        }
    },
    onUpdate: {
        value: function() {
            return console.warn("THREE.Uniform: .onUpdate() has been removed. Use object.onBeforeRender() instead."), this
        }
    }
}), Object.defineProperties(Je.prototype, {
    wrapAround: {
        get: function() {
            console.warn("THREE.Material: .wrapAround has been removed.")
        },
        set: function() {
            console.warn("THREE.Material: .wrapAround has been removed.")
        }
    },
    overdraw: {
        get: function() {
            console.warn("THREE.Material: .overdraw has been removed.")
        },
        set: function() {
            console.warn("THREE.Material: .overdraw has been removed.")
        }
    },
    wrapRGB: {
        get: function() {
            return console.warn("THREE.Material: .wrapRGB has been removed."), new Ve
        }
    },
    shading: {
        get: function() {
            console.error("THREE." + this.type + ": .shading has been removed. Use the boolean .flatShading instead.")
        },
        set: function(e) {
            console.warn("THREE." + this.type + ": .shading has been removed. Use the boolean .flatShading instead."), this.flatShading = 1 === e
        }
    },
    stencilMask: {
        get: function() {
            return console.warn("THREE." + this.type + ": .stencilMask has been removed. Use .stencilFuncMask instead."), this.stencilFuncMask
        },
        set: function(e) {
            console.warn("THREE." + this.type + ": .stencilMask has been removed. Use .stencilFuncMask instead."), this.stencilFuncMask = e
        }
    }
}), Object.defineProperties(Ta.prototype, {
    metal: {
        get: function() {
            return console.warn("THREE.MeshPhongMaterial: .metal has been removed. Use THREE.MeshStandardMaterial instead."), !1
        },
        set: function() {
            console.warn("THREE.MeshPhongMaterial: .metal has been removed. Use THREE.MeshStandardMaterial instead")
        }
    }
}), Object.defineProperties(Yt.prototype, {
    derivatives: {
        get: function() {
            return console.warn("THREE.ShaderMaterial: .derivatives has been moved to .extensions.derivatives."), this.extensions.derivatives
        },
        set: function(e) {
            console.warn("THREE. ShaderMaterial: .derivatives has been moved to .extensions.derivatives."), this.extensions.derivatives = e
        }
    }
}), Object.assign(oi.prototype, {
    clearTarget: function(e, t, n, r) {
        console.warn("THREE.WebGLRenderer: .clearTarget() has been deprecated. Use .setRenderTarget() and .clear() instead."), this.setRenderTarget(e), this.clear(t, n, r)
    },
    animate: function(e) {
        console.warn("THREE.WebGLRenderer: .animate() is now .setAnimationLoop()."), this.setAnimationLoop(e)
    },
    getCurrentRenderTarget: function() {
        return console.warn("THREE.WebGLRenderer: .getCurrentRenderTarget() is now .getRenderTarget()."), this.getRenderTarget()
    },
    getMaxAnisotropy: function() {
        return console.warn("THREE.WebGLRenderer: .getMaxAnisotropy() is now .capabilities.getMaxAnisotropy()."), this.capabilities.getMaxAnisotropy()
    },
    getPrecision: function() {
        return console.warn("THREE.WebGLRenderer: .getPrecision() is now .capabilities.precision."), this.capabilities.precision
    },
    resetGLState: function() {
        return console.warn("THREE.WebGLRenderer: .resetGLState() is now .state.reset()."), this.state.reset()
    },
    supportsFloatTextures: function() {
        return console.warn("THREE.WebGLRenderer: .supportsFloatTextures() is now .extensions.get( 'OES_texture_float' )."), this.extensions.get("OES_texture_float")
    },
    supportsHalfFloatTextures: function() {
        return console.warn("THREE.WebGLRenderer: .supportsHalfFloatTextures() is now .extensions.get( 'OES_texture_half_float' )."), this.extensions.get("OES_texture_half_float")
    },
    supportsStandardDerivatives: function() {
        return console.warn("THREE.WebGLRenderer: .supportsStandardDerivatives() is now .extensions.get( 'OES_standard_derivatives' )."), this.extensions.get("OES_standard_derivatives")
    },
    supportsCompressedTextureS3TC: function() {
        return console.warn("THREE.WebGLRenderer: .supportsCompressedTextureS3TC() is now .extensions.get( 'WEBGL_compressed_texture_s3tc' )."), this.extensions.get("WEBGL_compressed_texture_s3tc")
    },
    supportsCompressedTexturePVRTC: function() {
        return console.warn("THREE.WebGLRenderer: .supportsCompressedTexturePVRTC() is now .extensions.get( 'WEBGL_compressed_texture_pvrtc' )."), this.extensions.get("WEBGL_compressed_texture_pvrtc")
    },
    supportsBlendMinMax: function() {
        return console.warn("THREE.WebGLRenderer: .supportsBlendMinMax() is now .extensions.get( 'EXT_blend_minmax' )."), this.extensions.get("EXT_blend_minmax")
    },
    supportsVertexTextures: function() {
        return console.warn("THREE.WebGLRenderer: .supportsVertexTextures() is now .capabilities.vertexTextures."), this.capabilities.vertexTextures
    },
    supportsInstancedArrays: function() {
        return console.warn("THREE.WebGLRenderer: .supportsInstancedArrays() is now .extensions.get( 'ANGLE_instanced_arrays' )."), this.extensions.get("ANGLE_instanced_arrays")
    },
    enableScissorTest: function(e) {
        console.warn("THREE.WebGLRenderer: .enableScissorTest() is now .setScissorTest()."), this.setScissorTest(e)
    },
    initMaterial: function() {
        console.warn("THREE.WebGLRenderer: .initMaterial() has been removed.")
    },
    addPrePlugin: function() {
        console.warn("THREE.WebGLRenderer: .addPrePlugin() has been removed.")
    },
    addPostPlugin: function() {
        console.warn("THREE.WebGLRenderer: .addPostPlugin() has been removed.")
    },
    updateShadowMap: function() {
        console.warn("THREE.WebGLRenderer: .updateShadowMap() has been removed.")
    },
    setFaceCulling: function() {
        console.warn("THREE.WebGLRenderer: .setFaceCulling() has been removed.")
    },
    allocTextureUnit: function() {
        console.warn("THREE.WebGLRenderer: .allocTextureUnit() has been removed.")
    },
    setTexture: function() {
        console.warn("THREE.WebGLRenderer: .setTexture() has been removed.")
    },
    setTexture2D: function() {
        console.warn("THREE.WebGLRenderer: .setTexture2D() has been removed.")
    },
    setTextureCube: function() {
        console.warn("THREE.WebGLRenderer: .setTextureCube() has been removed.")
    },
    getActiveMipMapLevel: function() {
        return console.warn("THREE.WebGLRenderer: .getActiveMipMapLevel() is now .getActiveMipmapLevel()."), this.getActiveMipmapLevel()
    }
}), Object.defineProperties(oi.prototype, {
    shadowMapEnabled: {
        get: function() {
            return this.shadowMap.enabled
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled."), this.shadowMap.enabled = e
        }
    },
    shadowMapType: {
        get: function() {
            return this.shadowMap.type
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type."), this.shadowMap.type = e
        }
    },
    shadowMapCullFace: {
        get: function() {
            console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")
        },
        set: function() {
            console.warn("THREE.WebGLRenderer: .shadowMapCullFace has been removed. Set Material.shadowSide instead.")
        }
    },
    context: {
        get: function() {
            return console.warn("THREE.WebGLRenderer: .context has been removed. Use .getContext() instead."), this.getContext()
        }
    },
    vr: {
        get: function() {
            return console.warn("THREE.WebGLRenderer: .vr has been renamed to .xr"), this.xr
        }
    },
    gammaInput: {
        get: function() {
            return console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead."), !1
        },
        set: function() {
            console.warn("THREE.WebGLRenderer: .gammaInput has been removed. Set the encoding for textures via Texture.encoding instead.")
        }
    },
    gammaOutput: {
        get: function() {
            return console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."), !1
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderer: .gammaOutput has been removed. Set WebGLRenderer.outputEncoding instead."), this.outputEncoding = !0 === e ? 3001 : 3e3
        }
    }
}), Object.defineProperties(Jr.prototype, {
    cullFace: {
        get: function() {
            console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")
        },
        set: function() {
            console.warn("THREE.WebGLRenderer: .shadowMap.cullFace has been removed. Set Material.shadowSide instead.")
        }
    },
    renderReverseSided: {
        get: function() {
            console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")
        },
        set: function() {
            console.warn("THREE.WebGLRenderer: .shadowMap.renderReverseSided has been removed. Set Material.shadowSide instead.")
        }
    },
    renderSingleSided: {
        get: function() {
            console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")
        },
        set: function() {
            console.warn("THREE.WebGLRenderer: .shadowMap.renderSingleSided has been removed. Set Material.shadowSide instead.")
        }
    }
}), Object.defineProperties(Qt.prototype, {
    activeCubeFace: {
        set: function() {
            console.warn("THREE.WebGLRenderTargetCube: .activeCubeFace has been removed. It is now the second parameter of WebGLRenderer.setRenderTarget().")
        }
    },
    activeMipMapLevel: {
        set: function() {
            console.warn("THREE.WebGLRenderTargetCube: .activeMipMapLevel has been removed. It is now the third parameter of WebGLRenderer.setRenderTarget().")
        }
    }
}), Object.defineProperties(T.prototype, {
    wrapS: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."), this.texture.wrapS
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .wrapS is now .texture.wrapS."), this.texture.wrapS = e
        }
    },
    wrapT: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."), this.texture.wrapT
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .wrapT is now .texture.wrapT."), this.texture.wrapT = e
        }
    },
    magFilter: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."), this.texture.magFilter
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .magFilter is now .texture.magFilter."), this.texture.magFilter = e
        }
    },
    minFilter: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."), this.texture.minFilter
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .minFilter is now .texture.minFilter."), this.texture.minFilter = e
        }
    },
    anisotropy: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."), this.texture.anisotropy
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .anisotropy is now .texture.anisotropy."), this.texture.anisotropy = e
        }
    },
    offset: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."), this.texture.offset
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .offset is now .texture.offset."), this.texture.offset = e
        }
    },
    repeat: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."), this.texture.repeat
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .repeat is now .texture.repeat."), this.texture.repeat = e
        }
    },
    format: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."), this.texture.format
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .format is now .texture.format."), this.texture.format = e
        }
    },
    type: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."), this.texture.type
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .type is now .texture.type."), this.texture.type = e
        }
    },
    generateMipmaps: {
        get: function() {
            return console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."), this.texture.generateMipmaps
        },
        set: function(e) {
            console.warn("THREE.WebGLRenderTarget: .generateMipmaps is now .texture.generateMipmaps."), this.texture.generateMipmaps = e
        }
    }
}), Object.defineProperties(yc.prototype, {
    load: {
        value: function(e) {
            console.warn("THREE.Audio: .load has been deprecated. Use THREE.AudioLoader instead.");
            var t = this;
            return (new oc).load(e, (function(e) {
                t.setBuffer(e)
            })), this
        }
    },
    startTime: {
        set: function() {
            console.warn("THREE.Audio: .startTime is now .play( delay ).")
        }
    }
}), Sc.prototype.getData = function() {
    return console.warn("THREE.AudioAnalyser: .getData() is now .getFrequencyData()."), this.getFrequencyData()
}, Kt.prototype.updateCubeMap = function(e, t) {
    return console.warn("THREE.CubeCamera: .updateCubeMap() is now .update()."), this.update(e, t)
};
w.crossOrigin = void 0, w.loadTexture = function(e, t, n, r) {
    console.warn("THREE.ImageUtils.loadTexture has been deprecated. Use THREE.TextureLoader() instead.");
    var i = new os;
    i.setCrossOrigin(this.crossOrigin);
    var o = i.load(e, n, void 0, r);
    return t && (o.mapping = t), o
}, w.loadTextureCube = function(e, t, n, r) {
    console.warn("THREE.ImageUtils.loadTextureCube has been deprecated. Use THREE.CubeTextureLoader() instead.");
    var i = new is;
    i.setCrossOrigin(this.crossOrigin);
    var o = i.load(e, n, void 0, r);
    return t && (o.mapping = t), o
}, w.loadCompressedTexture = function() {
    console.error("THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.")
}, w.loadCompressedTextureCube = function() {
    console.error("THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.")
};
"undefined" != typeof __THREE_DEVTOOLS__ && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", {
    detail: {
        revision: "112"
    }
}));
var ou = function() {
        function e(e) {
            Ka.call(this, e), this.dracoLoader = null, this.ddsLoader = null
        }

        function t() {
            var e = {};
            return {
                get: function(t) {
                    return e[t]
                },
                add: function(t, n) {
                    e[t] = n
                },
                remove: function(t) {
                    delete e[t]
                },
                removeAll: function() {
                    e = {}
                }
            }
        }
        e.prototype = Object.assign(Object.create(Ka.prototype), {
            constructor: e,
            load: function(e, t, n, r) {
                var i, o = this;
                i = "" !== this.resourcePath ? this.resourcePath : "" !== this.path ? this.path : js(e), o.manager.itemStart(e);
                var a = function(t) {
                        r ? r(t) : console.error(t), o.manager.itemError(e), o.manager.itemEnd(e)
                    },
                    s = new $a(o.manager);
                s.setPath(this.path), s.setResponseType("arraybuffer"), "use-credentials" === o.crossOrigin && s.setWithCredentials(!0), s.load(e, (function(n) {
                    try {
                        o.parse(n, i, (function(n) {
                            t(n), o.manager.itemEnd(e)
                        }), a)
                    } catch (e) {
                        a(e)
                    }
                }), n, a)
            },
            setDRACOLoader: function(e) {
                return this.dracoLoader = e, this
            },
            setDDSLoader: function(e) {
                return this.ddsLoader = e, this
            },
            parse: function(e, t, s, c) {
                var d, f = {};
                if ("string" == typeof e) d = e;
                else if (Hs(new Uint8Array(e, 0, 4)) === a) {
                    try {
                        f[n.KHR_BINARY_GLTF] = new l(e)
                    } catch (e) {
                        return void(c && c(e))
                    }
                    d = f[n.KHR_BINARY_GLTF].content
                } else d = Hs(new Uint8Array(e));
                var v = JSON.parse(d);
                if (void 0 === v.asset || v.asset.version[0] < 2) c && c(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
                else {
                    if (v.extensionsUsed)
                        for (var g = 0; g < v.extensionsUsed.length; ++g) {
                            var y = v.extensionsUsed[g],
                                x = v.extensionsRequired || [];
                            switch (y) {
                                case n.KHR_LIGHTS_PUNCTUAL:
                                    f[y] = new i(v);
                                    break;
                                case n.KHR_MATERIALS_UNLIT:
                                    f[y] = new o;
                                    break;
                                case n.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS:
                                    f[y] = new p;
                                    break;
                                case n.KHR_DRACO_MESH_COMPRESSION:
                                    f[y] = new u(v, this.dracoLoader);
                                    break;
                                case n.MSFT_TEXTURE_DDS:
                                    f[y] = new r(this.ddsLoader);
                                    break;
                                case n.KHR_TEXTURE_TRANSFORM:
                                    f[y] = new h;
                                    break;
                                case n.KHR_MESH_QUANTIZATION:
                                    f[y] = new m;
                                    break;
                                default:
                                    x.indexOf(y) >= 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + y + '".')
                            }
                        }
                    new H(v, f, {
                        path: t || this.resourcePath || "",
                        crossOrigin: this.crossOrigin,
                        manager: this.manager
                    }).parse(s, c)
                }
            }
        });
        var n = {
            KHR_BINARY_GLTF: "KHR_binary_glTF",
            KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
            KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
            KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: "KHR_materials_pbrSpecularGlossiness",
            KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
            KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
            KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
            MSFT_TEXTURE_DDS: "MSFT_texture_dds"
        };

        function r(e) {
            if (!e) throw new Error("THREE.GLTFLoader: Attempting to load .dds texture without importing DDSLoader");
            this.name = n.MSFT_TEXTURE_DDS, this.ddsLoader = e
        }

        function i(e) {
            this.name = n.KHR_LIGHTS_PUNCTUAL;
            var t = e.extensions && e.extensions[n.KHR_LIGHTS_PUNCTUAL] || {};
            this.lightDefs = t.lights || []
        }

        function o() {
            this.name = n.KHR_MATERIALS_UNLIT
        }
        i.prototype.loadLight = function(e) {
            var t, n = this.lightDefs[e],
                r = new Ve(16777215);
            void 0 !== n.color && r.fromArray(n.color);
            var i = void 0 !== n.range ? n.range : 0;
            switch (n.type) {
                case "directional":
                    (t = new Us(r)).target.position.set(0, 0, -1), t.add(t.target);
                    break;
                case "point":
                    (t = new Ds(r)).distance = i;
                    break;
                case "spot":
                    (t = new Is(r)).distance = i, n.spot = n.spot || {}, n.spot.innerConeAngle = void 0 !== n.spot.innerConeAngle ? n.spot.innerConeAngle : 0, n.spot.outerConeAngle = void 0 !== n.spot.outerConeAngle ? n.spot.outerConeAngle : Math.PI / 4, t.angle = n.spot.outerConeAngle, t.penumbra = 1 - n.spot.innerConeAngle / n.spot.outerConeAngle, t.target.position.set(0, 0, -1), t.add(t.target);
                    break;
                default:
                    throw new Error('THREE.GLTFLoader: Unexpected light type, "' + n.type + '".')
            }
            return t.position.set(0, 0, 0), t.decay = 2, void 0 !== n.intensity && (t.intensity = n.intensity), t.name = n.name || "light_" + e, Promise.resolve(t)
        }, o.prototype.getMaterialType = function() {
            return Ke
        }, o.prototype.extendParams = function(e, t, n) {
            var r = [];
            e.color = new Ve(1, 1, 1), e.opacity = 1;
            var i = t.pbrMetallicRoughness;
            if (i) {
                if (Array.isArray(i.baseColorFactor)) {
                    var o = i.baseColorFactor;
                    e.color.fromArray(o), e.opacity = o[3]
                }
                void 0 !== i.baseColorTexture && r.push(n.assignTexture(e, "map", i.baseColorTexture))
            }
            return Promise.all(r)
        };
        var a = "glTF",
            s = 1313821514,
            c = 5130562;

        function l(e) {
            this.name = n.KHR_BINARY_GLTF, this.content = null, this.body = null;
            var t = new DataView(e, 0, 12);
            if (this.header = {
                    magic: Hs(new Uint8Array(e.slice(0, 4))),
                    version: t.getUint32(4, !0),
                    length: t.getUint32(8, !0)
                }, this.header.magic !== a) throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
            if (this.header.version < 2) throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
            for (var r = new DataView(e, 12), i = 0; i < r.byteLength;) {
                var o = r.getUint32(i, !0);
                i += 4;
                var l = r.getUint32(i, !0);
                if (i += 4, l === s) {
                    var u = new Uint8Array(e, 12 + i, o);
                    this.content = Hs(u)
                } else if (l === c) {
                    var h = 12 + i;
                    this.body = e.slice(h, h + o)
                }
                i += o
            }
            if (null === this.content) throw new Error("THREE.GLTFLoader: JSON content not found.")
        }

        function u(e, t) {
            if (!t) throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
            this.name = n.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload()
        }

        function h() {
            this.name = n.KHR_TEXTURE_TRANSFORM
        }

        function p() {
            return {
                name: n.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS,
                specularGlossinessParams: ["color", "map", "lightMap", "lightMapIntensity", "aoMap", "aoMapIntensity", "emissive", "emissiveIntensity", "emissiveMap", "bumpMap", "bumpScale", "normalMap", "displacementMap", "displacementScale", "displacementBias", "specularMap", "specular", "glossinessMap", "glossiness", "alphaMap", "envMap", "envMapIntensity", "refractionRatio"],
                getMaterialType: function() {
                    return Yt
                },
                extendParams: function(e, t, n) {
                    var r = t.extensions[this.name],
                        i = an.standard,
                        o = qt.clone(i.uniforms),
                        a = ["#ifdef USE_SPECULARMAP", "\tuniform sampler2D specularMap;", "#endif"].join("\n"),
                        s = ["#ifdef USE_GLOSSINESSMAP", "\tuniform sampler2D glossinessMap;", "#endif"].join("\n"),
                        c = ["vec3 specularFactor = specular;", "#ifdef USE_SPECULARMAP", "\tvec4 texelSpecular = texture2D( specularMap, vUv );", "\ttexelSpecular = sRGBToLinear( texelSpecular );", "\t// reads channel RGB, compatible with a glTF Specular-Glossiness (RGBA) texture", "\tspecularFactor *= texelSpecular.rgb;", "#endif"].join("\n"),
                        l = ["float glossinessFactor = glossiness;", "#ifdef USE_GLOSSINESSMAP", "\tvec4 texelGlossiness = texture2D( glossinessMap, vUv );", "\t// reads channel A, compatible with a glTF Specular-Glossiness (RGBA) texture", "\tglossinessFactor *= texelGlossiness.a;", "#endif"].join("\n"),
                        u = ["PhysicalMaterial material;", "material.diffuseColor = diffuseColor.rgb;", "material.specularRoughness = clamp( 1.0 - glossinessFactor, 0.04, 1.0 );", "material.specularColor = specularFactor.rgb;"].join("\n"),
                        h = i.fragmentShader.replace("uniform float roughness;", "uniform vec3 specular;").replace("uniform float metalness;", "uniform float glossiness;").replace("#include <roughnessmap_pars_fragment>", a).replace("#include <metalnessmap_pars_fragment>", s).replace("#include <roughnessmap_fragment>", c).replace("#include <metalnessmap_fragment>", l).replace("#include <lights_physical_fragment>", u);
                    delete o.roughness, delete o.metalness, delete o.roughnessMap, delete o.metalnessMap, o.specular = {
                        value: (new Ve).setHex(1118481)
                    }, o.glossiness = {
                        value: .5
                    }, o.specularMap = {
                        value: null
                    }, o.glossinessMap = {
                        value: null
                    }, e.vertexShader = i.vertexShader, e.fragmentShader = h, e.uniforms = o, e.defines = {
                        STANDARD: ""
                    }, e.color = new Ve(1, 1, 1), e.opacity = 1;
                    var p = [];
                    if (Array.isArray(r.diffuseFactor)) {
                        var d = r.diffuseFactor;
                        e.color.fromArray(d), e.opacity = d[3]
                    }
                    if (void 0 !== r.diffuseTexture && p.push(n.assignTexture(e, "map", r.diffuseTexture)), e.emissive = new Ve(0, 0, 0), e.glossiness = void 0 !== r.glossinessFactor ? r.glossinessFactor : 1, e.specular = new Ve(1, 1, 1), Array.isArray(r.specularFactor) && e.specular.fromArray(r.specularFactor), void 0 !== r.specularGlossinessTexture) {
                        var f = r.specularGlossinessTexture;
                        p.push(n.assignTexture(e, "glossinessMap", f)), p.push(n.assignTexture(e, "specularMap", f))
                    }
                    return Promise.all(p)
                },
                createMaterial: function(e) {
                    var t = new Yt({
                        defines: e.defines,
                        vertexShader: e.vertexShader,
                        fragmentShader: e.fragmentShader,
                        uniforms: e.uniforms,
                        fog: !0,
                        lights: !0,
                        opacity: e.opacity,
                        transparent: e.transparent
                    });
                    return t.isGLTFSpecularGlossinessMaterial = !0, t.color = e.color, t.map = void 0 === e.map ? null : e.map, t.lightMap = null, t.lightMapIntensity = 1, t.aoMap = void 0 === e.aoMap ? null : e.aoMap, t.aoMapIntensity = 1, t.emissive = e.emissive, t.emissiveIntensity = 1, t.emissiveMap = void 0 === e.emissiveMap ? null : e.emissiveMap, t.bumpMap = void 0 === e.bumpMap ? null : e.bumpMap, t.bumpScale = 1, t.normalMap = void 0 === e.normalMap ? null : e.normalMap, e.normalScale && (t.normalScale = e.normalScale), t.displacementMap = null, t.displacementScale = 1, t.displacementBias = 0, t.specularMap = void 0 === e.specularMap ? null : e.specularMap, t.specular = e.specular, t.glossinessMap = void 0 === e.glossinessMap ? null : e.glossinessMap, t.glossiness = e.glossiness, t.alphaMap = null, t.envMap = void 0 === e.envMap ? null : e.envMap, t.envMapIntensity = 1, t.refractionRatio = .98, t.extensions.derivatives = !0, t
                },
                cloneMaterial: function(e) {
                    var t = e.clone();
                    t.isGLTFSpecularGlossinessMaterial = !0;
                    for (var n = this.specularGlossinessParams, r = 0, i = n.length; r < i; r++) {
                        var o = e[n[r]];
                        t[n[r]] = o && o.isColor ? o.clone() : o
                    }
                    return t
                },
                refreshUniforms: function(e, t, n, r, i) {
                    if (!0 === i.isGLTFSpecularGlossinessMaterial) {
                        var o, a = i.uniforms,
                            s = i.defines;
                        a.opacity.value = i.opacity, a.diffuse.value.copy(i.color), a.emissive.value.copy(i.emissive).multiplyScalar(i.emissiveIntensity), a.map.value = i.map, a.specularMap.value = i.specularMap, a.alphaMap.value = i.alphaMap, a.lightMap.value = i.lightMap, a.lightMapIntensity.value = i.lightMapIntensity, a.aoMap.value = i.aoMap, a.aoMapIntensity.value = i.aoMapIntensity, i.map ? o = i.map : i.specularMap ? o = i.specularMap : i.displacementMap ? o = i.displacementMap : i.normalMap ? o = i.normalMap : i.bumpMap ? o = i.bumpMap : i.glossinessMap ? o = i.glossinessMap : i.alphaMap ? o = i.alphaMap : i.emissiveMap && (o = i.emissiveMap), void 0 !== o && (o.isWebGLRenderTarget && (o = o.texture), !0 === o.matrixAutoUpdate && o.updateMatrix(), a.uvTransform.value.copy(o.matrix)), i.envMap && (a.envMap.value = i.envMap, a.envMapIntensity.value = i.envMapIntensity, a.flipEnvMap.value = i.envMap.isCubeTexture ? -1 : 1, a.reflectivity.value = i.reflectivity, a.refractionRatio.value = i.refractionRatio, a.maxMipLevel.value = e.properties.get(i.envMap).__maxMipLevel), a.specular.value.copy(i.specular), a.glossiness.value = i.glossiness, a.glossinessMap.value = i.glossinessMap, a.emissiveMap.value = i.emissiveMap, a.bumpMap.value = i.bumpMap, a.normalMap.value = i.normalMap, a.displacementMap.value = i.displacementMap, a.displacementScale.value = i.displacementScale, a.displacementBias.value = i.displacementBias, null !== a.glossinessMap.value && void 0 === s.USE_GLOSSINESSMAP && (s.USE_GLOSSINESSMAP = "", s.USE_ROUGHNESSMAP = ""), null === a.glossinessMap.value && void 0 !== s.USE_GLOSSINESSMAP && (delete s.USE_GLOSSINESSMAP, delete s.USE_ROUGHNESSMAP)
                    }
                }
            }
        }

        function m() {
            this.name = n.KHR_MESH_QUANTIZATION
        }

        function v(e, t, n, r) {
            Na.call(this, e, t, n, r)
        }
        u.prototype.decodePrimitive = function(e, t) {
            var n = this.json,
                r = this.dracoLoader,
                i = e.extensions[this.name].bufferView,
                o = e.extensions[this.name].attributes,
                a = {},
                s = {},
                c = {};
            for (var l in o) {
                var u = R[l] || l.toLowerCase();
                a[u] = o[l]
            }
            for (l in e.attributes) {
                u = R[l] || l.toLowerCase();
                if (void 0 !== o[l]) {
                    var h = n.accessors[e.attributes[l]],
                        p = E[h.componentType];
                    c[u] = p, s[u] = !0 === h.normalized
                }
            }
            return t.getDependency("bufferView", i).then((function(e) {
                return new Promise((function(t) {
                    r.decodeDracoFile(e, (function(e) {
                        for (var n in e.attributes) {
                            var r = e.attributes[n],
                                i = s[n];
                            void 0 !== i && (r.normalized = i)
                        }
                        t(e)
                    }), a, c)
                }))
            }))
        }, h.prototype.extendTexture = function(e, t) {
            return e = e.clone(), void 0 !== t.offset && e.offset.fromArray(t.offset), void 0 !== t.rotation && (e.rotation = t.rotation), void 0 !== t.scale && e.repeat.fromArray(t.scale), void 0 !== t.texCoord && console.warn('THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.'), e.needsUpdate = !0, e
        }, v.prototype = Object.create(Na.prototype), v.prototype.constructor = v, v.prototype.copySampleValue_ = function(e) {
            for (var t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r * 3 + r, o = 0; o !== r; o++) t[o] = n[i + o];
            return t
        }, v.prototype.beforeStart_ = v.prototype.copySampleValue_, v.prototype.afterEnd_ = v.prototype.copySampleValue_, v.prototype.interpolate_ = function(e, t, n, r) {
            for (var i = this.resultBuffer, o = this.sampleValues, a = this.valueSize, s = 2 * a, c = 3 * a, l = r - t, u = (n - t) / l, h = u * u, p = h * u, d = e * c, f = d - c, m = -2 * p + 3 * h, v = p - h, g = 1 - m, y = v - h + u, x = 0; x !== a; x++) {
                var _ = o[f + x + a],
                    b = o[f + x + s] * l,
                    w = o[d + x + a],
                    M = o[d + x] * l;
                i[x] = g * _ + y * b + m * w + v * M
            }
            return i
        };
        var g = 0,
            x = 1,
            _ = 2,
            b = 3,
            w = 4,
            M = 5,
            S = 6,
            E = {
                5120: Int8Array,
                5121: Uint8Array,
                5122: Int16Array,
                5123: Uint16Array,
                5125: Uint32Array,
                5126: Float32Array
            },
            T = {
                9728: 1003,
                9729: 1006,
                9984: 1004,
                9985: 1007,
                9986: 1005,
                9987: 1008
            },
            A = {
                33071: 1001,
                33648: 1002,
                10497: 1e3
            },
            L = {
                SCALAR: 1,
                VEC2: 2,
                VEC3: 3,
                VEC4: 4,
                MAT2: 4,
                MAT3: 9,
                MAT4: 16
            },
            R = {
                POSITION: "position",
                NORMAL: "normal",
                TANGENT: "tangent",
                TEXCOORD_0: "uv",
                TEXCOORD_1: "uv2",
                COLOR_0: "color",
                WEIGHTS_0: "skinWeight",
                JOINTS_0: "skinIndex"
            },
            P = {
                scale: "scale",
                translation: "position",
                rotation: "quaternion",
                weights: "morphTargetInfluences"
            },
            C = {
                CUBICSPLINE: void 0,
                LINEAR: 2301,
                STEP: 2300
            },
            O = "OPAQUE",
            I = "MASK",
            N = "BLEND",
            F = {
                "image/png": 1023,
                "image/jpeg": 1022
            };

        function z(e, t) {
            return "string" != typeof e || "" === e ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) ? e : /^data:.*,.*$/i.test(e) ? e : /^blob:.*$/i.test(e) ? e : t + e)
        }

        function U(e, t, n) {
            for (var r in n.extensions) void 0 === e[r] && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r])
        }

        function B(e, t) {
            void 0 !== t.extras && ("object" == typeof t.extras ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras))
        }

        function k(e, t) {
            if (e.updateMorphTargets(), void 0 !== t.weights)
                for (var n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
            if (t.extras && Array.isArray(t.extras.targetNames)) {
                var i = t.extras.targetNames;
                if (e.morphTargetInfluences.length === i.length) {
                    e.morphTargetDictionary = {};
                    for (n = 0, r = i.length; n < r; n++) e.morphTargetDictionary[i[n]] = n
                } else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")
            }
        }

        function G(e) {
            for (var t = "", n = Object.keys(e).sort(), r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
            return t
        }

        function H(e, n, r) {
            this.json = e || {}, this.extensions = n || {}, this.options = r || {}, this.cache = new t, this.primitiveCache = {}, this.textureLoader = new os(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.fileLoader = new $a(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), "use-credentials" === this.options.crossOrigin && this.fileLoader.setWithCredentials(!0)
        }

        function j(e, t, n) {
            var r = t.attributes,
                i = [];

            function o(t, r) {
                return n.getDependency("accessor", t).then((function(t) {
                    e.setAttribute(r, t)
                }))
            }
            for (var a in r) {
                var s = R[a] || a.toLowerCase();
                s in e.attributes || i.push(o(r[a], s))
            }
            if (void 0 !== t.indices && !e.index) {
                var c = n.getDependency("accessor", t.indices).then((function(t) {
                    e.setIndex(t)
                }));
                i.push(c)
            }
            return B(e, t),
                function(e, t, n) {
                    var r = t.attributes,
                        i = new fe;
                    if (void 0 !== r.POSITION) {
                        var o = (p = n.json.accessors[r.POSITION]).min,
                            a = p.max;
                        if (void 0 !== o && void 0 !== a) {
                            i.set(new y(o[0], o[1], o[2]), new y(a[0], a[1], a[2]));
                            var s = t.targets;
                            if (void 0 !== s)
                                for (var c = new y, l = 0, u = s.length; l < u; l++) {
                                    var h = s[l];
                                    if (void 0 !== h.POSITION) {
                                        var p;
                                        o = (p = n.json.accessors[h.POSITION]).min, a = p.max;
                                        void 0 !== o && void 0 !== a ? (c.setX(Math.max(Math.abs(o[0]), Math.abs(a[0]))), c.setY(Math.max(Math.abs(o[1]), Math.abs(a[1]))), c.setZ(Math.max(Math.abs(o[2]), Math.abs(a[2]))), i.expandByVector(c)) : console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")
                                    }
                                }
                            e.boundingBox = i;
                            var d = new ge;
                            i.getCenter(d.center), d.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = d
                        } else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")
                    }
                }(e, t, n), Promise.all(i).then((function() {
                    return void 0 !== t.targets ? function(e, t, n) {
                        for (var r = !1, i = !1, o = 0, a = t.length; o < a; o++) {
                            if (void 0 !== (l = t[o]).POSITION && (r = !0), void 0 !== l.NORMAL && (i = !0), r && i) break
                        }
                        if (!r && !i) return Promise.resolve(e);
                        var s = [],
                            c = [];
                        for (o = 0, a = t.length; o < a; o++) {
                            var l = t[o];
                            if (r) {
                                var u = void 0 !== l.POSITION ? n.getDependency("accessor", l.POSITION) : e.attributes.position;
                                s.push(u)
                            }
                            if (i) {
                                u = void 0 !== l.NORMAL ? n.getDependency("accessor", l.NORMAL) : e.attributes.normal;
                                c.push(u)
                            }
                        }
                        return Promise.all([Promise.all(s), Promise.all(c)]).then((function(t) {
                            var n = t[0],
                                o = t[1];
                            return r && (e.morphAttributes.position = n), i && (e.morphAttributes.normal = o), e.morphTargetsRelative = !0, e
                        }))
                    }(e, t.targets, n) : e
                }))
        }

        function V(e, t) {
            var n = e.getIndex();
            if (null === n) {
                var r = [],
                    i = e.getAttribute("position");
                if (void 0 === i) return console.error("THREE.GLTFLoader.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
                for (var o = 0; o < i.count; o++) r.push(o);
                e.setIndex(r), n = e.getIndex()
            }
            var a = n.count - 2,
                s = [];
            if (2 === t)
                for (o = 1; o <= a; o++) s.push(n.getX(0)), s.push(n.getX(o)), s.push(n.getX(o + 1));
            else
                for (o = 0; o < a; o++) o % 2 == 0 ? (s.push(n.getX(o)), s.push(n.getX(o + 1)), s.push(n.getX(o + 2))) : (s.push(n.getX(o + 2)), s.push(n.getX(o + 1)), s.push(n.getX(o)));
            s.length / 3 !== a && console.error("THREE.GLTFLoader.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
            var c = e.clone();
            return c.setIndex(s), c
        }
        return H.prototype.parse = function(e, t) {
            var n = this,
                r = this.json,
                i = this.extensions;
            this.cache.removeAll(), this.markDefs(), Promise.all([this.getDependencies("scene"), this.getDependencies("animation"), this.getDependencies("camera")]).then((function(t) {
                var o = {
                    scene: t[0][r.scene || 0],
                    scenes: t[0],
                    animations: t[1],
                    cameras: t[2],
                    asset: r.asset,
                    parser: n,
                    userData: {}
                };
                U(i, o, r), B(o, r), e(o)
            })).catch(t)
        }, H.prototype.markDefs = function() {
            for (var e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [], r = {}, i = {}, o = 0, a = t.length; o < a; o++)
                for (var s = t[o].joints, c = 0, l = s.length; c < l; c++) e[s[c]].isBone = !0;
            for (var u = 0, h = e.length; u < h; u++) {
                var p = e[u];
                void 0 !== p.mesh && (void 0 === r[p.mesh] && (r[p.mesh] = i[p.mesh] = 0), r[p.mesh]++, void 0 !== p.skin && (n[p.mesh].isSkinnedMesh = !0))
            }
            this.json.meshReferences = r, this.json.meshUses = i
        }, H.prototype.getDependency = function(e, t) {
            var r = e + ":" + t,
                i = this.cache.get(r);
            if (!i) {
                switch (e) {
                    case "scene":
                        i = this.loadScene(t);
                        break;
                    case "node":
                        i = this.loadNode(t);
                        break;
                    case "mesh":
                        i = this.loadMesh(t);
                        break;
                    case "accessor":
                        i = this.loadAccessor(t);
                        break;
                    case "bufferView":
                        i = this.loadBufferView(t);
                        break;
                    case "buffer":
                        i = this.loadBuffer(t);
                        break;
                    case "material":
                        i = this.loadMaterial(t);
                        break;
                    case "texture":
                        i = this.loadTexture(t);
                        break;
                    case "skin":
                        i = this.loadSkin(t);
                        break;
                    case "animation":
                        i = this.loadAnimation(t);
                        break;
                    case "camera":
                        i = this.loadCamera(t);
                        break;
                    case "light":
                        i = this.extensions[n.KHR_LIGHTS_PUNCTUAL].loadLight(t);
                        break;
                    default:
                        throw new Error("Unknown type: " + e)
                }
                this.cache.add(r, i)
            }
            return i
        }, H.prototype.getDependencies = function(e) {
            var t = this.cache.get(e);
            if (!t) {
                var n = this,
                    r = this.json[e + ("mesh" === e ? "es" : "s")] || [];
                t = Promise.all(r.map((function(t, r) {
                    return n.getDependency(e, r)
                }))), this.cache.add(e, t)
            }
            return t
        }, H.prototype.loadBuffer = function(e) {
            var t = this.json.buffers[e],
                r = this.fileLoader;
            if (t.type && "arraybuffer" !== t.type) throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
            if (void 0 === t.uri && 0 === e) return Promise.resolve(this.extensions[n.KHR_BINARY_GLTF].body);
            var i = this.options;
            return new Promise((function(e, n) {
                r.load(z(t.uri, i.path), e, void 0, (function() {
                    n(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'))
                }))
            }))
        }, H.prototype.loadBufferView = function(e) {
            var t = this.json.bufferViews[e];
            return this.getDependency("buffer", t.buffer).then((function(e) {
                var n = t.byteLength || 0,
                    r = t.byteOffset || 0;
                return e.slice(r, r + n)
            }))
        }, H.prototype.loadAccessor = function(e) {
            var t = this,
                n = this.json,
                r = this.json.accessors[e];
            if (void 0 === r.bufferView && void 0 === r.sparse) return Promise.resolve(null);
            var i = [];
            return void 0 !== r.bufferView ? i.push(this.getDependency("bufferView", r.bufferView)) : i.push(null), void 0 !== r.sparse && (i.push(this.getDependency("bufferView", r.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", r.sparse.values.bufferView))), Promise.all(i).then((function(e) {
                var i, o = e[0],
                    a = L[r.type],
                    s = E[r.componentType],
                    c = s.BYTES_PER_ELEMENT,
                    l = c * a,
                    u = r.byteOffset || 0,
                    h = void 0 !== r.bufferView ? n.bufferViews[r.bufferView].byteStride : void 0,
                    p = !0 === r.normalized;
                if (h && h !== l) {
                    var d = Math.floor(u / h),
                        f = "InterleavedBuffer:" + r.bufferView + ":" + r.componentType + ":" + d + ":" + r.count,
                        m = t.cache.get(f);
                    m || (m = new ci(new s(o, d * h, r.count * h / c), h / c), t.cache.add(f, m)), i = new hi(m, a, u % h / c, p)
                } else i = new $e(null === o ? new s(r.count * a) : new s(o, u, r.count * a), a, p);
                if (void 0 !== r.sparse) {
                    var v = L.SCALAR,
                        g = E[r.sparse.indices.componentType],
                        y = r.sparse.indices.byteOffset || 0,
                        x = r.sparse.values.byteOffset || 0,
                        _ = new g(e[1], y, r.sparse.count * v),
                        b = new s(e[2], x, r.sparse.count * a);
                    null !== o && (i = new $e(i.array.slice(), i.itemSize, i.normalized));
                    for (var w = 0, M = _.length; w < M; w++) {
                        var S = _[w];
                        if (i.setX(S, b[w * a]), a >= 2 && i.setY(S, b[w * a + 1]), a >= 3 && i.setZ(S, b[w * a + 2]), a >= 4 && i.setW(S, b[w * a + 3]), a >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")
                    }
                }
                return i
            }))
        }, H.prototype.loadTexture = function(e) {
            var t, r = this,
                i = this.json,
                o = this.options,
                a = this.textureLoader,
                s = window.URL || window.webkitURL,
                c = i.textures[e],
                l = c.extensions || {},
                u = (t = l[n.MSFT_TEXTURE_DDS] ? i.images[l[n.MSFT_TEXTURE_DDS].source] : i.images[c.source]).uri,
                h = !1;
            return void 0 !== t.bufferView && (u = r.getDependency("bufferView", t.bufferView).then((function(e) {
                h = !0;
                var n = new Blob([e], {
                    type: t.mimeType
                });
                return u = s.createObjectURL(n)
            }))), Promise.resolve(u).then((function(e) {
                var t = o.manager.getHandler(e);
                return t || (t = l[n.MSFT_TEXTURE_DDS] ? r.extensions[n.MSFT_TEXTURE_DDS].ddsLoader : a), new Promise((function(n, r) {
                    t.load(z(e, o.path), n, void 0, r)
                }))
            })).then((function(e) {
                !0 === h && s.revokeObjectURL(u), e.flipY = !1, void 0 !== c.name && (e.name = c.name), t.mimeType in F && (e.format = F[t.mimeType]);
                var n = (i.samplers || {})[c.sampler] || {};
                return e.magFilter = T[n.magFilter] || 1006, e.minFilter = T[n.minFilter] || 1008, e.wrapS = A[n.wrapS] || 1e3, e.wrapT = A[n.wrapT] || 1e3, e
            }))
        }, H.prototype.assignTexture = function(e, t, r) {
            var i = this;
            return this.getDependency("texture", r.index).then((function(o) {
                if (!o.isCompressedTexture) switch (t) {
                    case "aoMap":
                    case "emissiveMap":
                    case "metalnessMap":
                    case "normalMap":
                    case "roughnessMap":
                        o.format = 1022
                }
                if (void 0 === r.texCoord || 0 == r.texCoord || "aoMap" === t && 1 == r.texCoord || console.warn("THREE.GLTFLoader: Custom UV set " + r.texCoord + " for texture " + t + " not yet supported."), i.extensions[n.KHR_TEXTURE_TRANSFORM]) {
                    var a = void 0 !== r.extensions ? r.extensions[n.KHR_TEXTURE_TRANSFORM] : void 0;
                    a && (o = i.extensions[n.KHR_TEXTURE_TRANSFORM].extendTexture(o, a))
                }
                e[t] = o
            }))
        }, H.prototype.assignFinalMaterial = function(e) {
            var t = e.geometry,
                r = e.material,
                i = this.extensions,
                o = void 0 !== t.attributes.tangent,
                a = void 0 !== t.attributes.color,
                s = void 0 === t.attributes.normal,
                c = !0 === e.isSkinnedMesh,
                l = Object.keys(t.morphAttributes).length > 0,
                u = l && void 0 !== t.morphAttributes.normal;
            if (e.isPoints) {
                var h = "PointsMaterial:" + r.uuid,
                    p = this.cache.get(h);
                p || (p = new Ki, Je.prototype.copy.call(p, r), p.color.copy(r.color), p.map = r.map, p.sizeAttenuation = !1, this.cache.add(h, p)), r = p
            } else if (e.isLine) {
                h = "LineBasicMaterial:" + r.uuid;
                var d = this.cache.get(h);
                d || (d = new ki, Je.prototype.copy.call(d, r), d.color.copy(r.color), this.cache.add(h, d)), r = d
            }
            if (o || a || s || c || l) {
                h = "ClonedMaterial:" + r.uuid + ":";
                r.isGLTFSpecularGlossinessMaterial && (h += "specular-glossiness:"), c && (h += "skinning:"), o && (h += "vertex-tangents:"), a && (h += "vertex-colors:"), s && (h += "flat-shading:"), l && (h += "morph-targets:"), u && (h += "morph-normals:");
                var f = this.cache.get(h);
                f || (f = r.isGLTFSpecularGlossinessMaterial ? i[n.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].cloneMaterial(r) : r.clone(), c && (f.skinning = !0), o && (f.vertexTangents = !0), a && (f.vertexColors = 2), s && (f.flatShading = !0), l && (f.morphTargets = !0), u && (f.morphNormals = !0), this.cache.add(h, f)), r = f
            }
            r.aoMap && void 0 === t.attributes.uv2 && void 0 !== t.attributes.uv && t.setAttribute("uv2", new $e(t.attributes.uv.array, 2)), r.isGLTFSpecularGlossinessMaterial && (e.onBeforeRender = i[n.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].refreshUniforms), r.normalScale && !o && (r.normalScale.y = -r.normalScale.y), e.material = r
        }, H.prototype.loadMaterial = function(e) {
            var t, r = this.json,
                i = this.extensions,
                o = r.materials[e],
                a = {},
                s = o.extensions || {},
                c = [];
            if (s[n.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
                var l = i[n.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
                t = l.getMaterialType(), c.push(l.extendParams(a, o, this))
            } else if (s[n.KHR_MATERIALS_UNLIT]) {
                var u = i[n.KHR_MATERIALS_UNLIT];
                t = u.getMaterialType(), c.push(u.extendParams(a, o, this))
            } else {
                t = Sa;
                var h = o.pbrMetallicRoughness || {};
                if (a.color = new Ve(1, 1, 1), a.opacity = 1, Array.isArray(h.baseColorFactor)) {
                    var p = h.baseColorFactor;
                    a.color.fromArray(p), a.opacity = p[3]
                }
                void 0 !== h.baseColorTexture && c.push(this.assignTexture(a, "map", h.baseColorTexture)), a.metalness = void 0 !== h.metallicFactor ? h.metallicFactor : 1, a.roughness = void 0 !== h.roughnessFactor ? h.roughnessFactor : 1, void 0 !== h.metallicRoughnessTexture && (c.push(this.assignTexture(a, "metalnessMap", h.metallicRoughnessTexture)), c.push(this.assignTexture(a, "roughnessMap", h.metallicRoughnessTexture)))
            }!0 === o.doubleSided && (a.side = 2);
            var d = o.alphaMode || O;
            return d === N ? a.transparent = !0 : (a.transparent = !1, d === I && (a.alphaTest = void 0 !== o.alphaCutoff ? o.alphaCutoff : .5)), void 0 !== o.normalTexture && t !== Ke && (c.push(this.assignTexture(a, "normalMap", o.normalTexture)), a.normalScale = new f(1, 1), void 0 !== o.normalTexture.scale && a.normalScale.set(o.normalTexture.scale, o.normalTexture.scale)), void 0 !== o.occlusionTexture && t !== Ke && (c.push(this.assignTexture(a, "aoMap", o.occlusionTexture)), void 0 !== o.occlusionTexture.strength && (a.aoMapIntensity = o.occlusionTexture.strength)), void 0 !== o.emissiveFactor && t !== Ke && (a.emissive = (new Ve).fromArray(o.emissiveFactor)), void 0 !== o.emissiveTexture && t !== Ke && c.push(this.assignTexture(a, "emissiveMap", o.emissiveTexture)), Promise.all(c).then((function() {
                var e;
                return e = t === Yt ? i[n.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(a) : new t(a), void 0 !== o.name && (e.name = o.name), e.map && (e.map.encoding = 3001), e.emissiveMap && (e.emissiveMap.encoding = 3001), e.specularMap && (e.specularMap.encoding = 3001), B(e, o), o.extensions && U(i, e, o), e
            }))
        }, H.prototype.loadGeometries = function(e) {
            var t = this,
                r = this.extensions,
                i = this.primitiveCache;

            function o(e) {
                return r[n.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then((function(n) {
                    return j(n, e, t)
                }))
            }
            for (var a, s, c = [], l = 0, u = e.length; l < u; l++) {
                var h, p = e[l],
                    d = (s = void 0, (s = (a = p).extensions && a.extensions[n.KHR_DRACO_MESH_COMPRESSION]) ? "draco:" + s.bufferView + ":" + s.indices + ":" + G(s.attributes) : a.indices + ":" + G(a.attributes) + ":" + a.mode),
                    f = i[d];
                if (f) c.push(f.promise);
                else h = p.extensions && p.extensions[n.KHR_DRACO_MESH_COMPRESSION] ? o(p) : j(new yt, p, t), i[d] = {
                    primitive: p,
                    promise: h
                }, c.push(h)
            }
            return Promise.all(c)
        }, H.prototype.loadMesh = function(e) {
            for (var t, n = this, r = this.json.meshes[e], i = r.primitives, o = [], a = 0, s = i.length; a < s; a++) {
                var c = void 0 === i[a].material ? (void 0 === (t = this.cache).DefaultMaterial && (t.DefaultMaterial = new Sa({
                    color: 16777215,
                    emissive: 0,
                    metalness: 1,
                    roughness: 1,
                    transparent: !1,
                    depthTest: !0,
                    side: 0
                })), t.DefaultMaterial) : this.getDependency("material", i[a].material);
                o.push(c)
            }
            return o.push(n.loadGeometries(i)), Promise.all(o).then((function(t) {
                for (var o = t.slice(0, t.length - 1), a = t[t.length - 1], s = [], c = 0, l = a.length; c < l; c++) {
                    var u, h = a[c],
                        p = i[c],
                        d = o[c];
                    if (p.mode === w || p.mode === M || p.mode === S || void 0 === p.mode) !0 !== (u = !0 === r.isSkinnedMesh ? new Pi(h, d) : new Ft(h, d)).isSkinnedMesh || u.geometry.attributes.skinWeight.normalized || u.normalizeSkinWeights(), p.mode === M ? u.geometry = V(u.geometry, 1) : p.mode === S && (u.geometry = V(u.geometry, 2));
                    else if (p.mode === x) u = new Zi(h, d);
                    else if (p.mode === b) u = new Xi(h, d);
                    else if (p.mode === _) u = new Ji(h, d);
                    else {
                        if (p.mode !== g) throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + p.mode);
                        u = new no(h, d)
                    }
                    Object.keys(u.geometry.morphAttributes).length > 0 && k(u, r), u.name = r.name || "mesh_" + e, a.length > 1 && (u.name += "_" + c), B(u, r), n.assignFinalMaterial(u), s.push(u)
                }
                if (1 === s.length) return s[0];
                var f = new ri;
                for (c = 0, l = s.length; c < l; c++) f.add(s[c]);
                return f
            }))
        }, H.prototype.loadCamera = function(e) {
            var t, n = this.json.cameras[e],
                r = n[n.type];
            if (r) return "perspective" === n.type ? t = new Jt(d.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : "orthographic" === n.type && (t = new Fs(r.xmag / -2, r.xmag / 2, r.ymag / 2, r.ymag / -2, r.znear, r.zfar)), void 0 !== n.name && (t.name = n.name), B(t, n), Promise.resolve(t);
            console.warn("THREE.GLTFLoader: Missing camera parameters.")
        }, H.prototype.loadSkin = function(e) {
            var t = this.json.skins[e],
                n = {
                    joints: t.joints
                };
            return void 0 === t.inverseBindMatrices ? Promise.resolve(n) : this.getDependency("accessor", t.inverseBindMatrices).then((function(e) {
                return n.inverseBindMatrices = e, n
            }))
        }, H.prototype.loadAnimation = function(e) {
            for (var t = this.json.animations[e], n = [], r = [], i = [], o = [], a = [], s = 0, c = t.channels.length; s < c; s++) {
                var l = t.channels[s],
                    u = t.samplers[l.sampler],
                    h = l.target,
                    p = void 0 !== h.node ? h.node : h.id,
                    d = void 0 !== t.parameters ? t.parameters[u.input] : u.input,
                    f = void 0 !== t.parameters ? t.parameters[u.output] : u.output;
                n.push(this.getDependency("node", p)), r.push(this.getDependency("accessor", d)), i.push(this.getDependency("accessor", f)), o.push(u), a.push(h)
            }
            return Promise.all([Promise.all(n), Promise.all(r), Promise.all(i), Promise.all(o), Promise.all(a)]).then((function(n) {
                for (var r = n[0], i = n[1], o = n[2], a = n[3], s = n[4], c = [], l = 0, u = r.length; l < u; l++) {
                    var h = r[l],
                        p = i[l],
                        d = o[l],
                        f = a[l],
                        m = s[l];
                    if (void 0 !== h) {
                        var g;
                        switch (h.updateMatrix(), h.matrixAutoUpdate = !0, P[m.path]) {
                            case P.weights:
                                g = Ga;
                                break;
                            case P.rotation:
                                g = ja;
                                break;
                            case P.position:
                            case P.scale:
                            default:
                                g = Wa
                        }
                        var y = h.name ? h.name : h.uuid,
                            x = void 0 !== f.interpolation ? C[f.interpolation] : 2301,
                            _ = [];
                        P[m.path] === P.weights ? h.traverse((function(e) {
                            !0 === e.isMesh && e.morphTargetInfluences && _.push(e.name ? e.name : e.uuid)
                        })) : _.push(y);
                        var b = d.array;
                        if (d.normalized) {
                            var w;
                            if (b.constructor === Int8Array) w = 1 / 127;
                            else if (b.constructor === Uint8Array) w = 1 / 255;
                            else if (b.constructor == Int16Array) w = 1 / 32767;
                            else {
                                if (b.constructor !== Uint16Array) throw new Error("THREE.GLTFLoader: Unsupported output accessor component type.");
                                w = 1 / 65535
                            }
                            for (var M = new Float32Array(b.length), S = 0, E = b.length; S < E; S++) M[S] = b[S] * w;
                            b = M
                        }
                        for (S = 0, E = _.length; S < E; S++) {
                            var T = new g(_[S] + "." + P[m.path], p.array, b, x);
                            "CUBICSPLINE" === f.interpolation && (T.createInterpolant = function(e) {
                                return new v(this.times, this.values, this.getValueSize() / 3, e)
                            }, T.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0), c.push(T)
                        }
                    }
                }
                return new Xa(void 0 !== t.name ? t.name : "animation_" + e, void 0, c)
            }))
        }, H.prototype.loadNode = function(e) {
            var t, r = this.json,
                i = this.extensions,
                o = this,
                a = r.meshReferences,
                s = r.meshUses,
                c = r.nodes[e];
            return (t = [], void 0 !== c.mesh && t.push(o.getDependency("mesh", c.mesh).then((function(e) {
                var t;
                if (a[c.mesh] > 1) {
                    var n = s[c.mesh]++;
                    (t = e.clone()).name += "_instance_" + n, t.onBeforeRender = e.onBeforeRender;
                    for (var r = 0, i = t.children.length; r < i; r++) t.children[r].name += "_instance_" + n, t.children[r].onBeforeRender = e.children[r].onBeforeRender
                } else t = e;
                return void 0 !== c.weights && t.traverse((function(e) {
                    if (e.isMesh)
                        for (var t = 0, n = c.weights.length; t < n; t++) e.morphTargetInfluences[t] = c.weights[t]
                })), t
            }))), void 0 !== c.camera && t.push(o.getDependency("camera", c.camera)), c.extensions && c.extensions[n.KHR_LIGHTS_PUNCTUAL] && void 0 !== c.extensions[n.KHR_LIGHTS_PUNCTUAL].light && t.push(o.getDependency("light", c.extensions[n.KHR_LIGHTS_PUNCTUAL].light)), Promise.all(t)).then((function(e) {
                var t;
                if ((t = !0 === c.isBone ? new Ni : e.length > 1 ? new ri : 1 === e.length ? e[0] : new $) !== e[0])
                    for (var n = 0, r = e.length; n < r; n++) t.add(e[n]);
                if (void 0 !== c.name && (t.userData.name = c.name, t.name = Dc.sanitizeNodeName(c.name)), B(t, c), c.extensions && U(i, t, c), void 0 !== c.matrix) {
                    var o = new D;
                    o.fromArray(c.matrix), t.applyMatrix(o)
                } else void 0 !== c.translation && t.position.fromArray(c.translation), void 0 !== c.rotation && t.quaternion.fromArray(c.rotation), void 0 !== c.scale && t.scale.fromArray(c.scale);
                return t
            }))
        }, H.prototype.loadScene = function() {
            function e(t, n, r, i) {
                var o = r.nodes[t];
                return i.getDependency("node", t).then((function(e) {
                    return void 0 === o.skin ? e : i.getDependency("skin", o.skin).then((function(e) {
                        for (var n = [], r = 0, o = (t = e).joints.length; r < o; r++) n.push(i.getDependency("node", t.joints[r]));
                        return Promise.all(n)
                    })).then((function(n) {
                        return e.traverse((function(e) {
                            if (e.isMesh) {
                                for (var r = [], i = [], o = 0, a = n.length; o < a; o++) {
                                    var s = n[o];
                                    if (s) {
                                        r.push(s);
                                        var c = new D;
                                        void 0 !== t.inverseBindMatrices && c.fromArray(t.inverseBindMatrices.array, 16 * o), i.push(c)
                                    } else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[o])
                                }
                                e.bind(new Ii(r, i), e.matrixWorld)
                            }
                        })), e
                    }));
                    var t
                })).then((function(t) {
                    n.add(t);
                    var a = [];
                    if (o.children)
                        for (var s = o.children, c = 0, l = s.length; c < l; c++) {
                            var u = s[c];
                            a.push(e(u, t, r, i))
                        }
                    return Promise.all(a)
                }))
            }
            return function(t) {
                var n = this.json,
                    r = this.extensions,
                    i = this.json.scenes[t],
                    o = new ee;
                void 0 !== i.name && (o.name = i.name), B(o, i), i.extensions && U(r, o, i);
                for (var a = i.nodes || [], s = [], c = 0, l = a.length; c < l; c++) s.push(e(a[c], o, n, this));
                return Promise.all(s).then((function() {
                    return o
                }))
            }
        }(), e
    }(),
    au = function(e, t) {
        var n, u, h, p, d;
        void 0 === t && console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.'), t === document && console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'), this.object = e, this.domElement = t, this.enabled = !0, this.target = new y, this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = .05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !1, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.enableKeys = !0, this.keys = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            BOTTOM: 40
        }, this.mouseButtons = {
            LEFT: r,
            MIDDLE: i,
            RIGHT: o
        }, this.touches = {
            ONE: a,
            TWO: c
        }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this.getPolarAngle = function() {
            return S.phi
        }, this.getAzimuthalAngle = function() {
            return S.theta
        }, this.saveState = function() {
            v.target0.copy(v.target), v.position0.copy(v.object.position), v.zoom0 = v.object.zoom
        }, this.reset = function() {
            v.target.copy(v.target0), v.object.position.copy(v.position0), v.object.zoom = v.zoom0, v.object.updateProjectionMatrix(), v.dispatchEvent(g), v.update(), w = b.NONE
        }, this.update = (n = new y, u = (new m).setFromUnitVectors(e.up, new y(0, 1, 0)), h = u.clone().inverse(), p = new y, d = new m, function() {
            var e = v.object.position;
            return n.copy(e).sub(v.target), n.applyQuaternion(u), S.setFromVector3(n), v.autoRotate && w === b.NONE && B(2 * Math.PI / 60 / 60 * v.autoRotateSpeed), v.enableDamping ? (S.theta += E.theta * v.dampingFactor, S.phi += E.phi * v.dampingFactor) : (S.theta += E.theta, S.phi += E.phi), S.theta = Math.max(v.minAzimuthAngle, Math.min(v.maxAzimuthAngle, S.theta)), S.phi = Math.max(v.minPolarAngle, Math.min(v.maxPolarAngle, S.phi)), S.makeSafe(), S.radius *= T, S.radius = Math.max(v.minDistance, Math.min(v.maxDistance, S.radius)), !0 === v.enableDamping ? v.target.addScaledVector(A, v.dampingFactor) : v.target.add(A), n.setFromSpherical(S), n.applyQuaternion(h), e.copy(v.target).add(n), v.object.lookAt(v.target), !0 === v.enableDamping ? (E.theta *= 1 - v.dampingFactor, E.phi *= 1 - v.dampingFactor, A.multiplyScalar(1 - v.dampingFactor)) : (E.set(0, 0, 0), A.set(0, 0, 0)), T = 1, !!(L || p.distanceToSquared(v.object.position) > M || 8 * (1 - d.dot(v.object.quaternion)) > M) && (v.dispatchEvent(g), p.copy(v.object.position), d.copy(v.object.quaternion), L = !1, !0)
        }), this.dispose = function() {
            v.domElement.removeEventListener("contextmenu", le, !1), v.domElement.removeEventListener("mousedown", te, !1), v.domElement.removeEventListener("wheel", ie, !1), v.domElement.removeEventListener("touchstart", ae, !1), v.domElement.removeEventListener("touchend", ce, !1), v.domElement.removeEventListener("touchmove", se, !1), document.removeEventListener("mousemove", ne, !1), document.removeEventListener("mouseup", re, !1), v.domElement.removeEventListener("keydown", oe, !1)
        };
        var v = this,
            g = {
                type: "change"
            },
            x = {
                type: "start"
            },
            _ = {
                type: "end"
            },
            b = {
                NONE: -1,
                ROTATE: 0,
                DOLLY: 1,
                PAN: 2,
                TOUCH_ROTATE: 3,
                TOUCH_PAN: 4,
                TOUCH_DOLLY_PAN: 5,
                TOUCH_DOLLY_ROTATE: 6
            },
            w = b.NONE,
            M = 1e-6,
            S = new Hc,
            E = new Hc,
            T = 1,
            A = new y,
            L = !1,
            R = new f,
            P = new f,
            C = new f,
            O = new f,
            I = new f,
            N = new f,
            D = new f,
            F = new f,
            z = new f;

        function U() {
            return Math.pow(.95, v.zoomSpeed)
        }

        function B(e) {
            E.theta -= e
        }

        function k(e) {
            E.phi -= e
        }
        var G, H = (G = new y, function(e, t) {
                G.setFromMatrixColumn(t, 0), G.multiplyScalar(-e), A.add(G)
            }),
            j = function() {
                var e = new y;
                return function(t, n) {
                    !0 === v.screenSpacePanning ? e.setFromMatrixColumn(n, 1) : (e.setFromMatrixColumn(n, 0), e.crossVectors(v.object.up, e)), e.multiplyScalar(t), A.add(e)
                }
            }(),
            V = function() {
                var e = new y;
                return function(t, n) {
                    var r = v.domElement;
                    if (v.object.isPerspectiveCamera) {
                        var i = v.object.position;
                        e.copy(i).sub(v.target);
                        var o = e.length();
                        o *= Math.tan(v.object.fov / 2 * Math.PI / 180), H(2 * t * o / r.clientHeight, v.object.matrix), j(2 * n * o / r.clientHeight, v.object.matrix)
                    } else v.object.isOrthographicCamera ? (H(t * (v.object.right - v.object.left) / v.object.zoom / r.clientWidth, v.object.matrix), j(n * (v.object.top - v.object.bottom) / v.object.zoom / r.clientHeight, v.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), v.enablePan = !1)
                }
            }();

        function W(e) {
            v.object.isPerspectiveCamera ? T /= e : v.object.isOrthographicCamera ? (v.object.zoom = Math.max(v.minZoom, Math.min(v.maxZoom, v.object.zoom * e)), v.object.updateProjectionMatrix(), L = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), v.enableZoom = !1)
        }

        function X(e) {
            v.object.isPerspectiveCamera ? T *= e : v.object.isOrthographicCamera ? (v.object.zoom = Math.max(v.minZoom, Math.min(v.maxZoom, v.object.zoom / e)), v.object.updateProjectionMatrix(), L = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), v.enableZoom = !1)
        }

        function q(e) {
            R.set(e.clientX, e.clientY)
        }

        function Y(e) {
            O.set(e.clientX, e.clientY)
        }

        function Z(e) {
            if (1 == e.touches.length) R.set(e.touches[0].pageX, e.touches[0].pageY);
            else {
                var t = .5 * (e.touches[0].pageX + e.touches[1].pageX),
                    n = .5 * (e.touches[0].pageY + e.touches[1].pageY);
                R.set(t, n)
            }
        }

        function J(e) {
            if (1 == e.touches.length) O.set(e.touches[0].pageX, e.touches[0].pageY);
            else {
                var t = .5 * (e.touches[0].pageX + e.touches[1].pageX),
                    n = .5 * (e.touches[0].pageY + e.touches[1].pageY);
                O.set(t, n)
            }
        }

        function K(e) {
            var t = e.touches[0].pageX - e.touches[1].pageX,
                n = e.touches[0].pageY - e.touches[1].pageY,
                r = Math.sqrt(t * t + n * n);
            D.set(0, r)
        }

        function Q(e) {
            if (1 == e.touches.length) P.set(e.touches[0].pageX, e.touches[0].pageY);
            else {
                var t = .5 * (e.touches[0].pageX + e.touches[1].pageX),
                    n = .5 * (e.touches[0].pageY + e.touches[1].pageY);
                P.set(t, n)
            }
            C.subVectors(P, R).multiplyScalar(v.rotateSpeed);
            var r = v.domElement;
            B(2 * Math.PI * C.x / r.clientHeight), k(2 * Math.PI * C.y / r.clientHeight), R.copy(P)
        }

        function $(e) {
            if (1 == e.touches.length) I.set(e.touches[0].pageX, e.touches[0].pageY);
            else {
                var t = .5 * (e.touches[0].pageX + e.touches[1].pageX),
                    n = .5 * (e.touches[0].pageY + e.touches[1].pageY);
                I.set(t, n)
            }
            N.subVectors(I, O).multiplyScalar(v.panSpeed), V(N.x, N.y), O.copy(I)
        }

        function ee(e) {
            var t = e.touches[0].pageX - e.touches[1].pageX,
                n = e.touches[0].pageY - e.touches[1].pageY,
                r = Math.sqrt(t * t + n * n);
            F.set(0, r), z.set(0, Math.pow(F.y / D.y, v.zoomSpeed)), W(z.y), D.copy(F)
        }

        function te(e) {
            if (!1 !== v.enabled) {
                switch (e.preventDefault(), v.domElement.focus ? v.domElement.focus() : window.focus(), e.button) {
                    case 0:
                        switch (v.mouseButtons.LEFT) {
                            case r:
                                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                                    if (!1 === v.enablePan) return;
                                    Y(e), w = b.PAN
                                } else {
                                    if (!1 === v.enableRotate) return;
                                    q(e), w = b.ROTATE
                                }
                                break;
                            case o:
                                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                                    if (!1 === v.enableRotate) return;
                                    q(e), w = b.ROTATE
                                } else {
                                    if (!1 === v.enablePan) return;
                                    Y(e), w = b.PAN
                                }
                                break;
                            default:
                                w = b.NONE
                        }
                        break;
                    case 1:
                        switch (v.mouseButtons.MIDDLE) {
                            case i:
                                if (!1 === v.enableZoom) return;
                                ! function(e) {
                                    D.set(e.clientX, e.clientY)
                                }(e), w = b.DOLLY;
                                break;
                            default:
                                w = b.NONE
                        }
                        break;
                    case 2:
                        switch (v.mouseButtons.RIGHT) {
                            case r:
                                if (!1 === v.enableRotate) return;
                                q(e), w = b.ROTATE;
                                break;
                            case o:
                                if (!1 === v.enablePan) return;
                                Y(e), w = b.PAN;
                                break;
                            default:
                                w = b.NONE
                        }
                }
                w !== b.NONE && (document.addEventListener("mousemove", ne, !1), document.addEventListener("mouseup", re, !1), v.dispatchEvent(x))
            }
        }

        function ne(e) {
            if (!1 !== v.enabled) switch (e.preventDefault(), w) {
                case b.ROTATE:
                    if (!1 === v.enableRotate) return;
                    ! function(e) {
                        P.set(e.clientX, e.clientY), C.subVectors(P, R).multiplyScalar(v.rotateSpeed);
                        var t = v.domElement;
                        B(2 * Math.PI * C.x / t.clientHeight), k(2 * Math.PI * C.y / t.clientHeight), R.copy(P), v.update()
                    }(e);
                    break;
                case b.DOLLY:
                    if (!1 === v.enableZoom) return;
                    ! function(e) {
                        F.set(e.clientX, e.clientY), z.subVectors(F, D), z.y > 0 ? W(U()) : z.y < 0 && X(U()), D.copy(F), v.update()
                    }(e);
                    break;
                case b.PAN:
                    if (!1 === v.enablePan) return;
                    ! function(e) {
                        I.set(e.clientX, e.clientY), N.subVectors(I, O).multiplyScalar(v.panSpeed), V(N.x, N.y), O.copy(I), v.update()
                    }(e)
            }
        }

        function re(e) {
            !1 !== v.enabled && (document.removeEventListener("mousemove", ne, !1), document.removeEventListener("mouseup", re, !1), v.dispatchEvent(_), w = b.NONE)
        }

        function ie(e) {
            !1 === v.enabled || !1 === v.enableZoom || w !== b.NONE && w !== b.ROTATE || (e.preventDefault(), e.stopPropagation(), v.dispatchEvent(x), function(e) {
                e.deltaY < 0 ? X(U()) : e.deltaY > 0 && W(U()), v.update()
            }(e), v.dispatchEvent(_))
        }

        function oe(e) {
            !1 !== v.enabled && !1 !== v.enableKeys && !1 !== v.enablePan && function(e) {
                var t = !1;
                switch (e.keyCode) {
                    case v.keys.UP:
                        V(0, v.keyPanSpeed), t = !0;
                        break;
                    case v.keys.BOTTOM:
                        V(0, -v.keyPanSpeed), t = !0;
                        break;
                    case v.keys.LEFT:
                        V(v.keyPanSpeed, 0), t = !0;
                        break;
                    case v.keys.RIGHT:
                        V(-v.keyPanSpeed, 0), t = !0
                }
                t && (e.preventDefault(), v.update())
            }(e)
        }

        function ae(e) {
            if (!1 !== v.enabled) {
                switch (e.preventDefault(), e.touches.length) {
                    case 1:
                        switch (v.touches.ONE) {
                            case a:
                                if (!1 === v.enableRotate) return;
                                Z(e), w = b.TOUCH_ROTATE;
                                break;
                            case s:
                                if (!1 === v.enablePan) return;
                                J(e), w = b.TOUCH_PAN;
                                break;
                            default:
                                w = b.NONE
                        }
                        break;
                    case 2:
                        switch (v.touches.TWO) {
                            case c:
                                if (!1 === v.enableZoom && !1 === v.enablePan) return;
                                ! function(e) {
                                    v.enableZoom && K(e), v.enablePan && J(e)
                                }(e), w = b.TOUCH_DOLLY_PAN;
                                break;
                            case l:
                                if (!1 === v.enableZoom && !1 === v.enableRotate) return;
                                ! function(e) {
                                    v.enableZoom && K(e), v.enableRotate && Z(e)
                                }(e), w = b.TOUCH_DOLLY_ROTATE;
                                break;
                            default:
                                w = b.NONE
                        }
                        break;
                    default:
                        w = b.NONE
                }
                w !== b.NONE && v.dispatchEvent(x)
            }
        }

        function se(e) {
            if (!1 !== v.enabled) switch (e.preventDefault(), e.stopPropagation(), w) {
                case b.TOUCH_ROTATE:
                    if (!1 === v.enableRotate) return;
                    Q(e), v.update();
                    break;
                case b.TOUCH_PAN:
                    if (!1 === v.enablePan) return;
                    $(e), v.update();
                    break;
                case b.TOUCH_DOLLY_PAN:
                    if (!1 === v.enableZoom && !1 === v.enablePan) return;
                    ! function(e) {
                        v.enableZoom && ee(e), v.enablePan && $(e)
                    }(e), v.update();
                    break;
                case b.TOUCH_DOLLY_ROTATE:
                    if (!1 === v.enableZoom && !1 === v.enableRotate) return;
                    ! function(e) {
                        v.enableZoom && ee(e), v.enableRotate && Q(e)
                    }(e), v.update();
                    break;
                default:
                    w = b.NONE
            }
        }

        function ce(e) {
            !1 !== v.enabled && (v.dispatchEvent(_), w = b.NONE)
        }

        function le(e) {
            !1 !== v.enabled && e.preventDefault()
        }
        v.domElement.addEventListener("contextmenu", le, !1), v.domElement.addEventListener("mousedown", te, !1), v.domElement.addEventListener("wheel", ie, !1), v.domElement.addEventListener("touchstart", ae, !1), v.domElement.addEventListener("touchend", ce, !1), v.domElement.addEventListener("touchmove", se, !1), v.domElement.addEventListener("keydown", oe, !1), -1 === v.domElement.tabIndex && (v.domElement.tabIndex = 0), this.update()
    };
(au.prototype = Object.create(u.prototype)).constructor = au;
var su = function(e, t) {
    au.call(this, e, t), this.mouseButtons.LEFT = o, this.mouseButtons.RIGHT = r, this.touches.ONE = s, this.touches.TWO = l
};
(su.prototype = Object.create(u.prototype)).constructor = su;
var cu = function(e) {
    ns.call(this, e), this.type = 1009
};
cu.prototype = Object.assign(Object.create(ns.prototype), {
    constructor: cu,
    parse: function(e) {
        var t = function(e, t) {
                switch (e) {
                    case 1:
                        console.error("RGBELoader Read Error: " + (t || ""));
                        break;
                    case 2:
                        console.error("RGBELoader Write Error: " + (t || ""));
                        break;
                    case 3:
                        console.error("RGBELoader Bad File Format: " + (t || ""));
                        break;
                    default:
                    case 4:
                        console.error("RGBELoader: Error: " + (t || ""))
                }
                return -1
            },
            n = function(e, t, n) {
                t = t || 1024;
                for (var r = e.pos, i = -1, o = 0, a = "", s = String.fromCharCode.apply(null, new Uint16Array(e.subarray(r, r + 128))); 0 > (i = s.indexOf("\n")) && o < t && r < e.byteLength;) a += s, o += s.length, r += 128, s += String.fromCharCode.apply(null, new Uint16Array(e.subarray(r, r + 128)));
                return -1 < i && (!1 !== n && (e.pos += o + i + 1), a + s.slice(0, i))
            },
            r = function() {
                var e = new Float32Array(1),
                    t = new Int32Array(e.buffer);

                function n(n) {
                    e[0] = n;
                    var r = t[0],
                        i = r >> 16 & 32768,
                        o = r >> 12 & 2047,
                        a = r >> 23 & 255;
                    return a < 103 ? i : a > 142 ? (i |= 31744, i |= (255 == a ? 0 : 1) && 8388607 & r) : a < 113 ? i |= ((o |= 2048) >> 114 - a) + (o >> 113 - a & 1) : (i |= a - 112 << 10 | o >> 1, i += 1 & o)
                }
                return function(e, t, r, i) {
                    var o = e[t + 3],
                        a = Math.pow(2, o - 128) / 255;
                    r[i + 0] = n(e[t + 0] * a), r[i + 1] = n(e[t + 1] * a), r[i + 2] = n(e[t + 2] * a)
                }
            }(),
            i = new Uint8Array(e);
        i.pos = 0;
        var o, a, s, c, l, u, h = function(e) {
            var r, i, o = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
                a = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
                s = /^\s*FORMAT=(\S+)\s*$/,
                c = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,
                l = {
                    valid: 0,
                    string: "",
                    comments: "",
                    programtype: "RGBE",
                    format: "",
                    gamma: 1,
                    exposure: 1,
                    width: 0,
                    height: 0
                };
            if (e.pos >= e.byteLength || !(r = n(e))) return t(1, "no header found");
            if (!(i = r.match(/^#\?(\S+)$/))) return t(3, "bad initial token");
            for (l.valid |= 1, l.programtype = i[1], l.string += r + "\n"; !1 !== (r = n(e));)
                if (l.string += r + "\n", "#" !== r.charAt(0)) {
                    if ((i = r.match(o)) && (l.gamma = parseFloat(i[1], 10)), (i = r.match(a)) && (l.exposure = parseFloat(i[1], 10)), (i = r.match(s)) && (l.valid |= 2, l.format = i[1]), (i = r.match(c)) && (l.valid |= 4, l.height = parseInt(i[1], 10), l.width = parseInt(i[2], 10)), 2 & l.valid && 4 & l.valid) break
                } else l.comments += r + "\n";
            return 2 & l.valid ? 4 & l.valid ? l : t(3, "missing image size specifier") : t(3, "missing format specifier")
        }(i);
        if (-1 !== h) {
            var p = h.width,
                d = h.height,
                f = function(e, n, r) {
                    var i, o, a, s, c, l, u, h, p, d, f, m, v, g = n,
                        y = r;
                    if (g < 8 || g > 32767 || 2 !== e[0] || 2 !== e[1] || 128 & e[2]) return new Uint8Array(e);
                    if (g !== (e[2] << 8 | e[3])) return t(3, "wrong scanline width");
                    if (!(i = new Uint8Array(4 * n * r)) || !i.length) return t(4, "unable to allocate buffer space");
                    for (o = 0, a = 0, h = 4 * g, v = new Uint8Array(4), l = new Uint8Array(h); y > 0 && a < e.byteLength;) {
                        if (a + 4 > e.byteLength) return t(1);
                        if (v[0] = e[a++], v[1] = e[a++], v[2] = e[a++], v[3] = e[a++], 2 != v[0] || 2 != v[1] || (v[2] << 8 | v[3]) != g) return t(3, "bad rgbe scanline format");
                        for (u = 0; u < h && a < e.byteLength;) {
                            if ((m = (s = e[a++]) > 128) && (s -= 128), 0 === s || u + s > h) return t(3, "bad scanline data");
                            if (m)
                                for (c = e[a++], p = 0; p < s; p++) l[u++] = c;
                            else l.set(e.subarray(a, a + s), u), u += s, a += s
                        }
                        for (d = g, p = 0; p < d; p++) f = 0, i[o] = l[p + f], f += g, i[o + 1] = l[p + f], f += g, i[o + 2] = l[p + f], f += g, i[o + 3] = l[p + f], o += 4;
                        y--
                    }
                    return i
                }(i.subarray(i.pos), p, d);
            if (-1 !== f) {
                switch (this.type) {
                    case 1009:
                        var m = f,
                            v = 1023,
                            g = 1009;
                        break;
                    case 1015:
                        for (var y = f.length / 4 * 3, x = new Float32Array(y), _ = 0; _ < y; _++) s = x, c = 3 * _, l = void 0, u = void 0, l = (o = f)[(a = 4 * _) + 3], u = Math.pow(2, l - 128) / 255, s[c + 0] = o[a + 0] * u, s[c + 1] = o[a + 1] * u, s[c + 2] = o[a + 2] * u;
                        m = x, v = 1022, g = 1015;
                        break;
                    case 1016:
                        y = f.length / 4 * 3;
                        var b = new Uint16Array(y);
                        for (_ = 0; _ < y; _++) r(f, 4 * _, b, 3 * _);
                        m = b, v = 1022, g = 1016;
                        break;
                    default:
                        console.error("THREE.RGBELoader: unsupported type: ", this.type)
                }
                return {
                    width: p,
                    height: d,
                    data: m,
                    header: h.string,
                    gamma: h.gamma,
                    exposure: h.exposure,
                    format: v,
                    type: g
                }
            }
        }
        return null
    },
    setDataType: function(e) {
        return this.type = e, this
    },
    load: function(e, t, n, r) {
        return ns.prototype.load.call(this, e, (function(e, n) {
            switch (e.type) {
                case 1009:
                    e.encoding = 3002, e.minFilter = 1003, e.magFilter = 1003, e.generateMipmaps = !1, e.flipY = !0;
                    break;
                case 1015:
                case 1016:
                    e.encoding = 3e3, e.minFilter = 1006, e.magFilter = 1006, e.generateMipmaps = !1, e.flipY = !0
            }
            t && t(e, n)
        }), n, r)
    }
});
var lu = function() {
        var e = function() {
                var e = new Ma({
                    uniforms: {
                        roughnessMap: {
                            value: null
                        },
                        normalMap: {
                            value: null
                        },
                        texelSize: {
                            value: new f(1, 1)
                        }
                    },
                    vertexShader: "\nprecision mediump float;\nprecision mediump int;\nattribute vec3 position;\nattribute vec2 uv;\nvarying vec2 vUv;\nvoid main() {\n    vUv = uv;\n    gl_Position = vec4( position, 1.0 );\n}\n              ",
                    fragmentShader: "\nprecision mediump float;\nprecision mediump int;\nvarying vec2 vUv;\nuniform sampler2D roughnessMap;\nuniform sampler2D normalMap;\nuniform vec2 texelSize;\n\n#define ENVMAP_TYPE_CUBE_UV\nvec4 envMapTexelToLinear(vec4 a){return a;}\n#include <cube_uv_reflection_fragment>\n\nfloat roughnessToVariance(float roughness) {\n  float variance = 0.0;\n  if (roughness >= r1) {\n    variance = (r0 - roughness) * (v1 - v0) / (r0 - r1) + v0;\n  } else if (roughness >= r4) {\n    variance = (r1 - roughness) * (v4 - v1) / (r1 - r4) + v1;\n  } else if (roughness >= r5) {\n    variance = (r4 - roughness) * (v5 - v4) / (r4 - r5) + v4;\n  } else {\n    float roughness2 = roughness * roughness;\n    variance = 1.79 * roughness2 * roughness2;\n  }\n  return variance;\n}\nfloat varianceToRoughness(float variance) {\n  float roughness = 0.0;\n  if (variance >= v1) {\n    roughness = (v0 - variance) * (r1 - r0) / (v0 - v1) + r0;\n  } else if (variance >= v4) {\n    roughness = (v1 - variance) * (r4 - r1) / (v1 - v4) + r1;\n  } else if (variance >= v5) {\n    roughness = (v4 - variance) * (r5 - r4) / (v4 - v5) + r4;\n  } else {\n    roughness = pow(0.559 * variance, 0.25);// 0.559 = 1.0 / 1.79\n  }\n  return roughness;\n}\n\nvoid main() {\n    gl_FragColor = texture2D(roughnessMap, vUv, -1.0);\n    if (texelSize.x == 0.0) return;\n    float roughness = gl_FragColor.g;\n    float variance = roughnessToVariance(roughness);\n    vec3 avgNormal;\n    for (float x = -1.0; x < 2.0; x += 2.0) {\n    for (float y = -1.0; y < 2.0; y += 2.0) {\n        vec2 uv = vUv + vec2(x, y) * 0.25 * texelSize;\n        avgNormal += normalize(texture2D(normalMap, uv, -1.0).xyz - 0.5);\n    }\n    }\n    variance += 1.0 - 0.25 * length(avgNormal);\n    gl_FragColor.g = varianceToRoughness(variance);\n}\n              ",
                    blending: 0,
                    depthTest: !1,
                    depthWrite: !1
                });
                return e.type = "RoughnessMipmapper", e
            }(),
            t = new ee;
        t.add(new Ft(new un(2, 2), e));
        var n = new Fs(0, 1, 0, 1, 0, 1),
            r = null,
            i = null,
            o = function(e) {
                (i = e).compile(t, n)
            };
        return o.prototype = {
            constructor: o,
            generateMipmaps: function(o) {
                var {
                    roughnessMap: a,
                    normalMap: s
                } = o;
                if (null != a && null != s && a.generateMipmaps && !o.userData.roughnessUpdated) {
                    o.userData.roughnessUpdated = !0;
                    var c = Math.max(a.image.width, s.image.width),
                        l = Math.max(a.image.height, s.image.height);
                    if (d.isPowerOfTwo(c) && d.isPowerOfTwo(l)) {
                        var u = i.autoClear;
                        if (i.autoClear = !1, null != r && r.width === c && r.height === l || (null != r && r.dispose(), r = new T(c, l, {
                                depthBuffer: !1,
                                stencilBuffer: !1
                            })), c !== a.image.width || l !== a.image.height) {
                            var h = new T(c, l, {
                                minFilter: 1008,
                                depthBuffer: !1,
                                stencilBuffer: !1
                            });
                            h.texture.generateMipmaps = !0, i.setRenderTarget(h), o.roughnessMap = h.texture, o.metalnessMap == a && (o.metalnessMap = o.roughnessMap), o.aoMap == a && (o.aoMap = o.roughnessMap)
                        }
                        i.setRenderTarget(r), e.uniforms.roughnessMap.value = a, e.uniforms.normalMap.value = s;
                        for (var p = i.getPixelRatio(), m = new f(0, 0), v = e.uniforms.texelSize.value, g = 0; c >= 1 && l >= 1; ++g, c /= 2, l /= 2) v.set(1 / c, 1 / l), 0 == g && v.set(0, 0), i.setViewport(m.x, m.y, c / p, l / p), i.render(t, n), i.copyFramebufferToTexture(m, o.roughnessMap, g), e.uniforms.roughnessMap.value = o.roughnessMap;
                        a !== o.roughnessMap && a.dispose(), i.autoClear = u, i.setRenderTarget(null);
                        var y = i.getSize(new f);
                        i.setViewport(0, 0, y.x, y.y)
                    }
                }
            },
            dispose: function() {
                e.dispose(), t.children[0].geometry.dispose(), null != r && r.dispose()
            }
        }, o
    }(),
    uu = function() {
        var e = 0,
            t = document.createElement("div");

        function n(e) {
            return t.appendChild(e.dom), e
        }

        function r(n) {
            for (var r = 0; r < t.children.length; r++) t.children[r].style.display = r === n ? "block" : "none";
            e = n
        }
        t.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", t.addEventListener("click", (function(n) {
            n.preventDefault(), r(++e % t.children.length)
        }), !1);
        var i = (performance || Date).now(),
            o = i,
            a = 0,
            s = n(new uu.Panel("FPS", "#0ff", "#002")),
            c = n(new uu.Panel("MS", "#0f0", "#020"));
        if (self.performance && self.performance.memory) var l = n(new uu.Panel("MB", "#f08", "#201"));
        return r(0), {
            REVISION: 16,
            dom: t,
            addPanel: n,
            showPanel: r,
            begin: function() {
                i = (performance || Date).now()
            },
            end: function() {
                a++;
                var e = (performance || Date).now();
                if (c.update(e - i, 200), e >= o + 1e3 && (s.update(1e3 * a / (e - o), 100), o = e, a = 0, l)) {
                    var t = performance.memory;
                    l.update(t.usedJSHeapSize / 1048576, t.jsHeapSizeLimit / 1048576)
                }
                return e
            },
            update: function() {
                i = this.end()
            },
            domElement: t,
            setMode: r
        }
    };
uu.Panel = function(e, t, n) {
    var r = 1 / 0,
        i = 0,
        o = Math.round,
        a = o(window.devicePixelRatio || 1),
        s = 80 * a,
        c = 48 * a,
        l = 3 * a,
        u = 2 * a,
        h = 3 * a,
        p = 15 * a,
        d = 74 * a,
        f = 30 * a,
        m = document.createElement("canvas");
    m.width = s, m.height = c, m.style.cssText = "width:80px;height:48px";
    var v = m.getContext("2d");
    return v.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif", v.textBaseline = "top", v.fillStyle = n, v.fillRect(0, 0, s, c), v.fillStyle = t, v.fillText(e, l, u), v.fillRect(h, p, d, f), v.fillStyle = n, v.globalAlpha = .9, v.fillRect(h, p, d, f), {
        dom: m,
        update: function(c, g) {
            r = Math.min(r, c), i = Math.max(i, c), v.fillStyle = n, v.globalAlpha = 1, v.fillRect(0, 0, s, p), v.fillStyle = t, v.fillText(o(c) + " " + e + " (" + o(r) + "-" + o(i) + ")", l, u), v.drawImage(m, h + a, p, d - a, f, h, p, d - a, f), v.fillRect(h + d - a, p, a, f), v.fillStyle = n, v.globalAlpha = .9, v.fillRect(h + d - a, p, a, o((1 - c / g) * f))
        }
    }
};
var hu = uu;

function pu(e, t) {
    var n = e.__state.conversionName.toString(),
        r = Math.round(e.r),
        i = Math.round(e.g),
        o = Math.round(e.b),
        a = e.a,
        s = Math.round(e.h),
        c = e.s.toFixed(1),
        l = e.v.toFixed(1);
    if (t || "THREE_CHAR_HEX" === n || "SIX_CHAR_HEX" === n) {
        for (var u = e.hex.toString(16); u.length < 6;) u = "0" + u;
        return "#" + u
    }
    return "CSS_RGB" === n ? "rgb(" + r + "," + i + "," + o + ")" : "CSS_RGBA" === n ? "rgba(" + r + "," + i + "," + o + "," + a + ")" : "HEX" === n ? "0x" + e.hex.toString(16) : "RGB_ARRAY" === n ? "[" + r + "," + i + "," + o + "]" : "RGBA_ARRAY" === n ? "[" + r + "," + i + "," + o + "," + a + "]" : "RGB_OBJ" === n ? "{r:" + r + ",g:" + i + ",b:" + o + "}" : "RGBA_OBJ" === n ? "{r:" + r + ",g:" + i + ",b:" + o + ",a:" + a + "}" : "HSV_OBJ" === n ? "{h:" + s + ",s:" + c + ",v:" + l + "}" : "HSVA_OBJ" === n ? "{h:" + s + ",s:" + c + ",v:" + l + ",a:" + a + "}" : "unknown format"
}
var du = Array.prototype.forEach,
    fu = Array.prototype.slice,
    mu = {
        BREAK: {},
        extend: function(e) {
            return this.each(fu.call(arguments, 1), (function(t) {
                (this.isObject(t) ? Object.keys(t) : []).forEach(function(n) {
                    this.isUndefined(t[n]) || (e[n] = t[n])
                }.bind(this))
            }), this), e
        },
        defaults: function(e) {
            return this.each(fu.call(arguments, 1), (function(t) {
                (this.isObject(t) ? Object.keys(t) : []).forEach(function(n) {
                    this.isUndefined(e[n]) && (e[n] = t[n])
                }.bind(this))
            }), this), e
        },
        compose: function() {
            var e = fu.call(arguments);
            return function() {
                for (var t = fu.call(arguments), n = e.length - 1; n >= 0; n--) t = [e[n].apply(this, t)];
                return t[0]
            }
        },
        each: function(e, t, n) {
            if (e)
                if (du && e.forEach && e.forEach === du) e.forEach(t, n);
                else if (e.length === e.length + 0) {
                var r, i = void 0;
                for (i = 0, r = e.length; i < r; i++)
                    if (i in e && t.call(n, e[i], i) === this.BREAK) return
            } else
                for (var o in e)
                    if (t.call(n, e[o], o) === this.BREAK) return
        },
        defer: function(e) {
            setTimeout(e, 0)
        },
        debounce: function(e, t, n) {
            var r = void 0;
            return function() {
                var i = this,
                    o = arguments;

                function a() {
                    r = null, n || e.apply(i, o)
                }
                var s = n || !r;
                clearTimeout(r), r = setTimeout(a, t), s && e.apply(i, o)
            }
        },
        toArray: function(e) {
            return e.toArray ? e.toArray() : fu.call(e)
        },
        isUndefined: function(e) {
            return void 0 === e
        },
        isNull: function(e) {
            return null === e
        },
        isNaN: function(e) {
            function t(t) {
                return e.apply(this, arguments)
            }
            return t.toString = function() {
                return e.toString()
            }, t
        }((function(e) {
            return isNaN(e)
        })),
        isArray: Array.isArray || function(e) {
            return e.constructor === Array
        },
        isObject: function(e) {
            return e === Object(e)
        },
        isNumber: function(e) {
            return e === e + 0
        },
        isString: function(e) {
            return e === e + ""
        },
        isBoolean: function(e) {
            return !1 === e || !0 === e
        },
        isFunction: function(e) {
            return "[object Function]" === Object.prototype.toString.call(e)
        }
    },
    vu = [{
        litmus: mu.isString,
        conversions: {
            THREE_CHAR_HEX: {
                read: function(e) {
                    var t = e.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
                    return null !== t && {
                        space: "HEX",
                        hex: parseInt("0x" + t[1].toString() + t[1].toString() + t[2].toString() + t[2].toString() + t[3].toString() + t[3].toString(), 0)
                    }
                },
                write: pu
            },
            SIX_CHAR_HEX: {
                read: function(e) {
                    var t = e.match(/^#([A-F0-9]{6})$/i);
                    return null !== t && {
                        space: "HEX",
                        hex: parseInt("0x" + t[1].toString(), 0)
                    }
                },
                write: pu
            },
            CSS_RGB: {
                read: function(e) {
                    var t = e.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                    return null !== t && {
                        space: "RGB",
                        r: parseFloat(t[1]),
                        g: parseFloat(t[2]),
                        b: parseFloat(t[3])
                    }
                },
                write: pu
            },
            CSS_RGBA: {
                read: function(e) {
                    var t = e.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
                    return null !== t && {
                        space: "RGB",
                        r: parseFloat(t[1]),
                        g: parseFloat(t[2]),
                        b: parseFloat(t[3]),
                        a: parseFloat(t[4])
                    }
                },
                write: pu
            }
        }
    }, {
        litmus: mu.isNumber,
        conversions: {
            HEX: {
                read: function(e) {
                    return {
                        space: "HEX",
                        hex: e,
                        conversionName: "HEX"
                    }
                },
                write: function(e) {
                    return e.hex
                }
            }
        }
    }, {
        litmus: mu.isArray,
        conversions: {
            RGB_ARRAY: {
                read: function(e) {
                    return 3 === e.length && {
                        space: "RGB",
                        r: e[0],
                        g: e[1],
                        b: e[2]
                    }
                },
                write: function(e) {
                    return [e.r, e.g, e.b]
                }
            },
            RGBA_ARRAY: {
                read: function(e) {
                    return 4 === e.length && {
                        space: "RGB",
                        r: e[0],
                        g: e[1],
                        b: e[2],
                        a: e[3]
                    }
                },
                write: function(e) {
                    return [e.r, e.g, e.b, e.a]
                }
            }
        }
    }, {
        litmus: mu.isObject,
        conversions: {
            RGBA_OBJ: {
                read: function(e) {
                    return !!(mu.isNumber(e.r) && mu.isNumber(e.g) && mu.isNumber(e.b) && mu.isNumber(e.a)) && {
                        space: "RGB",
                        r: e.r,
                        g: e.g,
                        b: e.b,
                        a: e.a
                    }
                },
                write: function(e) {
                    return {
                        r: e.r,
                        g: e.g,
                        b: e.b,
                        a: e.a
                    }
                }
            },
            RGB_OBJ: {
                read: function(e) {
                    return !!(mu.isNumber(e.r) && mu.isNumber(e.g) && mu.isNumber(e.b)) && {
                        space: "RGB",
                        r: e.r,
                        g: e.g,
                        b: e.b
                    }
                },
                write: function(e) {
                    return {
                        r: e.r,
                        g: e.g,
                        b: e.b
                    }
                }
            },
            HSVA_OBJ: {
                read: function(e) {
                    return !!(mu.isNumber(e.h) && mu.isNumber(e.s) && mu.isNumber(e.v) && mu.isNumber(e.a)) && {
                        space: "HSV",
                        h: e.h,
                        s: e.s,
                        v: e.v,
                        a: e.a
                    }
                },
                write: function(e) {
                    return {
                        h: e.h,
                        s: e.s,
                        v: e.v,
                        a: e.a
                    }
                }
            },
            HSV_OBJ: {
                read: function(e) {
                    return !!(mu.isNumber(e.h) && mu.isNumber(e.s) && mu.isNumber(e.v)) && {
                        space: "HSV",
                        h: e.h,
                        s: e.s,
                        v: e.v
                    }
                },
                write: function(e) {
                    return {
                        h: e.h,
                        s: e.s,
                        v: e.v
                    }
                }
            }
        }
    }],
    gu = void 0,
    yu = void 0,
    xu = function() {
        yu = !1;
        var e = arguments.length > 1 ? mu.toArray(arguments) : arguments[0];
        return mu.each(vu, (function(t) {
            if (t.litmus(e)) return mu.each(t.conversions, (function(t, n) {
                if (gu = t.read(e), !1 === yu && !1 !== gu) return yu = gu, gu.conversionName = n, gu.conversion = t, mu.BREAK
            })), mu.BREAK
        })), yu
    },
    _u = void 0,
    bu = {
        hsv_to_rgb: function(e, t, n) {
            var r = Math.floor(e / 60) % 6,
                i = e / 60 - Math.floor(e / 60),
                o = n * (1 - t),
                a = n * (1 - i * t),
                s = n * (1 - (1 - i) * t),
                c = [
                    [n, s, o],
                    [a, n, o],
                    [o, n, s],
                    [o, a, n],
                    [s, o, n],
                    [n, o, a]
                ][r];
            return {
                r: 255 * c[0],
                g: 255 * c[1],
                b: 255 * c[2]
            }
        },
        rgb_to_hsv: function(e, t, n) {
            var r = Math.min(e, t, n),
                i = Math.max(e, t, n),
                o = i - r,
                a = void 0;
            return 0 === i ? {
                h: NaN,
                s: 0,
                v: 0
            } : (a = e === i ? (t - n) / o : t === i ? 2 + (n - e) / o : 4 + (e - t) / o, (a /= 6) < 0 && (a += 1), {
                h: 360 * a,
                s: o / i,
                v: i / 255
            })
        },
        rgb_to_hex: function(e, t, n) {
            var r = this.hex_with_component(0, 2, e);
            return r = this.hex_with_component(r, 1, t), r = this.hex_with_component(r, 0, n)
        },
        component_from_hex: function(e, t) {
            return e >> 8 * t & 255
        },
        hex_with_component: function(e, t, n) {
            return n << (_u = 8 * t) | e & ~(255 << _u)
        }
    },
    wu = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    },
    Mu = function(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    },
    Su = function() {
        function e(e, t) {
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
            }
        }
        return function(t, n, r) {
            return n && e(t.prototype, n), r && e(t, r), t
        }
    }(),
    Eu = function e(t, n, r) {
        null === t && (t = Function.prototype);
        var i = Object.getOwnPropertyDescriptor(t, n);
        if (void 0 === i) {
            var o = Object.getPrototypeOf(t);
            return null === o ? void 0 : e(o, n, r)
        }
        if ("value" in i) return i.value;
        var a = i.get;
        return void 0 !== a ? a.call(r) : void 0
    },
    Tu = function(e, t) {
        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
        e.prototype = Object.create(t && t.prototype, {
            constructor: {
                value: e,
                enumerable: !1,
                writable: !0,
                configurable: !0
            }
        }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
    },
    Au = function(e, t) {
        if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return !t || "object" != typeof t && "function" != typeof t ? e : t
    },
    Lu = function() {
        function e() {
            if (Mu(this, e), this.__state = xu.apply(this, arguments), !1 === this.__state) throw new Error("Failed to interpret color arguments");
            this.__state.a = this.__state.a || 1
        }
        return Su(e, [{
            key: "toString",
            value: function() {
                return pu(this)
            }
        }, {
            key: "toHexString",
            value: function() {
                return pu(this, !0)
            }
        }, {
            key: "toOriginal",
            value: function() {
                return this.__state.conversion.write(this)
            }
        }]), e
    }();

function Ru(e, t, n) {
    Object.defineProperty(e, t, {
        get: function() {
            return "RGB" === this.__state.space ? this.__state[t] : (Lu.recalculateRGB(this, t, n), this.__state[t])
        },
        set: function(e) {
            "RGB" !== this.__state.space && (Lu.recalculateRGB(this, t, n), this.__state.space = "RGB"), this.__state[t] = e
        }
    })
}

function Pu(e, t) {
    Object.defineProperty(e, t, {
        get: function() {
            return "HSV" === this.__state.space ? this.__state[t] : (Lu.recalculateHSV(this), this.__state[t])
        },
        set: function(e) {
            "HSV" !== this.__state.space && (Lu.recalculateHSV(this), this.__state.space = "HSV"), this.__state[t] = e
        }
    })
}
Lu.recalculateRGB = function(e, t, n) {
    if ("HEX" === e.__state.space) e.__state[t] = bu.component_from_hex(e.__state.hex, n);
    else {
        if ("HSV" !== e.__state.space) throw new Error("Corrupted color state");
        mu.extend(e.__state, bu.hsv_to_rgb(e.__state.h, e.__state.s, e.__state.v))
    }
}, Lu.recalculateHSV = function(e) {
    var t = bu.rgb_to_hsv(e.r, e.g, e.b);
    mu.extend(e.__state, {
        s: t.s,
        v: t.v
    }), mu.isNaN(t.h) ? mu.isUndefined(e.__state.h) && (e.__state.h = 0) : e.__state.h = t.h
}, Lu.COMPONENTS = ["r", "g", "b", "h", "s", "v", "hex", "a"], Ru(Lu.prototype, "r", 2), Ru(Lu.prototype, "g", 1), Ru(Lu.prototype, "b", 0), Pu(Lu.prototype, "h"), Pu(Lu.prototype, "s"), Pu(Lu.prototype, "v"), Object.defineProperty(Lu.prototype, "a", {
    get: function() {
        return this.__state.a
    },
    set: function(e) {
        this.__state.a = e
    }
}), Object.defineProperty(Lu.prototype, "hex", {
    get: function() {
        return "HEX" !== !this.__state.space && (this.__state.hex = bu.rgb_to_hex(this.r, this.g, this.b)), this.__state.hex
    },
    set: function(e) {
        this.__state.space = "HEX", this.__state.hex = e
    }
});
var Cu = function() {
        function e(t, n) {
            Mu(this, e), this.initialValue = t[n], this.domElement = document.createElement("div"), this.object = t, this.property = n, this.__onChange = void 0, this.__onFinishChange = void 0
        }
        return Su(e, [{
            key: "onChange",
            value: function(e) {
                return this.__onChange = e, this
            }
        }, {
            key: "onFinishChange",
            value: function(e) {
                return this.__onFinishChange = e, this
            }
        }, {
            key: "setValue",
            value: function(e) {
                return this.object[this.property] = e, this.__onChange && this.__onChange.call(this, e), this.updateDisplay(), this
            }
        }, {
            key: "getValue",
            value: function() {
                return this.object[this.property]
            }
        }, {
            key: "updateDisplay",
            value: function() {
                return this
            }
        }, {
            key: "isModified",
            value: function() {
                return this.initialValue !== this.getValue()
            }
        }]), e
    }(),
    Ou = {};
mu.each({
    HTMLEvents: ["change"],
    MouseEvents: ["click", "mousemove", "mousedown", "mouseup", "mouseover"],
    KeyboardEvents: ["keydown"]
}, (function(e, t) {
    mu.each(e, (function(e) {
        Ou[e] = t
    }))
}));
var Iu = /(\d+(\.\d+)?)px/;

function Nu(e) {
    if ("0" === e || mu.isUndefined(e)) return 0;
    var t = e.match(Iu);
    return mu.isNull(t) ? 0 : parseFloat(t[1])
}
var Du = {
        makeSelectable: function(e, t) {
            void 0 !== e && void 0 !== e.style && (e.onselectstart = t ? function() {
                return !1
            } : function() {}, e.style.MozUserSelect = t ? "auto" : "none", e.style.KhtmlUserSelect = t ? "auto" : "none", e.unselectable = t ? "on" : "off")
        },
        makeFullscreen: function(e, t, n) {
            var r = n,
                i = t;
            mu.isUndefined(i) && (i = !0), mu.isUndefined(r) && (r = !0), e.style.position = "absolute", i && (e.style.left = 0, e.style.right = 0), r && (e.style.top = 0, e.style.bottom = 0)
        },
        fakeEvent: function(e, t, n, r) {
            var i = n || {},
                o = Ou[t];
            if (!o) throw new Error("Event type " + t + " not supported.");
            var a = document.createEvent(o);
            switch (o) {
                case "MouseEvents":
                    var s = i.x || i.clientX || 0,
                        c = i.y || i.clientY || 0;
                    a.initMouseEvent(t, i.bubbles || !1, i.cancelable || !0, window, i.clickCount || 1, 0, 0, s, c, !1, !1, !1, !1, 0, null);
                    break;
                case "KeyboardEvents":
                    var l = a.initKeyboardEvent || a.initKeyEvent;
                    mu.defaults(i, {
                        cancelable: !0,
                        ctrlKey: !1,
                        altKey: !1,
                        shiftKey: !1,
                        metaKey: !1,
                        keyCode: void 0,
                        charCode: void 0
                    }), l(t, i.bubbles || !1, i.cancelable, window, i.ctrlKey, i.altKey, i.shiftKey, i.metaKey, i.keyCode, i.charCode);
                    break;
                default:
                    a.initEvent(t, i.bubbles || !1, i.cancelable || !0)
            }
            mu.defaults(a, r), e.dispatchEvent(a)
        },
        bind: function(e, t, n, r) {
            var i = r || !1;
            return e.addEventListener ? e.addEventListener(t, n, i) : e.attachEvent && e.attachEvent("on" + t, n), Du
        },
        unbind: function(e, t, n, r) {
            var i = r || !1;
            return e.removeEventListener ? e.removeEventListener(t, n, i) : e.detachEvent && e.detachEvent("on" + t, n), Du
        },
        addClass: function(e, t) {
            if (void 0 === e.className) e.className = t;
            else if (e.className !== t) {
                var n = e.className.split(/ +/); - 1 === n.indexOf(t) && (n.push(t), e.className = n.join(" ").replace(/^\s+/, "").replace(/\s+$/, ""))
            }
            return Du
        },
        removeClass: function(e, t) {
            if (t)
                if (e.className === t) e.removeAttribute("class");
                else {
                    var n = e.className.split(/ +/),
                        r = n.indexOf(t); - 1 !== r && (n.splice(r, 1), e.className = n.join(" "))
                }
            else e.className = void 0;
            return Du
        },
        hasClass: function(e, t) {
            return new RegExp("(?:^|\\s+)" + t + "(?:\\s+|$)").test(e.className) || !1
        },
        getWidth: function(e) {
            var t = getComputedStyle(e);
            return Nu(t["border-left-width"]) + Nu(t["border-right-width"]) + Nu(t["padding-left"]) + Nu(t["padding-right"]) + Nu(t.width)
        },
        getHeight: function(e) {
            var t = getComputedStyle(e);
            return Nu(t["border-top-width"]) + Nu(t["border-bottom-width"]) + Nu(t["padding-top"]) + Nu(t["padding-bottom"]) + Nu(t.height)
        },
        getOffset: function(e) {
            var t = e,
                n = {
                    left: 0,
                    top: 0
                };
            if (t.offsetParent)
                do {
                    n.left += t.offsetLeft, n.top += t.offsetTop, t = t.offsetParent
                } while (t);
            return n
        },
        isActive: function(e) {
            return e === document.activeElement && (e.type || e.href)
        }
    },
    Fu = function(e) {
        function t(e, n) {
            Mu(this, t);
            var r = Au(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                i = r;
            return r.__prev = r.getValue(), r.__checkbox = document.createElement("input"), r.__checkbox.setAttribute("type", "checkbox"), Du.bind(r.__checkbox, "change", (function() {
                i.setValue(!i.__prev)
            }), !1), r.domElement.appendChild(r.__checkbox), r.updateDisplay(), r
        }
        return Tu(t, e), Su(t, [{
            key: "setValue",
            value: function(e) {
                var n = Eu(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setValue", this).call(this, e);
                return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), this.__prev = this.getValue(), n
            }
        }, {
            key: "updateDisplay",
            value: function() {
                return !0 === this.getValue() ? (this.__checkbox.setAttribute("checked", "checked"), this.__checkbox.checked = !0, this.__prev = !0) : (this.__checkbox.checked = !1, this.__prev = !1), Eu(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this)
            }
        }]), t
    }(Cu),
    zu = function(e) {
        function t(e, n, r) {
            Mu(this, t);
            var i = Au(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                o = r,
                a = i;
            if (i.__select = document.createElement("select"), mu.isArray(o)) {
                var s = {};
                mu.each(o, (function(e) {
                    s[e] = e
                })), o = s
            }
            return mu.each(o, (function(e, t) {
                var n = document.createElement("option");
                n.innerHTML = t, n.setAttribute("value", e), a.__select.appendChild(n)
            })), i.updateDisplay(), Du.bind(i.__select, "change", (function() {
                var e = this.options[this.selectedIndex].value;
                a.setValue(e)
            })), i.domElement.appendChild(i.__select), i
        }
        return Tu(t, e), Su(t, [{
            key: "setValue",
            value: function(e) {
                var n = Eu(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setValue", this).call(this, e);
                return this.__onFinishChange && this.__onFinishChange.call(this, this.getValue()), n
            }
        }, {
            key: "updateDisplay",
            value: function() {
                return Du.isActive(this.__select) ? this : (this.__select.value = this.getValue(), Eu(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this))
            }
        }]), t
    }(Cu),
    Uu = function(e) {
        function t(e, n) {
            Mu(this, t);
            var r = Au(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                i = r;

            function o() {
                i.setValue(i.__input.value)
            }
            return r.__input = document.createElement("input"), r.__input.setAttribute("type", "text"), Du.bind(r.__input, "keyup", o), Du.bind(r.__input, "change", o), Du.bind(r.__input, "blur", (function() {
                i.__onFinishChange && i.__onFinishChange.call(i, i.getValue())
            })), Du.bind(r.__input, "keydown", (function(e) {
                13 === e.keyCode && this.blur()
            })), r.updateDisplay(), r.domElement.appendChild(r.__input), r
        }
        return Tu(t, e), Su(t, [{
            key: "updateDisplay",
            value: function() {
                return Du.isActive(this.__input) || (this.__input.value = this.getValue()), Eu(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this)
            }
        }]), t
    }(Cu);

function Bu(e) {
    var t = e.toString();
    return t.indexOf(".") > -1 ? t.length - t.indexOf(".") - 1 : 0
}
var ku = function(e) {
    function t(e, n, r) {
        Mu(this, t);
        var i = Au(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
            o = r || {};
        return i.__min = o.min, i.__max = o.max, i.__step = o.step, mu.isUndefined(i.__step) ? 0 === i.initialValue ? i.__impliedStep = 1 : i.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(i.initialValue)) / Math.LN10)) / 10 : i.__impliedStep = i.__step, i.__precision = Bu(i.__impliedStep), i
    }
    return Tu(t, e), Su(t, [{
        key: "setValue",
        value: function(e) {
            var n = e;
            return void 0 !== this.__min && n < this.__min ? n = this.__min : void 0 !== this.__max && n > this.__max && (n = this.__max), void 0 !== this.__step && n % this.__step != 0 && (n = Math.round(n / this.__step) * this.__step), Eu(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setValue", this).call(this, n)
        }
    }, {
        key: "min",
        value: function(e) {
            return this.__min = e, this
        }
    }, {
        key: "max",
        value: function(e) {
            return this.__max = e, this
        }
    }, {
        key: "step",
        value: function(e) {
            return this.__step = e, this.__impliedStep = e, this.__precision = Bu(e), this
        }
    }]), t
}(Cu);
var Gu = function(e) {
    function t(e, n, r) {
        Mu(this, t);
        var i = Au(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, r));
        i.__truncationSuspended = !1;
        var o = i,
            a = void 0;

        function s() {
            o.__onFinishChange && o.__onFinishChange.call(o, o.getValue())
        }

        function c(e) {
            var t = a - e.clientY;
            o.setValue(o.getValue() + t * o.__impliedStep), a = e.clientY
        }

        function l() {
            Du.unbind(window, "mousemove", c), Du.unbind(window, "mouseup", l), s()
        }
        return i.__input = document.createElement("input"), i.__input.setAttribute("type", "text"), Du.bind(i.__input, "change", (function() {
            var e = parseFloat(o.__input.value);
            mu.isNaN(e) || o.setValue(e)
        })), Du.bind(i.__input, "blur", (function() {
            s()
        })), Du.bind(i.__input, "mousedown", (function(e) {
            Du.bind(window, "mousemove", c), Du.bind(window, "mouseup", l), a = e.clientY
        })), Du.bind(i.__input, "keydown", (function(e) {
            13 === e.keyCode && (o.__truncationSuspended = !0, this.blur(), o.__truncationSuspended = !1, s())
        })), i.updateDisplay(), i.domElement.appendChild(i.__input), i
    }
    return Tu(t, e), Su(t, [{
        key: "updateDisplay",
        value: function() {
            var e, n, r;
            return this.__input.value = this.__truncationSuspended ? this.getValue() : (e = this.getValue(), n = this.__precision, r = Math.pow(10, n), Math.round(e * r) / r), Eu(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this)
        }
    }]), t
}(ku);

function Hu(e, t, n, r, i) {
    return r + (e - t) / (n - t) * (i - r)
}
var ju = function(e) {
        function t(e, n, r, i, o) {
            Mu(this, t);
            var a = Au(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n, {
                    min: r,
                    max: i,
                    step: o
                })),
                s = a;

            function c(e) {
                e.preventDefault();
                var t = s.__background.getBoundingClientRect();
                return s.setValue(Hu(e.clientX, t.left, t.right, s.__min, s.__max)), !1
            }

            function l() {
                Du.unbind(window, "mousemove", c), Du.unbind(window, "mouseup", l), s.__onFinishChange && s.__onFinishChange.call(s, s.getValue())
            }

            function u(e) {
                var t = e.touches[0].clientX,
                    n = s.__background.getBoundingClientRect();
                s.setValue(Hu(t, n.left, n.right, s.__min, s.__max))
            }

            function h() {
                Du.unbind(window, "touchmove", u), Du.unbind(window, "touchend", h), s.__onFinishChange && s.__onFinishChange.call(s, s.getValue())
            }
            return a.__background = document.createElement("div"), a.__foreground = document.createElement("div"), Du.bind(a.__background, "mousedown", (function(e) {
                document.activeElement.blur(), Du.bind(window, "mousemove", c), Du.bind(window, "mouseup", l), c(e)
            })), Du.bind(a.__background, "touchstart", (function(e) {
                if (1 !== e.touches.length) return;
                Du.bind(window, "touchmove", u), Du.bind(window, "touchend", h), u(e)
            })), Du.addClass(a.__background, "slider"), Du.addClass(a.__foreground, "slider-fg"), a.updateDisplay(), a.__background.appendChild(a.__foreground), a.domElement.appendChild(a.__background), a
        }
        return Tu(t, e), Su(t, [{
            key: "updateDisplay",
            value: function() {
                var e = (this.getValue() - this.__min) / (this.__max - this.__min);
                return this.__foreground.style.width = 100 * e + "%", Eu(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateDisplay", this).call(this)
            }
        }]), t
    }(ku),
    Vu = function(e) {
        function t(e, n, r) {
            Mu(this, t);
            var i = Au(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n)),
                o = i;
            return i.__button = document.createElement("div"), i.__button.innerHTML = void 0 === r ? "Fire" : r, Du.bind(i.__button, "click", (function(e) {
                return e.preventDefault(), o.fire(), !1
            })), Du.addClass(i.__button, "button"), i.domElement.appendChild(i.__button), i
        }
        return Tu(t, e), Su(t, [{
            key: "fire",
            value: function() {
                this.__onChange && this.__onChange.call(this), this.getValue().call(this.object), this.__onFinishChange && this.__onFinishChange.call(this, this.getValue())
            }
        }]), t
    }(Cu),
    Wu = function(e) {
        function t(e, n) {
            Mu(this, t);
            var r = Au(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, n));
            r.__color = new Lu(r.getValue()), r.__temp = new Lu(0);
            var i = r;
            r.domElement = document.createElement("div"), Du.makeSelectable(r.domElement, !1), r.__selector = document.createElement("div"), r.__selector.className = "selector", r.__saturation_field = document.createElement("div"), r.__saturation_field.className = "saturation-field", r.__field_knob = document.createElement("div"), r.__field_knob.className = "field-knob", r.__field_knob_border = "2px solid ", r.__hue_knob = document.createElement("div"), r.__hue_knob.className = "hue-knob", r.__hue_field = document.createElement("div"), r.__hue_field.className = "hue-field", r.__input = document.createElement("input"), r.__input.type = "text", r.__input_textShadow = "0 1px 1px ", Du.bind(r.__input, "keydown", (function(e) {
                13 === e.keyCode && h.call(this)
            })), Du.bind(r.__input, "blur", h), Du.bind(r.__selector, "mousedown", (function() {
                Du.addClass(this, "drag").bind(window, "mouseup", (function() {
                    Du.removeClass(i.__selector, "drag")
                }))
            })), Du.bind(r.__selector, "touchstart", (function() {
                Du.addClass(this, "drag").bind(window, "touchend", (function() {
                    Du.removeClass(i.__selector, "drag")
                }))
            }));
            var o, a = document.createElement("div");

            function s(e) {
                d(e), Du.bind(window, "mousemove", d), Du.bind(window, "touchmove", d), Du.bind(window, "mouseup", l), Du.bind(window, "touchend", l)
            }

            function c(e) {
                f(e), Du.bind(window, "mousemove", f), Du.bind(window, "touchmove", f), Du.bind(window, "mouseup", u), Du.bind(window, "touchend", u)
            }

            function l() {
                Du.unbind(window, "mousemove", d), Du.unbind(window, "touchmove", d), Du.unbind(window, "mouseup", l), Du.unbind(window, "touchend", l), p()
            }

            function u() {
                Du.unbind(window, "mousemove", f), Du.unbind(window, "touchmove", f), Du.unbind(window, "mouseup", u), Du.unbind(window, "touchend", u), p()
            }

            function h() {
                var e = xu(this.value);
                !1 !== e ? (i.__color.__state = e, i.setValue(i.__color.toOriginal())) : this.value = i.__color.toString()
            }

            function p() {
                i.__onFinishChange && i.__onFinishChange.call(i, i.__color.toOriginal())
            }

            function d(e) {
                -1 === e.type.indexOf("touch") && e.preventDefault();
                var t = i.__saturation_field.getBoundingClientRect(),
                    n = e.touches && e.touches[0] || e,
                    r = n.clientX,
                    o = n.clientY,
                    a = (r - t.left) / (t.right - t.left),
                    s = 1 - (o - t.top) / (t.bottom - t.top);
                return s > 1 ? s = 1 : s < 0 && (s = 0), a > 1 ? a = 1 : a < 0 && (a = 0), i.__color.v = s, i.__color.s = a, i.setValue(i.__color.toOriginal()), !1
            }

            function f(e) {
                -1 === e.type.indexOf("touch") && e.preventDefault();
                var t = i.__hue_field.getBoundingClientRect(),
                    n = 1 - ((e.touches && e.touches[0] || e).clientY - t.top) / (t.bottom - t.top);
                return n > 1 ? n = 1 : n < 0 && (n = 0), i.__color.h = 360 * n, i.setValue(i.__color.toOriginal()), !1
            }
            return mu.extend(r.__selector.style, {
                width: "122px",
                height: "102px",
                padding: "3px",
                backgroundColor: "#222",
                boxShadow: "0px 1px 3px rgba(0,0,0,0.3)"
            }), mu.extend(r.__field_knob.style, {
                position: "absolute",
                width: "12px",
                height: "12px",
                border: r.__field_knob_border + (r.__color.v < .5 ? "#fff" : "#000"),
                boxShadow: "0px 1px 3px rgba(0,0,0,0.5)",
                borderRadius: "12px",
                zIndex: 1
            }), mu.extend(r.__hue_knob.style, {
                position: "absolute",
                width: "15px",
                height: "2px",
                borderRight: "4px solid #fff",
                zIndex: 1
            }), mu.extend(r.__saturation_field.style, {
                width: "100px",
                height: "100px",
                border: "1px solid #555",
                marginRight: "3px",
                display: "inline-block",
                cursor: "pointer"
            }), mu.extend(a.style, {
                width: "100%",
                height: "100%",
                background: "none"
            }), qu(a, "top", "rgba(0,0,0,0)", "#000"), mu.extend(r.__hue_field.style, {
                width: "15px",
                height: "100px",
                border: "1px solid #555",
                cursor: "ns-resize",
                position: "absolute",
                top: "3px",
                right: "3px"
            }), (o = r.__hue_field).style.background = "", o.style.cssText += "background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);", o.style.cssText += "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", o.style.cssText += "background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", o.style.cssText += "background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", o.style.cssText += "background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);", mu.extend(r.__input.style, {
                outline: "none",
                textAlign: "center",
                color: "#fff",
                border: 0,
                fontWeight: "bold",
                textShadow: r.__input_textShadow + "rgba(0,0,0,0.7)"
            }), Du.bind(r.__saturation_field, "mousedown", s), Du.bind(r.__saturation_field, "touchstart", s), Du.bind(r.__field_knob, "mousedown", s), Du.bind(r.__field_knob, "touchstart", s), Du.bind(r.__hue_field, "mousedown", c), Du.bind(r.__hue_field, "touchstart", c), r.__saturation_field.appendChild(a), r.__selector.appendChild(r.__field_knob), r.__selector.appendChild(r.__saturation_field), r.__selector.appendChild(r.__hue_field), r.__hue_field.appendChild(r.__hue_knob), r.domElement.appendChild(r.__input), r.domElement.appendChild(r.__selector), r.updateDisplay(), r
        }
        return Tu(t, e), Su(t, [{
            key: "updateDisplay",
            value: function() {
                var e = xu(this.getValue());
                if (!1 !== e) {
                    var t = !1;
                    mu.each(Lu.COMPONENTS, (function(n) {
                        if (!mu.isUndefined(e[n]) && !mu.isUndefined(this.__color.__state[n]) && e[n] !== this.__color.__state[n]) return t = !0, {}
                    }), this), t && mu.extend(this.__color.__state, e)
                }
                mu.extend(this.__temp.__state, this.__color.__state), this.__temp.a = 1;
                var n = this.__color.v < .5 || this.__color.s > .5 ? 255 : 0,
                    r = 255 - n;
                mu.extend(this.__field_knob.style, {
                    marginLeft: 100 * this.__color.s - 7 + "px",
                    marginTop: 100 * (1 - this.__color.v) - 7 + "px",
                    backgroundColor: this.__temp.toHexString(),
                    border: this.__field_knob_border + "rgb(" + n + "," + n + "," + n + ")"
                }), this.__hue_knob.style.marginTop = 100 * (1 - this.__color.h / 360) + "px", this.__temp.s = 1, this.__temp.v = 1, qu(this.__saturation_field, "left", "#fff", this.__temp.toHexString()), this.__input.value = this.__color.toString(), mu.extend(this.__input.style, {
                    backgroundColor: this.__color.toHexString(),
                    color: "rgb(" + n + "," + n + "," + n + ")",
                    textShadow: this.__input_textShadow + "rgba(" + r + "," + r + "," + r + ",.7)"
                })
            }
        }]), t
    }(Cu),
    Xu = ["-moz-", "-o-", "-webkit-", "-ms-", ""];

function qu(e, t, n, r) {
    e.style.background = "", mu.each(Xu, (function(i) {
        e.style.cssText += "background: " + i + "linear-gradient(" + t + ", " + n + " 0%, " + r + " 100%); "
    }))
}
var Yu = function(e, t) {
        var n = t || document,
            r = document.createElement("style");
        r.type = "text/css", r.innerHTML = e;
        var i = n.getElementsByTagName("head")[0];
        try {
            i.appendChild(r)
        } catch (e) {}
    },
    Zu = '<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>',
    Ju = function(e, t) {
        var n = e[t];
        return mu.isArray(arguments[2]) || mu.isObject(arguments[2]) ? new zu(e, t, arguments[2]) : mu.isNumber(n) ? mu.isNumber(arguments[2]) && mu.isNumber(arguments[3]) ? mu.isNumber(arguments[4]) ? new ju(e, t, arguments[2], arguments[3], arguments[4]) : new ju(e, t, arguments[2], arguments[3]) : mu.isNumber(arguments[4]) ? new Gu(e, t, {
            min: arguments[2],
            max: arguments[3],
            step: arguments[4]
        }) : new Gu(e, t, {
            min: arguments[2],
            max: arguments[3]
        }) : mu.isString(n) ? new Uu(e, t) : mu.isFunction(n) ? new Vu(e, t, "") : mu.isBoolean(n) ? new Fu(e, t) : null
    };
var Ku = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
        setTimeout(e, 1e3 / 60)
    },
    Qu = function() {
        function e() {
            Mu(this, e), this.backgroundElement = document.createElement("div"), mu.extend(this.backgroundElement.style, {
                backgroundColor: "rgba(0,0,0,0.8)",
                top: 0,
                left: 0,
                display: "none",
                zIndex: "1000",
                opacity: 0,
                WebkitTransition: "opacity 0.2s linear",
                transition: "opacity 0.2s linear"
            }), Du.makeFullscreen(this.backgroundElement), this.backgroundElement.style.position = "fixed", this.domElement = document.createElement("div"), mu.extend(this.domElement.style, {
                position: "fixed",
                display: "none",
                zIndex: "1001",
                opacity: 0,
                WebkitTransition: "-webkit-transform 0.2s ease-out, opacity 0.2s linear",
                transition: "transform 0.2s ease-out, opacity 0.2s linear"
            }), document.body.appendChild(this.backgroundElement), document.body.appendChild(this.domElement);
            var t = this;
            Du.bind(this.backgroundElement, "click", (function() {
                t.hide()
            }))
        }
        return Su(e, [{
            key: "show",
            value: function() {
                var e = this;
                this.backgroundElement.style.display = "block", this.domElement.style.display = "block", this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)", this.layout(), mu.defer((function() {
                    e.backgroundElement.style.opacity = 1, e.domElement.style.opacity = 1, e.domElement.style.webkitTransform = "scale(1)"
                }))
            }
        }, {
            key: "hide",
            value: function() {
                var e = this,
                    t = function t() {
                        e.domElement.style.display = "none", e.backgroundElement.style.display = "none", Du.unbind(e.domElement, "webkitTransitionEnd", t), Du.unbind(e.domElement, "transitionend", t), Du.unbind(e.domElement, "oTransitionEnd", t)
                    };
                Du.bind(this.domElement, "webkitTransitionEnd", t), Du.bind(this.domElement, "transitionend", t), Du.bind(this.domElement, "oTransitionEnd", t), this.backgroundElement.style.opacity = 0, this.domElement.style.opacity = 0, this.domElement.style.webkitTransform = "scale(1.1)"
            }
        }, {
            key: "layout",
            value: function() {
                this.domElement.style.left = window.innerWidth / 2 - Du.getWidth(this.domElement) / 2 + "px", this.domElement.style.top = window.innerHeight / 2 - Du.getHeight(this.domElement) / 2 + "px"
            }
        }]), e
    }();
Yu(function(e) {
    if (e && "undefined" != typeof window) {
        var t = document.createElement("style");
        return t.setAttribute("type", "text/css"), t.innerHTML = e, document.head.appendChild(t), e
    }
}(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n"));
var $u = function() {
        try {
            return !!window.localStorage
        } catch (e) {
            return !1
        }
    }(),
    eh = void 0,
    th = !0,
    nh = void 0,
    rh = !1,
    ih = [],
    oh = function e(t) {
        var n = this,
            r = t || {};
        this.domElement = document.createElement("div"), this.__ul = document.createElement("ul"), this.domElement.appendChild(this.__ul), Du.addClass(this.domElement, "dg"), this.__folders = {}, this.__controllers = [], this.__rememberedObjects = [], this.__rememberedObjectIndecesToControllers = [], this.__listening = [], r = mu.defaults(r, {
            closeOnTop: !1,
            autoPlace: !0,
            width: e.DEFAULT_WIDTH
        }), r = mu.defaults(r, {
            resizable: r.autoPlace,
            hideable: r.autoPlace
        }), mu.isUndefined(r.load) ? r.load = {
            preset: "Default"
        } : r.preset && (r.load.preset = r.preset), mu.isUndefined(r.parent) && r.hideable && ih.push(this), r.resizable = mu.isUndefined(r.parent) && r.resizable, r.autoPlace && mu.isUndefined(r.scrollable) && (r.scrollable = !0);
        var i, o = $u && "true" === localStorage.getItem(hh(this, "isLocal")),
            a = void 0,
            s = void 0;
        if (Object.defineProperties(this, {
                parent: {
                    get: function() {
                        return r.parent
                    }
                },
                scrollable: {
                    get: function() {
                        return r.scrollable
                    }
                },
                autoPlace: {
                    get: function() {
                        return r.autoPlace
                    }
                },
                closeOnTop: {
                    get: function() {
                        return r.closeOnTop
                    }
                },
                preset: {
                    get: function() {
                        return n.parent ? n.getRoot().preset : r.load.preset
                    },
                    set: function(e) {
                        n.parent ? n.getRoot().preset = e : r.load.preset = e,
                            function(e) {
                                for (var t = 0; t < e.__preset_select.length; t++) e.__preset_select[t].value === e.preset && (e.__preset_select.selectedIndex = t)
                            }(this), n.revert()
                    }
                },
                width: {
                    get: function() {
                        return r.width
                    },
                    set: function(e) {
                        r.width = e, vh(n, e)
                    }
                },
                name: {
                    get: function() {
                        return r.name
                    },
                    set: function(e) {
                        r.name = e, s && (s.innerHTML = r.name)
                    }
                },
                closed: {
                    get: function() {
                        return r.closed
                    },
                    set: function(t) {
                        r.closed = t, r.closed ? Du.addClass(n.__ul, e.CLASS_CLOSED) : Du.removeClass(n.__ul, e.CLASS_CLOSED), this.onResize(), n.__closeButton && (n.__closeButton.innerHTML = t ? e.TEXT_OPEN : e.TEXT_CLOSED)
                    }
                },
                load: {
                    get: function() {
                        return r.load
                    }
                },
                useLocalStorage: {
                    get: function() {
                        return o
                    },
                    set: function(e) {
                        $u && (o = e, e ? Du.bind(window, "unload", a) : Du.unbind(window, "unload", a), localStorage.setItem(hh(n, "isLocal"), e))
                    }
                }
            }), mu.isUndefined(r.parent)) {
            if (this.closed = r.closed || !1, Du.addClass(this.domElement, e.CLASS_MAIN), Du.makeSelectable(this.domElement, !1), $u && o) {
                n.useLocalStorage = !0;
                var c = localStorage.getItem(hh(this, "gui"));
                c && (r.load = JSON.parse(c))
            }
            this.__closeButton = document.createElement("div"), this.__closeButton.innerHTML = e.TEXT_CLOSED, Du.addClass(this.__closeButton, e.CLASS_CLOSE_BUTTON), r.closeOnTop ? (Du.addClass(this.__closeButton, e.CLASS_CLOSE_TOP), this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0])) : (Du.addClass(this.__closeButton, e.CLASS_CLOSE_BOTTOM), this.domElement.appendChild(this.__closeButton)), Du.bind(this.__closeButton, "click", (function() {
                n.closed = !n.closed
            }))
        } else {
            void 0 === r.closed && (r.closed = !0);
            var l = document.createTextNode(r.name);
            Du.addClass(l, "controller-name"), s = ah(n, l);
            Du.addClass(this.__ul, e.CLASS_CLOSED), Du.addClass(s, "title"), Du.bind(s, "click", (function(e) {
                return e.preventDefault(), n.closed = !n.closed, !1
            })), r.closed || (this.closed = !1)
        }
        r.autoPlace && (mu.isUndefined(r.parent) && (th && (nh = document.createElement("div"), Du.addClass(nh, "dg"), Du.addClass(nh, e.CLASS_AUTO_PLACE_CONTAINER), document.body.appendChild(nh), th = !1), nh.appendChild(this.domElement), Du.addClass(this.domElement, e.CLASS_AUTO_PLACE)), this.parent || vh(n, r.width)), this.__resizeHandler = function() {
            n.onResizeDebounced()
        }, Du.bind(window, "resize", this.__resizeHandler), Du.bind(this.__ul, "webkitTransitionEnd", this.__resizeHandler), Du.bind(this.__ul, "transitionend", this.__resizeHandler), Du.bind(this.__ul, "oTransitionEnd", this.__resizeHandler), this.onResize(), r.resizable && mh(this), a = function() {
            $u && "true" === localStorage.getItem(hh(n, "isLocal")) && localStorage.setItem(hh(n, "gui"), JSON.stringify(n.getSaveObject()))
        }, this.saveToLocalStorageIfPossible = a, r.parent || ((i = n.getRoot()).width += 1, mu.defer((function() {
            i.width -= 1
        })))
    };

function ah(e, t, n) {
    var r = document.createElement("li");
    return t && r.appendChild(t), n ? e.__ul.insertBefore(r, n) : e.__ul.appendChild(r), e.onResize(), r
}

function sh(e) {
    Du.unbind(window, "resize", e.__resizeHandler), e.saveToLocalStorageIfPossible && Du.unbind(window, "unload", e.saveToLocalStorageIfPossible)
}

function ch(e, t) {
    var n = e.__preset_select[e.__preset_select.selectedIndex];
    n.innerHTML = t ? n.value + "*" : n.value
}

function lh(e, t) {
    var n = e.getRoot(),
        r = n.__rememberedObjects.indexOf(t.object);
    if (-1 !== r) {
        var i = n.__rememberedObjectIndecesToControllers[r];
        if (void 0 === i && (i = {}, n.__rememberedObjectIndecesToControllers[r] = i), i[t.property] = t, n.load && n.load.remembered) {
            var o = n.load.remembered,
                a = void 0;
            if (o[e.preset]) a = o[e.preset];
            else {
                if (!o.Default) return;
                a = o.Default
            }
            if (a[r] && void 0 !== a[r][t.property]) {
                var s = a[r][t.property];
                t.initialValue = s, t.setValue(s)
            }
        }
    }
}

function uh(e, t, n, r) {
    if (void 0 === t[n]) throw new Error('Object "' + t + '" has no property "' + n + '"');
    var i = void 0;
    if (r.color) i = new Wu(t, n);
    else {
        var o = [t, n].concat(r.factoryArgs);
        i = Ju.apply(e, o)
    }
    r.before instanceof Cu && (r.before = r.before.__li), lh(e, i), Du.addClass(i.domElement, "c");
    var a = document.createElement("span");
    Du.addClass(a, "property-name"), a.innerHTML = i.property;
    var s = document.createElement("div");
    s.appendChild(a), s.appendChild(i.domElement);
    var c = ah(e, s, r.before);
    return Du.addClass(c, oh.CLASS_CONTROLLER_ROW), i instanceof Wu ? Du.addClass(c, "color") : Du.addClass(c, wu(i.getValue())),
        function(e, t, n) {
            if (n.__li = t, n.__gui = e, mu.extend(n, {
                    options: function(t) {
                        if (arguments.length > 1) {
                            var r = n.__li.nextElementSibling;
                            return n.remove(), uh(e, n.object, n.property, {
                                before: r,
                                factoryArgs: [mu.toArray(arguments)]
                            })
                        }
                        if (mu.isArray(t) || mu.isObject(t)) {
                            var i = n.__li.nextElementSibling;
                            return n.remove(), uh(e, n.object, n.property, {
                                before: i,
                                factoryArgs: [t]
                            })
                        }
                    },
                    name: function(e) {
                        return n.__li.firstElementChild.firstElementChild.innerHTML = e, n
                    },
                    listen: function() {
                        return n.__gui.listen(n), n
                    },
                    remove: function() {
                        return n.__gui.remove(n), n
                    }
                }), n instanceof ju) {
                var r = new Gu(n.object, n.property, {
                    min: n.__min,
                    max: n.__max,
                    step: n.__step
                });
                mu.each(["updateDisplay", "onChange", "onFinishChange", "step", "min", "max"], (function(e) {
                    var t = n[e],
                        i = r[e];
                    n[e] = r[e] = function() {
                        var e = Array.prototype.slice.call(arguments);
                        return i.apply(r, e), t.apply(n, e)
                    }
                })), Du.addClass(t, "has-slider"), n.domElement.insertBefore(r.domElement, n.domElement.firstElementChild)
            } else if (n instanceof Gu) {
                var i = function(t) {
                    if (mu.isNumber(n.__min) && mu.isNumber(n.__max)) {
                        var r = n.__li.firstElementChild.firstElementChild.innerHTML,
                            i = n.__gui.__listening.indexOf(n) > -1;
                        n.remove();
                        var o = uh(e, n.object, n.property, {
                            before: n.__li.nextElementSibling,
                            factoryArgs: [n.__min, n.__max, n.__step]
                        });
                        return o.name(r), i && o.listen(), o
                    }
                    return t
                };
                n.min = mu.compose(i, n.min), n.max = mu.compose(i, n.max)
            } else n instanceof Fu ? (Du.bind(t, "click", (function() {
                Du.fakeEvent(n.__checkbox, "click")
            })), Du.bind(n.__checkbox, "click", (function(e) {
                e.stopPropagation()
            }))) : n instanceof Vu ? (Du.bind(t, "click", (function() {
                Du.fakeEvent(n.__button, "click")
            })), Du.bind(t, "mouseover", (function() {
                Du.addClass(n.__button, "hover")
            })), Du.bind(t, "mouseout", (function() {
                Du.removeClass(n.__button, "hover")
            }))) : n instanceof Wu && (Du.addClass(t, "color"), n.updateDisplay = mu.compose((function(e) {
                return t.style.borderLeftColor = n.__color.toString(), e
            }), n.updateDisplay), n.updateDisplay());
            n.setValue = mu.compose((function(t) {
                return e.getRoot().__preset_select && n.isModified() && ch(e.getRoot(), !0), t
            }), n.setValue)
        }(e, c, i), e.__controllers.push(i), i
}

function hh(e, t) {
    return document.location.href + "." + t
}

function ph(e, t, n) {
    var r = document.createElement("option");
    r.innerHTML = t, r.value = t, e.__preset_select.appendChild(r), n && (e.__preset_select.selectedIndex = e.__preset_select.length - 1)
}

function dh(e, t) {
    t.style.display = e.useLocalStorage ? "block" : "none"
}

function fh(e) {
    var t = e.__save_row = document.createElement("li");
    Du.addClass(e.domElement, "has-save"), e.__ul.insertBefore(t, e.__ul.firstChild), Du.addClass(t, "save-row");
    var n = document.createElement("span");
    n.innerHTML = "&nbsp;", Du.addClass(n, "button gears");
    var r = document.createElement("span");
    r.innerHTML = "Save", Du.addClass(r, "button"), Du.addClass(r, "save");
    var i = document.createElement("span");
    i.innerHTML = "New", Du.addClass(i, "button"), Du.addClass(i, "save-as");
    var o = document.createElement("span");
    o.innerHTML = "Revert", Du.addClass(o, "button"), Du.addClass(o, "revert");
    var a = e.__preset_select = document.createElement("select");
    if (e.load && e.load.remembered ? mu.each(e.load.remembered, (function(t, n) {
            ph(e, n, n === e.preset)
        })) : ph(e, "Default", !1), Du.bind(a, "change", (function() {
            for (var t = 0; t < e.__preset_select.length; t++) e.__preset_select[t].innerHTML = e.__preset_select[t].value;
            e.preset = this.value
        })), t.appendChild(a), t.appendChild(n), t.appendChild(r), t.appendChild(i), t.appendChild(o), $u) {
        var s = document.getElementById("dg-local-explain"),
            c = document.getElementById("dg-local-storage");
        document.getElementById("dg-save-locally").style.display = "block", "true" === localStorage.getItem(hh(0, "isLocal")) && c.setAttribute("checked", "checked"), dh(e, s), Du.bind(c, "change", (function() {
            e.useLocalStorage = !e.useLocalStorage, dh(e, s)
        }))
    }
    var l = document.getElementById("dg-new-constructor");
    Du.bind(l, "keydown", (function(e) {
        !e.metaKey || 67 !== e.which && 67 !== e.keyCode || eh.hide()
    })), Du.bind(n, "click", (function() {
        l.innerHTML = JSON.stringify(e.getSaveObject(), void 0, 2), eh.show(), l.focus(), l.select()
    })), Du.bind(r, "click", (function() {
        e.save()
    })), Du.bind(i, "click", (function() {
        var t = prompt("Enter a new preset name.");
        t && e.saveAs(t)
    })), Du.bind(o, "click", (function() {
        e.revert()
    }))
}

function mh(e) {
    var t = void 0;

    function n(n) {
        return n.preventDefault(), e.width += t - n.clientX, e.onResize(), t = n.clientX, !1
    }

    function r() {
        Du.removeClass(e.__closeButton, oh.CLASS_DRAG), Du.unbind(window, "mousemove", n), Du.unbind(window, "mouseup", r)
    }

    function i(i) {
        return i.preventDefault(), t = i.clientX, Du.addClass(e.__closeButton, oh.CLASS_DRAG), Du.bind(window, "mousemove", n), Du.bind(window, "mouseup", r), !1
    }
    e.__resize_handle = document.createElement("div"), mu.extend(e.__resize_handle.style, {
        width: "6px",
        marginLeft: "-3px",
        height: "200px",
        cursor: "ew-resize",
        position: "absolute"
    }), Du.bind(e.__resize_handle, "mousedown", i), Du.bind(e.__closeButton, "mousedown", i), e.domElement.insertBefore(e.__resize_handle, e.domElement.firstElementChild)
}

function vh(e, t) {
    e.domElement.style.width = t + "px", e.__save_row && e.autoPlace && (e.__save_row.style.width = t + "px"), e.__closeButton && (e.__closeButton.style.width = t + "px")
}

function gh(e, t) {
    var n = {};
    return mu.each(e.__rememberedObjects, (function(r, i) {
        var o = {},
            a = e.__rememberedObjectIndecesToControllers[i];
        mu.each(a, (function(e, n) {
            o[n] = t ? e.initialValue : e.getValue()
        })), n[i] = o
    })), n
}
oh.toggleHide = function() {
    rh = !rh, mu.each(ih, (function(e) {
        e.domElement.style.display = rh ? "none" : ""
    }))
}, oh.CLASS_AUTO_PLACE = "a", oh.CLASS_AUTO_PLACE_CONTAINER = "ac", oh.CLASS_MAIN = "main", oh.CLASS_CONTROLLER_ROW = "cr", oh.CLASS_TOO_TALL = "taller-than-window", oh.CLASS_CLOSED = "closed", oh.CLASS_CLOSE_BUTTON = "close-button", oh.CLASS_CLOSE_TOP = "close-top", oh.CLASS_CLOSE_BOTTOM = "close-bottom", oh.CLASS_DRAG = "drag", oh.DEFAULT_WIDTH = 245, oh.TEXT_CLOSED = "Close Controls", oh.TEXT_OPEN = "Open Controls", oh._keydownHandler = function(e) {
    "text" === document.activeElement.type || 72 !== e.which && 72 !== e.keyCode || oh.toggleHide()
}, Du.bind(window, "keydown", oh._keydownHandler, !1), mu.extend(oh.prototype, {
    add: function(e, t) {
        return uh(this, e, t, {
            factoryArgs: Array.prototype.slice.call(arguments, 2)
        })
    },
    addColor: function(e, t) {
        return uh(this, e, t, {
            color: !0
        })
    },
    remove: function(e) {
        this.__ul.removeChild(e.__li), this.__controllers.splice(this.__controllers.indexOf(e), 1);
        var t = this;
        mu.defer((function() {
            t.onResize()
        }))
    },
    destroy: function() {
        if (this.parent) throw new Error("Only the root GUI should be removed with .destroy(). For subfolders, use gui.removeFolder(folder) instead.");
        this.autoPlace && nh.removeChild(this.domElement);
        var e = this;
        mu.each(this.__folders, (function(t) {
            e.removeFolder(t)
        })), Du.unbind(window, "keydown", oh._keydownHandler, !1), sh(this)
    },
    addFolder: function(e) {
        if (void 0 !== this.__folders[e]) throw new Error('You already have a folder in this GUI by the name "' + e + '"');
        var t = {
            name: e,
            parent: this
        };
        t.autoPlace = this.autoPlace, this.load && this.load.folders && this.load.folders[e] && (t.closed = this.load.folders[e].closed, t.load = this.load.folders[e]);
        var n = new oh(t);
        this.__folders[e] = n;
        var r = ah(this, n.domElement);
        return Du.addClass(r, "folder"), n
    },
    removeFolder: function(e) {
        this.__ul.removeChild(e.domElement.parentElement), delete this.__folders[e.name], this.load && this.load.folders && this.load.folders[e.name] && delete this.load.folders[e.name], sh(e);
        var t = this;
        mu.each(e.__folders, (function(t) {
            e.removeFolder(t)
        })), mu.defer((function() {
            t.onResize()
        }))
    },
    open: function() {
        this.closed = !1
    },
    close: function() {
        this.closed = !0
    },
    hide: function() {
        this.domElement.style.display = "none"
    },
    show: function() {
        this.domElement.style.display = ""
    },
    onResize: function() {
        var e = this.getRoot();
        if (e.scrollable) {
            var t = Du.getOffset(e.__ul).top,
                n = 0;
            mu.each(e.__ul.childNodes, (function(t) {
                e.autoPlace && t === e.__save_row || (n += Du.getHeight(t))
            })), window.innerHeight - t - 20 < n ? (Du.addClass(e.domElement, oh.CLASS_TOO_TALL), e.__ul.style.height = window.innerHeight - t - 20 + "px") : (Du.removeClass(e.domElement, oh.CLASS_TOO_TALL), e.__ul.style.height = "auto")
        }
        e.__resize_handle && mu.defer((function() {
            e.__resize_handle.style.height = e.__ul.offsetHeight + "px"
        })), e.__closeButton && (e.__closeButton.style.width = e.width + "px")
    },
    onResizeDebounced: mu.debounce((function() {
        this.onResize()
    }), 50),
    remember: function() {
        if (mu.isUndefined(eh) && ((eh = new Qu).domElement.innerHTML = Zu), this.parent) throw new Error("You can only call remember on a top level GUI.");
        var e = this;
        mu.each(Array.prototype.slice.call(arguments), (function(t) {
            0 === e.__rememberedObjects.length && fh(e), -1 === e.__rememberedObjects.indexOf(t) && e.__rememberedObjects.push(t)
        })), this.autoPlace && vh(this, this.width)
    },
    getRoot: function() {
        for (var e = this; e.parent;) e = e.parent;
        return e
    },
    getSaveObject: function() {
        var e = this.load;
        return e.closed = this.closed, this.__rememberedObjects.length > 0 && (e.preset = this.preset, e.remembered || (e.remembered = {}), e.remembered[this.preset] = gh(this)), e.folders = {}, mu.each(this.__folders, (function(t, n) {
            e.folders[n] = t.getSaveObject()
        })), e
    },
    save: function() {
        this.load.remembered || (this.load.remembered = {}), this.load.remembered[this.preset] = gh(this), ch(this, !1), this.saveToLocalStorageIfPossible()
    },
    saveAs: function(e) {
        this.load.remembered || (this.load.remembered = {}, this.load.remembered.Default = gh(this, !0)), this.load.remembered[e] = gh(this), this.preset = e, ph(this, e, !0), this.saveToLocalStorageIfPossible()
    },
    revert: function(e) {
        mu.each(this.__controllers, (function(t) {
            this.getRoot().load.remembered ? lh(e || this.getRoot(), t) : t.setValue(t.initialValue), t.__onFinishChange && t.__onFinishChange.call(t, t.getValue())
        }), this), mu.each(this.__folders, (function(e) {
            e.revert(e)
        })), e || ch(this.getRoot(), !1)
    },
    listen: function(e) {
        var t = 0 === this.__listening.length;
        this.__listening.push(e), t && function e(t) {
            0 !== t.length && Ku.call(window, (function() {
                e(t)
            }));
            mu.each(t, (function(e) {
                e.updateDisplay()
            }))
        }(this.__listening)
    },
    updateDisplay: function() {
        mu.each(this.__controllers, (function(e) {
            e.updateDisplay()
        })), mu.each(this.__folders, (function(e) {
            e.updateDisplay()
        }))
    }
});
var yh, xh, _h, bh, wh, Mh, Sh, Eh, Th, Ah, Lh = new oh({
    autoPlace: !0,
    name: "Develop GUI"
});

function Rh(e) {
    for (var t in e.__controllers) e.__controllers[t].updateDisplay();
    for (var n in e.__folders) Rh(e.__folders[n])
}

function Ph() {
    bh.aspect = window.innerWidth / window.innerHeight, bh.updateProjectionMatrix(), Mh.setSize(window.innerWidth, window.innerHeight)
}! function() {
    (yh = document.createElement("div")).width = 800 * window.devicePixelRatio, document.body.appendChild(yh), yh.class = "sceneididid", console.info(yh.class), console.info(document.body), console.info(window), console.info(window.inn), console.info("container.id: ", yh.id), console.info(yh.innerHTML), (bh = new Jt(45, window.innerWidth / window.innerHeight, .25, 100)).position.set(5, 6, 11), wh = new ee, (Sh = new cu).setDataType(1009), Sh.load("https://raw.githubusercontent.com/bulycheff/promm/canvas_experiment/src/assets/hamburg_hbf_2k.hdr", (function(t) {
        var n = e.fromEquirectangular(t).texture;
        e.dispose(), wh.background = new Ve(5594718), wh.environment = n;
        var r = new lu(Mh);
        (new ou).load("https://raw.githubusercontent.com/bulycheff/promm/canvas_experiment/src/assets/models/machine.gltf", (function(e) {
            e.scene.traverse((function(e) {
                e.isMesh && r.generateMipmaps(e.material)
            })), wh.add(e.scene), console.info("gltf.scene: ", e.scene), r.dispose(), Eh = e.scene.getObjectByName("head"), Th = e.scene.getObjectByName("bridge"), console.log("Dump Obj bridge ...", function e(t) {
                var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
                    r = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
                    i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "",
                    o = r ? "└─" : "├─";
                n.push("".concat(i).concat(i ? o : "").concat(t.name || "*no-name*", " [").concat(t.type, "]"));
                var a = i + (r ? "  " : "│ "),
                    s = t.children.length - 1;
                return t.children.forEach((function(t, r) {
                    e(t, n, r === s, a)
                })), n
            }(Th).join("\n")), Ah = e.scene.getObjectByName("LCM_laserhead_low");
            var t = new function(e) {
                var t, n = {
                    lightcolor: e
                };
                this.addGUI = function() {
                    var e = Lh.addFolder("LIGHT");
                    e.add(o.position, "x", -.7, .7, .01), e.add(o.position, "y", .5, 1.5, .01), e.add(o.position, "z", -1.1, 1.9, .01), e.addColor(n, "lightcolor").name("LIGHT").onChange((function() {
                        o.color.set(n.lightcolor), i.color.set(n.lightcolor)
                    })), e.add(o, "visible"), e.open(), console.info(e.__controllers), console.info(e.updateDisplay())
                }, this.visible = function(e) {
                    o.visible = !!e
                }, this.lightcolor = t = e, this.changecolor = function(e) {
                    o.color.set(e), i.color.set(e)
                }, this.setPositionXZ = function(e, t) {
                    o.position.x = e, o.position.z = t + .21
                }, this.setIntens = function(e) {
                    o.intensity = e
                };
                var r = new aa(.005, 16, 16),
                    i = new Ke({
                        color: t
                    }),
                    o = new Ds(t, 10, 1e5);
                console.log("Date"), console.log(Date.now()), console.log(Math.sin(Date.now())), o.add(new Ft(r, i)), o.position.x = 0, o.position.y = .95, o.position.z = .21, console.info("light1 intensity: ", o.intensity), this.continueblink = function() {
                    var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    return e
                }, this.blinking = function() {}, o.visible = !1, wh.add(o)
            }("#EDD175");
            t.visible(1), t.addGUI(), t.setIntens(50), t.blinking(), (n = Lh.addFolder("BRIDGE")).add(Th.position, "z", -1.1, 1.9, .01).onChange((function() {
                t.setPositionXZ(Eh.position.x, Th.position.z)
            })), n.open();
            var n = Lh.addFolder("HEAD");
            n.add(Eh.position, "x", -.7, .7, .01).onChange((function() {
                t.setPositionXZ(Eh.position.x, Th.position.z)
            })), n.open(), (n = Lh.addFolder("LASER HEAD")).add(Ah.position, "y", -.07, 0, .001), n.open();
            var i = {
                "move head": function() {
                    a(.63, 1.77)
                },
                "set to null coord": function() {
                    a(0, 0)
                },
                "draw line 1": function() {
                    s(.5, -.5)
                },
                "draw line 2": function() {
                    s(-.5, -.5)
                },
                "draw line 3": function() {
                    s(-.5, .5)
                },
                "draw square": function() {
                    var e = -.65,
                        t = -.95;
                    h(e, t, .11).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e = -.65, t += .13, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    })).then((function() {
                        return h(e += .13, t, .11)
                    }))
                }
            };
            n.add(i, "move head"), n.add(i, "set to null coord"), n.add(i, "draw line 1"), n.add(i, "draw line 2"), n.add(i, "draw line 3"), n.add(i, "draw square"), (n = Lh.addFolder("LASERHEAD UP / DOWN")).open();
            var o = {
                "laserhead down": function() {
                    l()
                },
                "laserhead up": function() {
                    u()
                }
            };
            n.add(o, "laserhead up"), n.add(o, "laserhead down");
            var a = function(e, n) {
                    return new Promise((function(r) {
                        ! function i() {
                            Math.round(100 * (Th.position.z - n)) / 100 < 0 ? Th.position.z += .01 : Math.round(100 * (Th.position.z - n)) / 100 > 0 && (Th.position.z -= .01), Th.position.z = Math.round(100 * Th.position.z) / 100, Math.round(100 * (Eh.position.x - e)) / 100 < 0 ? Eh.position.x += .01 : Math.round(100 * (Eh.position.x - e)) / 100 > 0 && (Eh.position.x -= .01), Eh.position.x = Math.round(100 * Eh.position.x) / 100, t.setPositionXZ(Eh.position.x, Th.position.z), Math.abs(Th.position.z - n).toFixed(2) >= .01 || Math.abs(Eh.position.x - e).toFixed(2) >= .01 ? (Rh(Lh), requestAnimationFrame(i)) : (Eh.position.x = e, Th.position.z = n, r())
                        }()
                    }))
                },
                s = function(e, n) {
                    return new Promise((function(r) {
                        var i, o, a, s;
                        Math.sqrt(Math.pow(Eh.position.x - e, 2) + Math.pow(Th.position.z - n, 2)), i = e - Eh.position.x, o = n - Th.position.z, a = Math.sign(i) * (5 * .00141421356) * Math.abs(Math.cos(Math.atan(o / i))), s = Math.sign(o) * (5 * .00141421356) * Math.abs(Math.sin(Math.atan(o / i)));
                        ! function i() {
                            Eh.position.x += a, Th.position.z += s, t.setPositionXZ(Eh.position.x, Th.position.z), Math.abs(Eh.position.x - e) > Math.abs(a) && 0 != a || Math.abs(Th.position.z - n) > Math.abs(s) && 0 != s ? (Rh(Lh), requestAnimationFrame(i)) : (Eh.position.x = e, Th.position.z = n, t.setPositionXZ(Eh.position.x, Th.position.z), r())
                        }()
                    }))
                },
                c = function(e) {
                    return new Promise((function(n) {
                        ! function r() {
                            Math.round(200 * (Ah.position.y - e)) / 200 < 0 ? Ah.position.y += .005 : Math.round(200 * (Ah.position.y - e)) / 200 > 0 && (Ah.position.y -= .005), Ah.position.y = Math.round(200 * Ah.position.y) / 200, Ah.position.y <= -.065 ? (t.setPositionXZ(Eh.position.x, Th.position.z), t.visible(1)) : Ah.position.y > -.065 && t.visible(0), Math.abs(Ah.position.y - e) >= .005 ? (Rh(Lh), requestAnimationFrame(r)) : (Ah.position.y = e, n())
                        }()
                    }))
                },
                l = function() {
                    return c(-.065)
                },
                u = function() {
                    return c(0)
                },
                h = function(e, t, n) {
                    return new Promise((function(r) {
                        a(e, t).then((function() {
                            return l()
                        })).then((function() {
                            return s(e + n, t)
                        })).then((function() {
                            return s(e + n, t + n)
                        })).then((function() {
                            return s(e, t + n)
                        })).then((function() {
                            return s(e, t)
                        })).then((function() {
                            return u()
                        })).then((function() {
                            r()
                        }))
                    }))
                }
        }))
    })), (Mh = new oi({
        antialias: !0
    })).setPixelRatio(window.devicePixelRatio), Mh.setSize(window.innerWidth, window.innerHeight), Mh.toneMapping = 5, Mh.outputEncoding = 3001, Mh.setClearColor(12438726, .1), yh.appendChild(Mh.domElement);
    var e = new Wl(Mh);
    e.compileEquirectangularShader(), (_h = new au(bh, Mh.domElement)).target.set(0, 0, -1), _h.update(), window.addEventListener("resize", Ph, !1), xh = new hu, yh.appendChild(xh.dom)
}(), Lh.domElement.id = "gui",
    function e() {
        Rh(Lh), requestAnimationFrame(e), Mh.render(wh, bh), _h.update(), xh.update()
    }()
}]);