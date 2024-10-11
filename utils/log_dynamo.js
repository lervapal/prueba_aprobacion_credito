import Dynamo from "./dynamodb.js";

const estados = {
    0: {
        Code: 0,
        Message: "La orden ingreso en Queue de fallidos"
    },
    1: {
        Code: 1,
        Message: "La orden ingreso en Queue"
    },
    2: {
        Code: 2,
        Message: "La orden ingreso a enterprise con estado pendiente"
    },
    3: {
        Code: 3,
        Message: "La orden cambio a estado emitido"
    },
    403: {
        Code: 403,
        Message: "Error en validacion, no se logro ingresar la orden en queue"
    }
}

export const LogDynamo = async (body, table) => {

    const dynamo = new Dynamo(table)

    let { orderID, base, TakerClass, MessageBody, Status, Error, newEstatus } = body

    let bodyDynamo = {
        OrderID: orderID,
        TakerClass
    }
    let status = [Object.assign(estados[Status], { Date: Date.now() }, { Error: Error || {} })]

    if (!newEstatus) {
        bodyDynamo.Base = base
        bodyDynamo.RequestOrderTaker = JSON.stringify(MessageBody)
        bodyDynamo.Status = status

        await dynamo.insertardatos(bodyDynamo)
    } else {
        const UpdateExpression = "SET #Status = list_append(#Status, :status)"
        const ExpressionAttributeValues = { ':status': status }
        const ExpressionAttributeNames = { "#Status": "Status" }
        await dynamo.actualizaritem(bodyDynamo, UpdateExpression, ExpressionAttributeValues, ExpressionAttributeNames)
    }

    return {
        mensaje: estados[Status].Message,
        orderID: orderID
    }

};

export default LogDynamo