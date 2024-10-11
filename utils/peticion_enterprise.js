import axios from "axios";
import axiosTime from 'axios-time';
import generar_token from './generar_token.js';
import { reg_metrica } from './funciones_generales/registro_props_aws_emb.js';

axiosTime(axios);

axios.defaults.timeout = Number(process.env.TIMEOUT) || 300000;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const SCRIPT = "peticion_enterprise"
const URL_PETICIONES_ENTERPRISE = process.env.URL_PETICIONES_ENTERPRISE || 'https://test-logs.pwstasp.com.uy/api/peticiones_enterprise_generico/';

/**
 * @param {Object} datos - Objeto que contiene los parametros de la petición a Enterprise.
 * @param {String} req.query - Query que sera ejecutado en Enterprise.
 * @param {Number} req.columnas - Numero de columnas que se esperan como respuesta.
 * @param {String} req.usuario - Usuario de conexión a Enterprise.
 * @param {String} req.clave - Contraseña de conexión a Enterprise.
 * @param {intentos} req.intentos - CNumero de reintentos, si hay un error.
 * @return {Promise<Object>} - Respuesta de enterprise
 *
 * @description Esta función envia una petición al microservicio de peticiones de enterprise un query.
 */
export default async datos => {
    try {
        const { evento, datos_enterprise, script, base, usuario } = datos;

        // Generar fecha
        let dia, mes;
        let fecha = new Date();
        if (fecha.getDate() < 10) { dia = '0' + fecha.getDate() } else { dia = fecha.getDate() }
        if (fecha.getMonth() < 8) { mes = '0' + (fecha.getMonth() + 2) } else { mes = fecha.getMonth() + 2 }
        fecha = `${mes}/${dia}/${fecha.getFullYear()}`

        const token = await generar_token({ fecha: fecha, base: base, usuario: usuario }).catch(err => {
            throw new Error(err)
        });
        //if(token){ console.log('Se genero el token')}
        //console.log("<<<<<TOKEN>>>>>",token)
        setTimeout(() => {
            if (res === null) {
                source.cancel();
            }
        }, Number(process.env.TIMEOUT) || 300000);

        let res = await axios.post(
            URL_PETICIONES_ENTERPRISE + 'ejecutar_script',
            {
                pais: {
                    codigo: "CO",
                    nombre: "Colombia"
                },
                proyecto: "todoterrono",
                microservicio: "aprobacion",
                evento: evento,
                datos_enterprise: datos_enterprise,
                script: script,
                base: base,
                usuario: usuario,
                nombre_instancia: "instancia por definir",
                tipo_salida: "xml_json"
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "User-Agent": `WEB - ${usuario}`
                },
            }
        ).catch((err) => {
            throw new Error(`${SCRIPT} Error en el servidor de peticiones enterprise: ${err}`)
        });


        if (res.timings) {
            if (res.timings.elapsedTime) {
                var este = [{ unidad: "Milliseconds", valor: res.timings.elapsedTime, nom_metrica: "time_peticion_pwst" }]
                await reg_metrica(este)
                .catch(manejador_errores)
                // .catch(err => {
                //     throw err
                // })
            } else {
                var este = [{ unidad: "Milliseconds", valor: 0, nom_metrica: "time_peticion_pwst" }]
                await reg_metrica(este)
                .catch(manejador_errores)
            //     .catch(err => {
            //         throw err
            //     });
            }
        }

        return res;
    } catch (err) {
        throw new Error(err)
    }

}

const manejador_errores = err => {
    throw err;
};