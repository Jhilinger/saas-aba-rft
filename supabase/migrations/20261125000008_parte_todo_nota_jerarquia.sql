-- Parte-todo: sin programa propio (decisión del usuario, 2026-11-25). Se corrige la atribución a Villarroel y Luciano
-- (no piden un programa aparte; señalan que mezclar «es parte de» y «es un» difumina la clave) y se añade un ensayo de control.
update programas_base set
  materiales = replace(materiales,
    'y la relación parte-todo («es parte de») queda fuera, porque se aprende de otra forma (Villarroel y Luciano).',
    'y la relación parte-todo («es parte de») queda fuera: «es parte de» y «es un» tienen funciones distintas, y mezclarlas en las mismas clases difumina lo que significa la clave (Villarroel y Luciano).'),
  instrucciones_terapeuta = replace(instrucciones_terapeuta,
    'Generalización (sondas): categorías y miembros nuevos',
    $t$«Es un» no es «es parte de»: no mezcle las dos claves en las mismas clases (Villarroel y Luciano). En la RFT clásica las dos son relaciones jerárquicas (Hayes et al., 2001), pero funcionan distinto: lo común de la categoría pasa al miembro (Toby es un perro, así que ladra); lo del todo no pasa a la parte (la bici es grande, el radio no). Si quiere comprobar que el alumno no las confunde, haga de vez en cuando un ensayo de control: "La rueda es parte de la bici. ¿Es la rueda una bici?" (No). Regístrelo con "+ Ensayo de control" (no cuenta para el porcentaje ni el dominio).

Generalización (sondas): categorías y miembros nuevos$t$),
  contenido_actualizado_at = now()
where clinica_id is null and nombre = 'Vincular Mutuamente Relaciones Jerárquicas' and position('«Es un» no es «es parte de»' in instrucciones_terapeuta) = 0;
