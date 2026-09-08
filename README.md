# passwords.nexus — Memorable Password Generator

> **Domain:** [passwords.nexus](https://passwords.nexus)  
> **Tagline:** Word · Number · Symbol — memorable by design  
> **Architecture:** 100% Client-Side Browser Generation. No telemetry, no logs, zero cloud transmission.

---

## 🔒 Overview & Philosophy

Most password generators produce indecipherable gibberish (`7$kQ#9zL!vP2`) that users immediately write down on sticky notes or reuse across accounts.

**passwords.nexus** creates secure, memorable passphrases combining dictionary words, digits, and symbols locally in your browser sandbox using the Web Cryptography API (`window.crypto.getRandomValues`).

### Key Guarantees:
- **Zero Server Exposure:** All randomization and password assembly happen strictly within client browser memory (`RAM`).
- **No Third-Party Tracking:** No Google Analytics, no external tracker scripts, no cookies.
- **Cryptographically Secure:** Powered by the browser's native `Crypto` subsystem, not pseudo-random `Math.random()`.
- **Instant Clipboard & UX:** Quick generation, preset toggles (Fair, Strong, Custom), and one-click copy.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, ES6 JavaScript (zero heavy frameworks, zero runtime dependencies).
- **Fonts & Assets:** Self-contained styling with Google Fonts pre-connect and custom cyberpunk Torii gate branding.
- **Web Server:** Lightweight Nginx Alpine container.
- **Ingress:** Reverse-proxied through Caddy with automated HTTPS.

---

## 🚀 Running Locally & Container Deployment

### Docker Compose
```bash
# Start container on port 8091
docker compose up -d

# Verify status
docker compose ps

# View logs
docker compose logs -f
```

### Static Hosting
You can also serve the directory with any static file server:
```bash
python3 -m http.server 8080
```

---

## 📄 License

Distributed under the MIT License. Open source for security auditing and public trust.
