{
  /*-----------------------JAR包接口&壁纸接口(可替换)-----------------------*/
  "spider": "https://gitee.com/lyun_1_0/TS/raw/main/JAR/MS.jar;md5;C973359B18202A6193E1241F02E0788A",
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
    "name": "🎬┣公告┫09.24",
    "type": 3,
    "api": "csp_Notice",
    "jar": "https://gitee.com/lyun_1_0/tb/raw/master/liuli.php",
    "ext": "https://gitee.com/lyun_1_0/tb/raw/master/公告.php"
},
{
    "key": "csp_天堂",
    "name": "⛪┃影視┃天堂",
    "type": 3,
    "api": "csp_AppYsV2",
    "ext": "http://39.105.18.5:5565/api.php/app/"
},
{
    "key": "csp_py_大马猴",
    "name": "🦓┃影視┃马猴",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/XB/马猴.py",
    "indexs": 0
},
{
    "key": "csp_py_厂长",
    "name": "🚂┃影視┃厂长",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/XB/厂长.py",
    "indexs": 0
},
{
    "key": "剧下饭",
    "name": "🍚┃影視┃下饭",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/XB/下饭.py"
},
{
    "key": "csp_半岛",
    "name": "🌅┃影視┃半岛",
    "type": 3,
    "api": "csp_Bdjmcc",
    "indexs": 0
},
{
    "key": "csp_韩圈",
    "name": "🌼┃影視┃韩圈",
    "type": 3,
    "api": "csp_Hxq",
    "indexs": 0
},
{
    "key": "csp_搜剧AI",
    "name": "📺┃影視┃搜剧",
    "type": 3,
    "api": "csp_SouJu",
    "indexs": 0
},
{
    "key": "csp_咕噜",
    "name": "🍩┃影視┃咕噜",
    "type": 3,
    "api": "csp_Gulu",
    "indexs": 0
},
{
    "key": "csp_农民",
    "name": "🌾┃影視┃农民",
    "type": 3,
    "api": "csp_Wwys",
    "ext": "https://vip.wwgz.cn:5200"
},
{
    "key": "csp_热播",
    "name": "🎊┃影視┃热播",
    "type": 3,
    "api": "csp_AppRJ",
    "ext": {"url": "http://v.rbotv.cn"}
},
{
    "key": "csp_一起看",
    "name": "🏵┃影視┃奈菲",
    "type": 3,
    "api": "csp_AppYQK",
    "indexs": 0
},
{
    "key": "csp_独播",
    "name": "🎯┃影視┃独播",
    "type": 3,
    "api": "csp_Duboku",
    "indexs": 0
},
{
    "key": "csp_飞娱",
    "name": "🍬┃影視┃飞娱",
    "type": 3,
    "api": "csp_Feiyu",
    "indexs": 0
},
{
    "key": "csp_瓜子",
    "name": "🥑┃影視┃瓜子",
    "type": 3,
    "api": "csp_Gz360",
    "indexs": 0
},
{
    "key": "csp_文才",
    "name": "✏️┃影視┃文才",
    "type": 3,
    "api": "csp_Jpys",
    "ext": "https://y2s52n7.com"
},
{
    "key": "csp_骚火",
    "name": "🌋┃影視┃骚火",
    "type": 3,
    "api": "csp_SaoHuo",
    "ext": "https://shdy5.us"
},
{
    "key": "csp_Web1905",
    "name": "🎞┃影視┃老片",
    "type": 3,
    "api": "csp_Web1905",
    "indexs" : 0
},
{
    "key": "csp_哔哩视频",
    "name": "✨┃哔哩┃视频",
    "type": 3,
    "api": "csp_BiliYS",
    "indexs": 0
},
{
    "key": "爱看机器人",
    "name": "🧿┃爱看┃机器",
    "type": 3,
    "api": "csp_Ikanbot",
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
    "key": "葫芦",
    "name": "🌓┃葫芦┃APP",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/TS/Qi.js",
    "ext": {
    "host": "http://v12-1-hulucms.nmgzxrl.com",
    "key": "8R33VQSxzmCaHpEX",
    "ua": "okhttp/3.10.0",
    "init": "V122",
    "api": 2}
},
{
    "key": "蓝鸟",
    "name": "🐦┃蓝鸟┃APP",
    "type": 3,
    "api": "csp_AppQi",
    "ext": {
    "url": "http://103.217.190.91:7788",
    "dataKey": "oW5UxZ5kWVr1DI69",
    "dataIv": "oW5UxZ5kWVr1DI69",
    "init": "initV122",
    "ua": "okhttp/3.10.0"}
},
{
    "key": "csp_蓝鹰",
    "name": "🦅┃蓝鹰┃APP",
    "type": 3,
    "api": "csp_AppQi",
    "ext": {
    "url": "http://103.217.190.91:5566",
    "dataKey": "hagYExMdMkeWfemK",
    "dataIv": "hagYExMdMkeWfemK",
    "init": "initV122",
    "ua": "okhttp/3.10.0"}
},
{
    "key": "云朵",
    "name": "☁┃云朵┃APP",
    "type": 3,
    "api": "csp_YunDuo",
    "ext": {
    "host": "https://323433ssdfd.top",
    "finger": "WF-2c064bc5b3400788f31b848849bc3a60f835423ba2dfe69d7ea93974c216e4f2",
    "aid": "com.web.player",
    "sk": "WEB-50a8e9c84a1dc05669a692ded99a2dac46527229e607a7be15db88dbc59059d1",
    "client": "8f3d2a1c7b6e5d4c9a0b1f2e3d4c5b6a",
    "sign": "ddtvf65f3a83d6d9ad6f"}
},
{
    "key": "小鹿",
    "name": "🦌┃小鹿┃APP",
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
    "name": "🤵┃王子┃APP",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "url": "https://app.95112475.xyz",
    "dataKey": "5a9w6x58dsq6z3a6",
    "dataIv": "5a9w6x58dsq6z3a6"}
},
{
    "key": "魔方",
    "name": "👾┃魔方┃APP",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "url": "https://www.douy32mf.top",
    "dataKey": "1234567887654321",
    "dataIv": "1234567887654321"}
},
{
    "key": "世界",
    "name": "🗺┃世界┃APP",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "url": "https://appcms.4ksj.app",
    "dataKey": "O3K6rYx75Q4xtiIE",
    "dataIv": "O3K6rYx75Q4xtiIE"}
},
{
    "key": "茉莉",
    "name": "🌼┃茉莉┃APP",
    "type": 3,
    "api": "csp_AppGet",
    "ext": {
    "site": "https://allinadmin.oss-cn-hangzhou.aliyuncs.com/bk/9.txt",
    "dataKey": "88689667dce61725",
    "dataIv": "88689667dce61725"}
},
{
    "key": "csp_banriys",
    "name": "🌗┃半日┃APP",
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
    "name": "💞┃剧圈┃APP",
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
    "key": "csp_huayi",
    "name": "🏵┃華誼┃APP",
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
    "key": "橘汁",
    "name": "🍋┃橘汁┃APP",
    "type": 3,
    "api": "csp_AppDrama",
    "ext": {
    "appName": "橘汁",
    "publicKey": "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr8SzZhjYy+rsya1K09t8d2K50pWFoBkgUqMpKOiW+3IEVKd4eTdvg9RSOjQ82kypL6R9BnsmrS1V8s4PVDwjQbUtYhTPPC9Hz16qY7rpD6m0d2vr09/UpWQ5uOy9PR0QTrsioveZ+DIe9jc3C+zBCu/kZSY/R8stwJoiitki3gwIDAQAB",
    "dataKey": "OW1WBLFZCLJ0WTNJQMRSZ2DYSGNBPT0=",
    "dataIv": "OC1A06E197EF10CF3F6058CA7A803B5E",
    "pkg": "com.mxj.wylcjbxyx",
    "host": "",
    "site": "https://123-1349250429.cos.ap-shanghai.myqcloud.com/app.txt",
    "version": "3.0.2.4",
    "decrypt": "1"}
},
{
    "key": "csp_苹果",
    "name": "🍏┃苹果┃APP",
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
    "key": "maitian",
    "name": "🌾┃麥田┃秒播",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/XYQ/麥田.php",
    "indexs": 0
},
{
    "key": "fengyei",
    "name": "🍁┃枫叶┃秒播",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/XYQ/枫叶.php",
    "indexs": 0
},
{
    "key": "fantuan",
    "name": "🍙┃饭团┃影院",
    "type":3,
    "api": "csp_XBPQ",
    "ext": "https://testingcf.jsdelivr.net/gh/LIUJEI/TB@master/XYQ/饭团.php"
},
{
    "key": "柠檬视频",
    "name": "🍋┃柠檬┃视频",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {
    "请求头": "User-Agent$MOBILE_UA",
    "编码": "UTF-8",
    "主页url": "https://nmsp5.cc/",
    "数组": "/video/&&</a>",
    "标题": "title=\"&&\"",
    "图片": "data-src=\"&&\"",
    "副标题": "🌲+item-note\">&&<",
    "链接": "/video/+&&\"",
    "跳转播放链接": "urlDecode(var player_*\"url\":\"&&%26)",
    "分类": "电影$dianying#电视剧$juji#短剧$duanju#综艺$zongyi#动漫$dongman#纪录片$jilupian",
    "分类url": "https://nmsp5.cc/show-{cateId}-{area}-{by}-{class}-----{catePg}---{year}/",
    "简介": "introduction-content\">&&</div>"}
},
{
    "key": "csp_xBPQ_看影网",
    "name": "🍀┃看影┃影视",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&</div>",
    "请求头": "User-Agent$MOBILE_UA",
    "编码": "UTF-8",
    "主页url": "https://www.kanyingt.com/",
    "数组": "class=\"myui-vodlist__box\"&&</a>",
    "图片": "data-original=\"&&\"",
    "分类url": "https://www.kanying.pro/so/{cateId}/{area}---{lang}----{catePg}---{year}",
    "链接": "href=\"&&\"",
    "分类": "电影$movie#电视剧$tv#综艺$variety#动漫$anime"}
},
{
    "key": "cyings",
    "name": "🍀┃奔驰┃秒播",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {
    "简介": "<p class=\"col-pd\">&&</p>",
    "跳转播放链接": "var player_*\"url\":\"&&\"",
    "分类url": "https://www.ccttv1.cc/video/{cateId}/area/{area}/by/{by}/class/{class}/page/{catePg}/year/{year}/",
    "分类": "电影&连续剧&综艺&动漫&爽文短剧&伦理片",
    "分类值": "dianying&lianxuju&zongyi&dongman&shuangwenduanju&lunlipian"}
},
{
    "key": "csp_XBPQ_zhuijuba",
    "name": "🍀┃追剧┃影视",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&</div>",
    "分类url": "https://zjuba.vip/index.php/vod/show/id/{cateId}/page/{catePg}.html",
    "分类": "全部$0#电影$1#电视剧$2#综艺$3#动漫$4#更新$new"}
},
{
    "key": "熊猫影视",
    "name": "🍀┃熊猫┃影视",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&</div>",
    "分类url": "https://www.xiongmaoysa.com/s/{cateId}/area/{area}/class/{class}/page/{catePg}/year/{year}.html",
    "分类": "电影$dianying#电视剧$lianxuju#综艺$zongyi#动漫$dongman"}
},
{
    "key": "晨光电影",
    "name": "🍀┃晨光┃电影",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {
    "简介": "剧情介绍: +white-space: initial;\">&&</div>",
    "数组": "fed-list-item fed-padding fed-col-xs4 fed-col-sm3 fed-col-md2\">&&</li>",
    "图片": "data-original=\"&&\"",
    "标题": "fed-visible fed-part-eone\" href=*>&&</a>",
    "副标题": "fed-text-white fed-text-center\">&&</span>",
    "线路数组": "fed-drop-btns fed-padding fed-col-xs3 fed-col-md2\">&&</li>",
    "分类url": "https://www.cgdyw.net/s/{cateId}/area/{area}/page/{catePg}/year/{year}.html",
    "分类": "短剧$duanju#电视剧$lianxuju#电影$dianying#动漫$dongman#综艺$zongyi"}
},
{
    "key": "映像星球",
    "name": "🍀┃映像┃星球",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&",
    "请求头": "User-Agent$MOBILE_UA",
    "编码": "UTF-8",
    "分类url": "https://www.yxxq32.cc/top/{cateId}--------{catePg}---.html",
    "分类": "电影$1#连续剧$2#综艺$3#动漫$41#短剧$6#"}
},
{
    "key": "面包网",
    "name": "🍀┃面包┃影视",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&",
    "请求头": "User-Agent$MOBILE_UA",
    "编码": "UTF-8",
    "分类url": "https://v.aiwule.com/vodshow/{cateId}-{area}-{by}-{class}-{lang}-{letter}---{catePg}---{year}.html",
    "分类": "电影$20#电视剧$21#动漫$23#综艺$22#短剧$47",
    "线路数组": "hl-tabs-btnhl-slide-swiper&&</a >",
    "线路标题": "琉芸专属"}
},
{
    "key": "csp_xBPQ_app影视",
    "name": "🍀┃影院┃APP",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {
    "简介": "stui-content__desc col-pd clearfix\">&&</div>",
    "分类url": "https://www.appmovie.cc/index.php/vod/show/area/{area}/{year}/class/{class}/id/{cateId}/page/{catePg}.html",
    "分类": "电影$1#连续剧$2#动漫$4#综艺$3"}
},
{
    "key": "xbpq_爱看高清",
    "name": "🍀┃爱看┃高清",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&</div>",
    "分类url": "https://www.ikanbd.com/s/{cateId}-{area}-{by}------{catePg}---{year}.html",
    "分类": "电影$movie#连续剧$series#动漫$anime#综艺$variety#动画片$animation#纪录片$documentary#电影解说$jieshuo#网络短剧$skit#体育$sports",
    "嗅探词": ".m3u8#.m3u8?#v3.huoshanvod.com#v3-dy-o.zjcdn#sf16-sg.larksuitecdn.com#v.kd1.qq.com#.mp4#video_mp4",
    "过滤词": "/hls/#php"}
}, 
{
    "key": "csp_xBPQ_水牛影视",
    "name": "🍀┃水牛┃影视",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&",
    "分类url": "https://www.cdqyg.com/vodtype/1/area/{area}/by/{by}/class/{class}/id/{cateId}/page/{catePg}/year/{year}.html",
    "分类": "电影$1#电视剧$2#动漫$4#综艺$3#私密$20"}
},  
{
    "key": "csp_biubiu_酷云影院",
    "name": "🍀┃酷云┃影院",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&</div>",
    "分类url": "https://kuyun123.com/type/1/area/{area}/by/{by}/class/{class}/id/{cateId}/page/{catePg}/year/{year}.html",
    "分类": "电影$1#剧集$2#动漫$4#综艺$30#伦理$20"}
},  
{
    "key":"csp_看戏网",
    "name":"🍀┃看戏┃网剧",
    "type":3,
    "api":"csp_XBPQ",
    "ext": {"简介": "&&</div>",
    "请求头":"User-Agent$MOBILE_UA",
    "编码":"UTF-8",
    "分类url":"https://www.kanxiw.com/tags/{cateId}-{area}-{by}-{class}-{lang}-{letter}---{catePg}---{year}.html",
    "分类":"看戏网$0#电影$1#电视剧$2#综艺$3#动漫$4",
    "线路数组":"hl-tabs-btnhl-slide-swiper&&&&<"}
},
{
    "key": "秀儿影视",
    "name": "🍀┃秀儿┃影视",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&",
    "分类url": "https://www.ipianba.com/class/{cateId}-{area}-{by}--{lang}----{catePg}---{year}.html",
    "分类":"电影$1#剧集$2#动漫$3#综艺$4"}
},
{
    "key": "枫林纲影院",
    "name": "🍀┃枫林┃影视",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介": "&&",
    "请求头": "User-Agent$MOBILE_UA",
    "编码": "UTF-8",
    "分类": "电影$1#电视剧$2#综艺$3#动漫$4",
    "分类url": "https://imaple8.co/type/{cateId}-{catePg}.html"}
},
{
    "key": "VIP影视",
    "name": "🍀┃永久┃影视",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {"简介" :"detail-content\" style=*>&&</span>",
    "首页":"0",
    "副标题":"🌲+pic-text text-right\">&&</span>",
    "分类url":"https://www.vipdy.vip/s/{cateId}-{area}--{class}-----{catePg}---{year}.html",
    "分类":"短剧$duanju#电视剧$juji#电影$dianying#动漫$dongman#综艺$zongyi#福利$fulipian"}
},
{ 
    "key": "csp_539影视", 
    "name": "🍀┃维嘉┃影视", 
    "type":3,
    "api":"csp_XBPQ",
    "ext": {"简介":"detail-content\" style=*>&&",
    "分类url":"https://www.539539.xyz/index.php/vod/show/area/{area}/class/{class}/id/{cateId}/page/{catePg}/year/{year}.html",
    "分类":"全部$0#短剧$25#电视剧$2#电影$1#动漫$4#综艺$3#伦理$26"}
},
{
    "key": "秒映短剧",
    "name": "♨️┃短劇┃秒映",
    "type": 3,
    "api": "csp_XBPQ",
	"jar": "https://gitee.com/lyun_1_0/TS/raw/main/JAR/MX.jar",
    "ext": {
    "作者": "冰水",
    "站名": "秒映短剧260529",
    "请求头": "User-Agent$MOBILE_UA",
    "编码": "UTF-8",
    "主页url": "https://halebot.com/",
    "首页": "120",
    "起始页": "1",
    "分类url": "https://www.halebot.com/search.php?page={catePg}&searchtype=5&order={by}&tid={cateId}&area=&year={year}&letter=&yuyan=&state=&money=&ver=&jq=;;mrc",
    "分类": "重生$1#穿越$2#爽剧$3#言情$4#都市$5#古装$6#悬疑$7#剧情$8",
    "二次截取": "",
    "数组": "p:.fed-lazy",
    "标题": "p:-\u003Etitle",
    "副标题": "p:.fed-text-center-\u003Etext",
    "图片": "p:-\u003Edata-original",
    "链接": "p:-\u003Ehref",
    "影片年代": "年份：&&\u003C/p",
    "影片地区": "地区：&&\u003C/p",
    "影片类型": "类型：&&\u003C/p",
    "状态": "状态：&&\u003C/p",
    "导演": "👨‍🎤+导演：&&\u003C/p",
    "主演": "👩🏻‍🎤+主演：&&\u003C/p",
    "简介": "简介：&&\u003C/p",
    "线路二次截取": "",
    "线路数组": "p:.nav-tabs.active li",
    "线路标题": "p:-\u003Etext",
    "播放数组": "p:.myui-content__list",
    "播放列表": "p:a",
    "播放标题": "p:-\u003Etext",
    "播放链接": "p:-\u003Ehref",
    "嗅探词": ".mp4#.m3u8",
    "倒序": "0",
    "跳转播放链接": "var now=\"&&\"",
    "搜索请求头": "User-Agent$MOBILE_UA",
    "搜索url": "https://halebot.com/search.php?page={pg}&searchword={wd}&searchtype=",
    "排序": "最新上映&超高人气&全网热播&高分好评",
    "排序值": "time&hit&commend&score",
    "筛选": "1"}
}, 
{
    "key": "河马短剧",
    "name": "♨️┃短劇┃河马",
    "type": 3,
    "api": "csp_XBPQ",
	"jar": "https://gitee.com/lyun_1_0/TS/raw/main/JAR/MX.jar",
    "ext": {"简介": "&&",
    "请求头": "User-Agent$MOBILE_UA",
    "编码": "UTF-8",
    "分类": "青春$1170#女帝$1165#民国$839#萌宝$1175#超能$442#甜宠$462#豪门恩缘$585#反派$1166#求生$1162#寻亲$1162#读心术$1144-1172#律证$1427#动漫$1649#职厂商战$943#古装仙侠$1102#权谋$840-1101#青媒竹马$1185",
    "分类url": "https://www.kuaikaw.cn/browse/{cateId}/{catePg}"}
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
    "json": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/TS/音乐.json",
    "cookie": "http://127.0.0.1:9978/file/TVBox/bili_cookie.txt"}
},
{
    "key": "csp_kwms",
    "name": "🎷┃酷我┃音乐",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/TS/kuwo.py",
    "indexs" : 0
},
{
    "key": "csp_tinghyy",
    "name": "🎷┃听海┃音乐",
    "type": 3,
    "api": "https://testingcf.jsdelivr.net/gh/LIUJEI/TS@main/TS/tinghai.js",
    "indexs" : 0
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
    "api": "csp_App99",
    "ext": {
    "host": "http://111.180.139.119:19987/app/bn",
    "LoginPath": "/app/log",
    "appkey": "f66f65db127e48449f073c2c6eb0f993",
    "versionName": "6.4.9",
    "name": "双子星动漫",
    "package": "com.haiwang.liangxia.my.ym",
    "buildNumber": "2001",
    "buildSignature": "A40DA80A59D170CAA950CF15C18C454D47A39B26989D8B640ECD745BA71BF5DC"}
},    
{
    "key": "csp_MoDu",
    "name": "💮┃魔都┃动漫",
    "type": 3,
    "api": "csp_XBPQ",
    "ext": {
    "请求头": "User-Agent$MOBILE_UA#Accept$text/html#accept-language$zh-CN,zh;q=0.8",
    "分类url": "https://dmbus.cc/show-{cateId}--{by}-{class}--{year}-{catePg}.html",
    "分类": "国漫$1#日漫$2#欧美动漫$3#电影$4",
    "数组": "class=\"item\"\u003E&&\u003C/li\u003E",
    "简介": "剧情：&&\u003C/p\u003E",
    "标题": "title=\"&&在线观看\"",
    "副标题": "desc\"\u003E&&\u003C/span\u003E",
    "图片": "data-bg=\"&&\"",
    "搜索url": "https://dmbus.cc/s----------.html?wd={wd}",
    "倒序": "1"}
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
    "name": "💯┃玩偶┃4K",
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
    "name": "💯┃至臻┃4K",
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
    "name": "💯┃木偶┃4K",
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
    "name": "💯┃蜡笔┃4K",
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
    "name": "💯┃多多┃4K",
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
    "name": "💯┃二小┃4K",
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
    "name": "💯┃虎斑┃4K",
    "type": 3,
    "api": "csp_PanWebShare",
    "ext": {
    "site": ["http://38.76.197.172:16969"]}
},
{
    "key": "花卷真彩",
    "name": "💯┃花卷┃4K",
    "api": "csp_HJZhenCai",
    "type": 3,
    "ext": {
    "site": ["https://www.hjzhencai.top"]}
},
{
    "key": "dr_腾迅",
    "name": "🆚┃騰訊┃ TV",
    "type": 3,
    "api": "https://gitee.com/lyun_1_0/TS/raw/main/libs/drpy2.js",
    "ext": "https://gitee.com/lyun_1_0/TS/raw/main/TS/QQtv.js"
},
{
    "key": "dr_芒果",
    "name": "🆚┃芒果┃ TV",
    "type": 3,
    "api": "https://gitee.com/lyun_1_0/TS/raw/main/libs/drpy2.js",
    "ext": "https://gitee.com/lyun_1_0/TS/raw/main/TS/MGtv.js"
},
{
    "key": "dr_奇异",
    "name": "🆚┃奇藝┃ TV",
    "type": 3,
    "api": "https://gitee.com/lyun_1_0/TS/raw/main/libs/drpy2.js",
    "ext": "https://gitee.com/lyun_1_0/TS/raw/main/TS/AQItv.js"
},
{
    "key": "dr_优酷",
    "name": "🆚┃優酷┃ TV",
    "type": 3,
    "api": "https://gitee.com/lyun_1_0/TS/raw/main/libs/drpy2.js",
    "ext": "https://gitee.com/lyun_1_0/TS/raw/main/TS/yKtv.js"
},
{
    "key": "dr_哔哩视频",
    "name": "🆚┃嗶哩┃ TV",
    "type": 3,
    "api": "https://gitee.com/lyun_1_0/TS/raw/main/libs/drpy2.js",
    "ext": "https://gitee.com/lyun_1_0/TS/raw/main/TS/bili.js"
 },
 {
    "key": "dr_搜狗",
    "name": "🆚┃搜狗┃ TV",
    "type": 3,
    "api": "https://gitee.com/lyun_1_0/TS/raw/main/libs/drpy2.js",
    "ext": "https://gitee.com/lyun_1_0/TS/raw/main/TS/SGtv.js"
},
{
    "key": "liuliys",
    "name": "🇨🇳┣☪琉✿璃┫专用",
    "type": 3,
    "api": "https://gitee.com/lyun_1_0/tb/raw/master/琉璃.js",
    "indexs": 0
},
{
    "key": "csp_Market",
    "name": "🇨🇳┣☪版✿本┫信息",
    "type": 3,
    "api": "csp_Market",
    "indexs": 0,
    "ext": "https://gitee.com/lyun_1_0/tb/raw/master/single.png"
}
],
"parses": [	
{
    "name": "闪电",
    "type": 4,
    "url": "https://bfq.txnp.cn/excessive?url="
},
{
    "name": "解析1",
    "type": 1,
    "url": "http://8.134.205.252:39466/ceshi/cs.php?key=udk&url="
},
{
    "name": "解析2",
    "type": 1,
    "url": "https://test1.12321app.com/daoliansiquanjia.php?url="
},
{
    "name": "解析3",
    "type": 1,
    "url": "http://nsys.hundong.xyz/api/?key=EdG87gW0IDYarx9ry5&url="
},
{
    "name": "解析4",
    "type": 1,
    "url": "https://json.xophp.com/api/?key=5492ef7d5a1646338426e2f45b8c8e0d&url="
},         
{
    "name": "解析5",
    "type": 1,
    "url": "https://player.gimy.bot/u/parse.php?url="
},
{
    "name": "解析6",
    "type": 1,
    "url": "http://global.apirun.xn--vsqw5hh18a8vw.com:2025/api/?key=63c856aac8b205a5cb972ae8950cfd78&url="
},
 {
            "name": "💝分享者解析✾",
            "type": 1,
            "url": "https://api.jxapi.cc/api/?key=6e4acf058180b58cbdb0106aa5cdb1e2&url="
        },
        {
            "name": "💝分享者解析❂",
            "type": 1,
            "url": "https://api.huaqi.pro/api/?key=5bd0db7c858ba9f999373450f3651af7&url="
        },
        {
            "name": "💝分享者解析✻",
            "type": 1,
            "url": "http://111.170.140.70:1332/?url="
        },
        {
            "name": "💝分享者解析✸",
            "type": 1,
            "url": "http://jiexi.69mini.com/api/?key=5cc632accf2f4b27a417b89c8edf69c7&url="
        },
        {
            "name": "💝分享者解析✺",
            "type": 1,
            "url": "http://111.170.140.70:1332/?url="
        },
	
	{
            "name": "💝分享者解析-",
            "type": 0,
            "url": "https://jx.2s0.cn/player/?url="
        },
	{"name":"💝分享者解析+",
        "type":0,
        "url":"https://yparse.ik9.cc/index.php?url=",
        "ext":{
        "header":{"user-agent":"Mozilla/5.0(Linux;Android13;V2049ABuild/TP1A.220624.014;wv)AppleWebKit/537.36(KHTML,likeGecko)Version/4.0Chrome/116.0.0.0MobileSafari/537.36"
                }
            }
        },  
      {
      "name": "💝分享者解析",
      "type": 0,
      "url": "https://jx.yparse.com/index.php?url=",
      "ext": {
        "header": {
          "user-agent": "Mozilla/5.0 (Linux; Android 13; V2049A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36"
        }
      }
    },
       
    
    {
            "name": "💖分享者解析1",
            "type": 1,
            "url": "http://shybot.top/v2/video/jx/?shykey=4595a71a4e7712568edcfa43949236b42fcfcb04997788ebe7984d6da2c6a51c&url=",
            "ext": {
                "flag": [
                    "qq",
                    "腾讯",
                    "qiyi",
                    "爱奇艺",
                    "奇艺",
                    "youku",
                    "优酷",
                    "sohu",
                    "搜狐",
                    "letv",
                    "乐视",
                    "mgtv",
                    "芒果",
                    "tnmb",
                    "seven",
                    "bilibili",
                    "1905",
                    "QD4K",
                    "iyf",
                    "duanju",
                    "gzcj",
                    "GTV",
                    "GZYS",
                    "weggz",
                    "Ace"
                ],
                "header": {
                    "User-Agent": "okhttp/4.9.1"
                }
            }
        },
  
  {
            "name": "💕分享者AI1",
            "type": 1,
            "url": "https://zy.qiaoji8.com/neibu.php?url=",
            "ext": {
                "flag": [
                    "qq",
                    "腾讯",
                    "qiyi",
                    "爱奇艺",
                    "奇艺",
                    "youku",
                    "优酷",
                    "sohu",
                    "搜狐",
                    "letv",
                    "乐视",
                    "mgtv",
                    "芒果",
                    "tnmb",
                    "seven",
                    "bilibili"
                ],
                "header": {
                    "User-Agent": "okhttp/4.9.1"
                }
            }
        },
          {
            "name": "💕分享者AI2",
            "type": 1,
            "url": "https://zy.qiaoji8.com/gouzi.php?url=",
            "ext": {
                "flag": [
                    "qq",
                    "腾讯",
                    "qiyi",
                    "爱奇艺",
                    "奇艺",
                    "youku",
                    "优酷",
                    "sohu",
                    "搜狐",
                    "letv",
                    "乐视",
                    "mgtv",
                    "芒果",
                    "tnmb",
                    "seven",
                    "bilibili",
                    "1905",
                    "NetFilx"
                ],
                "header": {
                    "User-Agent": "okhttp/4.9.1"
                }
            }
        },
         

          
{
      "name": "💕分享者嗅探",
      "type": 0,
      "url": " https://jx.789jiexi.net:4433/?url="
    },
    {
      "name": "💕分享者嗅探*",
      "type": 0,
      "url": "http://154.44.26.196/player/qu.php?v="
    },
{
            "name": "💕分享虾米",
            "type": 0,
            "url": "https://jx.xmflv.com/?url=",
            "ext": {
                "header": {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.57"
                }
            }
        },
	
	 {
      "name": "💕分享西瓜",
      "type": 0,
      "url": "https://t1.qlplayer.cyou/player/?url=",
    "ext":{"flag":["qq",
                    "腾讯",
                    "企鹅",
                    "IQiYi",
                    "qiyi",
                    "爱奇艺",
                    "奇艺",
                    "youku",
                    "YouKu",
                    "优酷",
                    "sohu",
                    "SoHu",
                    "搜狐",
                    "letv",
                    "LeShi",
                    "乐视",
                    "imgo",
                    "mgtv",
                    "MangGuo",
                    "芒果",
                    "SLYS4k",
                    "BYGA",
                    "luanzi",
                    "AliS",
                    "dxzy",
                    "bilibili",
                    "QEYSS",
                    "xigua",
                    "西瓜视频",
                    "腾讯视频",
                    "奇艺视频",
                    "优酷视频",
                    "芒果视频",
                    "乐视视频"
                    ],"header":{"User-Agent":"Dart/3.0(dart:io)"}}},   

{"name":"💕分享夜幕", "type":0,"url":"https://www.yemu.xyz/?url=", "ext":{"flag":["qq",
                    "腾讯",
                    "企鹅",
                    "IQiYi",
                    "qiyi",
                    "爱奇艺",
                    "奇艺",
                    "youku",
                    "YouKu",
                    "优酷",
                    "sohu",
                    "SoHu",
                    "搜狐",
                    "letv",
                    "LeShi",
                    "乐视",
                    "imgo",
                    "mgtv",
                    "MangGuo",
                    "芒果",
                    "SLYS4k",
                    "BYGA",
                    "luanzi",
                    "AliS",
                    "dxzy",
                    "bilibili",
                    "QEYSS",
                    "xigua",
                    "西瓜视频",
                    "腾讯视频",
                    "奇艺视频",
                    "优酷视频",
                    "芒果视频",
                    "乐视视频"
                    ],"header":{"User-Agent":"Dart/3.0(dart:io)"}}},
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
    "url": "https://gitee.com/lyun_1_0/tb/raw/master/芸直播.txt",
    "epg": "https://epg.112114.eu.org/?ch={name}&date={date}",
    "logo": "https://epg.112114.eu.org/logo/{name},png"
}],
"ads": ["wan.51img1.com","iqiyi.hbuioo.com","vip.ffzyad.com"]}
