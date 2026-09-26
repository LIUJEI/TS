// 可可影视 kkys20.com —— 由 可可.py 移植为 qjs 单文件（与 LiuLi.js 同引擎：export default + 全局 req）
// 纯文本正则解析 HTML，不依赖 cheerio/pdfa 等宿主注入；仅依赖全局 req(url,{headers}) -> {content}
const host = 'https://www.kkys20.com';
const DESC_PREFIX = '【琉🔹璃❤广告勿信👉剧情】📢';
const PLAY_SRC_RE = /playSource\s*=\s*\{[^}]*?src:\s*"([^"]+)"/;
const MEDIA_RE = /https?:\/\/[^\s"'<>]+\.(?:m3u8|mp4|flv|mkv|webm)[^\s"'<>]*/i;
const M3U8_RE = /\.m3u8/i;

const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    "Referer": host + "/"
};

let imageHost = 'https://vres.esadj.com';
let imageHosts = [
    'https://vres.esadj.com',
    'https://103.39.111.180:51050',
    'https://103.39.111.184:51050',
    'https://vres.enbymae.com',
    'https://vres.cyscyy.com'
];

const categories = [
    { type_id: '1', type_name: '电影' },
    { type_id: '2', type_name: '连续剧' },
    { type_id: '3', type_name: '动漫' },
    { type_id: '4', type_name: '综艺' },
    { type_id: '6', type_name: '短剧' }
];

// ---------------- 基础工具 ----------------

async function get(url) {
    try {
        const r = await req(url, { headers, timeout: 15000 });
        return (r && r.content != null) ? String(r.content) : null;
    } catch (e) {
        return null;
    }
}

function innerText(block) {
    if (!block) return '';
    return decodeEntity(
        block.replace(/<script[\s\S]*?<\/script>/gi, '')
             .replace(/<style[\s\S]*?<\/style>/gi, '')
             .replace(/<[^>]+>/g, '')
    ).replace(/\s+/g, ' ').trim();
}

function decodeEntity(s) {
    if (!s) return '';
    return s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
            .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;|&apos;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&');
}

function fixUrl(u) {
    if (!u) return '';
    if (u.indexOf('//') === 0) return 'https:' + u;
    if (u.indexOf('/') === 0) return host + u;
    return u;
}

function hostOf(u) {
    const m = /^https?:\/\/([^/]+)/i.exec(u);
    return m ? m[1].toLowerCase() : '';
}

function pathOf(u) {
    const m = /^https?:\/\/[^/]+(\/[^?#]*)/i.exec(u);
    return m ? m[1] : '';
}

function pic(u) {
    if (!u) return '';
    u = String(u).trim();
    if (!u || /logo_placeholder/i.test(u)) return '';
    if (u.indexOf('//') === 0) u = 'https:' + u;
    if (/^https?:/i.test(u)) {
        const h = hostOf(u);
        if (h.indexOf('vres.') >= 0 || u.indexOf(':51050') >= 0) {
            return imageHosts[0].replace(/\/$/, '') + pathOf(u);
        }
        return u;
    }
    if (u.indexOf('/') === 0) return imageHosts[0].replace(/\/$/, '') + u;
    return imageHosts[0].replace(/\/$/, '') + '/' + u.replace(/^\/+/, '');
}

// 从 <a ... class="v-item">...</a> 块提取封面：第一张非占位图
function pickPic(block) {
    const re = /<img[^>]*\bdata-original="([^"]*)"/gi;
    let m;
    while ((m = re.exec(block))) {
        if (!/logo_placeholder/i.test(m[1])) return pic(m[1]);
    }
    return '';
}

function parseList(html) {
    const out = [];
    if (!html) return out;
    const headRe = /<a[^>]*href="\/detail\/(\d+)\.html"[^>]*class="v-item"[^>]*>/g;
    let m;
    const seen = new Set();
    while ((m = headRe.exec(html))) {
        if (seen.has(m[1])) continue;
        const block = html.slice(m.index, html.indexOf('</a>', headRe.lastIndex) + 4);
        if (!block || block.length < 4) continue;
        seen.add(m[1]);
        const nm = /<div class="v-item-title">([\s\S]*?)<\/div>/.exec(block);
        const rb = /<div class="v-item-bottom">([\s\S]*?)<\/div>/.exec(block);
        const name = nm ? innerText(nm[1]) : '';
        if (!name) continue;
        out.push({
            vod_id: m[1],
            vod_name: name,
            vod_pic: pickPic(block),
            vod_remarks: rb ? innerText(rb[1]) : ''
        });
    }
    return out;
}

