-- «Derivar Analogías con Estímulos Arbitrarios» rehecho según Ruiz y Luciano (2011): actividad generada
-- en la tableta con dos redes de figuras propias de cada alumno (sin parecido físico entre ellas), entrenar
-- A–B y A–C en cada red, relacionar pares entrenados, test de relaciones derivadas y test de analogía entre
-- redes (igual-igual y diferente-diferente). Las clases de ejemplo ya no se usan: cada nivel hace de grupo.
begin;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Analogías con Estímulos Arbitrarios'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Derivar Analogías con Estímulos Arbitrarios');

update programas_base set
  actividad_tablet = $j${"tipo": "analogia", "niveles": [
    {"nombre": "Entrenar la red 1", "modo": "entrenar_red", "red": 1},
    {"nombre": "Entrenar la red 2", "modo": "entrenar_red", "red": 2},
    {"nombre": "Relacionar pares entrenados", "modo": "relaciones_entrenadas"},
    {"nombre": "Test de relaciones derivadas", "modo": "derivadas"},
    {"nombre": "Test de analogía", "modo": "analogia"}
  ]}$j$::jsonb,
  secuencia_rft = null,
  tipo_respuesta = 'abierta',
  opciones_respuesta = null,
  respuesta_por_fase = '{}'::jsonb,
  objetivo = $t$El alumno relaciona relaciones derivadas entre dos redes de estímulos arbitrarios que no se parecen en nada (analogía entre dominios): ante un par de una red cuyos miembros son de la misma clase elige el par de la otra red que también lo es, y ante un par de clases distintas, el de clases distintas, sin haber entrenado nunca esos pares (Ruiz y Luciano, 2011).$t$,
  materiales = $t$Solo la tableta. La app genera para cada alumno dos redes de figuras que son siempre las mismas: la red 1 con figuras abstractas y la red 2 con símbolos, para que no compartan rasgos físicos. Cada red tiene dos clases de tres miembros (A, B y C; en la red 2, X, Y y Z) y una figura sin clase en cada posición, que hace de comparación negativa.

Niveles (cada uno se registra como un grupo):
1. Entrenar la red 1: muestra A y tres comparaciones B o C («Toca el igual»), con consecuencias.
2. Entrenar la red 2: lo mismo con X, Y y Z.
3. Relacionar pares entrenados: un par de una red (A con B) y dos pares de la misma red con la otra relación (A con C); se elige el que es «como este» («¿Qué pareja es como esta?»). Igual-igual y diferente-diferente alternados, con consecuencias.
4. Test de relaciones derivadas: mutuas (B o C → A) y combinatorias (B ↔ C) de las dos redes, sin consecuencias.
5. Test de analogía: un par B–C de una red y dos pares Y–Z de la otra; ninguno de esos pares se ha visto nunca. Sin consecuencias.$t$,
  instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Completar Analogías Verbales" (dominio 4.2) y deriva relaciones combinatorias de coordinación con estímulos arbitrarios (dominios 2.3 o 2.4).

Por qué se hace así: en RFT la analogía es una relación de coordinación entre relaciones (Stewart y Barnes-Holmes; Ruiz y Luciano, 2011). Para comprobar que el alumno relaciona relaciones, y no figuras parecidas, las dos redes no comparten ningún rasgo físico y el test usa pares derivados que no se han visto nunca. En Ruiz y Luciano (2011) lo que mejor predijo el éxito fue la fase previa de relacionar pares ya entrenados (correlacionó con el test de analogías verbales del DAT, no con la inteligencia general), y el entrenamiento sin error de las redes ayudó. Los ensayos «diferente-diferente» suelen costar más que los «igual-igual»: el lenguaje cotidiano casi siempre compara por semejanza. Con niños pequeños es esperable más dificultad (Carpentier et al., 2002, 2003): los de 5 años fallaban donde los de 9 acertaban.

Procedimiento en la tableta:
1. Trabaje los niveles en orden. En los de entrenamiento (1 a 3) la tableta da consecuencias; puede activar el aprendizaje sin error para las redes.
2. Los niveles 4 y 5 son tests: sin consecuencias diferenciales. El primer bloque sin ayudas indica si la relación es DERIVADA. Si no alcanza el criterio, vuelva a un bloque de los niveles 1 a 3 y repita el test más tarde; si se enseña con ayudas, quedará registrada como DOMINADA (no derivada).
3. En «Aciertos por clave» compare «Igual» y «Diferente»: si «Diferente» queda claramente por debajo, el alumno puede estar eligiendo siempre el par de la misma clase; dé más bloques del nivel 3 antes de repetir el test.
4. Si el alumno falla el nivel 4, la analogía no es interpretable: no pase al 5 hasta que derive las relaciones de las dos redes.

Generalización: pida al alumno que explique por qué ha elegido un par («¿En qué se parecen?») y lleve la misma lógica a analogías verbales nuevas.$t$,
  contenido_actualizado_at = now()
where clinica_id is null and nombre = 'Derivar Analogías con Estímulos Arbitrarios';
commit;
