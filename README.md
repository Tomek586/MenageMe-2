# 🛠️ ManagMe 

---

## 🔧 Jak uruchomić projekt lokalnie

### 1. Sklonuj repozytorium

```bash
git clone https://github.com/twoj-login/MenageMe-2.git
cd MenageMe-2
```

### 2. Zainstaluj zależności frontendowe

```bash
npm install
```

### 3. Uruchom aplikację frontend (Vite)

```bash
npm run dev
```

Domyślnie aplikacja uruchomi się na `http://localhost:5173`

---

### 4. Uruchom backend (miniapi)

```bash
cd src/miniapi
npm install
node index.js
```

Backend działa na porcie `http://localhost:3001`

---

## 👤 Przykładowi użytkownicy do logowania

| Login | Hasło | Rola      |
|-------|-------|-----------|
| admin | admin | admin     |
| dev   | dev   | developer |
| ops   | ops   | devops    |

---

> Dane użytkowników są mockowane – logowanie działa z wykorzystaniem JWT tokenu i lokalnego `miniapi`.
