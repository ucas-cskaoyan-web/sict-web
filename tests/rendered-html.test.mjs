import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished SICT guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /沈阳计算所/);
  assert.match(html, /2026 数据快照/);
  assert.match(html, /初试科目/);
  assert.match(html, /复试怎么考/);
  assert.match(html, /培养地点、住宿与补助/);
  assert.match(html, /A\+/);
  assert.match(html, /国科大计算机学科评估/);
  assert.match(html, /3\.3万\+/);
  assert.match(html, /研一补助\/年 · 北京/);
  assert.match(html, /补助已含学费返还/);
  assert.match(html, /阅读说明/);
  assert.match(html, /本站由学生维护，不代表沈阳计算技术研究所官方立场/);
  assert.match(html, /查看数据口径/);
  assert.doesNotMatch(html, /ABOUT · SICT|认识沈计所|WHY SICT|为什么选择沈计所|理性看待/);
  assert.match(html, /对沈计所效忠/);
  assert.match(html, /正在读取全站计数/);
  assert.match(html, /2027 中科院沈计所考研群/);
  assert.match(html, /加入 QQ 群/);
  assert.match(html, /免责声明/);
  assert.match(html, /中科院软件所报考指南/);
  assert.match(html, /信工所考研信息站/);
  assert.match(html, /国科大人工智能学院华大联培/);
  assert.match(html, /https:\/\/iscas\.cskaoyan\.cn/);
  assert.match(html, /https:\/\/iie\.cskaoyan\.cn/);
  assert.match(html, /https:\/\/ucas-bgi\.cskaoyan\.cn/);
  assert.match(html, /qm\.qq\.com\/cgi-bin\/qm\/qr/);
  assert.match(html, /github\.com\/Huazhao-nine\/sict-web/);
  assert.doesNotMatch(html, /pub\.idqqimg\.com/);
  assert.match(html, /非官方网站/);
  assert.doesNotMatch(html, /\/downloads\//);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders the data archive", async () => {
  const response = await render("/data");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /历年录取/);
  assert.match(html, /2024—2026/);
  assert.match(html, /48 条常规成绩记录/);
});

test("server-renders the complete 2026 annual report", async () => {
  const response = await render("/data/2026");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /2026 年.*考研数据报告/s);
  assert.match(html, /四个报考专业/);
  assert.match(html, /分数段与学习方式/);
  assert.match(html, /成绩统计按学习方式拆分/);
  assert.match(html, /毕业去向概览/);
  assert.match(html, /2026<!-- --> 届/);
  assert.match(html, /86<small> 人/);
  assert.match(html, /78<small> 人/);
  assert.match(html, /8<small> 人/);
  assert.match(html, /大厂 \/ 科技企业/);
  assert.match(html, /50 人/);
  assert.match(html, /百度 10 · 京东 9 · 华为体系 7 · 美团 5 · 快手 4/);
  assert.match(html, /公务员 \/ 党政机关/);
  assert.match(html, /4 人/);
  assert.match(html, /组织部、海关及税务系统/);
  assert.match(html, /读博 \/ 深造/);
  assert.match(html, /国科大、北大、南大、复旦等/);
  assert.match(html, /55 条单位记录、合计 86 人/);
  assert.match(html, /2025<!-- --> 届/);
  assert.match(html, /114<small> 人/);
  assert.match(html, /92<small> 人/);
  assert.match(html, /未单列/);
  assert.match(html, /22<small> 人/);
  assert.match(html, /非官方 · 民间整理/);
  assert.match(html, /其中国科大读博 9 人/);
  assert.doesNotMatch(html, /北京中科瑞通|上海思格源|中科智禾|尘智能|北京迅志|北京调科|兰陵县智行/);
  assert.doesNotMatch(html, /原图合计栏|相差 29 人|116<small> 人/);
  assert.doesNotMatch(html, /内部报告|内部文件/);
  assert.match(html, /全日制拟录取.*49<small> 人/s);
  assert.match(html, /非全日制拟录取.*0<small> 人/s);
  assert.doesNotMatch(html, /\/downloads\//);
});

