const fs = require('fs');
const path = require('path');

// 读取 solutions 目录中的所有文件
const solutionsDir = path.join(__dirname, 'solutions');
const files = fs.readdirSync(solutionsDir).filter(file => file.endsWith('.html'));

// 按城市和行业分类
const categorizedFiles = {
  byCity: {},
  byIndustry: {}
};

// 城市映射
const cityMap = {
  'nyc': 'New York City',
  'london': 'London',
  'sydney': 'Sydney',
  'toronto': 'Toronto',
  'chicago': 'Chicago',
  'la': 'Los Angeles',
  'melbourne': 'Melbourne',
  'vancouver': 'Vancouver',
  'perth': 'Perth',
  'brisbane': 'Brisbane',
  'brooklyn': 'Brooklyn',
  'staten-island': 'Staten Island',
  'west-hollywood': 'West Hollywood',
  'shoreditch': 'Shoreditch',
  'south-yarra': 'South Yarra',
  'stkilda': 'St Kilda',
  'les': 'Lower East Side',
  'fitzroy': 'Fitzroy',
  'bondi': 'Bondi',
  'paddington': 'Paddington',
  'magmile': 'Magnificent Mile',
  'lakeview': 'Lakeview',
  'wicker-park': 'Wicker Park',
  'loop': 'Loop',
  'beverlyhills': 'Beverly Hills',
  'manhattan': 'Manhattan'
};

// 行业映射
const industryMap = {
  'hvac': 'HVAC Services',
  'lawyer': 'Legal Services',
  'law-firm': 'Legal Services',
  'dental': 'Dental Practices',
  'plumber': 'Plumbing Services',
  'salon': 'Salons & Beauty',
  'therapy': 'Therapy Services',
  'accounting': 'Accounting Services',
  'barber': 'Barber Shops',
  'cleaning': 'Cleaning Services',
  'commercial': 'Commercial Services',
  'cosmetic': 'Cosmetic Services',
  'estate': 'Estate Services',
  'family': 'Family Services',
  'gold-coast': 'Salons & Beauty',
  'handyman': 'Handyman Services',
  'immigration': 'Immigration Services',
  'landscaping': 'Landscaping Services',
  'legal': 'Legal Services',
  'luxury': 'Luxury Services',
  'master': 'Plumbing Services',
  'orthodontic': 'Dental Practices',
  'pediatric': 'Healthcare Services',
  'personal-trainer': 'Fitness Services',
  'pet-grooming': 'Pet Services',
  'private': 'Dental Practices',
  'psychotherapy': 'Therapy Services',
  'real-estate': 'Real Estate Services',
  'residential': 'Residential Services',
  'roofer': 'Roofing Services',
  'small-biz': 'Small Business Services',
  'soho': 'Tattoo Studios',
  'specialist': 'Dental Practices',
  'tattoo': 'Tattoo Studios',
  'tax': 'Accounting Services',
  'veneers': 'Dental Practices'
};

// 分类文件
files.forEach(file => {
  const fileName = path.basename(file, '.html');
  const parts = fileName.split('-');
  
  // 尝试识别城市
  let city = null;
  for (const part of parts) {
    if (cityMap[part]) {
      city = cityMap[part];
      break;
    }
  }
  
  // 尝试识别行业
  let industry = null;
  for (const part of parts) {
    if (industryMap[part]) {
      industry = industryMap[part];
      break;
    }
  }
  
  // 如果没有识别到城市，使用默认城市
  if (!city) {
    city = 'Other Cities';
  }
  
  // 如果没有识别到行业，使用默认行业
  if (!industry) {
    industry = 'Other Industries';
  }
  
  // 添加到城市分类
  if (!categorizedFiles.byCity[city]) {
    categorizedFiles.byCity[city] = [];
  }
  categorizedFiles.byCity[city].push({
    file: file,
    name: fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  });
  
  // 添加到行业分类
  if (!categorizedFiles.byIndustry[industry]) {
    categorizedFiles.byIndustry[industry] = [];
  }
  categorizedFiles.byIndustry[industry].push({
    file: file,
    name: fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  });
});

