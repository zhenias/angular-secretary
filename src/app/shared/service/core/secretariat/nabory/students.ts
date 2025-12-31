import {secretariatApi} from '../../api/secretariatApi';
import {responseNaboryClassesInterface} from './classes';

export interface createNaboryStudentsInterface {
  status: 1|0,
  user_name: string,
  user_lastname: string,
  gender: 1|0|null,
  birthday?: string,
  pesel?: number,
  adres_zamieszkania?: string,
  adres_zameldowania?: string,
  phone_number?: string,
  email?: string,
  id_class_suggestion: number|null,
}

export interface responseNaboryStudentsInterface {
  id: number,
  status: 1|0,
  user_name: string,
  user_lastname: string,
  gender: 1|0,
  birthday?: string,
  pesel?: number,
  adres_zamieszkania?: string,
  adres_zameldowania?: string,
  phone_number?: string,
  email?: string,
  id_class_suggestion: number,
  id_school: number,
  class: responseNaboryClassesInterface,
  created_at: string,
}

interface ResponseErrorInterface {
  error: string
}

export const getNaboryStudents = async (): Promise<responseNaboryStudentsInterface[]|[]> => {
  return await secretariatApi.get(
    `/School/Nabory/Students`,
  );
};

export const getNaboryStudent = async (id: number): Promise<responseNaboryStudentsInterface> => {
  return await secretariatApi.get(
    `/School/Nabory/Students/${id}`,
  );
};

export const createNaboryStudent = async (body: createNaboryStudentsInterface): Promise<responseNaboryStudentsInterface|ResponseErrorInterface> => {
  return await secretariatApi.post(
    `/School/Nabory/Students`,
    body
  );
};

export const updateNaboryStudent = async (id: number, body: createNaboryStudentsInterface): Promise<responseNaboryStudentsInterface|ResponseErrorInterface> => {
  return await secretariatApi.patch(
    `/School/Nabory/Students/${id}`,
    body
  );
};

export const deleteNaboryStudent = async (id: number): Promise<ResponseErrorInterface|void> => {
  return await secretariatApi.delete(
    `/School/Nabory/Students/${id}`,
  );
};
