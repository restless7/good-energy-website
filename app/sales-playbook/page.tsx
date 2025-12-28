'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Copy,
    Download,
    MessageCircle,
    MapPin,
    ShieldCheck,
    TrendingUp,
    Sun,
    AlertCircle,
    Users,
    Globe,
    Armchair,
    Briefcase,
    FileText,
    Calculator,
    LayoutDashboard,
    Brain,
    X,
    Send
} from 'lucide-react';

// --- TYPES ---
type Persona = 'general' | 'diaspora' | 'pensioner' | 'entrepreneur';

interface ChecklistItem {
    id: string;
    label: string;
    hint?: string;
}

interface ObjectionItem {
    trigger: string;
    response: string;
}

interface PhaseContentVariant {
    general: React.ReactNode;
    diaspora?: React.ReactNode;
    pensioner?: React.ReactNode;
    entrepreneur?: React.ReactNode;
}

interface PhaseItem {
    id: number;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    content: PhaseContentVariant;
}

// --- COMPONENT: Copy Button ---
const CopyButton = ({ text, className = "" }: { text: string, className?: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text.replace(/"/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className={`p-1.5 rounded-md transition-colors text-current opacity-70 hover:opacity-100 hover:bg-black/5 ${className}`}
            title="Copiar script"
        >
            {copied ? <CheckCircle2 className="w-4 h-4 text-good-lime" /> : <Copy className="w-4 h-4" />}
        </button>
    );
};

// --- COMPONENT: Script Block ---
const ScriptBlock = ({ text, label }: { text: string, label?: string }) => (
    <div className="bg-good-white border-l-4 border-good-lime p-4 rounded-r-lg shadow-sm relative group mb-3">
        {label && <span className="text-[10px] uppercase font-bold text-good-green/50 mb-1 block tracking-wider">{label}</span>}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={text} />
        </div>
        <p className="italic text-good-green pr-6 text-sm md:text-base leading-relaxed">{text}</p>
    </div>
);

// --- COMPONENT: Mindset Modal ---
const MindsetModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="bg-good-green p-6 text-white text-center rounded-t-2xl">
                        <Brain className="w-12 h-12 text-good-lime mx-auto mb-3" />
                        <h2 className="text-2xl font-bold">La Mentalidad del Cerrador</h2>
                        <p className="text-good-lime text-sm font-bold tracking-[0.2em] uppercase mt-2">Ethos de Élite</p>
                    </div>

                    <div className="p-8 space-y-8">
                        <div className="space-y-3">
                            <h3 className="font-bold text-good-green text-lg border-b border-gray-100 pb-2">1. No eres Vendedor, eres Asesor</h3>
                            <p className="text-gray-600 text-sm">
                                El vendedor pide dinero. <strong className="text-good-green">Tú ofreces una oportunidad exclusiva.</strong><br />
                                No &quot;necesitas&quot; su inversión. Ellos <strong className="text-good-green">necesitan</strong> tu vehículo para proteger su capital de la inflación.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-bold text-good-green text-lg border-b border-gray-100 pb-2">2. Dinámica de Poder (Estatus)</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-good-lime font-bold">✓</span>
                                    <span><strong>Nosotros tenemos el Activo:</strong> La planta solar (Oro).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 font-bold">✕</span>
                                    <span><strong>Ellos tienen el Capital:</strong> Papel moneda que se devalúa.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-good-lime font-bold">✓</span>
                                    <span><strong>El Favor:</strong> Les abrimos la puerta a un club de solo 100 cupos. Entra con esa confianza.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-bold text-good-green text-lg border-b border-gray-100 pb-2">3. Ética Inquebrantable</h3>
                            <p className="text-gray-600 text-sm">
                                Persuadimos con la verdad (UPME, CREG). Si no es para ellos, lo decimos. Eso construye confianza absoluta.
                            </p>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
                        <button onClick={onClose} className="bg-good-green text-white px-8 py-3 rounded-xl font-bold hover:bg-good-dark-green transition-colors w-full">
                            Entendido. Soy un Arquitecto de Futuros.
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

// --- DATA: Checklist Pre-Vuelo ---
const checklistData: ChecklistItem[] = [
    { id: 'webinar', label: '¿Consumió el Contenido?', hint: '¿Vio el Webinar/Video? Si no, prepárate para educar en Fase 3.' },
    { id: 'profile', label: 'Perfilamiento Rápido', hint: '¿Diáspora (Nostalgia), Pensionado (Seguridad) o Empresario (ROI)?' },
    { id: 'env', label: 'Entorno de Poder', hint: 'Fondo BrandBook, Camisa impecable, Buena luz.' },
    { id: 'tech', label: 'Tech Check', hint: 'Cámara PRENDIDA siempre y buen audio.' },
];

// --- DATA: Script Maestro ---
const scriptPhases: PhaseItem[] = [
    {
        id: 1,
        title: 'Fase 1: Rompehielo y Rapport',
        subtitle: 'El "Tinto" Virtual',
        icon: <MessageCircle className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Bajar defensas y Conectar</p>

                    <div className="space-y-4">
                        <ScriptBlock label="Apertura" text='&quot;Hola [Nombre], qué gusto saludarte... ¿Desde dónde te conectas hoy?... Ah, excelente. Yo estoy aquí desde nuestra oficina en Bucaramanga, con un clima espectacular como siempre.&quot;' />

                        <ScriptBlock label="Conexión Emocional (Raíz Santandereana)" text='&quot;Venga, ¿y hace cuánto no viene a la tierrita? Santander está creciendo impresionante, ¿cierto?&quot;' />
                    </div>

                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-100">
                        <p className="font-bold text-good-green">Diagnóstico del Dolor (Preguntas Afiladas):</p>
                        <ScriptBlock text='&quot;[Nombre], antes de los números, quiero entender tu situación:&quot;' />
                        <ScriptBlock label="1. Inflación" text='&quot;¿Cómo sientes que te ha tratado la inflación? ¿Sientes que la plata rinde igual?&quot;' />
                        <ScriptBlock label="2. Recibos" text='&quot;¿Has visto cómo han llegado los recibos de la luz? (Risas) Están impagables, ¿verdad?&quot;' />
                        <ScriptBlock label="3. Capital" text='&quot;Actualmente, ¿tu capital está &apos;durmiendo&apos; en el banco o está trabajando para ti?&quot;' />
                    </div>
                </div>
            ),
            diaspora: (
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Nostalgia y Raíces</p>
                    <ScriptBlock text='&quot;Hola [Nombre], me imagino que extrañando la tierrita, ¿o no? ¿Hace cuánto no vienes a comer mute?&quot;' />
                    <ScriptBlock text='&quot;Santander está irreconocible, creciendo muchísimo. Es el momento de volver a poner un pie aquí.&quot;' />
                    <div className="space-y-2">
                        <p className="font-bold text-good-green">Diagnóstico Diáspora:</p>
                        <ScriptBlock text='&quot;¿Tu idea es seguir allá indefinidamente o planeas volver a retirarte en Colombia?&quot;' label="Pregunta Clave" />
                        <ScriptBlock text='&quot;Muchos clientes me dicen que quieren construir patrimonio en pesos pero ganando en divisa dura, ¿es tu caso?&quot;' label="Validación" />
                    </div>
                </div>
            ),
            pensioner: (
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Seguridad y Tranquilidad</p>
                    <ScriptBlock text='&quot;Hola [Nombre], un gusto. ¿Cómo ha estado estos días? Me imagino que disfrutando de la familia.&quot;' />
                    <div className="space-y-2">
                        <p className="font-bold text-good-green">Diagnóstico Pensionado:</p>
                        <ScriptBlock text='&quot;Don [Nombre], con todo lo que está pasando en la economía, ¿le preocupa que sus ahorros pierdan valor?&quot;' label="Dolor: Inflación" />
                        <ScriptBlock text='&quot;¿Busca algo que le dé tranquilidad mensual sin tener que estar pendiente de administrar nada?&quot;' label="Dolor: Gestión" />
                    </div>
                </div>
            ),
            entrepreneur: (
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Oportunidad de Negocio</p>
                    <ScriptBlock text='&quot;Hola [Nombre], gracias por el tiempo. Sé que eres una persona ocupada así que vamos al grano con los números.&quot;' />
                    <div className="space-y-2">
                        <p className="font-bold text-good-green">Diagnóstico Empresario:</p>
                        <ScriptBlock text='&quot;¿Cómo estás diversificando tu portafolio hoy? ¿Todo en tu negocio principal o estás buscando rentas pasivas?&quot;' label="Diversificación" />
                        <ScriptBlock text='&quot;¿Te hace sentido invertir en un sector con demanda inelástica como la energía?&quot;' label="Lógica de Mercado" />
                    </div>
                </div>
            )
        }
    },
    {
        id: 2,
        title: 'Fase 2: El Marco del Problema',
        subtitle: 'La Retórica de Mercado',
        icon: <AlertCircle className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <a
                            href="/documents/deck-good-energy.pdf"
                            target="_blank"
                            className="flex items-center gap-2 text-xs font-bold text-good-lime bg-good-green px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                        >
                            <FileText className="w-3 h-3" /> Abrir Deck Corporativo
                        </a>
                    </div>
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Crear Urgencia</p>

                    <ScriptBlock label="Narrativa (Slides Contexto)" text='&quot;Mira, [Nombre], te voy a ser muy franco. En Colombia tenemos un problema gravísimo.&quot;' />

                    <div className="bg-good-green/5 p-4 rounded-lg space-y-3">
                        <ScriptBlock label="1. Demanda Creciente" text='&quot;La demanda no para de crecer: Celulares, aires acondicionados, carros eléctricos.&quot;' />
                        <ScriptBlock label="2. Oferta Estancada" text='&quot;No se están construyendo suficientes hidroeléctricas.&quot;' />
                        <ScriptBlock label="3. El Déficit" text='&quot;Esto hace que el precio de la energía suba y suba.&quot;' />
                    </div>

                    <ScriptBlock label="El Vacío en Santander" text='&quot;¿Y sabes qué es lo curioso? En el mapa de la UPME, todos los proyectos están en la Costa. En Santander solo hay 1 proyecto grande. Hay un vacío gigante y venimos a llenarlo.&quot;' />

                    <ScriptBlock label="La Analogía Clave" text='&quot;La gente sigue invirtiendo en &apos;ladrillos&apos; (apartamentos) que son un dolor de cabeza. Nosotros te invitamos a invertir en &apos;paneles&apos;: Tecnología que produce dinero con el sol.&quot;' />
                </div>
            ),
            diaspora: (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <a href="/documents/deck-good-energy.pdf" target="_blank" className="flex items-center gap-2 text-xs font-bold text-good-lime bg-good-green px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                            <FileText className="w-3 h-3" /> Abrir Deck Corporativo
                        </a>
                    </div>
                    <ScriptBlock text='&quot;Sabes que Colombia necesita inversión. Pero el tema energético es crítico. Si no hacemos algo, nos apagamos.&quot;' />
                    <ScriptBlock text='&quot;Invertir en Finca Raíz desde el exterior es un dolor de cabeza. Que el inquilino, que los arreglos... Aquí te olvidas de eso.&quot;' label="Vs Ladrillos" />
                </div>
            ),
            pensioner: (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <a href="/documents/deck-good-energy.pdf" target="_blank" className="flex items-center gap-2 text-xs font-bold text-good-lime bg-good-green px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                            <FileText className="w-3 h-3" /> Abrir Deck Corporativo
                        </a>
                    </div>
                    <ScriptBlock text='&quot;Lo más importante para usted es la seguridad. El problema es que la inflación se está comiendo la pensión.&quot;' />
                    <ScriptBlock text='&quot;Esto es mejor que un arriendo porque no tiene que pelear con nadie. El sol sale todos los días y ESSA paga cumplido.&quot;' label="Seguridad" />
                </div>
            ),
            entrepreneur: (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <a href="/documents/deck-good-energy.pdf" target="_blank" className="flex items-center gap-2 text-xs font-bold text-good-lime bg-good-green px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                            <FileText className="w-3 h-3" /> Abrir Deck Corporativo
                        </a>
                    </div>
                    <ScriptBlock text='&quot;Es oferta y demanda básica. La demanda de energía es inelástica y creciente. La oferta es limitada por licencias.&quot;' />
                    <ScriptBlock text='&quot;Estamos entrando en un mercado con barreras de entrada altas, lo que protege tu margen. Es un monopolio natural regional.&quot;' label="Lógica de Negocio" />
                </div>
            )
        }
    },
    {
        id: 3,
        title: 'Fase 3: La Solución Good Energy',
        subtitle: 'Autoridad y Tecnología',
        icon: <Sun className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Mostrar Solidez y Modelo</p>

                    <ScriptBlock label="La Alianza" text='&quot;Por eso nace Good Energy. No estamos solos. Hemos hecho una alianza estratégica con Innova Solar, líderes en la región. Juntamos ingeniería de punta con estructuración financiera.&quot;' />

                    <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <p className="font-bold text-good-green mb-3">El Modelo Técnico (Explicación Sencilla):</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                            <li>Instalamos <strong>2.300 paneles</strong> en San José de Motoso (Alta radiación).</li>
                            <li>La planta genera energía todos los días.</li>
                            <li>Esa energía <strong>NO se pierde</strong>. Se vende a ESSA, Celsia, Vatia.</li>
                            <li>Ellos pagan mensualmente.</li>
                            <li>Sacamos costos y <strong>el resto va directo a tu cuenta</strong>.</li>
                        </ol>
                        <div className="mt-3 text-good-lime font-bold text-sm bg-good-green/10 p-2 rounded text-center">
                            &quot;Tú no tienes que limpiar paneles, ni cobrar recibos. Nosotros hacemos todo.&quot;
                        </div>
                    </div>
                </div>
            )
        }
    },
    {
        id: 4,
        title: 'Fase 4: La Lógica Financiera',
        subtitle: 'El Golpe de Gracia',
        icon: <TrendingUp className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <a
                            href="https://www.goodenergycol.com/investment-simulator"
                            target="_blank"
                            className="flex items-center gap-2 text-xs font-bold text-good-green bg-good-lime px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
                        >
                            <Calculator className="w-3 h-3" /> Abrir Simulador
                        </a>
                    </div>
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Logos (Lógica Financiera)</p>

                    <div className="flex items-center justify-between bg-good-green text-white p-4 rounded-lg">
                        <span className="font-bold text-lg">Inversión:</span>
                        <span className="font-bold text-2xl text-good-lime">$45.000.000 COP</span>
                    </div>

                    <ScriptBlock label="Anclaje de Precio" text='&quot;Con 45 millones hoy no compras ni un parqueadero en Cabecera. Y un parqueadero renta 200 mil si tienes suerte.&quot;' />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                            <span className="text-xs font-bold text-gray-500 uppercase">Escenario Conservador</span>
                            <p className="text-good-green font-bold text-lg">$165 Millones</p>
                            <p className="text-xs text-gray-500">Recuperas en 6 años. Triplicas capital.</p>
                        </div>
                        <div className="bg-good-lime/10 p-3 rounded border border-good-lime/30">
                            <span className="text-xs font-bold text-good-green uppercase">Escenario Optimista</span>
                            <p className="text-good-green font-bold text-lg">$389 Millones</p>
                            <p className="text-xs text-good-green">Si la energía sigue subiendo.</p>
                        </div>
                    </div>

                    <ScriptBlock label="El Escudo" text='&quot;Tu rentabilidad está indexada a la inflación y al precio de bolsa. Es un escudo financiero. Un CDT pierde contra la inflación real.&quot;' />
                </div>
            ),
            entrepreneur: (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <a href="https://www.goodenergycol.com/investment-simulator" target="_blank" className="flex items-center gap-2 text-xs font-bold text-good-green bg-good-lime px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity">
                            <Calculator className="w-3 h-3" /> Abrir Simulador
                        </a>
                    </div>
                    <ScriptBlock text='&quot;Hablemos de TIR. Superior a cualquier CDT y con apreciación de activo.&quot;' />
                    <ScriptBlock text='&quot;Además, es un activo depreciable contablemente. Tienes beneficios tributarios que mejoran tu flujo de caja neto.&quot;' label="Beneficio Tributario" />
                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 font-medium">
                        Enfatizar: ROI + Depreciación + Escudo Fiscal
                    </div>
                </div>
            )
        }
    },
    {
        id: 5,
        title: 'Fase 5: El Cierre',
        subtitle: 'Call to Action',
        icon: <CheckCircle2 className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Acción Inmediata</p>

                    <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
                        <p className="text-red-800 font-bold text-sm flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4" /> Principio de Escasez
                        </p>
                        <ScriptBlock text='&quot;[Nombre], el proyecto es de 1 MW. Matemáticamente solo caben 100 inversionistas. Ni uno más. Ya tenemos 42 cupos separados.&quot;' />
                    </div>

                    <div className="bg-good-green text-white p-6 rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <CopyButton text='&quot;La pregunta es simple: ¿Quieres que tu dinero siga durmiendo en el banco perdiendo valor, o quieres ponerlo a producir con el sol de Santander desde ya?&quot;' className="text-white hover:bg-white/20" />
                        </div>
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-good-lime w-12 h-12 rounded-full blur-xl opacity-50"></div>
                        <p className="font-bold text-lg italic text-center relative z-10">
                            &quot;La pregunta es simple: ¿Quieres que tu dinero siga durmiendo en el banco perdiendo valor, o quieres ponerlo a producir con el sol de Santander desde ya?&quot;
                        </p>
                    </div>

                    <ScriptBlock label="Si dice SÍ" text='&quot;Excelente decisión. Bienvenido a la familia. Te envío el formulario (KYC) y el contrato. ¿Prefieres hacerlo a nombre personal o de empresa?&quot;' />
                </div>
            ),
            diaspora: (
                <div className="space-y-4">
                    <div className="bg-good-green text-white p-6 rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <CopyButton text='&quot;Es tu oportunidad de tener un pedazo de tu tierra trabajando para ti. ¿Hacemos el papeleo?&quot;' className="text-white hover:bg-white/20" />
                        </div>
                        <p className="font-bold text-lg italic text-center relative z-10">
                            &quot;Es tu oportunidad de tener un pedazo de tu tierra trabajando para ti. ¿Hacemos el papeleo?&quot;
                        </p>
                    </div>
                </div>
            ),
            pensioner: (
                <div className="space-y-4">
                    <div className="bg-good-green text-white p-6 rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <CopyButton text='&quot;Aseguremos su tranquilidad y la herencia de sus hijos. ¿Lo ponemos a nombre suyo o de ellos?&quot;' className="text-white hover:bg-white/20" />
                        </div>
                        <p className="font-bold text-lg italic text-center relative z-10">
                            &quot;Aseguremos su tranquilidad y la herencia de sus hijos. ¿Lo ponemos a nombre suyo o de ellos?&quot;
                        </p>
                    </div>
                </div>
            )
        }
    }
];

