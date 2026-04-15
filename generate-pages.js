const fs = require('fs');
const path = require('path');

// 确保 solutions 目录存在
const solutionsDir = path.join(__dirname, 'solutions');
if (!fs.existsSync(solutionsDir)) {
    fs.mkdirSync(solutionsDir, { recursive: true });
}

// 读取模板文件
const templatePath = path.join(__dirname, 'solutions.html');
const templateContent = fs.readFileSync(templatePath, 'utf8');

// 读取 keywords-data.json
const keywordsPath = path.join(__dirname, 'keywords-data.json');
const keywordsData = JSON.parse(fs.readFileSync(keywordsPath, 'utf8'));

// 从 ID 中提取城市和行业信息
function extractCityAndIndustry(id) {
    // 常见城市列表
    const cities = ['nyc', 'london', 'sydney', 'toronto', 'chicago', 'la', 'melbourne', 'vancouver', 'brisbane', 'perth'];
    
    // 常见行业列表
    const industries = ['hvac', 'law', 'dental', 'plumber', 'salon', 'therapy', 'landscaping', 'real-estate', 'cleaning', 'tattoo', 'accounting', 'pet-grooming', 'handyman', 'roofer', 'personal-trainer'];
    
    let city = null;
    let industry = null;
    
    // 查找城市
    for (const c of cities) {
        if (id.includes(c)) {
            city = c;
            break;
        }
    }
    
    // 查找行业
    for (const i of industries) {
        if (id.includes(i)) {
            industry = i;
            break;
        }
    }
    
    return { city, industry };
}

// 随机推荐相关页面
function getRelatedPages(currentId, currentCity, currentIndustry, count = 5) {
    // 同城市但不同行业
    const sameCityDifferentIndustry = keywordsData.filter(item => {
        const { city, industry } = extractCityAndIndustry(item.id);
        return city === currentCity && industry !== currentIndustry && item.id !== currentId;
    });
    
    // 同行业但不同城市
    const sameIndustryDifferentCity = keywordsData.filter(item => {
        const { city, industry } = extractCityAndIndustry(item.id);
        return industry === currentIndustry && city !== currentCity && item.id !== currentId;
    });
    
    // 随机排序并限制数量
    const shuffle = array => array.sort(() => Math.random() - 0.5);
    
    const relatedSameCity = shuffle(sameCityDifferentIndustry).slice(0, count);
    const relatedSameIndustry = shuffle(sameIndustryDifferentCity).slice(0, count);
    
    return { relatedSameCity, relatedSameIndustry };
}

// 生成 GEO 锚点区域
function generateServingAreasSection(currentCity) {
    // 为每个城市定义服务区域
    const servingAreas = {
        'nyc': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Long Island', 'New Jersey'],
        'london': ['City of London', 'Westminster', 'Kensington and Chelsea', 'Hammersmith and Fulham', 'Wandsworth', 'Lambeth', 'Southwark', 'Tower Hamlets'],
        'sydney': ['Sydney CBD', 'North Sydney', 'Parramatta', 'Liverpool', 'Penrith', 'Wollongong', 'Newcastle'],
        'toronto': ['Toronto Downtown', 'North York', 'Scarborough', 'Etobicoke', 'Mississauga', 'Brampton', 'Markham'],
        'chicago': ['Chicago Loop', 'Lincoln Park', 'Lakeview', 'Wicker Park', 'Logan Square', 'Hyde Park', 'Naperville'],
        'la': ['Hollywood', 'Beverly Hills', 'Downtown LA', 'Santa Monica', 'Pasadena', 'Long Beach', 'Anaheim'],
        'melbourne': ['Melbourne CBD', 'South Yarra', 'St Kilda', 'Fitzroy', 'Carlton', 'Geelong', 'Ballarat'],
        'vancouver': ['Vancouver Downtown', 'West Vancouver', 'North Vancouver', 'Burnaby', 'Richmond', 'Surrey', 'Abbotsford'],
        'brisbane': ['Brisbane CBD', 'South Bank', 'Fortitude Valley', 'West End', 'Gold Coast', 'Sunshine Coast', 'Toowoomba'],
        'perth': ['Perth CBD', 'Subiaco', 'Fremantle', 'Joondalup', 'Mandurah', 'Bunbury', 'Geraldton']
    };
    
    const areas = servingAreas[currentCity] || [];
    
    if (areas.length === 0) {
        return '';
    }
    
    let section = `
    <!-- Serving Areas -->
    <section class="mt-16 bg-gray-900 rounded-lg p-8 border border-gray-800">
        <h2 class="text-2xl font-bold mb-8 text-gradient">Serving Areas</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">`;
    
    areas.forEach(area => {
        section += `
            <div class="bg-gray-800 p-4 rounded-lg text-center">
                <span class="text-orange-500 font-semibold">${area}</span>
            </div>`;
    });
    
    section += `
        </div>
    </section>`;
    
    return section;
}

