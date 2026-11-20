-- Abstracción de claves con ensayos generados: los datos se toman solo en la
-- tableta (la página de toma de datos ya no muestra el registro con material).
update programas_base
set instrucciones_terapeuta = instrucciones_terapeuta || E'\n\nRegistro: en este programa los datos se toman solo en la tableta, que genera, presenta y registra cada bloque. Las actividades con material descritas arriba se practican sin registro, como preparación y para generalizar a la vida diaria.'
where clinica_id is null and actividad_tablet is not null
  and position('los datos se toman solo en la tableta' in instrucciones_terapeuta) = 0;
