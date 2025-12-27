'use client';

import React from 'react';
import { useStorefrontQuery } from '@/hooks/useStorefront';
import { GET_COLLECTIONS_QUERY } from '@/graphql/collections';
import { GetCollectionsQuery } from '@/types/shopify-graphql';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

// Mirroring the premium category styles
const categoryStyles = [
  { gradient: 'bg-[#9BA5A9]' }, // grey
  { gradient: 'bg-[#003B8F]' }, // deep blue
  { gradient: 'bg-[#FF416C]' }, // hot pink
  { gradient: 'bg-[#B48FFF]' }, // lavender
  { gradient: 'bg-[#FFB01F]' }, // yellow
  { gradient: 'bg-[#E65100]' }, // orange
  { gradient: 'bg-[#A5C3A7]' }, // green
  { gradient: 'bg-[#284B90]' }, // royal blue
];

const AllCollections = () => {
  const { data, isLoading } = useStorefrontQuery<GetCollectionsQuery>(
    ['collections-home'],
    {
      query: GET_COLLECTIONS_QUERY,
    }
  );

  const allCollections = data?.collections?.edges || [];

  // Grouping Logic
  const groupedCollections: Record<string, { parent?: any; children: any[] }> = {};
  allCollections.forEach((edge) => {
    const title = edge.node.title;
    const parts = title.split(/\s*[\/\>\-]\s*/);
    if (parts.length > 1) {
      const parentName = parts[0];
      const childName = parts.slice(1).join(' / ');
      if (!groupedCollections[parentName]) {
        groupedCollections[parentName] = { children: [] };
      }
      groupedCollections[parentName].children.push({ ...edge.node, displayTitle: childName });
    } else {
      if (!groupedCollections[title]) {
        groupedCollections[title] = { children: [] };
      }
      groupedCollections[title].parent = edge.node;
    }
  });

  const displayGroups = Object.entries(groupedCollections)
    .map(([name, group]) => ({ name, ...group }))
    .slice(0, 4);

  if (isLoading) {
    // ... existing loading skeleton ...
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-3xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Shop by Collection</h2>
          <p className="text-gray-500 font-medium tracking-tight">Explore our curated Palestinian craftsmanship</p>
        </div>
        <Link
          href="/categories"
          className="text-[#215732] font-bold hover:underline underline-offset-4 flex items-center gap-1"
        >
          View All Collections
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {displayGroups.map((group, index) => {
          const currentStyle = categoryStyles[index % categoryStyles.length];
          const mainCollection = group.parent || group.children[0];

          return (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`group relative flex overflow-hidden rounded-[2.5rem] ${currentStyle.gradient} h-56 w-full p-8 transition-all duration-300 hover:shadow-2xl`}
              >
                <div className="relative z-10 flex flex-col justify-between h-full w-[60%]">
                  <div>
                    <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-sm mb-3">
                      {group.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.children.slice(0, 3).map(child => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.handle}`}
                          className="text-[10px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/40 text-white px-3 py-1 rounded-full backdrop-blur-sm transition-colors"
                        >
                          {child.displayTitle}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`/categories/${mainCollection.handle}`}
                    className="w-fit bg-white text-gray-900 px-5 py-2.5 rounded-xl font-black text-xs hover:bg-gray-100 transition-all shadow-lg active:scale-95"
                  >
                    Browse
                  </Link>
                </div>

                <div className="absolute right-0 bottom-0 top-0 w-[50%] flex items-center justify-end">
                  {mainCollection.image ? (
                    <div className="relative w-full h-[120%] mr-[-8%] mb-[-8%] transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2">
                      <Image
                        src={mainCollection.image.url}
                        alt={group.name}
                        fill
                        className="object-contain object-right-bottom drop-shadow-2xl"
                        sizes="(max-w-768px) 100vw, 30vw"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white/20 blur-3xl mr-10" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default AllCollections;
