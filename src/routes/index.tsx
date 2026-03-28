import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Stars } from "@react-three/drei";
import hackathonData from '@/data/hackathon.json';
import Header from '@/components/landing/Header';


import Model from "@/components/landing/Satellite_bd"

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute('/')({ component: Home, ssr: false });

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

    const heroRef = useRef<HTMLElement>(null);
    const aboutRef = useRef<HTMLElement>(null);
    const timelineRef = useRef<HTMLElement>(null);
    const companyRef = useRef<HTMLElement>(null);
    const countdownRef = useRef<HTMLElement>(null);

    const [time, setTime] = useState(0);

    useGSAP(() => {
        const heroEls = heroRef.current?.querySelectorAll('.anim-hero');
        if (heroEls?.length) {
            gsap.from(heroEls, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });
        }

        const aboutTitle = aboutRef.current?.querySelector('.anim-about-title');
        if (aboutTitle) {
            gsap.from(aboutTitle, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: aboutTitle,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });
        }

        const aboutDesc = aboutRef.current?.querySelector('.anim-about-desc');
        if (aboutDesc) {
            gsap.from(aboutDesc, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                delay: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: aboutDesc,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });
        }

        const aboutCards =
            aboutRef.current?.querySelectorAll('.anim-about-card');
        if (aboutCards?.length) {
            gsap.from(aboutCards, {
                y: 50,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: aboutCards[0],
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });
        }

        const timelineTitle = timelineRef.current?.querySelector(
            '.anim-timeline-title',
        );
        if (timelineTitle) {
            gsap.from(timelineTitle, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: timelineTitle,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });
        }

        const timelineItems = timelineRef.current?.querySelectorAll(
            '.anim-timeline-item',
        );
        if (timelineItems?.length) {
            timelineItems.forEach((item) => {
                const isLeft = item.classList.contains('anim-from-left');
                gsap.from(item, {
                    x: isLeft ? -60 : 60,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });
        }

        const companyEls =
            companyRef.current?.querySelectorAll('.anim-company');
        if (companyEls?.length) {
            gsap.from(companyEls, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: companyRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });
        }

        const statEls = companyRef.current?.querySelectorAll('.anim-stat');
        if (statEls?.length) {
            gsap.from(statEls, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: statEls[0],
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });
        }

        const countdownEls =
            countdownRef.current?.querySelectorAll('.anim-countdown');
        if (countdownEls?.length) {
            gsap.from(countdownEls, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: countdownRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });
        }
        const animationDuration = 10; 

        gsap.to({}, {
            duration: animationDuration,
            scrollTrigger: {
                trigger: "body", // Scrub across the whole page
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5, // Smoothing
                onUpdate: (self) => {
                    // self.progress is a value between 0 and 1
                    setTime(self.progress * animationDuration);
                    console.log(self.progress)
                }
            }
        });
    }, []);

    return (
        <>
            <div className="bg-transparent fixed h-full top-0 left-0 w-full">
                <Canvas frameloop="always">
                    {/* <ambientLight intensity={50} /> */}
                    <directionalLight position={[5, -2, 10]} intensity={5} />
                    <directionalLight position={[-5, 2, 10]} intensity={5} />
                    <directionalLight position={[3, -2, 10]} intensity={5} />
                    <directionalLight position={[-3, 2, 10]} intensity={5} />
                    <directionalLight position={[0, 0, 10]} intensity={5} />
                    <group rotation={[4 * Math.PI / 8, 0, 0]} scale={0.8}>
                        <Model time={time}/>
                    </group>
                    {/* <Model rotation={[Math.PI/2, 0, Math.PI/4]}/> */}
                    {/* <Environment preset={'studio'} /> */}


                </Canvas>

            </div>

            <div className="text-text font-sans bg-transparent z-10">
                <Header />
                {/* Hero */}
                <section
                    ref={heroRef}
                    className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-transparent"
                >
                    <h1 className="anim-hero text-4xl md:text-6xl lg:text-7xl font-bold font-title title-gradient bg-clip-text text-transparent mb-4">
                        {hero.title}
                    </h1>
                    <p className="anim-hero text-xl md:text-2xl text-primary font-title mb-6">
                        {hero.subtitle}
                    </p>
                    <p className="anim-hero max-w-2xl text-lg text-text/80 mb-10">
                        {hero.description}
                    </p>
                    <a
                        href={hero.ctaLink}
                        className="anim-hero scifi-button-primary px-8 py-3 text-lg"
                        target='_blank'
                    >
                        {hero.ctaText}
                    </a>
                </section>
                {/* About */}
                <section ref={aboutRef} className="py-20 px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="anim-about-title text-3xl md:text-4xl font-bold font-title title-gradient bg-clip-text text-transparent text-center mb-6">
                            {about.title}
                        </h2>
                        <p className="anim-about-desc text-lg text-text/80 text-center max-w-3xl mx-auto mb-16">
                            {about.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {about.highlights.map((h) => (
                                <div
                                    key={h.title}
                                    className="anim-about-card bigger-corners border border-secondary/40 rounded-2xl p-6 text-center"
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
                <section ref={timelineRef} className="py-20 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="anim-timeline-title text-3xl md:text-4xl font-bold font-title title-gradient bg-clip-text text-transparent text-center mb-16">
                            Timeline
                        </h2>
                        <div className="relative">
                            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-secondary/40 -translate-x-1/2" />
                            {timeline.map((item, i) => (
                                <div
                                    key={`${item.stage}-${i}`}
                                    className={`anim-timeline-item ${i % 2 === 0 ? 'anim-from-left' : 'anim-from-right'} relative flex flex-col md:flex-row items-start mb-12 ${i % 2 === 0
                                        ? 'md:flex-row'
                                        : 'md:flex-row-reverse'
                                        }`}
                                >
                                    <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-accent rounded-full -translate-x-1/2 mt-2" />
                                    <div
                                        className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0
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
                <section className='h-5'></section>

                {/* Company */}
                <section ref={companyRef} className="py-20 px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="anim-company text-3xl md:text-4xl font-bold font-title title-gradient bg-clip-text text-transparent mb-2">
                            Sponsored By
                        </h2>
                        <h3 className="anim-company text-2xl md:text-3xl font-bold font-title text-accent mb-4">
                            {company.name}
                        </h3>
                        <p className="anim-company text-lg text-primary/80 font-title mb-6">
                            {company.tagline}
                        </p>
                        <p className="anim-company max-w-3xl mx-auto text-text/80 mb-12">
                            {company.description}
                        </p>
                        <div className="flex flex-wrap justify-center gap-12 mb-10">
                            {company.stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="anim-stat text-center"
                                >
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
                            className="anim-company scifi-button-secondary px-6 py-2 font-title"
                        >
                            Visit Website
                        </a>
                    </div>
                </section>

                {/* Countdown */}
                <section ref={countdownRef} className="py-20 px-6 text-center">
                    <h2 className="anim-countdown text-3xl md:text-4xl font-bold font-title title-gradient bg-clip-text text-transparent mb-10">
                        {countdown.title}
                    </h2>
                    <div className="anim-countdown">
                        <Countdown />
                    </div>
                </section>
            </div>
        </>
    );
}
