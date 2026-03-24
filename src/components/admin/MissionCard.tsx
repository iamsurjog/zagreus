import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../common/Modal';
import { MissionForm } from '../forms/MissionForm';
import type { Mission } from '@/types/types';
import { deleteMission } from '@/api/mission';

export default function MissionCard({ mission }: { mission: Mission }) {
    return (
        <div
            className="flex flex-col justify-between gap-3 bg-secondary/20 p-6 text-xl border border-dashed border-transparent
            hover:bg-secondary/40 hover:border-primary transition-all"
        >
            <div className="flex flex-col gap-3">
                <h2 className="font-title text-2xl font-bold text-transparent bg-clip-text title-gradient">
                    {mission.name}
                </h2>
                <p>
                    <span className="text-primary">Description:&nbsp;</span>{' '}
                    {mission.description}
                </p>
            </div>
            <div className="flex justify-between items-center">
                <h6>
                    <span className="text-primary">Document Name:&nbsp;</span>
                    {mission.documentName}
                </h6>

                <div className="flex w-fit gap-3">
                    <MissionEditForm mission={mission} />
                    <MissionDeleteDialog mission={mission} />
                </div>
            </div>
        </div>
    );
}

function MissionEditForm({ mission }: { mission: Mission }) {
    return (
        <Modal>
            <Modal.Open
                render={(open) => (
                    <button
                        className="scifi-button-secondary"
                        onClick={(e) => {
                            e.stopPropagation();
                            open();
                        }}
                    >
                        Edit
                    </button>
                )}
            />
            <Modal.Window>
                {(close) => (
                    <MissionForm
                        initialValues={mission}
                        onCancel={close}
                        onSuccess={close}
                    />
                )}
            </Modal.Window>
        </Modal>
    );
}

function MissionDeleteDialog({ mission }: { mission: Mission }) {
    const queryClient = useQueryClient();
    const removeMutation = useMutation({
        mutationFn: async () => {
            return await deleteMission(mission.id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['missions'] });
        },
    });
    return (
        <Modal>
            <Modal.Open
                render={(open) => (
                    <button
                        className="scifi-button-tertiary"
                        onClick={(e) => {
                            e.stopPropagation();
                            open();
                        }}
                    >
                        Delete
                    </button>
                )}
            />
            <Modal.Window>
                {(close) => (
                    <div className="flex flex-col gap-3">
                        <h1 className="uppercase font-title text-5xl font-bold tracking-widest">
                            delete mission
                        </h1>
                        <h4 className="form-label">Are you sure?</h4>
                        <div className="w-full flex flex-row-reverse gap-3">
                            <button
                                onClick={() => {
                                    removeMutation.mutate();
                                    close();
                                }}
                                className="scifi-button-tertiary"
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                onClick={close}
                                className="scifi-button-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Modal.Window>
        </Modal>
    );
}
