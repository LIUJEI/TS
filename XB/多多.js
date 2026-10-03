// 多多视频 duoduosdf12223234334.top —— 由 多多.py 移植为 qjs 单文件（与 LiuLi.js 同引擎：export default + 全局 req）
// Vue SPA + 苹果CMS API；播放地址经 protobuf /decode/url 接口解码（SHA256 签名，纯 JS 实现，无外部依赖）
const host = 'https://duoduosdf12223234334.top';
const api = host + '/api.php/web';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const WEB_SIGN = 'ddtvf65f3a83d6d9ad6f';
const X_CLIENT = '8f3d2a1c7b6e5d4c9a0b1f2e3d4c5b6a';
const DESC_PREFIX = '【琉🔹璃❤广告勿信👉剧情】📢';

// ---- 签名常量（逆向自 web_app_wasm）----
const DEV = 'com.web.player';
const ID = 'WF-2c064bc5b3400788f31b848849bc3a60f835423ba2dfe69d7ea93974c216e4f2';
const SK = 'WEB-50a8e9c84a1dc05669a692ded99a2dac46527229e607a7be15db88dbc59059d1';

const typeMap = { '1': '电影', '2': '剧集', '3': '动漫', '4': '综艺' };

// ---------------- SHA-256（纯 JS，输入为 ASCII 字符串，输出小写 hex）----------------

const SHA_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];

function rotr(n, x) { return (x >>> n) | (x << (32 - n)); }

function sha256(ascii) {
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const bytes = [];
    for (let i = 0; i < ascii.length; i++) bytes.push(ascii.charCodeAt(i) & 0xff);
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56) bytes.push(0);
    bytes.push(0, 0, 0, 0);
    for (let i = 3; i >= 0; i--) bytes.push((bitLen >>> (i * 8)) & 0xff);

    const w = new Array(64);
    for (let off = 0; off < bytes.length; off += 64) {
        for (let i = 0; i < 16; i++) {
            w[i] = ((bytes[off + i * 4] << 24) | (bytes[off + i * 4 + 1] << 16) |
                    (bytes[off + i * 4 + 2] << 8) | bytes[off + i * 4 + 3]) >>> 0;
        }
        for (let i = 16; i < 64; i++) {
            const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
            const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
            w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
        }
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        for (let i = 0; i < 64; i++) {
            const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
            const ch = (e & f) ^ (~e & g);
            const t1 = (h + S1 + ch + SHA_K[i] + w[i]) >>> 0;
            const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) >>> 0;
            h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
        }
        H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    let hex = '';
    for (let i = 0; i < 8; i++) {
        let s = H[i].toString(16);
        while (s.length < 8) s = '0' + s;
        hex += s;
    }
    return hex;
}

// ---------------- base64 ----------------

function b64ToBytes(str) {
    str = String(str || '').replace(/[^A-Za-z0-9+/=]/g, '');
    const lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const out = [];
    for (let i = 0; i < str.length; i += 4) {
        const c0 = lookup.indexOf(str[i]);
        const c1 = lookup.indexOf(str[i + 1]);
        const c2 = lookup.indexOf(str[i + 2]);
        const c3 = lookup.indexOf(str[i + 3]);
        out.push((c0 << 2) | (c1 >> 4));
        if (c2 >= 0 && str[i + 2] !== '=') out.push(((c1 & 15) << 4) | (c2 >> 2));
        if (c3 >= 0 && str[i + 3] !== '=') out.push(((c2 & 3) << 6) | c3);
    }
    return new Uint8Array(out);
}

// ---------------- protobuf ----------------

function pbVarint(arr, n) {
    n = Math.floor(n);
    while (n > 0x7f) {
        arr.push((n & 0x7f) | 0x80);
        n = Math.floor(n / 128);
    }
    arr.push(n);
}

function pbBytesField(arr, field, data) {
    pbVarint(arr, (field << 3) | 2);
    pbVarint(arr, data.length);
    for (let i = 0; i < data.length; i++) arr.push(data[i]);
}

function pbVarintField(arr, field, val) {
    pbVarint(arr, field << 3);
    pbVarint(arr, val);
}

function asciiBytes(s) {
    const a = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i) & 0xff;
    return a;
}

function bytesToBinStr(bytes) {
    let s = '';
    const CHUNK = 4096;
    for (let i = 0; i < bytes.length; i += CHUNK) {
        s += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
    }
    return s;
}

