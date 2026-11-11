/* N.V. Home Decor — poster engine. Draws a poster on a <canvas>. */
(function (global) {
  "use strict";
  var LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F3D38A"/><stop offset=".55" stop-color="#D9A24B"/><stop offset="1" stop-color="#B07A2E"/></linearGradient></defs><rect width="100" height="100" rx="14" fill="#2B2622"/><g fill="none" stroke="url(#g)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="50" cy="53" rx="35" ry="30"/><path d="M40 80C30 60 30 40 36 30C44 46 53 64 62 80"/><path d="M62 80C67 58 65 34 55 15"/></g></svg>';
  var LOGO_URL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(LOGO_SVG);

  var TPL = {
    walnut: { name: 'Walnut', bg: '#3B2A20', bg2: '#4A3426', ink: '#FBF3E6', sub: '#D9C7AE', accent: '#D9A66B', accentInk: '#2A211B', sofa: '#C98B5A', sofa2: '#A86E42' },
    red:    { name: 'Festive Red', bg: '#8E1F1F', bg2: '#A12A26', ink: '#FFF4E4', sub: '#F4CDB8', accent: '#F2C14E', accentInk: '#3A1608', sofa: '#F1E2CC', sofa2: '#DCC7A8' },
    linen:  { name: 'Cream', bg: '#F3ECE2', bg2: '#E8DCCB', ink: '#2A211B', sub: '#6E6052', accent: '#B5543A', accentInk: '#FFF5EA', sofa: '#9AAE9A', sofa2: '#7E937E' },
    forest: { name: 'Green', bg: '#2F3E34', bg2: '#3A4B3F', ink: '#F6EEDF', sub: '#C9C1AE', accent: '#E3C79A', accentInk: '#2A211B', sofa: '#C98B5A', sofa2: '#A86E42' },
    navy:   { name: 'Blue', bg: '#1C2E4A', bg2: '#25395A', ink: '#F4F1EA', sub: '#BFC8D8', accent: '#F0B44C', accentInk: '#1C2E4A', sofa: '#D8C3A5', sofa2: '#BFA684' }
  };
  var TPL_ORDER = ['walnut', 'red', 'forest', 'linen', 'navy'];

  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function wrapLines(ctx, text, maxW) { var words = String(text).split(/\s+/).filter(Boolean), lines = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); return lines; }
  function fitText(ctx, text, maxW, maxLines, maxSize, minSize, weight, family) {
    var size = maxSize, lines = [];
    for (; size >= minSize; size -= 4) {
      ctx.font = weight + ' ' + size + 'px ' + family; lines = wrapLines(ctx, text, maxW);
      var widest = Math.max.apply(null, lines.map(function (l) { return ctx.measureText(l).width; }).concat([0]));
      if (lines.length <= maxLines && widest <= maxW) break;
    }
    return { size: Math.max(size, minSize), lines: lines };
  }
  function drawScene(ctx, x, y, w, h, t) {
    ctx.save(); rr(ctx, x, y, w, h, 28); ctx.clip();
    ctx.fillStyle = t.bg2; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(0,0,0,.07)'; ctx.fillRect(x, y + h * .78, w, h * .22);
    ctx.fillStyle = 'rgba(255,255,255,.10)'; var ax = x + w * .08, aw = w * .22, ay = y + h * .12, ah = h * .5; ctx.beginPath(); ctx.moveTo(ax, ay + ah); ctx.lineTo(ax, ay + aw / 2); ctx.arc(ax + aw / 2, ay + aw / 2, aw / 2, Math.PI, 0); ctx.lineTo(ax + aw, ay + ah); ctx.closePath(); ctx.fill();
    var lx = x + w * .86; ctx.strokeStyle = t.ink; ctx.globalAlpha = .85; ctx.lineWidth = Math.max(3, w * .006); ctx.beginPath(); ctx.moveTo(lx, y + h * .3); ctx.lineTo(lx, y + h * .78); ctx.stroke(); ctx.beginPath(); ctx.moveTo(lx - w * .04, y + h * .78); ctx.lineTo(lx + w * .04, y + h * .78); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = t.accent; ctx.beginPath(); ctx.moveTo(lx - w * .035, y + h * .18); ctx.lineTo(lx + w * .035, y + h * .18); ctx.lineTo(lx + w * .06, y + h * .31); ctx.lineTo(lx - w * .06, y + h * .31); ctx.closePath(); ctx.fill();
    var sw = w * .6, sx = x + (w - sw) / 2, sb = y + h * .78, sh = h * .36;
    ctx.fillStyle = t.sofa2; rr(ctx, sx + sw * .05, sb - sh, sw * .9, sh * .62, sh * .12); ctx.fill();
    ctx.fillStyle = t.sofa; rr(ctx, sx + sw * .12, sb - sh * .92, sw * .37, sh * .5, sh * .1); ctx.fill(); rr(ctx, sx + sw * .51, sb - sh * .92, sw * .37, sh * .5, sh * .1); ctx.fill();
    ctx.fillStyle = t.sofa2; rr(ctx, sx + sw * .06, sb - sh * .5, sw * .88, sh * .36, sh * .08); ctx.fill();
    ctx.fillStyle = t.sofa; rr(ctx, sx + sw * .1, sb - sh * .52, sw * .39, sh * .18, sh * .07); ctx.fill(); rr(ctx, sx + sw * .51, sb - sh * .52, sw * .39, sh * .18, sh * .07); ctx.fill();
    ctx.fillStyle = t.sofa2; rr(ctx, sx, sb - sh * .66, sw * .11, sh * .54, sh * .08); ctx.fill(); rr(ctx, sx + sw * .89, sb - sh * .66, sw * .11, sh * .54, sh * .08); ctx.fill();
    ctx.fillStyle = t.ink; ctx.globalAlpha = .8; [sx + sw * .07, sx + sw * .9].forEach(function (px) { ctx.fillRect(px, sb - sh * .14, sw * .025, sh * .14); }); ctx.globalAlpha = 1;
    ctx.fillStyle = t.accent; rr(ctx, sx + sw * .16, sb - sh * .78, sw * .14, sh * .26, sh * .06); ctx.fill();
    var px = x + w * .14, pb = sb; ctx.fillStyle = t.accent; ctx.globalAlpha = .9; rr(ctx, px - w * .035, pb - h * .1, w * .07, h * .1, 8); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = '#6F8F6A'; for (var i = 0; i < 6; i++) { ctx.save(); ctx.translate(px, pb - h * .1); ctx.rotate(-1.1 + i * .44); ctx.beginPath(); ctx.ellipse(0, -h * .08, w * .018, h * .08, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    ctx.restore();
  }
  var imgCache = {};
  function loadImg(src) { if (!src) return Promise.resolve(null); if (imgCache[src]) return imgCache[src]; imgCache[src] = new Promise(function (res) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src; }); return imgCache[src]; }
  var fontsReady = null;
  function ensureFonts() { if (!fontsReady) { fontsReady = Promise.all(['800 80px Fraunces', '700 80px Fraunces', '500 40px "DM Sans"', '700 40px "DM Sans"'].map(function (f) { return document.fonts ? document.fonts.load(f).catch(function () {}) : null; })).catch(function () {}); } return fontsReady; }
  function qrCanvas(text, size) { try { if (!global.QRious || !text) return null; var q = new global.QRious({ value: text, size: size, level: 'M', foreground: '#2A211B', background: '#FFFFFF', padding: Math.round(size * .06) }); return q.canvas || q.element || null; } catch (e) { return null; } }
  function shortUrl(u) { return String(u || '').replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, ''); }

  /* spec: {headline, sub, offer, cta, tpl, size:'square'|'story', photo (url)}; s: site settings */
  function render(spec, s, canvas) {
    var t = TPL[spec.tpl] || TPL.walnut, W = 1080, H = spec.size === 'story' ? 1920 : 1080;
    canvas.width = W; canvas.height = H; var ctx = canvas.getContext('2d');
    return Promise.all([ensureFonts(), loadImg(spec.photo), loadImg(LOGO_URL)]).then(function (r) {
      var photo = r[1], logo = r[2], M = 64, story = H > W;
      ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = .05; ctx.fillStyle = t.ink; for (var gy = 0; gy < H; gy += 6) ctx.fillRect(0, gy, W, 1); ctx.globalAlpha = 1;
      // brand
      if (logo) ctx.drawImage(logo, M, M, 62, 62); else { ctx.fillStyle = t.accent; rr(ctx, M, M, 62, 62, 12); ctx.fill(); }
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = t.ink; ctx.font = '700 32px Fraunces'; ctx.fillText(s.shopName || 'N.V. Home Decor', M + 80, M + 22);
      ctx.fillStyle = t.sub; ctx.font = '500 17px "DM Sans"'; ctx.fillText('FURNITURE  ·  MATTRESS  ·  UPHOLSTERY  ·  GIFTS', M + 81, M + 50);
      // picture
      var iy = M + 100, iw = W - M * 2, ih = story ? 900 : (photo ? 500 : 430);
      if (photo) { ctx.save(); rr(ctx, M, iy, iw, ih, 28); ctx.clip(); var sc = Math.max(iw / photo.width, ih / photo.height), dw = photo.width * sc, dh = photo.height * sc; ctx.drawImage(photo, M + (iw - dw) / 2, iy + (ih - dh) / 2, dw, dh); ctx.restore(); }
      else drawScene(ctx, M, iy, iw, ih, t);
      // offer burst
      if (spec.offer) {
        var br = story ? 128 : 112, bx = W - M - br + 22, by = iy + br - 18;
        ctx.save(); ctx.translate(bx, by); ctx.rotate(-.18); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 18; ctx.fillStyle = t.accent; ctx.beginPath();
        for (var k = 0; k < 32; k++) { var a = k / 32 * Math.PI * 2, rad = k % 2 ? br : br * .9; ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad); }
        ctx.closePath(); ctx.fill(); ctx.shadowBlur = 0;
        ctx.fillStyle = t.accentInk; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        var ft = fitText(ctx, String(spec.offer).toUpperCase(), br * 1.45, 3, 56, 22, '800', 'Fraunces'); ctx.font = '800 ' + ft.size + 'px Fraunces';
        var lh = ft.size * 1.02, oy = -(ft.lines.length - 1) * lh / 2; ft.lines.forEach(function (l, i) { ctx.fillText(l, 0, oy + i * lh); }); ctx.restore();
      }
      // headline + sub
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      var footerH = story ? 250 : 190, hy = iy + ih + (story ? 90 : 64), availH = H - footerH - hy - (spec.sub ? 64 : 16);
      var headline = spec.headline || 'Special Offer';
      var hf = fitText(ctx, headline, W - M * 2, story ? 4 : 2, story ? 124 : 100, 44, '800', 'Fraunces'), lh2 = hf.size * 1.02;
      while (hf.lines.length * lh2 > availH && hf.size > 44) { hf = fitText(ctx, headline, W - M * 2, hf.lines.length, hf.size - 6, 44, '800', 'Fraunces'); lh2 = hf.size * 1.02; }
      ctx.font = '800 ' + hf.size + 'px Fraunces'; ctx.fillStyle = t.ink; var yy = hy + hf.size * .78; hf.lines.forEach(function (l) { ctx.fillText(l, M, yy); yy += lh2; });
      if (spec.sub) { ctx.fillStyle = t.sub; var sf = fitText(ctx, spec.sub, W - M * 2, 2, story ? 42 : 36, 24, '500', '"DM Sans"'); ctx.font = '500 ' + sf.size + 'px "DM Sans"'; yy += sf.size * .35 - 6; sf.lines.forEach(function (l) { ctx.fillText(l, M, yy); yy += sf.size * 1.25; }); }
      // footer
      var fy = H - footerH, qs = story ? 170 : 132; ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fillRect(0, fy, W, footerH);
      var qy = fy + (footerH - qs) / 2, tx = M, qc = qrCanvas(s.fbUrl, qs * 2);
      if (qc) { ctx.fillStyle = '#fff'; rr(ctx, M - 6, qy - 6, qs + 12, qs + 12, 14); ctx.fill(); ctx.drawImage(qc, M, qy, qs, qs); tx = M + qs + 28; }
      var cy0 = fy + footerH / 2, ph = (s.phones || []).slice(0, 2).join('  ·  ');
      ctx.fillStyle = t.ink; ctx.font = '700 ' + (story ? 34 : 30) + 'px "DM Sans"'; ctx.fillText(ph ? '☎ ' + ph : (s.shopName || ''), tx, cy0 - (story ? 26 : 20));
      ctx.fillStyle = t.sub; var line2 = s.fbUrl ? 'Scan for our Facebook page' : (s.address || '');
      var lf = fitText(ctx, line2, W - tx - M - 280, 2, story ? 26 : 22, 15, '500', '"DM Sans"'); ctx.font = '500 ' + lf.size + 'px "DM Sans"';
      lf.lines.forEach(function (l, i) { ctx.fillText(l, tx, cy0 + (story ? 20 : 16) + i * lf.size * 1.25); });
      var cta = spec.cta || 'Visit us today'; ctx.font = '700 ' + (story ? 30 : 26) + 'px "DM Sans"';
      var cw = Math.min(ctx.measureText(cta).width + 64, 300), ch = story ? 74 : 62, cx = W - M - cw, cyy = fy + (footerH - ch) / 2;
      ctx.fillStyle = t.accent; rr(ctx, cx, cyy, cw, ch, ch / 2); ctx.fill(); ctx.fillStyle = t.accentInk; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      var cf = fitText(ctx, cta, cw - 36, 1, story ? 30 : 26, 15, '700', '"DM Sans"'); ctx.font = '700 ' + cf.size + 'px "DM Sans"'; ctx.fillText(cf.lines[0] || '', cx + cw / 2, cyy + ch / 2 + 1);
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      return canvas;
    });
  }
  global.NVPoster = { render: render, TPL: TPL, TPL_ORDER: TPL_ORDER, LOGO_SVG: LOGO_SVG, shortUrl: shortUrl };
})(window);
