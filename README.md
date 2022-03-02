# LyricFinder

Scrapes from Genius to fetch useful song info including lyrics

## Example
```javascript
const geniuslyricfinder = require("geniuslyricfinder")
geniuslyricfinder.getLyrics("Primadonna")
    .then(r => console.log(r))
    .catch(e => console.log(e))
```