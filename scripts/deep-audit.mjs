import fs from 'fs';
import path from 'path';

const distDir = path.resolve('docs/.vitepress/dist');
const htmlFiles = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      walk(p);
    } else if (item.endsWith('.html')) {
      htmlFiles.push(p);
    }
  }
}
walk(distDir);

console.log(`=== 开始对 ${htmlFiles.length} 个静态 HTML 页面执行深度爬虫与风控审计 ===\n`);

// 1. Robots & Sitemap
const robotsPath = path.join(distDir, 'robots.txt');
const sitemapPath = path.join(distDir, 'sitemap.xml');
let robotsContent = '';
let sitemapUrls = [];

if (fs.existsSync(robotsPath)) {
  robotsContent = fs.readFileSync(robotsPath, 'utf-8');
}
if (fs.existsSync(sitemapPath)) {
  const sm = fs.readFileSync(sitemapPath, 'utf-8');
  const matches = sm.match(/<loc>(.*?)<\/loc>/g) || [];
  sitemapUrls = matches.map(m => m.replace(/<\/?loc>/g, '').trim());
}

// 2. Audit Data Structures
const auditResults = {
  robots: { pass: true, issues: [] },
  sitemap: { pass: true, issues: [] },
  canonical: { total: 0, missing: [], mismatch: [], notSelf: [] },
  ssrDom: { pass: true, csrDependent: [] },
  emptyLinks: [],
  soft404: [],
  brokenInternalLinks: [],
  externalLinks: { total: 0, nofollowMissing: [], details: [] },
  analyticsIds: [],
  fingerprintLeaks: { localPaths: [], internalIps: [], comments: [] },
  thinContent: [],
  templateDomDupes: {},
  geoStructure: { answerFirstMissing: [], tableMissing: [], faqMissing: [] },
  trustEEAT: { missingAuthor: [], missingDisclaimer: [] },
  schemaAudit: { invalidJson: [], schemaTypes: {}, hiddenMismatch: [] },
  metaTitles: new Map(), // title -> urls
  metaDescriptions: new Map(), // desc -> urls
  keywordStuffing: []
};

// Robots check
if (!robotsContent.includes('Sitemap:')) {
  auditResults.robots.pass = false;
  auditResults.robots.issues.push('robots.txt 未声明 Sitemap 指针');
}
if (robotsContent.includes('Disallow: /assets/') || robotsContent.includes('Disallow: /*.js') || robotsContent.includes('Disallow: /*.css')) {
  auditResults.robots.pass = false;
  auditResults.robots.issues.push('robots.txt 错误拦截了 CSS/JS 资源渲染');
}

// Sitemap check
const existingUrls = new Set(
  htmlFiles.map(f => {
    let rel = path.relative(distDir, f).replace(/\\/g, '/');
    if (rel === 'index.html') return 'https://jichangmianfei.my/';
    if (rel.endsWith('/index.html')) return `https://jichangmianfei.my/${rel.replace(/\/index\.html$/, '/')}`;
    return `https://jichangmianfei.my/${rel.replace(/\.html$/, '')}`;
  })
);

for (const smUrl of sitemapUrls) {
  if (smUrl.includes('404')) {
    auditResults.sitemap.issues.push(`Sitemap 包含了 404 页面: ${smUrl}`);
    auditResults.sitemap.pass = false;
  }
  if (!existingUrls.has(smUrl) && !existingUrls.has(smUrl.replace(/\/$/, '')) && !existingUrls.has(smUrl + '/')) {
    auditResults.sitemap.issues.push(`Sitemap 包含不存在的页面 (潜在 404): ${smUrl}`);
    auditResults.sitemap.pass = false;
  }
}

