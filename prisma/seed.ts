import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const books = [
  {
    title: "Senca med policami",
    author: "Nika Sever",
    description:
      "Napeta sodobna drama o knjiznici, skrivnostnem dnevniku in mestu, ki pozablja lastno zgodovino.",
    content: `Prvo poglavje se odpre v tihi citalnici, kjer Lara odkrije rokopis brez avtorja.

Vsaka naslednja stran razkrije vec kot le zgodbo: prikazuje pozabljene odnose, prekinjene obljube in zemljevid neizgovorjenih skrivnosti. Branje postane preiskava.

Ko se v mestu zacnejo pojavljati ljudje iz njene preteklosti, Lara spozna, da knjiga ni nakljucje, ampak opozorilo.`,
    coverImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80",
    publisher: "Mestna zalozba",
    publishedDate: "2024",
    pageCount: 280,
    categories: ["drama", "skrivnost"]
  },
  {
    title: "Atlas tihih oceanov",
    author: "Miha Kovac",
    description:
      "Liricen roman o raziskovanju sveta, spomina in notranjih pokrajin skozi dnevnik pomorscaka.",
    content: `Morje v tem romanu ni prostor, temvec znacaj. Vsak pristan prinese novo izgubo in novo moznost.

Glavni junak zapisuje poti, ki jih ni mogoce najti na nobenem zemljevidu. Med valovi se vraca k ljudem, ki jih je pustil na kopnem.

Knjiga raziskuje, kako dalec lahko clovek odpluje, preden mora koncno pogledati vase.`,
    coverImage:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80",
    publisher: "Obzorja",
    publishedDate: "2022",
    pageCount: 336,
    categories: ["roman", "potopis"]
  },
  {
    title: "Mesto iz papirja in dezja",
    author: "Eva Marin",
    description:
      "Magicni realizem, postavljen v mesto, kjer se zgodbe materializirajo ob prvem jesenskem dezju.",
    content: `Ko zacne dezevati, se na tlakovanih ulicah pojavijo prizori iz knjig, ki jih prebivalci nikoli niso prebrali do konca.

Mlada urednica Jana mora ugotoviti, zakaj se nekatere zgodbe ponavljajo in zakaj ena izmed njih natancno opisuje njeno prihodnost.

Roman zdruzuje intimno pripoved in fantasticno atmosfero v zgodbi o izbiri, spominu in jeziku.`,
    coverImage:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",
    publisher: "Aurora",
    publishedDate: "2023",
    pageCount: 304,
    categories: ["fantazija", "roman"]
  },
  {
    title: "Programerjev dnevnik",
    author: "Luka Novak",
    description:
      "Preprost prirocnik skozi prve projekte, napake in majhne zmage pri ucenju programiranja.",
    content: `Dnevniski zapisi sledijo dijaku, ki zgradi svojo prvo aplikacijo in se pri tem nauci osnov nacrtovanja, testiranja in vztrajnosti.

Vsako poglavje zakljuci majhen izziv, ki bralca spodbuja k samostojnemu razmisljanju.`,
    coverImage:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    publisher: "Tehnicna zalozba",
    publishedDate: "2025",
    pageCount: 210,
    categories: ["tehnologija", "ucenje"]
  },
  {
    title: "Zadnja postaja sever",
    author: "Sara Vidmar",
    description:
      "Kratek pustolovski roman o vlaku, izgubljenem pismu in prijateljstvu med neznanci.",
    content: `Na zadnjem nocnem vlaku se sreca pet potnikov, ki jih poveze pismo brez naslova.

Pot proti severu razkrije, da ima vsak od njih razlog, da ne zeli prispeti prehitro.`,
    coverImage:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80",
    publisher: "Modra knjiga",
    publishedDate: "2021",
    pageCount: 248,
    categories: ["pustolovscina", "roman"]
  },
  {
    title: "Kuhinja spominov",
    author: "Tina Kralj",
    description:
      "Topla druzinska pripoved, v kateri recepti povezujejo tri generacije in njihove odlocitve.",
    content: `Vsak recept v stari beleznici odpre poglavje iz preteklosti.

Ko se druzina ponovno zbere, morajo skupaj ugotoviti, katere zgodbe so vredne ohranitve in katere je treba odpustiti.`,
    coverImage:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    publisher: "Domus",
    publishedDate: "2020",
    pageCount: 192,
    categories: ["druzina", "drama"]
  },
  {
    title: "Skrivnost starega mostu",
    author: "Marko Zupan",
    description:
      "Mladinski detektivski roman o skupini prijateljev, ki med pocitnicami odkrijejo pozabljeno mestno skrivnost.",
    content: `Ko se pod starim mostom pojavi zaklenjena kovinska skatla, se poletne pocitnice spremenijo v raziskovanje.

Prijatelji sledijo namigom po mestu, intervjuvajo stare prebivalce in sestavljajo zgodbo, ki je nihce vec ne omenja.

Na koncu ugotovijo, da skrivnost ni samo v skatli, ampak v odlocitvah ljudi, ki so jo skrili.`,
    coverImage:
      "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1200&q=80",
    publisher: "Mladika",
    publishedDate: "2024",
    pageCount: 224,
    categories: ["mladinski roman", "detektivka"]
  },
  {
    title: "Osnove spletnega razvoja",
    author: "Nejc Hribar",
    description:
      "Pregleden uvod v HTML, CSS, JavaScript in izdelavo preprostih spletnih aplikacij.",
    content: `Knjiga vodi bralca od prve HTML strani do urejene in odzivne spletne aplikacije.

Vsako poglavje vsebuje kratek primer, razlago in nalogo za utrjevanje znanja.

Poseben poudarek je na razumljivi strukturi, cisti kodi in osnovah uporabniske izkusnje.`,
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    publisher: "Kodeks",
    publishedDate: "2025",
    pageCount: 268,
    categories: ["tehnologija", "programiranje"]
  },
  {
    title: "Vrt za hiso",
    author: "Petra Lah",
    description:
      "Mirna pripoved o sosedih, vrtu in majhnih spremembah, ki pocasi povezejo skupnost.",
    content: `Za zapusceno hiso se skriva vrt, ki ga nihce vec ne obdeluje.

Ko ga skupina sosedov zacne urejati, se med njimi razvijejo pogovori, ki jih prej niso znali zaceti.

Roman govori o potrpezljivosti, vsakdanjih skrbeh in majhnih dejanjih, ki spremenijo okolje.`,
    coverImage:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80",
    publisher: "Zelena veja",
    publishedDate: "2021",
    pageCount: 176,
    categories: ["roman", "druzina"]
  },
  {
    title: "Pot skozi meglo",
    author: "Alen Robic",
    description:
      "Kratka pustolovska zgodba o planinski poti, izgubljenem zemljevidu in zaupanju med sopotniki.",
    content: `Megla se spusti hitreje, kot je skupina pricakovala.

Ko ugotovijo, da zemljevid ni vec zanesljiv, se morajo zanesti drug na drugega in na znanje, ki so ga prej jemali premalo resno.

Zgodba je napeta, a ostaja preprosta pripoved o odgovornosti in sodelovanju.`,
    coverImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    publisher: "Planinska zalozba",
    publishedDate: "2023",
    pageCount: 156,
    categories: ["pustolovscina", "mladinski roman"]
  }
];

