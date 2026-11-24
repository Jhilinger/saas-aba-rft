-- «Abstraer Claves de Analogía» pasa a la tableta con ensayos generados (imágenes del banco): pares iguales o
-- diferentes, grande-pequeño, contrarios o iguales, mezclados, y tríos con el mismo patrón de igualdad o de
-- tamaño (redes de tres miembros no arbitrarias). Modelo y opciones nunca comparten objeto. La clave «¿Qué
-- pareja es como esta?» es la misma del test de analogía con estímulos arbitrarios.
begin;
delete from estimulos_rft_base where clase_base_id in (select id from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Abstraer Claves de Analogía'));
delete from clases_rft_base where programa_base_id = (select id from programas_base where clinica_id is null and nombre = 'Abstraer Claves de Analogía');

update programas_base set
  actividad_tablet = $j${"tipo": "analogia", "niveles": [
    {"nombre": "Pares iguales o diferentes", "modo": "pares_igual"},
    {"nombre": "Pares grande y pequeño", "modo": "pares_tamano"},
    {"nombre": "Pares contrarios o iguales", "modo": "pares_oposicion"},
    {"nombre": "Pares mezclados", "modo": "pares_mezcla"},
    {"nombre": "Tríos iguales y diferentes", "modo": "trios_igual"},
    {"nombre": "Tríos de menor a mayor", "modo": "trios_tamano"}
  ]}$j$::jsonb,
  secuencia_rft = null,
  tipo_respuesta = 'abierta',
  opciones_respuesta = null,
  respuesta_por_fase = '{}'::jsonb,
  objetivo = $t$El alumno elige, entre dos o tres pares (o tríos) de objetos, el que mantiene la misma relación que el modelo aunque los objetos sean otros: dos iguales como dos iguales, grande y pequeño como grande y pequeño, contrarios como contrarios, y en los tríos el mismo patrón (dos iguales y uno distinto en la misma posición, o de menor a mayor). Es la clave «es como» que después se aplica a relaciones arbitrarias.$t$,
  materiales = $t$Solo la tableta. Los ensayos se generan con imágenes del banco y cambian en cada bloque; el modelo y las opciones nunca comparten objeto, de modo que solo la relación decide la respuesta. Las sondas de generalización usan objetos de categorías que no salen en el entrenamiento (y contrarios reservados para generalizar).

Niveles (cada uno se registra como un grupo):
1. Pares iguales o diferentes: modelo con dos objetos iguales o distintos.
2. Pares grande y pequeño: el mismo objeto en dos tamaños, en un orden o en el otro.
3. Pares contrarios o iguales: un objeto en sus dos estados (abierto–cerrado, lleno–vacío…) o dos veces en el mismo.
4. Pares mezclados: los tres tipos en el mismo bloque.
5. Tríos iguales y diferentes: patrones A-A-B, A-B-A, A-B-B y A-B-C con tres opciones.
6. Tríos de menor a mayor: series crecientes o decrecientes frente a la inversa y una sin orden.$t$,
  instrucciones_terapeuta = $t$Requisito previo: el alumno ha superado "Abstraer Claves de Distinción" (dominio 3.1), "Abstraer Claves de Oposición" (dominio 3.2) y "Abstraer Claves de Comparación" (dominio 3.3).

Por qué se hace así: en RFT la analogía es una relación de coordinación entre relaciones. Antes de pedirla con estímulos arbitrarios se abstrae con relaciones físicas (no arbitrarias), donde la relación se ve (Stewart, Barnes-Holmes, Roche y Smeets, 2001). Para que el alumno responda a la relación y no al parecido, el modelo y las opciones no comparten ningún objeto, y las opciones de cada ensayo usan los mismos objetos entre sí: lo único que cambia es cómo se relacionan. Los pares «diferente-diferente» suelen costar más que los «igual-igual» (Ruiz y Luciano, 2011): vigile esa clave. Los tríos llevan la misma lógica a redes de tres miembros, el paso previo a las redes arbitrarias.

Procedimiento en la tableta:
1. Trabaje los niveles en orden; la tableta dice «¿Qué pareja es como esta?» (o «¿Qué grupo es como este?» en los tríos) y da las consecuencias.
2. Puede activar el aprendizaje sin error (menos opciones o opciones atenuadas al principio).
3. En «Aciertos por clave» compare las claves de cada nivel: si una queda claramente por debajo (p. ej. «Diferente» o el patrón A-B-A), el alumno puede estar respondiendo por una sola clave; dé más bloques antes de darlo por dominado.
4. Dominado un nivel, haga una sonda de generalización con objetos nuevos (5 ensayos, no cuenta para el dominio).

Generalización: pida que explique en qué se parecen el modelo y la opción elegida («Las dos son iguales», «Las dos van de pequeño a grande»), y pase a "Completar Analogías Verbales".$t$,
  contenido_actualizado_at = now()
where clinica_id is null and nombre = 'Abstraer Claves de Analogía';
commit;
