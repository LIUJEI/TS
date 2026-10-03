// 一起影视 yqk1.app —— 由 壹起.py 移植为 qjs 单文件（与 LiuLi.js 同引擎：export default + 全局 req）
// JSON POST + MD5 签名（字段顺序敏感，纯 JS MD5，无外部依赖）
const HOST = 'https://yzy0916.n0z6fkpuk.com';
const APP_ID = 'e6ddefe09e0349739874563459f56c54';
const APP_KEY = '3359de478f8d45638125e446a10ec541';
const DESC_PREFIX = '【琉🔹璃❤广告勿信👉剧情】📢';
const DART_UA = 'Dart/3.1 (dart:io)';
const CH = [
    { type_id: '2', type_name: '电影' },
    { type_id: '3', type_name: '电视剧' },
    { type_id: '8', type_name: '动漫' },
    { type_id: '10', type_name: '综艺' },
    { type_id: '56', type_name: '高清韩剧' }
];

// ---------------- UTF-8 字节 ----------------

function utf8ToBytes(s) {
    s = String(s);
    const out = [];
    for (let i = 0; i < s.length; i++) {
        let c = s.charCodeAt(i);
        if (c < 0x80) out.push(c);
        else if (c < 0x800) { out.push(0xc0 | (c >> 6), 0x80 | (c & 63)); }
        else if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
            c = 0x10000 + ((c - 0xd800) << 10) + (s.charCodeAt(++i) - 0xdc00);
            out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
        } else { out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63)); }
    }
    return out;
}

// ---------------- MD5（纯 JS，输入字符串内部转 UTF-8，输出小写 hex）----------------

const MD5_S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];
const MD5_K = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
];

function md5(input) {
    const bytes = utf8ToBytes(input);
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    for (let i = 0; i < 8; i++) bytes.push(Math.floor(bitLen / Math.pow(2, i * 8)) & 0xff);

    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    const M = new Array(16);
    for (let off = 0; off < bytes.length; off += 64) {
        for (let i = 0; i < 16; i++) {
            M[i] = (bytes[off + i * 4] | (bytes[off + i * 4 + 1] << 8) |
                    (bytes[off + i * 4 + 2] << 16) | (bytes[off + i * 4 + 3] << 24));
        }
        let a = a0, b = b0, c = c0, d = d0;
        for (let i = 0; i < 64; i++) {
            let f, g;
            if (i < 16) { f = (b & c) | (~b & d); g = i; }
            else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
            else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
            else { f = c ^ (b | ~d); g = (7 * i) % 16; }
            const tmp = d;
            d = c; c = b;
            const sum = (a + f + MD5_K[i] + M[g]) | 0;
            b = (b + ((sum << MD5_S[i]) | (sum >>> (32 - MD5_S[i])))) | 0;
            a = tmp;
        }
        a0 = (a0 + a) | 0; b0 = (b0 + b) | 0; c0 = (c0 + c) | 0; d0 = (d0 + d) | 0;
    }
    let hex = '';
    const words = [a0, b0, c0, d0];
    for (let w = 0; w < 4; w++) {
        for (let i = 0; i < 4; i++) {
            const byte = (words[w] >>> (i * 8)) & 0xff;
            hex += (byte < 16 ? '0' : '') + byte.toString(16);
        }
    }
    return hex;
}

// ---------------- 签名 ----------------

function rand32() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let s = '';
    for (let i = 0; i < 32; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
}

function uuid4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.floor(Math.random() * 16);
        return (c === 'x' ? r : ((r & 3) | 8)).toString(16);
    });
}

function makeUdid() {
    let hex = Date.now().toString(16);
    while (hex.length < 16) hex = '0' + hex;
    return uuid4() + '-' + hex;
}

// 构造签名 body：字段顺序与 py 完全一致（签名敏感）
function signBody(extra) {
    extra = extra || {};
    const order = [];
    let tailKeys = [];
    if (extra.channelId !== undefined) {
        order.push(['appId', APP_ID], ['channelId', extra.channelId], ['cus1tom', 'aabbcc'], ['deviceInfo', 'Android']);
    } else if (extra.keyword !== undefined) {
        order.push(['appId', APP_ID], ['cus1tom', 'aabbcc'], ['deviceInfo', 'Android'],
                   ['keyword', extra.keyword], ['nextCount', extra.nextCount !== undefined ? extra.nextCount : '15']);
    } else if (extra.epId !== undefined) {
        order.push(['appId', APP_ID], ['cus1tom', 'aabbcc'], ['deviceInfo', 'Android'], ['epId', extra.epId]);
        tailKeys = Object.keys(extra).filter(k => k !== 'epId');
    } else if (extra.vodEpId !== undefined) {
        order.push(['appId', APP_ID], ['cus1tom', 'aabbcc'], ['deviceInfo', 'Android']);
        tailKeys = ['vodEpId'];
    } else {
        order.push(['appId', APP_ID], ['cus1tom', 'aabbcc'], ['deviceInfo', 'Android']);
        tailKeys = Object.keys(extra);
    }
    order.push(['reqDomain', 'yqk1.app'], ['requestId', rand32()], ['udid', makeUdid()], ['version', '1.2.7.104']);
    const skip = ['reqDomain', 'requestId', 'udid', 'version'];
    for (const k of tailKeys) {
        if (skip.indexOf(k) < 0) order.push([k, extra[k]]);
    }
    const raw = order.map(([k, v]) => k + '=' + v).join('&') + '&appKey=' + APP_KEY;
    const body = {};
    for (const [k, v] of order) body[k] = v;
    body.sign = md5(raw);
    return body;
}

