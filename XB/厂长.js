// 厂长影视 hebeigoogle.com —— 由 厂长.py 移植为 qjs 单文件（与 LiuLi.js 同引擎：export default + 全局 req）
// 纯 HTML 站：lxml xpath 已改写为正则解析；播放页提取 var player_aaaa JSON
const host = 'https://www.hebeigoogle.com';
const DESC_PREFIX = '【琉🔹璃❤广告勿信👉剧情】📢';
const VIDEO_RE = /\.(m3u8|mp4|flv|avi|mkv|mov)(\?|$)/i;
const HEAD = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    'Referer': host + '/',
    'Accept-Language': 'zh-CN,zh;q=0.9'
};

const CLASSES = [
    { type_name: '电影', type_id: '1' },
    { type_name: '电视剧', type_id: '2' },
    { type_name: '综艺', type_id: '3' },
    { type_name: '动漫', type_id: '4' },
    { type_name: '短剧', type_id: '5' }
];

function opts(pairs) {
    return pairs.map(p => ({ n: p[0], v: p[1] }));
}

function buildFilters() {
    const years = [{ n: '全部', v: '' }];
    for (let y = 2026; y >= 2010; y--) years.push({ n: String(y), v: String(y) });
    const area = ['全部', '大陆', '香港', '台湾', '美国', '法国', '英国', '日本', '韩国', '德国', '泰国', '印度', '其他']
        .map(i => ({ n: i, v: i === '全部' ? '' : i }));
    const by = [{ n: '最新', v: 'time' }, { n: '最热', v: 'hits' }, { n: '评分', v: 'score' }];
    return {
        '1': [
            { key: 'cate', name: '类型', value: opts([['全部', ''], ['动作片', '6'], ['喜剧片', '7'], ['爱情片', '8'], ['科幻片', '9'], ['恐怖片', '10'], ['剧情片', '11'], ['战争片', '12'], ['纪录片', '13'], ['悬疑片', '14'], ['犯罪片', '15'], ['动画片', '16']]) },
            { key: 'area', name: '地区', value: area },
            { key: 'year', name: '年代', value: years },
            { key: 'by', name: '排序', value: by }
        ],
        '2': [
            { key: 'cate', name: '类型', value: opts([['全部', ''], ['国产剧', '17'], ['港台剧', '18'], ['日韩剧', '20'], ['欧美剧', '21'], ['海外剧', '22']]) },
            { key: 'area', name: '地区', value: area },
            { key: 'year', name: '年代', value: years },
            { key: 'by', name: '排序', value: by }
        ],
        '3': [
            { key: 'cate', name: '类型', value: opts([['全部', ''], ['大陆综艺', '23'], ['港台综艺', '24'], ['日韩综艺', '25'], ['欧美综艺', '26']]) },
            { key: 'area', name: '地区', value: area },
            { key: 'year', name: '年代', value: years },
            { key: 'by', name: '排序', value: by }
        ],
        '4': [
            { key: 'cate', name: '类型', value: opts([['全部', ''], ['国产动漫', '27'], ['日韩动漫', '28'], ['欧美动漫', '29'], ['其他动漫', '30']]) },
            { key: 'area', name: '地区', value: area },
            { key: 'year', name: '年代', value: years },
            { key: 'by', name: '排序', value: by }
        ],
        '5': [
            { key: 'class', name: '类型', value: opts([['全部', ''], ['女频恋爱', '女频恋爱'], ['反转爽', '反转爽'], ['脑洞悬疑', '脑洞悬疑'], ['年代穿越', '年代穿越'], ['古装仙侠', '古装仙侠'], ['现代都市', '现代都市']]) },
            { key: 'year', name: '年代', value: years },
            { key: 'by', name: '排序', value: by }
        ]
    };
}

// ---------------- 工具 ----------------

async function fetchText(url) {
    try {
        const r = await req(url, { headers: HEAD, timeout: 15000 });
        return (r && r.content != null) ? String(r.content) : '';
    } catch (e) {
        return '';
    }
}

function stripTags(s) {
    return String(s || '').replace(/<[^>]+>/g, ' ');
}

function cleanText(s) {
    return String(s == null ? '' : s)
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// py _clean：合并空白后剥掉头尾的 空格//全角空格
function cleanCz(s) {
    return cleanText(s).replace(/^[ /　]+|[ /　]+$/g, '');
}

function unescapeHtml(s) {
    return String(s || '')
        .replace(/&(amp|nbsp|quot|lt|gt|#39);/g, function (m, e) {
            switch (e) {
                case 'amp': return '&';
                case 'nbsp': return ' ';
                case 'quot': return '"';
                case 'lt': return '<';
                case 'gt': return '>';
                case '#39': return "'";
            }
            return m;
        })
        .replace(/&#(x?[0-9a-fA-F]+);/g, function (m, n) {
            const code = (n[0] === 'x' || n[0] === 'X') ? parseInt(n.slice(1), 16) : parseInt(n, 10);
            return isNaN(code) ? m : String.fromCharCode(code);
        });
}

