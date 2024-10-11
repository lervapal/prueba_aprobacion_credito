export const Responses = {
    _200(data={}){
        return {
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
            },
            statusCode: 200,
            body: JSON.stringify(data)
        }
    },

    _400(data={}){
        return {
            headers:{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
                "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
            },
            statusCode: 400,
            body: JSON.stringify(data)
        }
    }
};

export default  Responses;