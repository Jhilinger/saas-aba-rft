-- Latencia por ensayo y fluidez por bloque (ABA y RFT). La latencia es la
-- que registra el terapeuta al pulsar el resultado (desde que aparece el
-- ensayo); la fluidez son los aciertos sin ayuda por minuto del bloque.
begin;

alter table ensayos_aba_detalle add column latencia_ms integer check (latencia_ms >= 0);
alter table ensayos_rft_detalle add column latencia_ms integer check (latencia_ms >= 0);

alter table bloques_ensayo
  add column duracion_segundos integer check (duracion_segundos >= 0),
  add column latencia_media_ms integer check (latencia_media_ms >= 0),
  add column aciertos_por_minuto numeric generated always as (
    case when duracion_segundos > 0 then round(aciertos::numeric * 60 / duracion_segundos, 2) end
  ) stored;

alter table bloques_ensayo_rft
  add column duracion_segundos integer check (duracion_segundos >= 0),
  add column latencia_media_ms integer check (latencia_media_ms >= 0),
  add column aciertos_por_minuto numeric generated always as (
    case when duracion_segundos > 0 then round(aciertos::numeric * 60 / duracion_segundos, 2) end
  ) stored;

commit;
