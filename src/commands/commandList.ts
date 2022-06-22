import { command } from "../interfaces/command";
import { accounts } from "./accounts";
import { add } from "./add";
import { remove } from "./remove";
import { summary } from "./summary";
import { settings } from "./settings";


export const commandList: command[] = [accounts, add, remove, summary, settings];