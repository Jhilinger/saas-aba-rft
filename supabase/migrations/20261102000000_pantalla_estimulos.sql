-- Cómo se presenta un estímulo en la tableta cuando no basta una foto del
-- banco (concepto_imagen). Mismo formato que los estímulos de los guiones de
-- la evaluación: {t} texto (letras, sílabas, palabras, pseudopalabras),
-- {fig, s, v?} figura SVG por semilla, {img, n?} n imágenes del mismo
-- concepto, {color}. Null: foto del banco, palabra oída o material físico.
alter table estimulos_rft_base add column pantalla jsonb;
alter table estimulos_rft add column pantalla jsonb;
