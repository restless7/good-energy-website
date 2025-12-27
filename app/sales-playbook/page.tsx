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
    LayoutDashboard
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
        {label && <span className="text-[10px] uppercase font-bold text-good-green/50 mb-1 block">{label}</span>}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={text} />
        </div>
        <p className="italic text-good-green pr-6">{text}</p>
    </div>
);

// --- DATA: Checklist Pre-Vuelo ---
const checklistData: ChecklistItem[] = [
    { id: 'webinar', label: '¿Prospecto vio el Webinar/Video?', hint: 'Si no, prepárate para educar en Fase 3' },
    { id: 'profile', label: 'Perfilamiento Rápido', hint: 'Define su arquetipo (Diáspora, Pensionado, etc.)' },
    { id: 'env', label: 'Entorno & Vestimenta', hint: 'Fondo limpio, camisa profesional, buena luz' },
    { id: 'tech', label: 'Tech Check', hint: 'Cámara y audio probados' },
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
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Bajar defensas</p>
                    <ScriptBlock text='&quot;Hola [Nombre], qué gusto saludarte... ¿Desde dónde te conectas hoy?&quot;' />
                    <ScriptBlock text='&quot;Venga, ¿y hace cuánto no viene a la tierrita? Santander está creciendo impresionante, ¿cierto?&quot;' />
                    <div className="space-y-2">
                        <p className="font-bold text-good-green">Diagnóstico General:</p>
                        <ul className="list-disc list-inside text-good-green/80 text-sm space-y-1">
                            <li>&quot;¿Cómo sientes que te ha tratado la inflación este último año?&quot;</li>
                            <li>&quot;¿Has visto los recibos de la luz últimamente? (Risas)&quot;</li>
                            <li>&quot;¿Tu capital está &apos;durmiendo&apos; en el banco o trabajando?&quot;</li>
                        </ul>
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
                    <ScriptBlock text='&quot;Mira, en Colombia tenemos un problema gravísimo. La demanda crece, la oferta no. Hay un déficit energético.&quot;' />
                    <div className="bg-good-green/5 p-4 rounded-lg">
                        <p className="text-sm text-good-green mb-2 font-bold">Datos Clave (UPME):</p>
                        <ul className="list-disc list-inside text-good-green/80 text-sm space-y-1">
                            <li>En Santander solo hay 1 proyecto grande registrado.</li>
                            <li>&quot;La gente invierte en &apos;ladrillos&apos; (problemas), nosotros en &apos;paneles&apos; (flujo de caja).&quot;</li>
                        </ul>
                    </div>
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
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Mostrar Solidez</p>
                    <ScriptBlock text='&quot;Hemos hecho una alianza con Innova Solar. Juntamos ingeniería de punta con estructuración financiera.&quot;' />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                            <span className="font-bold block text-good-green">Ubicación</span>
                            San José de Motoso, Girón (Alta radiación)
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                            <span className="font-bold block text-good-green">Modelo</span>
                            Venta a ESSA, Celsia, Vatia (PPA 15-25 años)
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
                    <p className="text-sm font-semibold text-good-green/80 uppercase tracking-widest">Objetivo: Logos (Lógica)</p>
                    <div className="flex items-center justify-between bg-good-green text-white p-4 rounded-lg">
                        <span className="font-bold text-lg">Inversión:</span>
                        <span className="font-bold text-2xl text-good-lime">$45.000.000 COP</span>
                    </div>
                    <ScriptBlock text='&quot;Escenario Pesimista: $165M de retorno. Recuperas en 6 años.&quot;' />
                    <ScriptBlock text='&quot;Escenario Optimista: $389M de retorno.&quot;' />
                    <p className="text-xs text-center text-good-green/60">
                        *Tu rentabilidad está indexada a la inflación y precio de bolsa.
                    </p>
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
                        <p className="text-red-800 font-bold text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> Principio de Escasez
                        </p>
                        <p className="text-red-700 text-sm mt-1">&quot;Solo caben 100 inversionistas. Ya tenemos 42 cupos separados.&quot;</p>
                    </div>
                    <div className="bg-good-green text-white p-6 rounded-lg shadow-lg relative overflow-hidden group">
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <CopyButton text='&quot;¿Quieres que tu dinero siga durmiendo en el banco o que empiece a producir con el sol de Santander?&quot;' className="text-white hover:bg-white/20" />
                        </div>
                        <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-good-lime w-12 h-12 rounded-full blur-xl opacity-50"></div>
                        <p className="font-bold text-lg italic text-center relative z-10">
                            &quot;¿Quieres que tu dinero siga durmiendo en el banco o que empiece a producir con el sol de Santander?&quot;
                        </p>
                    </div>
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
        trigger: '&quot;45 Millones es mucho dinero&quot;',
        response: '&quot;No es un gasto, es un trasvase de capital. Si está en el banco, pierdes por inflación. Piensa en el Costo de Oportunidad: ¿Qué otro negocio te convierte 45M en 300M sin trabajar?&quot;'
    },
    {
        trigger: '&quot;¿Y si no hace sol?&quot;',
        response: '&quot;Los estudios de la UPME confirman que San José de Motoso tiene la mejor radiación. Los paneles modernos generan incluso con nubes. El modelo ya descuenta los días de lluvia.&quot;'
    },
    {
        trigger: '&quot;21 años es mucho tiempo&quot;',
        response: '&quot;El tiempo pasará igual. ¿Cómo quieres llegar allá? Es una pensión privada o un legado heredable para tus hijos. Flujo de caja constante por décadas.&quot;'
    },
    {
        trigger: '&quot;¿Es seguro/legal?&quot;',
        response: '&quot;Estructura SAS registrada. Contratos PPA regulados por la CREG. Activos físicos asegurables. No es humo ni cripto, es infraestructura tangible.&quot;'
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
        <div className="h-64 w-full perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
            <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
            >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-lg border-2 border-dashed border-red-200 bg-white p-6 flex flex-col items-center justify-center text-center hover:border-red-400 transition-colors group">
                    <AlertCircle className="w-10 h-10 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-good-green text-lg" dangerouslySetInnerHTML={{ __html: item.trigger }}></p>
                    <p className="text-xs text-gray-400 mt-4 font-mono uppercase tracking-widest">Toca para defender</p>
                </div>

                {/* Back */}
                <div
                    className="absolute w-full h-full backface-hidden rounded-2xl shadow-xl bg-good-green p-6 flex flex-col items-center justify-center text-center rotate-y-180 border-2 border-good-lime"
                    style={{ transform: "rotateY(180deg)" }}
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

    const allChecked = checklistData.every(item => checks[item.id]);

    const toggleCheck = (id: string) => {
        setChecks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">

            {/* 1. HERO SECTION */}
            <section className="bg-good-green text-white relative overflow-hidden pb-12 pt-16 px-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-good-lime rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="bg-good-lime/20 text-good-lime px-3 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-sm border border-good-lime/30">
                            Briefing de Misión
                        </span>
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

                {/* 5. FOOTER RESOURCES */}
                <section className="bg-good-dark-green rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-good-lime mb-2">Arsenal de Seguimiento</h3>
                            <p className="text-good-white/70 text-sm max-w-sm mb-4">Herramientas rápidas para enviar post-reunión.</p>
                            <a
                                href="https://www.goodenergycol.com/inversiones"
                                target="_blank"
                                className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors border-b border-white/20 hover:border-white pb-0.5"
                            >
                                <LayoutDashboard className="w-3 h-3" /> Ir al Dashboard de Inversionista
                            </a>
                            <div className="mt-1 text-xs text-good-lime/70">
                                + Acceso a Comunidad Elite (WhatsApp)
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-end">
                            <a
                                href="/documents/deck-good-energy.pdf"
                                target="_blank"
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/10"
                            >
                                <Download className="w-4 h-4" /> PDF Business Plan
                            </a>
                            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/10">
                                <MapPin className="w-4 h-4" /> Video Ubicación
                            </button>
                            <button className="flex items-center gap-2 bg-good-lime text-good-green font-bold hover:bg-good-lime/90 transition-colors px-4 py-2 rounded-lg text-sm">
                                <MessageCircle className="w-4 h-4" /> Script WhatsApp
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