function fixUrl(u) {
    u = String(u || '').trim();
    if (!u) return '';
    if (u.indexOf('//') === 0) return 'https:' + u;
    if (u.indexOf('http') === 0) return u;
    if (u.indexOf('/') === 0) return host + u;
    return host + '/' + u;
}

function safeUnquote(s) {
    try {
        return decodeURIComponent(s);
    } catch (e) {
        return s;
    }
}

function withPrefix(s) {
    s = String(s == null ? '' : s);
    if (s && s.indexOf(DESC_PREFIX) !== 0) s = DESC_PREFIX + s;
    return s;
}

// ---------------- 列表解析 ----------------

function parseVods(html) {
    const vods = [];
    const seen = {};
    const chunks = String(html || '').split('<li class="dx-vod"');
    for (let i = 1; i < chunks.length; i++) {
        let chunk = chunks[i];
        const end = chunk.indexOf('</li>');
        if (end >= 0) chunk = chunk.slice(0, end);
        try {
            let data = {};
            const jm = chunk.match(/data-json='([\s\S]*?)'/);
            if (jm) data = JSON.parse(unescapeHtml(jm[1]));
            const hm = chunk.match(/href="(\/igojs\/\d+\.html)"/);
            const link = data.link || (hm ? hm[1] : '');
            const idm = chunk.match(/data-id="(\d+)"/);
            let mid = String(data.id || (idm ? idm[1] : '') || '');
            if (!mid && link) {
                const im = String(link).match(/\/igojs\/(\d+)\.html/);
                mid = im ? im[1] : '';
            }
            if (!mid || seen[mid]) continue;
            seen[mid] = 1;
            const tm = chunk.match(/<h5[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h5>/);
            const am = chunk.match(/<a[^>]*class="[^"]*cover-area[^"]*"[^>]*title="([^"]*)"/);
            const name = data.name || (tm ? cleanText(tm[1]) : '') || (am ? am[1] : '');
            const pm = chunk.match(/data-original="([^"]*)"/);
            const im2 = chunk.match(/<img[^>]*src="([^"]*)"/);
            const pic = data.pic || (pm ? pm[1] : '') || (im2 ? im2[1] : '');
            const rm = chunk.match(/<span class="vod_remarks">([\s\S]*?)<\/span>/);
            const remarks = rm ? cleanText(rm[1]) : '';
            if (name) {
                vods.push({ vod_id: mid, vod_name: cleanText(name), vod_pic: fixUrl(pic), vod_remarks: remarks });
            }
        } catch (e) {}
    }
    // 兜底：无 dx-vod 时直接扫 igojs 链接
    if (!vods.length) {
        const re = /<a[^>]*href="(\/igojs\/(\d+)\.html)"[^>]*title="([^"]*)"[^>]*>/g;
        let m;
        while ((m = re.exec(html))) {
            if (seen[m[2]]) continue;
            seen[m[2]] = 1;
            vods.push({ vod_id: m[2], vod_name: cleanText(m[3]), vod_pic: '', vod_remarks: '' });
        }
    }
    return vods;
}

function pageInfo(html, count, pg) {
    const m = String(html).match(/\/(\d+)页/);
    const tm = String(html).match(/共(\d+)条/);
    const pagecount = m ? parseInt(m[1]) : Math.max(parseInt(pg) || 1, 1);
    const total = tm ? parseInt(tm[1]) : pagecount * Math.max(count, 1);
    return { pagecount: pagecount, total: total };
}

// ---------------- 详情解析 ----------------

function infoByLabel(html, label) {
    const re = /<div class="info-items">([\s\S]*?)<\/div>\s*<\/div>/g;
    let m;
    while ((m = re.exec(html))) {
        const block = m[1];
        const lm = block.match(/<label>([\s\S]*?)<\/label>/);
        if (lm && lm[1].indexOf(label) >= 0) {
            const rest = block.slice(block.indexOf('</label>') + 8);
            return cleanCz(stripTags(rest));
        }
    }
    return '';
}

function parsePlayLists(html) {
    const sources = [];
    const urls = [];
    const tabArea = String(html).match(/<div[^>]*id="detailPlayNumTab"[\s\S]*?<\/div>/);
    if (tabArea) {
        const re = /<a[^>]*data-id="(detail_\d+)"[^>]*>([\s\S]*?)<\/a>/g;
        let m;
        while ((m = re.exec(tabArea[0]))) {
            const did = m[1];
            const name = cleanText(m[2]);
            if (!did || !name) continue;
            const dRe = new RegExp('<div id="' + did + '"[^>]*>([\\s\\S]*?)</div>');
            const dm = String(html).match(dRe);
            if (!dm) continue;
            const lRe = /<a[^>]*href="(\/igokj\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
            const eps = [];
            let lm;
            while ((lm = lRe.exec(dm[1]))) {
                const ep = cleanText(lm[2]) || '播放';
                const href = fixUrl(lm[1]);
                if (href) eps.push(ep + '$' + href);
            }
            if (eps.length) {
                sources.push(name);
                urls.push(eps.join('#'));
            }
        }
    }
    if (!sources.length) {
        const re = /<a[^>]*href="(\/igokj\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
        const eps = [];
        let m;
        while ((m = re.exec(html))) {
            const ep = cleanText(m[2]);
            const href = fixUrl(m[1]);
            if (ep && href) eps.push(ep + '$' + href);
        }
        if (eps.length) {
            sources.push('在线播放');
            urls.push(eps.join('#'));
        }
    }
    return { from: sources.join('$$$'), url: urls.join('$$$') };
}

