// 小山影视 (43.248.128.122:578) - TVBox QuickJS, 登录+握手+票根取流 琉芸JS版
var CONFIG = {
    base: 'http://43.248.128.122:578',
    username: 'sukeke',
    password: 'sukeke.1',
    device_id: 'de94cd65-a825-4972-adf9-7dbece13e9f1',
    timeout: 30000,
    user_agent: 'Mozilla/5.0 (Linux; Android 12) okhttp/3.12.1',
    page_size: 20,
    auto_fallback: 1
};
var DESC_PREFIX = '【琉🔹芸❤广告勿信👉剧情】📢';
var KNOWN_TYPES = [[1, '电影'], [2, '连续剧'], [3, '综艺'], [4, '动漫'], [20, '短剧'], [21, '少儿'], [22, '漫剧'], [23, '纪录片']];
var INIT_FILLER = { sign: 's', signature: 's', app_id: '1', app_key: '1', app_version: '1.0', version: '1', platform: 'android', device: 'android', version_code: 1, uid: '1', source_id: '1', site_id: '1', type: '1' };

var BASE = CONFIG.base;
var DEVICE_ID = CONFIG.device_id;
var _jwt = '', _sessionId = '', _signKey = '';
var _lines = [];   // 上次详情线路顺序 (降级用)
var _tkmap = {};   // tk -> {name, code, ep}

function withPrefix(s) {
    s = String(s || '');
    if (s.indexOf(DESC_PREFIX) === 0) return s;
    return DESC_PREFIX + s;
}

function uuidHex() {
    var s = '';
    for (var i = 0; i < 32; i++) s += '0123456789abcdef'.charAt(Math.floor(Math.random() * 16));
    return s;
}

function headers(extra) {
    var h = { 'User-Agent': CONFIG.user_agent };
    if (_jwt) h['Authorization'] = 'Bearer ' + _jwt;
    if (_sessionId) h['X-Session-Id'] = _sessionId;
    if (extra) { for (var k in extra) h[k] = extra[k]; }
    return h;
}

function apiGet(path, params) {
    var url = path.indexOf('http') === 0 ? path : BASE + path;
    if (params) {
        var qs = [];
        for (var k in params) qs.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
        url += '?' + qs.join('&');
    }
    try {
        var r = req(url, { headers: headers(), timeout: CONFIG.timeout });
        return JSON.parse((r && r.content) || '{}');
    } catch (e) {
        return { code: 0, msg: '请求失败' };
    }
}

function apiPost(path, payload) {
    var url = path.indexOf('http') === 0 ? path : BASE + path;
    try {
        var h = headers();
        h['Content-Type'] = 'application/json';
        var r = req(url, { method: 'post', data: payload, postType: 'json', headers: h, timeout: CONFIG.timeout });
        return JSON.parse((r && r.content) || '{}');
    } catch (e) {
        return { code: 0, msg: '请求失败' };
    }
}

function getText(url, referer) {
    try {
        var h = headers();
        h['Referer'] = referer || 'https://www.google.com/';
        var r = req(url, { headers: h, timeout: CONFIG.timeout });
        return (r && r.content) || '';
    } catch (e) {
        return '';
    }
}

// ================= 会话 =================
function login() {
    var r = apiPost('/api/v1/user/login', {
        Username: CONFIG.username,
        Password: CONFIG.password,
        device_id: DEVICE_ID
    });
    if (r.code === 1 && r.data && r.data.token) {
        _jwt = r.data.token;
        return true;
    }
    return false;
}

function handshake() {
    var ch = apiGet('/api/v1/security/challenge');
    if (ch.code !== 1 || !ch.data) return false;
    var challenge = ch.data.challenge, cid = ch.data.challenge_id;
    if (!challenge || !cid) return false;
    var payload = {
        challenge: challenge,
        challenge_id: cid,
        device_id: DEVICE_ID,
        token: _jwt,
        client_token: '',
        timestamp: Math.floor(Date.now() / 1000),
        nonce: uuidHex(),
        username: CONFIG.username,
        password: CONFIG.password
    };
    for (var k in INIT_FILLER) payload[k] = INIT_FILLER[k];
    var r = apiPost('/api/v1/security/init', payload);
    if (r.code === 1 && r.data) {
        _sessionId = r.data.session_id || '';
        _signKey = r.data.sign_key || '';
        return !!_sessionId;
    }
    return false;
}

function ensureSession() {
    if (!_jwt && !login()) return false;
    if (!_sessionId && !handshake()) return false;
    return true;
}

// ================= 列表 =================
function apiSearch(wd, page, typeId) {
    var params = { wd: wd, page: page };
    if (typeId) params.type = typeId;
    var r = apiGet('/api/v1/search', params);
    // 限流时重试一次
    if (r.code !== 1) {
        var msg = String(r.msg || '');
        if (msg.indexOf('频繁') !== -1 || msg.toLowerCase().indexOf('rate') !== -1) {
            r = apiGet('/api/v1/search', params);
        }
    }
    if (r.code !== 1) return { hits: [], pages: 1, total: 0 };
    var data = r.data || {};
    return {
        hits: data.hits || [],
        pages: parseInt(data.total_pages, 10) || 1,
        total: parseInt(data.total, 10) || 0
    };
}

