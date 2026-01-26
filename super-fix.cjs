const fs = require('fs');
const path = require('path');

// In folders ko ignore karenge
const ignoredFolders = ['node_modules', '.next', '.git', '.vscode', 'dist', 'build', 'coverage'];
// Sirf in files ko check karenge
const targetExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs', '.cjs'];

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!ignoredFolders.includes(file)) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            if (targetExtensions.includes(path.extname(file))) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

console.log('🚀 Scanning ENTIRE project for URL fixes...');
const allFiles = getAllFiles(process.cwd());

allFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Agar sirf 'www.pdftara.com' likha hai (Single Quote)
    content = content.replace(/'www\.pdftara\.com'/g, "'https://www.pdftara.com/'");
    
    // 2. Agar sirf "www.pdftara.com" likha hai (Double Quote)
    content = content.replace(/"www\.pdftara\.com"/g, '"https://www.pdftara.com/"');

    // 3. Agar backtick www.pdftara.com hai
    content = content.replace(/www\.pdftara\.com/g, 'https://www.pdftara.com/');

    // 4. Double check: Agar 'http://' hai to 'https://' karo
    content = content.replace(/http:\/\/www\.pdftara\.com/g, 'https://www.pdftara.com/');
    content = content.replace(/http:\/\/pdftara\.com/g, 'https://www.pdftara.com/');

    // 5. Case Sensitive Fix (PDFTara -> pdftara)
    content = content.replace(/PDFTara\.com/g, 'pdftara.com');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('✅ Fixed: ' + filePath);
    }
});
console.log('🎉 Complete! All files scanned.');
