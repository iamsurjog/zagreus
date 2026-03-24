import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createId } from '@paralleldrive/cuid2';
import type { Event } from '@/types/types';
import { EventSchema } from '@/types/types';
import EventCard from '@/components/admin/EventCard';
import { Modal } from '@/components/common/Modal';
import {
    fetchCurrentEvent,
    fetchEvents,
    setCurrentEvent,
    upsertEvents,
} from '@/api/events';

export const Route = createFileRoute('/admin/eventflow')({
    component: RouteComponent,
});

function RouteComponent() {
    const [events, setEvents] = useState<Array<Event>>([]);
    const queryClient = useQueryClient();

    const { data: currentSystemState, isLoading: loadingState } = useQuery({
        queryKey: ['system-state'],
        queryFn: fetchCurrentEvent,
        staleTime: 1000 * 60 * 5,
    });

    const {
        data: initialEvents,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    useEffect(() => {
        if (initialEvents) {
            setEvents(initialEvents);
        }
    }, [initialEvents]);

    const newEventForm = useForm({
        defaultValues: {
            id: createId(),
            name: 'Round ' + events.length,
            description: '',
            startTime: '',
            requirements: [],
        } as Event,
        validators: {
            onChange: EventSchema,
        },
        onSubmit: ({ value }) => {
            setEvents((prev) => [...prev, value]);
            newEventForm.reset({
                id: createId(),
                name: 'Round ' + (events.length + 1),
                description: '',
                startTime: '',
                requirements: [],
            });
            console.log(value);
        },
    });

    const isDirty = JSON.stringify(initialEvents) !== JSON.stringify(events);

    const handleUpdateEvent = (updatedEvent: Event) => {
        setEvents((prev) =>
            prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
        );
    };

    const mutation = useMutation({
        mutationFn: async (updatedEvents: Array<Event>) => {
            console.log('🚀 SYSTEM OVERRIDE: COMMITTING TO DATABASE...');
            console.table(updatedEvents);
            await upsertEvents(updatedEvents);

            return { success: true };
        },
        onSuccess: (data) => {
            console.log('DATA STREAM SECURED', data);
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });

    const setActiveMutation = useMutation({
        mutationFn: async (eventId: string) => {
            await setCurrentEvent(eventId);
        },
        onMutate: async (newEventId) => {
            await queryClient.cancelQueries({ queryKey: ['system-state'] });
            const previousState = queryClient.getQueryData(['system-state']);
            queryClient.setQueryData(['system-state'], (old: any) => ({
                ...old,
                activeEventId: newEventId,
            }));
            return { previousState };
        },
        onError: (err, newEventId, context) => {
            queryClient.setQueryData(['system-state'], context?.previousState);
            console.error('Rollback triggered: System recalibration failed.');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['system-state'] });
        },
    });

    if (isLoading)
        return (
            <div>
                <span className="text-5xl font-bold text-accent">LOADING</span>
            </div>
        );
    if (isError)
        return (
            <div className="text-red-500 text-5xl">
                SYSTEM ERROR: UNABLE TO RETRIEVE FLOW
            </div>
        );

    const currentEvent = events.find(
        (event) => event.id === currentSystemState?.activeEventId,
    );

    return (
        <main className="p-6 flex flex-col gap-3 h-full">
            <div className="flex justify-between items-start">
                <h1 className="title-gradient bg-clip-text text-transparent font-bold uppercase text-7xl font-title">
                    Event Flow
                </h1>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => mutation.mutate(events)}
                        disabled={mutation.isPending || !isDirty}
                        className="scifi-button-primary disabled:opacity-70 disabled:hover:cursor-not-allowed"
                    >
                        {mutation.isPending
                            ? 'COMMITTING...'
                            : 'COMMIT CHANGES'}
                    </button>
                    <button
                        onClick={() => {
                            if (initialEvents) setEvents(initialEvents);
                        }}
                        disabled={!isDirty}
                        className="scifi-button-secondary"
                    >
                        Discard Changes
                    </button>
                </div>
            </div>
            <h2 className="text-2xl font-bold font-title text-primary">
                Current Event:{' '}
                {setActiveMutation.isPending || loadingState
                    ? 'Recalibrating...'
                    : currentEvent?.name || 'No Active Event'}
            </h2>
            <div className="grid grid-cols-3 gap-3 min-h-1/2">
                {events.length !== 0 &&
                    events.map((event, i) => {
                        return (
                            <EventCard
                                key={i}
                                event={event}
                                onUpdate={handleUpdateEvent}
                                onSelect={(id) => setActiveMutation.mutate(id)}
                                isActive={
                                    event.id ===
                                    currentSystemState?.activeEventId
                                }
                            />
                        );
                    })}
                <Modal>
                    <Modal.Open
                        render={(open) => (
                            <button
                                onClick={open}
                                className="flex justify-center items-center text-secondary p-6 bg-secondary/20 size-full
                                border-2 border-secondary border-dashed
                                hover:border-primary hover:cursor-pointer hover:text-primary hover:bg-secondary/40 transition-all"
                            >
                                <MdAdd size={48} />
                            </button>
                        )}
                    />

                    <Modal.Window>
                        {(close) => (
                            <form
                                name="newEventForm"
                                className="w-full flex flex-col gap-3 max-h-[90vh] overflow-y-auto"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    newEventForm.handleSubmit();
                                    close();
                                }}
                            >
                                <h1 className="uppercase font-title text-5xl font-bold tracking-widest">
                                    NEW EVENT
                                </h1>
                                <newEventForm.Field
                                    name="name"
                                    children={(field) => (
                                        <>
                                            <label className="form-label">
                                                Event Name
                                            </label>
                                            <input
                                                required
                                                className="input-field"
                                                placeholder="Enter Event Name(eg: Lunch Break or Round 1)"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {field.state.meta.errors.map(
                                                (error, i) => (
                                                    <div
                                                        key={i}
                                                        className="text-red-500"
                                                    >
                                                        {error?.message}
                                                    </div>
                                                ),
                                            )}
                                        </>
                                    )}
                                />
                                <newEventForm.Field
                                    name="description"
                                    children={(field) => (
                                        <>
                                            <label className="form-label">
                                                Event Description
                                            </label>
                                            <textarea
                                                required
                                                className="input-field resize-none"
                                                placeholder="Enter Description"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </>
                                    )}
                                />
                                <newEventForm.Field
                                    name="startTime"
                                    children={(field) => (
                                        <>
                                            <label className="form-label">
                                                Start Time
                                            </label>
                                            <input
                                                required
                                                type="time"
                                                className="input-field"
                                                value={field.state.value}
                                                onChange={(e) => {
                                                    field.handleChange(
                                                        e.target.value,
                                                    );
                                                }}
                                            />
                                        </>
                                    )}
                                />
                                <div className="flex flex-col gap-3 p-3 border border-secondary border-dashed hover:border-primary transition-colors">
                                    <label className="form-label">
                                        Submission Requirements
                                    </label>
                                    <newEventForm.Subscribe
                                        selector={(state) =>
                                            state.values.requirements
                                        }
                                        children={(requirements) => (
                                            <div className="flex flex-col gap-3 p-2">
                                                {requirements.map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex gap-3 justify-between"
                                                    >
                                                        <div className="flex gap-2">
                                                            <newEventForm.Field
                                                                name={`requirements[${i}].name`}
                                                            >
                                                                {(field) => (
                                                                    <input
                                                                        required
                                                                        placeholder="Requirement Name"
                                                                        className="input-field flex-1"
                                                                        value={
                                                                            field
                                                                                .state
                                                                                .value
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            field.handleChange(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </newEventForm.Field>
                                                            <newEventForm.Field
                                                                name={`requirements[${i}].type`}
                                                            >
                                                                {(field) => (
                                                                    <input
                                                                        required
                                                                        placeholder="Requirement Type (.pdf)"
                                                                        className="input-field flex-1"
                                                                        value={
                                                                            field
                                                                                .state
                                                                                .value
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            field.handleChange(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </newEventForm.Field>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                newEventForm.removeFieldValue(
                                                                    'requirements',
                                                                    i,
                                                                )
                                                            }
                                                            className="p-2 text-secondary hover:text-primary hover:cursor-pointer transition-colors"
                                                        >
                                                            <MdClose
                                                                size={24}
                                                            />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    />
                                    <button
                                        type="button"
                                        className="scifi-button-secondary p-2"
                                        onClick={() =>
                                            newEventForm.pushFieldValue(
                                                'requirements',
                                                {
                                                    id: createId(),
                                                    name: '',
                                                    type: '',
                                                },
                                            )
                                        }
                                    >
                                        Add Requirement
                                    </button>
                                </div>
                                <br />
                                <div className="w-full flex flex-row-reverse gap-3">
                                    <button
                                        type="submit"
                                        className="scifi-button-primary p-2"
                                    >
                                        Create
                                    </button>
                                    <button
                                        onClick={close}
                                        type="button"
                                        className="scifi-button-secondary p-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </Modal.Window>
                </Modal>
            </div>
        </main>
    );
}
