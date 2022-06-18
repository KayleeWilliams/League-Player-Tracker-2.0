export const convertChamp = async (champion: string) => {
    let displayName = ''
    switch(champion) { 
        case 'MonkeyKing': { 
            displayName = 'Wukong'; 
            break; 
        } 
        case 'TahmKench': { 
            displayName = 'Tahm Kench'; 
            break; 
        } 
        case 'TwistedFate': { 
            displayName = 'Twisted Fate'; 
            break; 
        } 
        case 'JarvanIV': { 
            displayName = 'Jarvan IV'; 
            break; 
        }
        case 'AurelionSol': { 
            displayName = 'Aurelion Sol'; 
            break; 
        } 
        case 'XinZhao': { 
            displayName = 'Xin Zhao'; 
            break; 
        }
        case 'MissFortune': { 
            displayName = 'Miss Fortune'; 
            break; 
        }
        case 'MasterYi': { 
            displayName = 'Master Yi'; 
            break; 
        }
        case 'Renata': { 
            displayName = 'Renata Glasc'; 
            break; 
        }
        case 'LeeSin': { 
            displayName = 'Lee Sin'; 
            break; 
        }
        case 'DrMundo': { 
            displayName = 'Dr. Mundo'; 
            break; 
        } 
        default: { 
            displayName = champion; 
            break; 
        } 
    } 

    return displayName
}