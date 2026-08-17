// Locale registry + UI-string dictionaries.
//
// Content model: translations are separate Sanity story documents sharing a
// storyId, distinguished by the `language` field. English lives at the URL
// root; other locales are path-prefixed (/de/inspire/...). Only Inspire is
// localized so far — guides, destinations and utility pages stay English
// until their content is translated.

export const LOCALES = ["en", "de", "es", "fr", "lt"];
export const DEFAULT_LOCALE = "en";
export const ALT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export const LANG_NAMES = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  lt: "Lietuvių",
};

// For Date#toLocaleDateString on server-rendered dates.
export const DATE_LOCALES = {
  en: "en-GB",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  lt: "lt-LT",
};

export function isLocale(value) {
  return LOCALES.includes(value);
}

export function langFromPathname(pathname) {
  const first = (pathname || "").split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

// Strip a leading locale prefix: "/de/inspire/x" → "/inspire/x".
export function pathWithoutLocale(pathname) {
  const lang = langFromPathname(pathname);
  if (lang === DEFAULT_LOCALE) return pathname || "/";
  const stripped = (pathname || "").replace(new RegExp(`^/${lang}(?=/|$)`), "");
  return stripped || "/";
}

export function localePath(lang, path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!lang || lang === DEFAULT_LOCALE) return p;
  return `/${lang}${p === "/" ? "" : p}`;
}

const en = {
  nav: {
    destinations: "Destinations",
    guides: "Guides",
    inspire: "Inspire",
    aboutMe: "About me",
    explore: "Explore",
    about: "About",
  },
  inspireList: {
    title: "Real journeys. Real lessons",
    subtitle: "Stories to spark your next trip",
    searchPlaceholder: "Search stories – try 'glacier' or 'layover'",
    searchButton: "Search",
    filterDuration: "Duration",
    filterStyle: "Style",
    heading: "Journeys, not just posts",
    story: "story",
    stories: "stories",
    noMatchTitle: "No matching journeys",
    noMatchBody: "Try a shorter phrase or clear the search.",
    clearSearch: "Clear search",
    guideBadge: "Guide",
    familyBadge: "Family",
    credibility: [
      "140+ countries",
      "15+ years of independent planning",
      "5/7 summits completed",
      "Routes tested in real trips",
    ],
    collectionsHeading: "Explore by type of journey",
    viewCollection: "View collection",
    collections: [
      {
        title: "Swiss Alpine Days",
        intro:
          "Structured day trips from Zurich that combine alpine scenery, transport logic, and realistic pacing.",
      },
      {
        title: "Self-Guided Country Routes",
        intro:
          "Longer routes built around flow, logistics, and what actually works on the ground.",
      },
      {
        title: "Extreme Experiences",
        intro:
          "The experiences that shape how routes are designed and tested in the real world.",
      },
      {
        title: "Expedition Routes",
        intro:
          "Long-form journeys shaped by overland logistics, difficult borders, and uncertainty.",
      },
    ],
    howITestTitle: "How I test the routes behind my guides",
    howITestBody:
      "I don't build routes from a desk. I test them in the field – through altitude, logistics, terrain, and real-world uncertainty.",
    extremeLabels: [
      "Running with the bulls | Spain",
      "Shark diving | Fiji",
      "Volcano boarding | Nicaragua",
      "Skydiving & paragliding | Brazil",
      "Ice climbing | Italy",
      "Riding the iron ore train | Mauritania",
      "Summit pushes | Alaska",
      "Remote crossings | West Africa",
    ],
    ctaTitle: "Ready to turn inspiration into a real route?",
    ctaBody:
      "Premium guides built from 15 years of independent travel across 140 countries.",
    browseGuides: "Browse Guides →",
    emptyTitle: "Translations coming soon",
    emptyBody:
      "These stories already exist in English – translations are on the way.",
    emptyLink: "Read in English →",
    readStory: "Read the story",
  },
  story: {
    quickFacts: "Quick Facts",
    bestSeason: "Best season:",
    fullGuideChip: "Full guide available ↓",
    planningTrip: "Planning this trip?",
    planningBody:
      "The full guide covers the route, logistics, costs, booking links and timings – everything you need to plan this yourself.",
    readFullGuide: "See the guide →",
    browseAllGuides: "Browse all guides →",
    moreFrom: "More from {country}",
    exploreDestination: "Explore {country} →",
    turnInspiration: "Turn inspiration into a plan",
    guidesCardTitle: "TestedRoutes Guides",
    guidesCardBody:
      "Route-tested guides built from 15 years of independent travel. PDF format, works offline.",
    endCtaTitle: "Liked the story? The route is already planned.",
    endCtaBody:
      "Get the tested guide for this trip – exact route, bookings, costs and timings in one PDF.",
    gallery: "Gallery",
    guidesForTrip: "Guides for this trip",
  },
  guideList: {
    title: "Guides",
    tagline: "Print it, follow it, the trip works",
    heading: "Field-tested travel guides",
    browseHeading: "Browse guides",
    filterType: "Trip type",
    filterCountry: "Country",
    filterAll: "All",
    filterLength: "Length",
    filterActivity: "Activity",
    filterSeason: "Season",
    typeCountry: "Type a country…",
    mostGuides: "Most guides",
    allOfContinent: "All of {name}",
    allCountries: "All countries",
    countriesWord: "countries",
    trust: [
      { title: "Walked in person", body: "Tested on the ground, not behind a screen" },
      { title: "Made for the road", body: "One PDF, offline-ready, no app required" },
      { title: "Real numbers", body: "Costs, timings and logistics that add up" },
    ],
    testedBy: "Tested by",
    credentials: "140 countries",
    guide: "guide",
    guides: "guides",
    pdfGuide: "PDF guide",
    purchased: "purchased",
    from: "From",
    viewGuide: "View Guide",
    buyGuide: "Buy Guide",
    searchPlaceholder: "Search guides…",
    comingSoon: "Coming soon",
    metaDescription:
      "Every guide is a real route, tested in the field. Buy once, follow step by step.",
  },
  guide: {
    metaDescPrefix: "Self-guided travel guide:",
    viewAllPhotos: "View all",
    readFullStory: "Read the full story →",
    tripDetails: "Trip details",
    lastReviewed: "Last reviewed",
    location: "Location",
    startingPoint: "Starting point",
    stop: "Stop",
    destination: "Destination",
    finish: "Finish",
    whyThisTrip: "Why this trip",
    whoThisIsFor: "Who this is for",
    notSuitable: "Not suitable",
    whatYouGet: "What you get",
    affiliateHeading: "Affiliate disclosure.",
    affiliateBody:
      "Some links below are affiliate links. When you buy through them, we may earn a small commission at no extra cost to you. As an Amazon Associate, TestedRoutes earns from qualifying purchases.",
    affiliateMore: "More on how this works",
    myExperience: "My Experience",
    continuesInFull: "Continues in the full guide",
    wantFullPlan: "Want the full plan?",
    pdfIncludes:
      "The PDF includes the day-by-day plan, transport timings, booking links, and weather rules. Instant download after purchase.",
    getFullGuide: "Get the full guide",
    readersSay: "What readers say",
    saveTime: "Save time and money",
    guidedTour: "Guided tour",
    fixedSchedule: "Fixed schedule · Group pace",
    planYourself: "Plan yourself",
    hoursPlus: "8+ hours",
    researchRisk: "Research · Risk of gaps",
    thisGuide: "This guide",
    thirtyMin: "30 min · Complete route",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        question: "Is this guide up to date?",
        answer:
          "Yes. Every TestedRoutes guide is reviewed regularly – the date at the top of the trip details shows when it was last reviewed. Reviews flag broken bookings, transport changes, prices, and seasonal closures so the guide stays accurate as conditions change.",
      },
      {
        question: "What format is the guide?",
        answer:
          "PDF, downloadable instantly after purchase. It works offline once saved to your phone, tablet, or laptop – no app required.",
      },
      {
        question: "What if the weather is bad on my day?",
        answer:
          "The guide includes go/no-go decision rules and weather-dependent alternatives where they exist. If the trip is fully weather-dependent and your dates don't work, request a refund within 30 days.",
      },
      {
        question: "Can I get a refund if it doesn't work for me?",
        answer:
          "Yes – 30 days, no questions asked. Email refunds@testedroutes.com with your order ID. Full details in our refund policy.",
      },
    ],
    youMightAlsoLike: "You might also like",
    bottomLine1: "Travel more.",
    bottomLine2: "Waste less time planning.",
    bottomBody:
      "Premium travel guides built from 15 years of independent travel across 140 countries.",
    bottomTagline: "AI hasn't been there. I have.",
    bottomFooter: "PDF · Instant download · 30-day refund",
    getGuide: "Get the Guide",
    comingSoonBtn: "Coming soon",
    pdfGuideLabel: "PDF Guide",
    instantDownload: "Instant download",
    pdfInstantDownload: "PDF · Instant download",
    getLinksFree: "Get the links free",
    refunds: "30-day refunds, no questions asked.",
    readPolicy: "Read the policy",
    openBookingsOne: "Also open my booking link (hotel, transport)",
    openBookingsMany: "Also open my {count} booking links (hotel, transport)",
    trust: [
      { label: "Risk-free", rest: "30-day full refund" },
      { label: "One-time purchase", rest: "No subscription" },
      { label: "Works offline", rest: "Save to phone" },
    ],
  },
};

