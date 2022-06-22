import axios from 'axios';

export const queryRiot = async (uri: string) => {
    const config = {
        headers: {
            "X-Riot-Token": `${process.env.RIOT_API_KEY}`,
        },
    };

    try {
        const response = await axios.get(encodeURI(uri), config);
        return response.data
    } 
    
    catch(err){
        if (err.response) {
            // console.log(err.response);
            return null
        }
    }

}
