import axios from 'axios';

export const getMatches = async (platform: string,  puuid: string, startTime: string, count: string ) => {
    const uri = `https://${platform}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?startTime=${startTime}&queue=420&count=${count}`;
    const config = {
        headers: {
            "X-Riot-Token": `${process.env.RIOT_API_KEY}`,
        },
    };

    try {
        const response = await axios.get(encodeURI(uri), config);
        return response.data
    } catch(err){
        if (err.response) {
            return null
        }
    }
}