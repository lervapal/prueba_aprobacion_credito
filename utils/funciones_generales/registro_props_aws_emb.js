import { createMetricsLogger, Unit, StorageResolution } from 'aws-embedded-metrics';
/**
 * @param {String} propiedad
 * @param {String} valor
 * @param {String} nombre_metrica
 */
const propiedad_embedded = async (propiedad, valor) => {
    try {
        const metrics = createMetricsLogger();
        metrics.setProperty(propiedad, valor);
        await metrics.flush().catch(err => {
            throw new Error(err)
        });

    } catch (err) {
        throw new Error(err)
    }
}

/**
 * 
 * @param {Object[]} lista_propiedades
 * @param {String} lista_propiedades[].propiedad
 * @param {String} lista_propiedades[].valor
 * @param {String} nombre_metrica
 */
const propiedades_embedded = async (lista_propiedades) => {
    try {
        const metrics = createMetricsLogger();
        lista_propiedades.forEach(item => {
            metrics.setProperty(item.propiedad, item.valor);
        })
        await metrics.flush().catch(err => {
            throw new Error(err)
        });

    } catch (err) {
        throw new Error(err)
    }
}
/**
 * 
 * @param {Object[]} registros 
 * @param {String} registros[].unidad
 * @param {any}  registros[].valor
 * @param {any}  registros[].nom_metrica
 */
const reg_metrica = async (registros) => {
    try {
        const metrics = createMetricsLogger();
        for (let index of registros) {
            if (!Unit[`${index.unidad}`]) throw new Error(`no existe la unidad`);
            if (!index.valor) throw new Error(`no hay valor determinado para la metrica`);            
            metrics.putMetric(`${index.nom_metrica}`, index.valor, Unit[`${index.unidad}`], StorageResolution.Standard);
        }
        await metrics.flush().catch(err => {
            throw new Error(err)
        });

    } catch (err) {
        throw new Error(err)
    }
}

export { propiedad_embedded, propiedades_embedded, reg_metrica };