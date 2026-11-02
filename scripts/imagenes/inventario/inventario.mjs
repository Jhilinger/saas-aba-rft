// Inventario de conceptos del banco de imágenes para los programas RFT con
// fotos. Cada programa lista sus grupos (el 1 es el que ya existe) y cada
// estímulo apunta a un concepto «categoría/slug». Los conceptos se comparten
// entre programas: una imagen sirve a todos los que la usan.
//   node inventario.mjs resto.json inventario.json

import { readFileSync, writeFileSync } from 'node:fs'

const slug = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Conceptos: [nombre en español, descripción en inglés para generar la imagen]
const C = {}
function cat(categoria, lista) {
  for (const [nombre, en] of lista) C[`${slug(categoria)}/${slug(nombre)}`] = { categoria, nombre, en }
}
const ref = (categoria, nombre) => {
  const k = `${slug(categoria)}/${slug(nombre)}`
  if (!C[k]) throw new Error(`concepto sin definir: ${k}`)
  return k
}

// ---------- conceptos ----------
cat('animales salvajes', [['León', 'a lion'], ['Jirafa', 'a giraffe'], ['Elefante', 'an elephant'], ['Tigre', 'a tiger'], ['Cebra', 'a zebra'], ['Mono', 'a monkey'],
  ['Oso', 'a brown bear'], ['Hipopótamo', 'a hippopotamus'], ['Cocodrilo', 'a crocodile'], ['Rinoceronte', 'a rhinoceros'], ['Canguro', 'a kangaroo'], ['Búho', 'an owl'],
  ['Lobo', 'a wolf'], ['Camello', 'a camel'], ['Koala', 'a koala'], ['Gorila', 'a gorilla'], ['Ciervo', 'a deer with antlers'], ['Serpiente', 'a snake'],
  ['Panda', 'a giant panda'], ['Águila', 'an eagle'], ['Leopardo', 'a leopard'], ['Zorro', 'a red fox'], ['Avestruz', 'an ostrich'], ['Tortuga', 'a land tortoise']])
cat('animales marinos', [['Pulpo', 'an octopus'], ['Ballena', 'a whale'], ['Medusa', 'a jellyfish'], ['Tiburón', 'a shark'], ['Estrella de mar', 'a starfish'], ['Cangrejo', 'a crab'],
  ['Delfín', 'a dolphin'], ['Caballito de mar', 'a seahorse'], ['Langosta', 'a lobster'], ['Foca', 'a seal'], ['Pez payaso', 'a clownfish'], ['Calamar', 'a squid'],
  ['Tortuga marina', 'a sea turtle'], ['Gamba', 'a shrimp'], ['Raya', 'a stingray'], ['Morsa', 'a walrus'], ['Erizo de mar', 'a sea urchin'], ['Pez espada', 'a swordfish']])
cat('partes del cuerpo', [['Mano', "a child's hand"], ['Ojo', "a close-up of a child's eye"], ['Pelo', "a close-up of a child's hair seen from behind"], ['Nariz', "a close-up of a child's nose"],
  ['Pie', "a child's bare foot"], ['Oreja', "a close-up of a child's ear"], ['Boca', "a close-up of a child's smiling mouth"], ['Rodilla', "a close-up of a child's knee"], ['Brazo', "a child's arm"],
  ['Dedo', "a child's hand pointing with the index finger"], ['Barriga', "a child's belly"], ['Cuello', "a close-up of a child's neck"], ['Diente', "a close-up of a child's teeth"],
  ['Pierna', "a child's leg"], ['Codo', "a close-up of a child's elbow"], ['Lengua', 'a child sticking out the tongue, close-up of the mouth'], ['Espalda', "a child's back"], ['Uña', "a close-up of a child's fingernails"]])
cat('utensilios de cocina', [['Cuchara', 'a spoon'], ['Plato', 'a plate'], ['Vaso', 'a drinking glass'], ['Tenedor', 'a fork'], ['Olla', 'a cooking pot'], ['Taza', 'a cup'],
  ['Cuchillo', 'a kitchen knife'], ['Sartén', 'a frying pan'], ['Jarra', 'a water jug'], ['Bol', 'a bowl'], ['Colador', 'a kitchen strainer'], ['Rodillo', 'a rolling pin'],
  ['Espátula', 'a kitchen spatula'], ['Tetera', 'a teapot'], ['Embudo', 'a funnel'], ['Cazo', 'a small saucepan'], ['Rallador', 'a cheese grater'], ['Servilleta', 'a folded napkin']])
cat('plantas', [['Girasol', 'a sunflower'], ['Cactus', 'a cactus in a pot'], ['Pino', 'a pine tree'], ['Rosa', 'a red rose'], ['Palmera', 'a palm tree'], ['Helecho', 'a fern'],
  ['Margarita', 'a daisy'], ['Roble', 'an oak tree'], ['Bambú', 'bamboo stalks'], ['Tulipán', 'a tulip'], ['Olivo', 'an olive tree'], ['Trébol', 'a clover plant'],
  ['Lavanda', 'a lavender plant'], ['Sauce', 'a weeping willow tree'], ['Maíz', 'a corn plant with a cob']])
cat('material escolar', [['Lápiz', 'a pencil'], ['Libro', 'a closed book'], ['Tijeras', "a pair of children's scissors"], ['Goma', 'an eraser'], ['Mochila', 'a school backpack'], ['Regla', 'a ruler'],
  ['Pegamento', 'a glue stick'], ['Estuche', 'a pencil case'], ['Sacapuntas', 'a pencil sharpener'], ['Cuaderno', 'a notebook'], ['Pincel', 'a paintbrush'], ['Rotulador', 'a felt-tip marker'],
  ['Ceras', 'a box of wax crayons'], ['Carpeta', 'a folder'], ['Compás', 'a drawing compass'], ['Plastilina', 'colored modelling clay'], ['Pizarra', 'a small chalkboard'], ['Grapadora', 'a stapler']])
cat('dependencias de la casa', [['Cocina', 'a home kitchen'], ['Baño', 'a home bathroom'], ['Dormitorio', 'a bedroom with a bed'], ['Salón', 'a living room with a sofa'],
  ['Garaje', 'a home garage with a car'], ['Jardín', 'a garden of a house'], ['Comedor', 'a dining room with a table and chairs'], ['Terraza', 'a balcony terrace with plants'], ['Lavadero', 'a laundry room with a washing machine']])
