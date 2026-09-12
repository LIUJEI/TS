import { Crypto, _ } from 'assets://js/lib/cat.js';

// =====================================================================
// AppDrama（spider.jar 逆向移植）
// jar 结构：JSON 接口（getCategory/tag/list）+ protobuf 接口（category/
// search/getDetail/videoUsableUrl/find-app-zone），RSA+AES 双层签名。
// 对应 smali：com/github/catvod/spider/AppDrama.smali
// =====================================================================

let siteUrl = '';      // a: ext.host
let publicKey = '';    // b: ext.publicKey（init 签名用 RSA 公钥）
let serverKey = '';    // d: /api/v5/find/app/zone 换取的真实 RSA 公钥（str2+str3+str4+str5）
let pkgName = '';      // e:String: ext.pkg
let appName = '';      // f:String: ext.appName
let decryptFlag = '';  // g: ext.decrypt（"0" 时不解密首页推荐）
let aesKey0 = '';      // f[0]: ext.dataKey（SecureRequest 签名 / 首页推荐第一层解密）
let aesKey1 = '';      // f[1]: ext.dataIv（publicParams sig2/sig3 / 首页推荐第二层解密）
let siteKey = '';
let siteType = 3;

// c: 固定 AES key（paramsData 加密）
const AES_KEY = 'ed5fdsgucxumegqa';

// =====================================================================
// 字节 / 编码工具
// =====================================================================

function utf8Encode(str) {
    const out = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (code >= 0xd800 && code <= 0xdbff && i + 1 < str.length) {
            const next = str.charCodeAt(i + 1);
            if (next >= 0xdc00 && next <= 0xdfff) {
                code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
                i++;
            }
        }
        if (code < 0x80) {
            out.push(code);
        } else if (code < 0x800) {
            out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code < 0x10000) {
            out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        } else {
            out.push(0xf0 | (code >> 18), 0x80 | ((code >> 12) & 0x3f), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
        }
    }
    return out;
}

function utf8Decode(bytes) {
    let out = '';
    let i = 0;
    while (i < bytes.length) {
        const b = bytes[i];
        let code;
        if (b < 0x80) {
            code = b;
            i += 1;
        } else if ((b & 0xe0) === 0xc0) {
            code = ((b & 0x1f) << 6) | (bytes[i + 1] & 0x3f);
            i += 2;
        } else if ((b & 0xf0) === 0xe0) {
            code = ((b & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f);
            i += 3;
        } else if ((b & 0xf8) === 0xf0) {
            code = ((b & 0x07) << 18) | ((bytes[i + 1] & 0x3f) << 12) | ((bytes[i + 2] & 0x3f) << 6) | (bytes[i + 3] & 0x3f);
            i += 4;
        } else {
            code = b;
            i += 1;
        }
        if (code >= 0x10000) {
            code -= 0x10000;
            out += String.fromCharCode(0xd800 + (code >> 10), 0xdc00 + (code & 0x3ff));
        } else {
            out += String.fromCharCode(code);
        }
    }
    return out;
}

function bytesToWA(bytes) {
    const words = [];
    for (let i = 0; i < bytes.length; i++) {
        words[i >>> 2] = (words[i >>> 2] || 0) | ((bytes[i] & 0xff) << (24 - (i % 4) * 8));
    }
    return Crypto.lib.WordArray.create(words, bytes.length);
}

function waToBytes(wa) {
    const words = wa.words || [];
    const sig = wa.sigBytes || 0;
    const out = [];
    for (let i = 0; i < sig; i++) {
        out.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff);
    }
    return out;
}

function b64ToBytes(s) {
    return waToBytes(Crypto.enc.Base64.parse(s));
}

function bytesToB64(bytes) {
    return Crypto.enc.Base64.stringify(bytesToWA(bytes));
}

// protobuf 响应二进制 → 字节数组（假定壳以 latin1 透明返回）
function strToBytes(s) {
    const out = [];
    for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i) & 0xff);
    return out;
}

