import {secretariatApi} from '../api/secretariatApi';
import {StudentInfo} from '../../../../features/Student/students.types';

export interface searchQuery {
  user_name?: string;
  user_lastname?: string;
  id_class?: string;
  year?: number;
  data_urodzin?: string;
  is_active?: number | boolean;
  plec?: 1 | 0;
  pesel?: number;
  email?: string;
  per_page?: number,
}


export interface BuildStudentInfo {
  data: StudentInfo[] | [],
  current_page: number,
  from: number,
  last_page: number,
  to: number,
  total: number,
  per_page: number,
  path: string | null,
  last_page_url: string | null,
}

const buildQuery = (params: searchQuery) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

export const searchStudents = async (query: searchQuery): Promise<BuildStudentInfo> => {
  const qs = buildQuery(query);

  return await secretariatApi.get(
    `/School/Classes/Students/Search${qs}`,
  );
};
