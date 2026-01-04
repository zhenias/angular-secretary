import {secretariatApi} from '../../api/secretariatApi';

export interface DIUTypes {
  user: string,
  year: number,
  year2: number,
  cele_pracy: string,
  metody_pracy: string,
  dostosowania: string,
  inne_informacje: string,
  is_share: string,
  status: string,
  date: string,
  user_add: string,
}

export const getDIUs = async (): Promise<DIUTypes[]> => {
  return await secretariatApi.get(
    `/School/DIU`,
  );
};
