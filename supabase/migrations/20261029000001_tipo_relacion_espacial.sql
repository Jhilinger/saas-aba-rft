-- Tipo de relación para los marcos espaciales (dominio 3.3), separados de
-- los temporales. ADD VALUE no puede usarse en la misma transacción en que
-- se añade, así que va en su propia migración.
alter type tipo_relacion_rft add value if not exists 'espacial' before 'temporal';
