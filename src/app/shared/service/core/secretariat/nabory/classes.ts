import { secretariatApi } from '../../api/secretariatApi';
import {UnitInterface} from '../../../../../features/Student/students.types';

export interface createNaboryClassesInterface {
  level: number,
  symbol: string,
  id_jednostka: number,
}

export interface responseNaboryClassesInterface {
  id: number,
  level: number,
  symbol: string,
  id_jednostka: number,
  unit: UnitInterface,
  created_at: string,
}

interface ResponseErrorInterface {
  error: string
}

export const getNaboryClasses = async (): Promise<responseNaboryClassesInterface[]|[]> => {
  return await secretariatApi.get(
    `/School/Nabory/Classes`,
  );
};

export const getNaboryClass = async (id: number): Promise<responseNaboryClassesInterface> => {
  return await secretariatApi.get(
    `/School/Nabory/Classes/${id}`,
  );
};

export const createNaboryClass = async (body: createNaboryClassesInterface): Promise<responseNaboryClassesInterface|ResponseErrorInterface> => {
  return await secretariatApi.post(
    `/School/Nabory/Classes`,
    body
  );
};

export const updateNaboryClass = async (id: number, body: createNaboryClassesInterface): Promise<responseNaboryClassesInterface|ResponseErrorInterface> => {
  return await secretariatApi.patch(
    `/School/Nabory/Classes/${id}`,
    body
  );
};

export const deleteNaboryClass = async (id: number): Promise<ResponseErrorInterface|void> => {
  return await secretariatApi.delete(
    `/School/Nabory/Classes/${id}`,
  );
};
