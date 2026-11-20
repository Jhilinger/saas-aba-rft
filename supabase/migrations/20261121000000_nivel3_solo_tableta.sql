-- Programas verbales del nivel 3 en los que se elige una respuesta: los datos se
-- toman solo en la tableta (frase y opciones; como hablante, el terapeuta puntúa).
-- Lo demás se practica fuera, sin registro (Luciano et al., 2009: formatos variados,
-- en vivo y con ordenador). También en las copias de los PEI.
update programas_base set instrucciones_terapeuta = instrucciones_terapeuta || E'\n\nRegistro: en este programa los datos se toman solo en la tableta, que presenta la frase y las opciones (como hablante, solo la frase; usted marca la respuesta). Para el alumno que no lee, léale usted la frase.\n\nFuera de la tableta (sin registro): use las mismas relaciones en la conversación y el juego del día a día, con otros nombres y objetos reales, y pídale que las explique con sus palabras.'
where clinica_id is null and instrucciones_terapeuta not like '%los datos se toman solo en la tableta%' and nombre in (
  'Vincular Mutuamente Relaciones de Distinción', 'Derivar Relaciones de Distinción en Redes Combinatorias', 'Transferir Funciones a través de Relaciones de Distinción',
  'Vincular Mutuamente Opuestos', 'Derivar Relaciones de Oposición en Redes Combinatorias', 'Transferir Funciones a través de Relaciones de Oposición',
  'Vincular Mutuamente Relaciones de Comparación', 'Derivar Relaciones de Comparación en Redes Combinatorias', 'Transferir Funciones a través de Relaciones de Comparación',
  'Vincular Mutuamente Relaciones Espaciales', 'Derivar Relaciones Espaciales en Redes Combinatorias',
  'Vincular Mutuamente Relaciones Temporales', 'Derivar Relaciones Temporales en Redes Combinatorias',
  'Clasificar en Categorías',
  'Responder a Preguntas ¿Por qué?', 'Vincular Mutuamente Relaciones Condicionales', 'Derivar Relaciones Causales en Redes Combinatorias');

update programas_alumno pa set instrucciones_terapeuta = pb.instrucciones_terapeuta
from programas_base pb where pa.programa_base_id = pb.id and pb.clinica_id is null and pb.instrucciones_terapeuta like '%los datos se toman solo en la tableta, que presenta la frase%';