// ---------------- 筛选 ----------------

function buildFilters() {
    const types = {
        "1": ["剧情", "喜剧", "动作", "爱情", "恐怖", "惊悚", "犯罪", "科幻", "悬疑", "奇幻", "冒险", "战争", "历史", "古装", "家庭", "传记", "武侠", "歌舞", "短片", "动画", "儿童", "职场"],
        "2": ["剧情", "爱情", "喜剧", "犯罪", "悬疑", "古装", "动作", "家庭", "惊悚", "奇幻", "美剧", "科幻", "历史", "战争", "韩剧", "武侠", "言情", "恐怖", "冒险", "都市", "职场"],
        "3": ["动态漫画", "剧情", "动画", "喜剧", "冒险", "动作", "奇幻", "科幻", "儿童", "搞笑", "爱情", "家庭", "短片", "热血", "益智", "悬疑", "经典", "校园", "Anime", "运动", "亲子", "青春", "恋爱", "武侠", "惊悚"],
        "4": ["纪录", "真人秀", "记录", "脱口秀", "剧情", "历史", "喜剧", "传记", "相声", "节目", "歌舞", "冒险", "运动", "Season", "犯罪", "短片", "搞笑", "晚会"],
        "6": ["王爷太子", "霸道总裁", "屌丝逆袭", "赘婿系列", "重生系列", "穿越短剧", "美女总裁", "娇妻系列", "龙王系列", "都市言情", "逆袭", "甜宠", "虐恋", "穿越", "重生", "剧情", "科幻", "武侠", "爱情", "动作", "战争", "冒险", "其它"]
    };
    const areas = {
        "1": [["大陆", "中国大陆"], ["香港", "中国香港"], ["台湾", "中国台湾"], ["美国", "美国"], ["日本", "日本"], ["韩国", "韩国"], ["英国", "英国"], ["法国", "法国"], ["德国", "德国"], ["印度", "印度"], ["泰国", "泰国"], ["丹麦", "丹麦"], ["瑞典", "瑞典"], ["巴西", "巴西"], ["加拿大", "加拿大"], ["俄罗斯", "俄罗斯"], ["意大利", "意大利"], ["比利时", "比利时"], ["爱尔兰", "爱尔兰"], ["西班牙", "西班牙"], ["澳大利亚", "澳大利亚"], ["其他", "其他"]],
        "2": [["大陆", "中国大陆"], ["香港", "中国香港"], ["韩国", "韩国"], ["美国", "美国"], ["日本", "日本"], ["法国", "法国"], ["英国", "英国"], ["德国", "德国"], ["台湾", "中国台湾"], ["泰国", "泰国"], ["印度", "印度"], ["其他", "其他"]],
        "3": [["日本", "日本"], ["大陆", "中国大陆"], ["台湾", "中国台湾"], ["美国", "美国"], ["香港", "中国香港"], ["韩国", "韩国"], ["英国", "英国"], ["法国", "法国"], ["德国", "德国"], ["印度", "印度"], ["泰国", "泰国"], ["丹麦", "丹麦"], ["瑞典", "瑞典"], ["巴西", "巴西"], ["加拿大", "加拿大"], ["俄罗斯", "俄罗斯"], ["意大利", "意大利"], ["比利时", "比利时"], ["爱尔兰", "爱尔兰"], ["西班牙", "西班牙"], ["澳大利亚", "澳大利亚"], ["其他", "其他"]],
        "4": [["大陆", "中国大陆"], ["香港", "中国香港"], ["台湾", "中国台湾"], ["美国", "美国"], ["日本", "日本"], ["韩国", "韩国"], ["其他", "其他"]]
    };
    const langs = ["国语", "粤语", "英语", "日语", "韩语", "法语", "其他"];
    const years = [["2026", "2026"], ["2025", "2025"], ["2024", "2024"], ["2023", "2023"], ["2022", "2022"], ["2021", "2021"], ["2020", "2020"], ["10年代", "2010_2019"], ["00年代", "2000_2009"], ["90年代", "1990_1999"], ["80年代", "1980_1989"], ["更早", "0_1979"]];
    const sorts = {
        "1": [["综合", "1"], ["最新", "2"], ["最热", "3"], ["评分", "4"]],
        "2": [["综合", "1"], ["最新", "2"], ["最热", "3"], ["评分", "4"]],
        "3": [["综合", "1"], ["最新", "2"], ["最热", "3"], ["评分", "4"]],
        "4": [["综合", "1"], ["最新", "2"], ["最热", "3"], ["评分", "4"]],
        "6": [["综合", "1"], ["最新", "2"], ["最热", "3"]]
    };
    const result = {};
    for (const c of categories) {
        const tid = c.type_id;
        const items = [{
            key: 'type', name: '类型',
            value: [{ n: '全部', v: '' }].concat(types[tid].map(t => ({ n: t, v: t })))
        }];
        if (tid !== '6') {
            items.push({
                key: 'area', name: '地区',
                value: [{ n: '全部', v: '' }].concat((areas[tid] || []).map(a => ({ n: a[0], v: a[1] })))
            });
            items.push({
                key: 'lang', name: '语言',
                value: [{ n: '全部', v: '' }].concat(langs.map(l => ({ n: l, v: l })))
            });
            items.push({
                key: 'year', name: '年份',
                value: [{ n: '全部', v: '' }].concat(years.map(y => ({ n: y[0], v: y[1] })))
            });
        }
        items.push({
            key: 'sort', name: '排序',
            value: (sorts[tid] || sorts['1']).map(s => ({ n: s[0], v: s[1] }))
        });
        result[tid] = items;
    }
    return result;
}