// protobuf 请求字节数组 → 请求体字符串
function bytesToStr(bytes) {
    let out = '';
    for (let i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i] & 0xff);
    return out;
}

// =====================================================================
// AES（jar a / b 方法）
// a(data,key): AES/ECB/PKCS7 解密，输入 Base64，输出 UTF-8
// b(data,key,mode,iv): 加密；CBC → 小写 hex，否则 → Base64(NO_WRAP)
// =====================================================================

function aesEcbDecryptB64(data, key) {
    return Crypto.AES.decrypt(data, Crypto.enc.Utf8.parse(key), {
        mode: Crypto.mode.ECB,
        padding: Crypto.pad.Pkcs7
    }).toString(Crypto.enc.Utf8);
}

function aesEncrypt(data, key, mode, iv) {
    const keyWA = Crypto.enc.Utf8.parse(key);
    if (mode === 'CBC') {
        const enc = Crypto.AES.encrypt(Crypto.enc.Utf8.parse(data), keyWA, {
            iv: Crypto.enc.Utf8.parse(iv),
            mode: Crypto.mode.CBC,
            padding: Crypto.pad.Pkcs7
        });
        return Crypto.enc.Hex.stringify(enc.ciphertext);
    }
    const enc = Crypto.AES.encrypt(Crypto.enc.Utf8.parse(data), keyWA, {
        mode: Crypto.mode.ECB,
        padding: Crypto.pad.Pkcs7
    });
    return enc.ciphertext.toString(Crypto.enc.Base64);
}

// =====================================================================
// RSA（jar i 方法）：RSA/ECB/PKCS1Padding 加密，X509(SPKI) 公钥，输出 Base64
// 纯 JS 实现（BigInt modpow），QuickJS 需支持 BigInt
// =====================================================================

const BI_0 = typeof BigInt !== 'undefined' ? BigInt(0) : 0;
const BI_1 = typeof BigInt !== 'undefined' ? BigInt(1) : 1;

function bytesToBigInt(bytes) {
    let v = BI_0;
    for (let i = 0; i < bytes.length; i++) {
        v = v * BigInt(256) + BigInt(bytes[i] & 0xff);
    }
    return v;
}

function bigIntToBytes(v, len) {
    const out = [];
    for (let i = len - 1; i >= 0; i--) {
        const mod = v % BigInt(256);
        out[i] = Number(mod);
        v = v / BigInt(256);
    }
    return out;
}

function modPow(b, e, m) {
    let r = BI_1;
    b = b % m;
    while (e > BI_0) {
        if (e % BigInt(2) === BI_1) r = (r * b) % m;
        b = (b * b) % m;
        e = e / BigInt(2);
    }
    return r;
}

// 读一个 DER TLV
function derTLV(buf, pos) {
    const tag = buf[pos];
    let len = buf[pos + 1];
    let hdr = 2;
    if (len & 0x80) {
        const n = len & 0x7f;
        len = 0;
        for (let i = 0; i < n; i++) len = len * 256 + buf[pos + 2 + i];
        hdr = 2 + n;
    }
    return { tag: tag, len: len, start: pos + hdr };
}

function rsaEncrypt(text, pubKeyB64) {
    if (typeof BigInt === 'undefined') return '';
    try {
        const der = b64ToBytes(String(pubKeyB64).trim());
        const seq1 = derTLV(der, 0);                       // SubjectPublicKeyInfo SEQUENCE
        const alg = derTLV(der, seq1.start);               // AlgorithmIdentifier
        const bits = derTLV(der, alg.start + alg.len);     // BIT STRING
        let key = der.slice(bits.start + 1, bits.start + bits.len); // 跳过 unused-bits 字节
        const seq2 = derTLV(key, 0);                       // RSAPublicKey SEQUENCE
        const intN = derTLV(key, seq2.start);
        const nBytes = key.slice(intN.start, intN.start + intN.len);
        const intE = derTLV(key, intN.start + intN.len);
        const eBytes = key.slice(intE.start, intE.start + intE.len);
        const n = bytesToBigInt(nBytes);
        const e = bytesToBigInt(eBytes);
        const k = nBytes.length;
        const m = utf8Encode(text);
        if (m.length > k - 11) return '';
        // EME-PKCS1-V1_5：00 02 PS(非零随机) 00 M
        const em = [0, 2];
        while (em.length < k - m.length - 1) em.push(1 + Math.floor(Math.random() * 254));
        em.push(0);
        for (let i = 0; i < m.length; i++) em.push(m[i]);
        const c = modPow(bytesToBigInt(em), e, n);
        return bytesToB64(bigIntToBytes(c, k));
    } catch (err) {
        return '';
    }
}

