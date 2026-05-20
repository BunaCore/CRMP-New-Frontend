"use client";

import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

const features = [
  {
    id: 1,
    icon: "db",
    user: "@dr.emily",
    description: "Submit doctoral thesis proposal on Machine Learning Ethics.",
  },
  {
    id: 2,
    icon: "chart",
    user: "@prof.james",
    description: "Approve lab equipment budget request of $12,500.",
  },
  {
    id: 3,
    icon: "globe",
    user: "@sarah.k",
    description: "Schedule thesis defence with the academic evaluation committee.",
  },
  {
    id: 4,
    icon: "leaf",
    user: "@dean.miller",
    description: "Publish peer-reviewed research papers to international archives.",
  },
  {
    id: 5,
    icon: "chart",
    user: "@dr.emily",
    description: "Generate quarterly research compliance and funding audit reports.",
  },
  {
    id: 6,
    icon: "db",
    user: "@marcus.w",
    description: "Assign academic co-advisors to new graduate research projects.",
  },
  {
    id: 7,
    icon: "globe",
    user: "@prof.james",
    description: "Initiate peer-review workflows for sustainable energy proposals.",
  },
  {
    id: 8,
    icon: "leaf",
    user: "@sarah.k",
    description: "Upload verified laboratory data sheets for security review.",
  },
];

