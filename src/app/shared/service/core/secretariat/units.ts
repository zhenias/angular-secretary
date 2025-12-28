import {secretariatApi} from '../api/secretariatApi';

export interface UnitTypes {
  id: number,
  name: string,
  short: string,
  maxLevel: number,
  is_active: boolean,
  type: string,
  kategoria_uczniow: string,
}

export const getUnits = async (): Promise<UnitTypes[]> => {
  return await secretariatApi.get(
    `/School/Units`,
  );
};
