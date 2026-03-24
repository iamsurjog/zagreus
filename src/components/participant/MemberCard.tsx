import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../common/Modal";
import type { Member } from "@/types/types";
import { kickParticipant } from "@/api/participant";

export default function MemberCard({
    name,
    member,
    isLeader,
    isYou,
    isUserLeader
}: {
    name: string
    member: Member
    isLeader: boolean
    isYou: boolean
    isUserLeader: boolean
}) {

    const queryClient = useQueryClient();

    const kickUserMutation = useMutation({
        mutationKey: ['team'],
        mutationFn: async (memberId: string) => {
            await kickParticipant(memberId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['team']})
        }
    });
    return (
        <div
            className={`${isYou ? ' after:from-primary/40' : 'after:from-transparent'} member-card p-3 after:bg-linear-to-b after:to-secondary
            flex flex-col gap-3 justify-between motion-translate-x-in motion-opacity-in`}
        >
            <span className="text-lg truncate">{name}</span>

            <div className="flex gap-3 items-center">
                <span className="uppercase text-lg font-bold">
                    {isLeader ? 'Leader' : 'Member'}
                </span>
                {isUserLeader && !isYou && (
                    <Modal>
                        <Modal.Open
                            render={(open) => (
                                <button onClick={open} className="scifi-button-tertiary">
                                    Kick
                                </button>
                            )}
                        />
                        <Modal.Window>
                            {(close) => (
                                <form className="flex flex-col gap-3">
                                    <h1 className="uppercase font-title text-5xl font-bold tracking-widest">
                                        Kick Member ?
                                    </h1>
                                    <label className="form-label">Are you sure you want to kick {member.user?.name}?</label>
                                    <div className="w-full flex flex-row-reverse gap-3">
                                        <button
                                            type="button"
                                            className="scifi-button-tertiary"
                                            onClick={() => {
                                                kickUserMutation.mutate(member.id)
                                                close();
                                            }}
                                        >
                                            Kick
                                        </button>
                                        <button type="button" className="scifi-button-secondary" onClick={close}>Cancel</button>
                                    </div>
                                </form>
                            )}
                        </Modal.Window>
                    </Modal>
                )}
            </div>
        </div>
    );
}
