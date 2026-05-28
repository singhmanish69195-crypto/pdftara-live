/* 🚀 THE MASTER KEY: coi-serviceworker.js */
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("fetch", (event) => {
        const url = event.request.url;

        // 🛡️ STEP 1: गूगल एड्स और एनालिटिक्स को 'घूस' दो (Bypass)
        // अगर रिक्वेस्ट गूगल की है, तो उसे जैसा है वैसा जाने दो, छेड़ो मत।
        if (url.includes("google") || url.includes("ads") || url.includes("doubleclick") || url.includes("gtm")) {
            return; 
        }

        event.respondWith(
            fetch(event.request).then((response) => {
                // अगर रिस्पॉन्स खराब है या बाहरी है, तो मत छेड़ो
                if (response.status === 0 || !response.ok) return response;

                const newHeaders = new Headers(response.headers);

                // 🛡️ STEP 2: अपनी साइट की फाइलों को 'पावर' दो (Isolation)
                // 'credentialless' वो चाबी है जिससे WASM चलेगा और एड्स नहीं रुकेंगे
                newHeaders.set("Cross-Origin-Embedder-Policy", "credentialless");
                newHeaders.set("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
                newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: newHeaders,
                });
            }).catch(() => fetch(event.request)) // एरर आए तो कम से कम ओरिजिनल रिस्पॉन्स लोड करो
        );
    });
}
