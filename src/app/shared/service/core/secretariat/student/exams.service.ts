import {secretariatApi} from '../../api/secretariatApi';

export interface ExamTypes {
  id: number,
  name: string,
  result: string|number,
  student?: string,
  date: string,
  create: string,
}

export interface CreateExamTypes {
  user_id: number,
  nazwa: string,
  wynik: string|number,
}

export interface UpdateExamTypes {
  nazwa: string,
  wynik: string|number,
}

export const getExams = async (): Promise<ExamTypes[]> => {
  return await secretariatApi.get(
    `/School/Exams`,
  );
};

export const getExam = async (examId: number): Promise<ExamTypes> => {
  return await secretariatApi.get(
    `/School/Exams/${examId}`,
  );
};

export const createExam = async (payload: CreateExamTypes): Promise<any> => {
  return await secretariatApi.post(
    `/School/Exams`,
    payload
  );
};

export const updateExam = async (examId: number, payload: UpdateExamTypes): Promise<any> => {
  return await secretariatApi.patch(
    `/School/Exams/${examId}`,
    payload
  );
};

export const deleteExam = async (examId: number): Promise<any> => {
  return await secretariatApi.delete(
    `/School/Exams/${examId}`,
  );
};
