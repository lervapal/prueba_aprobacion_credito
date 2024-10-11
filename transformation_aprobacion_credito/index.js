'use strict';

export const handler = async (event, context) => {
  try {
    console.log("inicio");
    
  } catch (error) {
    console.error("error")

  } finally {
    console.log("final");
    
  }
};


const manejador_errores = (err) => {
  throw err
}