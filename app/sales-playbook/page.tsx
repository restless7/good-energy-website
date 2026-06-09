'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Copy,
    MessageCircle,
    ShieldCheck,
    TrendingUp,
    Sun,
    AlertCircle,
    Users,
    Globe,
    Armchair,
    Briefcase,
    Calculator,
    LayoutDashboard,
    Brain,
    X,
    Send,
    Zap,
    BatteryCharging,
    Building2,
    MapPin,
    FileText
} from 'lucide-react';

// --- TYPES ---
type ProductLine = 'SOLAR' | 'ELECTROLINERA';
type Persona = 'general' | 'diaspora' | 'pensioner' | 'entrepreneur' | 'institutional';

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
    general?: React.ReactNode;
    diaspora?: React.ReactNode;
    pensioner?: React.ReactNode;
    entrepreneur?: React.ReactNode;
    institutional?: React.ReactNode;
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
                                El vendedor pide dinero. <strong className="text-good-green">Tú ofreces una oportunidad exclusiva de infraestructura.</strong><br />
                                No &quot;necesitas&quot; su inversión. Ellos <strong className="text-good-green">necesitan</strong> tu vehículo para proteger su capital y generar altos retornos en Colombia.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-bold text-good-green text-lg border-b border-gray-100 pb-2">2. Dinámica de Poder (Estatus)</h3>
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-good-lime font-bold">✓</span>
                                    <span><strong>Nosotros tenemos el Activo:</strong> Infraestructura energética (Solares / EV Fast-Charging).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400 font-bold">✕</span>
                                    <span><strong>Ellos tienen el Capital:</strong> Papel moneda que se devalúa contra la inflación.</span>
                                </li>
                            </ul>
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

// =========================================================================
// DATA: SOLAR FARM
// =========================================================================
const solarChecklist: ChecklistItem[] = [
    { id: 'solar-webinar', label: '¿Consumió el Contenido?', hint: '¿Vio el Webinar de Granjas Solares?' },
    { id: 'solar-profile', label: 'Perfilamiento Rápido', hint: '¿Diáspora, Pensionado o Empresario Básico?' },
    { id: 'solar-env', label: 'Entorno de Poder', hint: 'Fondo BrandBook, Camisa impecable, Buena luz.' },
];

const solarPhases: PhaseItem[] = [
    {
        id: 1,
        title: 'Fase 1: Rompehielo y Rapport',
        subtitle: 'El "Tinto" Virtual',
        icon: <MessageCircle className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <ScriptBlock label="Apertura" text='"Hola [Nombre], qué gusto saludarte. Yo estoy aquí desde nuestra oficina, con un clima espectacular para generar energía (Risas)."' />
                    <ScriptBlock label="Diagnóstico del Dolor" text='"Antes de los números, quiero entender tu situación: ¿Sientes que la plata rinde igual con esta inflación? ¿Has visto cómo llegan los recibos de luz?"' />
                </div>
            ),
            diaspora: (
                <div className="space-y-4">
                    <ScriptBlock label="Nostalgia" text='"Me imagino que extrañando la tierrita. Muchos clientes me dicen que quieren construir patrimonio aquí en Colombia, pero ganando de forma pasiva, ¿es tu caso?"' />
                </div>
            ),
            pensioner: (
                <div className="space-y-4">
                    <ScriptBlock label="Seguridad" text='"Don [Nombre], con la economía actual, ¿le preocupa que sus ahorros pierdan valor? ¿Busca algo que le dé tranquilidad sin administrar nada?"' />
                </div>
            )
        }
    },
    {
        id: 2,
        title: 'Fase 2: El Marco del Problema',
        subtitle: 'Déficit Energético Colombiano',
        icon: <AlertCircle className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <ScriptBlock label="El Déficit" text='"En Colombia tenemos un problema grave. La demanda no para de crecer (Aires acondicionados, tecnología) pero la oferta está estancada. No se construyen hidroeléctricas nuevas. Por eso la energía es el activo refugio perfecto."' />
                    <ScriptBlock label="La Analogía Clave" text='"La gente sigue invirtiendo en apartamentos que son un dolor de cabeza. Te invito a invertir en paneles: Tecnología que produce dinero con el sol, todos los días."' />
                </div>
            )
        }
    },
    {
        id: 3,
        title: 'Fase 3: La Solución',
        subtitle: 'Modelo Fraccionado',
        icon: <Sun className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <ScriptBlock label="La Ejecución" text='"Generamos energía en San José de Motoso y la vendemos a la red institucional (ESSA). Ellos pagan mensualmente, sacamos costos operativos, y el resto va directo a tu cuenta."' />
                </div>
            )
        }
    },
    {
        id: 4,
        title: 'Fase 4: Finanzas y Cierre',
        subtitle: 'Rentabilidad Indexada',
        icon: <TrendingUp className="w-5 h-5" />,
        content: {
            general: (
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-good-green text-white p-4 rounded-lg">
                        <span className="font-bold text-lg">Inversión (1 Fracción):</span>
                        <span className="font-bold text-2xl text-good-lime">$45.000.000 COP</span>
                    </div>
                    <ScriptBlock label="Escudo Inflacionario" text='"Tu rentabilidad está indexada al precio de bolsa y la inflación. Es un escudo financiero. La pregunta es: ¿Quieres que tu dinero siga durmiendo en el banco o lo ponemos a generar con el sol desde ya?"' />
                </div>
            )
        }
    }
];

