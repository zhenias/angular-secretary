Spoko, zrobię pełne, ludzkie README w **Markdown**, z opisami do zdjęć, bazując na ich nazwach i tym, co sugerują. Będzie przystępnie, z miniaturkami przy każdym punkcie, żeby od razu było wiadomo, co robi dana funkcja.

---

# Sekretariat e-Dziennika

Sekretariat to moduł wspierający zarządzanie uczniami, rodzicami i oddziałami w e-Dzienniku.

---

## Funkcje dostępne

### 1. Dodawanie i edycja uczniów

* Możesz tworzyć nowe konta uczniów i poprawiać istniejące dane.
* Obsługuje przypisywanie uczniów do klas i zarządzanie ich statusem (kandydaci bez klasy).
  ![Dodawanie/edycja ucznia](public/photo/edycja_ucznia.png)
* Przykładowe ekrany pokazujące wyszukiwanie ucznia i listę uczniów w oddziałach:
  ![Wyszukiwanie ucznia](public/photo/wyszukaj_ucznia.png)
  ![Lista uczniów w oddziale](public/photo/oddzialy_uczniowie.png)

---

### 2. Dodawanie i edycja rodziców / opiekunów

* Możesz dodawać nowych rodziców i powiązywać ich z uczniami.
* Obsługuje też wyświetlanie wszystkich opiekunów, zarówno powiązanych jak i niepowiązanych z uczniami.
  ![Dodawanie rodzica](public/photo/opiekunowie_rodzice_edycja.png)
  ![Lista opiekunów](public/photo/opiekunowie_rodzice.png)

---

### 3. Zarządzanie oddziałami i planami lekcji

* Przeglądanie oddziałów w jednostkach edukacyjnych.
* Wyświetlanie planu lekcji i listy uczniów przypisanych do oddziałów.
  ![Plan lekcji oddziału](public/photo/oddzialy_plan_lekcji.png)
  ![Lista uczniów w oddziale](public/photo/oddzialy_uczniowie.png)

---

### 4. Masowe operacje w oddziałach

* Dodawanie uczniów seryjnie.
* Usuwanie ocen, frekwencji i historii pobytu w szkole (np. przy przeniesieniach).
* Blokowanie dostępu do kont uczniów i rodziców.
  ![Seryjne dodawanie uczniów](public/photo/stara_ksiega_uczniow_dodawanie_uczniow_do_oddzialu.png)
  ![Przykład operacji masowych](public/photo/stare_ksiega_uczniow_menu_kontekstowe.png)

---

### 5. Przegląd historii i dokumentów uczniów

* Wyświetlanie rejestrów, np. kart rowerowych czy egzaminów.
* Przydatne do sprawdzania uczniów, rejestr kart rowerowych itp.
  ![Rejestry kart rowerowych](public/photo/rejestr_kart_rowerowych.png)
  ![Rejestr egzaminów](public/photo/rejestr_egzaminow.png)

---

### 6. Obsługa naborów i kandydatów

* Możliwość podglądu kandydatów na uczniów w jednostkach.
* Wyświetlanie statusów rekrutacji i zakończonych procesów.
  ![Nabory kandydatów](public/photo/nabory_kandydaci.png)
  ![Zakończone rekrutacje](public/photo/nabory_kandydaci_zakonczenie_rekrutacji.png)
  ![Oddziały i nabory](public/photo/nabory_oddzialy.png)

---

### 7. Pracownicy i zarządzanie kontami

* Przegląd listy pracowników i kont nauczycieli.
* W planach: edycja i usuwanie przydziałów.
  ![Lista pracowników](public/photo/pracownicy.png)

---

### 8. Resetowanie haseł i restrykcje logowania

* Resetowanie haseł dla uczniów i rodziców.
* Blokowanie dostępu w razie potrzeby.
  ![Resetowanie haseł](public/photo/resetowanie_hasla_rodzic_uczen.png)
  ![Restrykcja logowania](public/photo/restrykcja_logowania.png)
  ![Dodawanie restrykcji logowania](public/photo/restrykcja_logowania_dodaj.png)

---

## W planach do wdrożenia

1. Dodanie i usuwanie przydziałów nauczycielom.
2. Dodanie i usuwanie oddziałów oraz jednostek.
3. Rejestr uwag, DIU (dodatkowe informacje ucznia).
4. Kalendarz dni wolnych i planowanie wydarzeń szkolnych.
5. Rejestr wycieczek (tylko wgląd).
6. Wyświetlenie nieobecności oddziałów i nauczycieli jak z poziomu wpisu w zakładce nieobecności, jak i zarówno z planu lekcji.

później reszta :)

---

## Uruchomienie aplikacji

```bash
ng serve
```

---

## Logowanie

* Do e-Sekretariatu logujesz się za pomocą e-Dziennika.
* Link do e-Dziennika: [dziennik-szkola.online](https://dziennik-szkola.online)

---
