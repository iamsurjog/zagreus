import { createFileRoute, redirect } from '@tanstack/react-router';
import { gsap } from 'gsap';
import { ScrollSmoother, ScrollTrigger, SplitText } from 'gsap/all';
import { useGSAP } from '@gsap/react';
import Header from '@/components/landing/Header';
import BlockReveal from '@/components/landing/BlockReveal';

gsap.registerPlugin(SplitText, ScrollSmoother, ScrollTrigger);

export const Route = createFileRoute('/')({
    component: App,
    ssr: false,
});

function App() {
    useGSAP(() => {
        ScrollSmoother.create({
            smooth: 1.5,
            effects: true,
            smoothTouch: 1,
        });

        const aboutPara = SplitText.create('#about-para', {
            type: 'lines',
            mask: 'lines',
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#about-section',
                scrub: false,
                start: 'top 80%',
                toggleActions: 'play none reverse reset',
            },
        });

        tl.from(aboutPara.lines, {
            yPercent: -100,
            stagger: 0.09,
            ease: 'back.out',
            delay: 0.2,
            duration: 1,
        });
    }, []);

    return (
        <main id="smooth-content">
            <Header />
            <section className="h-screen">
                <div className="w-full flex justify-center items-center scale-100">
                    <img src="/HERMES.svg" />
                </div>
            </section>

            <section id="about-section" className="h-screen">
                <BlockReveal scrollTrigger="#about-section">
                    <div className="bg-text block-revealer" />
                    <h2 className="block-line text-8xl font-title">
                        About Hermes
                    </h2>
                </BlockReveal>
                <br />
                <div className="flex justify-end w-full ">
                    <p
                        id="about-para"
                        className="leading-relaxed w-1/2 text-2xl"
                    >
                        A 36-hour challenge where teams design Web3 systems for
                        trusted satellite-data use. Beginning with a Fusion 360
                        workshop, followed by guided reviews, documentation, and
                        a final prototype demonstrating decentralized
                        verification, access control, and transparent satellite
                        data flows for social-impact applications.
                    </p>
                </div>
            </section>
            <div></div>
        </main>
    );
}
