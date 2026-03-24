import { compareAsc, parse } from 'date-fns';
import type { Event } from '@/types/types';
import eventsData from '@/mock/events.json';
import stateData from '@/mock/state.json';

let events: Array<Event> = JSON.parse(JSON.stringify(eventsData));
let currentState = { ...stateData };

export const fetchCurrentEvent = async () => {
    return { activeEventId: currentState.activeEventId };
};

export const setCurrentEvent = async (eventId: string) => {
    currentState.activeEventId = eventId;
};

export const fetchEvents = async (): Promise<Array<Event>> => {
    const referenceDate = new Date();
    return [...events].sort((a, b) => {
        const dateA = parse(a.startTime, 'HH:mm', referenceDate);
        const dateB = parse(b.startTime, 'HH:mm', referenceDate);
        return compareAsc(dateA, dateB);
    });
};

export const upsertEvents = async (data: Array<Event>) => {
    events = data;
    return { ok: true };
};

export const uploadFile = async (
    file: File,
    participantId: string,
    teamId: string,
    eventId: string,
    reqId: string,
) => {
    return {
        id: 'sub-' + Date.now(),
        name: file.name,
        url: '#',
        memberId: participantId,
        reqId: reqId,
    };
};
