import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

class DynamoBase {
    constructor(latabla) {
        this.tabla = latabla
        this.dbdynamo = docClient
    }

    /**
     * 
     * @param {object} datositem 
     * @returns {object}
     */
    insertardatos = async (datositem) => {
        try {
            let parametros = new PutCommand({
                TableName: this.tabla,
                Item: {
                    ...datositem
                },
            });

            const response = await docClient.send(parametros).catch(err => {
                throw new Error(err);
            });
            //console.log("response insertardatos dynamo: ", response)
            return response

        } catch (err) {
            //console.log("no se pudo guardar la peticion ===> ", err);
            throw new Error(err)
        }
    }

    /**
     * 
     * @param {object} filtros 
     * @returns {object}
     */
    seleccionar = async (filtros) => {
        try {
            let parametros = new GetCommand({
                TableName: this.tabla,
                Key: {
                    ...filtros
                },
            });

            const response = await docClient.send(parametros);
            //console.log(response);
            return response;
        } catch (err) {
            //console.log("error seleccion ===> ", err);
            throw new Error(err);
        }
    }

    /**
     * 
     * @param {object} itemfiltro 
     * @param {string} stringUpdateexp 
     * @param {object} itemvalores 
     * @param {object} atributosNombres 
     * @returns 
     */
    actualizaritem = async (itemfiltro, stringUpdateexp, itemvalores, atributosNombres) => {
        try {// para mayor informacion consultar https://docs.aws.amazon.com/es_es/amazondynamodb/latest/developerguide/GettingStarted.UpdateItem.html
            let parametros = new UpdateCommand({
                TableName: this.tabla,
                Key: {
                    ...itemfiltro // {Breed: "Labrador",}
                },
                UpdateExpression: stringUpdateexp,//"set Color = :color",
                ExpressionAttributeValues: {
                    ...itemvalores //":color": "black",
                },
                ExpressionAttributeNames: {
                    ...atributosNombres
                },
                ReturnValues: "ALL_NEW",// retornar valores
            });

            let response = await docClient.send(parametros);
            //------------------------ EJEMPLO-------------------
            /*new UpdateCommand({
                TableName: "Dogs",
                Key: {
                  OrderID:"660927eb-93f5-4a7b-82e1-cdfb63ce6b81",
                TakerClass: "eordering-MEX-01"
                },
                UpdateExpression: "SET #Status = :Status",
                ExpressionAttributeValues: {
                  ":Status":[
                        {
                          Error: {
                                Code: 400,
                                Mensaje:  "Error: No se especifico la propiedad sku"
                            },
                          Message: 'Error en validacion, no se logro ingresar la orden en queue',
                          Code: 403,
                          Date: 1700679785913
                        }
                    ],
                },
                ExpressionAttributeNames:{
                    "#Status": "Status"
                },
                ReturnValues: "ALL_NEW",// RETORNA LOS NUEVOS VALORES
              });*/
            //console.log(response);
            return response;

        } catch (err) {
            //console.log("error actualizacion ===> ", err);
            throw new Error(err)
        }
    }


}


export default DynamoBase;