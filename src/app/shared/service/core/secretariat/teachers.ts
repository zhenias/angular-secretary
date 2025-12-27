import {secretariatApi} from '../api/secretariatApi';

export default interface responseTeachersInterface {
  id: number,
  user_name: string,
  user_lastname: string,
  full_user_name: string,
  email: string,
  login: string,
  pesel: number,
  data_urodzenia: string,
  data_rejestracji: string,
  permissions: string,
  is_active: boolean | number,
  plec: number;
  is_admin: number | boolean;
  is_pedagogue: number | boolean;
  is_teacher: number | boolean;
  is_director: number | boolean;
  is_secretary: number | boolean;
  is_replacements: number | boolean;
  is_parent: boolean;
  is_student: boolean;
  alias: string;
  numer_telefonu: string | number;
  gender: string;
  deactivated_account?: number | boolean;
  expirens_account?: string | Date;
}

export interface TeacherViewInterface {
  id?: number;
  user_name?: string;
  user_lastname?: string;
  email?: string;
  pesel?: number | string;
  data_urodzenia?: string;
  plec?: number;
  is_admin?: number | boolean;
  is_pedagogue?: number | boolean;
  is_teacher?: number | boolean;
  is_director?: number | boolean;
  is_secretary?: number | boolean;
  is_replacements?: number | boolean;
  is_parent?: boolean;
  is_student?: boolean;
  is_active?: number | boolean;
  alias?: string;
  login?: string;
  numer_telefonu?: string | number;
  gender?: string;
}

export interface TeacherEditInterface {
  user_name?: string;
  user_lastname?: string;
  email?: string;
  pesel?: number | string;
  data_urodzin?: string;
  plec?: number;
  is_admin?: number;
  is_director?: number;
  is_pedagog?: number;
  is_sekretarz?: number;
  is_zastepstwa?: number;
  is_nauczyciel?: number;
  is_active?: number;
  is_2fa?: number;
}

export const getTeachers = async (
  perPage?: number,
  page?: number
): Promise<{
  data: responseTeachersInterface[],
  current_page: number,
  last_page: number,
  total: number,
}> => {
  return await secretariatApi.get(
    `/School/Teachers?per_page=${perPage}&page=${page}`,
  );
};

export const getTeacher = async (
  userId: number
): Promise<responseTeachersInterface> => {
  return await secretariatApi.get(
    `/School/Teachers/${userId}`,
  );
};

export const updateTeacher = async (
  userId: number,
  body: TeacherEditInterface
): Promise<responseTeachersInterface> => {
  return await secretariatApi.patch(
    `/School/Teachers/${userId}`,
    body
  );
};
