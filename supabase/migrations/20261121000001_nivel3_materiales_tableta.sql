-- Programas verbales del nivel 3 que se registran solo en la tableta: Materiales
-- describe cómo es cada clase (y sus contrapesos), sin material físico. También en las copias.
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A y B: Nombres inventados (ZUP, MOR…), de modo que ninguna propiedad conocida indique la relación

En cada grupo se mezclan clases «igual» y «diferente», para que no se pueda acertar respondiendo siempre lo mismo. En la tableta, las opciones son «Igual» y «Diferente».$t$ where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Distinción';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Vincular Mutuamente Relaciones de Distinción';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 3 miembros:

A, B y C: Nombres inventados (ZUP, MOR, TAL…)

Cada clase plantea un tipo de red distinto (relación A–C indeterminada, diferente o igual). En la tableta, las opciones son «Igual» y «Diferente» y, en el test combinatorio, también «No se sabe».$t$ where clinica_id is null and nombre = 'Derivar Relaciones de Distinción en Redes Combinatorias';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Derivar Relaciones de Distinción en Redes Combinatorias';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A: Objeto conocido con una función clara (el balón sirve para jugar)
B: Objeto inventado (el tasi), del que solo se sabe si sirve para lo mismo que A o para algo diferente

En cada grupo se mezclan clases «lo mismo» y «diferente», para que no se pueda acertar respondiendo siempre lo mismo. En la tableta, las opciones son «Lo mismo» / «Diferente» en el entrenamiento y «Sí» / «No» en el test.$t$ where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Distinción';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Transferir Funciones a través de Relaciones de Distinción';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A: El polo por el que se pregunta en el entrenamiento, en palabra
B: El polo contrario, en palabra

Pares reales distintos de los de «Abstraer Claves de Oposición», para comprobar que la clave se aplica a estímulos verbales y no a pares ya conocidos. Cada grupo es de una sola categoría (adjetivos, verbos o nombres con artículo), para que el distractor sea del mismo tipo que la respuesta. En la tableta, las opciones son la palabra preguntada, su contraria y la respuesta de otro par del grupo (distractor). Se alterna qué polo se pregunta, para que la respuesta no sea siempre el polo «negativo».$t$ where clinica_id is null and nombre = 'Vincular Mutuamente Opuestos';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Vincular Mutuamente Opuestos';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 3 miembros:

A, B y C: Estímulos arbitrarios sin significado (figuras abstractas y grupos de letras), todos del mismo tamaño y color, de modo que ninguna propiedad física indique la relación$t$ where clinica_id is null and nombre = 'Derivar Relaciones de Oposición en Redes Combinatorias';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Derivar Relaciones de Oposición en Redes Combinatorias';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 3 miembros:

A: Estímulo inventado con una función conocida (ej. el botón Mif enciende la música)
B: Estímulo inventado contrario de A
C: Estímulo inventado contrario de B

Los tres miembros de una clase son del mismo tipo (botones, palancas, bebidas, llaves…) y llevan nombres inventados, de forma que solo la red de oposición indica su función. Las funciones de A son de dos polos claros (encender/apagar, abrir/cerrar, caliente/frío, dulce/salado…) y cambian en cada clase. En la tableta, las opciones son los tres estímulos. Contrapesos: en la mitad de las clases la frase dice «Tok hace lo contrario que Mif» y en la otra mitad «Mif hace lo contrario que Tok»; en la mitad, las dos premisas van en orden inverso.$t$ where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Oposición';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Transferir Funciones a través de Relaciones de Oposición';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A: Personaje u objeto inventado por el que se pregunta en el entrenamiento (el que tiene «más» de lo que dice la frase)
B: El otro personaje u objeto de la relación

Nombres inventados (Pim, Tok, el tren Bori…), de forma que ninguna propiedad física ni conocida indique la relación. En la tableta, las opciones son los dos nombres de la relación y un tercero de otra relación del grupo (distractor). Contrapesos: en la mitad de las clases la frase enuncia un polo («más alto») y en la otra mitad el contrario («más bajo»); en la mitad, la frase va en orden invertido («Comparado con Tok, Pim es más alto»).$t$ where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones de Comparación';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Vincular Mutuamente Relaciones de Comparación';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 3 miembros:

A: El extremo con más de lo que dice la frase (ej. el más alto si se dice «más alto»)
B: El miembro intermedio
C: El otro extremo

Nombres inventados (Pim, el tren Bori, la caja Dun…), de forma que ninguna propiedad física ni conocida indique la relación; las dimensiones rotan entre clases. En la tableta, las opciones son los tres nombres de la red. Contrapesos: la mitad de las clases enuncian un polo y la otra mitad el contrario; en la mitad, la frase va en orden invertido; en el test combinatorio, la mitad de las clases dicen las premisas en orden inverso y se alterna el orden de los extremos en la pregunta.$t$ where clinica_id is null and nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Derivar Relaciones de Comparación en Redes Combinatorias';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 3 miembros. Cada clase es una red de tres fichas:

A: Ficha que vale menos
B: Ficha con función de valor conocida (se canjea por un caramelo o una pegatina)
C: Ficha que vale más

Fichas iguales en tamaño y color, diferenciadas solo por una figura abstracta, como las monedas idénticas de Barnes-Holmes et al. (2004).$t$ where clinica_id is null and nombre = 'Transferir Funciones a través de Relaciones de Comparación';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Transferir Funciones a través de Relaciones de Comparación';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A: Elemento que ocupa la primera posición de la relación enunciada
B: Elemento de referencia

