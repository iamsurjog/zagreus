import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import type { Mission } from '@/types/types';
import { fetchMissions } from '@/api/mission';
import { Modal } from '@/components/common/Modal';
import MissionCard from '@/components/admin/MissionCard';
import { MissionForm } from '@/components/forms/MissionForm';

export const Route = createFileRoute('/admin/missions')({
    component: RouteComponent,
});

function RouteComponent() {
    const { data } = useQuery<Array<Mission>>({
        queryKey: ['missions'],
        queryFn: fetchMissions,
    });

    return (
        <main className="p-6 flex flex-col gap-3">
            <div className="justify-between flex items-start">
                <h1 className="title-gradient bg-clip-text text-transparent font-bold uppercase text-7xl font-title">
                    Missions
                </h1>
                <Modal>
                    <Modal.Open
                        render={(open) => (
                            <button
                                onClick={open}
                                className="scifi-button-primary"
                            >
                                New Mission
                            </button>
                        )}
                    />
                    <Modal.Window>
                        {(close) => (
                            <MissionForm onSuccess={close} onCancel={close} />
                        )}
                    </Modal.Window>
                </Modal>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full">
                {data?.map((mission) => {
                    return <MissionCard mission={mission} />;
                })}
            </div>
        </main>
    );
}
