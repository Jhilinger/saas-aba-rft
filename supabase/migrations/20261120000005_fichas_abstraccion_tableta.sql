-- Abstracción de claves con ensayos generados: ficha centrada en la tableta (objetivo,
-- niveles, dominio, sondas, ayudas, evolución y una línea de generalización fuera de la
-- tableta). Sin materiales ni ayudas con material. También en las copias de los PEI.
update programas_base set objetivo = $t$El alumno responde a las claves «igual» y «diferente» ante el mismo conjunto de estímulos, según la clave que se le da, y no por preferencia por uno de los dos.$t$, instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Igual y diferente: «Toca el igual» / «Toca el diferente» con 2 opciones.
2. Cuál es diferente: el distinto entre 4.
3. Diferencias sutiles: el mismo objeto en otro color.

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con objetos de categorías que no salen en el entrenamiento. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Compare «igual» con «diferente». Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «igual») y no por la relación: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): pida con objetos reales «Dame el igual» y «Dame el diferente» en el juego y en las rutinas.$t$, materiales = null, ayudas_posibles = null where clinica_id is null and nombre = 'Abstraer Claves de Distinción';
update programas_alumno pa set objetivo = $t$El alumno responde a las claves «igual» y «diferente» ante el mismo conjunto de estímulos, según la clave que se le da, y no por preferencia por uno de los dos.$t$, instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Igual y diferente: «Toca el igual» / «Toca el diferente» con 2 opciones.
2. Cuál es diferente: el distinto entre 4.
3. Diferencias sutiles: el mismo objeto en otro color.

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con objetos de categorías que no salen en el entrenamiento. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Compare «igual» con «diferente». Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «igual») y no por la relación: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): pida con objetos reales «Dame el igual» y «Dame el diferente» en el juego y en las rutinas.$t$, materiales = null, ayudas_posibles = null from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves de Distinción';
update programas_base set instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Tamaño y cantidad.
2. Cuatro dimensiones: tamaño, cantidad, longitud y altura.
3. El mismo, más y menos: el mismo estímulo es «más» en un ensayo y «menos» en otro.
4. Diferencias pequeñas.

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con objetos de categorías que no salen en el entrenamiento. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Compare «más» con «menos» en cada dimensión. Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «más») y no por la relación: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): el peso (botes iguales con distinto relleno) y la velocidad (coches por rampas) solo se trabajan con material; pregunte también «¿Cuál es más…?» en situaciones del día.$t$, materiales = null, ayudas_posibles = null where clinica_id is null and nombre = 'Abstraer Claves de Comparación';
update programas_alumno pa set instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Tamaño y cantidad.
2. Cuatro dimensiones: tamaño, cantidad, longitud y altura.
3. El mismo, más y menos: el mismo estímulo es «más» en un ensayo y «menos» en otro.
4. Diferencias pequeñas.

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con objetos de categorías que no salen en el entrenamiento. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Compare «más» con «menos» en cada dimensión. Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «más») y no por la relación: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): el peso (botes iguales con distinto relleno) y la velocidad (coches por rampas) solo se trabajan con material; pregunte también «¿Cuál es más…?» en situaciones del día.$t$, materiales = null, ayudas_posibles = null from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves de Comparación';
update programas_base set objetivo = $t$El alumno responde a la clave «contrario» eligiendo el polo opuesto del mismo objeto (la caja abierta ante la cerrada) frente a distractores diferentes pero no opuestos, y generaliza esa respuesta a dimensiones físicas no entrenadas.$t$, instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. El contrario entre dos.
2. El contrario entre tres (con un distractor diferente pero no opuesto).

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con dimensiones no entrenadas: mojado/seco, limpio/sucio y caliente/frío. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Hay una sola clave: mire la curva y, en los errores, si elige el distractor (diferente pero no opuesto).

Fuera de la tableta (sin registro): pida «Dame el contrario» con objetos reales (abre/cierra, llena/vacía, enciende/apaga).$t$, materiales = null, ayudas_posibles = null where clinica_id is null and nombre = 'Abstraer Claves de Oposición';
update programas_alumno pa set objetivo = $t$El alumno responde a la clave «contrario» eligiendo el polo opuesto del mismo objeto (la caja abierta ante la cerrada) frente a distractores diferentes pero no opuestos, y generaliza esa respuesta a dimensiones físicas no entrenadas.$t$, instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. El contrario entre dos.
2. El contrario entre tres (con un distractor diferente pero no opuesto).

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con dimensiones no entrenadas: mojado/seco, limpio/sucio y caliente/frío. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Hay una sola clave: mire la curva y, en los errores, si elige el distractor (diferente pero no opuesto).

