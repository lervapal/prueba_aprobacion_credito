.
    Dim res
    Dim valores
    Dim error
    Dim error_texto
    Dim Doc1

    error_texto = ""

    'VALIDACION CODIGO_DESCUENTO (IQOSPRO)
    If error_texto = "" Then

        'Maximo de referidos
        query = "SELECT valoratributo FROM atributosxdocumento_pend WHERE idatributo = 'estado' AND empresa = #{empresa} AND clavecorr = '#{clavecorr}' AND serie = '#{serie}' AND nrodoc = #{nrodoc}" 
        Set rs = PowerStreet.openrecordset(query)

        If Not (rs.EOF And rs.BOF) Then
            rs.MoveFirst
            Do Until rs.EOF = True
                estado = trim(rs.collect(0))
                rs.MoveNext
            Loop
        End If  

    End If

    'ERRORES EN VALIDACIONES
    Set Error = PowerStreet.Errores.ListarErrores
    if Error.Count() > 0 And error_texto = "" Then
        resp.RaiseError "error", "Error.item(1).Descripcion"
    End If

    If error_texto = "" AND estado <> "1" Then
        Set Doc1 = PowerStreet.Documentos.BuscarPendienteXClave(#{empresa},"#{clavecorr}","#{serie}",#{nrodoc},0)
        'Set Doc1 = PowerStreet.Documentos.BuscarPendienteXClave(5,"VE","M",2674,0)
        Doc1.Atributos("estado") = "#{estado}"
        Doc1.Atributos("usuarioreg") = "#{usuarioreg}"
        Doc1.Atributos("fechareg") = "#{fechareg}"
        Doc1.Observaciones = "#{obs}"

        resp.StartElement "documento"
        If Doc1.save(true) Then
            resp.WriteElement "estatus", estado
            resp.WriteElement "nrodoc", Doc1.nrodoc
            resp.WriteElement "obs", Doc1.Observaciones
        resp.EndElement
        End If
    ElseIf estado = "1" Then
        resp.RaiseError "error", "El documento pendiente ya no puede modificarse"
    Else
        resp.RaiseError "error", error_texto
    End If