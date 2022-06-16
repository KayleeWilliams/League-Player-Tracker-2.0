import { usersInt } from "../database/models/usersModel";

//export const newAccount = async (User: usersInt, puuid: string, platform: string, region: string, display:string): Promise<usersInt | undefined> => {
export const newAccount = async (user: usersInt,  puuid: string, platform: any, region: any, display: any) => {
    const account: string[] = [puuid, 'Latest Match', platform, region, display]
    user.accounts.push(account);
    await user.save();
    return user;
}
