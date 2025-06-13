type Guest = {
    name: string;
    id: number;
    phone: string;
    email: string | null;
    createdAt: Date;
    updatedAt: Date;
    documentType: string;
    documentNumber: string;
    preferences: string | null;
    notes: string | null;
}