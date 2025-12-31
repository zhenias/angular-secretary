import { secretariatApi } from '../api/secretariatApi';

export interface WycieczkaTypes {
  name: string,
  cel: string | null,
  trasa: string | null,
  srodek_transportu: string | null,
  owner: string,
  date: string,
  created_at: string,
  status: string,
  uczniowie: string[],
  opiekunowie: string[]
}

export const getWycieczki = async (): Promise<WycieczkaTypes[]> => {
  return await secretariatApi.get(
    `/School/Wycieczki`,
  );
};