const solarObjections: ObjectionItem[] = [
    { trigger: '"45 Millones es mucho dinero / Liquidez"', response: '"Entiendo. Pero no es gasto, es trasvase de capital. Si está en el banco, pierdes por inflación. Piénsalo como un activo productivo de largo plazo."' },
    { trigger: '"¿Y si no hace sol / llueve?"', response: '"San José de Motoso tiene la mejor radiación comprobada por UPME. Los días de lluvia ya están modelados en el peor escenario financiero."' },
    { trigger: '"Es mucho tiempo (Contrato largo)"', response: '"El tiempo pasa igual. Es una pensión privada o un legado heredable para tu familia, un activo que mes a mes deposita flujo de caja."' }
];

// =========================================================================
// DATA: ELECTROLINERA (PREMIUM DC FAST-CHARGING)
// =========================================================================
const electroChecklist: ChecklistItem[] = [
    { id: 'ev-webinar', label: 'Due Diligence Completo', hint: '¿Enviamos el modelo de demanda inelástica EV?' },
    { id: 'ev-profile', label: 'Perfil Institucional/HNI', hint: 'Este prospecto busca alto CAPEX, TIR agresiva y escudos fiscales.' },
    { id: 'ev-market', label: 'Conocer Tensión de Red', hint: 'Conocer el déficit de carga en rutas nacionales (Ruta del Sol, Autopistas).' },
];

