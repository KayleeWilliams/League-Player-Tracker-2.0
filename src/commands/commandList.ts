import { command } from "../interfaces/command";
import { accounts } from "./accounts";
import { add } from "./add";
import { remove } from "./remove";
import { channel } from "./channel";

export const commandList: command[] = [accounts, add, remove, channel];