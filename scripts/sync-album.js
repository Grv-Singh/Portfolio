const fs = require('fs');
const path = require('path');

async function syncAlbum() {
  const albumUrl = 'https://photos.app.goo.gl/46GVaVPFXTvs9gCR8';
  console.log('Fetching Google Photos album:', albumUrl);

  try {
    const res = await fetch(albumUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    const pattern = /https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_-]+/g;
    const matches = html.match(pattern) || [];
    const unique = [...new Set(matches)];

    if (unique.length === 0) {
      console.log('No photos found or album format changed.');
      return;
    }

    const photos = unique.map((u, i) => ({
      url: `${u}=w800`,
      title: i === 0 ? 'Original Art & Sketches' : i === 1 ? 'Illustration & Portrait' : `Art Piece #${i + 1}`,
      tag: 'Gallery'
    }));

    const outData = {
      updatedAt: new Date().toISOString(),
      albumUrl,
      totalPhotos: photos.length,
      photos
    };

    const outDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outFile = path.join(outDir, 'art-photos.json');
    fs.writeFileSync(outFile, JSON.stringify(outData, null, 2));
    console.log(`Successfully synced ${photos.length} photos to ${outFile}`);
  } catch (err) {
    console.error('Error syncing Google Photos album:', err);
    process.exit(1);
  }
}

syncAlbum();

