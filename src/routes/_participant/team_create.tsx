import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { addTeam, getRole } from '@/api/teams';

export const Route = createFileRoute('/_participant/team_create')({
    component: RouteComponent,
});

function RouteComponent() {
    const [response, setResponse] = useState('None');
    const createTeamForm = useForm({
        defaultValues: {
            name: '',
        },
        onSubmit: ({ value }) => {
            createTeamForm.reset({
                name: '',
            });
            mutation.mutate(value.name);
        },
    });

    const mutation = useMutation({
        mutationFn: async (teamName: string) => {
            const code = await addTeam(teamName);
            if (code == 403) {
                setResponse('Exists');
            } else if (code == 201) {
                throw redirect({ to: '/dashboard' });
            }
        },
    });

    const roleMutation = useMutation({
        mutationFn: async () => {
            const role: string = await getRole();
            if (role != 'MAIDENLESS') {
                throw redirect({ to: '/dashboard' });
            }
        },
    });

    useEffect(() => {
        roleMutation.mutate();
    }, []);

    return (
        <div className="flex w-full items-center flex-col">
            <h1 className="font-bold text-background/80 text-[142px] tracking-[30%] font-title">
                GENESIS
            </h1>
            <div className="bg-background/80 border border-primary border-dashed modal-pointy-corners p-6 h-[334px] w-[851px] flex gap-6 flex-col">
                <h1 className="font-title font-bold text-5xl tracking-[30%]">
                    SQUAD CREATION
                </h1>
                <form
                    className="flex flex-col h-full justify-between"
                    name="createTeamForm"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        createTeamForm.handleSubmit();
                    }}
                >
                    <div className="flex flex-col gap-2.5">
                        <createTeamForm.Field
                            name="name"
                            children={(field) => (
                                <>
                                    <label className="font-sans form-label">
                                        {' '}
                                        Team Name{' '}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter team name (should be unique)"
                                        className="input-field"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) =>
                                            field.handleChange(e.target.value)
                                        }
                                    />
                                </>
                            )}
                        />
                        {response == 'Exists' && (
                            <p className="font-sans color-red-500">
                                Team Already Exists
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="scifi-button-primary w-full"
                    >
                        CREATE
                    </button>
                </form>
            </div>
        </div>
    );
}
