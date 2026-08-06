-- Carga las mismas 16 notas y 5 items de "última hora" que antes vivían como
-- datos mock en lib/data/articles.ts (ese archivo ya no existe en el código —
-- su contenido quedó transcripto acá para que el sitio no arranque vacío).
--
-- Nota sobre "tendencias": de los 5 items de tendencias del mock original, solo
-- uno ("accidente-ruta-nacional") correspondía a una nota real — los otros 4
-- eran slugs sin nota asociada en los datos mock y se descartan acá. Por eso el
-- sidebar de tendencias va a mostrar una sola nota hasta que un admin le asigne
-- trending_rank a más notas desde /admin/articulos.

insert into public.articles
  (slug, title, subtitle, excerpt, body, image_url, category, author_name, author_image_url, status, homepage_section, trending_rank, comments_count, published_at)
values
  (
    'puente-ferroviario-concordia',
    'Provincia confirma inicio de obras en el puente ferroviario Concordia–Salto con inversión de 380 millones',
    'El proyecto histórico unirá las dos orillas del río Uruguay y se espera que dinamice el comercio regional en los próximos cinco años.',
    'La obra, que lleva décadas postergada, contará con financiamiento mixto entre Argentina y Uruguay.',
    '<p>El gobernador de Entre Ríos anunció esta mañana la firma del convenio que da inicio formal a las obras del puente ferroviario entre Concordia y Salto (Uruguay), un proyecto largamente esperado que transformará el comercio y la movilidad en la región mesopotámica.</p><p>La inversión total asciende a 380 millones de dólares, financiados en partes iguales por ambos países con aportes del Banco Interamericano de Desarrollo (BID). Los trabajos comenzarán en el segundo trimestre del año y se extenderán por aproximadamente cuatro años.</p><blockquote>"Este puente es mucho más que cemento y acero; es la promesa de progreso para miles de familias entrerrianas y uruguayas que durante décadas cruzaron el río en barcaza."</blockquote><p>La estructura tendrá una longitud de 2,8 kilómetros e incluirá vías para trenes de carga, una calzada vial y una ciclovía. Se estima que el tráfico de mercancías aumente un 40% tras su inauguración.</p>',
    'https://picsum.photos/seed/hero-puente/1400/700',
    'Local', 'María González', 'https://picsum.photos/seed/author-mg/64/64',
    'published', 'destacada', null, 47, now() - interval '30 minutes'
  ),
  (
    'festival-termal-villaguay',
    'Festival termal de Villaguay bate récord de asistencia con más de 40.000 visitantes',
    'Las termas entrerrianas consolidan su posición como destino turístico preferido del litoral argentino.',
    'El festival de verano superó todas las expectativas y dejó una derrama económica récord en la región.',
    '<p>El Festival Termal de Villaguay cerró su edición 2025 con cifras históricas: más de 40.000 visitantes durante los cinco días del evento, según datos de la Secretaría de Turismo provincial.</p><p>La derramo económica estimada supera los 120 millones de pesos, beneficiando a hoteles, restaurantes y comercios locales que experimentaron una ocupación del 97% durante el fin de semana central.</p><blockquote>"Villaguay demostró que el turismo termal puede ser un motor de desarrollo sostenible para toda la provincia."</blockquote>',
    'https://picsum.photos/seed/local1/800/500',
    'Local', 'Ana Martínez', 'https://picsum.photos/seed/author-am/64/64',
    'published', 'local', null, 23, now() - interval '1 hour'
  ),
  (
    'pavimentacion-rutas-provinciales',
    'Vialidad Provincial inicia pavimentación de 85 km de rutas en el interior entrerriano',
    'La obra beneficiará a comunidades rurales del departamento Paraná y Diamante con mejoras en conectividad.',
    'El plan vial 2025 destina $4.200 millones a la mejora de caminos rurales productivos.',
    '<p>La Dirección de Vialidad de Entre Ríos dio inicio este lunes a la pavimentación de 85 kilómetros de rutas provinciales en los departamentos Paraná y Diamante, en el marco del Plan Vial Rural 2025.</p><p>La inversión de 4.200 millones de pesos permitirá mejorar la salida de producción agropecuaria de la zona, que actualmente enfrenta serias dificultades logísticas en períodos de lluvia.</p><blockquote>"Pavimentar los caminos rurales no es solo una obra vial; es una inversión directa en la rentabilidad del productor entrerriano."</blockquote>',
    'https://picsum.photos/seed/local2/800/500',
    'Local', 'Carlos Fernández', 'https://picsum.photos/seed/author-cf/64/64',
    'published', 'local', null, 18, now() - interval '3 hours'
  ),
  (
    'murga-parana-campeona',
    'La murga "Los Hijos del Paraná" conquista el primer lugar en el Carnaval del País',
    'El espectáculo de tres noches emocionó a miles de espectadores con una propuesta artística sobre la identidad entrerriana.',
    'Gualeguaychú festeja un nuevo triunfo en el Carnaval del País 2025.',
    '<p>La murga "Los Hijos del Paraná" se coronó campeona del Carnaval del País 2025 en Gualeguaychú, tras tres noches de competencia que dejaron al público sin aliento.</p><p>La propuesta artística, centrada en la historia y la identidad entrerriana, fue elogiada por el jurado por su originalidad, sincronización y el mensaje emotivo que transmitió en cada número.</p>',
    'https://picsum.photos/seed/local3/800/500',
    'Cultura', 'Sofía López', 'https://picsum.photos/seed/author-sl/64/64',
    'published', 'local', null, 56, now() - interval '5 hours'
  ),
  (
    'hospital-diamante-equipamiento',
    'Hospital de Diamante recibe equipamiento de diagnóstico por imágenes de última generación',
    'La incorporación de resonador magnético y tomógrafo evitará traslados de pacientes a Paraná.',
    'La inversión de $800 millones mejorará la atención de salud para 30.000 habitantes del departamento.',
    '<p>El Hospital "Dr. Ramón Carrillo" de Diamante incorporó esta semana un resonador magnético de 1,5 Tesla y un tomógrafo multicorte de 64 canales, equipamiento que hasta ahora solo estaba disponible en hospitales de Paraná.</p><p>La inversión, de aproximadamente 800 millones de pesos, fue financiada con fondos provinciales y permitirá que los 30.000 habitantes del departamento Diamante accedan a estudios de alta complejidad sin necesidad de viajar.</p>',
    'https://picsum.photos/seed/local4/800/500',
    'Salud', 'Pedro Ramírez', 'https://picsum.photos/seed/author-pr/64/64',
    'published', 'local', null, 31, now() - interval '7 hours'
  ),
  (
    'reforma-sistema-salud',
    'Congreso debate reforma integral del sistema de salud pública con foco en atención primaria',
    'El proyecto busca fortalecer los centros de salud barriales y reducir la presión sobre hospitales de alta complejidad.',
    'La reforma propone redistribuir recursos del sistema hospitalario hacia la atención primaria.',
    '<p>La Cámara de Diputados comenzó el debate del proyecto de reforma integral del sistema de salud pública, una iniciativa que propone un cambio de paradigma en la atención médica nacional.</p><p>El eje central es fortalecer los 8.500 centros de atención primaria del país, dotándolos de médicos de cabecera, equipamiento básico y sistemas digitales de historia clínica unificada.</p><blockquote>"La mejor política de salud es la que llega antes de que la gente se enferme. Necesitamos un sistema que piense en la prevención, no solo en la cura."</blockquote>',
    'https://picsum.photos/seed/nacional1/800/500',
    'Salud', 'Juliana Moreno', 'https://picsum.photos/seed/author-jm/64/64',
    'published', 'nacional', null, 88, now() - interval '2 hours'
  ),
  (
    'acuerdo-pesca-maritima',
    'Argentina firma acuerdo internacional de pesca sustentable que protege 3 millones de km² de mar argentino',
    'El convenio con 12 países establece cuotas de captura, crea zonas marinas protegidas y fortalece controles.',
    'El tratado es considerado el más importante en materia de conservación marina de la última década.',
    '<p>Argentina firmó un histórico acuerdo internacional de pesca sustentable junto a otras 12 naciones del Atlántico Sur, que establece cuotas de captura, crea zonas marinas protegidas y refuerza los controles contra la pesca ilegal.</p><p>El convenio protege aproximadamente 3 millones de kilómetros cuadrados del Mar Argentino, una de las regiones pesqueras más ricas del planeta, amenazada por décadas de sobreexplotación.</p>',
    'https://picsum.photos/seed/nacional2/800/500',
    'Ambiente', 'Laura Gutiérrez', 'https://picsum.photos/seed/author-lg/64/64',
    'published', 'nacional', null, 42, now() - interval '6 hours'
  ),
  (
    'inversion-extranjera-decada',
    'Inversión extranjera directa registra el mayor nivel de la última década',
    'Energía renovable, tecnología agrícola y logística lideran las colocaciones de capital.',
    'El primer trimestre del año cerró con un ingreso de USD 4.200 millones en inversión extranjera directa.',
    '<p>El primer trimestre del año cerró con un ingreso de 4.200 millones de dólares en inversión extranjera directa (IED), el mayor registro desde 2015, según datos del Banco Central.</p><p>Los sectores que lideran el ingreso de capitales son energías renovables (32%), agroindustria y tecnología agrícola (28%) y logística e infraestructura (19%).</p>',
    'https://picsum.photos/seed/nacional3/800/500',
    'Economía', 'Roberto Silva', 'https://picsum.photos/seed/author-rs/64/64',
    'published', 'nacional', null, 35, now() - interval '8 hours'
  ),
  (
    'fibra-optica-rural',
    'Lanza país primera red nacional de fibra óptica rural con cobertura a 500 localidades',
    'El proyecto busca cerrar la brecha digital y llevar conectividad a comunidades alejadas.',
    'La red conectará 500 localidades de menos de 5.000 habitantes en los próximos 18 meses.',
    '<p>El gobierno nacional presentó el Plan Nacional de Conectividad Rural, que llevará fibra óptica a 500 localidades de menos de 5.000 habitantes en todo el país, con un plazo de 18 meses para su implementación.</p><p>La inversión total es de 85.000 millones de pesos y beneficiará a aproximadamente 1,2 millones de argentinos que hoy carecen de acceso a internet de calidad.</p>',
    'https://picsum.photos/seed/nacional4/800/500',
    'Tecnología', 'Andrea Ramírez', 'https://picsum.photos/seed/author-ar/64/64',
    'published', 'nacional', null, 29, now() - interval '10 hours'
  ),
  (
    'desarticulan-banda-comercio-ilegal',
    'Desarticulan banda dedicada al comercio ilegal de fauna silvestre en Entre Ríos',
    'Operativo conjunto de Prefectura y policía provincial rescató más de 200 animales.',
    'El procedimiento se realizó en tres localidades y terminó con cuatro detenidos.',
    '<p>Un operativo conjunto entre la Prefectura Naval Argentina y la Policía de Entre Ríos desarticuló una banda dedicada al comercio ilegal de fauna silvestre autóctona, con cuatro detenidos y más de 200 animales rescatados.</p><p>Los allanamientos se realizaron simultáneamente en Paraná, Diamante y Victoria, donde se encontraron ejemplares de carpinchos, nutrias, loros y varias especies de reptiles protegidos por la ley nacional.</p>',
    'https://picsum.photos/seed/cronica1/800/500',
    'Policial', 'Diego Torres', 'https://picsum.photos/seed/author-dt/64/64',
    'published', 'cronicas', null, 67, now() - interval '2 hours'
  ),
  (
    'estafas-bancarias-parana',
    'Identifican red de estafas bancarias que afectó a más de 300 víctimas en Paraná',
    'Los investigadores siguieron el rastro digital de las transferencias por seis meses.',
    'La maniobra combinaba ingeniería social, phishing y clonación de tarjetas.',
    '<p>La Unidad Fiscal de Cibercrimen de Paraná desarticuló una red de estafas bancarias que operó durante al menos ocho meses y causó perjuicios por más de 180 millones de pesos a más de 300 víctimas de la capital provincial.</p><p>La metodología combinaba ingeniería social, envío de mensajes de phishing y clonación de tarjetas de débito en comercios cómplices. Cinco personas fueron detenidas en allanamientos simultáneos.</p>',
    'https://picsum.photos/seed/cronica2/800/500',
    'Policial', 'Valeria Cruz', 'https://picsum.photos/seed/author-vc/64/64',
    'published', 'cronicas', null, 41, now() - interval '4 hours'
  ),
  (
    'accidente-ruta-nacional',
    'Severo accidente en ruta nacional 18 deja tres heridos de gravedad',
    'El choque entre un camión y dos automóviles se produjo por la mañana en zona de niebla.',
    'Los heridos fueron trasladados al hospital Escuela de Paraná.',
    '<p>Un grave accidente de tránsito ocurrido esta mañana sobre la ruta nacional 18, a la altura del kilómetro 56, dejó tres heridos de gravedad y dos leves, según informó la División Siniestros Viales de la Policía de Entre Ríos.</p><p>El siniestro involucró a un camión de carga y dos automóviles particulares, en condiciones de visibilidad reducida por una densa niebla. Los tres heridos graves fueron trasladados al Hospital Escuela de Paraná.</p>',
    'https://picsum.photos/seed/cronica3/800/500',
    'Policial', 'Martín Ibáñez', 'https://picsum.photos/seed/author-mi/64/64',
    'published', 'cronicas', 1, 54, now() - interval '1 hour'
  ),
  (
    'ola-calor-entre-rios',
    'Ola de calor histórica: Entre Ríos registra temperatura récord de 44°C en Concordia',
    'Las autoridades de salud declaran alerta sanitaria y activan protocolos de emergencia.',
    'El SMNH emitió alerta roja para toda la provincia durante los próximos tres días.',
    '<p>Entre Ríos vivió este miércoles la jornada más calurosa en toda su historia registrada: la estación meteorológica de Concordia marcó 44,2 grados centígrados, superando el récord anterior de 43,6°C del verano de 2003.</p><p>El Servicio Meteorológico Nacional (SMN) emitió alerta roja para toda la provincia y proyecta que la ola de calor se extenderá por al menos tres días más.</p><blockquote>"Estamos ante un evento climático extremo sin precedentes en la región. La población debe extremar los cuidados y evitar la exposición al sol entre las 11 y las 18 horas."</blockquote>',
    'https://picsum.photos/seed/leida1/1200/600',
    'Local', 'Ana Martínez', 'https://picsum.photos/seed/author-am/64/64',
    'published', 'mas_leidas', null, 89, now() - interval '3 hours'
  ),
  (
    'maraton-parana-3000-corredores',
    'La maratón del río Paraná convoca a 3.000 corredores de diez países distintos',
    'El recorrido de 42 km bordea el río y atraviesa el Parque Urquiza en su tramo final.',
    'La edición 2025 es la más internacional de su historia.',
    '<p>La 12ª edición de la Maratón del Río Paraná reunirá este domingo a 3.000 corredores provenientes de diez países, consolidando el evento como el más importante del litoral argentino y uno de los más convocantes de Sudamérica.</p><p>El recorrido de 42 kilómetros bordea el río durante su primera mitad y atraviesa el Parque Urquiza en el emocionante tramo final, con miles de espectadores acompañando a los atletas.</p>',
    'https://picsum.photos/seed/leida2/1200/600',
    'Deportes', 'Sebastián Ortiz', 'https://picsum.photos/seed/author-so/64/64',
    'published', 'mas_leidas', null, 44, now() - interval '5 hours'
  ),
  (
    'aumento-jubilaciones-impacto',
    'El aumento de jubilaciones del 18% impacta positivamente en el consumo del interior',
    'Comerciantes del interior provincial reportan un incremento del 12% en ventas durante el primer mes.',
    'Los sectores de alimentos, farmacia y electrodomésticos son los más beneficiados.',
    '<p>El aumento del 18% en jubilaciones y pensiones que entró en vigencia el mes pasado ya muestra impactos concretos en la actividad comercial del interior de Entre Ríos, según un relevamiento de la Cámara de Comercio provincial.</p><p>Los comerciantes encuestados en Paraná, Concordia, Gualeguaychú y Concepción del Uruguay reportan un crecimiento promedio del 12% en ventas respecto al mismo período del año anterior.</p>',
    'https://picsum.photos/seed/leida3/1200/600',
    'Economía', 'Carmen Vidal', 'https://picsum.photos/seed/author-cv/64/64',
    'published', 'mas_leidas', null, 72, now() - interval '6 hours'
  ),
  (
    'fabrica-automotriz-concordia',
    'Nueva fábrica de componentes automotrices generará 400 puestos de trabajo en Entre Ríos',
    'La planta se instalará en el parque industrial de Concordia y comenzará a operar el próximo año.',
    'AutoParts anuncia inversión de USD 120 millones en la provincia.',
    '<p>La empresa multinacional AutoParts anunció la instalación de una planta en el parque industrial de Concordia, una inversión de 120 millones de dólares que generará 400 puestos de trabajo directos y otros 600 indirectos.</p><blockquote>"Elegimos Entre Ríos por su ubicación estratégica, la calidad de su fuerza laboral y el compromiso de las autoridades locales."</blockquote>',
    'https://picsum.photos/seed/leida4/1200/600',
    'Empleo', 'Roberto Silva', 'https://picsum.photos/seed/author-rs/64/64',
    'published', 'mas_leidas', null, 33, now() - interval '8 hours'
  ),
  (
    'biodiversidad-corredor-uruguay',
    'Universidad entrerriana presenta estudio sobre biodiversidad del corredor fluvial del Uruguay',
    'El relevamiento identificó 340 especies de flora y fauna en un tramo de 80 kilómetros del río.',
    'Tres especies registradas son nuevas para la ciencia.',
    '<p>El equipo de biología de la Universidad Nacional de Entre Ríos presentó los resultados de un inventario de biodiversidad realizado durante dos años en el corredor del río Uruguay, que reveló 340 especies, incluyendo tres no registradas previamente en la ciencia.</p><blockquote>"Cada vez que creemos conocer bien nuestro territorio, la naturaleza nos sorprende. Este estudio demuestra que aún hay mucho por descubrir y proteger en Entre Ríos."</blockquote>',
    'https://picsum.photos/seed/leida5/1200/600',
    'Ciencia', 'Laura Gutiérrez', 'https://picsum.photos/seed/author-lg/64/64',
    'published', 'mas_leidas', null, 16, now() - interval '10 hours'
  );

insert into public.breaking_news (text, is_active, sort_order)
values
  ('Consejo Municipal aprueba nuevo presupuesto para infraestructura vial 2025', true, 0),
  ('Lluvias intensas en la zona sur: alerta amarilla emitida por autoridades', true, 1),
  ('Selección nacional se prepara para clasificatorio continental', true, 2),
  ('Feria regional del emprendimiento supera expectativas de asistencia', true, 3),
  ('Nuevo hospital regional comenzará operaciones en marzo', true, 4);
