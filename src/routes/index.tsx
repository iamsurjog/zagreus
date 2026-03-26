import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import hackathonData from '@/data/hackathon.json';
import Header from '@/components/landing/Header';

export const Route = createFileRoute('/')({ component: Home });

function Countdown() {
    const target = new Date(hackathonData.countdown.targetDate).getTime();
    const [diff, setDiff] = useState(() => target - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setDiff(target - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [target]);

    if (diff <= 0) {
        return (
            <p className="text-2xl font-bold text-accent font-title">
                The hackathon has started!
            </p>
        );
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const units = [
        { label: 'Days', value: days },
        { label: 'Hours', value: hours },
        { label: 'Minutes', value: minutes },
        { label: 'Seconds', value: seconds },
    ];

    return (
        <div className="flex justify-center gap-6 md:gap-10">
            {units.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                    <span className="text-4xl md:text-6xl font-bold text-accent font-title">
                        {String(unit.value).padStart(2, '0')}
                    </span>
                    <span className="text-sm md:text-base text-text/60 mt-1">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

function Home() {
    const { hero, about, timeline, company, countdown } = hackathonData;

    return (
        <div className="bg-background text-text font-sans">
            <Header />
            {/* Hero */}
            <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-title title-gradient bg-clip-text text-transparent mb-4 motion-preset-focus">
                    {hero.title}
                </h1>
                <p className="text-xl md:text-2xl text-primary font-title mb-6 motion-preset-focus motion-delay-100">
                    {hero.subtitle}
                </p>
                <p className="max-w-2xl text-lg text-text/80 mb-10">
                    {hero.description}
                </p>
                <a
                    href={hero.ctaLink}
                    className="scifi-button-primary px-8 py-3 text-lg"
                >
                    {hero.ctaText}
                </a>
            </section>

            {/* About */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-title title-gradient bg-clip-text text-transparent text-center mb-6">
                        {about.title}
                    </h2>
                    <p className="text-lg text-text/80 text-center max-w-3xl mx-auto mb-16">
                        {about.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {about.highlights.map((h) => (
                            <div
                                key={h.title}
                                className="bigger-corners border border-secondary/40 rounded-2xl p-6 text-center"
                            >
                                <h3 className="text-xl font-bold font-title text-accent mb-2">
                                    {h.title}
                                </h3>
                                <p className="text-text/70">{h.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-title title-gradient bg-clip-text text-transparent text-center mb-16">
                        Timeline
                    </h2>
                    <div className="relative">
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-secondary/40 -translate-x-1/2" />
                        {timeline.map((item, i) => (
                            <div
                                key={`${item.stage}-${i}`}
                                className={`relative flex flex-col md:flex-row items-start mb-12 ${
                                    i % 2 === 0
                                        ? 'md:flex-row'
                                        : 'md:flex-row-reverse'
                                }`}
                            >
                                <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-accent rounded-full -translate-x-1/2 mt-2" />
                                <div
                                    className={`ml-10 md:ml-0 md:w-1/2 ${
                                        i % 2 === 0
                                            ? 'md:pr-12 md:text-right'
                                            : 'md:pl-12'
                                    }`}
                                >
                                    <span className="text-sm text-primary font-title">
                                        {item.date}
                                    </span>
                                    <h3 className="text-xl font-bold font-title text-accent mt-1">
                                        {item.stage}
                                    </h3>
                                    <p className="text-text/70 mt-2">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Company */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-title title-gradient bg-clip-text text-transparent mb-2">
                        Sponsored By
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-bold font-title text-accent mb-4">
                        {company.name}
                    </h3>
                    <p className="text-lg text-primary/80 font-title mb-6">
                        {company.tagline}
                    </p>
                    <p className="max-w-3xl mx-auto text-text/80 mb-12">
                        {company.description}
                    </p>
                    <div className="flex flex-wrap justify-center gap-12 mb-10">
                        {company.stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <span className="text-3xl md:text-4xl font-bold text-accent font-title">
                                    {stat.value}
                                </span>
                                <p className="text-text/60 mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                    <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="scifi-button-secondary px-6 py-2 font-title"
                    >
                        Visit Website
                    </a>
                </div>
            </section>

            {/* Countdown */}
            <section className="py-20 px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-title title-gradient bg-clip-text text-transparent mb-10">
                    {countdown.title}
                </h2>
                <Countdown />
            </section>
        </div>
    );
}
