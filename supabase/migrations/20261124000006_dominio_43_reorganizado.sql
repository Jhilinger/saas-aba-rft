-- Dominio 4.3 reorganizado tras revisar la literatura RFT (2026-11-24, aprobado por el usuario):
-- frases hechas y refranes pasan a 4.2 (metáforas convencionales); el 4.3 se renombra «Lenguaje no Literal y
-- Conversación»; peticiones indirectas y adaptar el lenguaje llevan un «Por qué» que avisa de que no hay estudios RFT;
-- el análisis de rasgos de Persicke et al. (2012) se añade como ayuda en «Comprender Metáforas Simples».
begin;

update dominios_curriculo set nombre = 'Lenguaje no Literal y Conversación' where codigo = '4.3';

select colocar_programa_curriculo(
  (select id from programas_base where clinica_id is null and nombre = 'Comprender Expresiones Hechas'),
  (select id from dominios_curriculo where codigo = '4.2'), 5);
select colocar_programa_curriculo(
  (select id from programas_base where clinica_id is null and nombre = 'Comprender Refranes'),
  (select id from dominios_curriculo where codigo = '4.2'), 6);
select colocar_programa_curriculo(
  (select id from programas_base where clinica_id is null and nombre = 'Comprender Peticiones Indirectas'),
  (select id from dominios_curriculo where codigo = '4.3'), 1);
select colocar_programa_curriculo(
  (select id from programas_base where clinica_id is null and nombre = 'Adaptar el Lenguaje al Interlocutor'),
  (select id from dominios_curriculo where codigo = '4.3'), 2);
select colocar_programa_curriculo(
  (select id from programas_base where clinica_id is null and nombre = 'Detectar Ironía y Bromas'),
  (select id from dominios_curriculo where codigo = '4.3'), 3);

-- «Por qué se hace así» tras la línea de requisitos
update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta, E'(Requisito previo:[^\\n]*\\n)',
  E'\\1\nPor qué se hace así: las expresiones hechas son metáforas que ya no se reconocen como tales («metáforas muertas»: Skinner, 1957; Ruiz y Luciano, 2012). Se aprenden casi como vocabulario, pero entenderlas como metáforas ayuda a recordarlas y a deducir las nuevas; por eso van después de «Comprender Metáforas Simples». No hay estudios RFT específicos sobre frases hechas. Ayuda (Persicke et al., 2012): analizar qué pasaría si fuera literal, qué pasa en la situación y qué tienen en común («Estar en las nubes: ¿qué ves si estás en las nubes de verdad? Nada de lo que pasa aquí abajo. ¿Y el niño que no atiende?»).\n')
where clinica_id is null and nombre = 'Comprender Expresiones Hechas';

update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta, E'(Requisito previo:[^\\n]*\\n)',
  E'\\1\nPor qué se hace así: un refrán es una analogía que lleva una regla: relaciona una situación concreta («al mal tiempo») con todas las que comparten la misma relación y dice qué hacer en ellas (Stewart, Barnes-Holmes, Hayes y Lipkens, 2001; Ruiz y Luciano, 2012). Por eso el programa pide aplicarlo a situaciones nuevas. No hay estudios RFT específicos sobre refranes.\n')
where clinica_id is null and nombre = 'Comprender Refranes';

update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta, E'(Requisito previo:[^\\n]*\\n)',
  E'\\1\nPor qué se hace así: no hay estudios RFT específicos sobre peticiones indirectas. Desde la teoría, una petición indirecta es una transformación de funciones por el contexto: la forma de pregunta («¿Me pasas la sal?») no controla la respuesta («sí»); la controla la función de la frase en esa situación (el contexto funcional). Por eso se presenta siempre en una situación real y la respuesta literal se registra como error típico.\n')
where clinica_id is null and nombre = 'Comprender Peticiones Indirectas';

update programas_base set instrucciones_terapeuta = regexp_replace(instrucciones_terapeuta, E'(Requisito previo:[^\\n]*\\n)',
  E'\\1\nPor qué se hace así: no hay estudios RFT específicos sobre adaptar el lenguaje. Skinner (1957) lo describe como control de audiencia; desde RFT depende de las relaciones deícticas: qué sabe y qué necesita el otro desde su perspectiva (ver «Relaciones Deícticas Simples»).\n')
where clinica_id is null and nombre = 'Adaptar el Lenguaje al Interlocutor';

update programas_base set instrucciones_terapeuta = replace(instrucciones_terapeuta,
  $t$Ayuda: preguntar por la propiedad del vehículo («¿Cómo es el hielo?») y volver a la metáfora.$t$,
  $t$Ayuda: preguntar por la propiedad del vehículo («¿Cómo es el hielo?») y volver a la metáfora. Si no basta, el análisis de rasgos de Persicke et al. (2012): «¿Cómo es un león? Valiente, fuerte, tiene melena. ¿Cómo es Luis? ¿Qué tienen en común?».$t$)
where clinica_id is null and nombre = 'Comprender Metáforas Simples';

update programas_base set contenido_actualizado_at = now()
where clinica_id is null and nombre in ('Comprender Expresiones Hechas', 'Comprender Refranes', 'Comprender Peticiones Indirectas',
  'Adaptar el Lenguaje al Interlocutor', 'Comprender Metáforas Simples');
commit;
