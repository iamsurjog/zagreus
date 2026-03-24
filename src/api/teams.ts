import teamsData from '@/mock/teams.json';
import submissionsData from '@/mock/submissions.json';

let teams = JSON.parse(JSON.stringify(teamsData));

export const addTeam = async (teamName: string) => {
    const exists = teams.some((t: any) => t.name === teamName);
    if (exists) return 403;
    teams.push({
        id: 'team-' + Date.now(),
        name: teamName,
        status: 'ACTIVE',
        joinCode:
            'MOCK-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        selectedMission: null,
        mission: null,
        members: [],
    });
    return 201;
};

export const getRole = async () => {
    return 'LEADER';
};

export const joinTeam = async (joinCode: string) => {
    const team = teams.find((t: any) => t.joinCode === joinCode);
    if (!team) return 404;
    if (team.members && team.members.length >= 5) return 403;
    return 201;
};

export const fetchCurrentTeam = async () => {
    return teams[0];
};

export const fetchAllTeams = async () => {
    return teams;
};

export const fetchTeamSubmissions = async (teamId: string) => {
    return [
        {
            eventName: 'Round 1',
            submissions: submissionsData,
        },
    ];
};

export const fetchTeamRoundSubmissions = async (
    eventId: string,
    teamId: string,
) => {
    return submissionsData;
};
