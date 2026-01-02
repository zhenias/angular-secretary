import {secretariatApi} from '../api/secretariatApi';

export interface DocumentTypes {
  id: number,
  name_document: string,
  type: string,
  html_template: string,
  user_id: number,
  user: string,
  is_editable: boolean,
}

export interface CreateDocumentTypes {
  name: string,
  name_document?: string | null,
  type: string,
  html_template: string,
}

export const getDokumenty = async (): Promise<DocumentTypes[]> => {
  return await secretariatApi.get(
    `/School/Document`,
  );
};

export const getDokument = async (documentId: number): Promise<DocumentTypes|{error: string}|any> => {
  return await secretariatApi.get(
    `/School/Document/${documentId}`,
  );
};

export const createDokument = async (payload: CreateDocumentTypes): Promise<any> => {
  return await secretariatApi.post(
    `/School/Document`,
    payload
  );
};

export const editDokument = async (documentId: number, payload: CreateDocumentTypes): Promise<any> => {
  return await secretariatApi.patch(
    `/School/Document/${documentId}`,
    payload
  );
};

export const deleteDokument = async (documentId: number): Promise<any> => {
  return await secretariatApi.delete(
    `/School/Document/${documentId}`,
  );
};
