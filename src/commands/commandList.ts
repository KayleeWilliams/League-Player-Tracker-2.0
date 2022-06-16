import { command } from "../interfaces/command";
import { accounts } from "./accounts";
import { add } from "./add";


export const commandList: command[] = [accounts, add];