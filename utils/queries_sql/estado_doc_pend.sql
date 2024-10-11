.
    SELECT
        atrp.valoratributo, docp.nrodoc
    FROM
        atributosxdocumento_pend atrp
    RIGHT JOIN documentos_pend docp
        ON atrp.empresa = docp.empresa and atrp.clavecorr = docp.clavecorr and atrp.serie = docp.serie and atrp.nrodoc = docp.nrodoc AND atrp.Idatributo = 'estado'
    WHERE
        docp.empresa = #{empresa} 
        AND docp.clavecorr = '#{clavecorr}' 
        AND docp.serie = '#{serie}' 
        AND docp.nrodoc = #{nrodoc}