// --- DATA: Objeciones ---
const objections: ObjectionItem[] = [
    {
        trigger: '&quot;45 Millones es mucho dinero / No tengo liquidez&quot;',
        response: '&quot;Te entiendo. Pero no es gasto, es trasvase de capital. Si está en el banco, pierdes por inflación. Piensa en el Costo de Oportunidad: ¿Qué otro negocio te convierte 45M en 300M sin trabajar? ¿Vemos opciones de financiamiento?&quot;'
    },
    {
        trigger: '&quot;¿Y si no hace sol / llueve mucho?&quot;',
        response: '&quot;Excelente pregunta técnica. Los estudios de la UPME confirman que San José de Motoso tiene la mejor radiación de Santander. Los paneles generan incluso con nubes. Los días de lluvia ya están descontados en el modelo.&quot;'
    },
    {
        trigger: '&quot;21 años es mucho tiempo / Ya estaré viejo&quot;',
        response: '&quot;El tiempo pasará igual. ¿Cómo quieres llegar? Es una pensión privada adicional. O mejor, un activo heredable. Si no lo disfrutas todo, tus hijos recibirán el flujo de caja. Es un legado.&quot;'
    },
    {
        trigger: '&quot;¿Es seguro/legal? Me da miedo&quot;',
        response: '&quot;Válido. La seguridad es prioridad. 1. SAS registrada con accionistas. 2. Contratos PPA regulados por la CREG. 3. Activos físicos asegurables. No es humo ni cripto, es infraestructura tangible.&quot;'
    }
];

