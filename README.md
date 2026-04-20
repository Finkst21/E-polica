# E-polica

Sodobna in odzivna spletna aplikacija za branje, ocenjevanje in upravljanje knjig, zgrajena z `Next.js App Router`, `TypeScript`, `Tailwind CSS`, `Prisma`, `PostgreSQL`, `Auth.js`, `Recharts` in komponentami v slogu `shadcn/ui`.

## Funkcionalnosti

- registracija in prijava uporabnikov z `Credentials` prijavo in sifriranjem gesel prek `bcryptjs`
- javni katalog knjig z iskanjem, filtriranjem, branjem vsebine in prikazom povprecne ocene
- ocenjevanje knjig, komentarji in moderiranje ocen
- razsirjen admin panel z vizualizacijami, preglednicami, filtriranjem in sortiranjem
- rocno emailing sporocil iz admin panela ter avtomatski emaili ob registraciji in odobritvi ocene
- uvoz knjig v bazo prek `.csv`, `.xls` ali `.xlsx`
- izvoz PDF porocil za knjige, uporabnike in ocene
- zunanja dopolnitev podatkov knjig prek Google Books API
- temni in svetli nacin

## Zagon

1. Ustvari `.env` datoteko na podlagi `.env.example`.
2. Namesti odvisnosti:

```bash
npm install
```

3. Ustvari migracijo in posodobi bazo:

```bash
npx prisma migrate dev
```

4. Zazeni seed:

```bash
npm run seed
```

5. Zazeni razvojni streznik:

```bash
npm run dev
```

## Privzeti uporabniki iz seed skripte

- `admin@epolica.si` / `admin123`
- `uporabnik@epolica.si` / `user123`

## Ključne poti

- `/`
- `/books`
- `/books/[id]`
- `/login`
- `/register`
- `/admin`
- `/admin/books`
- `/admin/users`
- `/admin/analytics`
- `/admin/messages`
- `/admin/import-export`

## Okoljske spremenljivke

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `GOOGLE_BOOKS_API_KEY`

## Opombe

- naslovnica knjige se lahko doda prek URL-ja, nalaganja datoteke ali zunanjega API sync procesa
- admin poti so zascitene z `middleware.ts` in preverjanjem vloge `ADMIN`
- aplikacija uporablja server komponente, kjer je to smiselno, CRUD tokovi pa tecejo prek server actions
- ce SMTP ni nastavljen, se emaili ne posiljajo navzven, ampak se vseeno zabelezijo kot simulirani dogodki v bazi
