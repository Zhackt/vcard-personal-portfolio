// Penangkap tes webhook CJ Kreasi — SEMENTARA, hanya untuk diagnosis.
// GET: echo hub.challenge kalau verify token cocok (verifikasi Meta).
// POST: teruskan body ke webhook.site buat dicatat, lalu balas 200.
// HAPUS file ini + kembalikan webhook ke bot setelah tes selesai.
const FORWARD_URL = 'https://webhook.site/0c1c0353-c27e-451a-914a-ee19b53a9853';
const VERIFY_TOKEN = 'cj-kreasi-verify';

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const q = req.query || {};
    if (q['hub.mode'] === 'subscribe' && q['hub.verify_token'] === VERIFY_TOKEN) {
      res.status(200).send(q['hub.challenge'] || '');
      return;
    }
    res.status(200).send('catcher ok');
    return;
  }
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
      await fetch(FORWARD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    } catch (e) { /* teruskan gagal pun tetap balas 200 ke Meta */ }
    res.status(200).send('ok');
    return;
  }
  res.status(405).send('method not allowed');
};