function toItem(it) {
    return {
        vod_id: String(it.vod_id || ''),
        vod_name: String(it.vod_name || ''),
        vod_pic: String(it.vod_pic || ''),
        vod_remarks: String(it.vod_remarks || ''),
        vod_year: String(it.vod_year || ''),
        vod_area: String(it.vod_area || ''),
        vod_class: String(it.vod_class || '')
    };
}

// ================= 票据 =================
function b64UrlDecode(str) {
    var B64C = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var s = String(str || '').replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bytes = [], i = 0;
    while (i < s.length) {
        var e1 = B64C.indexOf(s.charAt(i++));
        var e2 = B64C.indexOf(s.charAt(i++));
        var c3 = s.charAt(i++), c4 = s.charAt(i++);
        var e3 = c3 === '=' ? 64 : B64C.indexOf(c3);
        var e4 = c4 === '=' ? 64 : B64C.indexOf(c4);
        if (e1 < 0 || e2 < 0) return '';
        var n = (e1 << 18) | (e2 << 12) | ((e3 & 63) << 6) | (e4 & 63);
        bytes.push((n >> 16) & 255);
        if (e3 !== 64) bytes.push((n >> 8) & 255);
        if (e4 !== 64) bytes.push(n & 255);
    }
    var out = '', k = 0;
    while (k < bytes.length) {
        var b = bytes[k++];
        if (b < 128) out += String.fromCharCode(b);
        else if (b < 224) out += String.fromCharCode(((b & 31) << 6) | (bytes[k++] & 63));
        else if (b < 240) out += String.fromCharCode(((b & 15) << 12) | ((bytes[k++] & 63) << 6) | (bytes[k++] & 63));
        else { var cp = ((b & 7) << 18) | ((bytes[k++] & 63) << 12) | ((bytes[k++] & 63) << 6) | (bytes[k++] & 63); cp -= 0x10000; out += String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 1023)); }
    }
    return out;
}

function decodeTicket(ticket) {
    try {
        var seg = String(ticket).split('.')[0];
        return JSON.parse(b64UrlDecode(seg));
    } catch (e) {
        return null;
    }
}

function getTicket(tk) {
    var r = apiPost('/api/v1/vod/ticket', { token: tk });
    if (r.code === 1 && r.data) return r.data.ticket || null;
    return null;
}

function tryJson(text) {
    try {
        var t = String(text || '').replace(/^\s+|\s+$/g, '');
        if (t.charAt(0) === '{' || t.charAt(0) === '[') return JSON.parse(t);
    } catch (e) { }
    return null;
}

// tk票根 -> 真实播放地址
function resolve(tk) {
    var ticket = getTicket(tk);
    if (!ticket) return null;
    var pl = decodeTicket(ticket);
    if (!pl) return null;
    var d = pl.data || {};
    var api = String(d.parse_api || '').replace(/\\u00026/g, '&');
    var du = String(d.url || '');
    if (!api || !du) return null;

    var target;
    if (api.charAt(0) === '/') {
        // 服务端本地解析
        target = BASE + api + encodeURIComponent(du);
    } else if (api.indexOf('{md5}') !== -1) {
        target = api.split('{md5}').join(du);
    } else if (api.indexOf('url=') !== -1) {
        target = api + encodeURIComponent(du);
    } else {
        target = api + du;
    }
    var text = getText(target);
    var j = tryJson(text);
    if (j && typeof j === 'object') {
        if (j.url) return String(j.url);
        return null;
    }
    if (text.indexOf('http') === 0) return text.replace(/^\s+|\s+$/g, '');
    return null;
}

// ================= 接口 =================
function homeContent(filter) {
    ensureSession();
    var classes = [];
    for (var i = 0; i < KNOWN_TYPES.length; i++) {
        classes.push({ type_id: String(KNOWN_TYPES[i][0]), type_name: KNOWN_TYPES[i][1] });
    }
    return { 'class': classes, filters: {} };
}

function homeVideoContent() {
    return categoryContent('1', 1, false, null);
}

function categoryContent(tid, pg, filter, extend) {
    ensureSession();
    var page = parseInt(pg, 10) > 0 ? parseInt(pg, 10) : 1;
    var rs = apiSearch('*', page, String(tid));
    var list = [];
    for (var i = 0; i < rs.hits.length; i++) list.push(toItem(rs.hits[i]));
    return { list: list, page: page, pagecount: rs.pages, limit: CONFIG.page_size, total: rs.total };
}

