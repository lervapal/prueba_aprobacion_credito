import peticion_query_db from './funciones_generales/peticion_query_db.js';
import peticion_web_service from './funciones_generales/peticion_web_service.js';
import * as pug from 'pug';

const SCRIPT = "[peticion_general]";

/**
 * @description                                 Funcion donde se realiza una consulta sql con dos distintas opciones query_DB o consulta_simple
 * 
 * @function peticion_query_db                  consulta sql usando el evento query_db del web-service retorna una respuesta en formato json
 * @function peticion_web_service               consulta sql usando el evento tradicional consulta_simple del web-service retorna una respuesta en xml
 * 
 * @param {Object} parametros                   parametros de la consulta
 * @param {String} parametros.usuario           usuario para accede al web-service
 * @param {String} parametros.clave             contrasena para acceder al web-service
 * @param {String} parametros.url_pwst          url del webservice donde se realiza la consulta sql
 * @param {String} parametros.parametros_sql    datos o variables para la consulta sql
 * @param {Boolean} parametros.tipo_pet         tipo de consulta si el valor es true significa una consulta querydb, si el valor es false significa una consulta simple con formato xml
 * @param {pug} query                           consulta query en formato pug
 * @param {Number} columnas                     numero de columnas o campos de cada registro de la consulta sql(solo es nesesario si es un tipo de consulta simple con valor "false")
 * @returns {Promise<Object[]>}                 Respuesta de la consulta en una lista json o un arreglo bidimencional
 * @throws {Error} 
 */
export default async (parametros, query, columnas) => {
    let self = {};
    try {
        let { usuario, clave, url_pwst, parametros_sql, tipo_pet } = parametros;
        let intentos = 0;
        let datos_brutos_web_service;
        self.com_parametros = pug.compile(query);
        self.sql_query = self.com_parametros(parametros_sql)
        if (tipo_pet) {
            // console.log("PETCION POR QUERY_DB")
            do {
                datos_brutos_web_service = await peticion_query_db({
                    query_string: self.sql_query,
                    usuario,
                    pass: clave,
                    url_web_serv: url_pwst,
                    los_mappings: []
                }).catch(err => { 
                    // console.error("Petcion error query db -> ", err); 
                    throw new Error(`Petcion error query db -> ${err}`)
                })

                intentos++;
            } while (!datos_brutos_web_service.valido && intentos < 3);

            if (!datos_brutos_web_service.valido) {
                throw new Error(datos_brutos_web_service.error)
            } else {
                if (!datos_brutos_web_service.data && datos_brutos_web_service.error) {
                    throw new Error(datos_brutos_web_service.error);
                }

                var filas = datos_brutos_web_service.data;

                var res = [];
                var otro = [];
                if (filas.Table[0]) {
                    let las_llaves = Object.keys(filas.Table[0]);
                    filas.Table.forEach(fila => {
                        otro = [];
                        las_llaves.forEach(item => {
                            if (typeof fila[`${item}`] == "string") {
                                fila[`${item}`] = fila[`${item}`].trim()
                            }

                        })
                    });
                }


                return filas.Table

            }
        } else {
            //console.log("CUAL ES LA QUERY --->", query)
            // console.log("PETCION POR CONSULTA_SIMPLE")
            do {
                datos_brutos_web_service = await peticion_web_service('ConsultaServicioSimple', {
                    query: self.sql_query,
                    columnas,
                    usuario,
                    clave
                }, url_pwst).catch(err => {
                    // console.error(err);
                    throw new Error(`Petcion error consulta simple -> ${err}`)
                });
                intentos++;
            } while (!datos_brutos_web_service.valido && intentos < 3);
            if (!datos_brutos_web_service.valido) {
                throw new Error(datos_brutos_web_service.error);
            } else {
                if (!datos_brutos_web_service.resultado["soap:envelope"] && datos_brutos_web_service.resultado["SOAP-ENV:envelope"]["SOAP-ENV:body"]["0"]["SOAP-ENV:fault"]["0"].detail["0"]["pwst:errorinfo"]["0"]["pwst:error"]["0"]["pwst:message"]["0"]) {
                    throw new Error(datos_brutos_web_service.resultado["SOAP-ENV:envelope"]["SOAP-ENV:body"]["0"]["SOAP-ENV:fault"]["0"].detail["0"]["pwst:errorinfo"]["0"]["pwst:error"]["0"]["pwst:message"]["0"]);
                }

                var filas = datos_brutos_web_service.resultado["soap:envelope"]["soap:body"][0].ConsultaServicioSimpleResponse[0].ConsultaServicioSimpleReturn[0].respuesta[0].Fila;
                var res = [];
                filas.forEach(fila => {
                    // Por que este conjunto de caracteres?? ~®~
                    // Por que en una base de pmm hay clientes con \ (pipes)
                    // entonces, nos imaginamos que este conjunto de
                    // caracteres es suficientemente raro y complejo
                    // para no ser repetido por el contenido de algun campo
                    let valores = fila.split("~®~");
                    res.push(valores);
                });

                var respuesta = res.map(fila => fila.map(columna => {
                    columna = columna.split(" ");
                    columna = columna.map(dato => dato)
                    return columna.join(" ");
                }));

                //console.log("QUE MAPEA ---A>>>>>>> ", respuesta)

                return respuesta

            }
        }
    } catch (err) {
        //console.error(SCRIPT, err.message || err)
        throw new Error(err.message || err)
    }
}

const manejador_errores = (err) => {
    throw err
}