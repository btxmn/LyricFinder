const fetch = require('node-fetch');
const randomUseragent = require('random-useragent');
const cheerios = require('cheerio-without-node-native');
const htmlEntities = require("html-entities");

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
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'sec-ch-mobile': '?0',
                'x-requested-with': 'XMLHttpRequest',
                'cookie': '_genius_ab_test_cohort=66; _genius_ab_test_primis_mobile=control;',
                'referer': 'https://genius.com/search/embed',
                'referrer-policy': 'strict-origin-when-cross-origin',
                'user-agent': randomUseragent.getRandom(),
                'dnt': 1
            }
        })
        .then(r => r.json())
        .catch(e => { throw new Error("😢 Genius API dropped the request, retry in one second") });

        if (multiSearch.response && multiSearch.response.sections && multiSearch.response.sections[0] && multiSearch.response.sections[0].hits && multiSearch.response.sections[0].hits[0] && multiSearch.response.sections[0].hits[0].result && multiSearch.response.sections[0].hits[0].result.url) {
            const songMetadata = multiSearch.response.sections[0].hits[0].result

            const lyricsResponse = await fetch(songMetadata.url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'sec-ch-mobile': '?0',
                    'x-requested-with': 'XMLHttpRequest',
                    'cookie': '_genius_ab_test_cohort=66; _genius_ab_test_primis_mobile=control;',
                    'referer': 'https://genius.com/search/embed',
                    'referrer-policy': 'strict-origin-when-cross-origin',
                    'user-agent': randomUseragent.getRandom(),
                    'dnt': 1
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

            if (response.lyrics.length == 0) return getLyrics(query);
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