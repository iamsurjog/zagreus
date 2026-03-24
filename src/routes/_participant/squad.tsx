import { Link, createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import type { Participant, Team } from '@/types/types';
import { fetchCurrentParticipant } from '@/api/participant';
import { fetchCurrentTeam, fetchTeamSubmissions } from '@/api/teams';
import MemberCard from '@/components/participant/MemberCard';
import SubmissionCard from '@/components/participant/SubmissionCard';

export const Route = createFileRoute('/_participant/squad')({
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
    return (
        <main className="p-6 flex flex-col gap-3 h-full">
            {team && participant && (
                <>
                    <h1 className="text-8xl font-bold font-title title-gradient bg-clip-text text-transparent uppercase motion-preset-focus" >{team.name}</h1>
                    <div className='flex flex-col gap-3 p-6 border border-primary border-dashed hover:bg-secondary/20 hover:border-accent transition-colors'>
                        <h2 className='text-6xl font-title font-bold'>Members</h2>
                        <div className='grid grid-cols-5 gap-3'>
                            {team.members?.map((member) => (
                                <MemberCard
                                    key={member.id}
                                    member={member}
                                    name={member.user?.name ?? ''}
                                    isLeader={member.role === 'LEADER'}
                                    isYou={
                                        participant.id === member.id
                                    }
                                    isUserLeader={participant.role === 'LEADER'}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col gap-3 p-6 border border-primary border-dashed hover:bg-secondary/20 hover:border-accent transition-colors'>
                        <h2 className='text-6xl font-title font-bold'>Submission Archive</h2>
                        <ArchiveSection 
                            teamId={team.id}
                        />
                    </div>
                </>
            )}
            {!team && (
                <div className='flex flex-col gap-6'>
                    <h1 className='text-8xl font-bold font-title title-gradient bg-clip-text text-transparent uppercase motion-preset-focus'>Hey there Rookie!</h1>
                    <p className='text-3xl'>Before you get started on your missions, you need a squad!</p>
                    <div className='flex flex-col gap-3 w-full'>
                        <Link to='/team_create'>
                            <button className='scifi-button-primary w-full'>
                                Create Team
                            </button>
                        </Link>
                        <Link to='/team_join'>
                            <button className='scifi-button-secondary w-full'>
                                Join Team
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </main>
    );
}

function ArchiveSection({ teamId }: { teamId: string }) {
    const { data: archive, isLoading } = useQuery({
        queryKey: ['team-archive', teamId],
        queryFn: () => fetchTeamSubmissions(teamId),
        enabled: !!teamId,
    });

    console.log("ZELLULULUL"+archive);

    if (isLoading) return <div className="animate-pulse w-full text-center text-accent font-title uppercase">ACCESSING ARCHIVE...</div>;

    return (
        <div className="flex flex-col gap-8">
            {archive?.map((group: any) => (
                <div key={group.eventName} className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-title uppercase text-accent shrink-0">
                            {group.eventName}
                        </h3>
                        <div className="h-px w-full bg-linear-to-r from-accent/50 to-transparent" />
                    </div>

                    {/* Submissions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {group.submissions.map((sub: any) => (
                            <SubmissionCard
                                key={sub.id}
                                submission={sub}
                                isUser={false}
                            />
                        ))}
                    </div>
                </div>
            ))}

            {archive?.length === 0 && (
                <div className="p-8 border border-dashed border-primary/20 text-center opacity-50 italic">
                    NO DATA TRANSMISSIONS FOUND IN ARCHIVE
                </div>
            )}
        </div>
    );
}
