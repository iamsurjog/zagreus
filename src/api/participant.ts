import participantsData from '@/mock/participants.json';
import stateData from '@/mock/state.json';

let participants = JSON.parse(JSON.stringify(participantsData));

export const fetchParticipants = async () => {
    return participants;
};

export const fetchCurrentParticipant = async () => {
    return participants.find(
        (p: any) => p.id === stateData.currentParticipantId,
    );
};

export const kickParticipant = async (memberId: string) => {
    participants = participants.filter((p: any) => p.id !== memberId);
    return { ok: true };
};
