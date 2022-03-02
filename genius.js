const fetch = require('node-fetch');
const randomUseragent = require('random-useragent');
const cheerios = require('cheerio-without-node-native');
const htmlEntities = require("html-entities")

const getLyrics = async (query) => {
    try {
        const response = {
            artist: "",
            song: "",
            thumbnail: "",
            lyrics: ""
        }

        const multiSearch = await fetch(`https://genius.com/api/search/multi?q=${query}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-GB,en;q=0.9',
                'sec-ch-mobile': '?0',
                'sec-ch-ua-platform': 'MacPro',
                'x-requested-with': 'XMLHttpRequest',
                'cookie': '_ga=1',
                'referer': 'https://genius.com/search/embed',
                'referrer-policy': 'strict-origin-when-cross-origin',
                'user-agent': randomUseragent.getRandom()
            }
        })
        .then(r => r.json())
        .catch(e => { throw new Error("😢 Genius API failed to search for that song") });

        if (multiSearch.response && multiSearch.response.sections && multiSearch.response.sections[0] && multiSearch.response.sections[0].hits && multiSearch.response.sections[0].hits[0] && multiSearch.response.sections[0].hits[0].result && multiSearch.response.sections[0].hits[0].result.url) {
            const songMetadata = multiSearch.response.sections[0].hits[0].result

            const lyricsResponse = await fetch(songMetadata.url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-GB,en;q=0.9',
                    'sec-ch-mobile': '?0',
                    'sec-ch-ua-platform': 'MacPro',
                    'x-requested-with': 'XMLHttpRequest',
                    'cookie': '_ga=1',
                    'referer': 'https://genius.com/search/embed',
                    'referrer-policy': 'strict-origin-when-cross-origin',
                    'user-agent': randomUseragent.getRandom()
                }
            })
            .then(r => r.text()
            .then(j => j))
            .catch(e => { throw new Error("😢 Genius API failed to fetch the lyrics") });

            const $ = cheerios.load(lyricsResponse);
            await $('[class^=Lyrics__Container]').each((i, el) => {
                const html = $(el).html()
                const lined = html.replace(/<br\s*[\/]?>/gi, "\n")
                const stripped = lined.replace(/<[^>]+>/ig, '')
                const trimmed = stripped.trim()
                response.lyrics += htmlEntities.decode(trimmed)
            });

            response.artist = songMetadata["artist_names"]
            response.song = songMetadata["title"]
            response.thumbnail = songMetadata["song_art_image_url"]
           
            return response
        } else {
            return new Error("😢 The search response contains malformed data")
        }
    } catch (error) {
        throw error;
    }
}

module.exports = getLyrics;