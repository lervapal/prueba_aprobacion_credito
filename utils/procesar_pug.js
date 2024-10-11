"use strict";

const pug = require('pug');
const chalk = require("chalk");
const instancia_error = chalk.red("[procesar_pug]:");

/**
 * @description Procesa un plantilla o query utilizando PUG
 * @param {String} plantilla   - Script que sera procesado
 * @param {Object} objeto   - Objeto que sera procesado en el plantilla
 * @returns {String}        - Script procesado
 */
module.exports = (plantilla, objeto) => {
    let self = {};
    try {
        self.vbs = pug.renderFile(plantilla, objeto);
        return self.vbs;
    } catch (err) {
        // console.error(instancia_error, err);
        throw new Error(err);
    } finally {
        self = undefined;
    }
}