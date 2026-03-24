import * as z from 'zod';

export const EventSchema = z.object({
    id: z.string(),
    name: z.string().min(3),
    description: z.string(),
    startTime: z.string(),
    requirements: z.array(
        z.object({
            id: z.string(),
            name: z.string().min(1, 'Requirement name is required'),
            type: z.string().min(1, 'Type is required(File Extension)'),
        }),
    ),
});

export type Event = z.infer<typeof EventSchema>;

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().nullable(),
    createdAt: z.number(),
    updatedAt: z.number(),
});

export const ParticipantSchema = z.object({
    id: z.string(),
    userId: z.string(),
    teamId: z.string(),
    role: z.enum(['LEADER', 'MEMBER', 'MAIDENLESS']),
    status: z.enum(['ACTIVE', 'BANNED', 'INACTIVE']),
    user: UserSchema,
    team: z.object({
        id: z.string(),
        name: z.string(),
        status: z.enum(['ACTIVE', 'ELIMINATED', 'DISQUALIFIED']),
        joinCode: z.string(),
    }),
    submissions: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            url: z.string(),
            memberId: z.string(),
            reqId: z.string(),
        }),
    ),
});
export type Participant = z.infer<typeof ParticipantSchema>;

export const MissionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.optional(z.string()),
    documentName: z.string(),
});

export type Mission = z.infer<typeof MissionSchema>;
export type CreateMissionInput = Omit<Mission, 'id'>;

export const MemberSchema = z.object({
    id: z.string(),
    userId: z.string(),
    teamId: z.string().nullable(),
    role: z.enum(['LEADER', 'MEMBER', 'MAIDENLESS']),
    status: z.enum(['ACTIVE', 'BANNED', 'INACTIVE']),
    user: UserSchema.optional(),
});

export type Member = z.infer<typeof MemberSchema>;

export const TeamSchema = z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(['ACTIVE', 'ELIMINATED', 'DISQUALIFIED']),
    joinCode: z.string(),
    selectedMission: z.string().nullable(),
    mission: MissionSchema.nullable().optional(),
    members: z.array(MemberSchema).optional(),
});

export type Team = z.infer<typeof TeamSchema>;

export const RequirementSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    eventId: z.string(),
})

export type Requirement = z.infer<typeof RequirementSchema>

export const SubmissionSchema = z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    memberId: z.string(),
    member: MemberSchema.optional(),
    reqId: z.string(),
});

export type Submission = z.infer<typeof SubmissionSchema>
