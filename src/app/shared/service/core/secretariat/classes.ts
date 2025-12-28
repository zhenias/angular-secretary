import {secretariatApi} from '../api/secretariatApi';
import {UnitInterface} from '../../../../features/Student/students.types';

export interface getClassesInterface {
  id: number,
  class: string,
  symbol: string,
  level: number,
  unit?: UnitInterface,
  year: string,
  year_one: number,
  is_oo: number,
  description: string | null,
  teacher_id: number,
  teacher: string,
  is_active_eusprawiedliwienia: boolean,
  date_start: string,
  date_end: string,
}

export interface CreateClassTypes {
  teacher: number,
  jednostki: number,
  odzial: number,
  name_class: string | null,
  rok_szkolny: number,
  kod: string
}

export interface EditClassTypes {
  teacher: number,
  odzial: number,
  name_class: string | null,
  kod: string,
  date_start?: string | null,
  date_end?: string | null,
  is_active_eusprawiedliwienia: boolean,
}

export const classes = async (): Promise<getClassesInterface[]> => {
  return await secretariatApi.get(
    `/School/Classes`,
  );
};

export const getClass = async (classId: number): Promise<getClassesInterface|{error: string}|any> => {
  return await secretariatApi.get(
    `/School/Classes/${classId}`,
  );
};

export const createClass = async (payload: CreateClassTypes): Promise<any> => {
  return await secretariatApi.post(
    `/School/Classes`,
    payload
  );
};

export const editClass = async (classId: number, payload: EditClassTypes): Promise<any> => {
  return await secretariatApi.patch(
    `/School/Classes/${classId}`,
    payload
  );
};
