export interface CreateStudent {
  user_name?: string,
  user_lastname?: string,
  email?: string,
  pesel?: number,
  data_urodzenia?: string,
  adres_zamieszkania?: string,
  adres_zameldowania?: string,
  typ_nauczania?: string,
  plec?: number,
}

export interface UnitInterface {
  id: number,
  name: string,
  short: string,
  maxLevel: number,
}

export interface ClassInfo {
  id?: number,
  class: string,
  symbol: string,
  level: number,
  unit: UnitInterface,
  year?: string
}

export interface StateSchool {
  id: number,
  id_number: number,
  w_klasie_od: string,
  full_user_name: string,
  data_skreslenia: string,
  powod_skreslenia: string,
  data_dodania: string,
  class: ClassInfo
}

export interface StudentInfo {
  id?: number,
  user_name?: string,
  user_lastname?: string,
  full_user_name?: string,
  is_student?: boolean,
  is_parent?: boolean,
  class?: ClassInfo,
  pesel?: number | null,
  data_urodzenia?: string,
  adres_zamieszkania?: string | null,
  adres_zameldowania?: string | null,
  email?: string | null,
  login?: string,
  alias?: string | null,
  data_rejestracji?: string,
  is_active?: boolean,
  is_zsk?: boolean,
  is_ni?: boolean,
  numer_telefonu?: number,
  plec?: number,
  gender?: string,
}

export interface SPE {
  user?: string,
  year?: number,
  year2?: number,
  cele_pracy?: string,
  metody_pracy?: string,
  dostosowania?: string,
  inne_informacje?: string,
  is_share?: number,
  status?: string,
  date?: string,
  user_add?: string,
}

export interface Parents {
  name?: string,
  login?: string,
  level?: string,
  date?: string,
  plec?: string,
  user_id?: number,
}
