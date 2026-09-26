#!/usr/bin/python
# -*- coding: utf-8 -*-
import re, json, requests
from urllib.parse import quote
try:
    from lxml import etree
except Exception:
    etree = None
from concurrent.futures import ThreadPoolExecutor
from base.spider import Spider
class Spider(Spider):
    def getName(self): return "袋鼠影视"
    def init(self, extend=""):
        self.host = "https://dsystv.com"
        try: ext = json.loads(extend) if str(extend).strip().startswith("{") else {}
        except Exception: ext = {}
        if ext.get("host"): self.host = ext["host"].rstrip("/")
        self.headers = {"User-Agent": ext.get("ua", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"), "Referer": self.host + "/", "Accept-Language": "zh-CN,zh;q=0.9"}
        self.categories = [{"type_id": "1", "type_name": "电影"}, {"type_id": "2", "type_name": "电视剧"}, {"type_id": "3", "type_name": "综艺"}, {"type_id": "4", "type_name": "动漫"}, {"type_id": "44", "type_name": "短剧"}]
        self.subs = {"1": [["全部", "1"], ["动作片", "5"], ["喜剧片", "10"], ["科幻片", "7"], ["恐怖片", "8"], ["战争片", "9"], ["动画片", "41"], ["剧情片", "12"], ["爱情片", "6"], ["纪录片", "11"]],
                     "2": [["全部", "2"], ["国产剧", "13"], ["港台剧", "14"], ["欧美剧", "15"], ["日韩剧", "16"], ["海外剧", "42"]]}
    def _fix(self, u):
        if not u: return ""
        if u.startswith("//"): return "https:" + u
        if u.startswith("/"): return self.host + u
        return u
    def _get(self, path):
        url = path if path.startswith("http") else self.host + path
        try:
            r = requests.get(url, headers=self.headers, timeout=15); r.encoding = "utf-8"
            if r.status_code >= 400: print("[WARN] status=%s url=%s" % (r.status_code, url))
            if r.status_code == 403 and "Just a moment" in (r.text or ""): return None
            if r.status_code >= 400: return None
            return r.text
        except requests.exceptions.Timeout: print("[ERROR] 请求超时: %s" % url)
        except requests.exceptions.ConnectionError: print("[ERROR] 连接错误: %s" % url)
        except Exception as e: print("[ERROR] 请求失败: %s, %s" % (url, str(e)))
        return None
    def _post(self, path, data):
        try:
            r = requests.post(self.host + path, data=data, headers=self.headers, timeout=15); r.encoding = "utf-8"; return r.text
        except Exception as e: print("[ERROR] POST失败: %s, %s" % (path, str(e))); return None
    def _parse_list(self, html):
        if not html: return []
        if etree is None:
            print("[WARN] lxml 不可用，降级为正则解析")
            out, seen = [], set()
            for vid, title in re.findall(r'href="[^"]*?/movie/index(\d+)\.html"[^>]*?title="([^"]*)"', html):
                if vid in seen: continue
                seen.add(vid); out.append({"vod_id": vid, "vod_name": title, "vod_pic": ""})
            return out
        tree = etree.HTML(html); results, seen = [], set()
        items = tree.xpath('//a[contains(@class,"videopic") and contains(@href,"/movie/index")]') + tree.xpath('//div[contains(@class,"item")]//a[contains(@href,"/movie/index") and .//img]') + tree.xpath('//a[contains(@href,"/movie/index") and .//img]')
        for it in items:
            try:
                m = re.search(r'/movie/index(\d+)\.html', it.get("href", ""))
                if not m or m.group(1) in seen: continue
                name = (it.get("title") or "".join(it.xpath('.//img/@alt')[:1])).strip()
                if not name: continue
                seen.add(m.group(1))
                pic = ""
                for at in ("data-original", "data-src", "data-echo", "data-lazy", "src"):
                    cand = it.xpath('.//img/@%s' % at)
                    if cand and "load.gif" not in cand[0] and "loading" not in cand[0]: pic = cand[0]; break
                note = " ".join(x.strip() for x in it.xpath('.//span//text()') if x.strip())
                results.append({"vod_id": m.group(1), "vod_name": name, "vod_pic": self._fix(pic), "vod_remarks": note[:40]})
            except Exception: continue
        return results
    def _parse_playlist(self, tree, vid):
        groups = {}
        for a in tree.xpath('//a[contains(@href,"/play/")]'):
            m = re.search(r'/play/%s-(\d+)-(\d+)\.html' % vid, a.get("href", ""))
            if not m: continue
            s, e = int(m.group(1)), int(m.group(2))
            nm = (a.get("title") or "".join(a.xpath('.//text()'))).strip()
            groups.setdefault(s, {}).setdefault(e, [])
            if nm: groups[s][e].append(nm)
        froms, urls = [], []
        for s in sorted(groups):
            tab = tree.xpath('//a[@href="#playlist%d"]' % (s + 1))
            name = ((tab[0].get("title") or "".join(tab[0].xpath('.//text()')).strip().split(" ")[0]) if tab else "").strip() or "线路%d" % (s + 1)
            eps = []
            for e in sorted(groups[s]):
                cand = [x for x in groups[s][e] if re.search(r'第.*[集期话]|^\d+$|HD|BD|TS|正片|预告|番外|国语|粤语|中字', x)]
                nm = (cand[0] if cand else "第%d集" % (e + 1)).replace("$", "").replace("#", "")
                eps.append("%s$/play/%s-%d-%d.html" % (nm, vid, s, e))
            froms.append(name); urls.append("#".join(eps))
        return froms, urls
    def _meta(self, tree, prop):
        v = tree.xpath('//meta[@property="%s"]/@content' % prop) or tree.xpath('//meta[@name="%s"]/@content' % prop)
        return v[0].strip() if v else ""
    def _people(self, tree, label):
        v = tree.xpath('//*[contains(text(),"%s")]//a[contains(@href,"searchword=")]/text()' % label)
        return " ".join(x.strip() for x in v[:30] if x.strip())
    def _field(self, text, key):
        m = re.search(r'%s\s*[:：]\s*([^\n]{1,120})' % key)
        return m.group(1).strip(" 　|/") if m else ""
    def homeContent(self, filter):
        fl = {}
        for c in self.categories:
            if c["type_id"] in self.subs:
                fl[c["type_id"]] = [{"key": "tid", "name": "类型", "value": [{"n": s[0], "v": s[1]} for s in self.subs[c["type_id"]]]}]
        return {"class": self.categories, "list": self._parse_list(self._get("/index.html")), "filters": fl}
    def homeVideoContent(self): return {"list": self._parse_list(self._get("/index.html"))}
    def _category_page_url(self, tid):
        return "/frim/index%s.html" % tid
    def _parse_rss(self, xml_text):
        if not xml_text or etree is None: return []
        try:
            root = etree.fromstring(xml_text.encode("utf-8") if isinstance(xml_text, str) else xml_text)
        except Exception: return []
        out, seen = [], set()
        for it in root.xpath('//item'):
            link = "".join(it.xpath('./link/text()')[:1]).strip()
            m = re.search(r'/movie/index(\d+)\.html', link)
            if not m or m.group(1) in seen: continue
            seen.add(m.group(1))
            name = "".join(it.xpath('./title/text()')[:1]).strip()
            if not name: continue
            thumb = it.xpath('./*[local-name()="thumbnail"]/@url')
            note = "".join(it.xpath('./description/text()')[:1]).strip()
            out.append({"vod_id": m.group(1), "vod_name": name, "vod_pic": self._fix(thumb[0].strip() if thumb else ""), "vod_remarks": note[:40]})
        return out
    def categoryContent(self, tid, pg, filter, extend):
        pg = str(pg or "1"); ex = extend or {}
        real = str(ex.get("tid") or tid)
        if str(pg) != "1": return {"page": int(pg), "pagecount": 1, "limit": 24, "total": 0, "list": []}
        lst = self._parse_list(self._get(self._category_page_url(real)))
        if not lst:
            lst = self._parse_rss(self._get("/xml/rss.xml"))
            if lst: return {"page": 1, "pagecount": 1, "limit": 24, "total": len(lst), "list": lst}
        return {"page": 1, "pagecount": 1, "limit": 24, "total": len(lst), "list": lst}
    def searchContent(self, key, quick, pg="1"):
        pg = str(pg or "1")
        if str(pg) != "1": return {"list": [], "page": int(pg)}
        name = str(key or "").strip()
        if not name: return {"list": [], "page": 1}
        html = self._get("/search.php?searchword=%s&page=1" % quote(name))
        lst = self._parse_list(html) if html else []
        if lst: return {"list": lst, "page": 1}
        rss = self._parse_rss(self._get("/xml/rss.xml"))
        hit = [x for x in rss if name in x.get("vod_name", "")]
        if hit: return {"list": hit, "page": 1}
        hot = self._hot_search()
        hit = [x for x in hot if name in x.get("vod_name", "")]
        return {"list": hit, "page": 1}
    def _hot_search(self):
        try:
            text = self._get("/api/app/data/hot-search.json?v=30")
            if not text: return []
            data = json.loads(text)
            items = ((data.get("data") or {}).get("items")) if isinstance(data, dict) else None
            if not items and isinstance(data, dict): items = data.get("items") or []
            out = []
            for x in items or []:
                name = str(x.get("name", "")).strip()
                vid = str(x.get("id", "")).strip()
                if not name or not vid: continue
                out.append({"vod_id": vid, "vod_name": name, "vod_pic": "", "vod_remarks": ("豆瓣%s" % x.get("douban")) if x.get("douban") else ""})
            return out
        except Exception: return []
    def detailContent(self, ids):
        vid = re.sub(r'\D', '', str(ids[0]))
        html = self._get("/movie/index%s.html" % vid)
        if not html or etree is None: return {"list": []}
        tree = etree.HTML(html)
        text = re.sub(r'[ \t　]+', ' ', "\n".join(x.strip() for x in tree.xpath('//text()') if x.strip()))
        froms, urls = self._parse_playlist(tree, vid)
        vod = {"vod_id": vid,
               "vod_name": (self._meta(tree, "og:title") or "".join(tree.xpath('//h1//text()'))).strip().split("《")[-1].split("》")[0] or "".join(tree.xpath('//h1//text()')).strip(),
               "vod_pic": self._fix(self._meta(tree, "og:image")),
               "vod_year": self._field(text, "年份"), "vod_area": self._field(text, "地区"),
               "type_name": self._field(text, "类型"), "vod_lang": self._field(text, "语言"),
               "vod_actor": self._people(tree, "主演") or self._field(text, "主演"),
               "vod_director": self._people(tree, "导演") or self._field(text, "导演"),
               "vod_remarks": self._field(text, "豆瓣"),
               "vod_content": self._meta(tree, "og:description") or self._meta(tree, "description"),
               "vod_play_from": "$$$".join(froms), "vod_play_url": "$$$".join(urls)}
        return {"list": [vod]}
    def _referer(self, url):
        m = re.search(r'(https?://[^/]+)/', url)
        return (m.group(1) + "/") if m else self.host + "/"
    # ===== 自动跨线路探测（修复国内访问境外CDN被墙）=====
    def _now(self, html):
        if not html: return ""
        m = re.search(r'var\s+now\s*=\s*["\']([^"\']+)["\']', html)
        return self._fix(m.group(1)) if m else ""
    def _lines(self, vid, cur_line):
        out = []
        try:
            html = self._get("/movie/index%s.html" % vid)
            if html and etree is not None:
                tree = etree.HTML(html)
                for ln in tree.xpath('//div[@data-playlist-line]/@data-playlist-line'):
                    try: l = int(ln)
                    except Exception: continue
                    if l not in out: out.append(l)
        except Exception: pass
        if not out: out = [0, 1, 2, 3]
        # 当前线路优先
        out = sorted(out, key=lambda x: 0 if x == cur_line else 1)
        return out
    def _reachable(self, url):
        try:
            r = requests.get(url, headers={"User-Agent": self.headers["User-Agent"], "Referer": self.host + "/"},
                             timeout=5, stream=True)
            if r.status_code >= 400: return False
            chunk = next(r.iter_content(512), b"")
            r.close()
            return bool(chunk)
        except Exception:
            return False
    def _collect(self, vid, line, ep):
        html = self._get("/play/%s-%d-%d.html" % (vid, line, ep))
        return self._now(html)
    def playerContent(self, flag, id, vipFlags):
        pid = id if id.startswith("http") else self._fix(id)
        media = ""
        cur_line = cur_ep = 0
        m = re.search(r'/play/(\d+)-(\d+)-(\d+)\.html', pid)
        vid = m.group(1) if m else re.sub(r'\D', '', str(id))
        if m: cur_line, cur_ep = int(m.group(2)), int(m.group(3))
        # 当前线路直链
        cur_html = self._get(pid)
        cur_now = self._now(cur_html)
        # 并发抓取所有线路的同集直链
        urls = []
        if cur_now: urls.append(cur_now)
        try:
            with ThreadPoolExecutor(max_workers=4) as ex:
                futs = {ex.submit(self._collect, vid, ln, cur_ep): ln for ln in self._lines(vid, cur_line)}
                for f in futs:
                    try:
                        u = f.result(timeout=10)
                        if u and u not in urls: urls.append(u)
                    except Exception: continue
        except Exception: pass
        # 并发探测可达性，返回第一个连通的
        if len(urls) > 1:
            try:
                with ThreadPoolExecutor(max_workers=4) as ex:
                    for u in ex.map(lambda x: x if self._reachable(x) else "", urls):
                        if u: media = u; break
            except Exception: pass
        if not media and urls: media = urls[0]
        if not media:
            if re.search(r'\.(?:m3u8|mp4)(?:[?#]|$)', pid):
                return {"parse": 0, "url": pid, "header": {"User-Agent": self.headers["User-Agent"], "Referer": self._referer(pid)}}
            return {"parse": 1, "url": pid, "header": {"User-Agent": self.headers["User-Agent"], "Referer": self._referer(pid)}}
        return {"parse": 0, "url": media, "header": {"User-Agent": self.headers["User-Agent"], "Referer": self._referer(media)}}