function utf8FromBytes(bytes) {
    let s = '';
    let i = 0;
    while (i < bytes.length) {
        const b = bytes[i];
        if (b < 0x80) { s += String.fromCharCode(b); i++; }
        else if (b < 0xe0) { s += String.fromCharCode(((b & 31) << 6) | (bytes[i + 1] & 63)); i += 2; }
        else if (b < 0xf0) { s += String.fromCharCode(((b & 15) << 12) | ((bytes[i + 1] & 63) << 6) | (bytes[i + 2] & 63)); i += 3; }
        else {
            let cp = ((b & 7) << 18) | ((bytes[i + 1] & 63) << 12) | ((bytes[i + 2] & 63) << 6) | (bytes[i + 3] & 63);
            cp -= 0x10000;
            s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
            i += 4;
        }
    }
    return s;
}

// 解析 decode/url 响应，取 field 3（真实地址，wire=2）
function parseDecodeResponse(bytes) {
    let i = 0;
    while (i < bytes.length) {
        let key = 0, shift = 0, b;
        do { b = bytes[i++]; key |= (b & 0x7f) << shift; shift += 7; } while (b & 0x80);
        const field = key >> 3;
        const wire = key & 7;
        if (wire === 0) {
            do { b = bytes[i++]; } while (b & 0x80);
        } else if (wire === 2) {
            let len = 0; shift = 0;
            do { b = bytes[i++]; len |= (b & 0x7f) << shift; shift += 7; } while (b & 0x80);
            if (field === 3) return utf8FromBytes(bytes.subarray(i, i + len));
            i += len;
        } else if (wire === 1) {
            i += 8;
        } else if (wire === 5) {
            i += 4;
        } else {
            break;
        }
    }
    return '';
}

function randomNonceHex() {
    let s = '';
    for (let i = 0; i < 16; i++) s += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    return s;
}

// ---------------- HTTP ----------------

function signHeaders(extra) {
    return Object.assign({
        'User-Agent': UA,
        'Accept': 'application/json',
        'X-Client': X_CLIENT,
        'web-sign': WEB_SIGN
    }, extra || {});
}

async function apiGet(pathUrl) {
    try {
        const r = await req(pathUrl, { headers: signHeaders(), timeout: 15000 });
        const text = (r && r.content != null) ? String(r.content) : '';
        return text ? JSON.parse(text) : null;
    } catch (e) {
        return null;
    }
}

// 调 decode/url：proto 二进制请求；响应优先按宿主 buffer:2(base64) 解析，失败再用 ASCII 直取
async function decodeUrl(token, playFrom) {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const ts = Date.now();
            const nonce = randomNonceHex();
            const sign = sha256('finger=' + ID + '&id=' + DEV + '&nonce=' + nonce + '&sk=' + SK + '&time=' + ts + '&v=1').toUpperCase();
            const body = [];
            pbBytesField(body, 1, asciiBytes(token));
            pbBytesField(body, 2, asciiBytes(playFrom));
            pbVarintField(body, 3, ts);
            pbBytesField(body, 4, asciiBytes(nonce));
            pbBytesField(body, 5, asciiBytes(sign));
            pbBytesField(body, 6, asciiBytes(DEV));
            pbVarintField(body, 7, 1);

            const r = await req(api + '/decode/url', {
                method: 'POST',
                timeout: 20000,
                headers: {
                    'Content-Type': 'application/x-protobuf; charset=ISO-8859-1',
                    'Accept': 'application/x-protobuf',
                    'User-Agent': UA,
                    'X-Client': X_CLIENT,
                    'web-sign': WEB_SIGN
                },
                body: bytesToBinStr(new Uint8Array(body)),
                buffer: 2
            });
            const content = (r && r.content != null) ? String(r.content) : '';
            if (!content) continue;

            let real = '';
            if (/^[A-Za-z0-9+/=\r\n]+$/.test(content.trim()) && content.trim().length % 4 === 0) {
                try {
                    const bytes = b64ToBytes(content);
                    if (bytes.length > 4 && bytes[0] === 0x08) real = parseDecodeResponse(bytes);
                } catch (e) {}
            }
            if (!real) {
                // 宿主不支持 buffer:2 时，content 是按 UTF-8 解的字符串；URL 为纯 ASCII，可直接提取
                const m = /https?:\/\/[\x21-\x7e]+/.exec(content);
                if (m) real = m[0];
            }
            if (real.indexOf('http') === 0) return real;
        } catch (e) {}
    }
    return '';
}

// ---------------- 筛选 ----------------

