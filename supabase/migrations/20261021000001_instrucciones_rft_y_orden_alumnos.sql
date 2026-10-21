-- Aplicado en producción el 2026-10-21 con 'supabase db query --linked'.

begin;

-- Las dos instrucciones de acción pasan a Aprendizaje Relacional (2.1, vínculo mutuo de coordinación)
update programas_base
set tipo = 'rft', nivel_rft = 'mutuo', tipo_relacion = 'coordinacion',
    formato_recogida = 'ensayo_discreto', direccion_objetivo = null, direccion_cadena = null
where id in ('8d082d39-7314-4440-8182-20be736cbbb9', '8976c6de-cab4-4895-b5ea-48a84d9c3854');

-- programas_alumno.orden = clave global del currículo (nivel*100000 + dominio*1000 + posición),
-- con los de clínica numerados a continuación de los globales de su dominio
update programas_alumno pa
set orden = d.nivel * 100000 + d.numero * 1000 + pb.orden
          + case when pb.clinica_id is null then 0 else coalesce(g.n, 0) end
from programas_base pb
join dominios_curriculo d on d.id = pb.dominio_id
left join (
  select dominio_id, count(*)::int as n from programas_base
  where clinica_id is null and orden is not null group by dominio_id
) g on g.dominio_id = pb.dominio_id
where pa.programa_base_id = pb.id
  and pb.orden is not null
  and (pb.clinica_id is null or pb.visibilidad = 'clinica');

commit;
