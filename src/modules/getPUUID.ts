import axios from 'axios';

export const getPUUID = async (platform: string, username: string) => {
    const uri = `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`;
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