cat('herramientas', [['Martillo', 'a hammer'], ['Destornillador', 'a screwdriver'], ['Sierra', 'a hand saw'], ['Llave inglesa', 'an adjustable wrench'], ['Taladro', 'an electric drill'],
  ['Pala', 'a shovel'], ['Alicates', 'pliers'], ['Rastrillo', 'a garden rake'], ['Brocha', 'a paint brush for walls'], ['Metro', 'a tape measure'], ['Escalera', 'a step ladder'], ['Carretilla', 'a wheelbarrow']])
cat('electrodomésticos', [['Televisión', 'a television'], ['Frigorífico', 'a refrigerator'], ['Lavadora', 'a washing machine'], ['Microondas', 'a microwave oven'], ['Aspiradora', 'a vacuum cleaner'],
  ['Secador', 'a hair dryer'], ['Horno', 'a kitchen oven'], ['Plancha', 'a clothes iron'], ['Tostadora', 'a toaster'], ['Batidora', 'a hand blender'], ['Ventilador', 'an electric fan'],
  ['Lavavajillas', 'a dishwasher'], ['Cafetera', 'a coffee maker'], ['Exprimidor', 'an electric citrus juicer'], ['Radio', 'a radio']])
cat('muebles', [['Silla', 'a simple dining chair with four legs and a backrest, no armrests'], ['Mesa', 'a table'], ['Cama', 'a bed'], ['Sofá', 'a sofa'], ['Armario', 'a wardrobe'], ['Estantería', 'a bookshelf'], ['Lámpara', 'a floor lamp'],
  ['Cómoda', 'a chest of drawers'], ['Escritorio', 'a desk'], ['Mesita de noche', 'a bedside table'], ['Taburete', 'a stool'], ['Perchero', 'a coat stand'], ['Cuna', 'a baby crib'],
  ['Banco', 'a wooden bench'], ['Espejo', 'a wall mirror'], ['Baúl', 'a wooden chest'], ['Mecedora', 'a rocking chair'], ['Sillón', 'an armchair']])
cat('características', [['Mojado', 'something wet, dripping with water (a wet T-shirt, a wet dog, a wet umbrella…)'], ['Roto', 'something broken (a broken toy, a broken cup, a torn book…)'],
  ['Sucio', 'something dirty (muddy shoes, a dirty plate, a stained T-shirt…)'], ['Abierto', 'something open (an open door, an open box, an open book…)'], ['Lleno', 'something full (a full glass of water, a full basket…)'],
  ['Encendido', 'something switched on (a lit lamp, a lit candle, a TV that is on…)'], ['Limpio', 'something clean and shiny (a clean plate, clean white shoes…)'], ['Cerrado', 'something closed (a closed door, a closed box…)'],
  ['Vacío', 'something empty (an empty glass, an empty box…)'], ['Seco', 'something dry (dry leaves, a dry towel…)'], ['Apagado', 'something switched off (an unlit lamp, a TV that is off…)'], ['Arrugado', 'something wrinkled (a crumpled sheet of paper, a creased shirt…)']])
cat('objetos', [['Pelota', 'a ball'], ['Peine', 'a comb'], ['Escoba', 'a broom'], ['Jabón', 'a bar of soap'], ['Paraguas', 'an umbrella'], ['Llave', 'a house key'], ['Toalla', 'a towel'],
  ['Cepillo de dientes', 'a toothbrush'], ['Teléfono', 'a mobile phone'], ['Abrigo', 'a winter coat'], ['Grifo', 'a water tap'], ['Gafas', 'a pair of glasses'], ['Bicicleta', 'a bicycle'],
  ['Reloj', 'a wall clock'], ['Linterna', 'a flashlight'], ['Zapato', 'a shoe'], ['Peluche', 'a teddy bear'], ['Globo', 'a balloon'], ['Cuento', "a children's picture book"],
  ['Cubo y pala', 'a toy bucket and spade'], ['Muñeca', 'a doll'], ['Coche de juguete', 'a toy car'], ['Pinturas', 'a set of colored pencils'], ['Pompas de jabón', 'soap bubbles and a bubble wand'],
  ['Bloques de construcción', 'toy building blocks'], ['Puzle', "a children's jigsaw puzzle"], ['Columpio', 'a playground swing']])
cat('alimentos', [['Lechuga', 'a lettuce'], ['Limón', 'a lemon'], ['Miel', 'a jar of honey'], ['Helado', 'an ice cream cone'], ['Chocolate', 'a bar of chocolate'], ['Zumo', 'a glass of orange juice'],
  ['Patatas fritas', 'a bag of potato chips'], ['Gominolas', 'gummy candies']])
cat('peligros', [['Fuego', 'a fire with flames'], ['Enchufe', 'an electrical wall socket'], ['Cuchillo', 'a sharp knife'], ['Plancha caliente', 'a hot clothes iron with steam'],
  ['Medicamentos', 'pills and medicine bottles'], ['Lejía', 'a bottle of bleach'], ['Sartén caliente', 'a hot frying pan on a stove'], ['Cristal roto', 'broken glass shards'],
  ['Vela encendida', 'a lit candle'], ['Avispa', 'a wasp'], ['Horno encendido', 'a hot oven with the door open'], ['Agua hirviendo', 'a pot of boiling water'], ['Estufa encendida', 'a glowing electric heater'],
  ['Abeja', 'a bee'], ['Cúter', 'a box cutter with the blade out'], ['Cerillas', 'a box of matches with a lit match']])
cat('señales', [['Señal de para', 'a red stop sign'], ['Gesto de ven', 'an adult making a beckoning "come here" gesture with the hand'], ['Pictograma de siéntate', 'a simple pictogram of a person sitting on a chair'],
  ['Semáforo en rojo', 'a pedestrian traffic light showing red'], ['Mano levantada (para)', 'an adult raising the palm forward meaning stop'], ['Pictograma de siéntate (banco)', 'a simple pictogram of a person sitting on a bench'],
  ['Gesto de silencio', 'an adult with the index finger on the lips meaning silence'], ['Gesto de mira', 'an adult pointing to their own eyes meaning look'], ['Gesto de dame', 'an adult holding out an open hand meaning give me'],
  ['Pictograma de silencio', 'a simple pictogram meaning silence (finger on lips)'], ['Pictograma de mira', 'a simple pictogram meaning look (an eye)'], ['Pictograma de dame', 'a simple pictogram meaning give me (open hand)'],
  ['Gesto de levántate', 'an adult raising both palms upward meaning stand up'], ['Gesto de espera', 'an adult holding up the index finger meaning wait'], ['Gesto de coge', 'an adult pointing at an object meaning pick it up'],
  ['Pictograma de levántate', 'a simple pictogram of a person standing up from a chair'], ['Pictograma de espera', 'a simple pictogram meaning wait (a raised hand and a clock)'], ['Pictograma de coge', 'a simple pictogram of a hand picking up an object'],
  ['Semáforo en verde', 'a pedestrian traffic light showing green'], ['Gesto de adiós', 'an adult waving goodbye'], ['Gesto de hola', 'an adult waving hello with a smile']])
