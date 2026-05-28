/*! coi-serviceworker v0.1.7 - Optimized for PDFTara (Ads + WASM) */

// ब्रह्मास्त्र सेटिंग: इसे हमेशा true रखेंगे ताकि Ads न रुकें
let coepCredentialless = true; 

if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

    self.addEventListener("message", (ev) => {
        if (!ev.data) return;
        if (ev.data.type === "deregister") {
            self.registration.unregister().then(() => {
                return self.clients.matchAll();
            }).then(clients => {
                clients.forEach((client) => client.navigate(client.url));
            });
        }
    });

    self.addEventListener("fetch", function (event) {
        const r = event.request;
        const url = r.url;

        // --- 🛡️ AD-SHIELD LOGIC: Google Ads को बाईपास करो ---
        if (
            url.includes("google") || 
            url.includes("adsbygoogle") || 
            url.includes("doubleclick") || 
            url.includes("googlesyndication") ||
            url.includes("static.pub")
        ) {
            // एड्स के लिए कुछ भी मत बदलो, जैसा है वैसा जाने दो
            return; 
        }

        if (r.cache === "only-if-cached" && r.mode !== "same-origin") {
            return;
        }

        // Credentialless मोड में रिक्वेस्ट भेजें
        const request = (r.mode === "no-cors")
            ? new Request(r, { credentials: "omit" })
            : r;

        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.status === 0) return response;

                    const newHeaders = new Headers(response.headers);
                    
                    // WASM को पावर देने और Ads को खुश रखने वाले Headers
                    newHeaders.set("Cross-Origin-Embedder-Policy", "credentialless");
                    newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                    newHeaders.set("Cross-Origin-Resource-Policy", "cross-origin");

                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders,
                    });
                })
                .catch((e) => {
                    // अगर नेटवर्क एरर है तो कम से कम ओरिजिनल रिस्पॉन्स की कोशिश करो
                    console.error("COI Fetch Error:", e);
                })
        );
    });

} else {
    // क्लाइंट साइड लॉजिक (ब्राउज़र में रन होता है)
    (() => {
        const reloadedBySelf = window.sessionStorage.getItem("coiReloadedBySelf");
        window.sessionStorage.removeItem("coiReloadedBySelf");

        const coi = {
            shouldRegister: () => !reloadedBySelf,
            doReload: () => window.location.reload(),
            quiet: false,
            ...window.coi
        };

        const n = navigator;
        if (window.crossOriginIsolated !== false || !coi.shouldRegister()) return;

        if (!window.isSecureContext || !n.serviceWorker) return;

        n.serviceWorker.register(window.document.currentScript.src).then(
            (registration) => {
                registration.addEventListener("updatefound", () => {
                    window.sessionStorage.setItem("coiReloadedBySelf", "updatefound");
                    coi.doReload();
                });

                if (registration.active && !n.serviceWorker.controller) {
                    window.sessionStorage.setItem("coiReloadedBySelf", "notcontrolling");
                    coi.doReload();
                }
            },
            (err) => {
                !coi.quiet && console.error("SW Registration failed:", err);
            }
        );
    })();
}
