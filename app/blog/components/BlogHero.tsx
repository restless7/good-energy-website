import Image from 'next/image'

export default function BlogHero() {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-center items-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/blog/clean-solar-hero.png"
                    alt="Good Energy Blog"
                    fill
                    priority
                    className="object-cover"
                />
                {/* Dark Overlay/Gradient */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                    Blog & Noticias
                </h1>
                <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
                    Descubre las últimas novedades sobre energía renovable, sostenibilidad e inversión en Colombia.
                </p>
                <div className="w-24 h-1 bg-good-lime rounded-full mx-auto mt-8" />
            </div>
        </section>
    )
}
