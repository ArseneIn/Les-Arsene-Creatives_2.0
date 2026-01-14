export interface Institution {
    id: string;
    name: string;
    slug: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInstitutionDto {
    name: string;
    slug: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
}

export type UpdateInstitutionDto = Partial<CreateInstitutionDto>;