// 生成相关业务审计区域
function generateRelatedAuditsSection(currentId, currentCity, currentIndustry) {
    const { relatedSameCity, relatedSameIndustry } = getRelatedPages(currentId, currentCity, currentIndustry);
    
    let section = `
    <!-- Related Business Audits -->
    <section class="mt-16 bg-gray-900 rounded-lg p-8 border border-gray-800">
        <h2 class="text-2xl font-bold mb-8 text-gradient">Related Business Audits</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Same City Different Industry -->
            <div>
                <h3 class="text-xl font-semibold mb-4 text-orange-500">Similar Services in Your Area</h3>
                <ul class="space-y-3">`;
    
    relatedSameCity.forEach(item => {
        section += `
                    <li>
                        <a href="${item.id}.html" class="text-gray-300 hover:text-white transition-colors flex items-start">
                            <span class="mr-2">→</span>
                            <span>${item.h1_title}</span>
                        </a>
                    </li>`;
    });
    
    section += `
                </ul>
            </div>
            
            <!-- Same Industry Different City -->
            <div>
                <h3 class="text-xl font-semibold mb-4 text-orange-500">Industry Insights Across Locations</h3>
                <ul class="space-y-3">`;
    
    relatedSameIndustry.forEach(item => {
        section += `
                    <li>
                        <a href="${item.id}.html" class="text-gray-300 hover:text-white transition-colors flex items-start">
                            <span class="mr-2">→</span>
                            <span>${item.h1_title}</span>
                        </a>
                    </li>`;
    });
    
    section += `
                </ul>
            </div>
        </div>
    </section>`;
    
    return section;
}

// 获取货币符号
function getCurrencySymbol(city) {
    // 英国城市
    const ukCities = ['london', 'manchester'];
    // 澳洲城市
    const auCities = ['sydney', 'melbourne', 'brisbane', 'perth'];
    
    if (ukCities.includes(city)) {
        return '£';
    } else if (auCities.includes(city)) {
        return 'A$';
    } else {
        // 美国/加拿大城市
        return '$';
    }
}

// 遍历所有条目并生成页面
keywordsData.forEach(item => {
    const { id, h1_title, description, local_expert_insight, faq } = item;
    const { city, industry } = extractCityAndIndustry(id);
    
    // 获取货币符号
    const currencySymbol = getCurrencySymbol(city);
    
    // 填充模板
    let pageContent = templateContent
        // 填充标题
        .replace('<title id="page-title">Loading...</title>', `<title>${h1_title}</title>`)
        // 填充描述
        .replace('<meta name="description" id="page-description" content="Loading...">', `<meta name="description" content="${description}">`)
        // 填充 h1 标题
        .replace('<h1 id="h1-title" class="text-[clamp(1.5rem,5vw,2.5rem)] font-bold mb-6 text-gradient">Loading...</h1>', `<h1 id="h1-title" class="text-[clamp(1.5rem,5vw,2.5rem)] font-bold mb-6 text-gradient">${h1_title}</h1>`)
        // 填充 local expert insight
        .replace('<div id="local-expert-insight" class="prose prose-invert max-w-none"><p>Loading expert insight...</p></div>', `<div id="local-expert-insight" class="prose prose-invert max-w-none">${local_expert_insight}</div>`)
        // 填充 FAQ
        .replace('<div class="space-y-4" id="faq-section"><!-- FAQ items will be inserted here --><p>Loading FAQs...</p></div>', () => {
            if (faq) {
                let faqContent = '<div class="space-y-4" id="faq-section">';
                if (Array.isArray(faq)) {
                    faq.forEach(faqItem => {
                        faqContent += `<div class="bg-gray-900 rounded-lg border border-gray-800"><details class="group"><summary class="p-4 cursor-pointer list-none flex justify-between items-center"><span class="font-semibold">${faqItem.question}</span><span class="transition-transform duration-300 group-open:rotate-180">▼</span></summary><div class="p-4 pt-0 border-t border-gray-800"><p class="text-gray-300">${faqItem.answer}</p></div></details></div>`;
                    });
                } else if (faq.question && faq.answer) {
                    faqContent += `<div class="bg-gray-900 rounded-lg border border-gray-800"><details class="group"><summary class="p-4 cursor-pointer list-none flex justify-between items-center"><span class="font-semibold">${faq.question}</span><span class="transition-transform duration-300 group-open:rotate-180">▼</span></summary><div class="p-4 pt-0 border-t border-gray-800"><p class="text-gray-300">${faq.answer}</p></div></details></div>`;
                }
                faqContent += '</div>';
                return faqContent;
            }
            return '<div class="space-y-4" id="faq-section"><p>Loading FAQs...</p></div>';
        })
        // 添加上方导航链接到目录页
        .replace('<!-- Add directory link here -->', '<div class="mb-8"><a href="../directory.html" class="text-orange-500 hover:text-orange-400 transition-colors flex items-center"><span class="mr-2">←</span> Back to Directory</a></div>')
        // 添加相关业务审计区域
        .replace('<!-- Add related audits section here -->', generateRelatedAuditsSection(id, city, industry) + generateServingAreasSection(city))
        // 替换货币符号逻辑
        .replace('function calculateLeakage() {', function(match) {
            return 'function calculateLeakage() {\n            const currencySymbol = "' + currencySymbol + '";';
        })
        .replace('avgTicketValueElement.textContent = `$${avgTicket.toLocaleString()}`;', function(match) {
            return 'avgTicketValueElement.textContent = currencySymbol + avgTicket.toLocaleString();';
        })
        .replace('annualLossElement.textContent = `$${annualLoss.toLocaleString()}`;', function(match) {
            return 'annualLossElement.textContent = currencySymbol + annualLoss.toLocaleString();';
        })
        .replace('avgTicketValueElement.textContent = `$${industryAvgTicket.toLocaleString()}`;', function(match) {
            return 'avgTicketValueElement.textContent = currencySymbol + industryAvgTicket.toLocaleString();';
        });
    
    // 生成文件路径
    const outputPath = path.join(solutionsDir, `${id}.html`);
    
    // 写入文件
    fs.writeFileSync(outputPath, pageContent);
    console.log(`Generated: ${outputPath}`);
});

console.log(`\n✅ Generated ${keywordsData.length} pages successfully!`);