// 生成目录页 HTML
const generateDirectoryHTML = () => {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReceptionKiller | Business Audit Directory</title>
    <meta name="description" content="Comprehensive directory of business audits by city and industry, featuring professional appointment confirmation solutions for small businesses.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E📞%3C/text%3E%3C/svg%3E" type="image/svg+xml">
    <!-- Tailwind CSS Configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        dark: '#0a0a0a',
                        primary: '#f97316',
                        secondary: '#ef4444'
                    }
                }
            }
        }
    </script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
        }
        
        .text-gradient {
            background: linear-gradient(90deg, #f97316, #ef4444);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.3);
        }
    </style>
</head>
<body class="bg-dark text-white min-h-screen">
    <div class="max-w-6xl w-full mx-auto px-4 py-12">
        <!-- Header -->
        <header class="mb-16 text-center">
            <h1 class="text-[clamp(1.5rem,5vw,2.5rem)] font-bold mb-6 text-gradient">
                Business Audit Directory
            </h1>
            <p class="text-[clamp(1rem,2vw,1.25rem)] text-gray-300 mb-8">
                Explore our comprehensive directory of business audits by city and industry
            </p>
        </header>

        <!-- City Categories -->
        <section class="mb-20">
            <h2 class="text-2xl font-bold mb-8 text-center">By City</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
  
  // 添加按城市分类的链接
  Object.entries(categorizedFiles.byCity).forEach(([city, items]) => {
    html += `
                <!-- ${city} -->
                <div class="bg-gray-900 p-6 rounded-lg border border-gray-800 card-hover">
                    <h3 class="text-xl font-semibold mb-4 text-orange-500">${city}</h3>
                    <ul class="space-y-2">`;
    
    items.forEach(item => {
      html += `
                        <li><a href="solutions/${item.file}" class="text-gray-300 hover:text-white transition-colors">${item.name}</a></li>`;
    });
    
    html += `
                    </ul>
                </div>`;
  });
  
  html += `
            </div>
        </section>

        <!-- Industry Categories -->
        <section class="mb-20">
            <h2 class="text-2xl font-bold mb-8 text-center">By Industry</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">`;
  
  // 添加按行业分类的链接
  Object.entries(categorizedFiles.byIndustry).forEach(([industry, items]) => {
    html += `
                <!-- ${industry} -->
                <div class="bg-gray-900 p-6 rounded-lg border border-gray-800 card-hover">
                    <h3 class="text-xl font-semibold mb-4 text-orange-500">${industry}</h3>
                    <ul class="space-y-2">`;
    
    items.forEach(item => {
      html += `
                        <li><a href="solutions/${item.file}" class="text-gray-300 hover:text-white transition-colors">${item.name}</a></li>`;
    });
    
    html += `
                    </ul>
                </div>`;
  });
  
  html += `
            </div>
        </section>

        <!-- Footer -->
        <footer class="mt-20 pt-8 border-t border-gray-800">
            <div class="flex flex-col md:flex-row justify-between items-center">
                <div class="mb-4 md:mb-0">
                    <p class="text-gray-400">Built for the Hustlers of 2026</p>
                </div>
                <div class="flex flex-col items-center md:items-end">
                    <a href="index.html" class="text-orange-500 hover:text-orange-400 transition-colors mb-2">home</a>
                    <p class="text-gray-400">Support: 457239850@qq.com</p>
                </div>
            </div>
            <div class="mt-8">
                <p class="text-sm text-gray-500 text-center">
                    100% privacy secure: All processing is done locally in your browser. We don't store any of your information.
                </p>
            </div>
        </footer>
    </div>
</body>
</html>`;
  
  return html;
};

// 生成并写入目录页
const directoryHTML = generateDirectoryHTML();
fs.writeFileSync(path.join(__dirname, 'directory.html'), directoryHTML);

console.log('Directory page generated successfully with all 100 solution pages!');
