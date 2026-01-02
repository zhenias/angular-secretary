import {secretariatApi} from '../../api/secretariatApi';
import {StudentInfo, ClassInfo} from '../../../../../features/Student/students.types';

export interface GetStudentsClassTypes {
  class: ClassInfo,
  students: StudentInfo[],
}

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

export const getStudents = async (classId: number): Promise<GetStudentsClassTypes> => {
  return await secretariatApi.get(
    `/School/Classes/${classId}/Students`,
  );
};
