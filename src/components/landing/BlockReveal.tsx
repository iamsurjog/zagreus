import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import { useRef } from 'react';
import type { ReactNode } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function BlockReveal({
    children,
    scrollTrigger,
}: {
    children: ReactNode;
    scrollTrigger: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: scrollTrigger,
                    scrub: false,
                    start: 'top 80%',
                    toggleActions: 'play none reverse reset',
                },
            });

            gsap.set('.block-line', { opacity: 0 });
            gsap.set('.block-revealer', {
                scaleX: 0,
                transformOrigin: 'left center',
            });

            tl.to('.block-revealer', { scaleX: 1, duration: 0.15 })
                .to('.block-line', { opacity: 1, duration: 0.15 })
                .set('.block-revealer', { transformOrigin: 'right center' })
                .fromTo(
                    '.block-revealer',
                    { scaleX: 1 },
                    { scaleX: 0, duration: 0.15 },
                );
        },
        {
            scope: containerRef,
        },
    );

    return (
        <div ref={containerRef} className="block-line-wrapper">
            {children}
        </div>
    );
}
