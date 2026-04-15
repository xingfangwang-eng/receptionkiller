const fs = require('fs');

// 读取目录页内容
const content = fs.readFileSync('directory.html', 'utf8');

// 匹配所有解决方案页面链接
const links = content.match(/href="solutions\/[^"\s]+\.html"/g);

// 输出链接数量
console.log('Number of solution links in directory:', links ? links.length : 0);
