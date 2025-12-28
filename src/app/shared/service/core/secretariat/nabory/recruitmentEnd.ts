import {secretariatApi} from '../../api/secretariatApi';

export interface createNaboryEndInterface {
  year_school: number,
  classes: {
    classId: number,
    ownerId: number,
  }[],
  start_year: string,
  end_year: string,
  date_admission: string,
  enabled_usprawiedliwienia: boolean,
}

export interface responseNaboryStudentsInterface {
  string: number,
}

interface ResponseErrorInterface {
  errors: string[]
}

export const postNaboryEnd = async (body: createNaboryEndInterface): Promise<responseNaboryStudentsInterface|ResponseErrorInterface> => {
  return await secretariatApi.post(
    `/School/Nabory/End`,
    body
  );
};
