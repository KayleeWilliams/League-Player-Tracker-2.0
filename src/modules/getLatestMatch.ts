import { getMatches } from "./getMatches";
import axios from 'axios';

export const getLatestMatch = async (region: string,  puuid: string, lastMatch: string) => {
    // Get account matches
    const matches = await getMatches(region, puuid, Math.floor((Date.now() / 1000) - 3600));

    if ((matches != null) && (matches[0] != lastMatch)) {
        const uri = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matches[0]}`;
        const config = {
            headers: {
                "X-Riot-Token": `${process.env.RIOT_API_KEY}`,
            },
        };

        try {
            const response = await axios.get(encodeURI(uri), config);
            
            // Loop through participiants till matching
            for (let participant of response.data.info.participants) {
                if (participant.puuid == puuid) {

                    // Calculate game length
                    const epoch = response.data.info.gameDuration;
                    const gameMinutes = Math.floor(epoch / 60);
                    const gameSeconds = epoch % 60;

                    // Get average & total creep score
                    const csTotal = participant.totalMinionsKilled + participant.neutralMinionsKilled;
                    const csAverage = (csTotal / gameMinutes).toFixed(2);

                    let position = null;

                    // Set posistions and make them presentable
                    if (participant.individualPosition == 'UTILITY') {
                        position = 'Support';
                    }

                    else {
                        position = participant.individualPosition.charAt(0).toUpperCase() + participant.individualPosition.substr(1).toLowerCase();
                    }

                    const data = {
                        win: participant.win,
                        champ: participant.championName,
                        kda: [participant.kills, participant.deaths, participant.assists],
                        position: position,
                        csTotal: csTotal,
                        csAverage: csAverage,
                        gameLength: [gameMinutes, gameSeconds],
                        matchId: matches[0],
                    };

                    return data
                }
            }
        } catch(err){
            if (err.response) {
                return null
            }
        }

    } else {
        return null
    }
}