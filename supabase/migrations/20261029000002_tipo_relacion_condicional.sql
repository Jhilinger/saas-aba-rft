-- Tipo de relación para los marcos condicionales (si… entonces) y el
-- comportamiento guiado por reglas del dominio 3.6, distinto del causal.
alter type tipo_relacion_rft add value if not exists 'condicional' before 'causal';