const filters = buildFilters();

// ---------------- 线路与可播探测 ----------------

// 播放页是否内嵌可直连的 m3u8；mp4 等不做整文件下载，直接视为可播
async function playable(pageUrl) {
    const h = await get(pageUrl);
    if (!h) return false;
    let u = null;
    const m = PLAY_SRC_RE.exec(h);
    if (m) {
        u = fixUrl(m[1]);
    } else {
        const m2 = MEDIA_RE.exec(h);
        if (m2) u = m2[0];
    }
    if (!u) return false;
    if (!M3U8_RE.test(u)) return true;
    try {
        const r = await req(u, { headers: { 'User-Agent': headers['User-Agent'], 'Referer': host + '/' } });
        const c = (r && r.content != null) ? String(r.content).trim() : '';
        return !!c && c[0] !== '<';
    } catch (e) {
        return false;
    }
}

function playLines(treeHtml) {
    const srcBoxM = /<div[^>]*class="[^"]*source-list-box-main[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<div[^>]*class="[^"]*episode-list-box-main/.exec(treeHtml);
    let sources = [];
    if (srcBoxM) {
        const re = /<span[^>]*class="[^"]*source-item-label[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
        let m;
        while ((m = re.exec(srcBoxM[1]))) {
            const name = innerText(m[1]);
            if (name) sources.push(name);
        }
    }
    const epBoxM = /<div[^>]*class="[^"]*episode-list-box-main[^"]*"[^>]*>([\s\S]*?)$/.exec(treeHtml);
    const lines = [];
    if (epBoxM) {
        const listRe = /<div[^>]*class="[^"]*episode-list[^"]*"[^>]*>([\s\S]*?)(?=<div[^>]*class="[^"]*episode-list[^"]*"|<\/div>\s*<\/div>|$)/g;
        let lm;
        while ((lm = listRe.exec(epBoxM[1]))) {
            const eps = [];
            const aRe = /<a[^>]*href="([^"]*\/play\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
            let am;
            while ((am = aRe.exec(lm[1]))) {
                const t = innerText(am[2]) || '播放';
                eps.push(t + '$' + fixUrl(am[1]));
            }
            if (eps.length) lines.push(eps);
        }
    }
    if (!lines.length) return [];
    if (!sources.length) sources = lines.map((_, i) => '线路' + (i + 1));
    while (lines.length > sources.length) sources.push('线路' + (sources.length + 1));
    const pairs = [];
    for (let i = 0; i < lines.length; i++) pairs.push([sources[i], lines[i]]);
    return pairs.filter(p => !/4k/i.test(p[0]));
}

