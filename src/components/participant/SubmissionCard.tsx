import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Modal } from "../common/Modal";
import type { Submission } from "@/types/types"
import { deleteSubmission } from "@/api/submission"

export default function SubmissionCard({ submission, isUser }: { submission: Submission, isUser: boolean }) {

    const queryClient = useQueryClient();

    const deleteSubmissionMutation = useMutation({
        mutationKey: ['submissions'],
        mutationFn: async (value: string) => {
            await deleteSubmission(value);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['submissions']})
        }
    })

    return (
        <a href={submission.url} target="_blank" className='w-full block bg-secondary/20 p-6 relative
            hover:bg-secondary/40 transition-all
            before:absolute before:size-5 before:border-l-2 before:border-b-2 before:border-l-primary before:border-b-primary before:bottom-0 before:left-0
            hover:before:border-l-accent hover:before:border-b-accent hover:before:scale-150 before:transition-all
            after:absolute after:size-5 after:border-r-2 after:border-t-2 after:border-r-primary after:border-t-primary after:top-0 after:right-0
            hover:after:border-r-accent hover:after:border-t-accent hover:after:scale-150 after:transition-all
            '>
            <div className="justify-between flex">
                <h2 className="font-title uppercase text-accent">
                    {submission.name}
                </h2>
                {isUser && (
                    <Modal>
                        <Modal.Open
                            render={(open) => (
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); open(); }} className='scifi-button-tertiary'>Delete</button>
                            )}
                        />
                        <Modal.Window>
                            {(close) => (
                                <form className="flex flex-col gap-3">
                                    <h1 className="uppercase font-title text-5xl font-bold tracking-widest">
                                        Delete Submission
                                    </h1>
                                    <label className='form-label'>Are you sure?</label>
                                    <div className="w-full flex flex-row-reverse gap-3 items-center">
                                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteSubmissionMutation.mutateAsync(submission.id); close(); }} className='scifi-button-tertiary'>Delete</button>
                                        <button onClick={close} className='scifi-button-secondary'>Cancel</button>
                                    </div>
                                </form>
                            )}
                        </Modal.Window>
                    </Modal>
                )}
            </div>
            <br />

            <h4 className="text-right uppercase">{submission.member?.user?.name}</h4>
        </a>
    )
}

