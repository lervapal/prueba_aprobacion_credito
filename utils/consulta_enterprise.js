import axios from "axios";
import axiosTime from 'axios-time';
import generar_token from './generar_token.js';
import { reg_metrica } from './funciones_generales/registro_props_aws_emb.js';

axiosTime(axios);
axios.defaults.timeout = Number(process.env.TIMEOUT) || 300000;
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const SCRIPT = "consulta_enterprise";

const URL_PETICIONES_ENTERPRISE = process.env.URL_PETICIONES_ENTERPRISE || 'https://test-logs.pwstasp.com.uy/api/peticiones_enterprise_generico/';

export default async (datos) => {
    try {
        const { evento, datos_query, query, base, usuario } = datos;

        // Generar fecha
        let dia, mes;
        let fecha = new Date();
        if (fecha.getDate() < 10) { dia = '0' + fecha.getDate() } else { dia = fecha.getDate() }
        if (fecha.getMonth() < 8) { mes = '0' + (fecha.getMonth() + 2) } else { mes = fecha.getMonth() + 2 }
        fecha = `${mes}/${dia}/${fecha.getFullYear()}`

        const token = await generar_token({ fecha: fecha, base: base, usuario: usuario });
        //if(token){ console.log('Se genero el token >>> '+token)}

        setTimeout(() => {
            if (res === null) {
                source.cancel();
            }
        }, Number(process.env.TIMEOUT) || 300000);

        // console.log("<<<<<<<<<<<<<<<<<datosEnviar>>>>>>>>>>>>>>>>>",{
        //     pais: {
        //         codigo: "MX",
        //         nombre: "Mexico"
        //     },
        //     proyecto: "todoterrono",
        //     microservicio: "aprobacion",
        //     evento: evento,
        //     datos_query: datos_query,
        //     query: query,
        //     base: base,
        //     usuario: usuario,
        //     nombre_instancia: "instancia_por_definir",
        //     tipo_salida: "json"
        // },
        // {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         Authorization: `Bearer ${token}`,
        //         "User-Agent": `WEB - ${usuario}`
        //     }
        // }, URL_PETICIONES_ENTERPRISE + 'consulta_sql')

        let res = await axios.post(URL_PETICIONES_ENTERPRISE + 'consulta_sql',
            {
                pais: {
                    codigo: "MX",
                    nombre: "Mexico"
                },
                proyecto: "todoterrono",
                microservicio: "aprobacion",
                evento: evento,
                datos_query: datos_query,
                query: query,
                base: base,
                usuario: usuario,
                nombre_instancia: "instancia_por_definir",
                tipo_salida: "json"
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    "User-Agent": `WEB - ${usuario}`
                }
            }).catch(err=>{
                // console.log("<<<<<<<<<<<<<<<<<<<<<<<<ERRor>>>>>>>>>>>>>>>>>>>>>>>>", err)
                throw new Error(`${SCRIPT} Error en el servidor de consulta enterprise: ${err}`)
            });

        if (res.timings) {
            if (res.timings.elapsedTime) {
                var este = [{ unidad: "Milliseconds", valor: res.timings.elapsedTime, nom_metrica: "time_peticion_pwst" }]
                await reg_metrica(este)
                .catch(manejador_errores);
                // .catch(err => {
                //     throw new Error(err)
                // })
            } else {
                var este = [{ unidad: "Milliseconds", valor: 0, nom_metrica: "time_peticion_pwst" }]
                await reg_metrica(este)
                .catch(manejador_errores);
                // .catch(err => {
                //     throw new Error(err)
                // });
            }
        }

        return res
    } catch (err) {
        throw new Error(err)
    }
}

const manejador_errores = err => {
    throw new Error(err);
};