cat('emociones', [['Contento', 'the face of a person who is clearly happy'], ['Triste', 'the face of a person who is clearly sad'], ['Enfadado', 'the face of a person who is clearly angry'],
  ['Asustado', 'the face of a person who is clearly scared'], ['Sorprendido', 'the face of a person who is clearly surprised'], ['Asco', 'the face of a person showing clear disgust'],
  ['Tranquilo', 'the face of a person who is calm and relaxed'], ['Aburrido', 'the face of a person who is clearly bored'], ['Nervioso', 'the face of a person who is clearly nervous']])
cat('sensaciones', [['Frío', 'a child shivering with cold, wrapped in a scarf'], ['Calor', 'a child sweating and hot, fanning themselves'], ['Sueño', 'a child yawning, very sleepy'],
  ['Hambre', 'a child hungry, holding the tummy and looking at food'], ['Sed', 'a thirsty child drinking a big glass of water'], ['Dolor', 'a child with a tummy ache holding the belly'],
  ['Cansancio', 'a child exhausted after running, sitting down out of breath'], ['Picor', 'a child scratching an itchy arm'], ['Mareo', 'a dizzy child holding the head']])
cat('acciones', [['Correr', 'a child running'], ['Comer', 'a child eating'], ['Dormir', 'a child sleeping in bed'], ['Saltar', 'a child jumping'], ['Beber', 'a child drinking from a glass'],
  ['Leer', 'a child reading a book'], ['Nadar', 'a child swimming'], ['Pintar', 'a child painting a picture'], ['Llorar', 'a child crying'], ['Bailar', 'a child dancing'], ['Escribir', 'a child writing in a notebook'],
  ['Lavarse las manos', 'a child washing hands at a sink'], ['Cantar', 'a child singing'], ['Barrer', 'a child sweeping with a broom'], ['Abrazar', 'two children hugging'], ['Jugar', 'a child playing with toys'],
  ['Cocinar', 'an adult cooking at the stove'], ['Peinarse', 'a child combing their hair'], ['Montar en bici', 'a child riding a bicycle'], ['Ducharse', 'a child taking a shower'],
  ['Aplaudir', 'a child clapping hands'], ['Subir escaleras', 'a child climbing stairs'], ['Cortar', 'a child cutting paper with scissors'], ['Soplar', 'a child blowing out a candle']])
cat('profesiones', [['Bombero', 'a firefighter in uniform'], ['Médico', 'a doctor in a white coat with a stethoscope'], ['Panadero', 'a baker with bread'], ['Policía', 'a police officer'],
  ['Maestra', 'a teacher in front of a blackboard'], ['Peluquero', 'a hairdresser cutting hair'], ['Cartero', 'a postman with a bag of letters'], ['Cocinero', 'a chef in a white hat'], ['Agricultor', 'a farmer in a field'],
  ['Dentista', 'a dentist with dental tools'], ['Pintor', 'a house painter with a roller'], ['Conductor de autobús', 'a bus driver at the wheel'], ['Veterinario', 'a vet examining a dog'],
  ['Albañil', 'a construction worker laying bricks'], ['Piloto', 'an airline pilot in uniform'], ['Carpintero', 'a carpenter working wood'], ['Enfermera', 'a nurse'], ['Fontanero', 'a plumber fixing a pipe'],
  ['Mecánico', 'a car mechanic'], ['Jardinero', 'a gardener watering plants'], ['Pescador', 'a fisherman with a fishing rod'], ['Astronauta', 'an astronaut in a space suit'], ['Socorrista', 'a lifeguard on a beach'], ['Músico', 'a musician playing']])
cat('instrumentos musicales', [['Tambor', 'a drum'], ['Trompeta', 'a trumpet'], ['Guitarra', 'a guitar'], ['Piano', 'a piano'], ['Violín', 'a violin'], ['Flauta', 'a recorder flute'],
  ['Xilófono', 'a xylophone'], ['Maracas', 'a pair of maracas'], ['Arpa', 'a harp'], ['Saxofón', 'a saxophone'], ['Pandereta', 'a tambourine'], ['Acordeón', 'an accordion'],
  ['Batería', 'a drum kit'], ['Triángulo', 'a musical triangle'], ['Violonchelo', 'a cello']])
cat('deportes', [['Fútbol', 'a child playing football (soccer)'], ['Natación', 'a person swimming in a pool'], ['Baloncesto', 'a person shooting a basketball into a hoop'], ['Tenis', 'a person playing tennis'],
  ['Ciclismo', 'a cyclist racing on a road bike'], ['Esquí', 'a person skiing on snow'], ['Atletismo', 'a runner on an athletics track'], ['Gimnasia', 'a gymnast doing a cartwheel'], ['Golf', 'a person playing golf'],
  ['Judo', 'two children practising judo'], ['Patinaje', 'a person roller skating'], ['Balonmano', 'a person throwing a handball'], ['Vela', 'a small sailing boat on the sea'], ['Escalada', 'a person rock climbing'], ['Voleibol', 'people playing volleyball']])
cat('universo', [['Sol', 'the sun'], ['Luna', 'the full moon in the night sky'], ['Estrella', 'a bright star in the night sky'], ['Tierra', 'planet Earth seen from space'], ['Cohete', 'a space rocket'], ['Saturno', 'the planet Saturn with its rings']])
cat('tiempo atmosférico', [['Soleado', 'a sunny day landscape'], ['Lluvioso', 'a rainy day landscape'], ['Nevado', 'a snowy day landscape'], ['Nublado', 'a cloudy grey day landscape'],
  ['Ventoso', 'a windy day with trees bending'], ['Tormenta', 'a thunderstorm with lightning'], ['Niebla', 'a foggy day landscape'], ['Granizo', 'hail falling on the ground'], ['Arcoíris', 'a rainbow in the sky']])
