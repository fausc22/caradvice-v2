export type FeaturedCar = {
  slug: string;
  title: string;
  version: string;
  year: number;
  km: number;
  priceArs: number;
  transmission: string;
  imageSrc: string;
};

export const featuredCars: FeaturedCar[] = [
  {
    slug: "toyota-corolla-2-0-se-g-cvt-l19",
    title: "Toyota Corolla",
    version: "2.0 SE-G CVT L19",
    year: 2021,
    km: 93000,
    priceArs: 37400000,
    transmission: "Manual",
    imageSrc: "/card-example.jpg",
  },
  {
    slug: "peugeot-2008-allure-1-6",
    title: "Peugeot 2008",
    version: "Allure 1.6",
    year: 2017,
    km: 189700,
    priceArs: 18000000,
    transmission: "Manual",
    imageSrc: "/card-example.jpg",
  },
  {
    slug: "volkswagen-t-cross-trendline-1-0t-at",
    title: "Volkswagen T-Cross",
    version: "Trendline 1.0T AT",
    year: 2026,
    km: 0,
    priceArs: 39500000,
    transmission: "Manual",
    imageSrc: "/card-example.jpg",
  },
  {
    slug: "ford-fiesta-kinetic-se-plus",
    title: "Ford Fiesta",
    version: "Kinetic SE Plus",
    year: 2018,
    km: 74200,
    priceArs: 16500000,
    transmission: "Manual",
    imageSrc: "/card-example.jpg",
  },
  {
    slug: "nissan-kicks-advance-cvt",
    title: "Nissan Kicks",
    version: "Advance CVT",
    year: 2020,
    km: 65400,
    priceArs: 27900000,
    transmission: "Manual",
    imageSrc: "/card-example.jpg",
  },
];
