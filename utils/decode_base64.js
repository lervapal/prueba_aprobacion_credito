import base64 from 'base-64'
import utf8 from 'utf8'

export default function (texto) {    
    if (texto){
        let bytes = base64.decode(texto);
        let decode_texto = utf8.decode(bytes);
        return decode_texto;
    }    
    return false;
}