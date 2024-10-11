import jwt from 'jsonwebtoken';
const PALABRA_SECRETA = process.env.PALABRA_SECRETA || "Pwst*\\DevMx/*Rlz";

/**
 * @param {Object} datos - Datos del usuario
 * @param {Number} datos.tiempo_sesion - Tiempo de sesión, esta dado en minutos
 * @returns {Promise<String>} token con los datos de sesión
 */
export default (datos) => new Promise((resuelve, rechaza) => {
    jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (datos.tiempo_sesion || 60) * 60,
        data: datos
    }, PALABRA_SECRETA, (err, token) => {
        if (err) {
            // console.error(err,SCRIPT_ERROR)
            return rechaza(err);
        }
        return resuelve(token);
    });
});