// jar f 方法：len-1 个随机字符 + '='
function randomStr(len) {
    const chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let out = '';
    for (let i = 0; i < len - 1; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return out + '=';
}

function randomUUID() {
    const tpl = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return tpl.replace(/[xy]/g, function (c) {
        const r = Math.floor(Math.random() * 16);
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return '0123456789abcdef'.charAt(v);
    });
}

// =====================================================================
// protobuf 编解码（jar SecureRequestProto / RSARequestProto / ApiResultProto
// / RSAPublicProto / DramaProto / DramaDetailProto / DramaVideoProto
// / DramaCoverImageProto / ParsePlayUrlProto，字段号取自 writeTo）
// =====================================================================

function pbVarint(v) {
    const out = [];
    let n = v;
    while (n > 127) {
        out.push((n % 128) | 0x80);
        n = Math.floor(n / 128);
    }
    out.push(n);
    return out;
}

function pbBytesField(field, bytes) {
    const out = pbVarint((field << 3) | 2);
    return out.concat(pbVarint(bytes.length), bytes);
}

function pbInt64Field(field, v) {
    return pbVarint((field << 3) | 0).concat(pbVarint(v));
}

// RSARequest{1:timestamp,2:sign,3:fake1,4:randomStr,5:fake2}
function buildRSARequest(ts, sign, fake1, rstr, fake2) {
    let out = [];
    out = out.concat(pbInt64Field(1, ts));
    out = out.concat(pbBytesField(2, utf8Encode(sign)));
    out = out.concat(pbBytesField(3, utf8Encode(fake1)));
    out = out.concat(pbBytesField(4, utf8Encode(rstr)));
    out = out.concat(pbBytesField(5, utf8Encode(fake2)));
    return out;
}

// SecureRequest{1:aesEncrypt1,2:aesEncrypt2,3:aesFakestr,4:timestamp,5:randomStr}
function buildSecureRequest(aes1, aes2, fake, ts, rstr) {
    let out = [];
    out = out.concat(pbBytesField(1, utf8Encode(aes1)));
    out = out.concat(pbBytesField(2, utf8Encode(aes2)));
    out = out.concat(pbBytesField(3, utf8Encode(fake)));
    out = out.concat(pbInt64Field(4, ts));
    out = out.concat(pbBytesField(5, utf8Encode(rstr)));
    return out;
}

// 通用解码：{fieldNo: [{t:'v'|'b', v}...]}；未知 wire type 优雅终止
function pbParse(bytes) {
    const fields = {};
    let i = 0;
    const readVarint = function () {
        let v = 0;
        let mul = 1;
        while (i < bytes.length) {
            const b = bytes[i];
            i++;
            v += (b & 0x7f) * mul;
            if ((b & 0x80) === 0) break;
            mul *= 128;
        }
        return v;
    };
    while (i < bytes.length) {
        const key = readVarint();
        if (i >= bytes.length && key === 0) break;
        const field = Math.floor(key / 8);
        const wt = key % 8;
        if (wt === 0) {
            const v = readVarint();
            if (!fields[field]) fields[field] = [];
            fields[field].push({ t: 'v', v: v });
        } else if (wt === 2) {
            const len = readVarint();
            const v = bytes.slice(i, i + len);
            i += len;
            if (!fields[field]) fields[field] = [];
            fields[field].push({ t: 'b', v: v });
        } else if (wt === 1) {
            i += 8;
        } else if (wt === 5) {
            i += 4;
        } else {
            break;
        }
    }
    return fields;
}

function pbField(root, no) {
    const a = root[no];
    return a && a.length ? a[a.length - 1] : null;
}

function pbStr(root, no) {
    const f = pbField(root, no);
    return f && f.t === 'b' ? utf8Decode(f.v) : '';
}

function pbInt(root, no) {
    const f = pbField(root, no);
    return f && f.t === 'v' ? f.v : 0;
}

function pbMsg(root, no) {
    const f = pbField(root, no);
    return f && f.t === 'b' ? pbParse(f.v) : null;
}

function pbMsgList(root, no) {
    const a = root[no] || [];
    const out = [];
    for (let i = 0; i < a.length; i++) {
        if (a[i].t === 'b') out.push(pbParse(a[i].v));
    }
    return out;
}

// =====================================================================
// 请求构造（jar c / d / e / g 方法）
// =====================================================================

// jar d 方法：公共参数（uuid/androidID 每次调用重新生成，同 jar）
function publicParams() {
    const uuid = randomUUID().replace(/-/g, '').toUpperCase();
    const androidId = randomUUID().replace(/-/g, '').toLowerCase().substring(0, 16);
    return {
        country: 'CN',
        vName: cfgJson.version || '',
        cpuId: 'MT6893Z%2FCZA',
        young: 0,
        facturer: 'Xiaomi',
        pkg: pkgName,
        uuid: uuid,
        resolution: '1080x2272',
        mac: '02%3A00%3A00%3A00%3A00%3A00',
        abid: '397',
        model: 'M2012K11AC',
        plat: 'android',
        udid: uuid,
        dpi: '440',
        net: '1',
        lang: 'zh',
        brand: 'Xiaomi',
        density: '2.75',
        appName: appName,
        cpu: 'arm64-v8a',
        chid: '10000',
        carrier: '%E8%81%94%E9%80%9A',
        _vOsCode: 33,
        vOs: '13',
        v: 1,
        tenantId: '',
        vApp: (cfgJson.version || '').replace(/\./g, ''),
        device: 0,
        androidID: androidId
    };
}

let cfgJson = {};

// jar c 方法：protobuf 接口请求头（Accept/Content-Type x-protobuf + publicParams）
function protoHeaders() {
    const key = serverKey || publicKey;
    const dd = publicParams();
    const ts = Date.now();
    const r16 = randomStr(16);
    const vApp = dd.vApp || '';
    const sig = rsaEncrypt('' + ts + r16 + vApp, key);
    const enc = aesEncrypt('' + ts + r16, aesKey1, 'ECB', '');
    dd.sig = sig;
    dd.random_str = r16;
    dd.timestamp = ts;
    dd.sig2 = enc.substring(0, 8);
    dd.sig3 = enc.substring(8);
    const inner = { paramsData: aesEncrypt(JSON.stringify(dd), AES_KEY, 'CBC', AES_KEY) };
    return {
        'User-Agent': 'okhttp/3.12.1',
        'Accept': 'application/x-protobuf',
        'Content-Type': 'application/x-protobuf',
        'publicParams': JSON.stringify(inner)
    };
}

// jar e 方法：JSON 接口请求头（Accept/Content-Type json + publicParams）
function jsonHeaders() {
    const inner = { paramsData: aesEncrypt(JSON.stringify(publicParams()), AES_KEY, 'CBC', AES_KEY) };
    return {
        'User-Agent': 'okhttp/3.12.1',
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'publicParams': JSON.stringify(inner)
    };
}

// jar g 方法：SecureRequest 请求体
// qs = k=v&k=v（原样拼接，无 URL 编码）+ timestamp → AES/ECB(f[0]) → Base64
// full = randomStr(8) + enc；aesEncrypt1 = full[0:20]，aesEncrypt2 = full[20:]
function secureRequestBody(paramsObj) {
    const ts = Date.now();
    const s8 = randomStr(8);
    const s20 = randomStr(20);
    let qs = '';
    for (const k in paramsObj) {
        const v = paramsObj[k];
        if (v === null || v === undefined || v === '') continue;
        if (qs.length > 0) qs += '&';
        qs += k + '=' + v;
    }
    const plain = qs + ts;
    const enc = aesEncrypt(plain, aesKey0, 'ECB', '');
    const full = s8 + enc;
    return buildSecureRequest(full.substring(0, 20), full.substring(20), s20, ts, s8);
}

// merge/k/b.b + ApiResult：POST protobuf，返回 {code, msg, dataBytes}
async function protoPost(path, paramsObj) {
    const body = bytesToStr(secureRequestBody(paramsObj));
    const res = await req(siteUrl + path, {
        method: 'post',
        data: body,
        postType: 'raw',
        headers: protoHeaders(),
        timeout: 30000
    });
    const bytes = strToBytes(res.content || '');
    const root = pbParse(bytes);
    return {
        code: pbInt(root, 1),
        msg: pbStr(root, 2),
        dataBytes: (function () {
            const f = pbField(root, 3);
            return f && f.t === 'b' ? f.v : [];
        })()
    };
}

// merge/k/b.l + e()：GET JSON 接口
async function jsonGet(path) {
    const res = await req(siteUrl + path, {
        method: 'get',
        headers: jsonHeaders(),
        timeout: 30000
    });
    return res.content || '';
}

async function httpGet(reqUrl, header) {
    const res = await req(reqUrl, {
        method: 'get',
        headers: header || {},
        timeout: 30000
    });
    return res.content || '';
}

// =====================================================================
// 弹幕辅助（同 Get.js 已验证实现，来源同 jar Danmu 类）
// =====================================================================

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

// Danmu.formatDanmuUrl2（命中 http/vodid/vodurl 时实际拉取弹幕内容）
async function formatDanmuUrl2(raw) {
    if (!raw) return '';
    if (raw.indexOf('<?xml version="1.0" encoding="UTF-8"?>') === 0) return raw;
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

// 不依赖 URLSearchParams 的双桥兼容取参（同 Get.js）
function safeDecode(s) {
    let cur = s;
    for (let i = 0; i < 2; i++) {
        const prev = cur;
        try {
            cur = decodeURIComponent(cur);
        } catch (e) {
            break;
        }
        if (cur === prev) break;
    }
    return cur;
}

function parseQuery(q) {
    const out = {};
    if (!q) return out;
    const pairs = q.split('&');
    for (let i = 0; i < pairs.length; i++) {
        const kv = pairs[i];
        if (!kv) continue;
        const pos = kv.indexOf('=');
        const k = pos < 0 ? kv : kv.substring(0, pos);
        const val = pos < 0 ? '' : kv.substring(pos + 1);
        out[k] = safeDecode(val.replace(/\+/g, ' '));
    }
    return out;
}

// =====================================================================
// 列表解析（jar h 方法 / detail / playerContent）
// =====================================================================

// DramaBeanPage{1:dramaBean*, 16:total}
// DramaBean{1:area,2:coverImage,3:id,4:brief,5:name,13:remark,14:year,...}
// DramaCoverImageBean{1:path,2:thumbnailPath}
function parseDramaPage(dataBytes) {
    const page = pbParse(dataBytes);
    const beans = pbMsgList(page, 1);
    const list = [];
    for (let i = 0; i < beans.length; i++) {
        const b = beans[i];
        const cover = pbMsg(b, 2);
        list.push({
            vod_id: String(pbInt(b, 3)),
            vod_name: pbStr(b, 5),
            vod_pic: cover ? pbStr(cover, 2) : '',
            vod_remarks: pbStr(b, 13)
        });
    }
    return list;
}

// 播放串直链判定：(?i).*\.(mp4|m3u8|...)(\?.*)?$ 全串匹配
function isDirectUrl(path) {
    return /.*\.(mp4|m3u8|flv|mkv|avi|ts|mov|mpd|m4a|wmv)(\?.*)?$/i.test(path || '');
}

// =====================================================================
// Spider 接口
// =====================================================================

async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype || 3;
    if (!cfg.ext) return;
    if (typeof cfg.ext === 'string') {
        cfgJson = JSON.parse(cfg.ext);
    } else if (typeof cfg.ext === 'object' && cfg.ext !== null) {
        cfgJson = cfg.ext;
    } else {
        return;
    }
    siteUrl = cfgJson.host || '';
    publicKey = cfgJson.publicKey || '';
    pkgName = cfgJson.pkg || '';
    appName = cfgJson.appName || '';
    decryptFlag = cfgJson.decrypt || '';
    aesKey0 = cfgJson.dataKey || '';
    aesKey1 = cfgJson.dataIv || '';

    // ext.site：GET 换取真实 domain
    try {
        const site = cfgJson.site || '';
        if (site) {
            const txt = await httpGet(site, {});
            const dom = JSON.parse(txt).domain || '';
            if (dom) siteUrl = dom;
        }
    } catch (e) {
    }

    // RSARequest{timestamp,sign,fake1,randomStr,fake2} → /api/v5/find/app/zone
    try {
        const ts = Date.now();
        const r16 = randomStr(16);
        const sign = rsaEncrypt('' + ts + r16, publicKey);
        const body = bytesToStr(buildRSARequest(ts, sign, randomStr(16), r16, randomStr(16)));
        const res = await req(siteUrl + '/api/v5/find/app/zone', {
            method: 'post',
            data: body,
            postType: 'raw',
            headers: protoHeaders(),
            timeout: 30000
        });
        const root = pbParse(strToBytes(res.content || ''));
        const df = pbField(root, 3);
        const data = df && df.t === 'b' ? pbParse(df.v) : null;
        if (data) {
            // RSAPublic{1:str1,2:str2,3:str3,4:str4,5:str5} → d = str2+str3+str4+str5
            serverKey = pbStr(data, 2) + pbStr(data, 3) + pbStr(data, 4) + pbStr(data, 5);
        }
    } catch (e) {
        serverKey = '';
    }
}

// homeContent：/api/v3/drama/getCategory?orderBy=type_id
async function home(filter) {
    const classes = [];
    const filters = {};
    try {
        const text = await jsonGet('/api/v3/drama/getCategory?orderBy=type_id');
        const data = JSON.parse(text).data;
        if (!data) return JSON.stringify({ class: classes, filters: filters });
        const keys = ['class', 'lang', 'area', 'year', 'extend_sort'];
        for (let i = 0; i < data.length; i++) {
            const item = data[i] || {};
            if (item.name === '公告') continue;
            classes.push({ type_id: item.id, type_name: item.name });
            const converUrl = item.converUrl || '';
            if (!converUrl) continue;
            let conv = {};
            try {
                conv = JSON.parse(converUrl);
            } catch (e) {
                continue;
            }
            const flist = [];
            for (let k = 0; k < keys.length; k++) {
                const key = keys[k];
                if (!Object.prototype.hasOwnProperty.call(conv, key)) continue;
                const val = conv[key] || '';
                if (!val) continue;
                // Java split(",")：去除尾部空串，保留内部空串
                const vals = val.split(',');
                while (vals.length > 0 && vals[vals.length - 1] === '') vals.pop();
                const value = [];
                for (let j = 0; j < vals.length; j++) value.push({ n: vals[j], v: vals[j] });
                flist.push({ key: key, name: key, value: value });
            }
            if (flist.length > 0) filters[item.id] = flist;
        }
    } catch (e) {
    }
    return JSON.stringify({ class: classes, filters: filters });
}

// homeVideoContent：/api/ex/v3/security/tag/list
async function homeVod() {
    const list = [];
    try {
        const text = await jsonGet('/api/ex/v3/security/tag/list');
        let dataStr = JSON.parse(text).data || '';
        if (!dataStr) return JSON.stringify({ list: list });
        if (decryptFlag !== '0') {
            dataStr = aesEcbDecryptB64(dataStr, aesKey0);
            dataStr = aesEcbDecryptB64(dataStr, aesKey1);
        }
        const arr = JSON.parse(dataStr);
        for (let i = 0; i < arr.length; i++) {
            const sections = (arr[i] || {}).sections;
            if (!sections) continue;
            for (let j = 0; j < sections.length; j++) {
                const vodList = (sections[j] || {}).vodList;
                if (!vodList) continue;
                for (let k = 0; k < vodList.length; k++) {
                    const v = vodList[k] || {};
                    const cover = v.coverImage || {};
                    list.push({
                        vod_id: v.id || '',
                        vod_name: v.name || '',
                        vod_pic: cover.path || '',
                        vod_remarks: v.remark || ''
                    });
                }
            }
        }
    } catch (e) {
    }
    return JSON.stringify({ list: list });
}

// categoryContent：/api/proto/v5/drama/category（pagesize 21）
async function category(tid, pg, filter, extend) {
    extend = extend || {};
    let page = parseInt(pg, 10);
    if (isNaN(page) || page <= 0) page = 1;
    const params = {
        pagesize: '21',
        typeId1: String(tid),
        page: String(pg),
        vodOrderBy: extend['extend_sort'] || '最新',
        vodArea: extend['area'] || '',
        vodLang: extend['lang'] || '',
        vodClass: extend['class'] || '',
        vodYear: extend['year'] || ''
    };
    const list = [];
    try {
        const ret = await protoPost('/api/proto/v5/drama/category', params);
        const data = ret.dataBytes;
        if (data && data.length > 0) {
            const parsed = parseDramaPage(data);
            for (let i = 0; i < parsed.length; i++) list.push(parsed[i]);
        }
    } catch (e) {
    }
    const maxInt = 2147483647;
    return JSON.stringify({
        page: page,
        pagecount: maxInt,
        limit: maxInt,
        total: maxInt,
        list: list
    });
}

// detailContent：/api/proto/v5/drama/getDetail
// DramaDetailBean{1:area,6:intro,9:name,13:tag,18:year,25:actor,26:remark,29:videos*}
// DramaVideoBean{2:title,4:path,9:source,10:sourceCn}
// 注意：jar 未设置 vod_id/vod_name/vod_pic，忠实移植
async function detail(id) {
    const realId = Array.isArray(id) ? id[0] : id;
    const vod = {};
    try {
        const ret = await protoPost('/api/proto/v5/drama/getDetail', { id: String(realId) });
        const d = pbParse(ret.dataBytes || []);
        vod.vod_actor = pbStr(d, 25);
        vod.vod_director = '';
        vod.vod_tag = pbStr(d, 13);
        vod.vod_area = pbStr(d, 1);
        vod.vod_year = String(pbInt(d, 18));
        vod.vod_remarks = pbStr(d, 26);
        vod.vod_content = pbStr(d, 6);

        const groups = {};
        const order = [];
        const videos = pbMsgList(d, 29);
        for (let i = 0; i < videos.length; i++) {
            const v = videos[i];
            let sourceCn = pbStr(v, 10);
            if (!sourceCn) sourceCn = '橘汁';
            if (!groups[sourceCn]) {
                groups[sourceCn] = [];
                order.push(sourceCn);
            }
            const path = pbStr(v, 4);
            let playId;
            if (isDirectUrl(path)) {
                playId = path;
            } else {
                const obj = { vodPlayFrom: pbStr(v, 9), playUrl: path };
                playId = bytesToB64(utf8Encode(JSON.stringify(obj)));
            }
            groups[sourceCn].push(pbStr(v, 2) + '$' + playId);
        }
        const froms = [];
        const urls = [];
        for (let i = 0; i < order.length; i++) {
            froms.push(order[i]);
            urls.push(groups[order[i]].join('#'));
        }
        vod.vod_play_from = froms.join('$$$');
        vod.vod_play_url = urls.join('$$$');
    } catch (e) {
    }
    return JSON.stringify({ list: [vod] });
}

// playerContent：直链直接返回；否则 Base64 反解 {vodPlayFrom, playUrl}
// → /api/proto/v5/videoUsableUrl → ParsePlayUrlBean{1:playUrl, 6:headers(map)}
// jar merge/a/a.addDanmaku：结果附加 danmaku = ProxyUrl + "?do=diydanmu"
async function play(flag, id, flags) {
    let danmaku = '';
    try {
        danmaku = js2Proxy(false, siteType, siteKey || '', '&do=diydanmu', {});
    } catch (e) {
        danmaku = '';
    }
    if (isDirectUrl(id)) {
        return JSON.stringify({ parse: 0, url: id, danmaku: danmaku });
    }
    try {
        const obj = JSON.parse(utf8Decode(b64ToBytes(id)));
        const ret = await protoPost('/api/proto/v5/videoUsableUrl', obj);
        const d = pbParse(ret.dataBytes || []);
        const url = pbStr(d, 1);
        const header = {};
        const entries = pbMsgList(d, 6);
        for (let i = 0; i < entries.length; i++) {
            header[pbStr(entries[i], 1)] = pbStr(entries[i], 2);
        }
        const result = { parse: 0, url: url, danmaku: danmaku };
        if (Object.keys(header).length > 0) result.header = header;
        return JSON.stringify(result);
    } catch (e) {
        return JSON.stringify({ parse: 0, url: '', danmaku: danmaku });
    }
}

// searchContent：/api/proto/v5/drama/search（searchKeys/page/pagesize 21）
async function search(wd, quick, pg) {
    let page = parseInt(pg, 10);
    if (isNaN(page) || page <= 0) page = 1;
    const list = [];
    try {
        const ret = await protoPost('/api/proto/v5/drama/search', {
            searchKeys: wd,
            page: String(page),
            pagesize: '21'
        });
        const data = ret.dataBytes;
        if (data && data.length > 0) {
            const parsed = parseDramaPage(data);
            for (let i = 0; i < parsed.length; i++) list.push(parsed[i]);
        }
    } catch (e) {
    }
    return JSON.stringify({ list: list });
}

// proxy（jar Danmu.DiyDanmu）：
// 127.0.0.1:9978/media 取当前播放 title/artist → 解析集数 → 1314 取弹幕
// （SP 缓存与 OK360 通道依赖 jar 内部设施，JS 侧不可用，省略）
async function proxy(params) {
    const emptyResult = JSON.stringify({
        code: 200,
        content: '',
        headers: { 'Content-Type': 'application/xml' }
    });

    let doWhat = safeDecode(params.do || '');
    if (doWhat !== 'diydanmu' && params.url) {
        let raw = safeDecode(params.url);
        if (raw.charAt(0) === '?' || raw.charAt(0) === '&') raw = raw.substring(1);
        const parsed = parseQuery(raw);
        doWhat = parsed.do || doWhat;
    }
    if (doWhat !== 'diydanmu') return emptyResult;

    try {
        const media = JSON.parse(await httpGet('http://127.0.0.1:9978/media', {}));
        const title = media.title || '';
        const artist = media.artist || '';
        const realName = getRealName(title);
        if (!realName) return emptyResult;
        const name2 = artist ? artist : realName;
        const episode = parseVodIndex(name2);

        let xml = await getDanmuFrom1314(realName, episode);
        xml = await formatDanmuUrl2(xml);
        if (xml) xml = updateDanmuWhite(xml);
        return JSON.stringify({
            code: 200,
            content: xml,
            headers: { 'Content-Type': 'application/xml' }
        });
    } catch (e) {
        return emptyResult;
    }
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
