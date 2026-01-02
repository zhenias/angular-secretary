export interface GetMeSchoolTypes {
  id?: number,
  year?: string,
  name_school?: string,
  description_school?: string,
  rokDataPoczatek?: string,
  rokDataKoniec?: string,
}

export interface getMe {
  id?: number,
  user_name?: string;
  user_lastname?: string;
  full_user_name?: string;
  is_admin?: boolean | false;
  is_teacher?: boolean | false;
  is_student?: boolean | false;
  is_parent?: boolean | false;
  is_secretary?: boolean | false;
  is_pedagogue?: boolean | false;
  is_replacements?: boolean | false;
  is_director?: boolean | false;
  class?: string | null | undefined;
  permissions?: string | null | undefined;
  is_super?: boolean | false;
  school?: GetMeSchoolTypes | null,
}
