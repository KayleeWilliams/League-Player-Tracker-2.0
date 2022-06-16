import { Document, model, Schema } from "mongoose";

export interface usersInt extends Document {
  discordId: string;
  serverId: string;
  accounts: string[][];
}

export const user = new Schema({
  discordId: String,
  serverId: String,
  accounts: Array,
});

export default model<usersInt>("user", user);   