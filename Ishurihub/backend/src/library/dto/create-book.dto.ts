export class CreateBookDto {
  title: string;
  author: string;
  isbn?: string;
  category: string;
  quantity: number;
  available: number;
  location?: string;
  schoolId: string;
}
