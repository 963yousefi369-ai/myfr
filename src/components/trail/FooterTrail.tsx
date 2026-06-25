'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUserTrailStore } from '@/lib/store/user-trail';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function FooterTrail() {
  const getHistory = useUserTrailStore((s) => s.getHistory);
  const history = getHistory();

  if (history.length === 0) return null;

  const recent = history.slice(-4);

  return (
    <div className="inline-flex items-center rounded-xl bg-white/[0.04] border border-white/[0.06] px-0.5 py-0.5">
      <Breadcrumb>
        <BreadcrumbList className="gap-0">
          {recent.map((entry, i) => {
            const isFirst = i === 0;
            const isLast = i === recent.length - 1;

            return (
              <motion.div
                key={entry.path}
                className="contents"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
              >
                {i > 0 && (
                  <BreadcrumbSeparator className="mx-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white/15"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </BreadcrumbSeparator>
                )}

                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="flex items-center gap-1 text-[11px] text-white/70 font-medium px-2 py-1 rounded-lg bg-white/[0.06]">
                      {isFirst && <Home className="w-3 h-3" />}
                      {entry.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      asChild
                      className="flex items-center gap-1 text-[11px] text-white/25 hover:text-white/55 px-2 py-1 rounded-lg hover:bg-white/[0.04] transition-all duration-200"
                    >
                      <Link href={entry.path}>
                        {isFirst && <Home className="w-3 h-3" />}
                        {entry.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </motion.div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
