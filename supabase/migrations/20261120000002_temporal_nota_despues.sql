-- Relaciones temporales arbitrarias: «después» suele costar bastante más que
-- «antes» (Neufeld, Stewart y McElwee, 2023). Nota en las instrucciones; la
-- evolución del programa muestra los aciertos con cada clave.
update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta,
  '(\n)(Registro en la app)',
  E'\\1«Antes» y «después»: en las relaciones temporales arbitrarias, «después» suele resultar bastante más difícil que «antes» (Neufeld, Stewart y McElwee, 2023). La pestaña de evolución muestra los aciertos con cada clave por grupo y fase; si «después» queda claramente por debajo, dé más ejemplares con esa clave antes de pasar de fase.\n\n\\2')
where clinica_id is null and nombre in ('Vincular Mutuamente Relaciones Temporales', 'Derivar Relaciones Temporales en Redes Combinatorias');