cat('estaciones', [['Verano', 'a summer scene: beach and sun'], ['Otoño', 'an autumn scene: fallen dry leaves'], ['Invierno', 'a winter scene: bare trees and warm clothes'], ['Primavera', 'a spring scene: blooming flowers']])
cat('momentos', [['Mañana', 'early morning: sunrise and breakfast on the table'], ['Noche', 'night: dark sky with moon and a child in bed'], ['Cumpleaños', 'a birthday cake with lit candles'],
  ['Lluvia', 'a child with an umbrella in the rain'], ['Navidad', 'a decorated Christmas tree with presents'], ['Hora del baño', 'a child in a bathtub with foam']])
cat('lugares', [['Parque', 'a playground in a park'], ['Colegio', 'a primary school classroom'], ['Supermercado', 'a supermarket aisle'], ['Piscina', 'a swimming pool'], ['Hospital', 'a hospital building'],
  ['Biblioteca', 'a library with shelves of books'], ['Playa', 'a sandy beach'], ['Peluquería', 'a hair salon'], ['Restaurante', 'a restaurant with tables'], ['Cine', 'a cinema screen and seats'],
  ['Zoo', 'a zoo with animals'], ['Estación de tren', 'a train station platform'], ['Panadería', 'a bakery shop with bread'], ['Granja', 'a farm with a barn'], ['Aeropuerto', 'an airport with planes'],
  ['Farmacia', 'a pharmacy shop'], ['Polideportivo', 'a sports hall'], ['Gasolinera', 'a petrol station']])
cat('transportes', [['Coche en la carretera', 'a car driving on a road'], ['Avión en el cielo', 'an airplane flying in the sky'], ['Barco en el mar', 'a boat sailing on the sea'],
  ['Tren en las vías', 'a train on railway tracks'], ['Bicicleta', 'a child riding a bicycle on a path'], ['Caballo', 'a person riding a horse'], ['Submarino', 'a submarine under the sea'],
  ['Globo aerostático', 'a hot air balloon in the sky'], ['Patinete', 'a child riding a kick scooter']])
cat('cuentos', [['Caperucita Roja', "a children's illustration of Little Red Riding Hood with the wolf in the forest, no text"], ['Los tres cerditos', "a children's illustration of the three little pigs and their houses, no text"],
  ['Ricitos de Oro', "a children's illustration of Goldilocks with the three bears' bowls, no text"], ['Blancanieves', "a children's illustration of a fairy-tale princess with black hair and a red apple in the forest, with seven little bearded miners, no text"],
  ['Pinocho', "a children's illustration of Pinocchio, a wooden puppet boy with a long nose, original style, no text"], ['Cenicienta', "a children's illustration of a fairy-tale girl in a ball gown running down palace stairs at midnight, losing one glass shoe, a pumpkin-shaped carriage behind, no text"],
  ['Hansel y Gretel', "a children's illustration of Hansel and Gretel at the gingerbread house, no text"], ['El patito feo', "a children's illustration of the ugly duckling, no text"],
  ['El gato con botas', "a children's illustration of a clever cat wearing tall boots and a feathered hat, standing on two legs, no text"]])
cat('escenas', [['Mamá come sopa', 'a mother eating soup'], ['Papá lee un libro', 'a father reading a book'], ['El niño duerme', 'a boy sleeping in bed'], ['El perro corre', 'a dog running'],
  ['La niña bebe agua', 'a girl drinking water'], ['Papá lava el coche', 'a father washing the car'], ['El gato salta', 'a cat jumping'], ['Mamá pinta una casa', 'a mother painting a picture of a house'],
  ['El bebé llora', 'a baby crying'], ['La vaca come hierba', 'a cow eating grass'], ['El niño nada', 'a boy swimming'], ['La abuela canta', 'a grandmother singing'],
  ['El pájaro vuela', 'a bird flying'], ['Papá cocina', 'a father cooking'], ['La niña ríe', 'a girl laughing'], ['El sol brilla', 'the sun shining brightly'],
  ['El niño come una manzana', 'a boy eating an apple'], ['Mamá abre la puerta', 'a mother opening a door'], ['La pelota es roja', 'a red ball'], ['El abuelo camina', 'a grandfather walking with a cane'],
  ['La niña dibuja un sol', 'a girl drawing a sun on paper'], ['El tren pasa', 'a train passing by'], ['La maestra escribe', 'a teacher writing on a blackboard'], ['El león ruge', 'a lion roaring']])

// Del banco del piloto (ya existen)
const BANCO = {
  Coche: 'vehiculos/coche', Avión: 'vehiculos/avion', Barco: 'vehiculos/barco', Manzana: 'alimentos/manzana', Plátano: 'alimentos/platano', Fresa: 'alimentos/fresa',
  Galleta: 'alimentos/galleta', Pan: 'alimentos/pan', Vaca: 'animales-de-granja/vaca', Caballo: 'animales-de-granja/caballo', Camiseta: 'prendas-de-vestir/camiseta', Zapatos: 'prendas-de-vestir/zapatos',
}

// ---------- programas ----------
const tri = (lista) => { const g = []; for (let i = 0; i < lista.length; i += 3) g.push(lista.slice(i, i + 3)); return g }
const P = []
function nombres(programa, categoria, lista) { P.push({ programa, tipo: 'nombre', grupos: tri(lista).map((g) => g.map((n) => ({ oido: n, concepto: ref(categoria, n) }))) }) }