// --- COMPONENT: Interactive Checkbox ---
const PlaybookCheckbox = ({ item, checked, onChange }: { item: ChecklistItem, checked: boolean, onChange: () => void }) => (
    <motion.div
        layout
        onClick={onChange}
        className={`
      cursor-pointer p-4 rounded-xl border-2 flex items-center gap-4 transition-all
      ${checked ? 'bg-good-green border-good-green' : 'bg-white border-gray-200 hover:border-good-green/30'}
    `}
    >
        <div className={`
      w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
      ${checked ? 'border-good-lime bg-good-lime' : 'border-gray-300'}
    `}>
            {checked && <CheckCircle2 className="w-4 h-4 text-good-green" />}
        </div>
        <div>
            <p className={`font-bold transition-colors ${checked ? 'text-white' : 'text-good-green'}`}>{item.label}</p>
            {item.hint && <p className={`text-xs transition-colors ${checked ? 'text-good-lime/80' : 'text-gray-400'}`}>{item.hint}</p>}
        </div>
    </motion.div>
);

// --- COMPONENT: Flip Card ---
const ObjectionCard = ({ item }: { item: ObjectionItem }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="h-64 w-full" style={{ perspective: '1000px' }} onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative w-full h-full cursor-pointer"
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front */}
                <div
                    className="absolute w-full h-full rounded-2xl shadow-lg border-2 border-dashed border-red-200 bg-white p-6 flex flex-col items-center justify-center text-center hover:border-red-400 transition-colors group"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <AlertCircle className="w-10 h-10 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-good-green text-lg" dangerouslySetInnerHTML={{ __html: item.trigger }}></p>
                    <p className="text-xs text-gray-400 mt-4 font-mono uppercase tracking-widest">Toca para defender</p>
                </div>

                {/* Back */}
                <div
                    className="absolute w-full h-full rounded-2xl shadow-xl bg-good-green p-6 flex flex-col items-center justify-center text-center border-2 border-good-lime"
                    style={{
                        marginTop: 0,
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden"
                    }}
                >
                    <div className="absolute top-2 right-2 text-good-lime">
                        <CopyButton text={item.response.replace(/&quot;/g, '"')} className="text-good-lime hover:bg-white/10" />
                    </div>
                    <ShieldCheck className="w-8 h-8 text-good-lime mb-3" />
                    <p className="text-white text-sm italic font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: item.response }}>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// --- COMPONENT: Persona Tab ---
