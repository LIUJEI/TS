let siteName = '酷我歌手',
    siteKey = '',
    siteType = 0;
let host = 'http://wapi.kuwo.cn';

function init(cfg) {
    siteName = cfg.skey?.split('_')[1] || cfg.skey || '酷我歌手';
    siteKey = cfg.skey;
    siteType = cfg.stype;
}

function safeJSONParse(str, defaultValue = {}) {
    if (!str || typeof str === 'object') return str || defaultValue;
    try {
        return JSON.parse(str);
    } catch {
        return defaultValue;
    }
}

async function request(url, options = {}) {
    const reqHeaders = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'http://www.kuwo.cn/',
        ...options.headers
    };
    let postType = reqHeaders['Content-Type']?.includes('json') ? 'json' :
        reqHeaders['Content-Type']?.includes('form') ? 'form' : '';

    try {
        const response = await req(url, {
            method: options.method || 'GET',
            headers: reqHeaders,
            data: options.data,
            postType: postType,
            timeout: options.timeout || 15000
        });
        return response?.content || response?.data || response;
    } catch {
        return null;
    }
}

function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function hd(img) {
    if (!img) return '';
    return img.replace('/120/', '/4000/').replace('/500/', '/2160/').replace('/150/', '/1000/').replace('/300/', '/1500/');
}

const DESC_PREFIX = '【琉🔹芸❤广告勿信👉剧情】📢';

async function getLyric(rid) {
    const maxRetries = 20;
    for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
        try {
            let url = `https://kuwo.cn/openapi/v1/www/lyric/getlyric?musicId=${rid}`;
            let html = await request(url);
            if (html) {
                let json = safeJSONParse(html);
                if (json.code === 200 && json.data && json.data.lrclist && json.data.lrclist.length > 0) {
                    let lrclist = json.data.lrclist;
                    let lyric = lrclist.map(item => {
                        let time = parseFloat(item.time) || 0;
                        let min = Math.floor(time / 60).toString().padStart(2, '0');
                        let sec = Math.floor(time % 60).toString().padStart(2, '0');
                        let ms = Math.floor((time % 1) * 100).toString().padStart(2, '0');
                        return `[${min}:${sec}.${ms}]${item.lineLyric || ''}`;
                    }).join('\n');
                    return lyric;
                }
            }
        } catch (e) {}
        if (retryCount < maxRetries - 1) await sleep(0.01);
    }
    return '暂无歌词';
}

async function getUrl(rid, br) {
    let url = `https://nmobi.kuwo.cn/mobi.s?f=web&user=0&source=kwplayer_ar_4.4.2.7_B_nuoweida_vh.apk&type=convert_url_with_sign&rid=${rid}&format=flac&br=${br}`;
    let html = await request(url);
    if (html) {
        let j = safeJSONParse(html);
        return j?.data?.url?.trim() || '';
    }
    return '';
}

function home(filter) {
    return JSON.stringify({
        class: [
            { type_id: '1', type_name: '华语男' },
            { type_id: '2', type_name: '华语女' },
            { type_id: '3', type_name: '华语组合' },
            { type_id: '4', type_name: '日韩男' },
            { type_id: '5', type_name: '日韩女' },
            { type_id: '6', type_name: '日韩组合' },
            { type_id: '7', type_name: '欧美男' },
            { type_id: '8', type_name: '欧美女' },
            { type_id: '9', type_name: '欧美组合' },
            { type_id: '0', type_name: '其他' }
        ],
        filters: {}
    });
}

async function homeVod() {
    return category('1', 1, false, {});
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0 || typeof pg == 'undefined') pg = 1;
    let url = `${host}/api/www/artist/artistInfo?category=${tid}&prefix=&pn=${pg}&rn=30`;
    let html = await request(url);
    let res = safeJSONParse(html);
    let list = res.data?.artistList || [];
    let videos = list.map(it => ({
        vod_id: (it.id || '').toString(),
        vod_name: it.name || '未知歌手',
        vod_pic: hd(it.pic300 || it.pic || it.pic120 || ''),
        vod_remarks: ''
    }));
    return JSON.stringify({
        page: parseInt(pg),
        pagecount: 9999,
        limit: 30,
        total: 999999,
        list: videos
    });
}

