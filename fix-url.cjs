const fs = require('fs');
const path = require('path');

const files = [
    'src/app/layout.tsx',
    'src/app/sitemap.ts',
    'src/app/robots.ts',
    'src/app/page.tsx',
    'next.config.js',
    'nginx.conf'
];

console.log('🔍 Scanning files...');

files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // 1. Fix Case (PDFTara -> pdftara)
        content = content.replace(/PDFTara\.com/g, 'pdftara.com');
        
        // 2. Fix Double WWW (www.www -> www)
        content = content.replace(/www\.www\.pdftara\.com/g, 'https://www.pdftara.com');
        
        // 3. Fix Missing WWW (https://pdftara -> https://www.pdftara)
        content = content.replace(/https:\/\/pdftara\.com/g, 'https://www.pdftara.com');

        // 4. Fix http -> https
        content = content.replace(/http:\/\/www\.pdftara/g, 'https://www.pdftara');

        // 5. Fix strings missing https (e.g. 'https://www.pdftara.com' -> 'https://www.pdftara.com')
        content = content.replace(/'www\.pdftara\.com/g, "'https://www.pdftara.com");
        content = content.replace(/"www\.pdftara\.com/g, '"https://www.pdftara.com');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('✅ Fixed: ' + file);
        } else {
            console.log('👍 OK: ' + file);
        }
    }
});