const electroPhases: PhaseItem[] = [
    {
        id: 1,
        title: 'Fase 1: Contexto Macro y Rapport',
        subtitle: 'Visión de Infraestructura',
        icon: <Globe className="w-5 h-5" />,
        content: {
            institutional: (
                <div className="space-y-4">
                    <ScriptBlock label="Apertura High-Profile" text='"Hola [Nombre], gracias por el tiempo. Sé que estás analizando vehículos de inversión alternativos de alto flujo. Vamos al grano con la macroeconomía energética de Colombia."' />
                    <ScriptBlock label="Diagnóstico Institucional" text='"Actualmente, ¿cómo estás mitigando el riesgo inflacionario en tu portafolio? ¿Estás buscando rentabilidad sobre CAPEX o también escudos fiscales por depreciación de activos tecnológicos?"' />
                </div>
            ),
            entrepreneur: (
                <div className="space-y-4">
                    <ScriptBlock label="Apertura Emprendedor" text='"[Nombre], un gusto. Si estás aquí es porque entiendes hacia dónde va el mundo. La transición energética ya no es ecología, es matemática financiera pura."' />
                    <ScriptBlock label="Diagnóstico B2B" text='"¿Tu liquidez hoy está en negocios tradicionales o ya tienes activos físicos de infraestructura trabajando 24/7?"' />
                </div>
            )
        }
    },
    {
        id: 2,
        title: 'Fase 2: El Déficit Crítico (Dolor de Mercado)',
        subtitle: 'Cuello de Botella EV',
        icon: <AlertCircle className="w-5 h-5" />,
        content: {
            institutional: (
                <div className="space-y-4">
                    <ScriptBlock label="La Tensión EV en Colombia" text='"Las ventas de vehículos eléctricos (EVs) en Colombia crecen a triple dígito anual. Pero la infraestructura de carga rápida DC es casi inexistente en corredores viales. Los usuarios tienen "ansiedad de rango"."' />
                    <ScriptBlock label="El Monopolio Geográfico" text='"El que instale un nodo de 120kW en una ruta principal, se convierte en la única gasolinera eléctrica en 100km. Tienes una demanda cautiva e inelástica. El vehículo DEBE cargar. No es opcional."' />
                </div>
            ),
            entrepreneur: (
                <div className="space-y-4">
                    <ScriptBlock label="Margen Arbitraje" text='"El negocio no es vender luz. Es el arbitraje. Compramos la energía comercial, y la dispensamos a precios de estación de servicio (Premium). El margen bruto es absurdamente alto comparado con rentas tradicionales."' />
                </div>
            )
        }
    },
    {
        id: 3,
        title: 'Fase 3: El Vehículo (Electrolinera Tier)',
        subtitle: 'Hardware Asset-Heavy',
        icon: <BatteryCharging className="w-5 h-5" />,
        content: {
            institutional: (
                <div className="space-y-4">
                    <ScriptBlock label="Modelo Operativo" text='"Ofrecemos Nodos Tier 01 (60kW) hasta Tier 03 (240kW). Tú eres dueño del Hardware (CAPEX). Nosotros operamos la pasarela OCPP, la integración con plataformas (Wompi) y el mantenimiento. Split de ingresos 90/10 a favor tuyo."' />
                    <ScriptBlock label="Transparencia Edge" text='"A diferencia de negocios oscuros, tienes un dashboard que muestra la telemetría en tiempo real: kW dispensados, ingresos por pasarela y estado térmico de los dispensadores. Tienes control total del flujo de caja."' />
                </div>
            )
        }
    },
    {
        id: 4,
        title: 'Fase 4: CAPEX, TIR y Beneficios Tributarios',
        subtitle: 'Estructuración Financiera',
        icon: <Calculator className="w-5 h-5" />,
        content: {
            institutional: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="bg-good-green text-white p-4 rounded-lg">
                            <span className="font-bold text-sm text-good-lime uppercase block">CAPEX Tier 02 (120kW):</span>
                            <span className="font-bold text-2xl">$180.000.000 COP</span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <span className="font-bold text-sm text-gray-500 uppercase block">ROI Promedio Anual:</span>
                            <span className="font-bold text-2xl text-good-green">~18.5% - 24%</span>
                        </div>
                    </div>
                    <ScriptBlock label="Ley 1715 (Deducción Renta)" text='"Aquí está la magia institucional: Ley 1715 en Colombia. Puedes deducir hasta el 50% de la inversión en el impuesto de renta (15 años), más exclusión de IVA, exención de aranceles y depreciación acelerada. Tu TIR neta, ajustada por escudo fiscal, destroza a la finca raíz comercial."' />
                    <ScriptBlock label="El Cierre" text='"Tienes el capital, nosotros la ingeniería y los permisos. Asegurar una ubicación estratégica hoy, es como haber comprado una esquina para gasolinera hace 50 años. ¿Revisamos el contrato PPA y agendamos el site-survey?"' />
                </div>
            )
        }
    }
];

