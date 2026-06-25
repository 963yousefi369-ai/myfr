'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUserTrailStore } from '@/lib/store/user-trail';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface BreadcrumbTrailProps {
  className?: string;
  dark?: boolean;
}

export default function BreadcrumbTrail({ className, dark }: BreadcrumbTrailProps) {
  const getHistory = useUserTrailStore((s) => s.getHistory);
  const history = getHistory();

  if (history.length === 0) return null;

  const steps = history.slice(-4);
  const isDark = dark !== false;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'inline-flex items-center rounded-2xl px-1 py-1',
        isDark
          ? 'bg-white/[0.06] border border-white/[0.1] backdrop-blur-md'
          : 'bg-white border border-slate-200/70 shadow-sm',
        className,
      )}
    >
      <Breadcrumb>
        <BreadcrumbList className="gap-0">
          {steps.map((step, i) => {
            const isFirst = i === 0;
            const isLast = i === steps.length - 1;

            return (
              <motion.div
                key={step.path}
                className="contents"
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
              >
                {i > 0 && (
                  <BreadcrumbSeparator className="mx-0.5">
                    <ChevronLeft
                      className={cn(
                        isDark ? 'text-white/15' : 'text-slate-300',
                      )}
                    />
                  </BreadcrumbSeparator>
                )}

                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage
                      className={cn(
                        'relative flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl',
                        isDark
                          ? 'text-white bg-white/[0.1]'
                          : 'text-[#1e3a5f] bg-[#10b981]/[0.08]',
                      )}
                    >
                      {isFirst && <Home className="w-3.5 h-3.5" />}
                      <span>{step.label}</span>
                      {isDark && (
                        <motion.span
                          className="absolute inset-0 rounded-xl bg-[#10b981]/10"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      asChild
                      className={cn(
                        'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-all duration-200',
                        isDark
                          ? 'text-white/40 hover:text-white/90 hover:bg-white/[0.06]'
                          : 'text-slate-400 hover:text-[#10b981] hover:bg-slate-50',
                      )}
                    >
                      <Link href={step.path}>
                        {isFirst && (
                          <Home
                            className={cn(
                              'w-3.5 h-3.5',
                              isDark ? 'text-white/25' : 'text-slate-300',
                            )}
                          />
                        )}
                        {step.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </motion.div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
