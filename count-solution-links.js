const fs = require('fs');

try {
    // 读取目录页内容
    const content = fs.readFileSync('directory.html', 'utf8');
    
    // 匹配所有解决方案页面链接
    const regex = /href="solutions\/[^"\s]+\.html"/g;
    const links = content.match(regex);
    
    // 输出链接数量
    console.log('Number of solution links in directory:', links ? links.length : 0);
    
    // 输出所有链接
    if (links) {
        console.log('Links found:');
        links.forEach((link, index) => {
            console.log(`${index + 1}. ${link}`);
        });
    }
} catch (error) {
    console.error('Error reading directory.html:', error.message);
}