const electroObjections: ObjectionItem[] = [
    { trigger: '"El CAPEX es muy alto ($180M - $250M)"', response: '"Es un activo de infraestructura pesada. A diferencia de un apartamento de $250M que renta $1M/mes bruto, este nodo puede generar $5M-$8M netos al mes, más los beneficios de la Ley 1715 (escudo fiscal del 50%). El payback es mucho más agresivo."' },
    { trigger: '"¿Qué pasa si cambian el conector EV?"', response: '"Nuestras estaciones de Nivel 3 (Tier 02/03) vienen con pistolas duales (CSS2 estándar europeo y CHAdeMO). Además, los dispensadores son modulares y actualizables vía hardware."' },
    { trigger: '"¿Y si no hay suficientes carros eléctricos aún?"', response: '"Es el dilema del huevo y la gallina. Pero la adopción actual en Colombia ya asegura un flujo base para breakeven operativo. Posicionarte primero te da el monopolio geográfico en el Waze de vehículos eléctricos (PlugShare). Cuando sea obvio, las ubicaciones clave ya no estarán disponibles."' }
];

// =========================================================================
// INTERACTIVE COMPONENTS
// =========================================================================

const PlaybookCheckbox = ({ item, checked, onChange }: { item: ChecklistItem, checked: boolean, onChange: () => void }) => (
    <motion.div layout onClick={onChange} className={`cursor-pointer p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${checked ? 'bg-good-green border-good-green' : 'bg-white border-gray-200 hover:border-good-green/30'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${checked ? 'border-good-lime bg-good-lime' : 'border-gray-300'}`}>
            {checked && <CheckCircle2 className="w-4 h-4 text-good-green" />}
        </div>
        <div>
            <p className={`font-bold transition-colors ${checked ? 'text-white' : 'text-good-green'}`}>{item.label}</p>
            {item.hint && <p className={`text-xs transition-colors ${checked ? 'text-good-lime/80' : 'text-gray-400'}`}>{item.hint}</p>}
        </div>
    </motion.div>
);

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
                <div className="absolute w-full h-full rounded-2xl shadow-lg border-2 border-dashed border-red-200 bg-white p-6 flex flex-col items-center justify-center text-center hover:border-red-400 transition-colors group" style={{ backfaceVisibility: 'hidden' }}>
                    <AlertCircle className="w-10 h-10 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-good-green text-lg" dangerouslySetInnerHTML={{ __html: item.trigger }}></p>
                    <p className="text-xs text-gray-400 mt-4 font-mono uppercase tracking-widest">Toca para defender</p>
                </div>
                <div className="absolute w-full h-full rounded-2xl shadow-xl bg-good-green p-6 flex flex-col items-center justify-center text-center border-2 border-good-lime" style={{ marginTop: 0, transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
                    <div className="absolute top-2 right-2 text-good-lime">
                        <CopyButton text={item.response.replace(/&quot;/g, '"')} className="text-good-lime hover:bg-white/10" />
                    </div>
                    <ShieldCheck className="w-8 h-8 text-good-lime mb-3" />
                    <p className="text-white text-sm italic font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: item.response }}></p>
                </div>
            </motion.div>
        </div>
    );
};