function buildFilters() {
    const years = [{ n: '全部', v: '' }];
    for (let y = 2026; y >= 2016; y--) years.push({ n: String(y), v: String(y) });
    const areas = [
        { n: '全部', v: '' },
        { n: '大陆', v: '大陆' }, { n: '港台', v: '港台' },
        { n: '美国', v: '美国' }, { n: '日本', v: '日本' },
        { n: '韩国', v: '韩国' }, { n: '泰国', v: '泰国' },
        { n: '其他', v: '其他' }
    ];
    const sorts = [
        { n: '时间', v: 'time' },
        { n: '人气', v: 'hits' },
        { n: '评分', v: 'score' }
    ];
    const movieClass = ['全部', '动作', '喜剧', '爱情', '科幻', '恐怖', '剧情', '战争', '犯罪', '奇幻', '冒险', '悬疑', '动画']
        .map((t, i) => ({ n: t, v: i === 0 ? '' : t }));
    const tvClass = ['全部', '剧情', '喜剧', '爱情', '科幻', '悬疑', '恐怖', '古装', '都市', '家庭', '战争', '犯罪', '历史']
        .map((t, i) => ({ n: t, v: i === 0 ? '' : t }));
    const animeClass = ['全部', '国产动漫', '日本动漫', '欧美动漫', '海外动漫']
        .map((t, i) => ({ n: t, v: i === 0 ? '' : t }));
    return {
        '1': [
            { key: 'class', name: '类型', value: movieClass },
            { key: 'area', name: '地区', value: areas },
            { key: 'sort', name: '排序', value: sorts },
            { key: 'year', name: '年份', value: years }
        ],
        '2': [
            { key: 'class', name: '类型', value: tvClass },
            { key: 'area', name: '地区', value: areas },
            { key: 'sort', name: '排序', value: sorts },
            { key: 'year', name: '年份', value: years }
        ],
        '3': [
            { key: 'class', name: '类型', value: animeClass },
            { key: 'sort', name: '排序', value: sorts },
            { key: 'year', name: '年份', value: years }
        ],
        '4': [
            { key: 'area', name: '地区', value: areas },
            { key: 'sort', name: '排序', value: sorts },
            { key: 'year', name: '年份', value: years }
        ]
    };
}

const filters = buildFilters();

function vodBrief(v) {
    return {
        vod_id: String(v.vod_id == null ? '' : v.vod_id),
        vod_name: String(v.vod_name || ''),
        vod_pic: String(v.vod_pic || ''),
        vod_remarks: String(v.vod_remarks || '')
    };
}

// ---------------- qjs 接口 ----------------

async function init(cfg) {}

async function home(filter) {
    const result = { class: [], filters: filters, list: [] };
    const data = await apiGet(api + '/index/home');
    if (data && data.code === 200 && data.data) {
        const homeData = data.data;
        const categories = homeData.categories || [];
        for (const cat of categories) {
            result.class.push({ type_name: String(cat.type_name || ''), type_id: String(cat.type_id == null ? '' : cat.type_id) });
        }
        const seen = new Set();
        for (const cat of categories) {
            for (const v of (cat.videos || [])) {
                const vid = String(v.vod_id == null ? '' : v.vod_id);
                if (vid && !seen.has(vid)) { seen.add(vid); result.list.push(vodBrief(v)); }
            }
        }
        for (const v of (homeData.recommend || [])) {
            const vid = String(v.vod_id == null ? '' : v.vod_id);
            if (vid && !seen.has(vid)) { seen.add(vid); result.list.push(vodBrief(v)); }
        }
    }
    return JSON.stringify(result);
}

async function homeVod() {
    const r = JSON.parse(await home(false));
    return JSON.stringify({ list: r.list });
}

async function category(tid, pg, filter, extend) {
    const page = parseInt(pg || 1) || 1;
    const result = { list: [], page: page, pagecount: 1, limit: 24, total: 0 };
    extend = extend || {};
    const typeName = typeMap[String(tid)] || String(tid);
    let url = api + '/filter/vod?type_name=' + encodeURIComponent(typeName) + '&page=' + page;
    if (extend.area && extend.area !== '全部') url += '&area=' + encodeURIComponent(extend.area);
    if (extend['class'] && extend['class'] !== '全部') url += '&class=' + encodeURIComponent(extend['class']);
    if (extend.year && extend.year !== '全部') url += '&year=' + encodeURIComponent(extend.year);
    url += '&sort=' + encodeURIComponent(extend.sort || 'hits');

    const data = await apiGet(url);
    if (data && data.code === 200 && Array.isArray(data.data)) {
        const items = data.data;
        result.list = items.map(vodBrief);
        const limit = parseInt(data.limit || 24) || 24;
        result.limit = limit;
        result.total = items.length;
        result.pagecount = (items.length && items.length >= limit) ? page + 1 : page;
    }
    return JSON.stringify(result);
}