const de = {
  nav: {
    destinations: "Reiseziele",
    guides: "Guides",
    inspire: "Inspiration",
    aboutMe: "Über mich",
    explore: "Entdecken",
    about: "Über mich",
  },
  inspireList: {
    title: "Echte Reisen. Echte Erkenntnisse",
    subtitle: "Geschichten für deine nächste Reise",
    searchPlaceholder: "Geschichten durchsuchen – z. B. 'Gletscher' oder 'Layover'",
    searchButton: "Suchen",
    filterDuration: "Dauer",
    filterStyle: "Stil",
    heading: "Reisen, nicht nur Posts",
    story: "Geschichte",
    stories: "Geschichten",
    noMatchTitle: "Keine passenden Reisen",
    noMatchBody: "Versuche einen kürzeren Begriff oder lösche die Suche.",
    clearSearch: "Suche löschen",
    guideBadge: "Guide",
    familyBadge: "Familie",
    credibility: [
      "140+ Länder",
      "15+ Jahre unabhängige Reiseplanung",
      "5/7 Summits bestiegen",
      "Routen auf echten Reisen getestet",
    ],
    collectionsHeading: "Nach Reiseart entdecken",
    viewCollection: "Kollektion ansehen",
    collections: [
      {
        title: "Schweizer Alpentage",
        intro:
          "Strukturierte Tagesausflüge ab Zürich – alpine Landschaft, klare Transportlogik und realistisches Tempo.",
      },
      {
        title: "Länderrouten auf eigene Faust",
        intro:
          "Längere Routen, gebaut auf Ablauf, Logistik und dem, was vor Ort wirklich funktioniert.",
      },
      {
        title: "Extreme Erlebnisse",
        intro:
          "Die Erlebnisse, die prägen, wie Routen in der echten Welt entworfen und getestet werden.",
      },
      {
        title: "Expeditionsrouten",
        intro:
          "Langstrecken, geprägt von Overland-Logistik, schwierigen Grenzen und Ungewissheit.",
      },
    ],
    howITestTitle: "Wie ich die Routen hinter meinen Guides teste",
    howITestBody:
      "Ich baue Routen nicht am Schreibtisch. Ich teste sie im Gelände – Höhe, Logistik, Terrain und echte Ungewissheit.",
    extremeLabels: [
      "Stierlauf | Spanien",
      "Haitauchen | Fidschi",
      "Volcano Boarding | Nicaragua",
      "Fallschirmspringen & Paragliding | Brasilien",
      "Eisklettern | Italien",
      "Mit dem Erzzug | Mauretanien",
      "Gipfeltouren | Alaska",
      "Grenzübergänge | Westafrika",
    ],
    ctaTitle: "Bereit, aus Inspiration eine echte Route zu machen?",
    ctaBody:
      "Premium-Reiseguides aus 15 Jahren unabhängigen Reisens durch 140 Länder.",
    browseGuides: "Guides entdecken →",
    emptyTitle: "Übersetzungen folgen in Kürze",
    emptyBody:
      "Diese Geschichten gibt es bereits auf Englisch – Übersetzungen sind unterwegs.",
    emptyLink: "Auf Englisch lesen →",
    readStory: "Geschichte lesen",
  },
  story: {
    quickFacts: "Auf einen Blick",
    bestSeason: "Beste Jahreszeit:",
    fullGuideChip: "Kompletter Guide verfügbar ↓",
    planningTrip: "Diese Reise planen?",
    planningBody:
      "Der komplette Guide deckt Route, Logistik, Kosten, Buchungslinks und Timing ab – alles, was du für die eigene Planung brauchst.",
    readFullGuide: "Zum Guide →",
    browseAllGuides: "Alle Guides ansehen →",
    moreFrom: "Mehr aus {country}",
    exploreDestination: "{country} entdecken →",
    turnInspiration: "Aus Inspiration wird ein Plan",
    guidesCardTitle: "TestedRoutes Guides",
    guidesCardBody:
      "Routengeprüfte Guides aus 15 Jahren unabhängigen Reisens. PDF-Format, offline nutzbar.",
    endCtaTitle: "Geschichte gefallen? Die Route ist schon geplant.",
    endCtaBody:
      "Hol dir den getesteten Guide zu dieser Reise – exakte Route, Buchungen, Kosten und Timing in einem PDF.",
    gallery: "Galerie",
    guidesForTrip: "Guides für diese Reise",
  },
  guideList: {
    title: "Guides",
    tagline: "Ausdrucken, folgen, der Trip funktioniert.",
    heading: "Im Gelände getestete Reiseguides",
    browseHeading: "Guides durchsuchen",
    filterType: "Reiseart",
    filterCountry: "Land",
    filterAll: "Alle",
    filterLength: "Dauer",
    filterActivity: "Aktivität",
    filterSeason: "Saison",
    typeCountry: "Land eingeben…",
    mostGuides: "Meiste Guides",
    allOfContinent: "Ganz {name}",
    allCountries: "Alle Länder",
    countriesWord: "Länder",
    trust: [
      { title: "Selbst gelaufen", body: "Am Boden getestet, nicht am Bildschirm" },
      { title: "Für unterwegs gemacht", body: "Ein PDF, offline nutzbar, keine App nötig" },
      { title: "Echte Zahlen", body: "Kosten, Zeiten und Logistik, die aufgehen" },
    ],
    testedBy: "Getestet von",
    credentials: "140 Länder",
    guide: "Guide",
    guides: "Guides",
    pdfGuide: "PDF-Guide",
    purchased: "mal gekauft",
    from: "Ab",
    viewGuide: "Guide ansehen",
    buyGuide: "Guide kaufen",
    searchPlaceholder: "Guides durchsuchen…",
    comingSoon: "Bald verfügbar",
    metaDescription:
      "Jeder Guide ist eine echte, im Gelände getestete Route. Einmal kaufen, Schritt für Schritt folgen.",
  },
  guide: {
    metaDescPrefix: "Reiseguide zum Selbstplanen:",
    viewAllPhotos: "Alle ansehen",
    readFullStory: "Zur ganzen Geschichte →",
    tripDetails: "Reisedetails",
    lastReviewed: "Zuletzt überprüft",
    location: "Lage & Route",
    startingPoint: "Startpunkt",
    stop: "Stopp",
    destination: "Ziel",
    finish: "Ende",
    whyThisTrip: "Warum dieser Trip",
    whoThisIsFor: "Für wen das ist",
    notSuitable: "Nicht geeignet",
    whatYouGet: "Was du bekommst",
    affiliateHeading: "Affiliate-Hinweis.",
    affiliateBody:
      "Einige Links unten sind Affiliate-Links. Kaufst du darüber, erhalten wir eine kleine Provision – ohne Mehrkosten für dich. Als Amazon-Partner verdient TestedRoutes an qualifizierten Käufen.",
    affiliateMore: "Mehr dazu, wie das funktioniert",
    myExperience: "Meine Erfahrung",
    continuesInFull: "Geht im kompletten Guide weiter",
    wantFullPlan: "Den kompletten Plan?",
    pdfIncludes:
      "Das PDF enthält den Tag-für-Tag-Plan, Transportzeiten, Buchungslinks und Wetterregeln. Sofort-Download nach dem Kauf.",
    getFullGuide: "Kompletten Guide holen",
    readersSay: "Was Leser sagen",
    saveTime: "Zeit und Geld sparen",
    guidedTour: "Geführte Tour",
    fixedSchedule: "Fester Zeitplan · Gruppentempo",
    planYourself: "Selbst planen",
    hoursPlus: "8+ Stunden",
    researchRisk: "Recherche · Risiko von Lücken",
    thisGuide: "Dieser Guide",
    thirtyMin: "30 Min · Komplette Route",
    faqTitle: "Häufige Fragen",
    faq: [
      {
        question: "Ist dieser Guide aktuell?",
        answer:
          "Ja. Jeder TestedRoutes-Guide wird regelmäßig überprüft – das Datum oben bei den Reisedetails zeigt die letzte Überprüfung. Dabei werden defekte Buchungslinks, Transportänderungen, Preise und saisonale Schließungen geprüft, damit der Guide korrekt bleibt.",
      },
      {
        question: "In welchem Format kommt der Guide?",
        answer:
          "Als PDF, sofort nach dem Kauf herunterladbar. Einmal auf Handy, Tablet oder Laptop gespeichert, funktioniert er offline – keine App nötig.",
      },
      {
        question: "Was, wenn das Wetter an meinem Tag schlecht ist?",
        answer:
          "Der Guide enthält Go/No-Go-Entscheidungsregeln und wetterabhängige Alternativen, wo es sie gibt. Ist der Trip komplett wetterabhängig und deine Termine passen nicht, fordere innerhalb von 30 Tagen eine Rückerstattung an.",
      },
      {
        question: "Bekomme ich eine Rückerstattung, wenn es nicht passt?",
        answer:
          "Ja – 30 Tage, ohne Nachfragen. Schreib an refunds@testedroutes.com mit deiner Bestellnummer. Alle Details in unserer Rückerstattungsrichtlinie.",
      },
    ],
    youMightAlsoLike: "Das könnte dir auch gefallen",
    bottomLine1: "Mehr reisen.",
    bottomLine2: "Weniger Zeit mit Planung verlieren.",
    bottomBody:
      "Premium-Reiseguides aus 15 Jahren unabhängigen Reisens durch 140 Länder.",
    bottomTagline: "KI war nicht dort. Ich schon.",
    bottomFooter: "PDF · Sofort-Download · 30 Tage Rückgaberecht",
    getGuide: "Guide holen",
    comingSoonBtn: "Bald verfügbar",
    pdfGuideLabel: "PDF-Guide",
    instantDownload: "Sofort-Download",
    pdfInstantDownload: "PDF · Sofort-Download",
    getLinksFree: "Links gratis erhalten",
    refunds: "30 Tage Geld zurück, ohne Nachfragen.",
    readPolicy: "Zur Richtlinie",
    openBookingsOne: "Öffne auch meinen Buchungslink (Hotel, Transport)",
    openBookingsMany: "Öffne auch meine {count} Buchungslinks (Hotel, Transport)",
    trust: [
      { label: "Ohne Risiko", rest: "30 Tage volle Rückerstattung" },
      { label: "Einmaliger Kauf", rest: "Kein Abo" },
      { label: "Funktioniert offline", rest: "Aufs Handy speichern" },
    ],
  },
};

