## 🧑‍💻 Autor

Projekt stworzony przez **Jakub Pakuła** w ramach zaliczenia zajęć.

# ClubSpace 🚀

**ClubSpace** to nowoczesna aplikacja społecznościowa, która pozwala użytkownikom na łączenie się w grupy tematyczne, wymianę wiadomości oraz eksplorację wspólnych zainteresowań. Stworzona z myślą o łatwym dostępie, interaktywności i wygodzie użytkownika.

## Spis treści

- [Funkcjonalności](#funkcjonalności)
- [Technologie](#technologie)

## Funkcjonalności

### Operacje CRUD

- **Użytkownicy:**
  - Rejestracja i logowanie (JWT)
  - Edycja profilu
  - Usuwanie konta
- **Grupy:**
  - Tworzenie grup
  - Dołączanie do grup
  - Usuwanie grup
- **Posty:**
  - Dodawanie postów
  - Przeglądanie postów
  - Polubienia postów

### Komunikacja w czasie rzeczywistym

- **WebSocket:**
  - Chat w czasie rzeczywistym
  - System pokojów czatu
- **MQTT:**
  - Powiadomienia o nowych postach
  - Subskrypcja/unsubskrypcja grup

### Wyszukiwanie

- Wyszukiwanie grup według wzorca (RESTful)
- Filtrowanie grup po nazwie i opisie

### Role i uprawnienia

- Owner (właściciel grupy)
- Member (członek)
- Różne poziomy dostępu do funkcjonalności

### Bezpieczeństwo

- JWT do autoryzacji
- Szyfrowanie haseł (bcrypt)
- Zabezpieczenie endpointów
- Walidacja danych

## Technologie

- Next.js
- PostgreSQL
- MQTT
- WebSocket
- JWT
- bcrypt
