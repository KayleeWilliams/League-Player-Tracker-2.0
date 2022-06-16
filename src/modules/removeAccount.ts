import { usersInt } from "../database/models/usersModel";

export const removeAccount = async (user: usersInt,  puuid: string, platform: any) => {
    // Check if new account is already there 
    let found = false
    let pos = 0
    for (let i = 0; i < user.accounts.length; i++) { 
        if ((user.accounts[i][0] == puuid) && (user.accounts[i][2] == platform)) {
            found = true;
            pos = i;
            break;
        }
    }

    // If the account exists remove it
    if  (found) {
        user.accounts.splice(pos, 1);
        await user.save();
        return user
    }

    else {
        return null
    }

}
