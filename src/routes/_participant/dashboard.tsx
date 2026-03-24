import { Link, createFileRoute } from '@tanstack/react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import type { Participant, Submission, Team } from '@/types/types';
import { fetchCurrentParticipant } from '@/api/participant';
import { fetchCurrentTeam, fetchTeamRoundSubmissions } from '@/api/teams';
import MemberCard from '@/components/participant/MemberCard';
import { fetchCurrentEvent, fetchEvents, uploadFile } from '@/api/events';
import { Modal } from '@/components/common/Modal';
import SubmissionCard from '@/components/participant/SubmissionCard';

export const Route = createFileRoute('/_participant/dashboard')({
    component: RouteComponent,
});

function RouteComponent() {
    const { data: participant } = useQuery<Participant>({
        queryKey: ['participant'],
        queryFn: fetchCurrentParticipant,
    });

    const teamId = participant?.teamId;

    const { data: team } = useQuery<Team>({
        queryKey: ['team', teamId],
        queryFn: fetchCurrentTeam,
        enabled: !!teamId,
    });
    const { data: currentSystemState, isPending: isPendingCurrentSystemState } =
        useQuery({
            queryKey: ['system-state'],
            queryFn: fetchCurrentEvent,
            staleTime: 1000 * 60 * 5,
        });

    const { data: events } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    const currentEvent = events?.find(
        (event) => event.id === currentSystemState?.activeEventId,
    );
    const currentEventIndex =
        events?.findIndex((e) => e.id === currentSystemState?.activeEventId) ??
        -1;
    const nextEvent =
        currentEventIndex !== -1 && events
            ? events[currentEventIndex + 1]
            : null;

    const { data: submissions } = useQuery<Array<Submission>>({
        queryKey: ['submissions', currentEvent?.id],
        queryFn: () => fetchTeamRoundSubmissions(currentEvent!.id, teamId!),
        enabled: !!currentEvent?.id,
    });

    const submissionForm = useForm({
        defaultValues: {
            file: null as File | null,
            requirementId: '' as string,
        },

        onSubmit: async ({ value }) => {
            if (
                !value.file ||
                !participant?.id ||
                !teamId ||
                !currentEvent?.id
            ) {
                console.error(
                    'Missing critical data: File, Participant, Team, or Event ID',
                );
                return;
            }

            await submitFileMutation.mutateAsync({
                file: value.file,
                participantId: participant.id,
                teamId: teamId,
                eventId: currentEvent.id,
                reqId: value.requirementId,
            });
        },
    });

    const queryClient = useQueryClient();

    const submitFileMutation = useMutation({
        mutationFn: (variables: {
            file: File;
            participantId: string;
            teamId: string;
            eventId: string;
            reqId: string;
        }) =>
            uploadFile(
                variables.file,
                variables.participantId,
                variables.teamId,
                variables.eventId,
                variables.reqId,
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
            console.log('Transmission Complete.');
        },
        onError: (error) => {
            console.error('Transmission Interrupted:', error);
        },
    });

    return (
        <main className="p-6 flex flex-col gap-3 h-full">
            <div className="flex justify-between items-start">
                {!currentEvent && isPendingCurrentSystemState ? (
                    <h1
                        key="initializing"
                        className="text-8xl font-bold font-title title-gradient bg-clip-text text-transparent uppercase motion-preset-focus"
                    >
                        INITIALIZING
                    </h1>
                ) : !currentEvent ? (
                    <h1
                        key="onboarding"
                        className="text-8xl font-bold font-title title-gradient bg-clip-text text-transparent uppercase motion-preset-focus"
                    >
                        ONBOARDING
                    </h1>
                ) : (
                    <h1
                        key={currentEvent.id}
                        className="text-8xl font-bold font-title title-gradient bg-clip-text text-transparent uppercase motion-preset-focus"
                    >
                        {currentEvent.name}
                    </h1>
                )}

                <div className="flex flex-col gap-3 p-3 items-end">
                    <h3 className="font-title text-3xl">NEXT</h3>
                    <hr className="w-full" />
                    <h3 className="text-xl uppercase motion-translate-x-in motion-opacity-in">
                        {nextEvent ? (
                            <>
                                <span className="text-accent font-bold motion-translate-x-in motion-opacity-in">
                                    {nextEvent.startTime}
                                </span>{' '}
                                : {nextEvent.name}
                            </>
                        ) : (
                            'The End'
                        )}
                    </h3>
                </div>
            </div>

            <div className="flex gap-3 size-full">
                <div
                    className="flex flex-col gap-3 justify-between
                    border border-primary border-dashed size-full p-6
                    hover:bg-secondary/10 hover:border-accent transition-all
                    "
                >
                    <div className="flex-col flex gap-3">
                        <h4 className="font-title font-bold text-4xl">
                            Round Info
                        </h4>
                        <p className="text-xl motion-preset-focus">
                            {!currentEvent ? '' : currentEvent.description}
                        </p>
                    </div>
                    <div className="border-primary border border-dashed p-6">
                        <h3 className="text-xl uppercase font-title text-primary">
                            Required Files
                        </h3>
                        {currentEvent?.requirements.map((req) => (
                            <p className="text-right">
                                {req.name}
                                {req.type}
                            </p>
                        ))}
                        {currentEvent?.requirements.length === 0 && (
                            <p className="text-center">No Requirements</p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-3 size-full">
                    <div
                        className="flex flex-col gap-3 
                        border border-primary border-dashed w-full h-fit p-6
                        hover:bg-secondary/10 hover:border-accent transition-all
                        "
                    >
                        {!team ? (
                            <div className="flex flex-col gap-3">
                                <h4 className="font-title font-bold text-4xl motion-opacity-in">
                                    {' '}
                                    Team{' '}
                                </h4>
                                <Link to="/team_create">
                                    <button className="scifi-button-primary w-full">
                                        Create Team
                                    </button>
                                </Link>
                                <hr className="border-dashed border-primary" />
                                <Link to="/team_join">
                                    <button className="scifi-button-secondary w-full">
                                        join Team
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h4 className="font-title font-bold text-4xl uppercase motion-scale-in-125 w-fit">
                                    {team.name}
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {team.members?.map((member) => (
                                        <MemberCard
                                            key={member.id}
                                            name={member.user?.name ?? ''}
                                            member={member}
                                            isLeader={member.role === 'LEADER'}
                                            isYou={
                                                participant?.id === member.id
                                            }
                                            isUserLeader={
                                                participant?.role === 'LEADER'
                                            }
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    <div
                        className="flex flex-col gap-3 overflow-y-auto
                        border border-primary border-dashed size-full p-6
                        hover:bg-secondary/10 hover:border-accent transition-all
                        "
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="font-title font-bold text-4xl">
                                Submissions
                            </h4>
                            <Modal>
                                <Modal.Open
                                    render={(open) => (
                                        <button
                                            onClick={open}
                                            className="scifi-button-primary"
                                        >
                                            create
                                        </button>
                                    )}
                                />

                                <Modal.Window>
                                    {(close) => (
                                        <div className="flex flex-col gap-3">
                                            <h1 className="uppercase font-title text-5xl font-bold tracking-widest">
                                                New Submission
                                            </h1>
                                            <form
                                                name="newSubmissionForm"
                                                className="flex flex-col gap-3"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    submissionForm.handleSubmit();
                                                    close();
                                                }}
                                            >
                                                <submissionForm.Field
                                                    name="file"
                                                    validators={{
                                                        onChange: ({
                                                            value,
                                                        }) => {
                                                            const selectedReqId =
                                                                submissionForm.getFieldValue(
                                                                    'requirementId',
                                                                );
                                                            const requirement =
                                                                currentEvent?.requirements.find(
                                                                    (r) =>
                                                                        r.id ===
                                                                        selectedReqId,
                                                                );

                                                            if (!value)
                                                                return 'File is required';
                                                            if (!requirement)
                                                                return 'Please select a submission type first';
                                                            const allowedType =
                                                                requirement.type.toLowerCase();
                                                            const fileName =
                                                                value.name.toLowerCase();

                                                            if (
                                                                !fileName.endsWith(
                                                                    allowedType,
                                                                ) &&
                                                                !value.type.includes(
                                                                    allowedType,
                                                                )
                                                            ) {
                                                                return `Invalid file format. Expected: ${requirement.type}`;
                                                            }

                                                            return undefined;
                                                        },
                                                    }}
                                                    children={(field) => {
                                                        const file =
                                                            field.state.value;
                                                        const error =
                                                            field.state.meta
                                                                .errors[0];

                                                        return (
                                                            <submissionForm.Subscribe
                                                                selector={(
                                                                    state,
                                                                ) =>
                                                                    state.values
                                                                        .requirementId
                                                                }
                                                            >
                                                                <div
                                                                    className={`relative flex flex-col justify-center items-center gap-3 w-full p-6 transition-all duration-300 border-2 border-dashed
                                                            ${
                                                                file
                                                                    ? 'bg-accent/10 border-accent shadow-[0_0_15px_rgba(var(--accent-rgb),0.2)]'
                                                                    : 'bg-primary/10 border-transparent hover:border-primary/50'
                                                            }
                                                            `}
                                                                >
                                                                    {!file ? (
                                                                        <>
                                                                            <img
                                                                                src="/svgs/fileupload.svg"
                                                                                width={
                                                                                    100
                                                                                }
                                                                                className="opacity-70 group-hover:opacity-100 transition-opacity"
                                                                            />
                                                                            <h4 className="text-accent text-2xl font-title tracking-widest">
                                                                                CLICK
                                                                                TO
                                                                                UPLOAD
                                                                            </h4>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                                                                                <div className="text-accent mb-2">
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        width="64"
                                                                                        height="64"
                                                                                        viewBox="0 0 24 24"
                                                                                        fill="none"
                                                                                        stroke="currentColor"
                                                                                        strokeWidth="1.5"
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                    >
                                                                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                                                        <polyline points="14 2 14 8 20 8" />
                                                                                    </svg>
                                                                                </div>
                                                                                <h4 className="text-white text-xl font-mono truncate max-w-[300px]">
                                                                                    {
                                                                                        file.name
                                                                                    }
                                                                                </h4>
                                                                                <span className="text-accent/60 text-xs font-mono uppercase">
                                                                                    {(
                                                                                        file.size /
                                                                                        1024
                                                                                    ).toFixed(
                                                                                        1,
                                                                                    )}{' '}
                                                                                    KB
                                                                                    —
                                                                                    READY
                                                                                </span>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(
                                                                                        e,
                                                                                    ) => {
                                                                                        e.preventDefault();
                                                                                        field.handleChange(
                                                                                            null,
                                                                                        );
                                                                                    }}
                                                                                    className="mt-4 text-sm text-red-400 hover:text-red-200 hover:cursor-pointer transition-colors underline z-20"
                                                                                >
                                                                                    REMOVE_FILE
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}

                                                                    {error && (
                                                                        <span className="text-red-500 font-mono text-base uppercase animate-pulse">
                                                                            Error:{' '}
                                                                            {
                                                                                error
                                                                            }
                                                                        </span>
                                                                    )}

                                                                    <input
                                                                        required
                                                                        type="file"
                                                                        accept={(() => {
                                                                            const selectedReqId =
                                                                                submissionForm.getFieldValue(
                                                                                    'requirementId',
                                                                                );
                                                                            const req =
                                                                                currentEvent?.requirements.find(
                                                                                    (
                                                                                        r,
                                                                                    ) =>
                                                                                        r.id ===
                                                                                        selectedReqId,
                                                                                );
                                                                            if (
                                                                                !req
                                                                            )
                                                                                return undefined;

                                                                            return req.type.startsWith(
                                                                                '.',
                                                                            )
                                                                                ? req.type
                                                                                : `.${req.type}`;
                                                                        })()}
                                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                        onChange={(
                                                                            e,
                                                                        ) => {
                                                                            const file =
                                                                                e
                                                                                    .target
                                                                                    .files?.[0] ||
                                                                                null;
                                                                            field.handleChange(
                                                                                file,
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                            </submissionForm.Subscribe>
                                                        );
                                                    }}
                                                />

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-mono text-accent/60 uppercase tracking-widest">
                                                        Select Submission Type
                                                    </label>
                                                    <submissionForm.Field
                                                        name="requirementId"
                                                        children={(field) => (
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {currentEvent?.requirements.map(
                                                                    (req) => {
                                                                        const isActive =
                                                                            field
                                                                                .state
                                                                                .value ===
                                                                            req.id;
                                                                        return (
                                                                            <button
                                                                                key={
                                                                                    req.id
                                                                                }
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    field.handleChange(
                                                                                        req.id,
                                                                                    );
                                                                                    submissionForm.validateField(
                                                                                        'file',
                                                                                        'change',
                                                                                    );
                                                                                }}
                                                                                className={`p-3 border text-left transition-all duration-200 ${
                                                                                    isActive
                                                                                        ? 'border-accent bg-accent/20 text-white'
                                                                                        : 'border-primary/30 bg-primary/5 text-primary/60 hover:border-primary'
                                                                                }`}
                                                                            >
                                                                                <div className="font-title text-sm uppercase">
                                                                                    {
                                                                                        req.name
                                                                                    }
                                                                                </div>
                                                                                <div className="text-[10px] font-mono opacity-70">
                                                                                    ALLOWED:{' '}
                                                                                    {req.type ||
                                                                                        'Any'}
                                                                                </div>
                                                                            </button>
                                                                        );
                                                                    },
                                                                )}
                                                            </div>
                                                        )}
                                                    />
                                                </div>

                                                <submissionForm.Subscribe
                                                    selector={(state) => [
                                                        state.canSubmit,
                                                        state.isSubmitting,
                                                    ]}
                                                    children={([
                                                        canSubmit,
                                                        isSubmitting,
                                                    ]) => (
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                !canSubmit ||
                                                                isSubmitting
                                                            }
                                                            className="scifi-button-primary"
                                                        >
                                                            {isSubmitting
                                                                ? 'UPLOADING...'
                                                                : 'SUBMIT'}
                                                        </button>
                                                    )}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        submissionForm.reset();
                                                        close();
                                                    }}
                                                    className="scifi-button-secondary"
                                                >
                                                    Cancel
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </Modal.Window>
                            </Modal>
                        </div>
                        {(!submissions || submissions.length === 0) && (
                            <div className="w-full justify-center text-xl flex items-center">
                                <span>No Submissions Yet</span>
                            </div>
                        )}
                        {submissions &&
                            submissions.map((submission) => {
                                return (
                                    <SubmissionCard
                                        submission={submission}
                                        isUser={
                                            submission.memberId ===
                                            participant?.id
                                        }
                                    />
                                );
                            })}
                    </div>
                </div>
            </div>

            <div className="flex font-title text-3xl w-full justify-center">
                <span className="[-webkit-text-stroke:1px_white] font-bold text-transparent">
                    MISSION:&nbsp;
                </span>
                {!team?.mission ? (
                    <>
                        <span>Select Problem Statement</span>
                    </>
                ) : (
                    <>
                        <span> {team.mission.name} </span>
                    </>
                )}
            </div>
        </main>
    );
}
