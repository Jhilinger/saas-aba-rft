-- Acceso a los datos de un alumno: el clinica_admin a todos los de su
-- clínica; un terapeuta solo a los que tiene asignados en alumno_terapeuta
-- (un alumno puede tener varios terapeutas). Antes cualquier terapeuta
-- accedía a todos los alumnos de su clínica. Las familias no cambian
-- (acceden por alumno_familia) y el superadmin lo tiene en cada política.
begin;

create or replace function puede_acceder_alumno(p_alumno_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from alumnos a
    where a.id = p_alumno_id
      and a.clinica_id = auth_clinica_id()
      and (
        auth_rol() = 'clinica_admin'
        or exists (
          select 1 from alumno_terapeuta at
          where at.alumno_id = a.id and at.terapeuta_id = auth.uid()
        )
      )
  );
$$;

-- Usada en ~34 políticas (incluido storage de documentos firmados): pasa a
-- significar "puedo acceder a este alumno"
create or replace function alumno_es_de_mi_clinica(p_alumno_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select puede_acceder_alumno(p_alumno_id);
$$;

-- Políticas que comprobaban la clínica del alumno directamente
alter policy "alumnos_select_clinica" on public.alumnos
  using (((auth_rol() = 'superadmin'::rol_usuario) OR puede_acceder_alumno(id) OR (id IN ( SELECT alumno_familia.alumno_id
   FROM alumno_familia
  WHERE (alumno_familia.perfil_id = auth.uid())))));

alter policy "alumnos_update_clinica" on public.alumnos
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'clinica_admin'::rol_usuario, 'terapeuta'::rol_usuario])) AND ((auth_rol() = 'superadmin'::rol_usuario) OR puede_acceder_alumno(id))));

alter policy "bloques_at_insert" on public.bloques_analisis_tareas
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (terapeuta_id = auth.uid()) AND (EXISTS ( SELECT 1
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE ((pa.id = bloques_analisis_tareas.programa_alumno_id) AND puede_acceder_alumno(a.id))))));

