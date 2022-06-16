import axios from 'axios';

export const getUsername = async (platform: string, puuid: string) => {
    const uri = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    const config = {
        headers: {
            "X-Riot-Token": `${process.env.RIOT_API_KEY}`,
        },
    };

    const response = await axios.get(encodeURI(uri), config)
    return response.data
}