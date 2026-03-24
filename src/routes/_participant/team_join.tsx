import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getRole, joinTeam } from '@/api/teams';

export const Route = createFileRoute('/_participant/team_join')({
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
            const code = await joinTeam(teamName);
            if (code == 403) {
                setResponse('403');
            } else if (code == 404) {
                setResponse('404');
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
            <h1 className="font-bold text-background/80 text-[112.5px] tracking-[30%] font-title">
                COMMUNION
            </h1>
            <div className="bg-background/80 border border-primary border-dashed modal-pointy-corners p-6 h-[334px] w-[851px] flex gap-6 flex-col">
                <h1 className="font-title font-bold text-5xl tracking-[30%]">
                    JOINING SQUAD
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
                                        Join Code{' '}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter Join Code"
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
                        {response == '404' && (
                            <p className="font-sans color-red-500">
                                Team Does Not Exists
                            </p>
                        )}
                        {response == '403' && (
                            <p className="font-sans color-red-500">Team Full</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="scifi-button-primary w-full"
                    >
                        JOIN
                    </button>
                </form>
            </div>
        </div>
    );
}