nombres('Vincular Mutuamente Animales Salvajes con sus Nombres', 'animales salvajes', ['León', 'Jirafa', 'Elefante', 'Tigre', 'Cebra', 'Mono', 'Oso', 'Hipopótamo', 'Cocodrilo', 'Rinoceronte', 'Canguro', 'Búho', 'Lobo', 'Camello', 'Koala', 'Gorila', 'Ciervo', 'Serpiente', 'Panda', 'Águila', 'Leopardo', 'Zorro', 'Avestruz', 'Tortuga'])
nombres('Vincular Mutuamente Animales Marinos con sus Nombres', 'animales marinos', ['Pulpo', 'Ballena', 'Medusa', 'Tiburón', 'Estrella de mar', 'Cangrejo', 'Delfín', 'Caballito de mar', 'Langosta', 'Foca', 'Pez payaso', 'Calamar', 'Tortuga marina', 'Gamba', 'Raya', 'Morsa', 'Erizo de mar', 'Pez espada'])
nombres('Vincular Mutuamente Partes del Cuerpo con sus Nombres', 'partes del cuerpo', ['Mano', 'Ojo', 'Pelo', 'Nariz', 'Pie', 'Oreja', 'Boca', 'Rodilla', 'Brazo', 'Dedo', 'Barriga', 'Cuello', 'Diente', 'Pierna', 'Codo', 'Lengua', 'Espalda', 'Uña'])
nombres('Vincular Mutuamente Utensilios de Cocina con sus Nombres', 'utensilios de cocina', ['Cuchara', 'Plato', 'Vaso', 'Tenedor', 'Olla', 'Taza', 'Cuchillo', 'Sartén', 'Jarra', 'Bol', 'Colador', 'Rodillo', 'Espátula', 'Tetera', 'Embudo', 'Cazo', 'Rallador', 'Servilleta'])
nombres('Vincular Mutuamente Plantas con sus Nombres', 'plantas', ['Girasol', 'Cactus', 'Pino', 'Rosa', 'Palmera', 'Helecho', 'Margarita', 'Roble', 'Bambú', 'Tulipán', 'Olivo', 'Trébol', 'Lavanda', 'Sauce', 'Maíz'])
nombres('Vincular Mutuamente Materiales Escolares con sus Nombres', 'material escolar', ['Lápiz', 'Libro', 'Tijeras', 'Goma', 'Mochila', 'Regla', 'Pegamento', 'Estuche', 'Sacapuntas', 'Cuaderno', 'Pincel', 'Rotulador', 'Ceras', 'Carpeta', 'Compás', 'Plastilina', 'Pizarra', 'Grapadora'])
nombres('Vincular Mutuamente Dependencias de una Casa con sus Nombres', 'dependencias de la casa', ['Cocina', 'Baño', 'Dormitorio', 'Salón', 'Garaje', 'Jardín', 'Comedor', 'Terraza', 'Lavadero'])
nombres('Vincular Mutuamente Herramientas con sus Nombres', 'herramientas', ['Martillo', 'Destornillador', 'Sierra', 'Llave inglesa', 'Taladro', 'Pala', 'Alicates', 'Rastrillo', 'Brocha', 'Metro', 'Escalera', 'Carretilla'])
nombres('Vincular Mutuamente Electrodomésticos con sus Nombres', 'electrodomésticos', ['Televisión', 'Frigorífico', 'Lavadora', 'Microondas', 'Aspiradora', 'Secador', 'Horno', 'Plancha', 'Tostadora', 'Batidora', 'Ventilador', 'Lavavajillas', 'Cafetera', 'Exprimidor', 'Radio'])
nombres('Vincular Mutuamente Muebles con sus Nombres', 'muebles', ['Silla', 'Mesa', 'Cama', 'Sofá', 'Armario', 'Estantería', 'Lámpara', 'Cómoda', 'Escritorio', 'Mesita de noche', 'Taburete', 'Perchero', 'Cuna', 'Banco', 'Espejo', 'Baúl', 'Mecedora', 'Sillón'])
nombres('Vincular Mutuamente Características con sus Nombres', 'características', ['Mojado', 'Roto', 'Sucio', 'Abierto', 'Lleno', 'Encendido', 'Limpio', 'Cerrado', 'Vacío', 'Seco', 'Apagado', 'Arrugado'])
nombres('Vincular Mutuamente Profesiones con sus Nombres', 'profesiones', ['Bombero', 'Médico', 'Panadero', 'Policía', 'Maestra', 'Peluquero', 'Cartero', 'Cocinero', 'Agricultor', 'Dentista', 'Pintor', 'Conductor de autobús', 'Veterinario', 'Albañil', 'Piloto', 'Carpintero', 'Enfermera', 'Fontanero', 'Mecánico', 'Jardinero', 'Pescador', 'Astronauta', 'Socorrista', 'Músico'])
nombres('Vincular Mutuamente Instrumentos Musicales con sus Nombres', 'instrumentos musicales', ['Tambor', 'Trompeta', 'Guitarra', 'Piano', 'Violín', 'Flauta', 'Xilófono', 'Maracas', 'Arpa', 'Saxofón', 'Pandereta', 'Acordeón', 'Batería', 'Triángulo', 'Violonchelo'])
nombres('Vincular Mutuamente Deportes con sus Nombres', 'deportes', ['Fútbol', 'Natación', 'Baloncesto', 'Tenis', 'Ciclismo', 'Esquí', 'Atletismo', 'Gimnasia', 'Golf', 'Judo', 'Patinaje', 'Balonmano', 'Vela', 'Escalada', 'Voleibol'])
nombres('Vincular Mutuamente Partes del Universo con sus Nombres', 'universo', ['Sol', 'Luna', 'Estrella', 'Tierra', 'Cohete', 'Saturno'])
nombres('Vincular Mutuamente Climas con sus Nombres', 'tiempo atmosférico', ['Soleado', 'Lluvioso', 'Nevado', 'Nublado', 'Ventoso', 'Tormenta', 'Niebla', 'Granizo', 'Arcoíris'])
nombres('Vincular Mutuamente Estaciones del Año con sus Nombres', 'estaciones', ['Verano', 'Otoño', 'Invierno', 'Primavera', 'Verano', 'Invierno'])
nombres('Vincular Mutuamente Emociones con sus Nombres', 'emociones', ['Contento', 'Triste', 'Enfadado', 'Asustado', 'Sorprendido', 'Asco', 'Tranquilo', 'Aburrido', 'Nervioso'])
nombres('Vincular Mutuamente Sensaciones Corporales con sus Nombres', 'sensaciones', ['Frío', 'Calor', 'Sueño', 'Hambre', 'Sed', 'Dolor', 'Cansancio', 'Picor', 'Mareo'])
nombres('Vincular Mutuamente Acciones con sus Nombres', 'acciones', ['Correr', 'Comer', 'Dormir', 'Saltar', 'Beber', 'Leer', 'Nadar', 'Pintar', 'Llorar', 'Bailar', 'Escribir', 'Lavarse las manos', 'Cantar', 'Barrer', 'Abrazar', 'Jugar', 'Cocinar', 'Peinarse', 'Montar en bici', 'Ducharse', 'Aplaudir', 'Subir escaleras', 'Cortar', 'Soplar'])
nombres('Vincular Mutuamente Cuentos con sus Nombres', 'cuentos', ['Caperucita Roja', 'Los tres cerditos', 'Ricitos de Oro', 'Blancanieves', 'Pinocho', 'Cenicienta', 'Hansel y Gretel', 'El patito feo', 'El gato con botas'])


