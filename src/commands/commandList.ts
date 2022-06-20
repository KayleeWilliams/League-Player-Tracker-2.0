import { command } from "../interfaces/command";
import { accounts } from "./accounts";
import { add } from "./add";
import { remove } from "./remove";
import { channel } from "./channel";
import { summary } from "./summary";

export const commandList: command[] = [accounts, add, remove, channel, summary];