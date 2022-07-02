export const routing = async (input: string) => {

    // Convert the user input to the regional and platform routing values for
    // The Riot API https://developer.riotgames.com/docs/lol#_routing-values

    let platform = null;
    let region = null;
    switch (input.toUpperCase()) {
        case 'KR':
            platform = 'kr';
            region = 'asia';
            break;
        case 'JP':
            platform = 'jp1';
            region = 'asia';
            break;
        case 'EUW':
            platform = 'euw1';
            region = 'europe';
            break;
        case 'EUNE':
            platform = 'eun1';
            region = 'europe';
            break;
        case 'TR':
            platform = 'tr1';
            region = 'europe';
            break;
        case 'RU':
            platform = 'ru';
            region = 'europe';
            break;
        case 'NA':
            platform = 'na1';
            region = 'americas';
            break;
        case 'BR':
            platform = 'br1';
            region = 'americas';
            break;
        case 'LAN':
            platform = 'la1';
            region = 'americas';
            break;
        case 'LAS':
            platform = 'la2';
            region = 'americas';
            break;
        case 'OCE':
            platform = 'oc1';
            region = 'SEA';
            break;
        default:
            platform = null;
            region = null;
        }
    return new Array(input.toUpperCase(), platform, region);
}