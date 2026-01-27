import api from '../api/axios';
import type { Institution } from '../types/institution';

export const institutionService = {
    getAll: async (): Promise<Institution[]> => {
        const response = await api.get<Institution[]>('/institution');
        return response.data;
    },
};
