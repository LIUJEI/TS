{
  /*-----------------------JAR包接口&壁纸接口(可替换)-----------------------*/
  "spider": "./JAR/MS.jar;md5;8aa48c5533a2a6d343060c7044614fae",
  "wallpaper": "http://127.0.0.1:9978/proxy?do=wallpaper",
  "logo": "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20251224/dJkT/1080X1080/logo.jpg/webp",
  "danmaku": "http://127.0.0.1:9978/proxy?do=danmaku&name={name}&episode={episode}",
  //数据接口====================================网站===============================================
"sites": [
{
    "key": "Douban",
    "name": "🎬┣豆瓣┫首页",
    "type": 3,
    "api": "csp_Douban",
    "indexs": 0
},
{
    "key": "csp_Notice",
    "name": "🎬┣更新┫公告",
    "type": 3,
    "api": "csp_Notice",
    "jar": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/libs/liuli.php",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/libs/公告.php"
},
{
    "key": "maitian",
    "name": "🌾┃麥田┃秒播",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/XYQ/麥田.php",
    "indexs": 0
},
{
    "key": "fengyei",
    "name": "🍀┃枫叶┃秒播",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/XYQ/枫叶.php",
    "indexs": 0
},
{
    "key": "NB012绿豆",
    "name": "🏝┃绿豆┃秒播",
    "type": 3,
    "api": "http://app.69mini.com/tvbox/AppYsV2.js",
    "ext": {
    "host": "http://ld.69mzf.cn/api.php/app/",
    "*": [
    "https://niubi.69mini.com/api/?key=de8570d02b2e5181978a6c47a8eb4d91&url="]}
},
{
    "key": "蓝鸟",
    "name": "🐦┃蓝鸟┃秒播",
    "type": 3,
    "api": "csp_AppQi",
    "ext": {
    "site": "https://lanyingjisu.oss-cn-wuhan-lr.aliyuncs.com/lyjszx.txt",
    "dataKey": "oW5UxZ5kWVr1DI69",
    "dataIv": "oW5UxZ5kWVr1DI69",
    "init": "initV122",
    "ua": "okhttp/3.10.0"}
},
{
    "key": "奇奇",
    "name": "🪂┃奇奇┃秒播",
    "type": 3,
    "api": "csp_AppQi",
    "ext": {
    "site": "https://yun-1316442804.cos.ap-guangzhou.myqcloud.com/603.txt",
    "dataKey": "FTgP4Gq8zPiqbt7M",
    "dataIv": "FTgP4Gq8zPiqbt7M",
    "init": "initV122",
    "ua": "okhttp/3.10.0",
    "search": "searchList8"}
},
{
    "key": "怀桑",
    "name": "💫┃怀桑┃秒播",
    "type": 3,
    "api": "csp_AppQi",
    "ext": {
    "site": "https://jk.catvod.site/jk/t4/mqxhqj.txt",
    "dataKey": "kj37zs29q22jk96t",
    "dataIv": "kj37zs29q22jk96t",
    "init": "initV122",
    "playname": "怀桑",
    "ua": "okhttp/3.10.0"}
},
{
    "key": "世界",
    "name": "🗺┃世界┃秒播",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "url": "https://appcms.4ksj.app",
    "dataKey": "O3K6rYx75Q4xtiIE",
    "dataIv": "O3K6rYx75Q4xtiIE"}
},
{
    "key": "csp_huayi",
    "name": "🏵┃華誼┃秒播",
    "type": 3,
    "api": "csp_AppDrama",
    "ext": {
    "appName": "華誼影視",
    "dataKey": "NDBYSZR1DMRRZ05NSUCWEJNIYWLBPT0=",
    "dataIv": "OC1A06E197EF10CF3F6058CA7A803B5E",
    "pkg": "com.muyue.tool",
    "host": "",
    "site": "https://vip.123pan.cn/1851089669/oss/az5.txt",
    "version": "1.0.0.4",
    "publicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCp9Ek4wIlQAtwFnuBRlsFiow2tr+4UOciGeNKbY7nL74etUqUb6fvpOSOHhFEfaWlfwUpOB17x3JEL3No19nfjCeVYrYPjlJcgoqUWH/tfIfFAQWvtxBIBlKazkhw8d3ChysWmeWRikKqkBsVRY4oqNPuj4sjm6Zult0U4I4prRQIDAQAB",
    "decrypt": "1"}
},
{
    "key": "csp_苹果",
    "name": "🍏┃苹果┃秒播",
    "type": 3,
    "api": "csp_AppDrama",
    "ext": {
    "appName": "小苹果",
    "dataKey": "S0VNDTJHOFHHCNMRAW5IV2TOS2PBPQ==",
    "dataIv": "OC1A06E197EF10CF3F6058CA7A803B5E",
    "pkg": "com.juechufsh.android.xpg1",
    "host": "",
    "site": "https://xpgandroid03-1372779881.cos.ap-beijing.myqcloud.com/app_xpg_android.txt",
    "version": "1.0.0.3",
    "publicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCduNEnfxGaLuQRk5ABzXHhPV43zi00sCHjLo8BYc+Wi6xXm2b4v0i28Sq4WlNCKhseft9fz8kO/qLr6/022o1RcuOU7e4GFL3U9WnNODwRBYSYWd+K8nqpI/tAUDmZEBGRWqjrc7x6aMl3A+xpnWkLbPCLsuhbuuUE3tv09oeOpwIDAQAB"}
},
{
    "key": "csp_banriys",
    "name": "🌗┃半日┃秒播",
    "type": 3,
    "api": "csp_App99",
    "ext": {
    "host": "http://103.217.190.91:19987/app/bn",
    "appkey": "24d625a8a29b4700a1a294c6f3b29e2c",
    "versionName": "3.5.8",
    "name": "半日闲",
    "package": "com.yf.lelian",
    "buildNumber": "2001",
    "buildSignature": "A40DA80A59D170CAA950CF15C18C454D47A39B26989D8B640ECD745BA71BF5DC"}
},
{
    "key": "剧圈99",
    "name": "💞┃剧圈┃秒播",
    "type": 3,
    "api": "csp_App99",
    "ext": {
    "host": "http://124.221.3.182:19987/app/bn",
    "appkey": "d1f0c269eab74d93821fffc9befdbbba",
    "versionName": "1.2.0",
    "name": "剧圈圈",
    "package": "com.qingtangxiaozhuan.xyz",
    "buildNumber": "2002",
    "buildSignature": "054FA8DDA4319C6B6A9B954CA5777541C993F00B1B0BD4394F7EDE48184C4594"}
},
{
    "key": "csp_马猴影视",
    "name": "🦓┃影視┃马猴",
    "type": 3,
    "api": "csp_App3Q",
    "ext": {
    "host": "https://45.150.167.18:8000",
    "finger": "SF-A962FEC75DA28D7514F2A16580334272A78AC0A8429F10C94F47C1BAFC876E3F",
    "updateId": "43c1ef69-3748-aaeb-317f-c621c77653ee",
    "deviceBrand": "vivo",
    "deviceModel": "V2309A",
    "pkg": "com.damahou.tv",
    "sk": "SK-woniu-thanks",
    "ver": "1"}
},
{
    "key": "aiying",
    "name": "💝┃爱影┃影视",
    "type": 3,
    "api": "csp_AppQi",
    "ext": {
    "site": "https://aysappto.oss-cn-chengdu.aliyuncs.com/q26.txt",
    "dataKey": "0UKM8jkasM8tdzgW",
    "dataIv": "0UKM8jkasM8tdzgW",
    "init": "initV122",
    "ua": "okhttp/3.10.0"}
},
{
    "key": "csp_蓝鹰",
    "name": "🦅┃蓝鹰┃影视",
    "type": 3,
    "api": "csp_AppQi",
    "ext": {
    "site": "https://xinlanyinghb.oss-cn-wuhan-lr.aliyuncs.com/xly.txt",
    "dataKey": "ca94b06ca359d80e",
    "dataIv": "ca94b06ca359d80e",
    "init": "initV120",
    "ua": "okhttp/3.10.0"}
},
{
    "key": "小鹿",
    "name": "🦌┃小鹿┃影视",
    "type": 3,
    "api": "csp_AppQi",
    "ext": {
    "site": "https://xiaolu-1319209748.cos.ap-beijing.myqcloud.com/xiaolu.txt",
    "dataKey": "x5Bep6Q78VCeYnPS",
    "dataIv": "x5Bep6Q78VCeYnPS",
    "ua": "okhttp/3.10.0"}
},
{
    "key": "csp_王子",
    "name": "🤵┃王子┃影视",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "url": "https://app.95112475.xyz",
    "dataKey": "5a9w6x58dsq6z3a6",
    "dataIv": "5a9w6x58dsq6z3a6"}
},
{
    "key": "一起影视",
    "name": "🏵┃一起┃影视",
    "type": 3,
    "api": "csp_AppYQK",
    "indexs": 0
},
{
    "key": "飞娱影视",
    "name": "🍬┃飞娱┃影视",
    "type": 3,
    "api": "csp_Feiyu",
    "indexs": 0
},
{
    "key": "韩剧秒播",
    "name": "🍩┃韩圈┃影视",
    "type": 3,
    "api": "csp_Hxq",
    "ext": "http://www.小不点.com/api/2026/fishhxq.php"
}, 
{
    "key": "csp_山楂影视",
    "name": "🌰┃影視┃山楂",
    "type": 3,
    "api": "csp_PianKu8",
    "indexs" : 0
},
{
    "key": "瓜子影视",
    "name": "🥑┃瓜子┃影视",
    "type": 3,
    "api": "csp_Gz360",
    "indexs": 0
},
{
    "key": "热播影视",
    "name": "🎊┃热播┃影视",
    "type": 3,
    "api": "csp_AppRJ",
    "ext": {"url": "http://v.rbotv.cn"}
},
{
    "key": "文才",
    "name": "✏️┃文才┃影视",
    "type": 3,
    "api": "csp_Jpys",
    "ext": "https://y2s52n7.com"
},
{
    "key": "骚火",
    "name": "♨┃骚火┃影视",
    "type": 3,
    "api": "csp_SaoHuo",
    "ext": "https://shdy5.us"
},
{
    "key": "独播",
    "name": "🎯┃独播┃影视",
    "type": 3,
    "api": "csp_Duboku",
    "indexs": 0
},
{
    "key": "Web1905",
    "name": "🎞┃影視┃ 老片",
    "type": 3,
    "api": "csp_Web1905",
    "indexs" : 0
},
{
    "key": "哔哩视频",
    "name": "✨┃哔哩┃视频",
    "type": 3,
    "api": "csp_BiliYS",
    "indexs": 0
},
{
    "key": "Ikanbot",
    "name": "🏵┃影視┃ 爱看 ",
    "type": 3,
    "api": "csp_Ikanbot",
    "indexs" : 0
},
{ 
    "key":"csp_红果短剧",
    "name":"♨️┃红果┃短劇",
    "type":4,
    "api":"https://api.uumnet.com/tvbox/php/nxduanju_xxy.php?token=nxyyds",
    "indexs": 0
},
{
    "key": "ShortHaokan",
    "name": "♨️┃短劇┃豪堪",
    "type": 3,
    "api": "csp_ShortHaokan",
    "genre": "shortdrama"
},
{
    "key": "ShortWeiguan",
    "name": "♨️┃短劇┃围观",
    "type": 3,
    "api": "csp_ShortWeiguan",
    "genre": "shortdrama"
},
{
    "key": "ShortXingya",
    "name": "♨️┃短劇┃星星",
    "type": 3,
    "api": "csp_ShortXingya",
    "genre": "shortdrama"
},
{
    "key": "ShortQimao",
    "name": "♨️┃短劇┃七猫",
    "type": 3,
    "api": "csp_ShortQimao",
    "genre": "shortdrama"
},
{
    "key": "河马短剧",
    "name": "♨️┃短劇┃河马",
    "type": 3,
    "api": "csp_ShortHema",
    "genre": "shortdrama"
},
{
    "key": "csp_Kugouyy",
    "name": "🎷┃酷狗┃音乐",
    "type": 3,
    "api": "csp_Kugou",
    "ext": {
    "classes": [{"type_name": "酷狗","type_id": "kugou"}]}
},
{
    "key": "csp_BiliMV",
    "name": "🎺┃哔哩┃音乐",
    "type": 3,
    "api": "csp_Bili",
    "ext": {
    "json": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@master/TS/音乐.json",
    "cookie": "http://127.0.0.1:9978/file/TVBox/bili_cookie.txt"}
},
{
    "key": "csp_Djlh",
    "name": "📻┃车载┃音乐",
    "type": 3,
    "api": "csp_Djlh",
    "indexs" : 0
},
{
    "key": "QingtingFM",
    "name": "📻┃蜻蜓┃FM",
    "type": 3,
    "api": "csp_QingtingFM",
    "indexs" : 0
},
{
    "key": "TingJinxia",
    "name": "🖼️┃堇夏┃听书",
    "type": 3,
    "api": "csp_TingJinxia",
    "ext": "https://m.ting15.com"
},
{
    "key": "AppLY",
    "name": "🌈┃戏曲┃多多",
    "type": 3,
    "api": "csp_AppLY",
    "indexs" : 0
},
{
    "key": "咖啡体育",
    "name": "⚽┃咖啡┃体育",
    "type": 3,
    "api": "csp_SportsKafei",
    "indexs" : 0
},
{
    "key": "球通体育",
    "name": "⚽┃球通┃体育",
    "type": 3,
    "api": "csp_SportsQiutong",
    "indexs" : 0
},
{
    "key": "喵呜动漫",
    "name": "💮┃喵呜┃动漫",
    "type": 3,
    "api": "csp_MiaoWu"
},    
{
    "key": "csp_MoDu",
    "name": "💮┃魔都┃动漫",
    "type": 3,
    "api": "csp_MoDu"
},
{
    "key": "csp_番薯",
    "name": "💮┃番薯┃动漫",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "url": "https://new.app.bytegooty.com",
    "dataKey": "N4yj7l7xKxHF4*gz",
    "dataIv": "N4yj7l7xKxHF4*gz"}
},
{
    "key": "csp_咕咕动漫",
    "name": "💮┃咕咕┃动漫",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "url": "https://www.gugu3.com",
    "dataKey": "nKfZ8KX6JTNWRzTD",
    "dataIv": "nKfZ8KX6JTNWRzTD"}
},
{
    "key": "csp_方舟动漫",
    "name": "💮┃方舟┃动漫",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "url": "https://www.cyfz.top",
    "dataKey": "e72cdfd629e8895d",
    "dataIv": "e72cdfd629e8895d"}
},
{
    "key": "csp_漫国动漫",
    "name": "💮┃漫国┃动漫",
    "type": 3,
    "api": "csp_AppSy",
    "ext": {
    "url": "http://114.66.27.208:806",
    "siteKey": "rectangleadsadxa",
    "listKey": "aassddwwxxllsx1x",
    "parsesKey": "aassddwwxxllsx1x"}
},
{
    "key": "peizi",
    "name": "💼┃综合┃配置",
    "type": 3,
    "api": "csp_Config",
    "indexs": 0
},
{
    "key": "本地",
    "name": "💼┃本地┃视频",
    "type": 3,
    "api": "csp_LocalFile"
},
{
    "key": "Wogg",
    "name": "💯┃玩偶┃4K臻享",
    "type": 3,
    "api": "csp_Wogg",
    "ext": {
    "site": [
    "https://www.wogg.net",
    "https://wogg.xxooo.cf",
    "https://woggpan.xxooo.cf"]}
},
{
    "key": "至臻",
    "name": "💯┃至臻┃4K臻享",
    "type": 3,
    "api": "csp_PanWebShare",
    "ext": {
    "site": [
    "https://mihdr.top",
    "https://www.miqk.cc",
    "https://www.mihdr.top"]}
},
{
    "key": "木偶",
    "name": "💯┃木偶┃4K臻享",
    "type": 3,
    "api": "csp_PanWebShare",
    "ext": {
    "site": [
    "https://123.666291.xyz",
    "https://666.666291.xyz",
    "https://www.muou.site",
    "https://www.muou.asia"]}
},
{
    "key": "蜡笔",
    "name": "💯┃蜡笔┃4K臻享",
    "type": 3,
    "api": "csp_PanWebShare",
    "ext": {
    "site": [
    "http://www.xiaocgege.shop",
    "http://xiaocge.fun",
    "http://feimo.fun",
    "http://xiaocgege.shop"]}
},
{
    "key": "多多",
    "name": "💯┃多多┃4K臻享",
    "type": 3,
    "api": "csp_PanWebShare",
    "ext": {
    "site": [
    "https://tv.yydsys.top",
    "https://tv.yydsys.cc",
    "https://tv.214521.xyz"]}
},
{
    "key": "二小",
    "name": "💯┃二小┃4K臻享",
    "type": 3,
    "api": "csp_PanWebShare",
    "ext": {
    "site": [
    "https://www.2xiaopan.top",
    "https://2xiaopan.top",
    "https://www.erxiaozhan.top",
    "https://www.2xiaozhan.top",
    "https://wexwp.cc"]}
},
{
    "key": "虎斑",
    "name": "💯┃虎斑┃4K臻享",
    "type": 3,
    "api": "csp_PanWebShare",
    "ext": {
    "site": ["http://38.76.197.172:16969"]}
},
{
    "key": "移动",
    "name": "💯┃移动┃4K臻享",
    "type": 3,
    "api": "csp_Yidong4K",
    "indexs": 0
},
{
    "key": "dr_腾迅",
    "name": "🆚┃騰訊┃ TV",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/libs/drpy2.min.js",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/TS/QQtv.js"
},
{
    "key": "dr_芒果",
    "name": "🆚┃芒果┃ TV",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/libs/drpy2.min.js",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/TS/MGtv.js"
},
{
    "key": "dr_奇异",
    "name": "🆚┃奇藝┃ TV",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/libs/drpy2.min.js",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/TS/AQItv.js"
},
{
    "key": "dr_优酷",
    "name": "🆚┃優酷┃ TV",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/libs/drpy2.min.js",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/TS/yKtv.js"
},
{
    "key": "dr_哔哩视频",
    "name": "🆚┃嗶哩┃ TV",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/libs/drpy2.min.js",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/TS/bili.js"
 },
 {
    "key": "dr_搜狗",
    "name": "🆚┃搜狗┃ TV",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/libs/drpy2.min.js",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/TS/SGtv.js"
},
{
    "key": "liuliys",
    "name": "🇨🇳┣☪琉✿璃┫专用",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/TS/琉璃.js",
    "indexs": 0
},
{
    "key": "csp_Market",
    "name": "🇨🇳┣☪版✿本┫信息",
    "type": 3,
    "api": "csp_Market",
    "indexs": 0,
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/lib/single.png"
}
],
"parses": [	
{
    "name" : "YYNB高清",
    "type" : 1,
    "url" : "https://json.cfysoft.cc/api/?key=db40a4b2f15c4078301a068181bb2724&url="
},
{
    "name": "虾米高清",
    "type": 0,
    "url": "https://jx.hls.one/?url="
},
{
    "name": "推荐",
    "type": 0,
    "url": "https://pl.a6club.com/player/analysis.php?v="
},
{
    "name": "豆豆",
    "type": 1,
    "url": "https://test1.12321app.com/api.php?url="
},
{
    "name": "土豆",
    "type": 1,
    "url": "https://test1.12321app.com/daoliansiquanjia.php?url="
},
{
    "name": "冰豆",
    "type": 0,
    "url": "https://bd.jx.cn/?url="
},
{
    "name":"咸鱼",
    "type" : 0,
    "url" : "https://jx.xymp4.cc/?url="
},
{
    "name": "菠萝",
    "type": 0,
    "url": "https://www.playm3u8.cn/jiexi.php?url="
},
{
    "name":"狗子",
    "type":0,
    "url":"http://www.ckplayer.vip/jiexi/?url="
},
{
    "name": "淘片",
    "type": 0,
    "url": "https://jx.yparse.com/index.php?url="
},
{
    "name":"云海",
    "type":0,
    "url": "https://yparse.ik9.cc/index.php?url="
},
{
    "name": "8090",
    "type": 0,
    "url": "https://www.8090g.cn/?url="
},
{
    "name": "七七",
    "type": 0,
    "url": "https://jx.77flv.cc/?url="
},
{
    "name": "臻享",
    "type": 1,
    "url": "https://150.138.78.37:4399/api?key=94b07e0b2c0e8244&url="
},
{
    "name": "优选",
    "type": 1,
    "url": "http://1.94.221.189:88/algorithm.php?url="
},
{
    "name": "🏁琉芸★内部嗅探★",
	"type": 0,
    "url": "https://jx.xmflv.com/?url="
}],
	
"flags":["youku","qq","QQ","iqiyi","qiyi","letv","sohu","pptv","PPTV","mgtv","wasu","bilibili","m1905","seven","m78","mtv","sjs","dbs","yds","HNB","JL4K"],
	
"lives": [
{
    "name": "📺芸芸直播",
    "type": 0,
    "url": "https://d.kstore.dev/download/12194/芸直播.txt",
    "epg": "https://epg.112114.eu.org/?ch={name}&date={date}",
    "logo": "https://epg.112114.eu.org/logo/{name},png"
}],
"ads": ["wan.51img1.com","iqiyi.hbuioo.com","vip.ffzyad.com"]}