test("server-renders the complete 2024 and 2025 table reports", async () => {
  const [report2024, report2025] = await Promise.all([
    render("/data/2024"),
    render("/data/2025"),
  ]);
  assert.equal(report2024.status, 200);
  assert.equal(report2025.status, 200);
  const html2024 = await report2024.text();
  const html2025 = await report2025.text();
  assert.match(html2024, /2024 年.*考研数据报告/s);
  assert.match(html2024, /123<small> 人/);
  assert.match(html2024, /78<small> 人/);
  assert.match(html2024, /全日制拟录取.*54<small> 人/s);
  assert.match(html2024, /非全日制拟录取.*24<small> 人/s);
  assert.match(html2025, /2025 年.*考研数据报告/s);
  assert.match(html2025, /135<small> 人/);
  assert.match(html2025, /79<small> 人/);
  assert.match(html2025, /全日制拟录取.*51<small> 人/s);
  assert.match(html2025, /非全日制拟录取.*28<small> 人/s);
  assert.match(`${html2024}${html2025}`, /分数段按学习方式拆分/);
  assert.match(`${html2024}${html2025}`, /不公开姓名/);
});

test("server-renders experience and source archives", async () => {
  const [experienceResponse, sourceResponse] = await Promise.all([
    render("/experiences"),
    render("/sources"),
  ]);
  assert.equal(experienceResponse.status, 200);
  assert.equal(sourceResponse.status, 200);
  const experienceHtml = await experienceResponse.text();
  const sourceHtml = await sourceResponse.text();
  assert.match(experienceHtml, /经验文章库/);
  assert.match(experienceHtml, /24.*篇/s);
  assert.match(experienceHtml, /阅读全文/);
  assert.match(sourceHtml, /三层来源/);
  assert.match(sourceHtml, /核心整理材料已经转成网页/);
  assert.match(sourceHtml, /也看看兄弟研究所/);
  assert.match(sourceHtml, /iie\.cskaoyan\.cn/);
  assert.match(sourceHtml, /iscas\.cskaoyan\.cn/);
  assert.match(sourceHtml, /ucas-bgi\.cskaoyan\.cn/);
  assert.doesNotMatch(`${experienceHtml}${sourceHtml}`, /\/downloads\//);
});

test("server-renders a complete experience article", async () => {
  const response = await render("/experiences/2026-retest-paper");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /2026 复试试题整理/);
  assert.match(html, /本文目录/);
  assert.match(html, /阅读边界/);
  assert.match(html, /原始资料/);
  assert.doesNotMatch(html, /href="[^"]*\.(?:pdf|docx?|xlsx?)"/i);
});

test("server-renders the complete disclaimer", async () => {
  const response = await render("/disclaimer");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /非官方性质/);
  assert.match(html, /非盈利声明/);
  assert.match(html, /内容仅供参考/);
  assert.match(html, /毕业去向属于学生民间整理/);
  assert.doesNotMatch(html, /内部报告|内部文件/);
  assert.match(html, /外部链接与群聊/);
  assert.match(html, /CC BY-NC-SA 4\.0/);
  assert.match(html, /更正与反馈/);
  assert.match(html, /2027 交流群/);
});

test("server-renders the real score registration entry", async () => {
  const response = await render("/score");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /2027.*考研登分/s);
  assert.match(html, /2027 登分测试中/);
  assert.match(html, /考生信息/);
  assert.match(html, /成绩证明/);
  assert.match(html, /身份不公开/);
  assert.match(html, /以明文保存/);
  assert.match(html, /提交你的 2027 初试成绩/);
  assert.match(html, /测试数据/);
  assert.match(html, /2027 测试成绩样例榜/);
  assert.match(html, /学硕、专硕分别排名/);
  assert.match(html, /学术型硕士榜/);
  assert.match(html, /专业型硕士榜/);
  assert.match(html, /政治.*英语.*数学.*408.*总分/s);
  assert.doesNotMatch(html, /本地交互预览|不会真正提交|演示模式/);
  assert.match(html, /非官方说明/);
  assert.doesNotMatch(html, /\/qq\/login|\/user\/profile/);
});
