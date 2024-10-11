'use strict';

export const Validar = (schema, obj) => {	
	let errores = schema.validate(obj);
	setTimeout(()=>{
		errores = undefined;
	}, 2000);
	if(errores.length > 0) {
		throw errores.join("\n");
	}
}

export default Validar