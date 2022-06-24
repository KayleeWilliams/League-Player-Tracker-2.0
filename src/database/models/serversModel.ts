import { Document, model, Schema } from "mongoose";

export interface serversInt extends Document {
  serverId: string;
  channelId: string;
  matchUrl: Boolean,
  matchInfo: Boolean,
  date: Number, 

}

export const server = new Schema({
  serverId: String,
  channelId: String,
  matchUrl: Boolean,
  matchInfo: Boolean,
  date: Number, 
});

export default model<serversInt>("server", server);   