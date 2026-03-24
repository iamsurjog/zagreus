import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Dialog from '@/components/missions/Dialog';
import {
    fetchMissions,
    getCurrentMission,
    setCurrentMission,
} from '@/api/mission';

export const Route = createFileRoute('/_participant/missions')({
    component: RouteComponent,
});

function ProblemStatementCard({
    title,
    vdoSrc,
    imgSrc,
    isActive,
}: {
    title: string;
    vdoSrc?: string;
    imgSrc?: string;
    isActive: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };
    return (
        <>
            {!isActive && (
                <button
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    type="button"
                    className="flex flex-col justify-center bg-background/20 items-center gap-4 border border-secondary w-full h-full p-6
                    hover:border-primary hover:cursor-pointer hover:bg-background/60 hover:shadow-[inset_0_0_32px_#8CB6DC40,0_8px_8px_#18518540] transition-all hover:motion-scale-out-103"
                >
                    {vdoSrc && (
                        <div className="size-50 rounded-full overflow-hidden">
                            <video
                                ref={videoRef}
                                poster={imgSrc}
                                src={vdoSrc}
                                loop={true}
                                width={200}
                                height={200}
                                className="object-cover scale-135"
                            />
                        </div>
                    )}
                    {!vdoSrc && (
                        <div className="bg-gray-300 size-50 rounded-full" />
                    )}
                    <h3 className="font-body text-primary text-xl">{title}</h3>
                </button>
            )}
            {isActive && (
                <button
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    type="button"
                    className="flex flex-col justify-center bg-background/20 items-center gap-4 border border-accent w-full h-full p-6
                    hover:border-primary hover:cursor-pointer hover:bg-background/60 hover:shadow-[inset_0_0_32px_#8CB6DC40,0_8px_8px_#18518540] transition-all hover:motion-scale-out-103"
                >
                    {vdoSrc && (
                        <div className="size-50 rounded-full overflow-hidden">
                            <video
                                ref={videoRef}
                                poster={imgSrc}
                                src={vdoSrc}
                                loop={true}
                                width={200}
                                height={200}
                                className="object-cover scale-135"
                            />
                        </div>
                    )}
                    {!vdoSrc && (
                        <div className="bg-gray-300 size-50 rounded-full" />
                    )}
                    <h3 className="font-body text-accent text-xl">{title}</h3>
                </button>
            )}
        </>
    );
}

function RouteComponent() {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [psId, setPsID] = useState<string | null>(null);
    const [missions, setMissions] = useState<
        Array<{
            id: string;
            name: string;
            description: string;
            documentName: string;
        }>
    >([{ id: '', name: '', description: '', documentName: '' }]);

    const missionAcceptMutation = useMutation({
        mutationFn: async (missionId: string) => {
            setPsID(missionId);
            await setCurrentMission(missionId);
        },
        onSuccess: () => {
            navigate({ to: '/dashboard' });
        },
    });
    const getMissionMutation = useMutation({
        mutationFn: async () => {
            const problemStatementContent = await fetchMissions();
            setMissions(problemStatementContent);
            const result = await getCurrentMission();
            console.log(result);
            setRole(result.role);
            if (result.psId === null) {
                setPsID(null);
            } else {
                setPsID(result.psId);
            }
        },
    });
    useEffect(() => {
        getMissionMutation.mutate();
    }, []);
    const problemStatementContents = [
        {
            planetImg: '/planets/alderaan.webp',
            planetVdo: '/planets_video/aldeeran.webm',
        },
        {
            planetImg: '/planets/dathomir.webp',
            planetVdo: '/planets_video/dathomir.webm',
        },
        {
            planetImg: '/planets/hoth.webp',
            planetVdo: '/planets_video/hoth.webm',
        },
        {
            planetImg: '/planets/kessel.webp',
            planetVdo: '/planets_video/kessel.webm',
        },
        {
            planetImg: '/planets/lothal.webp',
            planetVdo: '/planets_video/lothal.webm',
        },
        {
            planetImg: '/planets/mustafar.webp',
            planetVdo: '/planets_video/mustafar.webm',
        },
        {
            planetImg: '/planets/tatooine.webp',
            planetVdo: '/planets_video/tatooine.webm',
        },
        {
            planetImg: '/planets/utapau.webp',
            planetVdo: '/planets_video/utapau.webm',
        },
    ];

    return (
        <main>
            <div className="flex flex-col gap-4 justify-between w-full p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-col-3 lg:grid-cols-4 gap-3 w-full">
                    {missions.length !== 0 &&
                        missions.map((ps, i) => {
                            return (
                                <Dialog
                                    key={ps.id}
                                    title={ps.name}
                                    planetVdo={
                                        problemStatementContents[i].planetVdo
                                    }
                                    planetImg={
                                        problemStatementContents[i].planetImg
                                    }
                                    trigger={
                                        <ProblemStatementCard
                                            title={ps.name}
                                            vdoSrc={
                                                problemStatementContents[i]
                                                    .planetVdo
                                            }
                                            imgSrc={
                                                problemStatementContents[i]
                                                    .planetImg
                                            }
                                            isActive={ps.id == psId}
                                        />
                                    }
                                >
                                    {ps.description}
                                    <br />
                                    <br />
                                    <a
                                        href={'PS_pdfs/' + ps.documentName}
                                        download
                                    >
                                        <button className="scifi-button-secondary w-full">
                                            <span className="font-body font-bold text-secondary uppercase">
                                                Download Brief
                                            </span>
                                        </button>
                                    </a>
                                    <br />
                                    <br />
                                    {role == 'LEADER' && psId === null && (
                                        <button
                                            className="scifi-button-primary w-full"
                                            onClick={() => {
                                                missionAcceptMutation.mutate(
                                                    ps.id,
                                                );
                                            }}
                                        >
                                            <span className="font-body font-bold text-primary uppercase">
                                                Accept
                                            </span>
                                        </button>
                                    )}
                                </Dialog>
                            );
                        })}
                </div>

                <div className="font-bold text-2xl sm:text-4xl md:text-6xl text-transparent uppercase flex gap-2 sm:gap-4">
                    <h1 className="text-text font-heading [-webkit-text-stroke:1px_white] text-nowrap">
                        Choose your
                    </h1>
                    <h1 className="bg-clip-text text-transparent bg-linear-to-b from-accent to-secondary text-shadow-[0_8px_16px_#8CB6DC40]">
                        mission
                    </h1>
                </div>
            </div>
        </main>
    );
}
