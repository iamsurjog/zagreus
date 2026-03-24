import { MdAccessTimeFilled, MdClose, MdFilePresent } from 'react-icons/md';
import { useForm } from '@tanstack/react-form';
import { createId } from '@paralleldrive/cuid2';
import { Modal } from '../common/Modal';
import type { Event } from '@/types/types';

export default function EventCard({
    event,
    onSelect,
    onUpdate,
    isActive,
}: {
    event: Event;
    onUpdate: (updated: Event) => void;
    onSelect: (id: string) => void;
    isActive: boolean;
}) {
    const editForm = useForm({
        defaultValues: event,
        onSubmit: ({ value }) => {
            onUpdate(value);
        },
    });

    return (
        <div
            onClick={() => !isActive && onSelect(event.id)}
            className={`p-3 flex flex-col justify-between gap-3 
            bigger-corners border-dashed border group
            hover:border-primary hover:before:scale-x-103 hover:before:scale-y-105 hover:after:scale-x-103 hover:after:scale-y-105 hover:cursor-pointer
            transition-all before:transition-all after:transition-all
            ${isActive ? 'bg-secondary/40 border-accent' : 'bg-secondary/20  border-transparent'}`}
        >
            <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between">
                    <h2 className="font-bold uppercase font-title bg-clip-text title-gradient text-transparent text-5xl">
                        {event.name}
                    </h2>
                </div>
                <hr className="border-accent w-full" />
                <p>
                    <span className="text-primary text-xl">
                        Event Description:&nbsp;
                    </span>
                    {event.description}
                </p>
                <hr className="border-primary border-dashed w-full" />
                <h6 className="text-xl text-primary">
                    Submission Requirements
                </h6>
                {event.requirements.length === 0 && (
                    <span className="text-primary/40">No Requirements</span>
                )}
                <div className="flex flex-wrap gap-3">
                    {event.requirements.length !== 0 &&
                        event.requirements.map((req) => {
                            return (
                                <div
                                    key={req.id}
                                    className="flex gap-1 text-accent p-2 bg-secondary/20 w-fit"
                                >
                                    <MdFilePresent size={24} />
                                    {req.name}
                                    {req.type}
                                </div>
                            );
                        })}
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="text-primary flex items-center gap-1">
                    <MdAccessTimeFilled size={32} />
                    <h4 className="text-2xl">{event.startTime}</h4>
                </div>
                <Modal>
                    <Modal.Open
                        render={(open) => (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    open();
                                }}
                                className="scifi-button-secondary p-2 invisible group-hover:visible group-hover:block group-hover:motion-preset-focus-md"
                            >
                                Edit
                            </button>
                        )}
                    />
                    <Modal.Window>
                        {(close) => (
                            <form
                                name="editForm"
                                className="w-full flex flex-col gap-3 max-h-[90vh] overflow-y-auto"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    editForm.handleSubmit();
                                    close();
                                }}
                            >
                                <h1 className="uppercase font-title text-5xl font-bold tracking-widest">
                                    EDIT {event.name}
                                </h1>
                                <editForm.Field
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
                                <editForm.Field
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
                                <editForm.Field
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
                                                onBlur={field.handleBlur}
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
                                    <editForm.Subscribe
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
                                                            <editForm.Field
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
                                                            </editForm.Field>
                                                            <editForm.Field
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
                                                            </editForm.Field>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                editForm.removeFieldValue(
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
                                            editForm.pushFieldValue(
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
                                        Save
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
        </div>
    );
}
