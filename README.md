# E-polica

Sodobna in odzivna spletna aplikacija za ocenjevanje in upravljanje knjig, zgrajena z `Next.js App Router`, `TypeScript`, `Tailwind CSS`, `Prisma`, `PostgreSQL`, `Auth.js`, `Recharts` in komponentami v slogu `shadcn/ui`.

## Funkcionalnosti

- registracija in prijava uporabnikov z `Credentials` prijavo in sifriranjem gesel prek `bcryptjs`
- javni katalog knjig z iskanjem, filtriranjem, branjem vsebine in prikazom povprecne ocene
- ocenjevanje knjig, komentarji in moderiranje ocen
- razsirjen admin panel z vizualizacijami, preglednicami, filtriranjem in sortiranjem
- rocno dodajanje, urejanje in brisanje knjig
- upravljanje uporabnikov in vlog
- temni in svetli nacin

## Zagon

1. Ustvari `.env.local` datoteko na podlagi `.env.example`.
2. Namesti odvisnosti:

```bash
npm install
```

3. Pripravi PostgreSQL bazo:

```bash
npm run db:setup
```

4. Zazeni razvojni streznik:

```bash
npm run dev
```

## Privzeti uporabniki iz seed skripte

- `admin@epolica.si` / `admin123`
- `uporabnik@epolica.si` / `user123`

## Kljucne poti

- `/`
- `/books`
- `/books/[id]`
- `/login`
- `/register`
- `/admin`
- `/admin/books`
- `/admin/users`
- `/admin/analytics`

## Okoljske spremenljivke

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`

## Deploy na Vercel

Za Vercel uporabi gostovano PostgreSQL bazo, na primer Vercel Postgres, Neon ali Supabase.

V Vercel projektu nastavi:

- `DATABASE_URL`: povezava do gostovane PostgreSQL baze
- `AUTH_SECRET`: dolga nakljucna vrednost
- `AUTH_URL`: URL tvoje Vercel aplikacije, na primer `https://ime-projekta.vercel.app`

Build command v Vercelu nastavi na:

```bash
npm run vercel-build
```

Ta ukaz ustvari Prisma client, pripravi shemo v bazi, napolni zacetne knjige in nato zgradi aplikacijo.

## Opombe

- naslovnica knjige se lahko doda prek URL-ja ali nalaganja slike
- admin poti so zascitene z `middleware.ts` in preverjanjem vloge `ADMIN`
- aplikacija uporablja server komponente, kjer je to smiselno, CRUD tokovi pa tecejo prek server actions
