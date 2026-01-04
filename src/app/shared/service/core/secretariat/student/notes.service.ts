import {secretariatApi} from '../../api/secretariatApi';

export interface NoteTypes {
  id: number,
  tresc: string,
  uczen: string,
  oddzial: string,
  user_id: number,
  dodal: string,
  punkty: string | null,
  kategoria: string,
  rodzaj: string, // HTML
  rodzaj_text: string, // TEXT
  dt: string,
}

export const getNotes = async (): Promise<NoteTypes[]> => {
  return await secretariatApi.get(
    `/School/Notes`,
  );
};
