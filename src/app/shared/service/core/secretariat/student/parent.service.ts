import {Parents} from '../../../../../features/Student/students.types';
import {secretariatApi} from '../../api/secretariatApi';

export const getParents = async (userId: number): Promise<Parents[]> => {
  return await secretariatApi.get(
    `/School/Students/${userId}/Parents`,
  );
};

export const createParent = async (userId: number, payload: any): Promise<any> => {
  return await secretariatApi.post(
    `/School/Students/${userId}/Parents`,
    payload
  );
};