async function detail(id) {
    const result = { list: [] };
    const data = await apiGet(api + '/vod/get_detail?vod_id=' + encodeURIComponent(id));
    if (!data || data.code !== 200 || !data.data) return JSON.stringify(result);

    const vod = Array.isArray(data.data) ? data.data[0] : data.data;
    const playFromRaw = String(vod.vod_play_from || '');
    const playUrlRaw = String(vod.vod_play_url || '');

    const showMap = {};
    for (const p of (data.vodplayer || [])) {
        const src = String(p.from || '');
        if (src) showMap[src] = String(p.show || src);
    }

    const fromList = playFromRaw ? playFromRaw.split('$$$') : [];
    const urlList = playUrlRaw ? playUrlRaw.split('$$$') : [];
    const playFrom = [];
    const playUrl = [];
    const vodId = String(vod.vod_id == null ? '' : vod.vod_id);

    for (let i = 0; i < fromList.length; i++) {
        const displayName = showMap[fromList[i]] || fromList[i];
        if (i < urlList.length && urlList[i]) {
            const eps = urlList[i].split('#');
            const urls = [];
            for (let idx = 1; idx <= eps.length; idx++) {
                const parts = eps[idx - 1].split('$');
                if (parts.length === 2) {
                    urls.push(parts[0] + '$' + vodId + '_' + i + '_' + idx);
                }
            }
            if (urls.length) {
                playFrom.push(displayName);
                playUrl.push(urls.join('#'));
            }
        }
    }

    const content = String(vod.vod_content || '').replace(/<[^>]+>/g, '').trim();
    result.list.push({
        vod_id: vodId,
        vod_name: String(vod.vod_name || ''),
        vod_pic: String(vod.vod_pic || ''),
        vod_director: String(vod.vod_director || ''),
        vod_actor: String(vod.vod_actor || ''),
        vod_year: vod.vod_year == null ? '' : String(vod.vod_year),
        vod_area: String(vod.vod_area || ''),
        vod_content: content ? (content.indexOf(DESC_PREFIX) === 0 ? content : DESC_PREFIX + content) : '',
        vod_remarks: String(vod.vod_remarks || ''),
        vod_play_from: playFrom.join('$$$'),
        vod_play_url: playUrl.join('$$$')
    });
    return JSON.stringify(result);
}

async function search(wd, quick, pg) {
    pg = pg || 1;
    const result = { list: [], page: parseInt(pg) || 1 };
    const data = await apiGet(api + '/search/index?wd=' + encodeURIComponent(wd) + '&page=' + encodeURIComponent(pg));
    if (data && data.code === 200 && Array.isArray(data.data)) {
        result.list = data.data.map(vodBrief);
    }
    return JSON.stringify(result);
}

function originOf(u) {
    const m = /^(https?:\/\/[^/]+)/i.exec(u);
    return m ? m[1] : host;
}

async function play(flag, pid, vipFlags) {
    try {
        const parts = String(pid || '').split('_');
        const vodId = parts[0];
        const srcIdx = parts.length > 1 ? parseInt(parts[1]) || 0 : 0;
        const epIdx = parts.length > 2 ? parseInt(parts[2]) || 1 : 1;
        let srcCode = '';

        const data = await apiGet(api + '/vod/get_detail?vod_id=' + encodeURIComponent(vodId));
        if (data && data.code === 200 && data.data) {
            const vod = Array.isArray(data.data) ? data.data[0] : data.data;
            const froms = String(vod.vod_play_from || '').split('$$$');
            const urls = String(vod.vod_play_url || '').split('$$$');
            if (srcIdx < froms.length) srcCode = froms[srcIdx];
            if (srcIdx < urls.length) {
                const eps = urls[srcIdx].split('#');
                if (epIdx <= eps.length) {
                    const epParts = eps[epIdx - 1].split('$');
                    if (epParts.length === 2) {
                        const real = await decodeUrl(epParts[1], srcCode);
                        if (real) {
                            return JSON.stringify({
                                parse: 0,
                                url: real,
                                header: { 'User-Agent': UA, 'Referer': originOf(real) }
                            });
                        }
                    }
                }
            }
        }

        // 回退：网站播放页交给壳嗅探
        let url = host + '/play/' + vodId + '?ep=' + epIdx;
        if (srcCode) url += '&source=' + encodeURIComponent(srcCode);
        return JSON.stringify({ parse: 1, url: url, header: { 'User-Agent': UA, 'Referer': host } });
    } catch (e) {
        return JSON.stringify({ parse: 0, url: '' });
    }
}

export default { init, home, homeVod, category, detail, search, play };
