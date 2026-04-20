import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

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
  }
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@epolica.si" },
    update: {},
    create: {
      email: "admin@epolica.si",
      name: "Admin",
      password: adminPassword,
      role: Role.ADMIN
    }
  });

  const user = await prisma.user.upsert({
    where: { email: "uporabnik@epolica.si" },
    update: {},
    create: {
      email: "uporabnik@epolica.si",
      name: "Maja Bralka",
      password: userPassword,
      role: Role.USER
    }
  });

  for (const book of books) {
    await prisma.book.upsert({
      where: { id: `seed-${book.title}` },
      update: book,
      create: {
        id: `seed-${book.title}`,
        ...book
      }
    });
  }

  const createdBooks = await prisma.book.findMany({
    orderBy: { createdAt: "asc" }
  });

  await prisma.review.upsert({
    where: {
      userId_bookId: {
        userId: admin.id,
        bookId: createdBooks[0].id
      }
    },
    update: {
      rating: 5,
      comment: "Odlicen tempo in zelo dobra atmosfera.",
      approved: true
    },
    create: {
      userId: admin.id,
      bookId: createdBooks[0].id,
      rating: 5,
      comment: "Odlicen tempo in zelo dobra atmosfera.",
      approved: true
    }
  });

  await prisma.review.upsert({
    where: {
      userId_bookId: {
        userId: user.id,
        bookId: createdBooks[1].id
      }
    },
    update: {
      rating: 4,
      comment: "Poeticno napisano, mestoma nekoliko pocasnejse.",
      approved: true
    },
    create: {
      userId: user.id,
      bookId: createdBooks[1].id,
      rating: 4,
      comment: "Poeticno napisano, mestoma nekoliko pocasnejse.",
      approved: true
    }
  });
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

