import { usersInt } from "../database/models/usersModel";

export const lastMatch = async (user: usersInt, puuid: string, platform: string, matchId: string) => {
    
    
    for (let i = 0; i < user.accounts.length; i++) { 
        if ((user.accounts[i][0] == puuid) && (user.accounts[i][2] == platform)) {
            user.accounts[i][1] = matchId;
            user.markModified('accounts');
            await user.save();
            return user
            
        }
    }
}
