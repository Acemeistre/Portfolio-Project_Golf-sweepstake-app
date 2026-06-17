// One-off script to fetch World Ranking data from Slash Golf API,
// trim to top 500, reshape, and save as a static JSON file.
//
// Run this from your project root with:
//   node fetchRankings.js

import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const apiKey = process.env.VITE_GOLF_SLASH_LEADERBOARDS_API_KEY

const fetchRankings = async () => {
    const url = "https://live-golf-data.p.rapidapi.com/stats?year=2026&statId=186"

    const response = await fetch(url, {
        headers: {
            'x-rapidapi-host': 'live-golf-data.p.rapidapi.com',
            'x-rapidapi-key': apiKey
        }
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch rankings: ${response.status}`)
    }

    const data = await response.json()

    const trimmed = data.rankings
        .slice(0, 500)
        .map(player => ({
            fullName: player.fullName,
            lastName: player.lastName,
            rank: Number(player.rank.$numberInt)
        }))

    fs.writeFileSync('./src/data/worldRankings.json', JSON.stringify(trimmed, null, 2))
    console.log(`Saved ${trimmed.length} players to src/data/worldRankings.json`)
}

fetchRankings().catch(error => console.error('Error:', error))