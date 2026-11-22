-- «Abstraer Claves Causales» en la tableta con ensayos generados: viñetas causa → efecto
-- (scripts/imagenes/causas-efectos.mjs). Claves alternadas «¿Qué pasará?» (causa → efecto) y
-- «¿Por qué ha pasado esto?» (efecto → causa). Provocar la causa de verdad, fuera de la tableta.
begin;
update programas_base set actividad_tablet = '{"tipo": "causal", "niveles": [{"nombre": "Entre dos", "opciones": 2}, {"nombre": "Entre tres", "opciones": 3}]}'::jsonb,
  objetivo = $t$Ante relaciones causa-efecto físicas, el alumno responde a «¿Qué pasará?» eligiendo el efecto de una causa y a «¿Por qué ha pasado esto?» eligiendo la causa de un efecto, según la clave que se le da.$t$,
  materiales = null, ayudas_posibles = null,
  instrucciones_terapeuta = $t$
Registro: la tableta genera, presenta y registra cada bloque con viñetas de causa y efecto del banco (el mismo objeto antes y después: una mano empuja la torre / la torre caída). Las claves se alternan al azar dentro del bloque, para que la respuesta dependa de la clave y no de la imagen.

Niveles: cada nivel se registra por separado; el siguiente recomendado es el primero sin dominar.
1. Entre dos: con la causa a la vista, «¿Qué pasará?» (elige el efecto entre dos); con el efecto a la vista, «¿Por qué ha pasado esto?» (elige la causa entre dos).
2. Entre tres: lo mismo con tres opciones.

Dominio: 90 % de aciertos en los 3 últimos bloques (de 10 o 20 ensayos).

Sondas de generalización: dominado un nivel, haga una sonda de 5 ensayos con causas y efectos que no han salido en el entrenamiento. Si la supera a la primera, hay abstracción de la clave y no aprendizaje de los ejemplares.

Ayudas: se configuran en «Aprendizaje sin error» (de mayor a menor o de menor a mayor); si no se configuran, no hay ayudas.

Hablante: en «Respuesta», elija «Hablante» para que el alumno diga qué pasará o por qué ha pasado al ver la viñeta; usted marca si la respuesta es correcta. Se registra aparte (Luciano et al., 2009: oyente y hablante).

Evolución: tabla de niveles, curva con los cambios de nivel y las sondas, y aciertos por clave. Si «¿Por qué ha pasado?» queda 20 puntos o más por debajo de «¿Qué pasará?», el alumno puede estar respondiendo siempre por el efecto: no dé el nivel por dominado aunque llegue al 90 %.

Fuera de la tableta (sin registro): provocar la causa de verdad con juguetes y situaciones de causa-efecto (pulsar el botón y suena la música, soplar la vela, empujar la torre), preguntando antes «¿Qué pasará si…?» y después «¿Por qué ha pasado?»; y acontecimientos causales del día (se derrama el agua, se apaga la luz).$t$
where clinica_id is null and nombre = 'Abstraer Claves Causales';
update programas_alumno pa set actividad_tablet = pb.actividad_tablet, objetivo = pb.objetivo, materiales = pb.materiales, ayudas_posibles = pb.ayudas_posibles, instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.nombre = 'Abstraer Claves Causales';
commit;
