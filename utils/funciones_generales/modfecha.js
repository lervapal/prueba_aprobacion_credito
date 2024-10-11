/**
 * 
 * @param {Number} horas_diferencia 
 * @param {Boolean} horario_verano 
 * @returns 
 */
const ajusta_horarioYYYYMMDD =(horas_diferencia, horario_verano) => {
    try{
        const horas_diferencia_verano = (parseInt(horas_diferencia) + ((horario_verano) ? 1 : 0));
        let diferencia= horas_diferencia_verano * 60 * 60 * 1000;
        return new Date(Date.now() + diferencia).toISOString().split('T')[0].replaceAll('-', '/');
    }catch(err){
        throw new Error(err)
    }
    
};

/**
 * 
 * @param {Number} horas_diferencia 
 * @param {Boolean} horario_verano 
 * @returns 
 */
const ajusta_horario =async (horas_diferencia, horario_verano) => {
    try{
        const horas_diferencia_verano = (parseInt(horas_diferencia) + ((horario_verano) ? 1 : 0));
        let diferencia= horas_diferencia_verano * 60 * 60 * 1000;
        return new Date(Date.now() + diferencia).toISOString().slice(0, 19).replace('T', ' ');
    }catch(err){
        throw new Error(err)
    }
    
};

export {ajusta_horarioYYYYMMDD,ajusta_horario}