function cleanNames(txt) {
    return txt.replace(/\s*\/\s*/g, '/').replace(/\s+/g, ' ').replace(/^[\s/]+|[\s/]+$/g, '');
}

// ---------------- qjs 接口 ----------------

async function init(cfg) {
    // 动态发现图片 CDN 主机（失败则用内置列表）
    try {
        const r = await req('https://vf.esadj.com/vod_pc_static_kkdy/js/rdul.js?ver=123456666', { headers, timeout: 10000 });
        const t = (r && r.content != null) ? String(r.content) : '';
        if (t && t.indexOf('vres.') >= 0) {
            let hs = (t.match(/"(https?:\/\/[^"]+)"/g) || [])
                .map(s => s.slice(1, -1).replace(/\/+$/, ''))
                .filter(h => h.indexOf('vres.') >= 0 || h.indexOf(':51050') >= 0);
            if (hs.length) {
                const uniq = [];
                const seen = new Set();
                for (const h of imageHosts.concat(hs)) {
                    if (!seen.has(h)) { seen.add(h); uniq.push(h); }
                }
                imageHosts = uniq;
                imageHost = uniq[0];
            }
        }
    } catch (e) {}
}

async function home(filter) {
    const html = await get(host + '/');
    return JSON.stringify({
        class: categories,
        filters: filters,
        list: parseList(html)
    });
}

async function homeVod() {
    const html = await get(host + '/');
    return JSON.stringify({ list: parseList(html) });
}

async function category(tid, pg, filter, extend) {
    extend = extend || {};
    const typ = encodeURIComponent(extend.type || '');
    const area = encodeURIComponent(extend.area || '');
    const lang = encodeURIComponent(extend.lang || '');
    const year = encodeURIComponent(extend.year || '');
    const sort = extend.sort || '3';
    const page = parseInt(pg || 1) || 1;
    const url = host + '/show/' + [tid, typ, area, lang, year, sort, page].join('-') + '.html';
    const html = await get(url);
    const items = parseList(html);
    const pagecount = (html && html.indexOf('page-item-next') >= 0) ? page + 1 : page;
    return JSON.stringify({ page: page, pagecount: pagecount, limit: items.length, total: items.length, list: items });
}

