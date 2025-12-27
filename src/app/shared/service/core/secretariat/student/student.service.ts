import { secretariatApi } from '../../api/secretariatApi';
import {StudentInfo} from '../../../../../features/Student/students.types';

export const getStudent = async (userId: number): Promise<StudentInfo> => {
  return await secretariatApi.get(
    `/School/Students/${userId}`,
  );
};

export const updateStudent = async (userId: number, payload: any): Promise<StudentInfo> => {
  return await secretariatApi.post(
    `/School/Students/${userId}`,
    payload
  );
};
