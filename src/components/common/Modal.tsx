import {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { ReactElement, ReactNode } from 'react';

interface ModalContextType {
    isOpen: boolean;
    open: () => void;
    close: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function useModalContext() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error(
            'Modal compound components must be used within a <Modal />',
        );
    }
    return context;
}

interface ModalProps {
    children: ReactNode;
}

interface RenderProps {
    render: (fn: () => void) => ReactElement;
}

interface WindowProps {
    children: ReactNode | ((close: () => void) => ReactNode);
}

export function Modal({ children }: ModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    return (
        <ModalContext.Provider value={{ isOpen, open, close }}>
            {children}
        </ModalContext.Provider>
    );
}

function Open({ render }: RenderProps) {
    const { open } = useModalContext();
    return render(open);
}

function Close({ render }: RenderProps) {
    const { close } = useModalContext();
    return render(close);
}

function Window({ children }: WindowProps) {
    const { isOpen, close } = useModalContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from(containerRef.current, { autoAlpha: 0, duration: 0.15 }).from(
            contentRef.current,
            {
                scale: 0.25,
                filter: 'blur(16px)',
                autoAlpha: 0,
                duration: 0.15,
                ease: 'expo.out',
            },
            '<',
        );
    }, [isOpen]);

    const handleClose = () => {
        const tl = gsap.timeline();
        tl.to(contentRef.current, {
            scale: 0.95,
            filter: 'blur(16px)',
            autoAlpha: 0,
            duration: 0.15,
            ease: 'back.out',
        }).to(
            containerRef.current,
            { autoAlpha: 0, duration: 0.15, onComplete: () => close() },
            '<',
        );
    };

    if (!isOpen) return null;
    return createPortal(
        <div
            ref={containerRef}
            className="fixed inset-0 bg-background/40 backdrop-blur-md flex items-center justify-center z-50"
            onClick={handleClose}
        >
            <div
                ref={contentRef}
                className="bg-background/80 p-6 border border-primary border-dashed modal-pointy-corners min-w-1/2"
                onClick={(e) => e.stopPropagation()}
            >
                {typeof children === 'function'
                    ? children(handleClose)
                    : children}
            </div>
        </div>,
        document.body,
    );
}

Modal.Open = Open;
Modal.Close = Close;
Modal.Window = Window;
