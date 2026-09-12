import { Crypto, _ } from 'assets://js/lib/cat.js';

let siteUrl = '';
let key = '';
let iv = '';
let deviceId = '';
let version = '';
let ua = '';
let token = '';
let siteKey = '';
let siteType = 3;

const CHROME_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36';

function baseHeaders() {
    return {
        'User-Agent': ua || 'okhttp/3.14.9'
    };
}

async function httpGet(reqUrl, header) {
    let res = await req(reqUrl, {
        method: 'get',
        headers: header || {},
        timeout: 30000
    });
    return res.content;
}

// merge/k/b.b：不跟随重定向，取 Location 头；JS 环境尽力而为
async function getLocation(reqUrl, header) {
    let res = await req(reqUrl, {
        method: 'get',
        headers: header || {},
        timeout: 30000
    });
    let hs = res.headers || {};
    return hs['Location'] || hs['location'] || '';
}

// AppGet.a(path, jsonBody)：原始 JSON 字符串 POST，响应 data 字段 AES 解密
async function apiPost(path, body) {
    try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const h = baseHeaders();
        h['Content-Type'] = 'application/x-www-form-urlencoded';
        h['app-user-device-id'] = deviceId;
        h['app-version-code'] = version;
        if (token) h['app-user-token'] = token;
        h['app-api-verify-time'] = timestamp;
        h['app-ui-mode'] = 'light';
        let res = await req(siteUrl + '/api.php' + path, {
            method: 'post',
            data: body,
            headers: h,
            postType: 'raw',
            timeout: 30000
        });
        let json = JSON.parse(res.content);
        return aesDecode(json.data, key, iv);
    } catch (e) {
        return '';
    }
}

// AppGet.c(rawBody)：/getappapi.index/vodParse，原始 body POST，带头 app-api-verify-sign
async function vodParse(rawBody) {
    try {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const sign = aesEncode(timestamp, key, iv);
        const h = {
            'User-Agent': ua || 'okhttp/3.14.9',
            'Connection': 'Keep-Alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'app-version-code': version,
            'app-ui-mode': 'light',
            'app-user-device-id': deviceId,
            'app-api-verify-time': timestamp,
            'app-api-verify-sign': sign
        };
        if (token) h['app-user-token'] = token;
        let res = await req(siteUrl + '/api.php/getappapi.index/vodParse', {
            method: 'post',
            data: rawBody,
            headers: h,
            postType: 'raw',
            timeout: 30000
        });
        let outer = JSON.parse(res.content);
        let decrypted = aesDecode(outer.data, key, iv);
        let parsed = JSON.parse(decrypted);
        return String(JSON.parse(parsed.json).url);
    } catch (e) {
        return '';
    }
}

function aesDecode(str, keyStr, ivStr) {
    const cryptoKey = Crypto.enc.Utf8.parse(keyStr);
    return Crypto.AES.decrypt(str, cryptoKey, {
        iv: Crypto.enc.Utf8.parse(ivStr),
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    }).toString(Crypto.enc.Utf8);
}

function aesEncode(str, keyStr, ivStr) {
    const cryptoKey = Crypto.enc.Utf8.parse(keyStr);
    return Crypto.AES.encrypt(str, cryptoKey, {
        iv: Crypto.enc.Utf8.parse(ivStr),
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    }).toString();
}

// AppGet.edu
function edu(str) {
    try {
        return str.replace(/(url=)(.*?)(?=&token)(&token)/g, function (m, a, b, c) {
            return a + encodeURIComponent(b) + c;
        });
    } catch (e) {
        return str;
    }
}

// AppGet.eduAesDecode
function eduAesDecode(str) {
    try {
        return str.replace(/(&url=)(.*?)(?=&token)(&token)/g, function (m, a, b, c) {
            return a + aesDecode(b, key, iv) + c;
        });
    } catch (e) {
        return str;
    }
}

async function init(cfg) {
    siteKey = cfg.skey || '';
    if (cfg.stype !== undefined) siteType = cfg.stype;
    if (!cfg.ext) return;
    let extObj;
    if (typeof cfg.ext === 'string') {
        extObj = JSON.parse(cfg.ext);
    } else if (typeof cfg.ext === 'object' && cfg.ext !== null) {
        extObj = cfg.ext;
    } else {
        return;
    }
    let host = extObj.url || '';
    if (!host) {
        const siteTxt = extObj.site || '';
        if (siteTxt) {
            let content = '';
            try {
                content = await httpGet(siteTxt, {});
            } catch (e) {
                content = '';
            }
            if (content) {
                const lines = content.split('\n').map(function (s) {
                    return s.trim();
                });
                const valid = lines.find(function (s) {
                    return /^https?:\/\//.test(s);
                });
                host = valid || content;
            }
        }
    }
    siteUrl = host;
    key = extObj.dataKey || '';
    iv = extObj.dataIv || '';
    deviceId = extObj.deviceId || '';
    version = extObj.version || '';
    ua = extObj.ua || '';
    token = extObj.token || '';
}