async function detail(id) {
    let input = id.toString();

    // 单曲直通(搜索单曲格式: 歌名 - 歌手$rid$pic)
    if (input.indexOf('$') > -1) {
        let s = input.split('$');
        return JSON.stringify({
            list: [{
                vod_id: s[1],
                vod_name: s[0],
                vod_pic: hd(s[2]),
                vod_play_from: '酷我音乐',
                vod_play_url: s[0] + '$' + s[1] + '&&' + hd(s[2]) + '&&' + hd(s[2]),
                vod_play_pic: hd(s[2]),
                vod_play_pic_ratio: 1.0
            }]
        });
    }

    // 歌手信息
    let infoUrl = `${host}/api/www/artist/artist?artistid=${input}`;
    let infoHtml = await request(infoUrl);
    let infoData = safeJSONParse(infoHtml).data || {};
    let artistName = infoData.name || '未知歌手';
    let artistInfo = (infoData.info || '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        .replace(/^\s+|\s+$/g, '');
    if (artistInfo && artistInfo.indexOf(DESC_PREFIX) !== 0) artistInfo = DESC_PREFIX + artistInfo;
    if (!artistInfo) artistInfo = DESC_PREFIX + '暂无歌手简介';

    // 歌手歌曲: 分页收集, 最多10页300首
    const limit = 30;
    const maxPages = 10;
    const maxSongs = 300;
    let baseUrl = `${host}/api/www/artist/artistMusic?artistid=${input}&rn=${limit}&pn=`;
    let html = await request(baseUrl + '1');
    let json = safeJSONParse(html);
    let songs = json.code === 200 ? (json.data?.list || []) : [];
    let tasks = [];
    for (let p = 2; p <= maxPages; p++) {
        if (songs.length >= maxSongs || (json.code === 200 && (json.data?.list || []).length === 0)) break;
        tasks.push(request(baseUrl + p));
    }
    let results = await Promise.all(tasks);
    results.forEach(r => {
        let j = safeJSONParse(r);
        if (j.code === 200) songs = songs.concat(j.data?.list || []);
    });
    if (songs.length > maxSongs) songs = songs.slice(0, maxSongs);

    let playArr = [];
    let songPicArr = [];
    songs.forEach(it => {
        let rid = (it.rid || '').toString();
        let song = (it.name || '').replace(/[$#]/g, '').replace(/^\s+|\s+$/g, '');
        let album = (it.album || '').replace(/[$#]/g, '');
        let albumpic = hd(it.albumpic || it.pic || infoData.pic300 || infoData.pic || '');
        let displayName = album ? `${song} - ${album}` : song;
        if (rid && song) {
            playArr.push(`${displayName}$${rid}&&${albumpic}&&${albumpic}`);
            songPicArr.push(albumpic);
        }
    });

    const vod = {
        vod_id: input,
        vod_name: artistName,
        vod_pic: hd(infoData.pic300 || infoData.pic || ''),
        vod_content: artistInfo,
        vod_remarks: `歌曲 :   ${playArr.length}首`,
        vod_actor: artistName,
        vod_play_from: '酷我音乐',
        vod_play_url: playArr.join('#'),
        vod_play_pic: songPicArr.join('#'),
        vod_play_pic_ratio: 1.0
    };

    return JSON.stringify({
        list: [vod]
    });
}

async function play(flag, id, flags) {
    let parts = id.split('&&');
    let firstPart = parts[0] || '';
    let firstParts = firstPart.split('$');
    let songId = firstParts.length > 1 ? firstParts[1] : firstParts[0];
    let albumPic = hd(parts[1]);

    if (/\.(m3u8|mp4|m4a|mp3|aac|flac|ogg|mgg)(\?|$)/i.test(songId)) {
        let cleanUrl = songId.split('?')[0];
        return JSON.stringify({
            parse: 0,
            url: cleanUrl,
            pic: albumPic,
            cover: albumPic,
            lrc: '',
            height: 720
        });
    }

    const qualities = [{
        name: 'FLAC无损',
        br: '2000k'
    }, {
        name: 'HQ高品质',
        br: '320k'
    }, {
        name: '标准品质',
        br: '192k'
    }, {
        name: 'AAC高品',
        br: '128k'
    }];
    let urls = [];
    let seenUrls = new Set();

    for (let q of qualities) {
        let url = await getUrl(songId, q.br);
        if (url && !url.includes('.mgg')) {
            let cleanUrl = url.split('?')[0];
            if (!seenUrls.has(cleanUrl)) {
                seenUrls.add(cleanUrl);
                urls.push(q.name, cleanUrl);
            }
        }
    }

    let lrcPromise = getLyric(songId);
    let picUrl = albumPic;
    if (!picUrl) {
        try {
            let picRes = await request(`http://artistpicserver.kuwo.cn/pic.web?type=rid_pic&pictype=url&size=500&rid=${songId}`);
            picUrl = picRes.trim().replace('/500/', '/2160/');
        } catch (e) {}
    }

    let result = {
        parse: 0,
        url: urls,
        header: {
            'User-Agent': 'Mozilla/5.0'
        },
        pic: picUrl,
        cover: picUrl,
        height: 720
    };
    let lrc = await lrcPromise;
    if (lrc && lrc !== '暂无歌词') result.lrc = lrc;
    return JSON.stringify(result);
}

async function search(wd, quick, pg) {
    if (pg <= 0 || typeof pg == 'undefined') pg = 1;
    // 搜歌手, 结果直接进入歌手详情页
    let searchUrl = `https://search.kuwo.cn/r.s?client=kt&pn=${(pg - 1) * 30}&rn=30&all=${encodeURIComponent(wd)}&vipver=1&ft=artist&encoding=utf8&rformat=json&mobi=1`;
    let html = '';
    let tries = 0;
    while (!html && tries < 5) {
        html = await request(searchUrl);
        if (!html) { tries++; await sleep(0.1); }
    }
    // ft=artist 返回标准JSON, 不得做单引号替换(会破坏含撇号的歌手名导致解析失败)
    let json = safeJSONParse(html || '');
    if (!json.abslist) json = safeJSONParse((html || '').replace(/'/g, '"'));
    let videos = [];
    if (json.abslist) {
        let basePath = json.BASEPICPATH || 'http://img1.kuwo.cn/star/starheads/';
        json.abslist.forEach(it => {
            let aid = (it.ARTISTID || it.DC_TARGETID || '').toString();
            if (!aid) return;
            let pic = it.hts_PICPATH || (it.PICPATH ? basePath + it.PICPATH : '');
            videos.push({
                vod_id: aid,
                vod_name: it.ARTIST || '未知歌手',
                vod_pic: hd(pic),
                vod_remarks: `歌曲 :  ${it.SONGNUM || 0}首`
            });
        });
    }
    return JSON.stringify({
        page: parseInt(pg),
        pagecount: 9999,
        limit: 30,
        total: 999999,
        list: videos
    });
}

async function action(action, value) {
    if (action == '最新评论') {
        return JSON.stringify({
            action: {
                type: 'comment',
                actionId: '最新评论',
                title: '最新评论',
                subtitle: '暂不支持评论功能',
                remarks: '评论功能开发中',
                list: [{
                    id: '功能提示',
                    title: '暂不支持评论',
                    subtitle: '',
                    logo: '',
                    content: '酷我音乐评论功能正在开发中...',
                    remarks: '',
                    remarks2: ''
                }]
            }
        });
    }
    return '';
}

export function __jsEvalReturn() {
    return {
        init,
        home,
        homeVod,
        category,
        detail,
        play,
        search,
        action
    };
}
