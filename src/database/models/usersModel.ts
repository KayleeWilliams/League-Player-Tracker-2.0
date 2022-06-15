import { Document, model, Schema } from "mongoose";

export interface usersInt {
  discordId: string;
  serverId: string;
  accounts: [];
}

export const user = new Schema({
  discordId: String,
  serverId: String,
  accounts: Array,
});

export default model<usersInt>("user", user);   