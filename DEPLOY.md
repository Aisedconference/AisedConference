# AiSED Conference Website Deployment

## 1. Add the Google Form link

Open `config.js` and replace:

```js
registration: "PASTE_YOUR_GOOGLE_FORM_LINK_HERE"
```

with your published Google Form URL.

Use the Google Form public link from **Send > Link**.

## 2. Host the website

This is a static website. You can host it on:

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- A VPS with Node.js

If using a Node.js server, run:

```bash
npm start
```

The server uses:

```bash
PORT=8080
```

unless your host provides another `PORT`.

## 3. Point your domain DNS

You cannot point DNS to a local file on your Mac.

First deploy the site to a hosting provider. Then update your domain DNS:

- Use `CNAME` if your host gives you a domain like `your-site.netlify.app`
- Use `A` records if your host gives you an IP address

Typical setup:

```text
www    CNAME    your-host-provided-domain
@      A        host-provided-IP
```

Many hosts provide exact DNS records after you add your custom domain.

## 4. SSL

Enable HTTPS/SSL in your hosting provider dashboard after DNS is connected.
