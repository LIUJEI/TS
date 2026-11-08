// 小酷短剧 (酷我 wapi.kuwo.cn 短剧接口) - QuickJS 同步版
// 列表: openapi/v1/shortplay/moduleMore; 详情: videoList; 播放: nmobi 取 mp4 直链

const XURL = 'http://wapi.kuwo.cn';
const INTRO_PREFIX = '【琉🔹芸❤广告勿信👉剧情】📢';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Mobile Safari/537.36',
    'Referer': 'http://www.kuwo.cn/',
    'Origin': 'http://www.kuwo.cn'
};

const CLASSES = [
    ['11', '土味爱情'], ['12', '更多精彩'], ['13', '霸道总裁的人生'], ['14', '赘婿当道'],
    ['15', '漫漫追妻路'], ['16', '家庭情感'], ['17', '逆袭重生'], ['19', '动画'],
    ['20', '日常'], ['24', '其他']
];

function getJson(url) {
    try {
        const r = req(url, { headers: HEADERS, timeout: 15000 });
        return JSON.parse(r.content || '');
    } catch (e) { return null; }
}

function mapVod(vod) {
    return {
        vod_id: String(vod.url || '') + '||' + encodeURIComponent(vod.subTitle || ''),
        vod_name: vod.title || '',
        vod_pic: vod.img || '',
        vod_remarks: vod.currrentDesc || ''
    };
}

function init(ext) {}

function home(filter) {
    return JSON.stringify({
        'class': CLASSES.map(c => ({ type_id: c[0], type_name: c[1] })),
        filters: {}
    });
}

function homeVod() {
    const d = getJson(XURL + '/openapi/v1/shortplay/moduleMore?currentPage=1&moduleId=10&rn=12');
    const list = ((d && d.data && d.data.list) || []).map(mapVod);
    return JSON.stringify({ list: list });
}

function category(tid, pg, filter, extend) {
    const page = parseInt(pg, 10) || 1;
    const d = getJson(XURL + '/openapi/v1/shortplay/moduleMore?currentPage=' + page + '&moduleId=' + tid + '&rn=12');
    const list = ((d && d.data && d.data.list) || []).map(mapVod);
    return JSON.stringify({ list: list, page: page, pagecount: 9999, limit: 12, total: 999999 });
}

function detail(ids) {
    const did = String(Array.isArray(ids) ? ids[0] : ids);
    const parts = did.split('||');
    const albumId = parts[0];
    let subTitle = '';
    if (parts.length > 1) { try { subTitle = decodeURIComponent(parts[1]); } catch (e) { subTitle = parts[1]; } }

    const d = getJson(XURL + '/openapi/v1/shortplay/videoList?albumId=' + albumId);
    if (!d || !d.data) return JSON.stringify({ list: [] });
    const data = d.data;

    const raw = data.list || [];
    if (!raw.length) return JSON.stringify({ list: [] });
    const sorted = raw.slice().sort((a, b) => (a.location || 0) - (b.location || 0));

    const eps = [];
    for (let i = 0; i < sorted.length; i++) {
        const vid = ((sorted[i].mvpayinfo || {}).vid) || '';
        if (vid) eps.push('第' + (i + 1) + '集$http://nmobi.kuwo.cn/mobi.s?f=web&type=get_url_by_vid&vid=' + vid);
    }
    if (!eps.length) return JSON.stringify({ list: [] });

    const info = data.shortinfo || {};
    let content = subTitle || String(info.title || '');
    if (content.indexOf(INTRO_PREFIX) !== 0) content = INTRO_PREFIX + content;

    return JSON.stringify({
        list: [{
            vod_id: String(info.id || albumId),
            vod_remarks: '共' + (info.total || 0) + '集',
            vod_content: content,
            vod_play_from: '小酷短剧',
            vod_play_url: eps.join('#')
        }]
    });
}

function search(key, quick, pg) {
    // 上游无搜索接口
    return JSON.stringify({ list: [], page: 1, pagecount: 1, limit: 12, total: 0 });
}

function play(flag, id, vipFlags) {
    let purl = String(id || '');
    if (purl.indexOf('nmobi.kuwo.cn/mobi.s') >= 0 && purl.indexOf('get_url_by_vid') >= 0) {
        try {
            const r = req(purl, { headers: HEADERS, timeout: 15000 });
            const text = r.content || '';
            const m = /url=(\S+?\.mp4)/.exec(text);
            if (m) {
                purl = m[1].trim();
            } else {
                const lines = text.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].indexOf('url=') === 0) {
                        purl = lines[i].substring(4).trim().split('format=')[0];
                        break;
                    }
                }
            }
        } catch (e) {}
    }
    return JSON.stringify({ parse: 0, playUrl: '', url: purl, header: HEADERS });
}

export default { init, home, homeVod, category, detail, search, play };