const es = {
  nav: {
    destinations: "Destinos",
    guides: "Guías",
    inspire: "Inspiración",
    aboutMe: "Sobre mí",
    explore: "Explorar",
    about: "Sobre mí",
  },
  inspireList: {
    title: "Viajes reales. Lecciones reales",
    subtitle: "Historias para inspirar tu próximo viaje",
    searchPlaceholder: "Buscar historias – prueba 'glaciar' o 'escala'",
    searchButton: "Buscar",
    filterDuration: "Duración",
    filterStyle: "Estilo",
    heading: "Viajes, no solo publicaciones",
    story: "historia",
    stories: "historias",
    noMatchTitle: "No hay viajes que coincidan",
    noMatchBody: "Prueba una frase más corta o borra la búsqueda.",
    clearSearch: "Borrar búsqueda",
    guideBadge: "Guía",
    familyBadge: "Familia",
    credibility: [
      "Más de 140 países",
      "Más de 15 años planificando viajes independientes",
      "5/7 cumbres completadas",
      "Rutas probadas en viajes reales",
    ],
    collectionsHeading: "Explora por tipo de viaje",
    viewCollection: "Ver colección",
    collections: [
      {
        title: "Días alpinos en Suiza",
        intro:
          "Excursiones de un día desde Zúrich que combinan paisaje alpino, lógica de transporte y ritmo realista.",
      },
      {
        title: "Rutas por países por libre",
        intro:
          "Rutas largas construidas sobre el flujo, la logística y lo que de verdad funciona sobre el terreno.",
      },
      {
        title: "Experiencias extremas",
        intro:
          "Las experiencias que definen cómo se diseñan y prueban las rutas en el mundo real.",
      },
      {
        title: "Rutas de expedición",
        intro:
          "Viajes de larga distancia marcados por la logística terrestre, fronteras difíciles e incertidumbre.",
      },
    ],
    howITestTitle: "Cómo pruebo las rutas detrás de mis guías",
    howITestBody:
      "No construyo rutas desde un escritorio. Las pruebo sobre el terreno – altitud, logística, terreno e incertidumbre real.",
    extremeLabels: [
      "Encierro de Pamplona | España",
      "Buceo con tiburones | Fiyi",
      "Volcano boarding | Nicaragua",
      "Paracaidismo y parapente | Brasil",
      "Escalada en hielo | Italia",
      "El tren del mineral de hierro | Mauritania",
      "Cumbres | Alaska",
      "Cruces remotos | África Occidental",
    ],
    ctaTitle: "¿Listo para convertir la inspiración en una ruta real?",
    ctaBody:
      "Guías premium creadas tras 15 años de viajes independientes por 140 países.",
    browseGuides: "Ver guías →",
    emptyTitle: "Traducciones en camino",
    emptyBody:
      "Estas historias ya existen en inglés – las traducciones están en camino.",
    emptyLink: "Leer en inglés →",
    readStory: "Leer la historia",
  },
  story: {
    quickFacts: "Datos clave",
    bestSeason: "Mejor época:",
    fullGuideChip: "Guía completa disponible ↓",
    planningTrip: "¿Planificando este viaje?",
    planningBody:
      "La guía completa cubre la ruta, la logística, los costes, los enlaces de reserva y los tiempos – todo lo que necesitas para planificarlo por tu cuenta.",
    readFullGuide: "Ver la guía →",
    browseAllGuides: "Ver todas las guías →",
    moreFrom: "Más de {country}",
    exploreDestination: "Explorar {country} →",
    turnInspiration: "Convierte la inspiración en un plan",
    guidesCardTitle: "TestedRoutes Guides",
    guidesCardBody:
      "Guías probadas sobre el terreno, fruto de 15 años de viajes independientes. Formato PDF, funciona sin conexión.",
    endCtaTitle: "¿Te ha gustado la historia? La ruta ya está planificada.",
    endCtaBody:
      "Consigue la guía probada de este viaje – ruta exacta, reservas, costes y tiempos en un solo PDF.",
    gallery: "Galería",
    guidesForTrip: "Guías para este viaje",
  },
  guideList: {
    title: "Guías",
    tagline: "Imprímela, síguela y el viaje funciona.",
    heading: "Guías probadas sobre el terreno",
    browseHeading: "Explora las guías",
    filterType: "Tipo de viaje",
    filterCountry: "País",
    filterAll: "Todos",
    filterLength: "Duración",
    filterActivity: "Actividad",
    filterSeason: "Temporada",
    typeCountry: "Escribe un país…",
    mostGuides: "Más guías",
    allOfContinent: "Todo {name}",
    allCountries: "Todos los países",
    countriesWord: "países",
    trust: [
      { title: "Recorrido en persona", body: "Probado sobre el terreno, no detrás de una pantalla" },
      { title: "Hecha para el camino", body: "Un PDF, funciona sin conexión, sin apps" },
      { title: "Números reales", body: "Costes, tiempos y logística que cuadran" },
    ],
    testedBy: "Probado por",
    credentials: "140 países",
    guide: "guía",
    guides: "guías",
    pdfGuide: "Guía PDF",
    purchased: "compradas",
    from: "Desde",
    viewGuide: "Ver guía",
    buyGuide: "Comprar guía",
    searchPlaceholder: "Buscar guías…",
    comingSoon: "Próximamente",
    metaDescription:
      "Cada guía es una ruta real, probada sobre el terreno. Compra una vez, síguela paso a paso.",
  },
  guide: {
    metaDescPrefix: "Guía de viaje por libre:",
    viewAllPhotos: "Ver todo",
    readFullStory: "Leer la historia completa →",
    tripDetails: "Detalles del viaje",
    lastReviewed: "Última revisión",
    location: "Ubicación",
    startingPoint: "Punto de partida",
    stop: "Parada",
    destination: "Destino",
    finish: "Final",
    whyThisTrip: "Por qué este viaje",
    whoThisIsFor: "Para quién es",
    notSuitable: "No recomendado",
    whatYouGet: "Qué incluye",
    affiliateHeading: "Aviso de afiliados.",
    affiliateBody:
      "Algunos enlaces de abajo son enlaces de afiliado. Si compras a través de ellos, recibimos una pequeña comisión sin coste extra para ti. Como Asociado de Amazon, TestedRoutes gana con las compras que cumplen los requisitos.",
    affiliateMore: "Más sobre cómo funciona",
    myExperience: "Mi experiencia",
    continuesInFull: "Continúa en la guía completa",
    wantFullPlan: "¿Quieres el plan completo?",
    pdfIncludes:
      "El PDF incluye el plan día a día, horarios de transporte, enlaces de reserva y reglas según el tiempo. Descarga instantánea tras la compra.",
    getFullGuide: "Consigue la guía completa",
    readersSay: "Qué dicen los lectores",
    saveTime: "Ahorra tiempo y dinero",
    guidedTour: "Tour guiado",
    fixedSchedule: "Horario fijo · Ritmo de grupo",
    planYourself: "Planificarlo tú",
    hoursPlus: "Más de 8 horas",
    researchRisk: "Investigación · Riesgo de lagunas",
    thisGuide: "Esta guía",
    thirtyMin: "30 min · Ruta completa",
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        question: "¿Está actualizada esta guía?",
        answer:
          "Sí. Cada guía de TestedRoutes se revisa con regularidad – la fecha al inicio de los detalles del viaje muestra la última revisión. Las revisiones detectan reservas rotas, cambios de transporte, precios y cierres estacionales para que la guía siga siendo precisa.",
      },
      {
        question: "¿En qué formato está la guía?",
        answer:
          "PDF, descargable al instante tras la compra. Funciona sin conexión una vez guardada en tu móvil, tablet u ordenador – sin necesidad de app.",
      },
      {
        question: "¿Y si hace mal tiempo el día de mi viaje?",
        answer:
          "La guía incluye reglas de decisión go/no-go y alternativas según el tiempo cuando existen. Si el viaje depende totalmente del tiempo y tus fechas no funcionan, solicita un reembolso en un plazo de 30 días.",
      },
      {
        question: "¿Puedo pedir un reembolso si no me sirve?",
        answer:
          "Sí – 30 días, sin preguntas. Escribe a refunds@testedroutes.com con tu número de pedido. Todos los detalles en nuestra política de reembolsos.",
      },
    ],
    youMightAlsoLike: "También te puede gustar",
    bottomLine1: "Viaja más.",
    bottomLine2: "Pierde menos tiempo planificando.",
    bottomBody:
      "Guías premium creadas tras 15 años de viajes independientes por 140 países.",
    bottomTagline: "La IA no ha estado allí. Yo sí.",
    bottomFooter: "PDF · Descarga instantánea · Reembolso de 30 días",
    getGuide: "Consigue la guía",
    comingSoonBtn: "Próximamente",
    pdfGuideLabel: "Guía PDF",
    instantDownload: "Descarga instantánea",
    pdfInstantDownload: "PDF · Descarga instantánea",
    getLinksFree: "Consigue los enlaces gratis",
    refunds: "Reembolso de 30 días, sin preguntas.",
    readPolicy: "Leer la política",
    openBookingsOne: "Abrir también mi enlace de reserva (hotel, transporte)",
    openBookingsMany: "Abrir también mis {count} enlaces de reserva (hotel, transporte)",
    trust: [
      { label: "Sin riesgo", rest: "Reembolso completo de 30 días" },
      { label: "Pago único", rest: "Sin suscripción" },
      { label: "Funciona sin conexión", rest: "Guárdala en tu móvil" },
    ],
  },
};

