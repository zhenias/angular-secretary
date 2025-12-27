import { secretariatApi } from '../api/secretariatApi';
import {UnitInterface} from '../../../../features/Student/students.types';

export interface getClassesInterface {
  id: number,
  class: string,
  symbol: string,
  level: number,
  unit: UnitInterface,
  year: string,
  is_oo: boolean|number,
}

export const classes = async (): Promise<getClassesInterface[]> => {
  return await secretariatApi.get(
    `/School/Classes`,
  );
};
