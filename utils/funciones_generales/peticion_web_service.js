import request from 'request';
import { parseString } from 'xml2js'
import { reg_metrica } from './registro_props_aws_emb.js';

const script = "peticion_web_service:";

/**
 * @description                                 Funcion general para las consultas sql con el evento tradicional "consulta simple"
 * 
 * @param {String} nombre_metodo_enterprise     Nombre del metodo para la consulta sql
 * @param {Object} parametros                   Parametros para la consulta sql
 * @param {String} parametros.usuario           usuario para accede al web-service
 * @param {String} parametros.clave             contrasena para acceder al web-service 
 * @param {String} url_peticion                 Url del web-service donde se realizaran las consultas
 * @param {String} parametros.query             query formato string
 * 
 * @returns {Promise<Object>}
 */

export default (nombre_metodo_enterprise, parametros, url_peticion) => new Promise((resuelve, rechaza) => {
    try {
        const { usuario, clave } = parametros;
        let time_out = Number(process.env.TIMEOUT || 300000);
        const parametros_formateados = formatear_parametros(nombre_metodo_enterprise, parametros);
        const xml_peticion = genera_sobre(parametros_formateados, usuario, clave);

        // console.log("<<<<<<<<<<<<<<<<<XMLpetticion>>>>>>>>>>>>>>>>>", xml_peticion)
        let parametros_web = {
            "rejectUnauthorized": false,
            headers: {
                'Content-Type': 'application/xml',
                'User-Agent': `TodoTerreno-${usuario}`
            },
            url: url_peticion,
            body: xml_peticion,
            "encoding": 'binary',
            time: true,
            timeout: time_out
        };

        request.post(parametros_web, function (error, response, body) {
            if (error) {
                return resuelve({
                    valido: false,
                    error
                });
            }
            if (!response) {
                return resuelve({
                    valido: false,
                    error: new Error("No hay respuesta de Enterprise")
                });
            }
            const ida = milis_a_segundos(response.timingPhases.wait + response.timingPhases.dns + response.timingPhases.tcp),
                enteprise = milis_a_segundos(response.timingPhases.firstByte),
                vuelta = milis_a_segundos(response.timingPhases.download),
                total = milis_a_segundos(response.timingPhases.total);
            if (total) {
                var este = [{ unidad: "Milliseconds", valor: total, nom_metrica: "time_peticion_pwst" }]
                reg_metrica(este).catch(err => {
                    rechaza(new Error(err))
                })
            } else {
                var este = [{ unidad: "Milliseconds", valor: 0, nom_metrica: "time_peticion_pwst" }]
                reg_metrica(este).catch(err => {
                    rechaza(new Error(err))
                });
            }
            parseString(body, function (err, result) {
                if (err) {
                    return resuelve({
                        valido: false,
                        error: new Error("El servidor de Enterprise no esta contestando correctamente, reintente por favor")
                    });
                }
                const s = "Segundos > ida:" + ida + " enteprise:" + enteprise + " vuelta:" + vuelta + " total:" + total;
                try {
                    var info_err = result["SOAP-ENV:envelope"]["SOAP-ENV:body"]["0"]["SOAP-ENV:fault"]["0"].detail["0"]["pwst:errorinfo"]["0"]["pwst:error"]["0"]["pwst:message"];

                    return resuelve({
                        valido: false,
                        error: info_err[0]
                    });
                } catch (err) {
                    return resuelve({
                        valido: true,
                        resultado: result
                    });
                }

            });
        });
    } catch (err) {
        return resuelve({
            valido: false,
            error: err.message || err
        });
    }
});


const genera_sobre = (parametros_funcion, usuario, clave) =>
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pwst="http://www.assist.com.uy/pwst/">
        <soapenv:Header>
            <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
                <wsse:UsernameToken wsu:Id="UsernameToken-CB23D4285D92A754BB14991289027681">
                    <wsse:Username>${usuario}</wsse:Username>
                    <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${clave}</wsse:Password>
                    <wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary ">a5zsfBphfLtGPNMaTobszQ==</wsse:Nonce>
                    <wsu:Created>2017-07-04T00:41:42.760Z</wsu:Created>
                </wsse:UsernameToken>
            </wsse:Security>
        </soapenv:Header>
        <soapenv:Body>
            ${parametros_funcion}
        </soapenv:Body>
    </soapenv:Envelope>`;


function milis_a_segundos(mili) {
    return (mili / 1000).toFixed(3);
}

function formatear_parametros(nombre_funcion, argumentos) {
    var html = `<pwst:${nombre_funcion}>`;
    html += `<pwst:${nombre_funcion}Input>`;
    Object.keys(argumentos)
        .forEach(function eachKey(llave) {
            html += `<pwst:${llave}><![CDATA[${argumentos[llave]}]]></pwst:${llave}>`
        });
    html += `</pwst:${nombre_funcion}Input>`;
    html += `</pwst:${nombre_funcion}>`;
    return html;
};