const fr = {
  nav: {
    destinations: "Destinations",
    guides: "Guides",
    inspire: "Inspiration",
    aboutMe: "À propos",
    explore: "Explorer",
    about: "À propos",
  },
  inspireList: {
    title: "Des voyages réels. Des leçons réelles",
    subtitle: "Des histoires pour inspirer votre prochain voyage",
    searchPlaceholder: "Rechercher une histoire – essayez 'glacier' ou 'escale'",
    searchButton: "Rechercher",
    filterDuration: "Durée",
    filterStyle: "Style",
    heading: "Des voyages, pas seulement des posts",
    story: "histoire",
    stories: "histoires",
    noMatchTitle: "Aucun voyage correspondant",
    noMatchBody: "Essayez une phrase plus courte ou effacez la recherche.",
    clearSearch: "Effacer la recherche",
    guideBadge: "Guide",
    familyBadge: "Famille",
    credibility: [
      "Plus de 140 pays",
      "Plus de 15 ans de voyages indépendants",
      "5/7 sommets gravis",
      "Des itinéraires testés lors de vrais voyages",
    ],
    collectionsHeading: "Explorer par type de voyage",
    viewCollection: "Voir la collection",
    collections: [
      {
        title: "Journées alpines en Suisse",
        intro:
          "Des excursions à la journée au départ de Zurich – paysages alpins, logique de transport et rythme réaliste.",
      },
      {
        title: "Itinéraires en autonomie",
        intro:
          "Des itinéraires longs construits autour du déroulé, de la logistique et de ce qui fonctionne vraiment sur le terrain.",
      },
      {
        title: "Expériences extrêmes",
        intro:
          "Les expériences qui façonnent la conception et le test des itinéraires dans le monde réel.",
      },
      {
        title: "Itinéraires d'expédition",
        intro:
          "Des voyages au long cours marqués par la logistique terrestre, les frontières difficiles et l'incertitude.",
      },
    ],
    howITestTitle: "Comment je teste les itinéraires derrière mes guides",
    howITestBody:
      "Je ne construis pas d'itinéraires depuis un bureau. Je les teste sur le terrain – altitude, logistique, relief et incertitude réelle.",
    extremeLabels: [
      "Encierro de Pampelune | Espagne",
      "Plongée avec les requins | Fidji",
      "Volcano boarding | Nicaragua",
      "Parachutisme et parapente | Brésil",
      "Cascade de glace | Italie",
      "Le train du minerai de fer | Mauritanie",
      "Sommets | Alaska",
      "Passages isolés | Afrique de l'Ouest",
    ],
    ctaTitle: "Prêt à transformer l'inspiration en véritable itinéraire ?",
    ctaBody:
      "Des guides premium issus de 15 ans de voyages indépendants dans 140 pays.",
    browseGuides: "Découvrir les guides →",
    emptyTitle: "Traductions à venir",
    emptyBody:
      "Ces histoires existent déjà en anglais – les traductions arrivent.",
    emptyLink: "Lire en anglais →",
    readStory: "Lire l'histoire",
  },
  story: {
    quickFacts: "L'essentiel",
    bestSeason: "Meilleure saison :",
    fullGuideChip: "Guide complet disponible ↓",
    planningTrip: "Vous préparez ce voyage ?",
    planningBody:
      "Le guide complet couvre l'itinéraire, la logistique, le budget, les liens de réservation et les horaires – tout ce qu'il faut pour le planifier vous-même.",
    readFullGuide: "Voir le guide →",
    browseAllGuides: "Voir tous les guides →",
    moreFrom: "Plus sur {country}",
    exploreDestination: "Découvrir {country} →",
    turnInspiration: "Transformez l'inspiration en plan",
    guidesCardTitle: "TestedRoutes Guides",
    guidesCardBody:
      "Des guides testés sur le terrain, issus de 15 ans de voyages indépendants. Format PDF, utilisable hors ligne.",
    endCtaTitle: "L'histoire vous a plu ? L'itinéraire est déjà prêt.",
    endCtaBody:
      "Procurez-vous le guide testé de ce voyage – itinéraire exact, réservations, budget et horaires dans un seul PDF.",
    gallery: "Galerie",
    guidesForTrip: "Guides pour ce voyage",
  },
  guideList: {
    title: "Guides",
    tagline: "Imprimez-le, suivez-le, le voyage fonctionne.",
    heading: "Des guides testés sur le terrain",
    browseHeading: "Parcourir les guides",
    filterType: "Type de voyage",
    filterCountry: "Pays",
    filterAll: "Tous",
    filterLength: "Durée",
    filterActivity: "Activité",
    filterSeason: "Saison",
    typeCountry: "Saisissez un pays…",
    mostGuides: "Le plus de guides",
    allOfContinent: "Tout {name}",
    allCountries: "Tous les pays",
    countriesWord: "pays",
    trust: [
      { title: "Parcouru en personne", body: "Testé sur le terrain, pas derrière un écran" },
      { title: "Fait pour la route", body: "Un PDF, utilisable hors ligne, sans application" },
      { title: "De vrais chiffres", body: "Coûts, horaires et logistique qui tiennent la route" },
    ],
    testedBy: "Testé par",
    credentials: "140 pays",
    guide: "guide",
    guides: "guides",
    pdfGuide: "Guide PDF",
    purchased: "achetés",
    from: "À partir de",
    viewGuide: "Voir le guide",
    buyGuide: "Acheter le guide",
    searchPlaceholder: "Rechercher un guide…",
    comingSoon: "Bientôt disponible",
    metaDescription:
      "Chaque guide est un itinéraire réel, testé sur le terrain. Achetez une fois, suivez pas à pas.",
  },
  guide: {
    metaDescPrefix: "Guide de voyage en autonomie :",
    viewAllPhotos: "Tout voir",
    readFullStory: "Lire l'histoire complète →",
    tripDetails: "Détails du voyage",
    lastReviewed: "Dernière vérification",
    location: "Localisation",
    startingPoint: "Point de départ",
    stop: "Étape",
    destination: "Destination",
    finish: "Arrivée",
    whyThisTrip: "Pourquoi ce voyage",
    whoThisIsFor: "Pour qui",
    notSuitable: "Déconseillé",
    whatYouGet: "Ce que vous obtenez",
    affiliateHeading: "Information affiliation.",
    affiliateBody:
      "Certains liens ci-dessous sont des liens affiliés. Si vous achetez via ces liens, nous touchons une petite commission sans surcoût pour vous. En tant que Partenaire Amazon, TestedRoutes est rémunéré pour les achats éligibles.",
    affiliateMore: "En savoir plus sur ce fonctionnement",
    myExperience: "Mon expérience",
    continuesInFull: "La suite dans le guide complet",
    wantFullPlan: "Envie du plan complet ?",
    pdfIncludes:
      "Le PDF inclut le plan jour par jour, les horaires de transport, les liens de réservation et les règles météo. Téléchargement immédiat après l'achat.",
    getFullGuide: "Obtenir le guide complet",
    readersSay: "Ce que disent les lecteurs",
    saveTime: "Gagnez du temps et de l'argent",
    guidedTour: "Visite guidée",
    fixedSchedule: "Horaires fixes · Rythme de groupe",
    planYourself: "Planifier soi-même",
    hoursPlus: "8 h et plus",
    researchRisk: "Recherches · Risque d'oublis",
    thisGuide: "Ce guide",
    thirtyMin: "30 min · Itinéraire complet",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        question: "Ce guide est-il à jour ?",
        answer:
          "Oui. Chaque guide TestedRoutes est vérifié régulièrement – la date en haut des détails du voyage indique la dernière vérification. Ces contrôles repèrent les réservations obsolètes, les changements de transport, les prix et les fermetures saisonnières pour que le guide reste exact.",
      },
      {
        question: "Quel est le format du guide ?",
        answer:
          "PDF, téléchargeable immédiatement après l'achat. Il fonctionne hors ligne une fois enregistré sur votre téléphone, tablette ou ordinateur – aucune application requise.",
      },
      {
        question: "Et s'il fait mauvais le jour de mon voyage ?",
        answer:
          "Le guide inclut des règles de décision go/no-go et des alternatives selon la météo quand elles existent. Si le voyage dépend entièrement de la météo et que vos dates ne conviennent pas, demandez un remboursement sous 30 jours.",
      },
      {
        question: "Puis-je être remboursé si cela ne me convient pas ?",
        answer:
          "Oui – 30 jours, sans justification. Écrivez à refunds@testedroutes.com avec votre numéro de commande. Tous les détails dans notre politique de remboursement.",
      },
    ],
    youMightAlsoLike: "Vous aimerez peut-être aussi",
    bottomLine1: "Voyagez plus.",
    bottomLine2: "Perdez moins de temps à planifier.",
    bottomBody:
      "Des guides premium issus de 15 ans de voyages indépendants dans 140 pays.",
    bottomTagline: "L'IA n'y est pas allée. Moi, si.",
    bottomFooter: "PDF · Téléchargement immédiat · Remboursement 30 jours",
    getGuide: "Obtenir le guide",
    comingSoonBtn: "Bientôt disponible",
    pdfGuideLabel: "Guide PDF",
    instantDownload: "Téléchargement immédiat",
    pdfInstantDownload: "PDF · Téléchargement immédiat",
    getLinksFree: "Obtenir les liens gratuitement",
    refunds: "Remboursement sous 30 jours, sans justification.",
    readPolicy: "Lire la politique",
    openBookingsOne: "Ouvrir aussi mon lien de réservation (hôtel, transport)",
    openBookingsMany: "Ouvrir aussi mes {count} liens de réservation (hôtel, transport)",
    trust: [
      { label: "Sans risque", rest: "Remboursement intégral 30 jours" },
      { label: "Achat unique", rest: "Pas d'abonnement" },
      { label: "Fonctionne hors ligne", rest: "À enregistrer sur votre téléphone" },
    ],
  },
};

