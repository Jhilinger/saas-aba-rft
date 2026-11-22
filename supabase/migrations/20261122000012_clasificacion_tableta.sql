-- «Abstraer Claves de Clasificación» en la tableta con ensayos generados: figuras geométricas con
-- forma, color y tamaño. Nivel «Una propiedad» (control contextual de la dimensión, O'Hora y Stewart,
-- 2013; Luciano et al., 2009, 6.3.1) y «Dos propiedades» (filtrado de lo común por niveles, Villarroel
-- y Luciano). Clasificar objetos reales en bandejas, fuera de la tableta.
begin;
update programas_base set actividad_tablet = '{"tipo": "clasificacion", "niveles": [{"nombre": "Una propiedad", "modo": "una"}, {"nombre": "Dos propiedades", "modo": "dos"}]}'::jsonb,
  objetivo = $t$El alumno elige, entre figuras que comparten con la muestra solo una propiedad cada una (forma, color o tamaño), la que va con ella según la clave («Toca el que es del mismo color»), y la reorganiza cuando la clave cambia; después atiende a dos propiedades a la vez («del mismo color y con la misma forma»), filtrando lo común como en las categorías (Villarroel y Luciano; O'Hora y Stewart, 2013).$t$,
  materiales = null, ayudas_posibles = null,
  instrucciones_terapeuta = $t$
Registro: la tableta genera, presenta y registra cada bloque con figuras geométricas dibujadas (forma, color y tamaño). Las claves se alternan al azar dentro del bloque, para que la respuesta dependa de la clave y no de una agrupación fija: el mismo tipo de conjunto se organiza de forma distinta según la clave.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Una propiedad: «Toca el que es del mismo color», «… tiene la misma forma» o «… es del mismo tamaño». Cada opción comparte con la muestra una sola propiedad, así que solo la clave dice cuál es la correcta (control contextual de la dimensión; O'Hora y Stewart, 2013).
2. Dos propiedades: se alternan claves de dos propiedades («del mismo color y con la misma forma») y de una. Entre las opciones hay figuras que comparten solo una de las dos pedidas, así que hay que atender a las dos: es el filtrado de lo común de Villarroel y Luciano (cuanto más concreta la clase, más propiedades comparten sus miembros).

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con formas que no han salido en el entrenamiento (hexágono, pentágono, óvalo…). Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Hablante: en «Respuesta», elija «Hablante» para que el alumno señale y diga cuál va con la muestra; usted marca si la respuesta es correcta. Se registra aparte (Luciano et al., 2009: oyente y hablante).

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Si una clave (por ejemplo, el color) queda 20 puntos o más por debajo de otra, el alumno puede estar respondiendo siempre por la misma propiedad: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): clasificar objetos reales en bandejas («Pon juntos los que son del mismo color»; «Ahora, los que tienen la misma forma»), con criterios no entrenados (material, textura), y preguntar «¿En qué se parecen? ¿En qué se diferencian?».$t$
where clinica_id is null and nombre = 'Abstraer Claves de Clasificación';
update programas_alumno pa set actividad_tablet = pb.actividad_tablet, objetivo = pb.objetivo, materiales = pb.materiales, ayudas_posibles = pb.ayudas_posibles, instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves de Clasificación';
commit;