// ---------------- 接口 ----------------

async function init(cfg) {}

async function home(filter) {
    return JSON.stringify({ class: CLASSES, filters: buildFilters() });
}

async function homeVod() {
    const html = await fetchText(host + '/');
    return JSON.stringify({ list: parseVods(html).slice(0, 24) });
}

async function category(tid, pg, filter, extend) {
    const page = parseInt(pg || 1) || 1;
    const ext = (extend && typeof extend === 'object') ? extend : {};
    const t = String(ext.cate || tid);
    const area = String(ext.area || '');
    const by = String(ext.by || 'time') || 'time';
    const cls = String(ext['class'] || '');
    const year = String(ext.year || '');
    const fields = [t, area, by, cls, '', '', '', '', String(page) === '1' ? '' : String(page), '', '', year]
        .map(x => x ? encodeURIComponent(x) : '');
    const html = await fetchText(host + '/igosw/' + fields.join('-') + '.html');
    const vods = parseVods(html);
    const pi = pageInfo(html, vods.length, page);
    return JSON.stringify({ list: vods, page: page, pagecount: pi.pagecount, limit: 36, total: pi.total });
}

async function detail(id) {
    const m = String(id).match(/(\d+)/);
    if (!m) return JSON.stringify({ list: [] });
    const vid = m[1];
    const html = await fetchText(host + '/igojs/' + vid + '.html');
    if (!html) return JSON.stringify({ list: [] });

    let name = '';
    const og = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/);
    if (og) {
        const nm = og[1].match(/《(.+?)》/);
        if (nm) name = nm[1];
    }
    if (!name) {
        const hm = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        if (hm) name = cleanText(hm[1]);
    }
    const ogp = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/);
    const pic = fixUrl(ogp ? ogp[1] : '');
    let desc = '';
    const dm = html.match(/<div class="vod_content">([\s\S]*?)<\/div>/);
    if (dm) desc = cleanText(dm[1]);
    if (!desc) {
        const md = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
        if (md) desc = cleanText(unescapeHtml(md[1]));
    }
    const ym = html.match(/\/igosw\/\d+-{11}(\d{4})\.html/);
    const tm = html.match(/<span class="video-tag-icon">([\s\S]*?)<\/(?:span|a)>/);
    const pl = parsePlayLists(html);
    return JSON.stringify({
        list: [{
            vod_id: vid,
            vod_name: name,
            vod_pic: pic,
            type_name: tm ? cleanCz(tm[1]) : '',
            vod_year: ym ? ym[1] : '',
            vod_area: infoByLabel(html, '制片国家'),
            vod_remarks: infoByLabel(html, '状态'),
            vod_actor: infoByLabel(html, '主演'),
            vod_director: infoByLabel(html, '导演'),
            vod_content: withPrefix(desc),
            vod_play_from: pl.from,
            vod_play_url: pl.url
        }]
    });
}

async function search(wd, quick, pg) {
    const page = parseInt(pg || 1) || 1;
    let url = host + '/igoso/-------------.html?wd=' + encodeURIComponent(String(wd || ''));
    if (String(page) !== '1') url += '&page=' + page;
    const html = await fetchText(url);
    const vods = parseVods(html);
    return JSON.stringify({ list: vods, page: page, pagecount: 1, limit: 20, total: vods.length });
}

async function play(flag, id, vipFlags) {
    try {
        const url = fixUrl(id);
        if (VIDEO_RE.test(url)) {
            return JSON.stringify({ parse: 0, playUrl: '', url: url, header: HEAD });
        }
        const text = await fetchText(url);
        const m = text.match(/var\s+player_aaaa\s*=\s*(\{[\s\S]*?\})\s*<\/script>/);
        if (m) {
            try {
                const data = JSON.parse(m[1]);
                const playUrl = safeUnquote(String(data.url || '')).replace(/\\\//g, '/');
                if (playUrl) return JSON.stringify({ parse: 0, playUrl: '', url: playUrl, header: HEAD });
            } catch (e) {}
        }
        const m2 = text.match(/["']url["']\s*:\s*["']([^"']+)["']/) || text.match(/(https?:\/\/[^"']+\.(?:m3u8|mp4)[^"']*)/);
        const play2 = m2 ? safeUnquote(m2[1]).replace(/\\\//g, '/') : url;
        return JSON.stringify({ parse: 0, playUrl: '', url: play2, header: HEAD });
    } catch (e) {
        return JSON.stringify({ parse: 1, playUrl: '', url: String(id || ''), header: HEAD });
    }
}

export default { init, home, homeVod, category, detail, search, play };
