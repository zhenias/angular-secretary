import type { StudentInfo } from '../../../../../features/Student/students.types';
import {secretariatApi} from '../../api/secretariatApi';

export interface ParentType {
  id: number,
  login: string,
  user_name: string,
  user_lastname: string,
  full_user_name: string,
  is_parent: boolean,
  is_student: boolean,
  is_active: boolean,
  gender: "K"|"M",
  student: StudentInfo
};

export interface BuildResponseType {
  data: ParentType[] | [],
  current_page: number,
  from: number,
  last_page: number,
  to: number,
  total: number,
  per_page: number,
  path: string | null,
  last_page_url: string | null,
  links: {
    url: string | null,
    label: string,
    active: boolean
  }[],
}

export const getParents = async (
  section: 'all'|'parents_with_students'|'parents_with_not_students',
  current_page: number = 1,
  per_page: number = 50,
): Promise<BuildResponseType> => {
  return await secretariatApi.get(
    `/School/Parents/${section}?page=${current_page}&per_page=${per_page}`,
  );
};

export const getParentsUpdateMassive = async (
  action: string,
  payload: any
): Promise<any> => {
  return await secretariatApi.post(
    `/School/Students/Update/${action}`,
    payload,
  );
};