async function detail(id) {
    const html = await get(host + '/detail/' + id + '.html');
    const result = { list: [] };
    if (!html) return JSON.stringify(result);

    // 标题：CSS 只显示偶数位 strong（水印在奇数位）
    let name = '';
    const titleBox = /<div[^>]*class="[^"]*detail-title[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(html);
    if (titleBox) {
        const strongs = [];
        const re = /<strong[^>]*>([\s\S]*?)<\/strong>/g;
        let m;
        while ((m = re.exec(titleBox[1]))) strongs.push(innerText(m[1]));
        name = strongs.filter((_, i) => i % 2 === 1).join('').trim() || (strongs[0] || '');
    }

    let picUrl = '';
    const picBox = /<div[^>]*class="[^"]*detail-pic[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(html);
    if (picBox) picUrl = pickPic(picBox[1]);

    let desc = '';
    const descBox = /<div[^>]*class="[^"]*detail-desc[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(html);
    if (descBox) desc = innerText(descBox[1]);
    if (desc && desc.indexOf(DESC_PREFIX) !== 0) desc = DESC_PREFIX + desc;

    const vod = {
        vod_id: id,
        vod_name: name,
        vod_pic: picUrl,
        vod_content: desc
    };

    // 信息行（导演/演员/首映/备注）：side/main 在全文中严格交替出现，按序配对
    const rows = {};
    const sideTexts = [];
    const mainTexts = [];
    const sideRe = /detail-info-row-side[^>]*>([\s\S]*?)<\/div>/g;
    const mainRe = /detail-info-row-main[^>]*>([\s\S]*?)<\/div>/g;
    let rm;
    while ((rm = sideRe.exec(html))) sideTexts.push(innerText(rm[1]));
    while ((rm = mainRe.exec(html))) mainTexts.push(innerText(rm[1]));
    for (let i = 0; i < sideTexts.length; i++) {
        const k = sideTexts[i].replace(/:+$/, '');
        const v = mainTexts[i] || '';
        if (k && v) rows[k] = v;
    }
    if (rows['导演']) vod.vod_director = cleanNames(rows['导演']);
    if (rows['演员']) vod.vod_actor = cleanNames(rows['演员']);
    if (rows['首映']) {
        const ym = /(?:19|20)\d{2}/.exec(rows['首映']);
        if (ym) vod.vod_year = ym[0];
    }
    if (rows['备注']) vod.vod_remarks = rows['备注'];

    // 标签：年份 / 地区 / 类型
    const tagBoxM = /<div[^>]*class="[^"]*detail-tags[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(html);
    if (tagBoxM) {
        const tags = [];
        const re = /<a[^>]*class="[^"]*detail-tags-item[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
        let m;
        while ((m = re.exec(tagBoxM[1]))) {
            const t = innerText(m[1]);
            if (t) tags.push(t);
        }
        if (tags.length) {
            const ym = /(?:19|20)\d{2}/.exec(tags[0]);
            if (!vod.vod_year && ym) vod.vod_year = ym[0];
            if (tags.length > 1) vod.vod_area = tags[1];
            if (tags.length > 2) vod.vod_type = tags.slice(2).join('/');
        }
    }

    const lines = playLines(html);
    if (!lines.length) return JSON.stringify(result);

    // 优先把可直连线路排到最前（只探测前 8 条的首集）
    const firstEpUrl = lines[0][1][0].split('$')[1];
    if (!(await playable(firstEpUrl))) {
        for (let i = 1; i < Math.min(lines.length, 8); i++) {
            const u = lines[i][1][0].split('$')[1];
            if (await playable(u)) {
                lines.splice(0, 0, lines.splice(i, 1)[0]);
                break;
            }
        }
    }

    vod.vod_play_from = lines.map(p => p[0]).join('$$$');
    vod.vod_play_url = lines.map(p => p[1].join('#')).join('$$$');
    result.list.push(vod);
    return JSON.stringify(result);
}

async function search(wd, quick, pg) {
    pg = pg || 1;
    const k = encodeURIComponent(wd);
    const items = [];
    const h1 = await get(host + '/search?k=' + k);
    const tm = /name="t"\s+value="([^"]+)"/.exec(h1 || '');
    if (tm) {
        let url = host + '/search?k=' + k + '&t=' + encodeURIComponent(tm[1]);
        if (pg !== 1) url += '&page=' + pg;
        const h2 = await get(url);
        if (h2) {
            const headRe = /<a[^>]*href="\/detail\/(\d+)\.html"[^>]*class="search-result-item"[^>]*>/g;
            let m;
            while ((m = headRe.exec(h2))) {
                const block = h2.slice(m.index, h2.indexOf('</a>', headRe.lastIndex) + 4);
                const nm = /<div[^>]*class="[^"]*\btitle\b[^"]*"[^>]*>([\s\S]*?)<\/div>/.exec(block);
                const name = nm ? innerText(nm[1]) : '';
                if (!name) continue;
                items.push({ vod_id: m[1], vod_name: name, vod_pic: pickPic(block) });
            }
        }
    }
    return JSON.stringify({ list: items, page: pg });
}

async function play(flag, id, vipFlags) {
    const url = fixUrl(id);
    let playUrl = '';
    const html = await get(url);
    if (html) {
        const m = PLAY_SRC_RE.exec(html);
        if (m) {
            playUrl = fixUrl(m[1]);
        } else {
            const m2 = MEDIA_RE.exec(html);
            if (m2) playUrl = fixUrl(m2[0]);
        }
    }
    if (!playUrl) {
        return JSON.stringify({ parse: 1, url: url, header: headers });
    }
    return JSON.stringify({
        parse: 0,
        url: playUrl,
        header: {
            'User-Agent': headers['User-Agent'],
            'Referer': host + '/'
        }
    });
}

export default { init, home, homeVod, category, detail, search, play };
