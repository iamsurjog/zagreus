import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateMissionInput, Mission } from '@/types/types';
import { createMission, updateMission } from '@/api/mission';

interface MissionFormProps {
    initialValues?: Mission;
    onSuccess: () => void;
    onCancel: () => void;
}

export function MissionForm({
    initialValues,
    onSuccess,
    onCancel,
}: MissionFormProps) {
    const queryClient = useQueryClient();
    const isEditing = !!initialValues;
    const upsertMutation = useMutation({
        mutationFn: async (value: CreateMissionInput) => {
            if (isEditing && initialValues.id) {
                return await updateMission({ id: initialValues.id, ...value });
            }
            return await createMission(value);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['missions'] });
            onSuccess();
        },
    });

    const form = useForm({
        defaultValues: {
            name: initialValues?.name ?? '',
            description: initialValues?.description ?? '',
            documentName: initialValues?.documentName ?? '',
        },
        onSubmit: async ({ value }) => {
            await upsertMutation.mutateAsync(value);
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
            }}
            className="flex flex-col gap-4"
        >
            <h1 className="uppercase font-title text-5xl font-bold tracking-widest">
                {isEditing ? 'UPDATE MISSION' : 'NEW MISSION'}
            </h1>

            <form.Field
                name="name"
                children={(field) => (
                    <div className="flex flex-col gap-1">
                        <label className="form-label">Mission Name</label>
                        <input
                            required
                            className="input-field"
                            placeholder="Enter Name of Mission"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />

            <form.Field
                name="description"
                children={(field) => (
                    <div className="flex flex-col gap-1">
                        <label className="form-label">Description</label>
                        <textarea
                            className="input-field"
                            placeholder="Enter Mission Description"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />

            <form.Field
                name="documentName"
                children={(field) => (
                    <div className="flex flex-col gap-1">
                        <label className="form-label">PDF Document Name</label>
                        <input
                            required
                            className="input-field"
                            placeholder="(eg: PS1.pdf)"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                        />
                    </div>
                )}
            />

            <div className="flex w-full flex-row-reverse gap-3 items-center mt-4">
                <button
                    type="submit"
                    disabled={upsertMutation.isPending}
                    className="scifi-button-primary"
                >
                    {upsertMutation.isPending
                        ? 'PROCESSING...'
                        : isEditing
                          ? 'Update'
                          : 'Create'}
                </button>

                <button
                    type="button"
                    className="scifi-button-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
