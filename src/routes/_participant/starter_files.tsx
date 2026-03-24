import { createFileRoute } from '@tanstack/react-router';
import { useRef } from 'react';

export const Route = createFileRoute('/_participant/starter_files')({
    component: RouteComponent,
});

function RouteComponent() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleMouseEnter = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };
    return (
        <div className="flex justify-center w-full">
            <a href={'/oiai.mp4'} download>
                <video
                    ref={videoRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    loop={true}
                    src={'/oiai.mp4'}
                    height={500}
                    width={500}
                    className=""
                />
            </a>
            <audio ref={audioRef} src={'/oiiaii.mp3'} loop />
        </div>
    );
}
