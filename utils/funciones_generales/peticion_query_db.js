/** @module query_db_general */
import axios from 'axios';
import axiosTime from 'axios-time';
import { reg_metrica } from './registro_props_aws_emb.js';

axiosTime(axios);
axios.defaults.timeout = Number(process.env.TIMEOUT) || 300000;

/**
 * @description                                 Funcion general para las consultas sql con el evento "query_DB"
 * 
 * @param {String} datos.query_string           query en formato string       
 * @param {Object} datos.usuario                usuario para accede al web-service
 * @param {String} datos.pass                   contrasena para acceder al web-service 
 * @param {String} datos.url_web_serv           Url del web-service donde se realizaran las consultas 
 * @param {String} datos.los_mappings           Mapeo de la consulta y concatener hasta tres consultas individuales
 * 
 * @returns {Promise<Object>}
 */
export default async (datos) => {
    let self = {};
    try {
        const { query_string,
            usuario,
            pass,
            url_web_serv,
            los_mappings} = datos;

            
        self.resp_enter = await axios.post(`${url_web_serv.replace("ws.ashx", "qrydb.ashx")}`, {
            "query": query_string,
            "user": usuario,
            "pass": pass,
            "format": "json",
            "ignoreNullProperties": false,
            "jsonQuotedNames": true,
            "mappings": los_mappings
        }, {
            headers: {
                'User-Agent': `TodoTerreno-${usuario}`
            }
        }).catch(manejador_de_errores);

        if (self.resp_enter.timings) {
            if (self.resp_enter.timings.elapsedTime) {
                var este = [{ unidad: "Milliseconds", valor: self.resp_enter.timings.elapsedTime, nom_metrica: "time_peticion_pwst" }]
                await reg_metrica(este)
                .catch(manejador_de_errores)
                // .catch(err => {
                //     throw err
                // })
            } else {
                var este = [{ unidad: "Milliseconds", valor: 0, nom_metrica: "time_peticion_pwst" }]
                await reg_metrica(este)
                .catch(manejador_de_errores)
                // .catch(err => {
                //     throw err
                // });
            }
        }

        if (self.resp_enter.headers['x-powerstreeterror'] != undefined) throw new Error(`en la consulta a enterprise:${self.resp_enter.headers['x-powerstreeterror']} `);

        self.ped_sug = self.resp_enter.data;

        return {
            valido: true,
            data: self.ped_sug
        }

    } catch (err) {
        // console.log("<<<<<catch>>>>>", err.message || err)
        return {
            valido: false,
            error: err.message || err
        }
    }
}

const manejador_de_errores = (err) => {
    //console.log("<<<<<manejador de err>>>>>", err)
    throw new Error(err);
}