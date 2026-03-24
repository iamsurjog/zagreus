import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Dialog({
    trigger,
    planetImg,
    planetVdo,
    children,
    title,
    submit,
    handleSubmit,
}: {
    planetImg: string;
    children: React.ReactNode;
    trigger: React.ReactNode;
    submit?: React.ReactNode;
    planetVdo: string;
    handleSubmit?: () => void;
    title?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <div onClick={handleOpen} className="cursor-pointer">
                {trigger}
            </div>

            {mounted &&
                isOpen &&
                createPortal(
                    <div
                        onClick={handleClose}
                        className="motion-preset-focus-md motion-duration-150 bg-black/60 backdrop-blur-md fixed inset-0 w-full h-full z-50 flex gap-16 justify-center items-center overflow-hidden"
                    >
                        {planetVdo && (
                            <div className="overflow-hidden rounded-full">
                                <video
                                    id={planetVdo}
                                    src={planetVdo}
                                    poster={planetImg}
                                    autoPlay={true}
                                    // alt={title || "Planet iamge"}
                                    loop={true}
                                    // playbackRate={0.5}
                                    width={540}
                                    height={540}
                                    className="md:block hidden object-cover scale-145"
                                />
                            </div>
                        )}

                        {!planetVdo && (
                            <div className="md:block hidden size-100 bg-gray-300 rounded-full" />
                        )}
                        <div
                            className="relative flex flex-col items-center justify-center border-primary
                            md:max-w-1/2 h- w-full text-wrap gap-6
                            modal-pointy-corners after:size-10 before:size-10 before:z-10 after:z-10 p-0.5
                            after:[filter:drop-shadow(0_0_8px_#A3D0FF)_drop-shadow(0_0_2px_#A3D0FF)_drop-shadow(0_0_75px_#A3D0FF)_drop-shadow(0_0_25px_#A3D0FF)] 
                            before:[filter:drop-shadow(0_0_8px_#A3D0FF)_drop-shadow(0_0_2px_#A3D0FF)_drop-shadow(0_0_75px_#A3D0FF)_drop-shadow(0_0_25px_#A3D0FF)] 
                        "
                        >
                            <div
                                onClick={(e: React.MouseEvent) =>
                                    e.stopPropagation()
                                }
                                className="relative flex flex-col items-center justify-center border border-primary p-6 border-dashed bg-background/80
                            shadow-lg max-h-full w-full overflow-y-auto text-wrap overflow-x-hidden gap-6"
                            >
                                <div className="flex w-full justify-between items-start">
                                    <h1 className="text-3xl">
                                        {title || 'Title'}
                                    </h1>
                                    <button
                                        onClick={handleClose}
                                        className="cursor-pointer"
                                    >
                                        X
                                    </button>
                                </div>
                                <div className=" overflow-y-auto overflow-x-visible max-w-full whitespace-pre-line">
                                    {children}
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <div />
                                    <div
                                        onClick={() => {
                                            if (handleSubmit) handleSubmit();
                                            handleClose();
                                        }}
                                    >
                                        {submit}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body,
                )}
        </>
    );
}