// Preguntas: A palabra oída, B imagen, C respuesta oída
function preguntas(programa, filas) { P.push({ programa, tipo: 'pregunta', grupos: tri(filas).map((g) => g.map(([oido, concepto, respuesta]) => ({ oido, concepto, respuesta }))) }) }
const o = (n) => C[`objetos/${slug(n)}`] ? `objetos/${slug(n)}` : BANCO[n] ?? ref('material escolar', n)
P.push({ programa: 'Vincular Mutuamente Estímulos Preferidos con sus Nombres', tipo: 'nombre', grupos: tri([['Galleta', BANCO.Galleta], ['Peluche', o('Peluche')], ['Pan', BANCO.Pan],
  ['Gominolas', ref('alimentos', 'Gominolas')], ['Coche de juguete', o('Coche de juguete')], ['Zumo', ref('alimentos', 'Zumo')], ['Pelota', o('Pelota')], ['Helado', ref('alimentos', 'Helado')], ['Pompas de jabón', o('Pompas de jabón')],
  ['Chocolate', ref('alimentos', 'Chocolate')], ['Muñeca', o('Muñeca')], ['Patatas fritas', ref('alimentos', 'Patatas fritas')], ['Plastilina', ref('material escolar', 'Plastilina')], ['Globo', o('Globo')], ['Puzle', o('Puzle')]]).map((g) => g.map(([oido, concepto]) => ({ oido, concepto }))) })
preguntas('Responder a Preguntas sobre Funciones de los Objetos', [
  ['Tijeras', ref('material escolar', 'Tijeras'), 'Para cortar'], ['Vaso', ref('utensilios de cocina', 'Vaso'), 'Para beber'], ['Cama', ref('muebles', 'Cama'), 'Para dormir'],
  ['Lápiz', ref('material escolar', 'Lápiz'), 'Para escribir'], ['Peine', o('Peine'), 'Para peinarse'], ['Escoba', o('Escoba'), 'Para barrer'],
  ['Cuchara', ref('utensilios de cocina', 'Cuchara'), 'Para comer'], ['Jabón', o('Jabón'), 'Para lavarse las manos'], ['Paraguas', o('Paraguas'), 'Para no mojarse'],
  ['Llave', o('Llave'), 'Para abrir la puerta'], ['Toalla', o('Toalla'), 'Para secarse'], ['Cepillo de dientes', o('Cepillo de dientes'), 'Para lavarse los dientes'],
  ['Teléfono', o('Teléfono'), 'Para llamar'], ['Silla', ref('muebles', 'Silla'), 'Para sentarse'], ['Abrigo', o('Abrigo'), 'Para no tener frío'],
  ['Pelota', o('Pelota'), 'Para jugar'], ['Gafas', o('Gafas'), 'Para ver mejor'], ['Grifo', o('Grifo'), 'Para sacar agua'],
  ['Bicicleta', o('Bicicleta'), 'Para montar'], ['Reloj', o('Reloj'), 'Para saber la hora'], ['Linterna', o('Linterna'), 'Para alumbrar'],
  ['Libro', ref('material escolar', 'Libro'), 'Para leer'], ['Frigorífico', ref('electrodomésticos', 'Frigorífico'), 'Para enfriar la comida'], ['Martillo', ref('herramientas', 'Martillo'), 'Para clavar']])
P.push({ programa: 'Vincular Mutuamente Funciones de los Objetos con sus Nombres', tipo: 'funcion', grupos: P.at(-1).grupos.map((g) => g.map((e) => ({ oido: e.respuesta, concepto: e.concepto }))) })
const prof = ['Bombero', 'Apaga el fuego', 'Médico', 'Cura a los enfermos', 'Panadero', 'Hace el pan', 'Policía', 'Detiene a los ladrones', 'Maestra', 'Enseña a los niños', 'Peluquero', 'Corta el pelo',
  'Cartero', 'Reparte las cartas', 'Cocinero', 'Cocina la comida', 'Agricultor', 'Cultiva la tierra', 'Dentista', 'Cuida los dientes', 'Pintor', 'Pinta las paredes', 'Conductor de autobús', 'Conduce el autobús',
  'Veterinario', 'Cura a los animales', 'Albañil', 'Construye casas', 'Piloto', 'Pilota el avión', 'Carpintero', 'Hace muebles de madera', 'Enfermera', 'Pone las vacunas', 'Fontanero', 'Arregla los grifos',
  'Mecánico', 'Arregla los coches', 'Jardinero', 'Cuida las plantas', 'Pescador', 'Pesca peces', 'Astronauta', 'Viaja al espacio', 'Socorrista', 'Vigila la playa', 'Músico', 'Toca música']
preguntas('Responder a Preguntas ¿Quién?', Array.from({ length: prof.length / 2 }, (_, i) => [prof[2 * i], ref('profesiones', prof[2 * i]), prof[2 * i + 1]]))
preguntas('Responder a Preguntas sobre Características', [
  ['Plátano', BANCO.Plátano, 'Amarillo'], ['Fresa', BANCO.Fresa, 'Roja'], ['Lechuga', ref('alimentos', 'Lechuga'), 'Verde'],
  ['Nieve', ref('tiempo atmosférico', 'Nevado'), 'Blanca'], ['Chocolate', ref('alimentos', 'Chocolate'), 'Marrón'], ['Mar', ref('transportes', 'Barco en el mar'), 'Azul'],
  ['Pelota', o('Pelota'), 'Redonda'], ['Helado', ref('alimentos', 'Helado'), 'Frío'], ['Fuego', ref('peligros', 'Fuego'), 'Caliente'],
  ['Peluche', o('Peluche'), 'Suave'], ['Cactus', ref('plantas', 'Cactus'), 'Pincha'], ['Limón', ref('alimentos', 'Limón'), 'Ácido'],
  ['Elefante', ref('animales salvajes', 'Elefante'), 'Grande'], ['Serpiente', ref('animales salvajes', 'Serpiente'), 'Larga'], ['Miel', ref('alimentos', 'Miel'), 'Dulce'],
  ['Tortuga', ref('animales salvajes', 'Tortuga'), 'Lenta'], ['Cohete', ref('universo', 'Cohete'), 'Rápido'], ['Globo', o('Globo'), 'Ligero']])
