import { getMatches } from "./getMatches";
import axios from 'axios';

export const getMatchData = async (region: string,  puuid: string, matchId: string) => {
    // Get account matches
    const uri = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
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
                const csAverage = (csTotal / gameMinutes).toFixed(1);

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
                    matchId: matchId,
                };

                return data
            }
        }
    } catch(err){
        if (err.response) {
            return null
        }
    }
}