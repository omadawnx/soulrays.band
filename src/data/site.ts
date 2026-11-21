import nextShowData from './next-show.json';
import showsData from './shows.json';
import tracksData from './tracks.json';

export const phone = '053-5762008';

export const members = [
  {
    name: 'אבירם אור איתן',
    bio: 'זמר ויוצר מקצרין, פזמונאי ומלחין קסמים',
    image: '/images/aviram.jpg',
  },
  {
    name: 'רמי אילן',
    bio: 'גיטריסט, יוצר ומלחין מפרוד, שפורט על הרגש',
    image: '/images/rami.jpg',
  },
  {
    name: 'תמר אפטר',
    bio: 'חלילנית הרים מכפר ורדים, מנגנת בשלל צבעים',
    image: '/images/tamar.jpg',
  },
];

export type Show = {
  date: string;
  place: string;
  href?: string;
  current?: boolean;
};

export const shows = showsData as Show[];

export const nextShow =
  nextShowData.enabled && nextShowData.src
    ? { src: nextShowData.src, alt: nextShowData.alt }
    : null;

export const photos = [
  { src: '/images/retreat.jpg', alt: 'קפה ריטריט' },
  { src: '/images/deeds.jpg', alt: 'יום המעשים הטובים' },
  { src: '/images/granik.jpg', alt: 'מתוך הופעה בגרניק בר' },
];

export const youtubeId = '1UyP9CfCrJk';

export type Track = {
  title: string;
  credit: string;
  src: string;
  lyrics: string[];
};

export const tracks = tracksData as Track[];
