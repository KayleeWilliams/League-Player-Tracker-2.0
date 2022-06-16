import { Document, model, Schema } from "mongoose";

export interface serversInt extends Document {
  serverId: string;
  channelId: string;
  date: Number, 

}

export const server = new Schema({
  serverId: String,
  channelId: String,
  date: Number, 
});

export default model<serversInt>("server", server);   