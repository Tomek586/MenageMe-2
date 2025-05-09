# ManagMe — Instrukcja uruchomienia i logowania

## Wymagania wstępne
- Node.js 
- MongoDB 
- Konto Google i utworzone OAuth Client ID (opcjonalnie)

## Konfiguracja

1. Sklonuj repozytorium i przejdź do katalogu:

   git clone https://github.com/Tomek586/MenageMe-2.git
   cd MenageMe-2

2. Stwórz plik backend/.env:

                PORT=3001
                MONGO_URI= <Twój_URI_do_MongoDB>
                JWT_SECRET= <Twój_klucz_JWT>
                REFRESH_SECRET= <Twój_klucz_refresh>
                GOOGLE_CLIENT_ID= <Twój_Google_Client_ID>
                GOOGLE_CLIENT_SECRET= <Twój_Google_Client_Secret>

    Stwórz plik .env w katalogu frontendu:
                
                VITE_GOOGLE_CLIENT_ID=<Twój_Google_Client_ID>

3. Uruchomienie frontendu

        cd frontend
        npm install
        npm run dev

4. Utworzenie konta admina 
        Otwórz mongo shell lub MongoDB Compass.

        W kolekcji users wstaw dokument:

                        {
                        email:        "admin@example.com",
                        firstName:    "Admin",
                        lastName:     "User",
                        passwordHash: "<hash bcrypt dla np. 'admin123'>",
                        role:         "admin"
                        }

                        Hash generujesz poleceniem: node -e "console.log(require('bcryptjs').hashSync('admin123',10))"

5. Logowanie

                Konto lokalne (pełne uprawnienia CRUD)
                    Email: admin@example.com
                    Hasło: admin123

6. Logowanie przez Google (rola guest — tylko odczyt)
    -W aplikacji kliknij Zaloguj z Google.
    -Wybierz konto Google.
    -Otrzymasz rolę guest (tylko odczyt).