# LyricFinder

Scrapes from Genius to fetch useful song info including lyrics

## Example
```javascript
const geniuslyricfinder = require("geniuslyricfinder")
geniuslyricfinder.getLyrics("afterglow becky hill")
    .then(r => console.log(r))
    .catch(e => console.log(e))
```

## Response
```javascript
{
  artist: 'Wilkinson & Becky Hill',
  song: 'Afterglow',
  thumbnail: 'https://images.genius.com/d8a609e40816a1ccb0474122ced0f166.1000x1000x1.jpg',
  lyrics: "Even though the dancing's done\n" +
    "Don't worry cause the night is young\n" +
    'Who cares where we go\n' +
    "We're ready for the afterglow\n" +
    '\n' +
    'Someone hold the sunlight back\n' +
    'Cause we want this night to last\n' +
    '\n' +
    'Smoke and lasers, love and ravers\n' +
    "Afterglow, we're ready for the afterglow\n" +
    'Lights and action, strong attraction\n' +
    "Afterglow, we're ready for the afterglow\n" +
    'Oh baby, baby\n' +
    '\n' +
    "Afterglow, we're ready for the afterglow\n" +
    '\n' +
    "We're ready for the afterglow!\n" +
    '\n' +
    "Even though the dancing's done\n" +
    "Don't worry cause the night is young\n" +
    'Who cares where we go\n' +
    "We're ready for the afterglow\n" +
    '\n' +
    'Someone hold the sunlight back\n' +
    'Cause we want this night to lastSmoke and lasers, love and ravers\n' +
    "Afterglow, we're ready for the afterglow\n" +
    'Lights and action, strong attraction\n' +
    "Afterglow, we're ready for the afterglow\n" +
    'Oh baby, baby\n' +
    'Strong attraction\n' +
    'Oooh, oooh\n' +
    "Afterglow, we're ready for the afterglow"
}
```