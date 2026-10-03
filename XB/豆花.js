// 豆花影视 dhvideo.cc —— 由 豆花.py 移植为 qjs 单文件（export default + 全局 req）
// 纯 HTML 爬取：首页推荐 / 分类列表 / 详情 / 搜索 / 播放（aa.url 提取 + m3u8 递归解析）
const HOST = 'https://dhvideo.cc';
const CDN = 'https://pic2.tupian.click';
const SION_ID = '6a7021e3d742658065a970b4';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const DESC_PREFIX = '【琉🔹芸❤广告勿信👉剧情】📢';

const CAT_MAP = { '1': 'dianying', '2': 'dianshiju', '3': 'zongyi', '4': 'dongman', '5': 'duanju' };
const CAT_CLASSES = [
    { type_name: '电影', type_id: '1' },
    { type_name: '电视剧', type_id: '2' },
    { type_name: '综艺', type_id: '3' },
    { type_name: '动漫', type_id: '4' },
    { type_name: '短剧', type_id: '5' }
];

const AREA_VALS = [
    { n: '全部', v: '' }, { n: '中国大陆', v: '中国大陆' }, { n: '中国香港', v: '中国香港' },
    { n: '中国台湾', v: '中国台湾' }, { n: '美国', v: '美国' }, { n: '日本', v: '日本' },
    { n: '韩国', v: '韩国' }, { n: '英国', v: '英国' }, { n: '法国', v: '法国' },
    { n: '德国', v: '德国' }, { n: '意大利', v: '意大利' }, { n: '印度', v: '印度' },
    { n: '泰国', v: '泰国' }, { n: '加拿大', v: '加拿大' }, { n: '西班牙', v: '西班牙' },
    { n: '俄罗斯', v: '俄罗斯' }, { n: '澳大利亚', v: '澳大利亚' }, { n: '菲律宾', v: '菲律宾' },
    { n: '其他', v: '其他' }
];
const CLASS_VALS = [
    { n: '全部', v: '' }, { n: '剧情', v: '剧情' }, { n: '喜剧', v: '喜剧' }, { n: '动作', v: '动作' },
    { n: '爱情', v: '爱情' }, { n: '惊悚', v: '惊悚' }, { n: '犯罪', v: '犯罪' }, { n: '恐怖', v: '恐怖' },
    { n: '悬疑', v: '悬疑' }, { n: '冒险', v: '冒险' }, { n: '奇幻', v: '奇幻' }, { n: '科幻', v: '科幻' },
    { n: '院线', v: '院线' }, { n: '家庭', v: '家庭' }, { n: '历史', v: '历史' }, { n: '战争', v: '战争' },
    { n: '纪录片', v: '纪录片' }, { n: '古装', v: '古装' }, { n: '音乐', v: '音乐' }, { n: '动画', v: '动画' },
    { n: '传记', v: '传记' }, { n: '武侠', v: '武侠' }, { n: '运动', v: '运动' }, { n: '短片', v: '短片' }
];
const ORDER_VALS = [
    { n: '默认', v: '' }, { n: '最新', v: 'time' }, { n: '最热', v: 'play_hot' }
];

// ---------------- HTTP ----------------

async function get(url) {
    try {
        const r = await req(url, {
            headers: { 'User-Agent': UA, 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'Referer': HOST },
            timeout: 20000
        });
        return (r && r.content != null) ? String(r.content) : '';
    } catch (e) {
        return '';
    }
}

// ---------------- URL 工具 ----------------

function fixUrl(url) {
    url = String(url || '');
    if (!url) return '';
    if (url.indexOf('//') === 0) return 'https:' + url;
    if (url.indexOf('/') === 0) return HOST + url;
    return url;
}

function fixPic(url) {
    url = String(url || '');
    if (!url) return '';
    if (url.indexOf('//') === 0) return 'https:' + url;
    if (url.indexOf('/') === 0) return CDN + url;
    return url;
}

function buildQuery(params) {
    const parts = [];
    for (const k in params) {
        const v = params[k];
        if (v != null && v !== '') {
            parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
        }
    }
    return parts.join('&');
}

function buildCatUrl(catEn, params) {
    const base = HOST + '/' + catEn + '.html';
    const qs = Object.assign({ sion_id: SION_ID }, params || {});
    return base + '?' + buildQuery(qs);
}

