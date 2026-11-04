const fs = require('fs');
const path = require('path');

async function syncINaturalist() {
  const username = 'grv97';
  const url = `https://api.inaturalist.org/v1/observations?user_id=${username}&order=desc&order_by=created_at&per_page=12`;
  console.log('Fetching iNaturalist observations for:', username);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      console.log('No observations found.');
      return;
    }

    const observations = data.results.map(r => {
      const photoObj = (r.photos && r.photos[0]) || (r.taxon && r.taxon.default_photo);
      const photoUrl = photoObj && photoObj.url ? photoObj.url.replace('square', 'medium') : null;
      const title = r.species_guess || (r.taxon && (r.taxon.preferred_common_name || r.taxon.name)) || 'Wild Observation';
      const cleanLoc = r.place_guess ? r.place_guess.split(',').slice(-2).join(', ').trim() : 'India';
      return {
        id: r.id,
        uri: r.uri || `https://www.inaturalist.org/observations/${r.id}`,
        title: title.charAt(0).toUpperCase() + title.slice(1),
        location: cleanLoc,
        photo: photoUrl,
        observedOn: r.observed_on || ''
      };
    }).filter(x => x.photo);

    const outData = {
      updatedAt: new Date().toISOString(),
      username,
      profileUrl: `https://www.inaturalist.org/observations/${username}`,
      totalResults: data.total_results || observations.length,
      observations
    };

    const outDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outFile = path.join(outDir, 'inaturalist.json');
    fs.writeFileSync(outFile, JSON.stringify(outData, null, 2));
    console.log(`Successfully synced ${observations.length} iNaturalist observations to ${outFile}`);
  } catch (err) {
    console.error('Error syncing iNaturalist:', err);
    process.exit(1);
  }
}

syncINaturalist();

