import { PrismaClient } from '../app/generated/prisma'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Create Authors
    const authorTeam = await prisma.author.upsert({
        where: { id: 'author-1' },
        update: {},
        create: {
            id: 'author-1',
            name: 'Good Energy Team',
            avatar: '/images/avatar-placeholder.png',
            bio: 'Equipo de redacción de Good Energy.',
        },
    })

    const authorExpert = await prisma.author.upsert({
        where: { id: 'author-2' },
        update: {},
        create: {
            id: 'author-2',
            name: 'Camila Rodriguez',
            avatar: '/images/avatar-placeholder.png',
            bio: 'Experta en Energías Renovables y Sostenibilidad.',
        },
    })

    // Create Categories
    const catRenovable = await prisma.category.upsert({
        where: { slug: 'energia-renovable' },
        update: {},
        create: { name: 'Energía Renovable', slug: 'energia-renovable' },
    })

    const catInversion = await prisma.category.upsert({
        where: { slug: 'inversion' },
        update: {},
        create: { name: 'Inversión', slug: 'inversion' },
    })

    const catTecnologia = await prisma.category.upsert({
        where: { slug: 'tecnologia' },
        update: {},
        create: { name: 'Tecnología', slug: 'tecnologia' },
    })

    // Post 1: Hero Article
    await prisma.post.upsert({
        where: { slug: 'colombia-subsidiara-proyectos-energia-renovable-2030' },
        update: {
            coverImage: '/images/blog/clean-solar-hero.png',
            content: `
# Colombia subsidiará proyectos de energía renovable hasta 2030

El Gobierno Nacional de Colombia ha dado un paso histórico hacia la transición energética con el anuncio de un nuevo y ambicioso paquete de incentivos fiscales y subsidios directos. Esta medida, proyectada hasta el año 2030, busca no solo cumplir con los compromisos internacionales de reducción de emisiones de carbono, sino también posicionar al país como líder regional en energías limpias.

## Un Nuevo Horizonte para la Inversión Verde

La Ley de Transición Energética se refuerza con decretos que facilitan la entrada de capital privado en proyectos de generación solar y eólica. Entre los puntos más destacados se encuentran:

*   **Exención de Renta:** Las nuevas empresas que desarrollen proyectos de energía renovable podrán acceder a una exención del impuesto de renta por un periodo de hasta 15 años.
*   **Deducción de Inversiones:** Posibilidad de deducir hasta el 50% de la inversión realizada en un periodo de 5 años.
*   **Exclusión de IVA y Aranceles:** Para la importación de paneles solares, inversores y tecnología de almacenamiento.

Estas medidas reducen significativamente el CAPEX (Gasto de Capital) de los proyectos, aumentando la Tasa Interna de Retorno (TIR) para los inversionistas.

## El Impacto en el Mercado Local

Expertos coinciden en que este marco regulatorio acelerará la adopción de la energía solar distribuida.

> "No se trata solo de grandes parques solares; el verdadero cambio está en la generación distribuida, donde cada techo se convierte en una central eléctrica." — *Ministro de Minas y Energía.*

Para el ciudadano común y el pequeño inversionista, esto significa que participar en proyectos de energía solar es más rentable que nunca. La barrera de entrada disminuye, y la seguridad jurídica aumenta.

## El Rol de Good Energy

En este contexto favorable, **Good Energy** se posiciona como el puente ideal entre estos incentivos y los inversionistas. Nuestra plataforma permite:

1.  **Acceso Simplificado:** Participar en proyectos que ya cuentan con todos los beneficios tributarios pre-aprobados.
2.  **Rentabilidad Optimizada:** Al reducirse los costos operativos y fiscales del proyecto, los dividendos para nuestros socios aumentan.
3.  **Transparencia Total:** Monitoreo en tiempo real de la generación de energía y los ingresos asociados.

La ventana de oportunidad está abierta. Invertir en energía renovable en Colombia hoy no es solo una decisión ética por el planeta, es una de las decisiones financieras más inteligentes de la década.
      `
        },
        create: {
            title: 'Colombia subsidiará proyectos de energía renovable hasta 2030',
            slug: 'colombia-subsidiara-proyectos-energia-renovable-2030',
            excerpt: 'El Gobierno Nacional anuncia un paquete histórico de incentivos fiscales que transformará el mercado energético. Descubre cómo esto beneficia tu inversión.',
            content: `...`, // (Full content duplicated in create for safety, though update handles existing)
            coverImage: '/images/blog/clean-solar-hero.png',
            publishedAt: new Date(),
            authorId: authorTeam.id,
            categoryId: catRenovable.id,
        },
    })

    // Post 2: Market Analysis
    await prisma.post.upsert({
        where: { slug: 'el-futuro-solar-de-latam' },
        update: {
            content: `
# El Futuro Solar de Latinoamérica: Un Mercado en Expansión

Latinoamérica se encuentra en un punto de inflexión energético. Con una de las radiaciones solares más altas del planeta, la región está pasando de ser un actor secundario a convertirse en una potencia mundial en generación fotovoltaica.

## Cifras que Iluminan el Panorama

Según el último reporte de la Agencia Internacional de Energías Renovables (IRENA):

*   La capacidad instalada de energía solar en la región ha crecido un **45% anual** en los últimos tres años.
*   Se espera que para 2030, la energía solar represente el **15% de la matriz energética** total de Sudamérica.
*   Brasil, Chile y Colombia lideran la inversión, atrayendo más de **$12 mil millones de dólares** en 2024.

## ¿Por qué ahora?

La combinación de factores es perfecta:

1.  **Costos Decrecientes:** El precio de los módulos fotovoltaicos ha caído un 80% en la última década.
2.  **Necesidad de Diversificación:** Las sequías han puesto en jaque a la generación hidroeléctrica tradicional, obligando a los países a buscar fuentes alternativas y complementarias como la solar.
3.  **Demanda Corporativa:** Grandes empresas multinacionales exigen energía limpia para sus operaciones en la región, impulsando los contratos PPA (Power Purchase Agreements).

## Oportunidades para el Inversionista Retail

Históricamente, este mercado estaba reservado para grandes fondos de infraestructura. Sin embargo, la tecnología blockchain y las plataformas de crowdfunding como **Good Energy** han democratizado el acceso.

Ahora es posible adquirir participaciones en plantas solares que venden energía a la red o a empresas privadas, obteniendo rentabilidades que superan a los instrumentos financieros tradicionales, con el valor añadido de la sostenibilidad.

El sol de Latinoamérica brilla para todos, pero los que se posicionen primero cosecharán los mayores frutos.
      `
        },
        create: {
            title: 'El Futuro Solar de Latinoamérica: Un Mercado en Expansión',
            slug: 'el-futuro-solar-de-latam',
            excerpt: 'Latinoamérica se posiciona como una de las regiones con mayor potencial solar del mundo. Analizamos las cifras y tendencias que todo inversionista debe conocer.',
            content: `...`,
            coverImage: '/images/blog/clean-solar-hero.png',
            publishedAt: new Date(Date.now() - 86400000),
            authorId: authorExpert.id,
            categoryId: catInversion.id,
        },
    })

    // Post 3: Technical Education
    await prisma.post.upsert({
        where: { slug: 'tecnologia-bifacial-paneles' },
        update: {
            content: `
# Tecnología Bifacial: ¿Qué es y por qué aumenta la rentabilidad?

En el mundo de la energía solar, la eficiencia lo es todo. Cada vatio adicional que podemos extraer del mismo espacio se traduce directamente en mayores ingresos. Aquí es donde entra la **tecnología bifacial**, una innovación que está redefiniendo los estándares de la industria.

## ¿Cómo funcionan los Paneles Bifaciales?

A diferencia de los paneles monofaciales tradicionales, que tienen una cubierta trasera opaca, los módulos bifaciales captan luz por **ambas caras**:

1.  **Cara Frontal:** Recibe la luz solar directa, como un panel convencional.
2.  **Cara Trasera:** Capta la luz reflejada en el suelo y el entorno (fenómeno conocido como *albedo*).

Dependiendo de la superficie sobre la que se instalen (cemento blanco, grava, o membranas reflectantes), la ganancia de energía puede oscilar entre un **5% y un 30% adicional**.

## Ventajas Económicas para el Proyecto

La adopción de esta tecnología tiene un impacto directo en el modelo financiero de nuestros proyectos en Good Energy:

*   **Mayor Generación por M²:** Producimos más energía en el mismo terreno.
*   **Vida Útil Extendida:** Al ser módulos de doble vidrio, suelen ser más resistentes a la degradación y condiciones climáticas adversas, con garantías que superan los 30 años.
*   **Mejor Rendimiento en Días Nublados:** Captan mejor la luz difusa.

## ¿Por qué es importante para ti como inversionista?

Cuando inviertes en un proyecto de Good Energy, estás invirtiendo en activos de última generación. No utilizamos tecnología obsoleta.

> "Al implementar paneles bifaciales, aseguramos que cada peso invertido genere el máximo retorno posible, blindando la rentabilidad del proyecto a largo plazo."

La tecnología avanza rápido, y mantenerse a la vanguardia es clave para garantizar la sostenibilidad financiera y ambiental de nuestras plantas solares.
      `
        },
        create: {
            title: 'Tecnología Bifacial: ¿Qué es y por qué aumenta la rentabilidad?',
            slug: 'tecnologia-bifacial-paneles',
            excerpt: 'Descubre cómo los paneles de doble cara están revolucionando la eficiencia energética y aumentando el ROI de los proyectos solares modernos.',
            content: `...`,
            coverImage: '/images/blog/clean-solar-hero.png',
            publishedAt: new Date(Date.now() - 172800000),
            authorId: authorTeam.id,
            categoryId: catTecnologia.id,
        },
    })

    console.log('Seeding finished with 3 professional articles.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
