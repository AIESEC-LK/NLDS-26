declare module "@prisma/client" {
    export class PrismaClient {
        constructor(options?: any);
        $transaction(callback: (tx: any) => Promise<any>): Promise<any>;
        $disconnect(): Promise<void>;
        participant: any;
        registration: any;
        entity: any;
        initiativeGroup: any;
        document: any;
        admin: any;
        adminPermission: any;
        adminInvitation: any;
        adminAccessRequest: any;
        registrationReview: any;
        auditLog: any;
        participantSession: any;
        adminSession: any;
        oTPChallenge: any;
        externalSync: any;
        merchOrder: any;
    }
    export namespace Prisma {
        export type ParticipantCreateInput = any;
        export type RegistrationCreateInput = any;
        export type DocumentCreateWithoutRegistrationInput = any;
    }
    export type RegistrationStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "CANCELLED";
    export type MerchPaymentStatus = "PENDING_VERIFICATION" | "VERIFIED" | "REJECTED" | "CANCELLED";
}
