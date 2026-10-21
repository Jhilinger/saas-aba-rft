-- Programas asignados saltándose la secuencia del currículo (nivel/dominio
-- previo sin alcanzar el umbral): justificación obligatoria y quién la autorizó
-- (solo clinica_admin o superadmin pueden hacerlo; lo controla la app).
alter table programas_alumno
  add column excepcion_secuencia text,
  add column excepcion_por uuid references perfiles(id) on delete set null;