// Per-Page Loop
for (const file of htmlFiles) {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const is404 = relPath === '404.html';
  const content = fs.readFileSync(file, 'utf-8');

  // URL resolution
  let expectedUrl = 'https://jichangmianfei.my/';
  if (relPath === 'index.html') {
    expectedUrl = 'https://jichangmianfei.my/';
  } else if (relPath.endsWith('/index.html')) {
    expectedUrl = `https://jichangmianfei.my/${relPath.replace(/\/index\.html$/, '/')}`;
  } else {
    expectedUrl = `https://jichangmianfei.my/${relPath.replace(/\.html$/, '')}`;
  }

  // Canonical Check
  auditResults.canonical.total++;
  const canonicalMatch = content.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                         content.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
  if (!is404) {
    if (!canonicalMatch) {
      auditResults.canonical.missing.push(relPath);
    } else {
      const canonicalHref = canonicalMatch[1];
      if (canonicalHref !== expectedUrl) {
        auditResults.canonical.mismatch.push({ relPath, expected: expectedUrl, actual: canonicalHref });
      }
      if (!canonicalHref.startsWith('https://jichangmianfei.my')) {
        auditResults.canonical.notSelf.push({ relPath, actual: canonicalHref });
      }
    }
  }

  // Title & Description Check
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';
  if (title && !is404) {
    if (!auditResults.metaTitles.has(title)) {
      auditResults.metaTitles.set(title, []);
    }
    auditResults.metaTitles.get(title).push(relPath);

    // Keyword stuffing check (repeating same keyword > 3 times in title)
    const words = title.split(/[|\-_\s,，]+/);
    const freq = {};
    for (const w of words) {
      if (w.length >= 2) {
        freq[w] = (freq[w] || 0) + 1;
        if (freq[w] >= 4) {
          auditResults.keywordStuffing.push({ relPath, title, word: w, count: freq[w] });
        }
      }
    }
  }

  const descMatch = content.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                    content.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
  const desc = descMatch ? descMatch[1].trim() : '';
  if (desc && !is404) {
    if (!auditResults.metaDescriptions.has(desc)) {
      auditResults.metaDescriptions.set(desc, []);
    }
    auditResults.metaDescriptions.get(desc).push(relPath);
  }

  // JS Rendering / SSR Check (is main content SSR-rendered?)
  const mainMatch = content.match(/<main[\s\S]*?<\/main>/i);
  const mainContent = mainMatch ? mainMatch[0] : '';
  if (!is404 && (!mainMatch || mainContent.length < 300)) {
    auditResults.ssrDom.csrDependent.push(relPath);
    auditResults.ssrDom.pass = false;
  }

  // Text content & Thin Content Check
  // Strip tags and script/style
  const strippedText = content
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Character count (Chinese characters + English words)
  const cjkChars = (strippedText.match(/[\u4e00-\u9fa5]/g) || []).length;
  const enWords = (strippedText.match(/[a-zA-Z0-9_-]+/g) || []).length;
  const totalWordCount = cjkChars + Math.round(enWords * 0.6);

  if (!is404 && totalWordCount < 500) {
    auditResults.soft404.push({ relPath, totalWordCount });
  } else if (!is404 && totalWordCount < 1200) {
    auditResults.thinContent.push({ relPath, totalWordCount });
  }

  // Links Check (Empty links, Internal links, External links)
  const linkMatches = content.matchAll(/<a\b([^>]*)>/gi);
  for (const lm of linkMatches) {
    const attrs = lm[1];
    const hrefMatch = attrs.match(/href=["']([^"']*)["']/i);
    const relMatch = attrs.match(/rel=["']([^"']*)["']/i);

    if (!hrefMatch || !hrefMatch[1] || hrefMatch[1] === '#' || hrefMatch[1].startsWith('javascript:')) {
      // Ignore in-page hash anchor if has id or header-anchor class
      if (!attrs.includes('header-anchor')) {
        auditResults.emptyLinks.push({ relPath, linkTag: lm[0] });
      }
      continue;
    }

    const href = hrefMatch[1].trim();
    const rel = relMatch ? relMatch[1] : '';

    if (href.startsWith('http://') || href.startsWith('https://')) {
      const isInternal = href.startsWith('https://jichangmianfei.my') || href.startsWith('http://localhost');
      if (!isInternal) {
        auditResults.externalLinks.total++;
        // Check for commercial/referral links (aff, register, code, #/, /?)
        const isCommercial = href.includes('code=') || href.includes('register') || href.includes('aff') || href.includes('?');
        const hasNofollow = rel.includes('nofollow');
        const hasSponsored = rel.includes('sponsored');

        if (isCommercial && !hasNofollow) {
          auditResults.externalLinks.nofollowMissing.push({ relPath, href, rel });
        }
      } else if (href.startsWith('https://jichangmianfei.my')) {
        // Internal clean url check
        const cleanHref = href.replace('https://jichangmianfei.my', '').split('#')[0];
        // Validate internal url existence
        if (cleanHref && cleanHref !== '/') {
          const test1 = cleanHref.replace(/^\//, '');
          const exists = fs.existsSync(path.join(distDir, test1)) || 
                         fs.existsSync(path.join(distDir, test1 + '.html')) || 
                         fs.existsSync(path.join(distDir, test1, 'index.html'));
          if (!exists) {
            auditResults.brokenInternalLinks.push({ relPath, href });
          }
        }
      }
    } else if (href.startsWith('/')) {
      const cleanHref = href.split('#')[0].replace(/^\//, '');
      if (cleanHref && !cleanHref.startsWith('images') && !cleanHref.endsWith('.svg') && !cleanHref.endsWith('.txt')) {
        const exists = fs.existsSync(path.join(distDir, cleanHref)) || 
                       fs.existsSync(path.join(distDir, cleanHref + '.html')) || 
                       fs.existsSync(path.join(distDir, cleanHref, 'index.html'));
        if (!exists) {
          auditResults.brokenInternalLinks.push({ relPath, href });
        }
      }
    }
  }

  // Analytics / Tracking codes check
  const gaMatch = content.match(/G-[A-Z0-9]{8,12}/);
  const baiduMatch = content.match(/hm\.baidu\.com\/hm\.js\?[a-zA-Z0-9]+/);
  const adsenseMatch = content.match(/ca-pub-[0-9]+/);
  if (gaMatch) auditResults.analyticsIds.push({ relPath, type: 'GA4', id: gaMatch[0] });
  if (baiduMatch) auditResults.analyticsIds.push({ relPath, type: 'Baidu', id: baiduMatch[0] });
  if (adsenseMatch) auditResults.analyticsIds.push({ relPath, type: 'AdSense', id: adsenseMatch[0] });

  // Fingerprint Leaks
  const localPathMatch = content.match(/[A-Za-z]:\\[Users|Users|Pro User|Desktop][^"'\s<]+/);
  if (localPathMatch) {
    auditResults.fingerprintLeaks.localPaths.push({ relPath, path: localPathMatch[0] });
  }
  const ipMatch = content.match(/\b(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)\b/);
  if (ipMatch) {
    // Only flag if not in technical tutorial context
    if (!relPath.includes('router') && !relPath.includes('troubleshooting')) {
      auditResults.fingerprintLeaks.internalIps.push({ relPath, ip: ipMatch[0] });
    }
  }

  // GEO & Semantic structure
  if (!is404 && relPath.endsWith('.html') && !relPath.includes('about/')) {
    // Answer-First check
    const hasQuickAnswer = content.includes('QuickAnswer') || content.includes('class="quick-answer') || content.includes('quickAnswer') || content.includes('<strong>核心');
    if (!hasQuickAnswer && !relPath.includes('tools/')) {
      auditResults.geoStructure.answerFirstMissing.push(relPath);
    }

    // Tables
    const hasTable = content.includes('<table') || content.includes('ComparisonTable') || content.includes('SpeedTestTable');
    if (!hasTable && !relPath.includes('tools/')) {
      auditResults.geoStructure.tableMissing.push(relPath);
    }

    // FAQ
    const hasFaq = content.includes('FaqAccordion') || content.includes('<details') || content.includes('FAQ') || content.includes('常见问题');
    if (!hasFaq && !relPath.includes('tools/')) {
      auditResults.geoStructure.faqMissing.push(relPath);
    }
  }

  // JSON-LD Schemas check
  const jsonLdMatches = content.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  for (const jm of jsonLdMatches) {
    try {
      const parsed = JSON.parse(jm[1]);
      const graph = parsed['@graph'] ? parsed['@graph'] : [parsed];
      for (const item of graph) {
        const type = item['@type'];
        auditResults.schemaAudit.schemaTypes[type] = (auditResults.schemaAudit.schemaTypes[type] || 0) + 1;

        // Hidden schema check (e.g. fake ratings)
        if (item.aggregateRating) {
          auditResults.schemaAudit.hiddenMismatch.push({ relPath, issue: '包含 aggregateRating，需核查正文是否展现真实评价源' });
        }
      }
    } catch (e) {
      auditResults.schemaAudit.invalidJson.push({ relPath, error: e.message });
    }
  }
}

console.log('=== 审计指标统计完成 ===');
console.log('1. Canonical 检查:', {
  total: auditResults.canonical.total,
  missing: auditResults.canonical.missing.length,
  mismatch: auditResults.canonical.mismatch.length,
  notSelf: auditResults.canonical.notSelf.length
});
if (auditResults.canonical.mismatch.length > 0) {
  console.log('  Mismatch samples:', auditResults.canonical.mismatch.slice(0, 3));
}

console.log('\n2. 标题与描述重复检查:');
let dupTitles = 0;
for (const [title, urls] of auditResults.metaTitles.entries()) {
  if (urls.length > 1) {
    dupTitles++;
    console.log(`  重复标题 [${urls.length}次]: "${title}" -> ${urls.join(', ')}`);
  }
}
let dupDescs = 0;
for (const [desc, urls] of auditResults.metaDescriptions.entries()) {
  if (urls.length > 1) {
    dupDescs++;
    console.log(`  重复描述 [${urls.length}次]: "${desc.slice(0, 30)}..." -> ${urls.join(', ')}`);
  }
}
console.log(`  总计重复标题: ${dupTitles}, 重复描述: ${dupDescs}`);

console.log('\n3. 外链风控检查 (商业推广链接 rel="nofollow sponsored"):');
console.log(`  总外链数: ${auditResults.externalLinks.total}`);
console.log(`  缺失 nofollow/sponsored 的商业链接数: ${auditResults.externalLinks.nofollowMissing.length}`);
if (auditResults.externalLinks.nofollowMissing.length > 0) {
  console.log('  缺失样本:', auditResults.externalLinks.nofollowMissing.slice(0, 5));
}

console.log('\n4. 代码指纹与路径泄露:');
console.log(`  本地文件路径泄露: ${auditResults.fingerprintLeaks.localPaths.length}`);
if (auditResults.fingerprintLeaks.localPaths.length > 0) {
  console.log('  泄露样本:', auditResults.fingerprintLeaks.localPaths.slice(0, 3));
}
console.log(`  第三方追踪统计代码 (GA/百度/AdSense): ${auditResults.analyticsIds.length}`);

console.log('\n5. 内容薄弱与软 404 (Thin Content):');
console.log(`  < 500字 (Soft 404风险): ${auditResults.soft404.length}`, auditResults.soft404);
console.log(`  500-1200字 (薄内容风险): ${auditResults.thinContent.length}`);
if (auditResults.thinContent.length > 0) {
  console.log('  薄内容页面样本:', auditResults.thinContent.slice(0, 5));
}

console.log('\n6. 死链与空链接:');
console.log(`  内部死链数: ${auditResults.brokenInternalLinks.length}`, auditResults.brokenInternalLinks);
console.log(`  无效空 <a> 标签数: ${auditResults.emptyLinks.length}`);

console.log('\n7. GEO 语义与结构化布局:');
console.log(`  缺少 Answer-First 页面数: ${auditResults.geoStructure.answerFirstMissing.length}`);
console.log(`  缺少 Table 页面数: ${auditResults.geoStructure.tableMissing.length}`);
console.log(`  缺少 FAQ 页面数: ${auditResults.geoStructure.faqMissing.length}`);

console.log('\n8. Schema 结构化数据类型分布:');
console.log(auditResults.schemaAudit.schemaTypes);
console.log(`  JSON-LD 语法错误数: ${auditResults.schemaAudit.invalidJson.length}`);
console.log(`  Schema 潜在隐藏欺骗数: ${auditResults.schemaAudit.hiddenMismatch.length}`);

console.log('\n=== 深度审计脚本执行完毕 ===');