preguntas('Responder a Preguntas ¿Dónde?', [
  ['Cocina', ref('dependencias de la casa', 'Cocina'), 'Cocinar'], ['Baño', ref('dependencias de la casa', 'Baño'), 'Ducharnos'], ['Dormitorio', ref('dependencias de la casa', 'Dormitorio'), 'Dormir'],
  ['Parque', ref('lugares', 'Parque'), 'Jugar en los columpios'], ['Colegio', ref('lugares', 'Colegio'), 'Aprender'], ['Supermercado', ref('lugares', 'Supermercado'), 'Comprar comida'],
  ['Piscina', ref('lugares', 'Piscina'), 'Nadar'], ['Hospital', ref('lugares', 'Hospital'), 'Curarnos'], ['Biblioteca', ref('lugares', 'Biblioteca'), 'Coger libros'],
  ['Playa', ref('lugares', 'Playa'), 'Hacer castillos de arena'], ['Peluquería', ref('lugares', 'Peluquería'), 'Cortarnos el pelo'], ['Restaurante', ref('lugares', 'Restaurante'), 'Comer fuera de casa'],
  ['Cine', ref('lugares', 'Cine'), 'Ver películas'], ['Zoo', ref('lugares', 'Zoo'), 'Ver animales'], ['Estación de tren', ref('lugares', 'Estación de tren'), 'Coger el tren'],
  ['Panadería', ref('lugares', 'Panadería'), 'Comprar el pan'], ['Granja', ref('lugares', 'Granja'), 'Ver vacas y gallinas'], ['Aeropuerto', ref('lugares', 'Aeropuerto'), 'Coger el avión'],
  ['Farmacia', ref('lugares', 'Farmacia'), 'Comprar medicinas'], ['Polideportivo', ref('lugares', 'Polideportivo'), 'Hacer deporte'], ['Gasolinera', ref('lugares', 'Gasolinera'), 'Echar gasolina']])
preguntas('Responder a Preguntas ¿Cuándo?', [
  ['Verano', ref('estaciones', 'Verano'), 'Vamos a la playa'], ['Otoño', ref('estaciones', 'Otoño'), 'Se caen las hojas'], ['Invierno', ref('estaciones', 'Invierno'), 'Nos ponemos el abrigo'],
  ['Primavera', ref('estaciones', 'Primavera'), 'Salen las flores'], ['Por la noche', ref('momentos', 'Noche'), 'Dormimos'], ['Por la mañana', ref('momentos', 'Mañana'), 'Desayunamos'],
  ['En mi cumpleaños', ref('momentos', 'Cumpleaños'), 'Soplo las velas'], ['Cuando llueve', ref('momentos', 'Lluvia'), 'Abrimos el paraguas'], ['En Navidad', ref('momentos', 'Navidad'), 'Abrimos regalos']])
preguntas('Responder a Preguntas ¿Cómo?', [
  ['Coche', ref('transportes', 'Coche en la carretera'), 'Por la carretera'], ['Avión', ref('transportes', 'Avión en el cielo'), 'Por el aire'], ['Barco', ref('transportes', 'Barco en el mar'), 'Por el mar'],
  ['Tren', ref('transportes', 'Tren en las vías'), 'Por las vías'], ['Bicicleta', ref('transportes', 'Bicicleta'), 'Pedaleando'], ['Caballo', ref('transportes', 'Caballo'), 'Montando a caballo'],
  ['Submarino', ref('transportes', 'Submarino'), 'Por debajo del agua'], ['Globo', ref('transportes', 'Globo aerostático'), 'Flotando en el aire'], ['Patinete', ref('transportes', 'Patinete'), 'Empujando con el pie']])

// Igualar imágenes: identidad con objetos ya en el banco o de otras categorías
P.push({ programa: 'Igualar Imágenes', tipo: 'igualar', grupos: tri([o('Pelota'), BANCO.Coche, BANCO.Manzana, ref('animales salvajes', 'León'), BANCO.Zapatos, ref('utensilios de cocina', 'Vaso'),
  o('Paraguas'), BANCO.Vaca, ref('material escolar', 'Lápiz'), ref('muebles', 'Silla'), BANCO.Plátano, ref('instrumentos musicales', 'Guitarra'),
  o('Llave'), ref('animales marinos', 'Pulpo'), BANCO.Camiseta, ref('plantas', 'Girasol'), o('Reloj'), BANCO.Avión,
  ref('utensilios de cocina', 'Taza'), o('Peluche'), ref('herramientas', 'Martillo'), ref('electrodomésticos', 'Tostadora'), BANCO.Caballo, o('Globo')]).map((g) => g.map((c) => ({ concepto: c }))) })