const demoUsers = [
  {
    email: "bralka.ana@epolica.si",
    name: "Ana Bralka"
  },
  {
    email: "bralec.luka@epolica.si",
    name: "Luka Bralec"
  },
  {
    email: "mentor@epolica.si",
    name: "Mentor"
  }
];

const reviewSeed = [
  { userEmail: "admin@epolica.si", bookTitle: "Senca med policami", rating: 5, comment: "Odlicen tempo in zelo dobra atmosfera." },
  { userEmail: "uporabnik@epolica.si", bookTitle: "Senca med policami", rating: 4, comment: "Zanimiva zgodba in prepricljiv konec." },
  { userEmail: "bralka.ana@epolica.si", bookTitle: "Atlas tihih oceanov", rating: 4, comment: "Poeticno napisano, mestoma nekoliko pocasnejse." },
  { userEmail: "bralec.luka@epolica.si", bookTitle: "Atlas tihih oceanov", rating: 5, comment: "Lepa pripoved in mocni opisi morja." },
  { userEmail: "mentor@epolica.si", bookTitle: "Mesto iz papirja in dezja", rating: 5, comment: "Izvirna ideja in dobra zgradba poglavij." },
  { userEmail: "uporabnik@epolica.si", bookTitle: "Mesto iz papirja in dezja", rating: 4, comment: "Prijetno branje z zanimivo atmosfero." },
  { userEmail: "admin@epolica.si", bookTitle: "Programerjev dnevnik", rating: 4, comment: "Koristno za zacetnike in jasno razlozeno." },
  { userEmail: "bralka.ana@epolica.si", bookTitle: "Programerjev dnevnik", rating: 3, comment: "Dobro osnovno branje, lahko bi bilo vec primerov." },
  { userEmail: "bralec.luka@epolica.si", bookTitle: "Zadnja postaja sever", rating: 4, comment: "Kratko, tekoce in napeto." },
  { userEmail: "mentor@epolica.si", bookTitle: "Zadnja postaja sever", rating: 3, comment: "Solidna zgodba, a liki bi lahko bili bolj razviti." },
  { userEmail: "admin@epolica.si", bookTitle: "Kuhinja spominov", rating: 4, comment: "Topla in enostavno berljiva knjiga." },
  { userEmail: "uporabnik@epolica.si", bookTitle: "Kuhinja spominov", rating: 5, comment: "Zelo prijetna druzinska pripoved." },
  { userEmail: "bralka.ana@epolica.si", bookTitle: "Skrivnost starega mostu", rating: 5, comment: "Napeto in primerno za mlajse bralce." },
  { userEmail: "bralec.luka@epolica.si", bookTitle: "Skrivnost starega mostu", rating: 4, comment: "Dobri namigi in zanimiv razplet." },
  { userEmail: "mentor@epolica.si", bookTitle: "Osnove spletnega razvoja", rating: 5, comment: "Zelo uporabno za uvod v spletno programiranje." },
  { userEmail: "admin@epolica.si", bookTitle: "Osnove spletnega razvoja", rating: 4, comment: "Jasno razlozeno in dobro strukturirano." },
  { userEmail: "uporabnik@epolica.si", bookTitle: "Vrt za hiso", rating: 4, comment: "Mirna, prijetna zgodba z lepo mislijo." },
  { userEmail: "bralka.ana@epolica.si", bookTitle: "Vrt za hiso", rating: 3, comment: "Lepo napisano, vendar pocasnejse." },
  { userEmail: "bralec.luka@epolica.si", bookTitle: "Pot skozi meglo", rating: 4, comment: "Kratko in napeto branje." },
  { userEmail: "mentor@epolica.si", bookTitle: "Pot skozi meglo", rating: 5, comment: "Dobra zgodba o sodelovanju in odgovornosti." }
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@epolica.si" },
    update: {
      name: "Admin",
      password: adminPassword,
      role: "ADMIN"
    },
    create: {
      email: "admin@epolica.si",
      name: "Admin",
      password: adminPassword,
      role: "ADMIN"
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "uporabnik@epolica.si" },
    update: {
      name: "Maja Bralka",
      password: userPassword,
      role: "USER"
    },
    create: {
      email: "uporabnik@epolica.si",
      name: "Maja Bralka",
      password: userPassword,
      role: "USER"
    }
  });

  const extraUsers = await Promise.all(
    demoUsers.map((demoUser) =>
      prisma.user.upsert({
        where: { email: demoUser.email },
        update: {
          name: demoUser.name,
          password: userPassword,
          role: "USER"
        },
        create: {
          email: demoUser.email,
          name: demoUser.name,
          password: userPassword,
          role: "USER"
        }
      })
    )
  );

  for (const book of books) {
    const data = {
      ...book,
      categories: JSON.stringify(book.categories)
    };

    await prisma.book.upsert({
      where: { id: `seed-${book.title}` },
      update: data,
      create: {
        id: `seed-${book.title}`,
        ...data
      }
    });
  }

  const createdBooks = await prisma.book.findMany();
  const seedUsers = [admin, user, ...extraUsers];
  const booksByTitle = new Map(createdBooks.map((book) => [book.title, book]));
  const usersByEmail = new Map(seedUsers.map((seedUser) => [seedUser.email, seedUser]));

  for (const review of reviewSeed) {
    const reviewUser = usersByEmail.get(review.userEmail);
    const reviewBook = booksByTitle.get(review.bookTitle);

    if (!reviewUser || !reviewBook) {
      continue;
    }

    await prisma.review.upsert({
      where: {
        userId_bookId: {
          userId: reviewUser.id,
          bookId: reviewBook.id
        }
      },
      update: {
        rating: review.rating,
        comment: review.comment,
        approved: true
      },
      create: {
        userId: reviewUser.id,
        bookId: reviewBook.id,
        rating: review.rating,
        comment: review.comment,
        approved: true
      }
    });
  }

  const [usersCount, booksCount, reviewsCount] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.review.count()
  ]);

  console.log(
    `Seed complete: ${usersCount} users, ${booksCount} books, ${reviewsCount} reviews.`
  );

  if (usersCount < 5 || booksCount < books.length || reviewsCount < reviewSeed.length) {
    throw new Error(
      `Seed failed: expected at least 5 users, ${books.length} books and ${reviewSeed.length} reviews.`
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

