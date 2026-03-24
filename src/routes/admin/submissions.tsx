import { useMutation, useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { fetchAllTeams, fetchTeamSubmissions } from '@/api/teams';

export const Route = createFileRoute('/admin/submissions')({
    component: RouteComponent,
});

function RouteComponent() {

    const mutationTeamSelect = useMutation({
        mutationFn: async (teamId: string) => {
            const allSubmisions = await fetchTeamSubmissions(teamId)
            console.log(allSubmisions)
        },
    });
    const {
        data: allTeams,
    } = useQuery({
        queryKey: ['events'],
        queryFn: fetchAllTeams,
    });
    return <main>
        <select onChange={(e) => mutationTeamSelect.mutate(e.target.value)}>
            {allTeams &&
                allTeams.map((team) => {
                    return(
                        <option value={team.id}>
                            {team.name}
                        </option>
                    )
                })
            }
        </select>
    </main>;
}