function parseVodList(arr) {
    const list = [];
    if (!arr) return list;
    for (let i = 0; i < arr.length; i++) {
        try {
            const item = arr[i];
            list.push({
                vod_id: item.vod_id !== undefined && item.vod_id !== null ? String(item.vod_id) : '',
                vod_name: item.vod_name || '',
                vod_pic: item.vod_pic || '',
                vod_remarks: item.vod_remarks || ''
            });
        } catch (e) {
        }
    }
    return list;
}

async function home(filter) {
    const classes = [];
    const filters = {};
    let list = [];
    try {
        const text = await apiPost('/getappapi.index/initV119', '{}');
        const data = JSON.parse(text);
        const typeList = data.type_list || [];
        for (let i = 0; i < typeList.length; i++) {
            const t = typeList[i];
            const tid = t.type_id !== undefined && t.type_id !== null ? String(t.type_id) : '';
            const tname = t.type_name || '';
            if (tname.indexOf('正版QQ群') > -1 || tname === '伦理' || tname === '福利' || tname === '小影院') {
                continue;
            }
            classes.push({
                type_id: tid,
                type_name: tname
            });
            const filterTypeList = t.filter_type_list;
            if (filterTypeList) {
                const filterArr = [];
                for (let j = 0; j < filterTypeList.length; j++) {
                    const fObj = filterTypeList[j];
                    const fname = fObj.name || '';
                    if (['class', 'area', 'lang', 'year', 'sort'].indexOf(fname) === -1) continue;
                    const rawList = fObj.list || [];
                    const values = [];
                    for (let k = 0; k < rawList.length; k++) {
                        const s = String(rawList[k]);
                        values.push({ v: s, n: s });
                    }
                    const keyName = fname === 'sort' ? 'by' : fname;
                    const nameMap = { 'class': '类型', 'lang': '语言', 'area': '地区', 'year': '年份', 'sort': '排序' };
                    filterArr.push({
                        key: keyName,
                        name: nameMap[fname],
                        value: values
                    });
                }
                filters[tid] = filterArr;
            }
        }
        list = parseVodList(data.recommend_list);
    } catch (e) {
    }
    return JSON.stringify({
        class: classes,
        list: list,
        filters: filters
    });
}

async function homeVod() {
    return JSON.stringify({ list: [] });
}

async function category(tid, pg, filter, extend) {
    const list = [];
    try {
        const body = { type_id: tid };
        if (extend) {
            const keys = ['class', 'lang', 'area', 'year'];
            for (let i = 0; i < keys.length; i++) {
                const k = keys[i];
                if (extend[k] !== undefined && extend[k] !== '') body[k] = extend[k];
            }
            if (extend.by !== undefined && extend.by !== '') body.sort = extend.by;
        }
        body.page = String(pg);
        const text = await apiPost('/getappapi.index/typeFilterVodList?page=' + pg, JSON.stringify(body));
        const data = JSON.parse(text);
        Array.prototype.push.apply(list, parseVodList(data.recommend_list));
    } catch (e) {
    }
    return JSON.stringify({ list: list });
}

async function detail(ids) {
    const vod = {};
    try {
        const body = { vod_id: ids[0] };
        const text = await apiPost('/getappapi.index/vodDetail', JSON.stringify(body));
        const data = JSON.parse(text);
        const v = data.vod;
        vod.vod_id = ids[0];
        vod.vod_name = v.vod_name || '';
        vod.vod_pic = v.vod_pic || '';
        vod.vod_remarks = v.vod_remarks || '';
        vod.vod_content = '【琉🔹芸❤广告勿信👉剧情】📢' + (v.vod_content || '');
        vod.vod_actor = v.vod_actor || '';
        vod.vod_director = v.vod_director || '';
        vod.type_name = v.vod_class || '';

        const vodName = v.vod_name || '';
        const fromList = [];
        const urlList = [];
        const playList = data.vod_play_list || [];
        for (let i = 0; i < playList.length; i++) {
            const playItem = playList[i];
            const playerInfo = playItem.player_info || {};
            const show = playerInfo.show || '';
            const parse = playerInfo.parse || '';
            const urls = playItem.urls || [];
            const episodes = [];
            for (let j = 0; j < urls.length; j++) {
                const u = urls[j];
                const epName = u.name || '';
                const realUrl = u.url || '';
                const parseApiUrl = u.parse_api_url || '';
                const epToken = u.token || '';
                const nid = u.nid || '';
                let episode;
                if (/^https?:\/\/.*/.test(parseApiUrl)) {
                    episode = epName + '$' + parseApiUrl + '|' + vodName + '|' + nid;
                } else {
                    episode = epName + '$parse_api=' + parse + '&url=' + aesEncode(realUrl, key, iv) + '&token=' + epToken + '|' + vodName + '|' + nid;
                }
                episodes.push(episode);
            }
            fromList.push(show);
            urlList.push(episodes.join('#'));
        }
        vod.vod_play_from = fromList.join('$$$');
        vod.vod_play_url = urlList.join('$$$');
    } catch (e) {
    }
    return JSON.stringify({ list: [vod] });
}

