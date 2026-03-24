import type { CreateMissionInput, Mission } from '@/types/types';
import missionsData from '@/mock/missions.json';
import stateData from '@/mock/state.json';

let missions: Array<Mission> = JSON.parse(JSON.stringify(missionsData));
let currentState = { ...stateData };

export const fetchMissions = async () => {
    return missions;
};

export const createMission = async (input: CreateMissionInput) => {
    const newMission: Mission = { id: 'mis-' + Date.now(), ...input };
    missions.push(newMission);
    return newMission;
};

export const deleteMission = async (missionId: string) => {
    missions = missions.filter((m) => m.id !== missionId);
    return { ok: true };
};

export const updateMission = async (mission: Mission) => {
    missions = missions.map((m) => (m.id === mission.id ? mission : m));
    return mission;
};

export const getCurrentMission = async () => {
    return {
        psId: currentState.currentMissionId,
        role: 'LEADER',
    };
};

export const setCurrentMission = async (missionId: string) => {
    currentState.currentMissionId = missionId;
};