const lt = {
  nav: {
    destinations: "Kryptys",
    guides: "Gidai",
    inspire: "Įkvėpimas",
    aboutMe: "Apie mane",
    explore: "Naršyti",
    about: "Apie",
  },
  inspireList: {
    title: "Tikros kelionės. Tikros pamokos",
    subtitle: "Istorijos kitai jūsų kelionei įkvėpti",
    searchPlaceholder: "Ieškoti istorijų – pabandykite 'ledynas' arba 'persėdimas'",
    searchButton: "Ieškoti",
    filterDuration: "Trukmė",
    filterStyle: "Stilius",
    heading: "Kelionės, o ne tik įrašai",
    story: "istorija",
    stories: "istorijos",
    noMatchTitle: "Atitinkančių kelionių nerasta",
    noMatchBody: "Pabandykite trumpesnę frazę arba išvalykite paiešką.",
    clearSearch: "Išvalyti paiešką",
    guideBadge: "Gidas",
    familyBadge: "Šeimai",
    credibility: [
      "140+ šalių",
      "15+ metų savarankiško keliavimo patirties",
      "Įkopta į 5 iš 7 viršukalnių",
      "Maršrutai išbandyti tikrose kelionėse",
    ],
    collectionsHeading: "Naršykite pagal kelionės tipą",
    viewCollection: "Žiūrėti kolekciją",
    collections: [
      {
        title: "Alpių dienos Šveicarijoje",
        intro:
          "Struktūruotos dienos išvykos iš Ciuricho – Alpių peizažai, aiški transporto logika ir realistiškas tempas.",
      },
      {
        title: "Savarankiški maršrutai po šalis",
        intro:
          "Ilgesni maršrutai, sudėlioti pagal eigą, logistiką ir tai, kas iš tikrųjų veikia vietoje.",
      },
      {
        title: "Ekstremalios patirtys",
        intro:
          "Patirtys, kurios formuoja, kaip maršrutai kuriami ir išbandomi realiame pasaulyje.",
      },
      {
        title: "Ekspedicijų maršrutai",
        intro:
          "Ilgos kelionės, kurias lemia sausumos logistika, sudėtingos sienos ir neapibrėžtumas.",
      },
    ],
    howITestTitle: "Kaip išbandau savo gidų maršrutus",
    howITestBody:
      "Maršrutų nekuriu prie stalo. Išbandau juos vietoje – aukštis, logistika, reljefas ir tikras neapibrėžtumas.",
    extremeLabels: [
      "Bėgimas su buliais | Ispanija",
      "Nardymas su rykliais | Fidžis",
      "Lentos nuo ugnikalnio | Nikaragva",
      "Šuoliai parašiutu ir parasparniai | Brazilija",
      "Kopimas ledu | Italija",
      "Geležies rūdos traukinys | Mauritanija",
      "Viršukalnės | Aliaska",
      "Atokūs kirtimai | Vakarų Afrika",
    ],
    ctaTitle: "Pasiruošę įkvėpimą paversti tikru maršrutu?",
    ctaBody:
      "Aukščiausios kokybės gidai, gimę iš 15 metų savarankiškų kelionių po 140 šalių.",
    browseGuides: "Naršyti gidus →",
    emptyTitle: "Vertimai jau pakeliui",
    emptyBody: "Šios istorijos jau yra anglų kalba – vertimai netrukus.",
    emptyLink: "Skaityti angliškai →",
    readStory: "Skaityti istoriją",
  },
  story: {
    quickFacts: "Trumpai",
    bestSeason: "Geriausias metas:",
    fullGuideChip: "Yra pilnas gidas ↓",
    planningTrip: "Planuojate šią kelionę?",
    planningBody:
      "Pilname gide – maršrutas, logistika, išlaidos, rezervacijų nuorodos ir laikai: viskas, ko reikia susiplanuoti patiems.",
    readFullGuide: "Žiūrėti gidą →",
    browseAllGuides: "Žiūrėti visus gidus →",
    moreFrom: "Daugiau iš {country}",
    exploreDestination: "Atrasti {country} →",
    turnInspiration: "Paverskite įkvėpimą planu",
    guidesCardTitle: "TestedRoutes Guides",
    guidesCardBody:
      "Kelionėse išbandyti gidai, gimę iš 15 metų savarankiško keliavimo. PDF formatas, veikia be interneto.",
    endCtaTitle: "Patiko istorija? Maršrutas jau suplanuotas.",
    endCtaBody:
      "Įsigykite išbandytą šios kelionės gidą – tikslus maršrutas, rezervacijos, išlaidos ir laikai viename PDF.",
    gallery: "Galerija",
    guidesForTrip: "Šios kelionės gidai",
  },
  guideList: {
    title: "Gidai",
    tagline: "Atsispausdinkite, sekite – kelionė pavyks.",
    heading: "Kelionėse išbandyti gidai",
    browseHeading: "Naršyti gidus",
    filterType: "Kelionės tipas",
    filterCountry: "Šalis",
    filterAll: "Visi",
    filterLength: "Trukmė",
    filterActivity: "Veikla",
    filterSeason: "Sezonas",
    typeCountry: "Įveskite šalį…",
    mostGuides: "Daugiausia gidų",
    allOfContinent: "Visa {name}",
    allCountries: "Visos šalys",
    countriesWord: "šalys",
    trust: [
      { title: "Nueita savomis kojomis", body: "Išbandyta vietoje, ne prie ekrano" },
      { title: "Sukurta kelionei", body: "Vienas PDF, veikia be interneto, nereikia programėlės" },
      { title: "Tikri skaičiai", body: "Kainos, laikai ir logistika, kurie sutampa" },
    ],
    testedBy: "Išbandė",
    credentials: "140 šalių",
    guide: "gidas",
    guides: "gidai",
    pdfGuide: "PDF gidas",
    purchased: "nupirkta",
    from: "Nuo",
    viewGuide: "Žiūrėti gidą",
    buyGuide: "Pirkti gidą",
    searchPlaceholder: "Ieškoti gidų…",
    comingSoon: "Netrukus",
    metaDescription:
      "Kiekvienas gidas – tikras, kelionėje išbandytas maršrutas. Nusipirkite kartą, sekite žingsnis po žingsnio.",
  },
  guide: {
    metaDescPrefix: "Savarankiškos kelionės gidas:",
    viewAllPhotos: "Žiūrėti viską",
    readFullStory: "Skaityti visą istoriją →",
    tripDetails: "Kelionės detalės",
    lastReviewed: "Paskutinė peržiūra",
    location: "Vieta",
    startingPoint: "Starto taškas",
    stop: "Stotelė",
    destination: "Tikslas",
    finish: "Finišas",
    whyThisTrip: "Kodėl ši kelionė",
    whoThisIsFor: "Kam ji skirta",
    notSuitable: "Netinka",
    whatYouGet: "Ką gausite",
    affiliateHeading: "Partnerių nuorodos.",
    affiliateBody:
      "Kai kurios nuorodos žemiau yra partnerių nuorodos. Perkant per jas gauname nedidelį komisinį – jums tai nieko papildomai nekainuoja. Kaip „Amazon Associate“, TestedRoutes uždirba iš tinkamų pirkimų.",
    affiliateMore: "Daugiau apie tai, kaip tai veikia",
    myExperience: "Mano patirtis",
    continuesInFull: "Tęsinys pilname gide",
    wantFullPlan: "Norite viso plano?",
    pdfIncludes:
      "PDF gide – planas kiekvienai dienai, transporto laikai, rezervacijų nuorodos ir oro taisyklės. Atsisiuntimas iškart po pirkimo.",
    getFullGuide: "Gauti pilną gidą",
    readersSay: "Ką sako skaitytojai",
    saveTime: "Taupykite laiką ir pinigus",
    guidedTour: "Ekskursija su gidu",
    fixedSchedule: "Fiksuotas grafikas · Grupės tempas",
    planYourself: "Planuoti patiems",
    hoursPlus: "8+ valandų",
    researchRisk: "Paieškos · Spragų rizika",
    thisGuide: "Šis gidas",
    thirtyMin: "30 min · Pilnas maršrutas",
    faqTitle: "Dažni klausimai",
    faq: [
      {
        question: "Ar šis gidas atnaujintas?",
        answer:
          "Taip. Kiekvienas TestedRoutes gidas reguliariai peržiūrimas – data kelionės detalių viršuje rodo paskutinę peržiūrą. Peržiūrose tikrinamos neveikiančios rezervacijos, transporto pakeitimai, kainos ir sezoniniai uždarymai, kad gidas išliktų tikslus.",
      },
      {
        question: "Kokiu formatu gaunu gidą?",
        answer:
          "PDF, atsisiunčiamas iškart po pirkimo. Išsaugotas telefone, planšetėje ar kompiuteryje veikia be interneto – jokios programėlės nereikia.",
      },
      {
        question: "O jei mano dieną bus prastas oras?",
        answer:
          "Gide yra go/no-go sprendimų taisyklės ir nuo oro priklausančios alternatyvos, kur jos egzistuoja. Jei kelionė visiškai priklauso nuo oro ir jūsų datos netinka, per 30 dienų paprašykite pinigų grąžinimo.",
      },
      {
        question: "Ar galiu susigrąžinti pinigus, jei netiks?",
        answer:
          "Taip – 30 dienų, be klausimų. Parašykite refunds@testedroutes.com nurodydami užsakymo numerį. Visos detalės mūsų pinigų grąžinimo politikoje.",
      },
    ],
    youMightAlsoLike: "Taip pat gali patikti",
    bottomLine1: "Keliaukite daugiau.",
    bottomLine2: "Gaiškite mažiau laiko planavimui.",
    bottomBody:
      "Aukščiausios kokybės gidai, gimę iš 15 metų savarankiškų kelionių po 140 šalių.",
    bottomTagline: "DI ten nebuvo. Aš buvau.",
    bottomFooter: "PDF · Atsisiuntimas iškart · 30 dienų grąžinimas",
    getGuide: "Gauti gidą",
    comingSoonBtn: "Netrukus",
    pdfGuideLabel: "PDF gidas",
    instantDownload: "Atsisiuntimas iškart",
    pdfInstantDownload: "PDF · Atsisiuntimas iškart",
    getLinksFree: "Gauti nuorodas nemokamai",
    refunds: "30 dienų pinigų grąžinimas, be klausimų.",
    readPolicy: "Skaityti politiką",
    openBookingsOne: "Taip pat atidaryti mano rezervacijos nuorodą (viešbutis, transportas)",
    openBookingsMany: "Taip pat atidaryti mano {count} rezervacijų nuorodas (viešbutis, transportas)",
    trust: [
      { label: "Be rizikos", rest: "30 dienų pilnas grąžinimas" },
      { label: "Vienkartinis pirkimas", rest: "Jokios prenumeratos" },
      { label: "Veikia be interneto", rest: "Išsaugokite telefone" },
    ],
  },
};

const DICTS = { en, de, es, fr, lt };

export function getDict(lang) {
  return DICTS[lang] || DICTS[DEFAULT_LOCALE];
}