La relación se presenta solo de forma verbal, sin escena, para que ninguna disposición física la indique. En la tableta, las opciones son los dos elementos nombrados y un tercero de otra relación del grupo (distractor). Contrapesos: en la mitad de las clases la frase va en orden invertido («Delante del coche está el perro»); en la mitad de las relaciones encima/debajo la disposición es la contraria a la habitual («La cama está encima del libro»), para que la respuesta no salga del conocimiento del mundo.$t$ where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Espaciales';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Vincular Mutuamente Relaciones Espaciales';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 3 miembros:

A: El extremo hacia el que apunta la relación enunciada (ej. el de más arriba si se dice «encima»)
B: El elemento intermedio
C: El otro extremo

Objetos de categorías distintas combinados al azar, sin escena, de modo que la relación no sea ni habitual ni absurda; ningún par de objetos se repite en dos clases. Solo los tres marcos trabajados: encima/debajo, delante/detrás e izquierda/derecha. En la tableta, las opciones son los tres objetos. Contrapesos: la mitad de las clases enuncian un polo y la otra mitad el contrario; en la mitad, la frase va en orden invertido; en el test combinatorio, la mitad de las clases dicen las premisas en orden inverso y se alterna el orden de los extremos en la pregunta.$t$ where clinica_id is null and nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Derivar Relaciones Espaciales en Redes Combinatorias';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A: Acción por la que se pregunta en el entrenamiento (la que va antes si la relación se enuncia con «antes»; la que va después si se enuncia con «después»)
B: La otra acción de la relación

Personajes inventados (Pim, Tok, Lu…) y pares de acciones sin un orden habitual, para que la respuesta no salga de la experiencia del alumno. En la tableta, las opciones son las dos acciones nombradas y una tercera de otra relación del grupo (distractor). Contrapesos: la mitad de las clases se enuncian con «antes» y la otra mitad con «después»; en la mitad, la frase va en orden invertido («Antes de cantar, Pim salta»).$t$ where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Temporales';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Vincular Mutuamente Relaciones Temporales';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 3 miembros:

A: La acción hacia la que apunta la relación enunciada (la primera si se dice «antes», la última si se dice «después»)
B: La acción intermedia
C: La otra acción del extremo

Personajes inventados (Pim, Tok, Lu…) y acciones sin orden habitual entre ellas; ningún par de acciones se repite en dos clases. En la tableta, las opciones son las tres acciones. Contrapesos: la mitad de las clases se enuncian con «antes» y la otra mitad con «después»; en la mitad, la frase va en orden invertido; en el test combinatorio, la mitad de las clases dicen las premisas en orden inverso y se alterna el orden de los extremos en la pregunta.$t$ where clinica_id is null and nombre = 'Derivar Relaciones Temporales en Redes Combinatorias';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Derivar Relaciones Temporales en Redes Combinatorias';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A: Categoría (nombre de la categoría, de la función, del atributo o del todo)
B: Miembro de la categoría (imagen del banco)

En la tableta, las opciones son las categorías (o los miembros) de las demás clases del grupo, que hacen de distractores.$t$ where clinica_id is null and nombre = 'Clasificar en Categorías';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Clasificar en Categorías';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A: Causa (situación o estado: «Llueve», «Tenemos hambre»)
B: Efecto (lo que hacemos: «Abrimos el paraguas», «Comemos»)

Causas y efectos cotidianos. En la tableta, las opciones son la causa y el efecto de la clase y un tercer elemento de otra clase del grupo que ocupa el mismo papel que la respuesta (otro efecto en el entrenamiento, otra causa en el test). Las causas se dicen sin «porque». En la mitad de las clases la pregunta de entrenamiento empieza con «Si» y en la otra mitad con «Cuando».$t$ where clinica_id is null and nombre = 'Responder a Preguntas ¿Por qué?';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Responder a Preguntas ¿Por qué?';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 2 miembros:

A: Condición (lo que hace un personaje inventado)
B: Consecuente (lo que hace otro personaje cuando se da la condición)

Personajes inventados (Pim, Tok, Lu, Mo…) y acciones arbitrarias, sin relación causal ni de rutina entre ellas (no «si corre, bebe»). Cada pareja de personajes usa acciones distintas en todas sus reglas, para que no haya reglas contradictorias entre grupos. En la tableta, las opciones son las dos acciones de la regla y una tercera de otra regla del grupo (distractor). Contrapesos: la mitad de las reglas se enuncian con «si» y la otra mitad con «cuando»; en la mitad, la frase va en orden invertido («Mo aplaude si Lu recorta»).$t$ where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Condicionales';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Vincular Mutuamente Relaciones Condicionales';
update programas_base set materiales = $t$Grupos de 3 (o más) clases con 3 miembros:

A: Primera causa (inventada: un personaje u objeto con nombre inventado)
B: Efecto intermedio
C: Efecto final

La primera causa es inventada para que el alumno no pueda responder por conocimiento previo; el segundo eslabón (B → C) es verosímil. En la tableta, las opciones son los tres sucesos, sin «porque». Contrapesos: la mitad de las clases se enuncian con «si» y la otra mitad con «cuando»; en la mitad, la frase va en orden invertido («Sale el sol si el pájaro Tiko canta»); en el test combinatorio, la mitad de las clases dicen las premisas en orden inverso.$t$ where clinica_id is null and nombre = 'Derivar Relaciones Causales en Redes Combinatorias';
update programas_alumno pa set materiales = pb.materiales from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Derivar Relaciones Causales en Redes Combinatorias';
