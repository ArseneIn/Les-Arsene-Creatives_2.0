export class CreateDisciplinePolicyDto {
  schoolId: string;
  name: string;
  type: string; // 'Merit' or 'Sanction'
  points: number;
  severity?: string;
  description?: string;
}

export class UpdateDisciplinePolicyDto {
  name?: string;
  type?: string;
  points?: number;
  severity?: string;
  description?: string;
}