async function apiPost(path, extra) {
    try {
        const r = await req(HOST + path, {
            method: 'POST',
            headers: {
                'User-Agent': DART_UA,
                'Origin': 'https://yqk1.app',
                'Referer': 'https://yqk1.app/',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signBody(extra)),
            timeout: 15000
        });
        const text = (r && r.content != null) ? String(r.content) : '';
        return text ? JSON.parse(text) : {};
    } catch (e) {
        return {};
    }
}

// ---------------- 卡片 ----------------

function card(x) {
    return {
        vod_id: String(x.vodId != null ? x.vodId : (x.id != null ? x.id : '')),
        vod_name: String(x.vodName || x.title || ''),
        vod_pic: String(x.coverImg || x.appCoverUrl || ''),
        vod_remarks: String(x.remark || x.updateRemark || '')
    };
}

function withPrefix(s) {
    s = String(s == null ? '' : s);
    if (s && s.indexOf(DESC_PREFIX) !== 0) s = DESC_PREFIX + s;
    return s;
}

// ---------------- 接口 ----------------

async function init(cfg) {}

async function home(filter) {
    return JSON.stringify({ class: CH, filters: {} });
}

async function homeVod() {
    return JSON.stringify({ list: [] });
}

async function category(tid, pg, filter, extend) {
    const page = parseInt(pg || 1) || 1;
    const x = await apiPost('/v2/api/channel/topicListView', { channelId: parseInt(tid) || 0 });
    const data = (x && typeof x === 'object') ? (x.data || {}) : {};
    const topicList = Array.isArray(data.topicList) ? data.topicList : [];
    const out = [];
    const seen = {};
    for (const t of topicList) {
        const vl = (t && Array.isArray(t.vodList)) ? t.vodList : [];
        for (const v of vl) {
            const c = card(v || {});
            if (c.vod_id && !seen[c.vod_id]) {
                seen[c.vod_id] = 1;
                out.push(c);
            }
        }
    }
    return JSON.stringify({
        list: out, page: page,
        pagecount: out.length ? 2 : 1,
        limit: out.length || 1, total: out.length
    });
}

async function detail(id) {
    const vid = String(id).split(',')[0];
    const x = await apiPost('/v2/api/vodInfo/index', { vodId: vid });
    const d = (x && typeof x === 'object' && x.data && typeof x.data === 'object') ? x.data : {};
    const fs = [], us = [];
    const players = Array.isArray(d.playerList) ? d.playerList : [];
    for (const pl of players) {
        const eps = [];
        const epList = (pl && Array.isArray(pl.epList)) ? pl.epList : [];
        for (const ep of epList) {
            eps.push(String((ep && ep.epName) || '正片') + '$' + String((ep && ep.epId) || '') + '|' + String(d.vodName || '') + '|' + eps.length);
        }
        if (eps.length) {
            fs.push(String((pl && pl.playerName) || '线路'));
            us.push(eps.join('#'));
        }
    }
    if (!fs.length) return JSON.stringify({ list: [] });
    return JSON.stringify({
        list: [{
            vod_id: vid,
            vod_name: String(d.vodName || vid),
            vod_pic: String(d.coverImg || ''),
            vod_year: String(d.year || ''),
            vod_area: String(d.areaName || ''),
            vod_actor: '',
            vod_content: withPrefix(d.intro || ''),
            vod_play_from: fs.join('$$$'),
            vod_play_url: us.join('$$$')
        }]
    });
}

async function play(flag, id, vipFlags) {
    const ep = String(id).split('|')[0];
    // 1) 查可播清晰度（epDetail 过滤 canPlay）
    let res = '';
    const x = await apiPost('/v2/api/vodInfo/epDetail', { vodEpId: ep });
    const rows = (x && Array.isArray(x.data)) ? x.data : [];
    for (const r of rows) {
        if (String((r && r.canPlay) || '').toLowerCase() === 'true') {
            res = String(r.vodResolution || '');
            break;
        }
    }
    // 2) 取播放地址（epId 紧跟 deviceInfo，签名顺序敏感）
    const p = { epId: ep };
    if (res) p.vodResolution = res;
    const y = await apiPost('/v2/api/vodInfo/playUrl', p);
    const data = (y && typeof y === 'object' && y.data && typeof y.data === 'object') ? y.data : {};
    const u = String(data.playUrl || '');
    return JSON.stringify({
        parse: u.indexOf('http') === 0 ? 0 : 1,
        playUrl: '',
        url: u || String(id),
        jx: 0,
        header: { 'Referer': 'https://yqk1.app/', 'User-Agent': DART_UA }
    });
}

async function search(wd, quick, pg) {
    const x = await apiPost('/v1/api/search/search', { keyword: String(wd || ''), nextCount: '15' });
    const data = (x && typeof x === 'object') ? (x.data || {}) : {};
    const items = Array.isArray(data.items) ? data.items : [];
    const out = [];
    for (const v of items) {
        const flags = String((v && v.flags) || '');
        if (flags.indexOf('短剧') < 0) out.push(card(v || {}));
    }
    return JSON.stringify({
        list: out, page: parseInt(pg || 1) || 1,
        pagecount: 1, limit: out.length || 1, total: out.length
    });
}

export default { init, home, homeVod, category, detail, search, play };
