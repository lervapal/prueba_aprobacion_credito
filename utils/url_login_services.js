import request from 'request'

export const url_login_services = (conexion, datos) => {
    try {
        var url_peticion;
        // console.log("conexion", conexion)
        url_peticion = conexion.UrlLogin;

        const url_completa = url_peticion + 'session.ashx?a=login&user=' +
        datos.usuario + '&pass=' + datos.clave + '&vpnmode=0&startSession=1';
        // console.log("Login: " + url_completa);
        
        return new Promise(async resolve => {
            var valido = false;
            var params = {
                "method": "GET",
                "rejectUnauthorized": false,
                "url": url_completa,
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                "encoding": 'binary'
            };
            request(params, function (error, response, body) {
                if (error) {
                    resolve({
                        valido: false,
                        error: error.message
                    });
                    return;
                } else {
                    var respuesta;
                    try {
                        var respuesta = JSON.parse(body);
                        valido = respuesta.stat;
                        error = respuesta.error;
                    } catch (err) {
                        try {
                            if (body.contains("Error 404")) {
                                valido = false;
                                error = "Servidores de Enterprise no disponibles ( Error 404) ";
                            }
                        } catch (err2) {}
                        valido = false;
                        error = error ? error : err;
                    }
                }

                resolve({
                    valido: valido,
                    error: error
                });
                return;
            });
        });
    } catch (err) {
        return false;
    }
}