async function play(flag, id, flags) {
    try {
        let parts = id.split('|');
        if (parts.length === 4) {
            id = parts[0] + '|' + parts[2] + '|' + parts[3];
            parts = id.split('|');
        }
        let data = parts[0];
        const vodName = parts[1] || '';
        const nid = parts[2] || '';

        const chromeHeaders = baseHeaders();
        chromeHeaders['User-Agent'] = CHROME_UA;

        let danmaku = '';
        try {
            const query = '?do=appdanmu&vodName=' + encodeURIComponent(vodName) + '&vodIndex=' + encodeURIComponent(nid);
            danmaku = js2Proxy(false, siteType, siteKey || '', encodeURIComponent(query), {});
        } catch (e) {
            danmaku = '';
        }

        const isHttp = /^https?:\/\/.*/.test(data);
        const hasUrlFlag = data.indexOf('?url=') > -1;
        const hasKeyFlag = data.indexOf('?key=') > -1;

        if (isHttp && (hasUrlFlag || hasKeyFlag)) {
            let resp = '';
            try {
                resp = await httpGet(data, baseHeaders());
            } catch (e) {
                resp = '';
            }
            let u = data;
            if (resp) {
                if (resp.charAt(0) === '{') {
                    try {
                        const jobj = JSON.parse(resp);
                        u = (jobj.url === undefined || jobj.url === null) ? '' : String(jobj.url);
                    } catch (e) {
                        u = data;
                    }
                } else {
                    const m = resp.match(/"url"\s*:\s*"([^"]+)"/);
                    if (m) u = m[1];
                }
            }
            const result = {
                url: u,
                danmaku: danmaku,
                header: chromeHeaders
            };
            if (u && u.indexOf('url=') > -1) result.parse = 1;
            return JSON.stringify(result);
        }

        if (/.*(m3u8|mp4|mkv).*/.test(data)) {
            return JSON.stringify({
                url: data,
                danmaku: danmaku,
                header: baseHeaders()
            });
        }

        if (hasUrlFlag || hasKeyFlag || data.indexOf('html') > -1) {
            const decoded = eduAesDecode(data);
            const m = decoded.match(/(parse_api=)(.*?)(?=&token)(&token)/);
            if (m) {
                const parseUrl = m[2];
                let u = '';
                try {
                    const resp = await httpGet(parseUrl, null);
                    const jobj = JSON.parse(resp);
                    u = (jobj.data && jobj.data.url) ? String(jobj.data.url) : '';
                } catch (e) {
                    u = '';
                }
                if (u) {
                    return JSON.stringify({
                        url: u,
                        danmaku: danmaku,
                        header: chromeHeaders
                    });
                }
                let loc = '';
                try {
                    loc = await getLocation(u, baseHeaders());
                } catch (e) {
                    loc = '';
                }
                return JSON.stringify({
                    url: loc,
                    danmaku: danmaku,
                    header: chromeHeaders
                });
            }
        }

        const encoded = edu(data);
        let u = await vodParse(encoded);
        if (u) {
            return JSON.stringify({
                url: u,
                danmaku: danmaku,
                header: chromeHeaders
            });
        }
        let loc = '';
        try {
            loc = await getLocation(encoded, baseHeaders());
        } catch (e) {
            loc = '';
        }
        return JSON.stringify({
            url: loc,
            danmaku: danmaku,
            header: chromeHeaders
        });
    } catch (e) {
        return '';
    }
}

async function search(wd, quick, pg) {
    const list = [];
    try {
        const body = {
            type_id: 0,
            keywords: wd,
            page: 1
        };
        const text = await apiPost('/getappapi.index/searchList', JSON.stringify(body));
        const data = JSON.parse(text);
        Array.prototype.push.apply(list, parseVodList(data.search_list));
    } catch (e) {
    }
    return JSON.stringify({ list: list });
}

