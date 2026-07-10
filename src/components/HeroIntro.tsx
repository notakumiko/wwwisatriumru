"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
} as const;

export function HeroIntro({
  eyebrow,
  title,
  subtitle,
  whatsappHref,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  whatsappHref: string;
}) {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.p variants={item} className="eyebrow mb-8">
        {eyebrow}
      </motion.p>
      <motion.h1
        variants={item}
        className="font-serif-display max-w-4xl text-5xl leading-[1.05] text-ink sm:text-6xl md:text-7xl"
      >
        {title}
      </motion.h1>
      <motion.p variants={item} className="mt-8 max-w-xl text-lg leading-relaxed text-stone">
        {subtitle}
      </motion.p>
      <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
        <Link href="/portfolio" className="btn-primary">
          Смотреть проекты
        </Link>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          Обсудить проект
        </a>
      </motion.div>
    </motion.div>
  );
}
