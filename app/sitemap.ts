import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.folioapp.co.uk';

const FIRM_SLUGS = [
  'allen-overy-shearman', 'clifford-chance', 'freshfields', 'linklaters',
  'slaughter-and-may', 'herbert-smith-freehills', 'ashurst', 'hogan-lovells',
  'norton-rose-fulbright', 'travers-smith', 'macfarlanes', 'eversheds-sutherland',
  'cms', 'addleshaw-goddard', 'pinsent-masons', 'latham-watkins', 'kirkland-ellis',
  'davis-polk', 'skadden', 'sullivan-cromwell', 'weil-gotshal-manges', 'gibson-dunn',
  'cleary-gottlieb', 'fried-frank', 'ropes-gray', 'baker-mckenzie', 'jones-day',
  'mayer-brown', 'dla-piper', 'quinn-emanuel', 'paul-weiss', 'proskauer',
  'mishcon-de-reya', 'bird-bird', 'stewarts', 'bristows', 'simmons-simmons',
  'white-case', 'milbank', 'debevoise-plimpton', 'simpson-thacher', 'willkie-farr',
  'sidley-austin', 'goodwin-procter', 'dechert', 'covington-burling',
  'bclp', 'reed-smith', 'clyde-co', 'taylor-wessing', 'watson-farley-williams',
  'kennedys', 'morrison-foerster', 'winston-strawn', 'cooley',
];

const PRIMER_SLUGS = [
  'mergers-and-acquisitions', 'capital-markets', 'banking-and-finance',
  'energy-and-technology', 'financial-regulation', 'commercial-disputes',
  'international-transactions', 'ai-and-law',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/firms`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/primers`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/events`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/upgrade`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/sign-up`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const firmRoutes: MetadataRoute.Sitemap = FIRM_SLUGS.map((slug) => ({
    url: `${BASE_URL}/firms/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const primerRoutes: MetadataRoute.Sitemap = PRIMER_SLUGS.map((slug) => ({
    url: `${BASE_URL}/primers/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...firmRoutes, ...primerRoutes];
}
