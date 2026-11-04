const fs = require('fs');
const path = require('path');

async function syncTypeRacer() {
  const username = 'grv97';
  let stats = null;

  // 1. Try direct fetch
  try {
    console.log('Attempting direct API fetch from data.typeracer.com...');
    const res = await fetch(`https://data.typeracer.com/users?id=tr:${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.tstats) {
        stats = {
          wpm: Math.round(data.tstats.wpm || 0),
          recentAvgWpm: Math.round(data.tstats.recentAvgWpm || data.tstats.wpm || 0),
          bestGameWpm: Math.round(data.tstats.bestGameWpm || 0),
          gamesPlayed: data.tstats.cg || 0,
          updatedAt: new Date().toISOString()
        };
        console.log('Direct API fetch succeeded!');
      }
    } else {
      console.log(`Direct fetch returned HTTP status ${res.status}`);
    }
  } catch (err) {
    console.log('Direct fetch error:', err.message);
  }

  // 2. If blocked by Cloudflare (403), use Puppeteer in headless browser
  if (!stats) {
    console.log('Using Puppeteer with headless Chromium to bypass Cloudflare challenge...');
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

      await page.goto(`https://data.typeracer.com/pit/profile?user=${username}`, {
        waitUntil: 'networkidle2',
        timeout: 45000
      });

      // Allow 4 seconds for challenge resolution
      await new Promise(r => setTimeout(r, 4000));

      const jsonStr = await page.evaluate(async (u) => {
        const resp = await fetch(`https://data.typeracer.com/users?id=tr:${u}`);
        return resp.text();
      }, username);

      const data = JSON.parse(jsonStr);
      if (data && data.tstats) {
        stats = {
          wpm: Math.round(data.tstats.wpm || 0),
          recentAvgWpm: Math.round(data.tstats.recentAvgWpm || data.tstats.wpm || 0),
          bestGameWpm: Math.round(data.tstats.bestGameWpm || 0),
          gamesPlayed: data.tstats.cg || 0,
          updatedAt: new Date().toISOString()
        };
        console.log('Puppeteer challenge solve succeeded!');
      }
    } finally {
      await browser.close();
    }
  }

  if (!stats) {
    throw new Error('Failed to retrieve TypeRacer statistics.');
  }

  const outDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, 'typeracer.json');
  fs.writeFileSync(outFile, JSON.stringify(stats, null, 2));
  console.log('Saved TypeRacer stats to', outFile, stats);
}

syncTypeRacer().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});

