// PDFTara Chrome Extension - Background Service Worker

const PDFTARA_URL = 'https://pdftara.devtoolcafe.com/en';

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    // Create main context menu item
    chrome.contextMenus.create({
        id: 'pdftara-open',
        title: 'Open with PDFTara',
        contexts: ['link', 'page']
    });

    // Create submenu for specific tools
    chrome.contextMenus.create({
        id: 'pdftara-merge',
        parentId: 'pdftara-open',
        title: 'Merge PDFs',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdftara-compress',
        parentId: 'pdftara-open',
        title: 'Compress PDF',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdftara-convert',
        parentId: 'pdftara-open',
        title: 'Convert to PDF',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'pdftara-all-tools',
        parentId: 'pdftara-open',
        title: 'All Tools →',
        contexts: ['link', 'page']
    });

    console.log('PDFTara context menus created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    let url = PDFTARA_URL;

    switch (info.menuItemId) {
        case 'pdftara-merge':
            url = `${PDFTARA_URL}/tools/merge-pdf`;
            break;
        case 'pdftara-compress':
            url = `${PDFTARA_URL}/tools/compress-pdf`;
            break;
        case 'pdftara-convert':
            url = `${PDFTARA_URL}/tools/jpg-to-pdf`;
            break;
        case 'pdftara-all-tools':
        case 'pdftara-open':
            url = PDFTARA_URL;
            break;
        default:
            url = PDFTARA_URL;
    }

    // Open PDFTara in a new tab
    chrome.tabs.create({ url: url });
});

// Log when service worker starts
console.log('PDFTara background service worker started');