function isVideoUrl(url) {
    url = String(url || '').toLowerCase();
    return /\.(m3u8|mp4|flv|ts|mkv|avi|mov|mpd|m4a|wmv)(\?.*)?$/.test(url);
}

// ---------------- HTML 解析（正则） ----------------

function withPrefix(s) {
    s = String(s == null ? '' : s).trim();
    if (!s) return '';
    if (s.indexOf(DESC_PREFIX) === 0) return s;
    return DESC_PREFIX + s;
}

function stripTags(s) {
    return String(s == null ? '' : s).replace(/<[^>]+>/g, '').trim();
}

function firstMatch(html, re, idx) {
    const m = String(html || '').match(re);
    return m ? (idx != null ? m[idx] : m[0]) : '';
}

function allMatches(html, re, idx) {
    const out = [];
    const s = String(html || '');
    let m;
    while ((m = re.exec(s)) !== null) {
        out.push(idx != null ? m[idx] : m[0]);
    }
    return out;
}

/**
 * 解析单个视频卡片 HTML（lxml 的 _parse_video_card 替代）
 * 输入：卡片的一段 HTML 字符串（不含外层 <a> 包裹）
 */
function parseVideoCard(cardHtml) {
    // vod_id：从 href 提取
    let href = firstMatch(cardHtml, /href\s*=\s*["']([^"']+)["']/i, 1);
    if (!href) return null;
    let vodId = '';
    const idM = href.match(/\/(?:movie|tv)\/([^/]+?)\.html/);
    if (idM) vodId = idM[1];
    if (!vodId) return null;

    // 图片：img data-src 优先，其次 src
    let vodPic = firstMatch(cardHtml, /data-src\s*=\s*["']([^"']+)["']/i, 1);
    if (!vodPic) vodPic = firstMatch(cardHtml, /src\s*=\s*["']([^"']+)["']/i, 1);
    vodPic = fixPic(vodPic);

    // 标题：h3 > a > 文本 优先
    let vodName = firstMatch(cardHtml, /<h3[^>]*>\s*<a[^>]*>([\s\S]*?)<\/a>/i, 1);
    if (!vodName) vodName = firstMatch(cardHtml, /<h3[^>]*>([\s\S]*?)<\/h3>/i, 1);
    vodName = stripTags(vodName);
    if (!vodName) vodName = firstMatch(cardHtml, /alt\s*=\s*["']([^"']+)["']/i, 1);
    vodName = vodName.trim();
    if (!vodName) return null;

    // 备注（badge）
    let vodRemarks = firstMatch(cardHtml, /class\s*=\s*["'][^"']*bg-black[^"']*60[^"']*["'][^>]*>([^<]+)/i, 1);
    vodRemarks = stripTags(vodRemarks);

    // 类型（truncate 里的文本）
    let vodType = firstMatch(cardHtml, /class\s*=\s*["'][^"']*truncate[^"']*["'][^>]*>([^<]+)/i, 1);
    vodType = stripTags(vodType);

    // 年份（4位数字）
    let year = '';
    const yearMs = allMatches(cardHtml, /\b(19|20)\d{2}\b/g);
    for (const y of yearMs) {
        year = y;
        break;
    }

    return {
        vod_id: vodId,
        vod_name: vodName,
        vod_pic: vodPic,
        vod_remarks: vodRemarks,
        type_name: vodType,
        vod_year: year
    };
}

/**
 * 解析视频列表页（lxml 的 _parse_video_list 替代）
 * 核心思路：找每个 grid 单元的包裹 div，截取对应片段
 */
function parseVideoList(html) {
    const videos = [];
    const aRe = /<a\b[^>]*class\s*=\s*["'][^"']*\baspect-[^"']*["'][^>]*>/gi;
    const seenIds = {};
    let m;
    while ((m = aRe.exec(html)) !== null) {
        // 向前找最近的开 <div
        const before = html.substring(Math.max(0, m.index - 3000), m.index);
        const lastDivOpen = before.lastIndexOf('<div');
        if (lastDivOpen < 0) continue;
        const absStart = Math.max(0, m.index - 3000) + lastDivOpen;
        // 找这个 div 的闭合（深度匹配）
        let depth = 0, pos = absStart;
        let cardEnd = -1;
        for (; pos < html.length && pos < absStart + 15000; pos++) {
            if (html.substr(pos, 4) === '<div') depth++;
            else if (html.substr(pos, 6) === '</div>') {
                depth--;
                if (depth === 0) { cardEnd = pos + 6; break; }
            }
        }
        if (cardEnd < 0) continue;
        const cardHtml = html.substring(absStart, cardEnd);
        const v = parseVideoCard(cardHtml);
        if (v && v.vod_name && !seenIds[v.vod_id]) {
            seenIds[v.vod_id] = 1;
            videos.push(v);
        }
    }
    return videos;
}

/**
 * 解析分页总数
 */
function parsePagecount(html) {
    let total = 1;
    const pageRe = /page=(\d+)/g;
    let m;
    while ((m = pageRe.exec(html)) !== null) {
        const n = parseInt(m[1], 10) + 1; // 0-based → 1-based
        if (n > total) total = n;
    }
    return total;
}

// ==================== aa.url 提取（两层转义）================

function extractAaUrl(html) {
    const pats = [
        /aa\s*:\s*JSON\.parse\s*\(\s*'(\{[^']*\})'\s*\)/g,
        /aa\s*:\s*JSON\.parse\s*\(\s*"(\{[^"]*\})"\s*\)/g
    ];
    for (const pat of pats) {
        const text = String(html || '');
        let m;
        while ((m = pat.exec(text)) !== null) {
            let s = m[1];
            try {
                // 1. 解 JS 双重转义：\\uXXXX → 对应字符（如 \\u0026 → &）
                s = s.replace(/\\\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
                // 2. 解 JSON 单层转义：\u0022 → "，\/ → /
                s = s.replace(/\\u0022/g, '"').replace(/\\\//g, '/');
                const obj = JSON.parse(s);
                const url = String((obj && obj.url) || '').trim();
                if (url) return url;
            } catch (e) { /* continue */ }
        }
    }
    return '';
}

// ==================== 接口 ====================

async function init(cfg) {}

async function home(filter) {
    const result = { class: CAT_CLASSES, filters: {} };
    for (const c of CAT_CLASSES) {
        result.filters[c.type_id] = [
            { key: 'area', name: '地区', value: AREA_VALS },
            { key: 'class', name: '分类', value: CLASS_VALS },
            { key: 'year', name: '年份', value: buildYearVals() },
            { key: 'order', name: '排序', value: ORDER_VALS }
        ];
    }
    return JSON.stringify(result);
}

function buildYearVals() {
    const out = [{ n: '全部', v: '' }];
    for (let y = 2026; y >= 2002; y--) out.push({ n: String(y), v: String(y) });
    return out;
}

async function homeVod() {
    try {
        const url = HOST + '/?' + buildQuery({ sion_id: SION_ID });
        const html = await get(url);
        const videos = parseVideoList(html);
        return JSON.stringify({ list: videos });
    } catch (e) {
        return JSON.stringify({ list: [] });
    }
}

async function category(tid, pg, filter, extend) {
    try {
        let ext = extend || {};
        if (typeof ext === 'string' && ext) {
            try { ext = JSON.parse(ext); } catch (e) { ext = {}; }
        }
        const catEn = CAT_MAP[String(tid)] || 'dianying';
        const page = Math.max(parseInt(pg || 1, 10) - 1, 0);
        const params = {};
        if (page > 0) params.page = String(page);
        if (ext.area) params.area = ext.area;
        if (ext['class']) params['class'] = ext['class'];
        if (ext.year) params.year = ext.year;
        if (ext.order) params.sort_field = ext.order;

        const url = buildCatUrl(catEn, params);
        const html = await get(url);
        const videos = parseVideoList(html);
        const totalPages = parsePagecount(html);

        return JSON.stringify({
            list: videos,
            page: parseInt(pg || 1, 10),
            pagecount: totalPages,
            limit: videos.length,
            total: totalPages * videos.length
        });
    } catch (e) {
        return JSON.stringify({ list: [], page: 1, pagecount: 0, limit: 0, total: 0 });
    }
}

async function search(wd, quick, pg) {
    try {
        const page = Math.max(parseInt(pg || 1, 10) - 1, 0);
        const params = {
            name: String(wd || ''),
            page: String(page),
            sort_field: '_id',
            sion_id: SION_ID
        };
        const url = HOST + '/s.html?' + buildQuery(params);
        const html = await get(url);
        const videos = parseVideoList(html);
        const totalPages = parsePagecount(html);

        return JSON.stringify({
            list: videos,
            page: parseInt(pg || 1, 10),
            pagecount: totalPages,
            limit: videos.length,
            total: videos.length
        });
    } catch (e) {
        return JSON.stringify({ list: [], page: 1, pagecount: 0, limit: 0, total: 0 });
    }
}

// ---------------- detail 解析 ----------------

async function detail(id) {
    const vodId = String(id || '').trim();
    if (!vodId) return JSON.stringify({ list: [] });

    // 先探测 movie 和 tv 哪个有效（找 h1 标题判断）
    let detailUrl = '';
    let html = '';
    for (const prefix of ['movie', 'tv']) {
        const url = HOST + '/' + prefix + '/' + vodId + '.html?sion_id=' + SION_ID;
        const testHtml = await get(url);
        if (testHtml && testHtml.length > 2000 && /<h1[^>]*>([\s\S]*?)<\/h1>/i.test(testHtml)) {
            detailUrl = url;
            html = testHtml;
            break;
        }
    }
    if (!detailUrl) {
        detailUrl = HOST + '/movie/' + vodId + '.html?sion_id=' + SION_ID;
        html = await get(detailUrl);
    }
    if (!html) return JSON.stringify({ list: [] });

    const vod = {
        vod_id: vodId,
        vod_name: '',
        vod_pic: '',
        vod_type: '',
        vod_area: '',
        vod_year: '',
        vod_class: '',
        vod_actor: '',
        vod_director: '',
        vod_content: '',
        vod_play_from: '',
        vod_play_url: ''
    };

    // ---- 标题 ----
    vod.vod_name = stripTags(firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i, 1));
    if (!vod.vod_name) {
        const t = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i, 1);
        vod.vod_name = stripTags(t).split('_')[0].trim();
    }

    // ---- 年份 ----
    let y = firstMatch(html, /<h1[^>]*>[\s\S]*?<\/h1>\s*<span[^>]*>\s*(19|20\d{2})\s*<\/span>/i, 1);
    if (!y) {
        const allY = allMatches(html, /\b(19|20\d{2})\b/g);
        y = allY.length ? allY[0] : '';
    }
    vod.vod_year = y;

    // ---- 封面 ----
    vod.vod_pic = firstMatch(html, /class\s*=\s*["'][^"']*vk-card[^"']*["'][^>]*>[\s\S]*?<img[^>]+(?:src|data-src)\s*=\s*["']([^"']+)["']/i, 1);
    vod.vod_pic = fixPic(vod.vod_pic);

    // ---- 类型 ----
    vod.vod_type = firstMatch(html, /href\s*=\s*["'][^"']*type[^"']*["'][^>]*>([^<]+)<\/a>/i, 1);
    vod.vod_type = stripTags(vod.vod_type).trim();

    // ---- 地区 ----
    const areaLinks = allMatches(html, /href\s*=\s*["'][^"']*\barea=[^"']*["'][^>]*>([^<]+)<\/a>/gi, 1);
    vod.vod_area = stripTags(areaLinks[0] || '').trim();

    // ---- 分类标签 ----
    const classLinks = allMatches(html, /href\s*=\s*["'][^"']*\bclass=[^"']*["'][^>]*>([^<]+)<\/a>/gi, 1);
    vod.vod_class = classLinks.map(s => stripTags(s).trim()).filter(Boolean).join(', ');

    // ---- 导演（多个 join）----
    const directorLinks = allMatches(html, /href\s*=\s*["'][^"']*\bdirector=[^"']*["'][^>]*>([^<]+)<\/a>/gi, 1);
    vod.vod_director = directorLinks.map(s => stripTags(s).trim()).filter(Boolean).join(', ');

    // ---- 主演（多个 join）----
    const actorLinks = allMatches(html, /href\s*=\s*["'][^"']*\bactor=[^"']*["'][^>]*>([^<]+)<\/a>/gi, 1);
    vod.vod_actor = actorLinks.map(s => stripTags(s).trim()).filter(Boolean).join(', ');

    // ---- 简介 ----
    let vodContent = '';
    const resetBlock = firstMatch(html, /class\s*=\s*["'][^"']*reset-style[^"']*["']>([\s\S]*?)<\/div>/i, 1);
    if (resetBlock) {
        const ps = allMatches(resetBlock, /<p[^>]*>([\s\S]*?)<\/p>/gi, 1);
        if (ps.length) {
            vodContent = ps.map(s => stripTags(s)).filter(Boolean).join('\n');
        }
        if (!vodContent) {
            vodContent = stripTags(resetBlock);
        }
    }
    vod.vod_content = withPrefix(vodContent);

    // ---- 播放列表 ----
    const playFrom = [];
    const playUrl = [];

    // 找每个 episode-list 容器
    const epListRe = /class\s*=\s*["'][^"']*episode-list[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
    // 更宽松：找 episode-list div 的闭合（可能层级不定）
    const epContainerRe = /<div\s[^>]*class\s*=\s*["'][^"']*episode-list[^"']*["'][^>]*>/gi;
    let epContainerIdx = 0;
    let containerMatch;
    while ((containerMatch = epContainerRe.exec(html)) !== null) {
        const containerStart = containerMatch.index;
        // 找闭合
        let depth = 1, pos = containerMatch.index + containerMatch[0].length;
        let containerEnd = -1;
        while (pos < html.length && pos < containerStart + 30000) {
            if (html.substr(pos, 4) === '<div') depth++;
            else if (html.substr(pos, 6) === '</div>') {
                depth--;
                if (depth === 0) { containerEnd = pos + 6; break; }
            }
            pos++;
        }
        if (containerEnd < 0) continue;
        const containerHtml = html.substring(containerStart, containerEnd);

        // 找所有 episode-button a
        const btnRe = /<a\b[^>]*class\s*=\s*["'][^"']*episode-button[^"']*["'][^>]*>/gi;
        const epMatches = [];
        let bm;
        while ((bm = btnRe.exec(containerHtml)) !== null) {
            // 完整的 <a ...>...</a>
            const aStart = bm.index;
            let adepth = 1, apos = bm.index + bm[0].length;
            let aEnd = -1;
            while (apos < containerHtml.length && apos < aStart + 5000) {
                if (containerHtml.substr(apos, 4) === '<a ') adepth++;
                else if (containerHtml.substr(apos, 4) === '<a>') adepth++;
                else if (containerHtml.substr(apos, 4) === '</a>') {
                    adepth--;
                    if (adepth === 0) { aEnd = apos + 4; break; }
                }
                apos++;
            }
            if (aEnd < 0) continue;
            epMatches.push(containerHtml.substring(aStart, aEnd));
        }

        if (epMatches.length === 0) { epContainerIdx++; continue; }

        // 线路名：取首个 a 的 data-origin，去掉末尾 m3u8
        let sourceName = firstMatch(epMatches[0], /data-origin\s*=\s*["']([^"']+)["']/i, 1);
        if (sourceName) sourceName = sourceName.replace(/m3u8$/, '');
        if (!sourceName) sourceName = '线路' + (epContainerIdx + 1);

        const playList = [];
        for (const aHtml of epMatches) {
            let epName = firstMatch(aHtml, /data-title\s*=\s*["']([^"']+)["']/i, 1);
            if (!epName) epName = stripTags(firstMatch(aHtml, /<button[^>]*>([\s\S]*?)<\/button>/i, 1));
            if (!epName) epName = firstMatch(aHtml, /title\s*=\s*["']([^"']+)["']/i, 1);
            if (!epName) epName = firstMatch(aHtml, /alt\s*=\s*["']([^"']+)["']/i, 1);
            epName = stripTags(epName).trim();

            let href = firstMatch(aHtml, /href\s*=\s*["']([^"']+)["']/i, 1);
            href = fixUrl(href);
            if (epName && href) playList.push(epName + '$' + href);
        }

        if (playList.length) {
            playFrom.push(sourceName);
            playUrl.push(playList.join('#'));
        }
        epContainerIdx++;
    }

    if (playFrom.length) {
        vod.vod_play_from = playFrom.join('$$$');
        vod.vod_play_url = playUrl.join('$$$');
    } else {
        vod.vod_play_from = '默认';
        vod.vod_play_url = '';
    }

    return JSON.stringify({ list: [vod] });
}

// ---------------- m3u8 递归解析 ----------------

async function resolvePlayUrl(url) {
    const visited = {};
    let current = fixUrl(url);
    for (let i = 0; i < 10; i++) {
        if (!current || visited[current]) break;
        visited[current] = 1;
        let text = '';
        let finalUrl = current;
        try {
            const r = await req(current, {
                headers: { 'User-Agent': UA, 'Referer': HOST },
                timeout: 20000,
                followRedirects: true
            });
            text = (r && r.content != null) ? String(r.content) : '';
            // 宿主不暴露最终重定向 URL，用响应里的 m3u8 文本判断
        } catch (e) {
            return current;
        }
        // 主播放列表
        if (text.indexOf('#EXT-X-STREAM-INF') >= 0) {
            const subUrls = [];
            for (const line of text.split(/\r?\n/)) {
                const l = line.trim();
                if (l && l.charAt(0) !== '#') {
                    try { subUrls.push(new URL(l, current).href); } catch (e) { subUrls.push(l); }
                }
            }
            if (!subUrls.length) return current;
            // 找媒体播放列表
            for (const su of subUrls) {
                if (visited[su]) continue;
                try {
                    const sr = await req(su, {
                        headers: { 'User-Agent': UA, 'Referer': HOST },
                        timeout: 15000,
                        followRedirects: true
                    });
                    const st = (sr && sr.content != null) ? String(sr.content) : '';
                    if (st.indexOf('#EXTINF') >= 0 && (su.indexOf('.m3u8') >= 0 || current.indexOf('.m3u8') >= 0)) {
                        return su;
                    }
                } catch (e) {}
            }
            current = subUrls[0];
            continue;
        }
        // 媒体播放列表或直链
        if (text.indexOf('#EXTINF') >= 0 || isVideoUrl(current)) return current;
        return current;
    }
    return current;
}

async function play(flag, id, vipFlags) {
    try {
        let playUrl = String(id || '').trim();
        if (playUrl.indexOf('http') !== 0) playUrl = fixUrl(playUrl);

        // 已经是直链
        if (isVideoUrl(playUrl)) {
            return JSON.stringify({ parse: 0, url: playUrl, header: JSON.stringify({ 'User-Agent': UA, 'Referer': HOST }) });
        }

        const html = await get(playUrl);

        // 主路径：aa.url
        let realUrl = extractAaUrl(html);
        if (realUrl) {
            if (realUrl.indexOf('//') === 0 || realUrl.charAt(0) === '/') {
                try { realUrl = new URL(realUrl, playUrl).href; } catch (e) { realUrl = fixUrl(realUrl); }
            }
            // 递归解析 m3u8
            realUrl = await resolvePlayUrl(realUrl);
            if (realUrl) {
                return JSON.stringify({
                    parse: 0, playUrl: '', url: realUrl,
                    header: JSON.stringify({ 'User-Agent': UA, 'Referer': HOST })
                });
            }
        }

        // 兜底1：直接找 m3u8
        const m3u8M = String(html).match(/["'](https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*)["']/);
        if (m3u8M) {
            return JSON.stringify({
                parse: 0, playUrl: '', url: m3u8M[1],
                header: JSON.stringify({ 'User-Agent': UA, 'Referer': HOST })
            });
        }

        // 兜底2：直接找 mp4/flv/ts/mkv
        const mp4M = String(html).match(/["'](https?:\/\/[^"'\s<>]+\.(?:mp4|flv|ts|mkv)[^"'\s<>]*)["']/);
        if (mp4M) {
            return JSON.stringify({
                parse: 0, playUrl: '', url: mp4M[1],
                header: JSON.stringify({ 'User-Agent': UA, 'Referer': HOST })
            });
        }

        // 最终兜底：parse:1
        return JSON.stringify({
            parse: 1, playUrl: '', url: playUrl,
            header: JSON.stringify({ 'User-Agent': UA, 'Referer': HOST })
        });
    } catch (e) {
        return JSON.stringify({ parse: 0, playUrl: '', url: '' });
    }
}

export default { init, home, homeVod, category, detail, search, play };
