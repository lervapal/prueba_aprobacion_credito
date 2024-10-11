import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

/**
 *
 * Evento que obtiene keys del secret manager   
 *  @param {Object} event             Objeto datos de entrada 
 *  @param {String} event.secretId    Nombre de la key a obtener
 *  @param {String} event.region      Nombre de la region  donde se buscara la key  
 *
 * @returns {String}                  Datos  de la key obtenida 
 * 
 */
export default async (event) => {
    let response;
    let result
    try {
      let data = event?.body ? JSON.parse(event.body) : event
    
      const secretManagerClient = new SecretsManagerClient({ region: data.region });
    
      const command = new GetSecretValueCommand({
        SecretId: data.secretId,
      });
    
      result = await secretManager({ secretManagerClient, command }).catch(err => {
        throw err
      })
    
    
    
      var secretos = JSON.parse(result.SecretString ? result.SecretString : "{}");
    
      if (Object.keys(secretos).length == 0) {
        throw `no existe valores en secret`
      }
    
      return secretos
    } catch (err) {
      throw new Error(`No se puede obtener los secretos config ${err.message || err}`)
    }
};

const secretManager = async (data) => {
  try {
    let { secretManagerClient, command } = data;

    let result = await secretManagerClient.send(command)
      .catch(err => {
        //console.error(err)
        throw new Error(err)
      });

    return result;
  } catch (err) {
    //console.error("error secret manager -> ", err)
    throw new Error(err)
  }
}