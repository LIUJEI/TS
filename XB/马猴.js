// 大马猴影视 dmhyy.com —— 由 马猴.py 移植为 qjs 单文件（与 LiuLi.js 同引擎：export default + 全局 req）
// 纯 JSON API：分类(23/22/24/25) + 聚合直链线路优先
const host0 = 'https://dmhyy.com';
const DESC_PREFIX = '【琉🔹璃❤广告勿信👉剧情】📢';
const VIDEO_RE = /\.(m3u8|mp4|flv|mkv|avi)(\?|#|$|\s)/i;

let host = host0;
let webSign = '';

const classes = [
    { type_id: '23', type_name: '电影' },
    { type_id: '22', type_name: '剧集' },
    { type_id: '24', type_name: '动漫' },
    { type_id: '25', type_name: '综艺' }
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36';

function ensureReady() {
    if (!host) host = host0;
    host = String(host).replace(/\/+$/, '');
}

function headers(referer) {
    ensureReady();
    const h = {
        'User-Agent': UA,
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Referer': referer || (host + '/'),
        'x-platform': 'web',
        'x-requested-with': 'XMLHttpRequest'
    };
    if (webSign) h['web-sign'] = webSign;
    return h;
}

async function apiGet(path, params, referer) {
    ensureReady();
    params = params || {};
    const qs = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
    const url = host + path + (qs ? '?' + qs : '');
    try {
        const r = await req(url, { headers: headers(referer), timeout: 12000 });
        const text = (r && r.content != null) ? String(r.content) : '';
        return text ? JSON.parse(text) : {};
    } catch (e) {
        return {};
    }
}

function cleanText(s) {
    s = String(s == null ? '' : s);
    return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function asList(data) {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
        for (const k of ['data', 'list', 'items', 'records', 'rows', 'vod_list']) {
            const v = data[k];
            if (Array.isArray(v)) return v;
            if (v && typeof v === 'object') {
                const vv = asList(v);
                if (vv.length) return vv;
            }
        }
    }
    return [];
}

function joinArr(v) {
    return Array.isArray(v) ? v.map(x => String(x)).filter(Boolean).join(',') : v;
}

function vodItem(item) {
    if (!item || typeof item !== 'object') return null;
    const vid = item.vod_id || item.id || item.vodId;
    const name = item.vod_name || item.name || item.title;
    if (!vid || !name) return null;
    return {
        vod_id: String(vid),
        vod_name: cleanText(name),
        vod_pic: String(item.vod_pic || item.pic || item.cover || ''),
        vod_remarks: String(item.vod_remarks || item.remarks || item.vod_douban_score || item.vod_year || ''),
        vod_year: String(item.vod_year || ''),
        type_name: cleanText(item.type_name || joinArr(item.vod_class) || ''),
        vod_area: cleanText(joinArr(item.vod_area) || '')
    };
}

function vodList(data) {
    const out = [];
    const seen = new Set();
    for (const item of asList(data)) {
        const v = vodItem(item);
        if (!v || seen.has(v.vod_id)) continue;
        seen.add(v.vod_id);
        out.push(v);
    }
    return out;
}

function categoryMatch(item, realTid) {
    if (!item || typeof item !== 'object') return false;
    realTid = String(realTid);
    const itemTid = String(item.type_id || item.typeId || item.tid || '');
    if (itemTid === realTid) return true;
    const name = String(item.type_name || '');
    let cls = item.vod_class || [];
    if (Array.isArray(cls)) cls = cls.map(x => String(x)).filter(Boolean).join(',');
    else cls = String(cls || '');
    const text = name + ',' + cls;
    if (realTid === '23') {
        return (text.indexOf('电影') >= 0 || text.indexOf('动作片') >= 0 || text.indexOf('剧情片') >= 0 || text.indexOf('喜剧片') >= 0) && text.indexOf('电视剧') < 0;
    }
    if (realTid === '22') {
        return ['剧集', '电视剧', '国产剧', '连续剧', '韩剧', '陆剧', '欧美剧', '日剧'].some(k => text.indexOf(k) >= 0);
    }
    if (realTid === '24') {
        return text.indexOf('动漫') >= 0 || text.indexOf('动画') >= 0 || text.indexOf('国产动漫') >= 0 || text.indexOf('日韩动漫') >= 0;
    }
    if (realTid === '25') {
        return text.indexOf('综艺') >= 0 || text.indexOf('真人秀') >= 0;
    }
    return true;
}

function lineRank(src) {
    const name = String(src.site_name || src.external_display_name || src.vod_play_from || '').toLowerCase();
    const fromCode = String(src.vod_play_from || src.external_play_from || '').toLowerCase();
    const url = String(src.vod_play_url || '');
    if (VIDEO_RE.test(url)) {
        if (name.indexOf('暴风') >= 0 || fromCode.indexOf('bfzy') >= 0) return 1;
        if (name.indexOf('爱坤') >= 0 || fromCode.indexOf('ikm3u8') >= 0) return 2;
        if (name.indexOf('极速') >= 0 || fromCode.indexOf('jsm3u8') >= 0) return 3;
        if (name.indexOf('如意') >= 0 || fromCode.indexOf('rym3u8') >= 0) return 4;
        if (name.indexOf('量子') >= 0 || fromCode.indexOf('lzm3u8') >= 0) return 5;
        return 10;
    }
    if (parseInt(src.decode_status || 0) === 0) return 50;
    return 99;
}

async function aggregateSources(vid) {
    for (const path of ['/api.php/web/internal/search_aggregate', '/api.php/web/search_aggregate']) {
        const j = await apiGet(path, { vod_id: String(vid) }, host + '/play/' + vid);
        const arr = asList(j);
        if (arr.length) return arr;
    }
    return [];
}

// ---------------- qjs 接口 ----------------

async function init(cfg) {
    // 兼容 extend 传 {site, web-sign}（qjs 下 cfg.extend 可能为字符串或对象）
    try {
        let ext = cfg && cfg.extend;
        if (typeof ext === 'string' && ext.trim()) {
            ext = ext.trim().startsWith('{') ? JSON.parse(ext) : { site: ext };
        }
        if (ext && typeof ext === 'object') {
            const site = ext.site || ext.host || '';
            if (site) host = String(site).split(',')[0].trim().replace(/\/+$/, '');
            webSign = ext['web-sign'] || ext.web_sign || webSign;
        }
    } catch (e) {}
}

async function home(filter) {
    return JSON.stringify({ class: classes, filters: {} });
}

async function homeVod() {
    const j = await apiGet('/api.php/web/filter/vod', { type_id: '23', page: '1', sort: 'hits' }, host + '/type/23');
    return JSON.stringify({ list: vodList(j) });
}

async function category(tid, pg, filter, extend) {
    ensureReady();
    let page = parseInt(pg || 1) || 1;
    let sort = 'hits';
    if (extend && typeof extend === 'object') sort = extend.sort || extend.by || sort;

    const tidMap = { '1': '23', '2': '22', '3': '24', '4': '25' };
    const realTid = tidMap[String(tid)] || String(tid);

    const j = await apiGet('/api.php/web/filter/vod', { type_id: realTid, page: String(page), sort: sort }, host + '/type/' + realTid);
    let filtered = asList(j).filter(x => categoryMatch(x, realTid));

    // 当前页过滤后太少：补抓后 2 页，避免分类页空白
    if (filtered.length < 8) {
        const seenIds = new Set(filtered.map(x => String((x && (x.vod_id || x.id)) || '')));
        for (let extraPage = page + 1; extraPage <= page + 2; extraPage++) {
            const jj = await apiGet('/api.php/web/filter/vod', { type_id: realTid, page: String(extraPage), sort: sort }, host + '/type/' + realTid);
            for (const item of asList(jj).filter(x => categoryMatch(x, realTid))) {
                const vid = String(item.vod_id || item.id || '');
                if (vid && !seenIds.has(vid)) {
                    seenIds.add(vid);
                    filtered.push(item);
                }
            }
            if (filtered.length >= 24) break;
        }
    }

    const videos = vodList(filtered);
    let pagecount = 1;
    let total = videos.length;
    let limit = 24;
    if (j && typeof j === 'object') {
        pagecount = parseInt(j.pageCount || j.pagecount || (videos.length ? page + 1 : page)) || page;
        total = parseInt(j.total || total) || total;
        limit = parseInt(j.limit || limit) || limit;
    }
    return JSON.stringify({ list: videos, page: page, pagecount: pagecount, limit: limit, total: total });
}

async function search(wd, quick, pg) {
    ensureReady();
    wd = String(wd || '').trim();
    const page = parseInt(pg || 1) || 1;
    if (!wd) return JSON.stringify({ list: [], page: page });
    const j = await apiGet('/api.php/web/search/index', { wd: wd, page: String(page) }, host + '/search?keyword=' + encodeURIComponent(wd));
    const videos = vodList(j);
    return JSON.stringify({ list: videos, page: page });
}

async function detail(id) {
    ensureReady();
    const vid = String(id);
    if (!vid) return JSON.stringify({ list: [] });

    const dj = await apiGet('/api.php/web/vod/get_detail', { vod_id: vid }, host + '/play/' + vid);
    const darr = asList(dj);
    let d = darr[0] || null;

    let agg = [];
    if (!d) {
        agg = await aggregateSources(vid);
        if (!agg.length) return JSON.stringify({ list: [] });
        d = agg[0];
    }

    const area = Array.isArray(d.vod_area) ? d.vod_area.map(x => String(x)).filter(Boolean).join(',') : (d.vod_area || '');
    const cls = Array.isArray(d.vod_class) ? d.vod_class.map(x => String(x)).filter(Boolean).join(',') : (d.vod_class || '');

    // 组装线路：聚合直链优先(最多4) → get_detail 直链补足 → 最后才放解析线路
    const sources = [];
    const seen = new Set();
    function addSource(name, playUrl) {
        name = cleanText(name);
        playUrl = String(playUrl || '').trim();
        if (!name || !playUrl) return;
        const key = name + '|' + playUrl.slice(0, 80);
        if (seen.has(key)) return;
        seen.add(key);
        sources.push([name, playUrl]);
    }

    if (!agg.length) agg = await aggregateSources(vid);
    if (agg.length) {
        agg.sort((a, b) => lineRank(a) - lineRank(b));
        for (const src of agg) {
            const playUrl = String(src.vod_play_url || '').trim();
            if (!playUrl || !VIDEO_RE.test(playUrl)) continue;
            addSource(src.site_name || src.external_display_name || src.external_play_from || src.vod_play_from || '线路', playUrl);
            if (sources.length >= 4) break;
        }
    }

    const pf = String(d.vod_play_from || '');
    const pu = String(d.vod_play_url || '');
    if (pf && pu && sources.length < 2) {
        const froms = pf.split('$$$');
        const urls = pu.split('$$$');
        for (let i = 0; i < froms.length; i++) {
            const u = urls[i] || '';
            if (!froms[i] || !u || !VIDEO_RE.test(u)) continue;
            addSource(froms[i], u);
            if (sources.length >= 4) break;
        }
    }

    if (!sources.length && pf && pu) {
        const froms = pf.split('$$$');
        const urls = pu.split('$$$');
        for (let i = 0; i < Math.min(froms.length, 3); i++) {
            addSource(froms[i], urls[i] || '');
        }
    }

    let content = cleanText(d.vod_content || '');
    if (content && content.indexOf(DESC_PREFIX) !== 0) content = DESC_PREFIX + content;

    const vod = {
        vod_id: vid,
        vod_name: cleanText(d.vod_name || ''),
        vod_pic: String(d.vod_pic || ''),
        vod_remarks: String(d.vod_remarks || ''),
        type_name: cleanText(d.type_name || cls || ''),
        vod_year: String(d.vod_year || ''),
        vod_area: cleanText(area),
        vod_actor: cleanText(d.vod_actor || ''),
        vod_director: cleanText(d.vod_director || ''),
        vod_content: content,
        vod_play_from: sources.map(x => x[0]).join('$$$'),
        vod_play_url: sources.map(x => x[1]).join('$$$')
    };
    return JSON.stringify({ list: [vod] });
}

async function play(flag, id, vipFlags) {
    ensureReady();
    const url = String(id || '').trim();
    if (!url) return JSON.stringify({ parse: 0, url: '' });

    if (url.indexOf('http') === 0 && VIDEO_RE.test(url)) {
        return JSON.stringify({
            parse: 0,
            jx: 0,
            url: url,
            header: { 'User-Agent': 'Mozilla/5.0', 'Referer': host + '/' }
        });
    }

    // 官方编码线路：尝试 GET decode 接口的三种参数名
    const candidates = [
        ['/api.php/web/decode/url', { url: url }],
        ['/api.php/web/decode/url', { play_url: url }],
        ['/api.php/web/decode/url', { vod_url: url }]
    ];
    for (const c of candidates) {
        const j = await apiGet(c[0], c[1], host + '/play');
        const data = j && typeof j === 'object' ? j.data : null;
        let finalUrl = '';
        let hdrs = null;
        if (typeof data === 'string') {
            finalUrl = data;
        } else if (data && typeof data === 'object') {
            finalUrl = data.url || data.play_url || data.playUrl || data.video || '';
            hdrs = data.header || data.headers || null;
        } else if (j && typeof j === 'object') {
            finalUrl = j.url || j.play_url || '';
            hdrs = j.header || j.headers || null;
        }
        if (finalUrl) {
            const isVideo = VIDEO_RE.test(finalUrl);
            return JSON.stringify({
                parse: isVideo ? 0 : 1,
                jx: isVideo ? 0 : 1,
                url: finalUrl,
                header: hdrs || { 'User-Agent': 'Mozilla/5.0', 'Referer': host + '/' }
            });
        }
    }

    // 腾讯/优酷/爱奇艺等或其它未知地址交给壳嗅探
    return JSON.stringify({ parse: 1, jx: 1, url: url });
}

export default { init, home, homeVod, category, detail, search, play };
