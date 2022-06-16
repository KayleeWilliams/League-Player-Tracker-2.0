import { usersInt } from "../database/models/usersModel";

//export const newAccount = async (User: usersInt, puuid: string, platform: string, region: string, display:string): Promise<usersInt | undefined> => {
export const newAccount = async (user: usersInt,  puuid: string, platform: any, region: any, display: any) => {
    // The new account
    const account: string[] = [puuid, 'Latest Match', platform, region, display]

    // Check if new account is already there 
    let found = false
    for (let i = 0; i < user.accounts.length; i++) { 
        if ((user.accounts[i][0] == puuid) && (user.accounts[i][2] == platform)) {
            found = true
        }
    }

    // If the account doesn't exist add it
    if  (!found) {
        user.accounts.push(account);
        await user.save();
        return user
    }

    else {
        return null
    }

}
