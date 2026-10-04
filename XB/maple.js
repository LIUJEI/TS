// ==================== 枫叶 极简版 探针 ====================
// 所有接口返回 100% 硬编码数据，排除所有变量/函数/async/await 依赖
// 如果这个能显示分类和视频卡片 → 说明文件加载 OK，问题在原代码逻辑
// 如果这个也空白 → 说明文件根本没被 QuickJS 加载（语法/编码/export 问题）

async function init(cfg) { return; }

async function home(filter) {
    // 硬编码分类 + 列表 + 筛选器
    const s = JSON.stringify({
        class: [
            { type_id: '2', type_name: '电视剧(探针)' },
            { type_id: '1', type_name: '电影(探针)' },
            { type_id: '4', type_name: '动漫(探针)' },
            { type_id: '3', type_name: '综艺(探针)' },
            { type_id: '5', type_name: '短剧(探针)' }
        ],
        list: [
            { vod_id: 'P1', vod_name: '探针测试-如果看到这个说明JS加载正常', vod_pic: '', vod_remarks: '探针', vod_year: '2026' },
            { vod_id: 'P2', vod_name: '探针测试2', vod_pic: '', vod_remarks: '探针', vod_year: '2026' }
        ],
        filters: {}
    });
    return s;
}

async function homeVod() {
    return JSON.stringify({
        list: [
            { vod_id: 'HV1', vod_name: '首页推荐-探针', vod_pic: '', vod_remarks: '探针', vod_year: '2026' }
        ]
    });
}

async function category(tid, pg, filter, extend) {
    return JSON.stringify({ list: [], page: parseInt(pg || '1', 10), pagecount: 1 });
}

async function detail(id) {
    return JSON.stringify({ list: [] });
}

async function search(wd, quick, pg) {
    return JSON.stringify({ list: [], page: 1, pagecount: 1 });
}

async function play(flag, id, vipFlags) {
    return JSON.stringify({ parse: 0, url: '' });
}

export default { init, home, homeVod, category, detail, search, play };
