import { Crypto as CryptoJS } from 'assets://js/lib/cat.js';
let siteName = '牛牛短剧', niuniu_headers = {}, niuniu_token = '', niuniu_access_token = '';
const aggConfig = {
  keys: 'd3dGiJc651gSQ8w1',
  headers: {
    default: { 'User-Agent': 'okhttp/5.1.0', 'Content-Type': 'application/json' },
    niuniu: { 'Cache-Control':'no-cache','Content-Type':'application/json;charset=UTF-8','User-Agent':'okhttp/4.12.0' }
  }
};
const rule = {
  牛牛: {
    host: 'https://new.tianjinzhitongdaohe.com',
    list: '/api/v1/app/screen/screenMovie', detail: '/api/v1/app/play/movieDetails',
    search: '/api/v1/app/search/searchMovie', desc: '/api/v1/app/play/movieDesc',
    visitor: '/api/v1/app/user/visitorInfo', login: 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/user/login?siteid=5627189',
    detail2: 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/shortplay/detail?siteid=5627189',
    unlock: 'https://csj-sp.csjdeveloper.com/csj_sp/api/v1/pay/ad_unlock?siteid=5627189'
  }
};

const cateStr = "现言&古言&历史&都市&亲情&玄幻&热血&喜剧&悬疑&其他剧情";
const classList = cateStr.split('&');
async function init(cfg) {
  console.log(`【${siteName}】初始化`);
  try {
    let tkRes = JSON.parse(await request(rule.牛牛.host + rule.牛牛.visitor, {
      headers: { "deviceid": "aa11fc54-ba9c-3980-add5-447d3fa5b939", "token": "", "User-Agent": "okhttp/4.12.0", "client": "app", "devicetype": "Android" }
    }));
    niuniu_token = tkRes.data.token;
    let t = String(Math.floor(Date.now() / 1000));
    let body = `ac=wifi&os=Android&vod_version=1.10.21.6-tob&os_version=9&type=1&clientVersion=v5.2.5&uuid=Y4WNZ3SAWK7MAJMH7CXCDHJ4VMPVFRZQTBSIA4XTYO4AWEUHIK6Q01&resolution=1280*2618&openudid=889edced38f1069b&dt=Pixel%204&sha1=46121F77CE2FCAD3DBC3B9EC8A24908C1A8AD6D9&os_api=28&install_id=1549688030634536&device_brand=google&sdk_version=1.1.3.0&package_name=com.niuniu.ztdh.app&siteid=5627189&dev_log_aid=667431&oaid=&timestamp=${t}`;
    let nonce = "VX1KKGtoBDCi1fB1", Signature = t + nonce + body;
    let signature = hmacSHA256(Signature, 'aceaa47f96b4875d446b2e1d97e03bbb'), encbdoy = aesEncryptECB(body, 'dafdb3d2a5c343d6');
    
    let loginpost = await request(rule.牛牛.login, {
      headers: { 'X-Salt': '786774955F', 'X-Nonce': nonce, 'X-Timestamp': t, 'X-Signature': signature, 'Content-Type': 'application/x-www-form-urlencoded' },
      data: encbdoy, method: "POST"
    });
    niuniu_access_token = JSON.parse(aesDecryptECB(loginpost, 'dafdb3d2a5c343d6')).data.access_token;
    niuniu_headers = { ...aggConfig.headers.niuniu, "token": niuniu_token, "deviceid": "aa11fc54-ba9c-3980-add5-447d3fa5b939" };
    console.log(`【${siteName}】登录成功`);
  } catch (e) {
    console.log(`【${siteName}】登录失败: ${e.message}`);
    niuniu_headers = aggConfig.headers.niuniu;
  }
  return true;
}
function home(filter) {
  const classes = classList.map(cate => ({
    type_name: cate,
    type_id: cate,
    type_flag: '[CFS][SUBSITE2]'
  }));
  return JSON.stringify({ class: classes, filters: {} });
}
async function category(tid, pg, filter, extend) {
  let page = pg || 1, videos = [], area = tid || '现言';
  if (extend?.custom) return await cfs(tid, extend.custom, page);
  let res = JSON.parse(await request(`${rule.牛牛.host}${rule.牛牛.list}`, {
    method: 'POST', headers: niuniu_headers, data: { condition: { classify: area, typeId: 'S1' }, pageNum: page, pageSize: 24 }
  }));
  (res.data?.records || []).forEach(item => {
    videos.push({ vod_id: `牛牛@${item.id}`, vod_name: item.name || '', vod_pic: item.cover || '', vod_remarks: item.totalEpisode ? `${item.totalEpisode}集` : '', vod_content: item.description || '' });
  });
  return JSON.stringify({ list: videos, page, pagecount: page + 1, limit: videos.length, total: videos.length * (page + 1) });
}
async function detail(id) {
  let [, did] = id.split('@'), vod = {}, platRule = rule.牛牛;
  let descRes = JSON.parse(await request(`${platRule.host}${platRule.desc}`, { method: 'POST', headers: niuniu_headers, data: { id: did, typeId: 'S1' } }));
  let descInfo = descRes.data || {};
  let listRes = JSON.parse(await request(`${platRule.host}${platRule.detail}`, { method: 'POST', headers: niuniu_headers, data: { id: did, source: 0, typeId: 'S1', userId: '546932' } }));
  let listInfo = listRes.data || {};
  let playUrls = '';
  if (listInfo.url && listInfo.episodeList && listInfo.episodeList.length > 0) {
    playUrls = listInfo.episodeList.map(ep => `${ep.episode}$${did}+${ep.id}`).join('#');
  } else if (listInfo.thirdPlayId) {
    let thirdPlayId = listInfo.thirdPlayId;
    let data1 = "not_include=0&lock_free=1&type=1&clientVersion=v5.2.5&uuid=6IDYUSASPQY5BBVACWQW3LLTPV4V7DE26UOCX5TZTVUGX4VUJNXQ01&resolution=1080*2320&openudid=82f4175d577a2939&dt=22021211RC&os_api=31&install_id=1496879012031075&sdk_version=1.1.3.0&siteid=5627189&dev_log_aid=667431&oaid=abec0dfff623201b&timestamp=1752498494&direction=0&ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&count=1&index=1&shortplay_id="+thirdPlayId+"&sha1=46121F77CE2FCAD3DBC3B9EC8A24908C1A8AD6D9&device_brand=Redmi&package_name=com.niuniu.ztdh.app";
    try {
      let html1 = await niuniuPost(rule.牛牛.detail2, data1, "1");
      if (html1 && html1.data && html1.data.episode_right_list) {
        playUrls = html1.data.episode_right_list.map(it => `第${it.index}集$${it.index}+${it.lock_type||'free'}+${thirdPlayId}`).join('#');
      }
    } catch (e) { console.log("获取加密剧集失败:", e.message); }
  }
  vod = {
    vod_id: id, vod_name: descInfo.name || listInfo.name || '未知名称', vod_pic: descInfo.cover || listInfo.cover || '',
    vod_content: `类型：${descInfo.classify || ''}\n评分：${descInfo.score || ''}\n简介：${descInfo.introduce || ''}`,
    vod_remarks: `共${descInfo.totalEpisode || listInfo.totalEpisode || 0}集`, vod_play_from: '牛牛短剧',
    vod_play_url: playUrls || '暂无播放地址$0'
  };
  return JSON.stringify({ list: [vod] });
}
async function play(flag, id, flags) {
  if (!/牛牛/.test(flag)) return JSON.stringify({ parse: 0, url: id });
  let inputArr = id.split('+');
  if (inputArr.length === 2) {
    let ep = inputArr[0].match(/\d+/)?.[0] || "", videoId = inputArr[1];
    let res = JSON.parse(await request(`${rule.牛牛.host}/api/v1/app/play/movieDetails`, {
      method: 'POST', headers: niuniu_headers, data: { id: videoId, source: 0, typeId: "S1", userId: "546932", episodeId: ep }
    }));
    return JSON.stringify({ parse: 0, url: res.code == 200 && res.data && res.data.url ? res.data.url : id });
  }
  else if (inputArr.length === 3) {
    let [index, lock_type, thirdPlayId] = inputArr;
    if (lock_type === "free") {
      let frdata = "not_include=0&lock_free=1&type=1&clientVersion=v5.2.5&uuid=6IDYUSASPQY5BBVACWQW3LLTPV4V7DE26UOCX5TZTVUGX4VUJNXQ01&resolution=1080*2320&openudid=82f4175d577a2939&dt=22021211RC&os_api=31&install_id=1496879012031075&sdk_version=1.1.3.0&siteid=5627189&dev_log_aid=667431&oaid=abec0dfff623201b&timestamp=1752498494&direction=0&ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&count=1&index=1&shortplay_id="+thirdPlayId+"&sha1=46121F77CE2FCAD3DBC3B9EC8A24908C1A8AD6D9&device_brand=Redmi&package_name=com.niuniu.ztdh.app";
      let frhtml = await niuniuPost(rule.牛牛.detail2, frdata, index);
      if (frhtml && frhtml.data && frhtml.data.list && frhtml.data.list[0]) {
        let url = base64Decode(frhtml.data.list[0].video_model.video_list.video_1.main_url);
        return JSON.stringify({ parse: 0, url });
      }
    } else {
      let unlockData = "ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&lock_ad=3&lock_free=3&type=1&clientVersion=v5.2.5&uuid=6IDYUSASPQY5BBVACWQW3LLTPV4V7DE26UOCX5TZTVUGX4VUJNXQ01&resolution=1080*2320&openudid=82f4175d577a2939&shortplay_id=" + thirdPlayId + "&dt=22021211RC&sha1=46121F77CE2FCAD3DBC3B9EC8A24908C1A8AD6D9&lock_index=21&os_api=31&install_id=1496879012031075&device_brand=Redmi&sdk_version=1.1.3.0&package_name=com.niuniu.ztdh.app&siteid=5627189&dev_log_aid=667431&oaid=abec0dfff623201b&timestamp=1752498493";
      await niuniuPost(rule.牛牛.unlock, unlockData, index);
      let udata = "not_include=0&lock_free=1&type=1&clientVersion=v5.2.5&uuid=6IDYUSASPQY5BBVACWQW3LLTPV4V7DE26UOCX5TZTVUGX4VUJNXQ01&resolution=1080*2320&openudid=82f4175d577a2939&dt=22021211RC&os_api=31&install_id=1496879012031075&sdk_version=1.1.3.0&siteid=5627189&dev_log_aid=667431&oaid=abec0dfff623201b&timestamp=1752498494&direction=0&ac=mobile&os=Android&vod_version=1.10.21.6-tob&os_version=12&count=1&index=1&shortplay_id="+thirdPlayId+"&sha1=46121F77CE2FCAD3DBC3B9EC8A24908C1A8AD6D9&device_brand=Redmi&package_name=com.niuniu.ztdh.app";
      let unhtml = await niuniuPost(rule.牛牛.detail2, udata, index);
      if (unhtml && unhtml.data && unhtml.data.list && unhtml.data.list[0]) {
        let url = base64Decode(unhtml.data.list[0].video_model.video_list.video_1.main_url);
        return JSON.stringify({ parse: 0, url });
      }
    }
  }
  return JSON.stringify({ parse: 0, url: id });
}
async function cfs(siteId, wd, pg) {
  let page = pg || 1, results = [];
  let res = JSON.parse(await request(`${rule.牛牛.host}${rule.牛牛.search}`, {
    method: 'POST', headers: niuniu_headers, timeout: 6000,
    data: { condition: { typeId: "S1", value: wd }, pageNum: page, pageSize: 20 }
  }));
  (res.data?.records || []).forEach(item => {
    results.push({ vod_id: `牛牛@${item.id}`, vod_name: item.name || '', vod_pic: item.cover || '', vod_remarks: item.totalEpisode ? `${item.totalEpisode}集` : '', vod_content: '' });
  });
  return JSON.stringify({ list: results, page, pagecount: page + 1, limit: results.length, total: results.length * (page + 1) });
}
async function search(wd, quick, pg) {
  let page = pg || 1, list = JSON.parse(await cfs('牛牛', wd, page)).list || [];
  let filtered = list.filter(item => (item.vod_name || '').toLowerCase().includes(wd.toLowerCase()));
  return JSON.stringify({ list: filtered, page, pagecount: page + 1, limit: filtered.length, total: filtered.length * (page + 1) });
}
function aesEncryptECB(decrypteddata, key) {
  let k = CryptoJS.enc.Utf8.parse(key), d = CryptoJS.enc.Utf8.parse(decrypteddata);
  return CryptoJS.AES.encrypt(d, k, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
}
function aesDecryptECB(encryptedData, key) {
  try {
    let k = CryptoJS.enc.Utf8.parse(key), c = CryptoJS.enc.Base64.parse(encryptedData);
    return CryptoJS.AES.decrypt({ ciphertext: c }, k, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8);
  } catch (e) { console.log(`ECB解密失败: ${e.message}`); return ''; }
}
function hmacSHA256(message, secretKey) {
  return CryptoJS.HmacSHA256(message, secretKey).toString(CryptoJS.enc.Hex);
}
function base64Decode(text) {
  return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(text));
}
async function niuniuPost(url1, data1, index) {
  let t10 = String(Math.floor(Date.now() / 1000)), X_Nonce = "X9UknYKtLa3DmtjC";
  let body1 = data1.replace(/&lock_free=\d+/, "&lock_free=1").replace(/&timestamp=\d+/, "&timestamp="+t10)
    .replace(/&count=\d+/, "&count=1").replace(/&index=\d+/, "&index="+index)
    .replace(/&lock_ad=\d+/, "&lock_ad=1").replace(/&lock_index=\d+/, "&lock_index="+index);
  let body2 = aesEncryptECB(body1, 'ce49b18dd4e0a4d8'), signature = hmacSHA256(t10 + X_Nonce + body1, 'aceaa47f96b4875d446b2e1d97e03bbb');
  let html1 = await request(url1, {
    headers: { 'X-Salt': 'FD8188A8D5', 'X-Nonce': X_Nonce, 'X-Timestamp': t10, 'X-Access-Token': niuniu_access_token, 'X-Signature': signature, 'Content-Type': 'application/x-www-form-urlencoded' },
    data: body2, method: "POST"
  });
  return JSON.parse(aesDecryptECB(html1, 'ce49b18dd4e0a4d8'));
}
async function request(url, options = {}) {
  try {
    console.log(`【${siteName}】${options.method || 'GET'} ${url.split('?')[0]}`);
    let cfg = { method: options.method || 'GET', headers: { ...aggConfig.headers.default, ...options.headers }, timeout: options.timeout || 5000 };
    if (options.data) {
      if (typeof options.data === 'string') cfg.body = options.data;
      else {
        let ct = cfg.headers['Content-Type'] || '';
        if (ct.includes('json')) cfg.body = JSON.stringify(options.data);
        else cfg.body = Object.entries(options.data).map(([k, v]) => {
          v = typeof v === 'object' && v !== null ? JSON.stringify(v) : v;
          return encodeURIComponent(k) + '=' + encodeURIComponent(v);
        }).join('&');
      }
    }
    return (await req(url, cfg)).content || '';
  } catch (e) { console.log(`【${siteName}】请求失败: ${e.message}`); return ''; }
}
export function __jsEvalReturn() {
  return { init, home, category, detail, play, search };
}