const PersonaTab = ({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`
      flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
      ${active
                ? 'bg-good-green text-good-lime shadow-md ring-2 ring-good-lime ring-offset-2'
                : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-good-green'}
    `}
    >
        {icon}
        {label}
    </button>
);

export default function SalesPlaybookPage() {
    const [checks, setChecks] = useState<Record<string, boolean>>({});
    const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
    const [activePersona, setActivePersona] = useState<Persona>('general');
    const [showMindset, setShowMindset] = useState(false);

    const allChecked = checklistData.every(item => checks[item.id]);

    const toggleCheck = (id: string) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <MindsetModal isOpen={showMindset} onClose={() => setShowMindset(false)} />

            {/* 1. HERO SECTION */}
            <section className="bg-good-green text-white relative overflow-hidden pb-12 pt-16 px-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-good-lime rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <button onClick={() => setShowMindset(true)} className="hover:scale-105 transition-transform">
                            <span className="bg-good-lime/20 text-good-lime px-3 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm border border-good-lime/30 flex items-center gap-2 mx-auto w-fit">
                                <Brain className="w-3 h-3" /> Briefing: La Mentalidad
                            </span>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4 leading-tight">
                            Good Energy <span className="text-good-lime">Sales Playbook</span>
                        </h1>
                        <p className="text-lg md:text-xl text-good-white/80 max-w-2xl mx-auto font-light">
                            &quot;No eres un vendedor. Eres un <span className="text-white font-medium">Arquitecto de Futuros Financieros</span>.&quot;
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-4 -mt-8 space-y-12 relative z-20">

                {/* 2. PREPARACIÓN (Checklist) */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-lg font-bold text-good-green flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Checklist Pre-Vuelo
                        </h2>
                        {allChecked && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-good-lime bg-good-green px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                            >
                                <Sun className="w-3 h-3 animate-spin-slow" /> LISTO PARA DESPEGAR
                            </motion.span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {checklistData.map(item => (
                            <PlaybookCheckbox
                                key={item.id}
                                item={item}
                                checked={!!checks[item.id]}
                                onChange={() => toggleCheck(item.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* 3. GUION MAESTRO */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-good-green flex items-center gap-3">
                            <div className="w-1 h-8 bg-good-lime rounded-full"></div>
                            El Guion Maestro
                        </h2>

                        {/* Persona Selector */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            <PersonaTab active={activePersona === 'general'} label="General" icon={<Users className="w-4 h-4" />} onClick={() => setActivePersona('general')} />
                            <PersonaTab active={activePersona === 'diaspora'} label="Diáspora" icon={<Globe className="w-4 h-4" />} onClick={() => setActivePersona('diaspora')} />
                            <PersonaTab active={activePersona === 'pensioner'} label="Pensionado" icon={<Armchair className="w-4 h-4" />} onClick={() => setActivePersona('pensioner')} />
                            <PersonaTab active={activePersona === 'entrepreneur'} label="Empresario" icon={<Briefcase className="w-4 h-4" />} onClick={() => setActivePersona('entrepreneur')} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {scriptPhases.map((phase) => (
                            <motion.div
                                key={phase.id}
                                className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${expandedPhase === phase.id ? 'border-good-green ring-1 ring-good-green/10 shadow-md' : 'border-gray-100'}`}
                            >
                                <button
                                    onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${expandedPhase === phase.id ? 'bg-good-green text-good-lime' : 'bg-gray-100 text-gray-400'}`}>
                                            {phase.icon}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-lg ${expandedPhase === phase.id ? 'text-good-green' : 'text-gray-600'}`}>
                                                {phase.title}
                                            </h3>
                                            <p className="text-sm text-gray-400">{phase.subtitle}</p>
                                        </div>
                                    </div>
                                    {expandedPhase === phase.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                </button>
                                <AnimatePresence mode='wait'>
                                    {expandedPhase === phase.id && (
                                        <motion.div
                                            key={activePersona} // Animate when persona changes
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-gray-50/30"
                                        >
                                            <div className="p-6 border-t border-gray-100">
                                                {/* Dynamic Content Rendering */}
                                                {phase.content[activePersona] || phase.content.general}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4. ARMERIA DE OBJECIONES (Grid) */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-good-green">Judo de Ventas</h2>
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Manejo de Objeciones</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {objections.map((obj, idx) => (
                            <ObjectionCard key={idx} item={obj} />
                        ))}
                    </div>
                </section>

                {/* 5. SEGUIMIENTO & NURTURING */}
                <section className="bg-good-dark-green rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-good-lime rounded-lg text-good-green">
                                <Send className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-good-lime">Seguimiento & Nurturing</h3>
                                <p className="text-good-white/70 text-sm">Scripts para reactivar prospectos post-reunión.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            {/* Script 1 */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative">
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CopyButton text='&quot;Hola [Nombre], te comparto el Resumen Ejecutivo del Business Plan que vimos. También este video corto de la ubicación del lote. Quedo atento a tus dudas del contrato.&quot;' className="text-white hover:bg-white/20" />
                                </div>
                                <span className="text-xs font-bold text-good-lime uppercase tracking-wider mb-2 block">Inmediato (WhatsApp)</span>
                                <p className="text-sm text-good-white/80 italic">&quot;Hola [Nombre], te comparto el Resumen Ejecutivo del Business Plan...&quot;</p>
                            </div>

                            {/* Script 2 */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative">
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CopyButton text='&quot;Vi esta noticia sobre el aumento de tarifas de energía en Colombia y me acordé de ti. Definitivamente, ser productor de energía es el negocio del futuro. ¿Cómo viste los números?&quot;' className="text-white hover:bg-white/20" />
                                </div>
                                <span className="text-xs font-bold text-good-lime uppercase tracking-wider mb-2 block">Día +2 (Aporte Valor)</span>
                                <p className="text-sm text-good-white/80 italic">&quot;Vi esta noticia sobre el aumento de tarifas... y me acordé de ti...&quot;</p>
                            </div>

                            {/* Script 3 */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative">
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CopyButton text='&quot;¡Bienvenido el socio #43! Quedan menos cupos.&quot;' className="text-white hover:bg-white/20" />
                                </div>
                                <span className="text-xs font-bold text-good-lime uppercase tracking-wider mb-2 block">Grupo (Prueba Social)</span>
                                <p className="text-sm text-good-white/80 italic">&quot;¡Bienvenido el socio #43! Quedan menos cupos.&quot;</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                            <a
                                href="https://www.goodenergycol.com/inversiones"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors"
                            >
                                <LayoutDashboard className="w-3 h-3" /> Dashboard de Inversionista
                            </a>
                            <div className="flex gap-3">
                                <a href="/documents/deck-good-energy.pdf" target="_blank" className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10">Descargar PDF</a>
                                <button className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10">Video Ubicación</button>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}