// Danmu.getRealName
function getRealName(name) {
    return name.replace(/[（(【<][臻真]彩[）)】>]/g, '').trim();
}

// Danmu.d
function parseVodIndex(str) {
    if (!str) return 1;
    let s = str.replace(/\[.*?\]/g, '');
    let m = s.match(/第(\d+)[集期话]/);
    if (m) return parseInt(m[1], 10);
    if (s.indexOf('S') > -1 && s.indexOf('E') > -1) {
        m = s.match(/S\d+E(\d{2,3})/);
        if (m) return parseInt(m[1], 10);
        return 1;
    }
    m = s.match(/·E(\d+)·/);
    if (m) return parseInt(m[1], 10);
    m = s.match(/(\d{4})[-._]?(\d{2})[-._]?(\d{2})/);
    if (m) return parseInt(m[1] + m[2] + m[3], 10);
    const head = s.split('.')[0];
    m = head.match(/(\d+)([a-zA-Z]*|(?:\s+.*)?)/);
    if (m) return parseInt(m[1], 10);
    return 1;
}

// Danmu.getDanmuFrom1314
async function getDanmuFrom1314(name, episode) {
    try {
        const url = 'http://127.0.0.1:1314/danmu/auto?name=' + encodeURIComponent(name) + '&episode=' + episode + '&format=xml';
        const content = await httpGet(url, {});
        if (!content) return '';
        if (content.indexOf('<d') > -1 && content.indexOf('</d>') > -1) return content;
        return '';
    } catch (e) {
        return '';
    }
}

// Danmu.formatDanmuUrl2
async function formatDanmuUrl(raw) {
    if (!raw) return '';
    if (/^\s*<\?xml/i.test(raw)) return raw;
    if (raw.indexOf('http') === 0) {
        try {
            return await httpGet('http://127.0.0.1:1314/danmu/get?url=' + raw + '&format=xml', {});
        } catch (e) {
            return '';
        }
    }
    if (raw.indexOf('vodid://') === 0) {
        try {
            const seg = raw.substring('vodid://'.length).split('@');
            return await httpGet('http://127.0.0.1:1314/danmu/get?url=' + seg[0] + '&platform=' + (seg[1] || '') + '&format=xml', {});
        } catch (e) {
            return '';
        }
    }
    if (raw.indexOf('vodurl://') === 0) {
        try {
            const seg = raw.substring('vodurl://'.length).split('@');
            return await httpGet('http://127.0.0.1:1314/danmu/auto?name=' + seg[0] + '&episode=' + (seg[1] || '') + '&total=' + (seg[2] || '') + '&platform=' + (seg[3] || '') + '&format=xml', {});
        } catch (e) {
            return '';
        }
    }
    return '';
}

// Danmu.generateCombinedWhite：15 白 + 红/黄/蓝/绿/紫
const WHITE_POOL = ['16777215', '16777215', '16777215', '16777215', '16777215',
    '16777215', '16777215', '16777215', '16777215', '16777215',
    '16777215', '16777215', '16777215', '16777215', '16777215',
    '16711680', '16776960', '255', '65280', '8388736'];

function generateCombinedWhite() {
    return WHITE_POOL[Math.floor(Math.random() * WHITE_POOL.length)];
}

// Danmu.updateDanmuWhite
function updateDanmuWhite(xml) {
    if (!xml) return xml;
    return xml.replace(/<d p="([^"]*)">/g, function (m, attr) {
        const fields = attr.split(',');
        if (fields.length < 4) return m;
        fields[3] = generateCombinedWhite();
        return '<d p="' + fields.join(',') + '">';
    });
}

async function proxy(params) {
    const emptyResult = JSON.stringify({
        code: 200,
        content: '',
        headers: { 'Content-Type': 'application/xml' }
    });
    let target = '';
    try {
        target = decodeURIComponent(params.url || '');
    } catch (e) {
        target = params.url || '';
    }
    const query = target.indexOf('?') === 0 ? target.substring(1) : target;
    const sp = new URLSearchParams(query);
    if (sp.get('do') !== 'appdanmu') return emptyResult;

    const vodName = sp.get('vodName') || '';
    const vodIndex = sp.get('vodIndex') || '';
    if (!vodName) return emptyResult;

    const realName = getRealName(vodName);
    const episode = parseVodIndex(vodIndex);

    let danmu = await getDanmuFrom1314(realName, episode);
    danmu = await formatDanmuUrl(danmu);
    if (danmu) danmu = updateDanmuWhite(danmu);

    return JSON.stringify({
        code: 200,
        content: danmu,
        headers: { 'Content-Type': 'application/xml' }
    });
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
        proxy: proxy
    };
}