export default function LandPage() {
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const _resolvedThemeMode = usePreferencesStore((s) => s.resolvedThemeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => {
      setIsDark(themeMode === "dark" || (themeMode === "system" && media.matches));
    };
    updateTheme();
    media.addEventListener("change", updateTheme);
    return () => media.removeEventListener("change", updateTheme);
  }, [themeMode]);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setThemeMode(next);
    persistPreference("theme_mode", next);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dotBg = isDark ? "bg-white" : "bg-slate-500/80";
  const dotShadow1 = isDark ? "shadow-[0_0_6px_white]" : "shadow-[0_0_6px_rgba(100,116,139,0.3)]";
  const dotShadow2 = isDark ? "shadow-[0_0_10px_white]" : "shadow-[0_0_10px_rgba(100,116,139,0.4)]";
  const dotShadow3 = isDark ? "shadow-[0_0_8px_white]" : "shadow-[0_0_8px_rgba(100,116,139,0.3)]";
  const dotBgMuted1 = isDark ? "bg-white/80" : "bg-slate-500/50";
  const dotBgMuted2 = isDark ? "bg-white/90" : "bg-slate-500/60";
  const dotBgMuted3 = isDark ? "bg-white/95" : "bg-slate-500/70";

  const fadeMaskLeft = {
    background: isDark
      ? "linear-gradient(to right, #050a1b 0%, #050a1b 30%, rgba(5, 10, 27, 0.85) 60%, rgba(5, 10, 27, 0) 100%)"
      : "linear-gradient(to right, #f8fafc 0%, #f8fafc 30%, rgba(248, 250, 252, 0.85) 60%, rgba(248, 250, 252, 0) 100%)",
  };
  const fadeMaskRight = {
    background: isDark
      ? "linear-gradient(to left, #050a1b 0%, #050a1b 30%, rgba(5, 10, 27, 0.85) 60%, rgba(5, 10, 27, 0) 100%)"
      : "linear-gradient(to left, #f8fafc 0%, #f8fafc 30%, rgba(248, 250, 252, 0.85) 60%, rgba(248, 250, 252, 0) 100%)",
  };

  // Framer Motion Animation Variants
  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  } as const;
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] as const } },
  } as const;
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  } as const;
  const slideFromLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const } },
  } as const;
  const slideFromRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const } },
  } as const;
  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const } },
  } as const;

  return (
    <div
      className={`relative flex min-h-screen flex-col justify-between overflow-x-hidden transition-colors duration-300 ${
        isDark ? "bg-[#050a1b]" : "bg-[#f8fafc]"
      }`}
    >
      <style
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Static keyframes for marquee animations
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        @keyframes drift-one {
          0% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(50px, -40px) scale(1.1);
          }
          100% {
            transform: translate(0, 0) scale(1);
          }
        }

        @keyframes drift-two {
          0% {
            transform: translate(0, 0) scale(1.15);
          }
          50% {
            transform: translate(-45px, -50px) scale(0.9);
          }
          100% {
            transform: translate(0, 0) scale(1.15);
          }
        }

        @keyframes drift-three {
          0% {
            transform: translate(0, 0) scale(0.9);
          }
          50% {
            transform: translate(40px, 45px) scale(1.2);
          }
          100% {
            transform: translate(0, 0) scale(0.9);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 45s linear infinite;
        }

        .animate-drift-1 {
          animation: drift-one 24s ease-in-out infinite;
        }

        .animate-drift-2 {
          animation: drift-two 28s ease-in-out infinite;
        }

        .animate-drift-3 {
          animation: drift-three 32s ease-in-out infinite;
        }
      `,
        }}
      />

      {/* Floating starry dots (few, subtle and drifting slowly - first fold only) */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-[100vh] overflow-hidden">
        <div
          className={`absolute top-[15%] left-[10%] h-[2.5px] w-[2.5px] animate-drift-1 rounded-full opacity-95 transition-all duration-300 ${dotBg} ${dotShadow1}`}
        />
        <div
          className={`absolute top-[28%] left-[46%] h-[3.5px] w-[3.5px] animate-drift-2 rounded-full opacity-100 transition-all duration-300 ${dotBg} ${dotShadow2}`}
        />
        <div
          className={`absolute top-[18%] right-[15%] h-[3px] w-[3px] animate-drift-3 rounded-full opacity-95 transition-all duration-300 ${dotBg} ${dotShadow3}`}
        />
        <div
          className={`absolute top-[52%] left-[22%] h-[2px] w-[2px] animate-drift-1 rounded-full opacity-85 transition-all duration-300 ${dotBgMuted1}`}
        />
        <div
          className={`absolute top-[38%] right-[25%] h-[3.2px] w-[3.2px] animate-drift-2 rounded-full opacity-95 transition-all duration-300 ${dotBg} ${dotShadow3}`}
        />
        <div
          className={`absolute top-[65%] left-[12%] h-[2.5px] w-[2.5px] animate-drift-3 rounded-full opacity-90 transition-all duration-300 ${dotBgMuted2}`}
        />
        <div
          className={`absolute top-[58%] right-[10%] h-[2.2px] w-[2.2px] animate-drift-1 rounded-full opacity-90 transition-all duration-300 ${dotBgMuted3}`}
        />
        <div
          className={`absolute top-[82%] left-[38%] h-[3px] w-[3px] animate-drift-2 rounded-full opacity-95 transition-all duration-300 ${dotBg} ${dotShadow3}`}
        />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Deep base */}
        <div
          className={`absolute inset-0 transition-colors duration-300 ${isDark ? "bg-[#050a1b]" : "bg-[#f8fafc]"}`}
        />

        {/* Subtle radial glows */}
        <div
          className={`-translate-x-1/2 absolute top-1/4 left-1/2 h-96 w-96 rounded-full blur-3xl transition-colors duration-300 ${isDark ? "bg-blue-600/8" : "bg-blue-500/4"}`}
        />
        <div
          className={`absolute right-1/4 bottom-1/3 h-80 w-80 rounded-full blur-3xl transition-colors duration-300 ${isDark ? "bg-cyan-500/4" : "bg-cyan-500/2"}`}
        />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between border-b px-8 py-3.5 transition-all duration-300 ${
          isScrolled
            ? isDark
              ? "border-white/10 bg-[#050a1b]/75 shadow-lg backdrop-blur-md"
              : "border-slate-200/60 bg-[#f8fafc]/80 shadow-sm backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <svg
            className={`h-5 w-5 transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>CRMP Logo</title>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span
            className={`font-bold text-lg tracking-tight transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            CRMP
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              isDark
                ? "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
            }`}
          >
            <div className="relative h-4 w-4">
              {/* Sun Icon */}
              <svg
                className={`absolute inset-0 h-4 w-4 transform transition-all duration-500 ease-in-out ${
                  isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Light mode</title>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              {/* Moon Icon */}
              <svg
                className={`absolute inset-0 h-4 w-4 transform transition-all duration-500 ease-in-out ${
                  isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Dark mode</title>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={`px-3.5 font-medium text-sm transition-all duration-300 ${
              isDark
                ? "text-slate-300 hover:bg-white/5 hover:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            asChild
          >
            <a href="/login">Log in</a>
          </Button>
          <Button
            size="sm"
            type="button"
            className={`rounded-lg px-4 py-2 font-semibold text-xs transition-all duration-300 ${
              isDark ? "bg-[#1e293b] text-white hover:bg-slate-800" : "bg-slate-900 text-white hover:bg-slate-800/90"
            }`}
            asChild
          >
            <a href="/register">Sign up</a>
          </Button>
        </div>
      </nav>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-36 pb-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={fadeUp}>
          <Badge
            className={`mb-3 border px-3.5 py-1.5 font-medium text-xs transition-colors duration-300 ${
              isDark
                ? "border-slate-700/50 bg-slate-800/40 text-slate-300 hover:bg-slate-800/60"
                : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            ✨ Academic Collaboration Reimagined →
          </Badge>
        </motion.div>

        {/* Headline with gradient or solid slate-900 */}
        <motion.h1
          variants={fadeUp}
          className={`mb-6 max-w-5xl text-balance text-center font-normal text-[44px] leading-[1.08] tracking-tight transition-colors duration-300 md:text-[72px] ${
            isDark
              ? "bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
              : "text-slate-900"
          }`}
          style={{ fontFamily: "var(--font-outfit), var(--font-sans), sans-serif" }}
        >
          Collaborative Research
          <br />
          Management Platform
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className={`mb-8 max-w-3xl text-pretty text-center font-light text-sm leading-relaxed transition-colors duration-300 md:text-[17px] ${
            isDark ? "text-slate-300" : "text-slate-600"
          }`}
        >
          CRMP provides an integrated digital space for researchers, students, and administrators to submit thesis
          proposals, coordinate funding budgets, track academic evaluations, and schedule thesis defences.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={fadeUp}>
          <Button
            type="button"
            className={`mb-4 flex items-center gap-1.5 rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-sm text-white transition-all duration-300 hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98] ${
              isDark
                ? "shadow-blue-500/20 shadow-lg hover:shadow-blue-500/30"
                : "shadow-blue-600/10 shadow-lg hover:shadow-blue-600/20"
            }`}
          >
            Access Dashboard →
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col gap-3 bg-transparent px-16 pb-4 md:px-28"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        {/* First row - scrolling right to left */}
        <div className="relative h-[125px] overflow-hidden">
          <div className="flex w-max animate-scroll-left gap-3.5">
            {[...features.slice(0, 4), ...features.slice(0, 4), ...features.slice(0, 4)].map((feature, idx) => (
              <FeatureCard key={`row1-${feature.id}-${idx}`} feature={feature} />
            ))}
          </div>
          {/* Fade mask left (on top of cards) */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-30 w-80 transition-all duration-300"
            style={fadeMaskLeft}
          />
          {/* Fade mask right (on top of cards) */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-30 w-80 transition-all duration-300"
            style={fadeMaskRight}
          />
        </div>

        {/* Second row - scrolling left to right */}
        <div className="relative h-[125px] overflow-hidden">
          <div className="flex w-max animate-scroll-right gap-3.5">
            {[...features.slice(4, 8), ...features.slice(4, 8), ...features.slice(4, 8)].map((feature, idx) => (
              <FeatureCard key={`row2-${feature.id}-${idx}`} feature={feature} />
            ))}
          </div>
          {/* Fade mask left (on top of cards) */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-30 w-80 transition-all duration-300"
            style={fadeMaskLeft}
          />
          {/* Fade mask right (on top of cards) */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-30 w-80 transition-all duration-300"
            style={fadeMaskRight}
          />
        </div>
      </motion.div>

      {/* Ambient Sunrise/Reflective Mixed Glow spilling upwards into the first hero section */}
      <div
        className={`-translate-x-1/2 pointer-events-none absolute top-[80vh] left-1/2 z-0 h-[250px] w-[85%] max-w-[1200px] blur-[140px] transition-all duration-300 ${
          isDark
            ? "bg-gradient-to-t from-amber-600/15 via-rose-500/5 to-transparent"
            : "bg-gradient-to-t from-amber-500/5 via-rose-400/2 to-transparent"
        }`}
      />

      {/* Product Showcase Section (Scrolled Down) */}
      <motion.div
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 pb-24 text-center"
        variants={scaleUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* Ambient Glow behind the video frame (Reflected Mixed Sun Light) */}
        <div
          className={`-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 z-0 h-[90%] w-[85%] rounded-full blur-[130px] transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-tr from-amber-600/35 via-orange-500/20 to-blue-500/10"
              : "bg-gradient-to-tr from-slate-200/40 via-slate-100/20 to-slate-200/30"
          }`}
        />

        {/* Browser Mockup Window */}
        <div
          className={`relative z-10 w-full rounded-2xl border p-1.5 backdrop-blur-xl transition-all duration-500 ${
            isDark
              ? "border-white bg-slate-950/80 shadow-[0_0_50px_rgba(255,255,255,0.08)] hover:border-white hover:shadow-[0_0_60px_rgba(255,255,255,0.12)]"
              : "border-slate-800 bg-white/90 shadow-[0_0_50px_rgba(0,0,0,0.05)] hover:border-slate-700 hover:shadow-[0_0_60px_rgba(0,0,0,0.08)]"
          }`}
        >
          {/* Top Window Bar (Chrome) */}
          <div
            className={`flex items-center justify-between rounded-t-xl border-b px-4 py-2 transition-colors duration-300 ${
              isDark ? "border-white/5 bg-slate-900/40" : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <div
              className={`flex w-48 items-center justify-center gap-1.5 rounded border px-3 py-1 font-mono text-[11px] transition-all duration-300 ${
                isDark
                  ? "border-white/5 bg-slate-950/50 text-slate-400"
                  : "border-slate-200 bg-slate-100/50 text-slate-500"
              }`}
            >
              <svg
                className={`h-3 w-3 ${isDark ? "text-slate-500" : "text-slate-400"}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <title>Secure Connection</title>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              </svg>
              crmp.university.edu/dashboard
            </div>
            <div className="w-12" />
          </div>

          {/* Screen Content Wrapper */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-b-xl bg-slate-950">
            {/* Mockup Preview Image */}
            {/* biome-ignore lint/performance/noImgElement: static dashboard preview image */}
            <img
              src="/dashboard.png"
              alt="CRMP Academic Dashboard Preview"
              className="h-full w-full object-cover opacity-95 transition-transform duration-700 hover:scale-[1.01]"
            />
            {/* Dynamic Glassmorphic Play/Overlay Banner */}
            <div className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-white/30 group-hover:bg-white/20">
                <svg className="h-6 w-6 translate-x-0.5 fill-current text-white" viewBox="0 0 24 24">
                  <title>Play Demo</title>
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Powered Research Suite Section Header */}
      <motion.div
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 pb-8 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          variants={fadeUp}
          className={`mb-3 text-balance font-extrabold text-3xl tracking-tight transition-colors duration-300 md:text-5xl ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Research &amp; Thesis Lifecycle
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className={`max-w-3xl font-light text-sm leading-relaxed transition-colors duration-300 md:text-base ${
            isDark ? "text-slate-400" : "text-slate-600"
          }`}
        >
          Manage every phase of your research from initial proposal submission to final grading. Track reviews, manage
          academic milestones, coordinate budgets, and host formal committee evaluations.
        </motion.p>
      </motion.div>

      {/* Feature 1: Proposals */}
      <motion.div
        className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center gap-12 px-8 py-16 lg:flex-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Glow behind Mockup */}
        <div
          className={`-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/4 z-0 h-[450px] w-[450px] rounded-full blur-[130px] transition-all duration-300 ${
            isDark ? "bg-blue-600/10" : "bg-blue-500/5"
          }`}
        />

        {/* Left column: Mockup of AI Models Grid (Screenshot) */}
        <motion.div
          className={`relative z-10 w-full flex-[1.6] rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-500 ${
            isDark
              ? "border-white/10 bg-[#070b14]/90 hover:border-white/15"
              : "border-slate-200/80 bg-white/90 hover:border-slate-300"
          }`}
          variants={slideFromLeft}
        >
          <div
            className={`flex items-center justify-between rounded-t-lg border-b px-3 py-1.5 transition-colors duration-300 ${
              isDark ? "border-white/5 bg-slate-900/20" : "border-slate-100 bg-slate-50"
            }`}
          >
            <span
              className={`font-mono text-[10px] transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              crmp.university.edu / proposals
            </span>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-500/70" />
              <div className="h-2 w-2 rounded-full bg-amber-500/70" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </div>
          </div>
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden rounded-b-lg transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-100"}`}
          >
            {/* biome-ignore lint/performance/noImgElement: static mockup image */}
            <img
              src={isDark ? "/image-dark.png" : "/image.png"}
              alt="Collaborative Proposal Workflows"
              className="h-full w-full object-cover opacity-95 transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>
        </motion.div>

        {/* Right column: Feature details */}
        <motion.div className="flex max-w-[440px] flex-1 flex-col justify-center text-left" variants={slideFromRight}>
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <title>Proposal Workflows</title>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3
            className={`mb-4 font-bold text-3xl leading-tight tracking-tight transition-colors duration-300 md:text-[38px] ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Collaborative Proposals
          </h3>
          <p
            className={`font-normal text-base leading-relaxed transition-colors duration-300 md:text-[18px] ${
              isDark ? "text-slate-300/90" : "text-slate-600"
            }`}
          >
            Create, submit, and review formal academic research proposals. Faculty advisors and departmental ethics
            committees can request revisions, leave specific in-line feedback, or grant immediate approvals through a
            unified, structured pipeline.
          </p>
        </motion.div>
      </motion.div>

      {/* Feature 2: Thesis & Capstone Reviews */}
      <motion.div
        className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center gap-12 px-8 py-16 lg:flex-row-reverse"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Glow behind Mockup */}
        <div
          className={`-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 right-1/4 z-0 h-[450px] w-[450px] rounded-full blur-[130px] transition-all duration-300 ${
            isDark ? "bg-amber-500/5" : "bg-amber-400/2"
          }`}
        />

        {/* Right column: Mockup of Chat Interface (Screenshot) */}
        <motion.div
          className={`relative z-10 w-full flex-[1.6] rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-500 ${
            isDark
              ? "border-white/10 bg-[#070b14]/90 hover:border-white/15"
              : "border-slate-200/80 bg-white/90 hover:border-slate-300"
          }`}
          variants={slideFromRight}
        >
          <div
            className={`flex items-center justify-between rounded-t-lg border-b px-3 py-1.5 transition-colors duration-300 ${
              isDark ? "border-white/5 bg-slate-900/20" : "border-slate-100 bg-slate-50"
            }`}
          >
            <span
              className={`font-mono text-[10px] transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              crmp.university.edu / evaluations
            </span>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-500/70" />
              <div className="h-2 w-2 rounded-full bg-amber-500/70" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </div>
          </div>
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden rounded-b-lg transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-100"}`}
          >
            {/* biome-ignore lint/performance/noImgElement: static mockup image */}
            <img
              src={isDark ? "/image-dark.png" : "/image.png"}
              alt="Structured Academic Evaluations"
              className="h-full w-full object-cover opacity-95 transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>
        </motion.div>

        {/* Left column: Feature details */}
        <motion.div className="flex max-w-[440px] flex-1 flex-col justify-center text-left" variants={slideFromLeft}>
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <title>Academic Evaluations</title>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h3
            className={`mb-4 font-bold text-3xl leading-tight tracking-tight transition-colors duration-300 md:text-[38px] ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Thesis &amp; Capstone Reviews
          </h3>
          <p
            className={`font-normal text-base leading-relaxed transition-colors duration-300 md:text-[18px] ${
              isDark ? "text-slate-300/90" : "text-slate-600"
            }`}
          >
            Establish transparent thesis evaluations. Academic assessment committees can easily access, review, and
            score ongoing student research, schedule oral defences, publish formal review metrics, and post feedback
            notes in a fully compliant hub.
          </p>
        </motion.div>
      </motion.div>

      {/* Feature 3: Grant & Funding Management */}
      <motion.div
        className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center gap-12 px-8 py-16 lg:flex-row"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Glow behind Mockup */}
        <div
          className={`-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/4 z-0 h-[450px] w-[450px] rounded-full blur-[130px] transition-all duration-300 ${
            isDark ? "bg-emerald-500/5" : "bg-emerald-400/2"
          }`}
        />

        {/* Left column: Mockup of Papers Sidebar (Screenshot) */}
        <motion.div
          className={`relative z-10 w-full flex-[1.6] rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-500 ${
            isDark
              ? "border-white/10 bg-[#070b14]/90 hover:border-white/15"
              : "border-slate-200/80 bg-white/90 hover:border-slate-300"
          }`}
          variants={slideFromLeft}
        >
          <div
            className={`flex items-center justify-between rounded-t-lg border-b px-3 py-1.5 transition-colors duration-300 ${
              isDark ? "border-white/5 bg-slate-900/20" : "border-slate-100 bg-slate-50"
            }`}
          >
            <span
              className={`font-mono text-[10px] transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              crmp.university.edu / budget
            </span>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-500/70" />
              <div className="h-2 w-2 rounded-full bg-amber-500/70" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </div>
          </div>
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden rounded-b-lg transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-100"}`}
          >
            {/* biome-ignore lint/performance/noImgElement: static mockup image */}
            <img
              src={isDark ? "/image-dark.png" : "/image.png"}
              alt="Budget & Resource Allocation"
              className="h-full w-full object-cover opacity-95 transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>
        </motion.div>

        {/* Right column: Feature details */}
        <motion.div className="flex max-w-[440px] flex-1 flex-col justify-center text-left" variants={slideFromRight}>
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <title>Budget & Resources</title>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3
            className={`mb-4 font-bold text-3xl leading-tight tracking-tight transition-colors duration-300 md:text-[38px] ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Grant &amp; Funding Management
          </h3>
          <p
            className={`font-normal text-base leading-relaxed transition-colors duration-300 md:text-[18px] ${
              isDark ? "text-slate-300/90" : "text-slate-600"
            }`}
          >
            Streamline academic grant allocation and laboratory material requests. Students and principal researchers
            can submit specific, line-item budget requests, monitor administrative approvals, and track financial
            disbursements.
          </p>
        </motion.div>
      </motion.div>

      {/* Feature 4: Action Audit & Compliance */}
      <motion.div
        className="relative z-10 mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center gap-12 px-8 py-24 lg:flex-row-reverse"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Glow behind Mockup */}
        <div
          className={`-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 right-1/4 z-0 h-[450px] w-[450px] rounded-full blur-[130px] transition-all duration-300 ${
            isDark ? "bg-violet-600/10" : "bg-violet-500/5"
          }`}
        />

        {/* Right column: Performance Mockup (Screenshot) */}
        <motion.div
          className={`relative z-10 w-full flex-[1.6] rounded-xl border p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-500 ${
            isDark
              ? "border-white/10 bg-[#070b14]/90 hover:border-white/15"
              : "border-slate-200/80 bg-white/90 hover:border-slate-300"
          }`}
          variants={slideFromRight}
        >
          <div
            className={`flex items-center justify-between rounded-t-lg border-b px-3 py-1.5 transition-colors duration-300 ${
              isDark ? "border-white/5 bg-slate-900/20" : "border-slate-100 bg-slate-50"
            }`}
          >
            <span
              className={`font-mono text-[10px] transition-colors duration-300 ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              crmp.university.edu / audit-logs
            </span>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-rose-500/70" />
              <div className="h-2 w-2 rounded-full bg-amber-500/70" />
              <div className="h-2 w-2 rounded-full bg-emerald-500/70" />
            </div>
          </div>
          <div
            className={`relative aspect-[16/9] w-full overflow-hidden rounded-b-lg transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-100"}`}
          >
            {/* biome-ignore lint/performance/noImgElement: static mockup image */}
            <img
              src={isDark ? "/image-dark.png" : "/image.png"}
              alt="Audit Logs Screenshot"
              className="h-full w-full object-cover opacity-95 transition-transform duration-700 hover:scale-[1.01]"
            />
          </div>
        </motion.div>

        {/* Left column: Details */}
        <motion.div className="flex max-w-[440px] flex-1 flex-col justify-center text-left" variants={slideFromLeft}>
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-400">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <title>Audit Compliance</title>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <h3
            className={`mb-4 font-bold text-3xl leading-tight tracking-tight transition-colors duration-300 md:text-[38px] ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Action Audit &amp; Compliance
          </h3>
          <p
            className={`font-normal text-base leading-relaxed transition-colors duration-300 md:text-[18px] ${
              isDark ? "text-slate-300/90" : "text-slate-600"
            }`}
          >
            Ensure strict institutional integrity and regulatory compliance. Our comprehensive audit log engine
            automatically records all platform actions, security logins, budget updates, and proposal revisions to
            maintain an auditable history.
          </p>
        </motion.div>
      </motion.div>

      {/* Continuous Glow Zone wrapping FAQ & Curved Dome Footer */}
      <div className="relative w-full bg-transparent">
        {/* Massive sun sparkle glow bleeding UPWARD from the curved dome footer all the way behind FAQ and into the Hero above */}
        <div
          className={`-translate-x-1/2 pointer-events-none absolute bottom-[200px] left-1/2 z-0 h-[600px] w-[90%] max-w-[1200px] rounded-full blur-[160px] transition-all duration-300 ${
            isDark
              ? "bg-gradient-to-t from-amber-600/25 via-orange-500/10 to-transparent"
              : "bg-gradient-to-t from-amber-500/5 via-orange-400/2 to-transparent"
          }`}
        />

        {/* FAQ Section */}
        <motion.div
          className="relative z-10 mx-auto flex min-h-[60vh] max-w-4xl flex-col justify-center px-6 py-24"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2
            className={`mb-2 text-center font-bold text-4xl tracking-tight transition-colors duration-300 md:text-5xl ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            FAQ
          </h2>
          <p
            className={`mb-16 text-center font-light text-sm transition-colors duration-300 md:text-base ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Everything you need to know about the product and billing
          </p>

          <div className="text-left">
            {[
              {
                q: "Is it Open-Source?",
                a: "Yes, our core database orchestration layer and gateway interface are completely open-source, allowing you to self-host or audit the entire system seamlessly.",
              },
              {
                q: "What about models that don't support tool calls?",
                a: "Even models that don't natively support tool calls are enhanced on our platform. We inject an advanced reasoning orchestration layer that translates user queries into safe database requests, enabling smooth performance for all models.",
              },
              {
                q: "Can I remove the watermark from research exports?",
                a: "Yes, users on our professional or academic plans can export clean research reports, reference compilations, and analysis charts completely free of any platform branding.",
              },
              {
                q: "What AI provider are you using?",
                a: "We integrate with leading providers including Anthropic, OpenAI, and Google Gemini via Vercel's AI Gateway, giving you highly secure and latency-optimized responses for over 100+ state-of-the-art models.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className={`group border-b py-6 text-left transition-all duration-300 [&_summary::-webkit-details-marker]:hidden ${
                  isDark ? "border-white/10" : "border-slate-200"
                }`}
              >
                <summary
                  className={`flex cursor-pointer items-center justify-between gap-1.5 transition-colors duration-300 ${
                    isDark ? "text-white hover:text-white" : "text-slate-900 hover:text-slate-900"
                  }`}
                >
                  <h3
                    className={`font-semibold text-base leading-relaxed tracking-tight transition-colors md:text-lg ${
                      isDark ? "text-white/90 group-hover:text-white" : "text-slate-800 group-hover:text-slate-950"
                    }`}
                  >
                    {faq.q}
                  </h3>
                  <span
                    className={`shrink-0 transition-transform duration-300 group-open:rotate-180 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    <svg className="h-5 w-5 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <title>Toggle FAQ Details</title>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </summary>
                <p
                  className={`mt-3 pr-8 font-light text-sm leading-relaxed transition-colors duration-300 ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </motion.div>

        {/* Dome Curved Footer */}
        <div className="relative w-full bg-transparent">
          {/* Large Curved End-to-End Dome Container */}
          <div
            className="relative z-10 w-full px-8 pt-28 pb-16 transition-all duration-300 md:px-16"
            style={{
              borderTopLeftRadius: "50% 80px",
              borderTopRightRadius: "50% 80px",
              borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid rgba(0, 0, 0, 0.06)",
              backgroundColor: isDark ? "#050a1b" : "#f8fafc",
            }}
          >
            {/* Footer content */}
            <div
              className={`mx-auto mb-12 flex max-w-7xl flex-col items-center justify-between gap-8 border-b pb-12 transition-all duration-300 md:flex-row ${
                isDark ? "border-white/5" : "border-slate-200"
              }`}
            >
              {/* Logo and Brand */}
              <div className="flex flex-col items-center gap-3 md:items-start">
                <div
                  className={`flex items-center gap-2 font-bold text-xl transition-colors duration-300 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  <svg className="h-6 w-6 fill-current text-blue-500" viewBox="0 0 24 24">
                    <title>Collaborative Research Management Platform Logo</title>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <span>CRMP</span>
                </div>
                <p
                  className={`text-center font-light text-xs transition-colors duration-300 md:text-left ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  The next-generation collaborative research management platform.
                </p>
              </div>

              {/* Navigation links */}
              <div
                className={`flex flex-wrap justify-center gap-x-8 gap-y-4 font-medium text-xs transition-colors duration-300 ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                <a
                  href="#features"
                  className={`transition-colors duration-300 ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}
                >
                  Features
                </a>
                <a
                  href="#security"
                  className={`transition-colors duration-300 ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}
                >
                  Security
                </a>
                <a
                  href="#pricing"
                  className={`transition-colors duration-300 ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}
                >
                  Pricing
                </a>
                <a
                  href="#docs"
                  className={`transition-colors duration-300 ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}
                >
                  Documentation
                </a>
                <a
                  href="#privacy"
                  className={`transition-colors duration-300 ${isDark ? "hover:text-white" : "hover:text-slate-900"}`}
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            <div
              className={`mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 font-light text-[11px] transition-colors duration-300 md:flex-row ${
                isDark ? "text-slate-500" : "text-slate-600"
              }`}
            >
              <p>© {new Date().getFullYear()} CRMP. All rights reserved.</p>
              <p>Designed and built for researchers, faculty, and institutions worldwide.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: (typeof features)[0] }) {
  const resolvedThemeMode = usePreferencesStore((s) => s.resolvedThemeMode);
  const isDark = resolvedThemeMode === "dark";

  const renderIcon = () => {
    switch (feature.icon) {
      case "redis":
        return (
          <svg className="h-4 w-4 fill-current text-red-500" viewBox="0 0 24 24">
            <title>Memory storage</title>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        );
      case "chart":
        return (
          <svg className="h-4 w-4 fill-current text-amber-500" viewBox="0 0 24 24">
            <title>Visual chart</title>
            <rect x="3" y="12" width="4" height="8" rx="0.5" />
            <rect x="10" y="7" width="4" height="13" rx="0.5" />
            <rect x="17" y="3" width="4" height="17" rx="0.5" />
          </svg>
        );
      case "db":
        return (
          <svg
            className="h-4 w-4 text-cyan-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Database vault</title>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
          </svg>
        );
      case "leaf":
        return (
          <svg
            className="h-4 w-4 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Environment status</title>
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
            <path d="M9 22v-4" />
          </svg>
        );
      case "globe":
        return (
          <svg
            className="h-4 w-4 text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Globe node</title>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        );
      default:
        return <span>🚀</span>;
    }
  };

  return (
    <Card
      className={`group flex h-[115px] w-[300px] flex-shrink-0 flex-col justify-start gap-2.5 rounded-xl border p-4 shadow-md backdrop-blur-md transition-all duration-300 ${
        isDark
          ? "border-white/5 bg-slate-900/40 shadow-xl hover:border-white/10 hover:bg-slate-900/60"
          : "border-slate-100 bg-white/80 text-slate-800 shadow-md shadow-slate-200/30 hover:border-slate-200 hover:bg-slate-50"
      }`}
    >
      {/* Header Row */}
      <div className="flex items-center gap-2">
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-105 ${
            isDark ? "border-white/5 bg-slate-900/80" : "border-slate-200 bg-slate-100/50"
          }`}
        >
          {renderIcon()}
        </div>
        <span
          className={`font-semibold text-xs transition-colors duration-300 ${isDark ? "text-slate-300" : "text-slate-900"}`}
        >
          {feature.user}
        </span>
      </div>

      {/* Description Row */}
      <p
        className={`font-light text-[13px] leading-normal transition-colors duration-300 ${isDark ? "text-slate-200" : "text-slate-600"}`}
      >
        {feature.description}
      </p>
    </Card>
  );
}