Fuera de la tableta (sin registro): pida «Dame el contrario» con objetos reales (abre/cierra, llena/vacía, enciende/apaga).$t$, materiales = null, ayudas_posibles = null from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves de Oposición';
update programas_base set objetivo = $t$El alumno elige la escena que corresponde a la clave espacial («Toca donde la pelota está encima de la caja»), respondiendo a la clave y no a la colocación habitual de los objetos.$t$, instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Encima y debajo.
2. Dentro y fuera.
3. Delante y detrás.
4. Todas mezcladas.

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con otros objetos. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Compare las dos claves de cada par. Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «encima») y no por la relación: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): pida colocar objetos según la clave («Pon la pelota debajo de la mesa») y describir dónde están («¿Dónde está?» → «Debajo de la mesa»).$t$, materiales = null, ayudas_posibles = null where clinica_id is null and nombre = 'Abstraer Claves Espaciales';
update programas_alumno pa set objetivo = $t$El alumno elige la escena que corresponde a la clave espacial («Toca donde la pelota está encima de la caja»), respondiendo a la clave y no a la colocación habitual de los objetos.$t$, instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Encima y debajo.
2. Dentro y fuera.
3. Delante y detrás.
4. Todas mezcladas.

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con otros objetos. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Compare las dos claves de cada par. Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «encima») y no por la relación: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): pida colocar objetos según la clave («Pon la pelota debajo de la mesa») y describir dónde están («¿Dónde está?» → «Debajo de la mesa»).$t$, materiales = null, ayudas_posibles = null from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves Espaciales';
update programas_base set objetivo = $t$El alumno responde a las claves «antes», «primero» y «después» según el orden en que ocurrieron los hechos que acaba de ver.$t$, instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Orden en que aparecen: dos objetos sin relación entre sí salen uno tras otro en el centro; después, «¿Cuál salió antes?» o «¿Cuál salió después?» (el orden solo se sabe por cómo aparecieron). Un tercio de los ensayos son de sí/no («¿Este salió antes?», con uno de los dos como muestra; la mitad con respuesta «sí»), para variar la forma de respuesta.
2. Primero y después: «¿Qué pasó primero?» y «¿Qué pasó después?» entre dos viñetas seguidas de una secuencia.
3. Antes y después: con una viñeta como muestra, «¿Qué pasó antes?» y «¿Qué pasó después?».

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con secuencias que no salen en el entrenamiento (en el primer nivel, objetos de otras categorías). Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Corrección del error (entrenamiento): tras un error, la tableta vuelve a presentar la secuencia con los rótulos «Antes» y «Después» (o resalta la respuesta correcta), deja solo la correcta para que el alumno la toque y repite el ensayo sin ayuda. El ensayo cuenta como error; la repetición se guarda aparte y no cuenta para el porcentaje (Barry, Neufeld y Stewart, 2024).

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Compare «antes» con «después». Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «antes») y no por la relación: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): pregunte por lo que acaba de hacer («¿Qué hiciste primero, aplaudir o saltar?») y por el día («¿Qué hiciste antes del recreo?»).$t$, materiales = null, ayudas_posibles = null where clinica_id is null and nombre = 'Abstraer Claves Temporales';
update programas_alumno pa set objetivo = $t$El alumno responde a las claves «antes», «primero» y «después» según el orden en que ocurrieron los hechos que acaba de ver.$t$, instrucciones_terapeuta = $t$Registro: la tableta genera, presenta y registra cada bloque con imágenes del banco. Las claves se alternan al azar dentro del bloque (nunca más de dos seguidas iguales), para que la respuesta dependa de la clave y no de la posición ni de la imagen; cada ensayo usa uno de varios ejemplares de cada objeto.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Orden en que aparecen: dos objetos sin relación entre sí salen uno tras otro en el centro; después, «¿Cuál salió antes?» o «¿Cuál salió después?» (el orden solo se sabe por cómo aparecieron). Un tercio de los ensayos son de sí/no («¿Este salió antes?», con uno de los dos como muestra; la mitad con respuesta «sí»), para variar la forma de respuesta.
2. Primero y después: «¿Qué pasó primero?» y «¿Qué pasó después?» entre dos viñetas seguidas de una secuencia.
3. Antes y después: con una viñeta como muestra, «¿Qué pasó antes?» y «¿Qué pasó después?».

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con secuencias que no salen en el entrenamiento (en el primer nivel, objetos de otras categorías). Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Corrección del error (entrenamiento): tras un error, la tableta vuelve a presentar la secuencia con los rótulos «Antes» y «Después» (o resalta la respuesta correcta), deja solo la correcta para que el alumno la toque y repite el ensayo sin ayuda. El ensayo cuenta como error; la repetición se guarda aparte y no cuenta para el porcentaje (Barry, Neufeld y Stewart, 2024).

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Compare «antes» con «después». Si una clave queda 20 puntos o más por debajo de otra, puede estar respondiendo por una sola clave (p. ej. siempre «antes») y no por la relación: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): pregunte por lo que acaba de hacer («¿Qué hiciste primero, aplaudir o saltar?») y por el día («¿Qué hiciste antes del recreo?»).$t$, materiales = null, ayudas_posibles = null from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves Temporales';