const PersonaTab = ({ active, label, icon, onClick }: { active: boolean, label: string, icon: React.ReactNode, onClick: () => void }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${active ? 'bg-good-green text-good-lime shadow-md ring-2 ring-good-lime ring-offset-2' : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-good-green'}`}>
        {icon}
        {label}
    </button>
);

// =========================================================================
// MAIN PAGE COMPONENT
// =========================================================================

export default function SalesPlaybookPage() {
    const [product, setProduct] = useState<ProductLine>('SOLAR');
    const [checks, setChecks] = useState<Record<string, boolean>>({});
    const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
    const [activePersona, setActivePersona] = useState<Persona>('general');
    const [showMindset, setShowMindset] = useState(false);

    // Dynamic data selection
    const activeChecklist = product === 'SOLAR' ? solarChecklist : electroChecklist;
    const activePhases = product === 'SOLAR' ? solarPhases : electroPhases;
    const activeObjections = product === 'SOLAR' ? solarObjections : electroObjections;

    const allChecked = activeChecklist.every(item => checks[item.id]);

    const toggleCheck = (id: string) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Auto-select institutional persona for EV if not available
    const handleProductSwitch = (prod: ProductLine) => {
        setProduct(prod);
        setChecks({});
        setExpandedPhase(1);
        if (prod === 'ELECTROLINERA') setActivePersona('institutional');
        else setActivePersona('general');
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <MindsetModal isOpen={showMindset} onClose={() => setShowMindset(false)} />

            {/* 1. HERO & DECISION TREE */}
            <section className="bg-good-green text-white relative overflow-hidden pb-20 pt-16 px-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-good-lime rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <button onClick={() => setShowMindset(true)} className="hover:scale-105 transition-transform">
                            <span className="bg-good-lime/20 text-good-lime px-3 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm border border-good-lime/30 flex items-center gap-2 mx-auto w-fit">
                                <Brain className="w-3 h-3" /> Briefing: La Mentalidad
                            </span>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4 leading-tight">
                            Sales Playbook <span className="text-good-lime">Arquitectura</span>
                        </h1>
                        <p className="text-lg md:text-xl text-good-white/80 max-w-2xl mx-auto font-light mb-8">
                            Selecciona el modelo de negocio para cargar la estrategia de cierre correspondiente.
                        </p>

                        {/* DECISION TREE TOGGLE */}
                        <div className="inline-flex flex-col sm:flex-row gap-4 p-2 bg-[#0A3A43] rounded-2xl border border-white/10 shadow-xl">
                            <button
                                onClick={() => handleProductSwitch('SOLAR')}
                                className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all font-bold ${
                                    product === 'SOLAR' ? 'bg-good-lime text-good-green shadow-md scale-105' : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Sun className="w-5 h-5" />
                                Granjas Solares (Fraccionadas)
                            </button>
                            <button
                                onClick={() => handleProductSwitch('ELECTROLINERA')}
                                className={`flex items-center gap-3 px-8 py-4 rounded-xl transition-all font-bold ${
                                    product === 'ELECTROLINERA' ? 'bg-[#3b82f6] text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105' : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Zap className="w-5 h-5" />
                                Electrolineras (Premium EV)
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 -mt-8 space-y-12 relative z-20">

                {/* 2. PREPARACIÓN (Checklist) */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-lg font-bold text-good-green flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Checklist Pre-Vuelo
                        </h2>
                        {allChecked && (
                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-good-lime bg-good-green px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                <CheckCircle2 className="w-3 h-3" /> LISTO
                            </motion.span>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {activeChecklist.map(item => (
                            <PlaybookCheckbox key={item.id} item={item} checked={!!checks[item.id]} onChange={() => toggleCheck(item.id)} />
                        ))}
                    </div>
                </section>

                {/* 3. GUION MAESTRO */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-good-green flex items-center gap-3">
                            <div className="w-1 h-8 bg-good-lime rounded-full"></div>
                            El Guion Maestro ({product === 'SOLAR' ? 'Solares' : 'EV Premium'})
                        </h2>

                        {/* Persona Selector based on Product */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {product === 'SOLAR' ? (
                                <>
                                    <PersonaTab active={activePersona === 'general'} label="General" icon={<Users className="w-4 h-4" />} onClick={() => setActivePersona('general')} />
                                    <PersonaTab active={activePersona === 'diaspora'} label="Diáspora" icon={<Globe className="w-4 h-4" />} onClick={() => setActivePersona('diaspora')} />
                                    <PersonaTab active={activePersona === 'pensioner'} label="Pensionado" icon={<Armchair className="w-4 h-4" />} onClick={() => setActivePersona('pensioner')} />
                                </>
                            ) : (
                                <>
                                    <PersonaTab active={activePersona === 'institutional'} label="Institucional/HNI" icon={<Building2 className="w-4 h-4" />} onClick={() => setActivePersona('institutional')} />
                                    <PersonaTab active={activePersona === 'entrepreneur'} label="Inversor Retail Alto" icon={<Briefcase className="w-4 h-4" />} onClick={() => setActivePersona('entrepreneur')} />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {activePhases.map((phase) => (
                            <motion.div
                                key={`${product}-${phase.id}`}
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
                                            key={activePersona}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-gray-50/30"
                                        >
                                            <div className="p-6 border-t border-gray-100">
                                                {/* @ts-ignore - Select active persona or fallback to general/institutional */}
                                                {phase.content[activePersona] || phase.content[product === 'SOLAR' ? 'general' : 'institutional']}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4. ARMERIA DE OBJECIONES */}
                <section>
                    <div className="flex items-center gap-3 mb-6 mt-12">
                        <h2 className="text-2xl font-bold text-good-green">Judo de Ventas</h2>
                        <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">Manejo de Objeciones</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {activeObjections.map((obj, idx) => (
                            <ObjectionCard key={idx} item={obj} />
                        ))}
                    </div>
                </section>

                {/* 5. SEGUIMIENTO & NURTURING */}
                <section className={`rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mt-12 ${product === 'SOLAR' ? 'bg-good-dark-green' : 'bg-[#051726]'}`}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-good-lime rounded-lg text-good-green">
                                <Send className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-good-lime">Seguimiento & Nurturing</h3>
                                <p className="text-white/70 text-sm">Scripts post-reunión para {product === 'SOLAR' ? 'Granjas Solares' : 'Electrolineras'}.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative">
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CopyButton text='"Hola [Nombre], te comparto el simulador financiero interactivo que revisamos y el PDF corporativo. Quedo atento a tus dudas de la estructura legal."' className="text-white hover:bg-white/20" />
                                </div>
                                <span className="text-xs font-bold text-good-lime uppercase tracking-wider mb-2 block">Inmediato</span>
                                <p className="text-sm text-white/80 italic">"Hola [Nombre], te comparto el simulador financiero interactivo..."</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative">
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CopyButton text={`"Vi esta noticia sobre el aumento de tarifas eléctricas y la adopción de EVs en el país. El mercado nos da la razón, invertir en infraestructura es el camino. ¿Cómo viste la TIR?"`} className="text-white hover:bg-white/20" />
                                </div>
                                <span className="text-xs font-bold text-good-lime uppercase tracking-wider mb-2 block">Día +2 (Aporte Valor)</span>
                                <p className="text-sm text-white/80 italic">"Vi esta noticia sobre la adopción de EVs / tarifas eléctricas..."</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group relative">
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <CopyButton text={product === 'SOLAR' ? '"¡Bienvenido el socio #43 a San José de Motoso!"' : '"Acabamos de asegurar la ubicación en la Ruta del Sol. Queda un nodo libre para adjudicar."'} className="text-white hover:bg-white/20" />
                                </div>
                                <span className="text-xs font-bold text-good-lime uppercase tracking-wider mb-2 block">Cierre FOMO</span>
                                <p className="text-sm text-white/80 italic">{product === 'SOLAR' ? '"¡Bienvenido el socio #43..."' : '"Acabamos de asegurar la ubicación..."'}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                            <a href="/investment-simulator" target="_blank" className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors">
                                <Calculator className="w-3 h-3" /> Simulador Financiero
                            </a>
                            <div className="flex gap-3">
                                <a href="/documents/deck-good-energy.pdf" target="_blank" className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/10">Descargar PDF Institucional</a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