// Anclas fotográficas de los programas que ya tienen grupos (por nombre del estímulo)
const ANCLAS = {
  Coche: BANCO.Coche, Pelota: o('Pelota'), Sol: ref('universo', 'Sol'), Gato: 'animales-de-granja/gato', Vaso: ref('utensilios de cocina', 'Vaso'), Cuchara: ref('utensilios de cocina', 'Cuchara'),
  Perro: 'animales-de-granja/perro', Manzana: BANCO.Manzana, Zapato: BANCO.Zapatos, Cama: ref('muebles', 'Cama'), Tijeras: ref('material escolar', 'Tijeras'), Pez: 'animales-de-granja/pez',
  Plátano: BANCO.Plátano, Silla: ref('muebles', 'Silla'), Libro: ref('material escolar', 'Libro'), Vaca: BANCO.Vaca, Camiseta: BANCO.Camiseta, Avión: BANCO.Avión, Galleta: BANCO.Galleta,
  Barco: BANCO.Barco, Llave: o('Llave'), Caballo: BANCO.Caballo, Lápiz: ref('material escolar', 'Lápiz'), Reloj: o('Reloj'),
  'Imagen de fuego': ref('peligros', 'Fuego'), 'Imagen de enchufe': ref('peligros', 'Enchufe'), 'Imagen de cuchillo': ref('peligros', 'Cuchillo'), 'Imagen de plancha caliente': ref('peligros', 'Plancha caliente'),
  'Imagen de medicamentos': ref('peligros', 'Medicamentos'), 'Imagen de lejía': ref('peligros', 'Lejía'), 'Imagen de sartén caliente': ref('peligros', 'Sartén caliente'), 'Imagen de cristal roto': ref('peligros', 'Cristal roto'),
  'Imagen de vela encendida': ref('peligros', 'Vela encendida'), 'Imagen de avispa': ref('peligros', 'Avispa'), 'Imagen de horno encendido': ref('peligros', 'Horno encendido'), 'Imagen de agua hirviendo': ref('peligros', 'Agua hirviendo'),
  'Imagen de estufa encendida': ref('peligros', 'Estufa encendida'), 'Imagen de abeja': ref('peligros', 'Abeja'), 'Imagen de cúter': ref('peligros', 'Cúter'), 'Imagen de cerillas': ref('peligros', 'Cerillas'),
  'Pelota (seguro)': o('Pelota'), 'Peluche (seguro)': o('Peluche'), 'Globo (seguro)': o('Globo'), 'Cuento (seguro)': o('Cuento'), 'Cubo y pala (seguro)': o('Cubo y pala'), 'Muñeca (seguro)': o('Muñeca'),
  'Coche de juguete (seguro)': o('Coche de juguete'), 'Pinturas (seguro)': o('Pinturas'),
  'Señal de "para"': ref('señales', 'Señal de para'), 'Gesto de "ven"': ref('señales', 'Gesto de ven'), 'Pictograma de "siéntate"': ref('señales', 'Pictograma de siéntate'),
  'Semáforo en rojo ("para")': ref('señales', 'Semáforo en rojo'), 'Gesto de "ven" (otra persona)': ref('señales', 'Gesto de ven'), 'Pictograma de "siéntate" (otra silla)': ref('señales', 'Pictograma de siéntate'),
  'Mano levantada con la palma hacia delante ("para")': ref('señales', 'Mano levantada (para)'), 'Gesto de "ven" (tercera persona)': ref('señales', 'Gesto de ven'), 'Pictograma de "siéntate" (banco)': ref('señales', 'Pictograma de siéntate (banco)'),
  'Gesto de "silencio" (dedo en los labios)': ref('señales', 'Gesto de silencio'), 'Gesto de "mira" (señalar los ojos)': ref('señales', 'Gesto de mira'), 'Gesto de "dame" (mano abierta)': ref('señales', 'Gesto de dame'),
  'Pictograma de "silencio"': ref('señales', 'Pictograma de silencio'), 'Pictograma de "mira"': ref('señales', 'Pictograma de mira'), 'Pictograma de "dame"': ref('señales', 'Pictograma de dame'),
  'Gesto de "levántate" (palmas hacia arriba)': ref('señales', 'Gesto de levántate'), 'Gesto de "espera" (dedo índice levantado)': ref('señales', 'Gesto de espera'), 'Gesto de "coge" (señalar el objeto)': ref('señales', 'Gesto de coge'),
  'Pictograma de "levántate"': ref('señales', 'Pictograma de levántate'), 'Pictograma de "espera"': ref('señales', 'Pictograma de espera'), 'Pictograma de "coge"': ref('señales', 'Pictograma de coge'),
  'Semáforo en verde ("pasa")': ref('señales', 'Semáforo en verde'), 'Gesto de "adiós"': ref('señales', 'Gesto de adiós'), 'Gesto de "hola"': ref('señales', 'Gesto de hola'),
}
for (const [emo, nom] of [['Contento', 'contenta'], ['Triste', 'triste'], ['Enfadado', 'enfadada'], ['Asustado', 'asustada'], ['Sorprendido', 'sorprendida']]) {
  for (const sufijo of ['', ' (otra persona)', ' (niño)', ' (abuela)', ' (dibujo)']) ANCLAS[`Cara ${nom}${sufijo}`] = ref('emociones', emo)
}
for (const sufijo of ['', ' (otra persona)', ' (niño)']) ANCLAS[`Cara de asco${sufijo}`] = ref('emociones', 'Asco')
// Escenas de las oraciones (Leer Oraciones y Textos)
for (const k of Object.keys(C).filter((k) => k.startsWith('escenas/'))) ANCLAS[`escena:${C[k].nombre}`] = k
// Gato, perro y pez como animales domésticos
cat('animales de granja', [['Gato', 'a cat'], ['Perro', 'a dog'], ['Pez', 'a goldfish']])

// ---------- comprobar contra la BD ----------
const s = readFileSync(process.argv[2], 'utf8')
const filas = JSON.parse(s.slice(s.indexOf('{'))).rows
const anclasUsadas = new Map()
const sinAncla = new Set()
for (const f of filas) {
  if (f.concepto_imagen || f.pantalla || /^["“«]/.test(f.nombre)) continue
  if (!/Transferir Funciones|Leer Oraciones/.test(f.programa)) continue
  if (/^(Alimento|Juguete|Estímulo|Otro|Otra) /.test(f.nombre) || /^(Fruta|Ropa|Juguete|Libros|Zapatos|Material|Platos|Toallas|Alimentos|Herramientas|Basura|Medicinas|Abrigos|Cubiertos) /.test(f.nombre)) continue
  if (/^(Tesoro|Llave$|Pelota$|Bolsa|Mesa|Cesta|Puerta|Caja|Silla \(|Botón|Bebida)/.test(f.nombre) && /Espaciales|Oposición/.test(f.programa)) continue
  const escena = f.nombre.match(/^Imagen de (.+)$/)
  let k = ANCLAS[f.nombre]
  if (!k && escena && /Leer Oraciones/.test(f.programa)) {
    // «Imagen de una niña bebiendo agua» → escena de la oración de la misma clase
    const oracion = filas.find((x) => x.cid === f.cid && /^["“«]/.test(x.nombre))?.nombre.replace(/["“”«»]/g, '')
    k = oracion && ANCLAS[`escena:${oracion}`]
  }
  if (k) anclasUsadas.set(f.programa, [...(anclasUsadas.get(f.programa) ?? []), { nombre: f.nombre, grupo: f.grupo, concepto: k }])
  else sinAncla.add(`${f.programa} · ${f.nombre}`)
}

// Conceptos usados
const usos = new Map()
const usar = (k, programa) => { if (!k) return; usos.set(k, new Set([...(usos.get(k) ?? []), programa])) }
for (const p of P) for (const g of p.grupos) for (const e of g) usar(e.concepto, p.programa)
for (const [prog, xs] of anclasUsadas) for (const x of xs) usar(x.concepto, prog)
const enBanco = new Set(Object.values(BANCO))
const nuevos = [...usos.keys()].filter((k) => !enBanco.has(k))
for (const k of nuevos) if (!C[k]) throw new Error(`sin definición: ${k}`)

writeFileSync(process.argv[3], JSON.stringify({ programas: P, anclas: Object.fromEntries(anclasUsadas), conceptos: Object.fromEntries(nuevos.map((k) => [k, { ...C[k], programas: [...usos.get(k)] }])), banco: [...enBanco].filter((k) => usos.has(k)), sinAncla: [...sinAncla] }, null, 1))
const imagenes = nuevos.length * 3
console.log(`${P.length} programas con grupos, ${anclasUsadas.size} programas con anclas; ${usos.size} conceptos (${nuevos.length} nuevos, ${usos.size - nuevos.length} ya en el banco)`)
console.log(`imágenes nuevas (3 ejemplares): ${imagenes} ≈ ${(imagenes * 0.0336).toFixed(0)} €`)
console.log('sin ancla:', [...sinAncla].slice(0, 40).join('\n  '))