function detailContent(ids) {
    ensureSession();
    var vid = String(ids).split(',')[0];
    var r = apiGet('/api/v1/video/detail', { id: vid });
    if (r.code !== 1 || !r.data) return { list: [] };
    var vi = r.data.vod_info || {};

    var playFrom = [], playUrl = [];
    _lines = [];
    _tkmap = {};
    var lines = vi.vod_url_with_player || [];
    for (var idx = 0; idx < lines.length; idx++) {
        var line = lines[idx];
        var name = String(line.name || '');
        var code = String(line.code || '');
        var eps = [], tks = [];
        var segs = String(line.url || '').split('#');
        for (var epI = 0; epI < segs.length; epI++) {
            var seg = segs[epI];
            if (!seg) continue;
            var epName = seg, tk = '';
            var di = seg.indexOf('$');
            if (di !== -1) {
                epName = seg.substring(0, di);
                tk = seg.substring(di + 1);
            }
            if (!epName) continue;
            epName = epName.replace(/\$/g, ' ').replace(/#/g, ' ');
            eps.push(epName + '$' + code + '|' + tk);
            tks.push(tk);
            _tkmap[tk] = { name: name, code: code, ep: epName };
        }
        if (!eps.length) continue;
        _lines.push({ index: idx, name: name, code: code, tks: tks });
        playFrom.push(name || code);
        playUrl.push(eps.join('#'));
    }

    if (!playUrl.length && vi.vod_play_url) {
        playFrom = [vi.vod_play_from || '线路'];
        playUrl = [vi.vod_play_url];
    }

    return {
        list: [{
            vod_id: vid,
            vod_name: String(vi.vod_name || ''),
            vod_pic: String(vi.vod_pic || ''),
            vod_actor: String(vi.vod_actor || ''),
            vod_director: String(vi.vod_director || ''),
            vod_year: String(vi.vod_year || ''),
            vod_area: String(vi.vod_area || ''),
            vod_lang: String(vi.vod_lang || ''),
            vod_class: String(vi.vod_class || ''),
            vod_remarks: String(vi.vod_remarks || ''),
            vod_content: withPrefix(vi.vod_content || vi.vod_blurb || ''),
            vod_play_from: playFrom.join('$$$'),
            vod_play_url: playUrl.join('$$$')
        }]
    };
}

function playerContent(flag, id, vipFlags) {
    ensureSession();
    var sid = String(id || '');
    if (!sid) return { parse: 0, url: '', header: {} };
    var code = '', tk = sid;
    var pi = sid.indexOf('|');
    if (pi !== -1) {
        code = sid.substring(0, pi);
        tk = sid.substring(pi + 1);
    }

    // 1) 当前线路解析
    var url = resolve(tk);

    // 2) 失败自动降级到其它线路的同一集 (按集下标对齐)
    if (!url && CONFIG.auto_fallback) {
        // 定位当前线路及集下标
        var curLine = null, epIdx = -1;
        for (var i = 0; i < _lines.length; i++) {
            if (_lines[i].code === code) { curLine = _lines[i]; break; }
        }
        if (curLine) {
            for (var k = 0; k < curLine.tks.length; k++) {
                if (curLine.tks[k] === tk) { epIdx = k; break; }
            }
        }
        if (epIdx >= 0) {
            for (var j = 0; j < _lines.length; j++) {
                var ln = _lines[j];
                if (ln.code === code) continue;
                if (epIdx >= (ln.tks || []).length) continue;
                var u2 = resolve(ln.tks[epIdx]);
                if (u2) { url = u2; break; }
            }
        }
    }

    if (url) {
        return { parse: 0, url: url, header: { 'User-Agent': CONFIG.user_agent, 'Referer': 'https://www.google.com/' } };
    }
    return { parse: 0, url: '', header: {}, msg: '播放失败' };
}

function searchContent(key, quick, pg) {
    ensureSession();
    var page = parseInt(pg, 10) > 0 ? parseInt(pg, 10) : 1;
    var rs = apiSearch(String(key || ''), page);
    var list = [];
    for (var i = 0; i < rs.hits.length; i++) list.push(toItem(rs.hits[i]));
    return { list: list, page: page, pagecount: rs.pages, limit: CONFIG.page_size, total: rs.total };
}

var spider = {
    init: function (extend) {
        try {
            if (extend) {
                var cfg = extend;
                if (typeof extend === 'string') {
                    try { cfg = JSON.parse(extend); } catch (e) { cfg = null; }
                }
                if (cfg && typeof cfg === 'object') {
                    for (var k in cfg) CONFIG[k] = cfg[k];
                }
                BASE = String(CONFIG.base).replace(/\/+$/, '');
                if (CONFIG.device_id) DEVICE_ID = String(CONFIG.device_id);
            }
        } catch (e) { }
    },
    home: function (filter) { return JSON.stringify(homeContent(filter)); },
    homeVod: function () { return JSON.stringify(homeVideoContent()); },
    category: function (tid, pg, filter, extend) { return JSON.stringify(categoryContent(tid, pg, filter, extend)); },
    detail: function (ids) { return JSON.stringify(detailContent(ids)); },
    play: function (flag, id, vipFlags) { return JSON.stringify(playerContent(flag, id, vipFlags)); },
    search: function (key, quick, pg) { return JSON.stringify(searchContent(key, quick, pg)); }
};

export default spider;