alter policy "bloques_at_select" on public.bloques_analisis_tareas
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "bloques_ensayo_insert_amplio" on public.bloques_ensayo
  with check ((EXISTS ( SELECT 1
   FROM ((conjuntos_estimulos_alumno cea
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE ((cea.id = bloques_ensayo.conjunto_id) AND ((auth_rol() = 'superadmin'::rol_usuario) OR (puede_acceder_alumno(a.id) AND (auth_rol() = ANY (ARRAY['terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario]))))))));

alter policy "bloques_select" on public.bloques_ensayo
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (conjunto_id IN ( SELECT cea.id
   FROM ((conjuntos_estimulos_alumno cea
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (conjunto_id IN ( SELECT cea.id
   FROM ((conjuntos_estimulos_alumno cea
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "bloques_ensayo_rft_insert_amplio" on public.bloques_ensayo_rft
  with check ((EXISTS ( SELECT 1
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE ((pa.id = bloques_ensayo_rft.programa_alumno_id) AND ((auth_rol() = 'superadmin'::rol_usuario) OR (puede_acceder_alumno(a.id) AND (auth_rol() = ANY (ARRAY['terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario]))))))));

alter policy "bloques_rft_select" on public.bloques_ensayo_rft
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "clases_rft_delete" on public.clases_rft
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "clases_rft_write" on public.clases_rft
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "clases_rft_select" on public.clases_rft
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "clases_rft_update" on public.clases_rft
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "conjuntos_alumno_delete" on public.conjuntos_estimulos_alumno
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "conjuntos_alumno_write" on public.conjuntos_estimulos_alumno
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "conjuntos_alumno_select" on public.conjuntos_estimulos_alumno
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "conjuntos_alumno_update" on public.conjuntos_estimulos_alumno
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "dominio_rft_fases_select" on public.dominio_rft_fases
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (EXISTS ( SELECT 1
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE ((pa.id = dominio_rft_fases.programa_alumno_id) AND puede_acceder_alumno(a.id))))));

alter policy "detalle_delete" on public.ensayos_aba_detalle
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (bloque_id IN ( SELECT b.id
   FROM (((bloques_ensayo b
     JOIN conjuntos_estimulos_alumno cea ON ((cea.id = b.conjunto_id)))
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "ensayos_aba_detalle_insert_amplio" on public.ensayos_aba_detalle
  with check ((EXISTS ( SELECT 1
   FROM (((bloques_ensayo be
     JOIN conjuntos_estimulos_alumno cea ON ((cea.id = be.conjunto_id)))
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE ((be.id = ensayos_aba_detalle.bloque_id) AND ((auth_rol() = 'superadmin'::rol_usuario) OR (puede_acceder_alumno(a.id) AND (auth_rol() = ANY (ARRAY['terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario]))))))));

alter policy "detalle_select" on public.ensayos_aba_detalle
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (bloque_id IN ( SELECT be.id
   FROM (((bloques_ensayo be
     JOIN conjuntos_estimulos_alumno cea ON ((cea.id = be.conjunto_id)))
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (bloque_id IN ( SELECT be.id
   FROM (((bloques_ensayo be
     JOIN conjuntos_estimulos_alumno cea ON ((cea.id = be.conjunto_id)))
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "ensayos_rft_detalle_insert_amplio" on public.ensayos_rft_detalle
  with check ((EXISTS ( SELECT 1
   FROM ((bloques_ensayo_rft ber
     JOIN programas_alumno pa ON ((pa.id = ber.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE ((ber.id = ensayos_rft_detalle.bloque_id) AND ((auth_rol() = 'superadmin'::rol_usuario) OR (puede_acceder_alumno(a.id) AND (auth_rol() = ANY (ARRAY['terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario]))))))));

alter policy "detalle_rft_select" on public.ensayos_rft_detalle
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (bloque_id IN ( SELECT b.id
   FROM ((bloques_ensayo_rft b
     JOIN programas_alumno pa ON ((pa.id = b.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (bloque_id IN ( SELECT b.id
   FROM ((bloques_ensayo_rft b
     JOIN programas_alumno pa ON ((pa.id = b.programa_alumno_id)))
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "estimulos_alumno_delete" on public.estimulos_alumno
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (conjunto_id IN ( SELECT cea.id
   FROM ((conjuntos_estimulos_alumno cea
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "estimulos_alumno_write" on public.estimulos_alumno
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (conjunto_id IN ( SELECT cea.id
   FROM ((conjuntos_estimulos_alumno cea
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "estimulos_alumno_select" on public.estimulos_alumno
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (conjunto_id IN ( SELECT cea.id
   FROM ((conjuntos_estimulos_alumno cea
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (conjunto_id IN ( SELECT cea.id
   FROM ((conjuntos_estimulos_alumno cea
     JOIN programas_alumno pa ON ((pa.id = cea.programa_alumno_id)))
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "estimulos_rft_delete" on public.estimulos_rft
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (clase_id IN ( SELECT c.id
   FROM ((clases_rft c
     JOIN programas_alumno pa ON ((pa.id = c.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "estimulos_rft_write" on public.estimulos_rft
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (clase_id IN ( SELECT c.id
   FROM ((clases_rft c
     JOIN programas_alumno pa ON ((pa.id = c.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "estimulos_rft_select" on public.estimulos_rft
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (clase_id IN ( SELECT c.id
   FROM ((clases_rft c
     JOIN programas_alumno pa ON ((pa.id = c.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (clase_id IN ( SELECT c.id
   FROM ((clases_rft c
     JOIN programas_alumno pa ON ((pa.id = c.programa_alumno_id)))
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "observaciones_select" on public.observaciones_familia
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "observaciones_update_staff" on public.observaciones_familia
  using (((auth_rol() = 'superadmin'::rol_usuario) OR ((auth_rol() = ANY (ARRAY['terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))))));

alter policy "pasos_alumno_delete" on public.pasos_tarea_alumno
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "pasos_alumno_write" on public.pasos_tarea_alumno
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "pasos_alumno_select" on public.pasos_tarea_alumno
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "pasos_alumno_update" on public.pasos_tarea_alumno
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (programa_alumno_id IN ( SELECT pa.id
   FROM (programas_alumno pa
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "programas_alumno_write" on public.programas_alumno
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (alumno_id IN ( SELECT alumnos.id
   FROM alumnos
  WHERE puede_acceder_alumno(alumnos.id)))));

alter policy "programas_alumno_select" on public.programas_alumno
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (alumno_id IN ( SELECT alumnos.id
   FROM alumnos
  WHERE puede_acceder_alumno(alumnos.id))) OR (alumno_id IN ( SELECT alumno_familia.alumno_id
   FROM alumno_familia
  WHERE (alumno_familia.perfil_id = auth.uid())))));

alter policy "programas_alumno_update" on public.programas_alumno
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (alumno_id IN ( SELECT alumnos.id
   FROM alumnos
  WHERE puede_acceder_alumno(alumnos.id)))));

alter policy "relaciones_entrenadas_delete" on public.relaciones_entrenadas_rft
  using (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (clase_id IN ( SELECT c.id
   FROM ((clases_rft c
     JOIN programas_alumno pa ON ((pa.id = c.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "relaciones_entrenadas_write" on public.relaciones_entrenadas_rft
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (clase_id IN ( SELECT c.id
   FROM ((clases_rft c
     JOIN programas_alumno pa ON ((pa.id = c.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id)))));

alter policy "relaciones_entrenadas_rft_insert_amplio" on public.relaciones_entrenadas_rft
  with check ((EXISTS ( SELECT 1
   FROM ((clases_rft cr
     JOIN programas_alumno pa ON ((pa.id = cr.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE ((cr.id = relaciones_entrenadas_rft.clase_id) AND ((auth_rol() = 'superadmin'::rol_usuario) OR (puede_acceder_alumno(a.id) AND (auth_rol() = ANY (ARRAY['terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario]))))))));

alter policy "relaciones_entrenadas_select" on public.relaciones_entrenadas_rft
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (clase_id IN ( SELECT c.id
   FROM ((clases_rft c
     JOIN programas_alumno pa ON ((pa.id = c.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (clase_id IN ( SELECT c.id
   FROM ((clases_rft c
     JOIN programas_alumno pa ON ((pa.id = c.programa_alumno_id)))
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

alter policy "resultados_insert" on public.resultados_paso_bloque
  with check (((auth_rol() = ANY (ARRAY['superadmin'::rol_usuario, 'terapeuta'::rol_usuario, 'clinica_admin'::rol_usuario])) AND (EXISTS ( SELECT 1
   FROM ((bloques_analisis_tareas b
     JOIN programas_alumno pa ON ((pa.id = b.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE ((b.id = resultados_paso_bloque.bloque_id) AND puede_acceder_alumno(a.id))))));

alter policy "resultados_select" on public.resultados_paso_bloque
  using (((auth_rol() = 'superadmin'::rol_usuario) OR (bloque_id IN ( SELECT b.id
   FROM ((bloques_analisis_tareas b
     JOIN programas_alumno pa ON ((pa.id = b.programa_alumno_id)))
     JOIN alumnos a ON ((a.id = pa.alumno_id)))
  WHERE puede_acceder_alumno(a.id))) OR (bloque_id IN ( SELECT b.id
   FROM ((bloques_analisis_tareas b
     JOIN programas_alumno pa ON ((pa.id = b.programa_alumno_id)))
     JOIN alumno_familia af ON ((af.alumno_id = pa.alumno_id)))
  WHERE (af.perfil_id = auth.uid())))));

-- Agenda: el terapeuta ve y actualiza las sesiones en las que figura,
-- aunque cubra a un alumno que no tiene asignado
alter policy "sesiones_select" on public.sesiones_programadas
  using ((auth_rol() = 'superadmin'::rol_usuario) OR alumno_es_de_mi_clinica(alumno_id) OR (terapeuta_id = auth.uid()) OR (EXISTS ( SELECT 1 FROM alumno_familia af WHERE ((af.alumno_id = sesiones_programadas.alumno_id) AND (af.perfil_id = auth.uid())))));
alter policy "sesiones_update" on public.sesiones_programadas
  using ((auth_rol() = 'superadmin'::rol_usuario) OR alumno_es_de_mi_clinica(alumno_id) OR (terapeuta_id = auth.uid()) OR (EXISTS ( SELECT 1 FROM alumno_familia af WHERE ((af.alumno_id = sesiones_programadas.alumno_id) AND (af.perfil_id = auth.uid())))));

-- Asignar/quitar terapeutas: solo el administrador de la clínica
alter policy "alumno_terapeuta_write" on public.alumno_terapeuta
  with check ((auth_rol() = 'superadmin'::rol_usuario) OR ((auth_rol() = 'clinica_admin'::rol_usuario) AND alumno_es_de_mi_clinica(alumno_id)));
alter policy "alumno_terapeuta_update" on public.alumno_terapeuta
  using ((auth_rol() = 'superadmin'::rol_usuario) OR ((auth_rol() = 'clinica_admin'::rol_usuario) AND alumno_es_de_mi_clinica(alumno_id)));
alter policy "alumno_terapeuta_delete" on public.alumno_terapeuta
  using ((auth_rol() = 'superadmin'::rol_usuario) OR ((auth_rol() = 'clinica_admin'::rol_usuario) AND alumno_es_de_mi_clinica(alumno_id)));

commit;
