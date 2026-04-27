"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, CheckCircle2, Clock, Columns3, Globe, History, Network, PlayCircle, Share2 } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  viewport: { once: true },
};

export default function LandingG() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    }
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] font-sans transition-colors duration-300 selection:bg-[#9cf0ff] selection:text-[#001f24] dark:bg-[#191c1e]">
      {/* TopNavBar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-slate-200/50 border-b bg-[#f7f9fb]/80 backdrop-blur-md transition-all duration-300 dark:border-slate-800/50 dark:bg-[#191c1e]/80"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer font-bold text-[#00113a] text-xl tracking-tight dark:text-blue-50"
          >
            ASTU Curator
          </motion.div>
          <div className="hidden items-center gap-6 md:flex">
            {["Platform", "Pillars", "Impact", "Resources"].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.5 }}
              >
                <Link
                  className={`${i === 0 ? "border-[#00daf3] border-b-2 font-semibold text-[#00113a] dark:text-[#00daf3]" : "text-[#515f74] hover:text-[#00113a] dark:text-slate-400 dark:hover:text-white"} text-sm tracking-tight transition-all duration-300`}
                  href="#"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="flex items-center justify-center rounded-lg border border-slate-200 p-1.5 transition-colors hover:bg-[#eceef0] dark:border-slate-800 dark:text-white dark:hover:bg-[#2d3133]"
              onClick={toggleDarkMode}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDarkMode ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-yellow-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-label="Sun icon"
                    >
                      <title>Sun icon</title>
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-slate-600"
                      aria-label="Moon icon"
                    >
                      <title>Moon icon</title>
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                    </svg>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <Link
              href="/login"
              className="rounded-lg px-4 py-1.5 font-medium text-[#00113a] text-sm transition-all hover:bg-slate-100 dark:text-[#dbe1ff] dark:hover:bg-slate-800"
            >
              Login
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              className="block rounded-lg bg-[#00113a] px-5 py-1.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-[#002244]"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-32 pb-20 transition-colors duration-300 md:px-12 dark:bg-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="pointer-events-none absolute inset-0 z-0 opacity-10 dark:opacity-5"
        >
          <Image
            className="h-full w-full object-cover"
            alt="University library architecture"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnSgCZhbDatlLmcsmLGIxVdytcXIjxwsmyo_Q8WDVvtjU8NEm9JGO3KACEzg9hq07w1kXwYGGhdYfcHBCpJzwTTO41gVAUb4rB5zhXdL504r5Zcer2SmfbpRXE9i-BKUolv4oePhiHy5KQvPSfqPIXe2jOp-i6su_mKX-9S7wazU_9Ke-GynsmK1GjhNqFoD-NOvYfSBoO06ikMXkcZqiHji3qCQE-cKSXxxVY88iG1fcheeAffi2hSWBeFsrXvu3gmIvVcduD4Gw"
            fill
            priority
          />
        </motion.div>
        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12">
          <motion.div
            initial="initial"
            animate="whileInView"
            variants={staggerContainer}
            className="flex flex-col justify-center lg:col-span-7"
          >
            <motion.span
              variants={fadeInUp}
              className="mb-3 font-bold text-[#00daf3] text-[10px] uppercase tracking-[0.2em]"
            >
              Academic Lifecycle Management
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="mb-4 font-bold text-3xl text-[#00113a] leading-tight [text-shadow:0_2px_10px_rgba(0,0,0,0.1)] md:text-5xl dark:text-blue-50"
            >
              Bridging Gaps, Building Excellence.
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mb-8 max-w-xl text-[#515f74] text-sm leading-relaxed md:text-base dark:text-slate-400"
            >
              An intelligent digital ecosystem for active lifecycle management and AI-powered collaboration. Empowering
              ASTU to lead the global research frontier.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="rounded-lg bg-[#00113a] px-6 py-2.5 font-semibold text-sm text-white shadow-md transition-all hover:bg-[#002244]"
              >
                Start Your Project
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#f8fafc" }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-2.5 font-semibold text-[#00113a] text-sm transition-all dark:border-slate-800 dark:bg-slate-800 dark:text-blue-100"
              >
                <PlayCircle className="h-4 w-4" /> Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden items-center justify-center lg:col-span-5 lg:flex"
          >
            <div className="relative aspect-square w-full max-w-sm">
              <motion.div
                animate={{ rotate: [3, 5, 3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 translate-x-2 translate-y-2 rotate-3 transform rounded-2xl bg-blue-100/30 dark:bg-blue-900/10"
              />
              <motion.div
                whileHover={{ scale: 1.02, rotate: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-800"
              >
                <Image
                  className="h-full w-full object-cover"
                  alt="Digital network visualization"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuePGdwlqD-RDVEXKLCFj2xiQFR5e0XR0tI8C5v_wY1NXBYh2HbY2n4E_1DuFSqbsZhlhpD3VSQYk-SHfnjlayiJjmkdZuCph916kWICo49pQrNb72GcDtFP3KKBH8svfEsD5OF51ZF5_Tu-x0bWryTVc1B5WcYaQi6IkthUHHBlSLU-idPCrFFzNvaAkBbnUQew3gsOEbCi4e0VXSb0ctiMzfEllh-e-UbfR1ST1веJfX0xrLI-I-dj-AykttE88c7Si2rhq-bCY"
                  fill
                />
              </motion.div>
              {/* Floating Data Node */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                whileHover={{ y: -5 }}
                className="-bottom-4 -left-4 absolute max-w-[180px] rounded-xl border border-slate-100 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-800"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00daf3]"
                  >
                    <BarChart3 className="h-3.5 w-3.5 text-[#00113a]" />
                  </motion.div>
                  <div className="font-bold text-[#00113a] text-[10px] uppercase tracking-wider dark:text-blue-100">
                    Velocity
                  </div>
                </div>
                <div className="font-bold text-[#00113a] text-xl dark:text-blue-50">+42%</div>
                <div className="text-[#515f74] text-[9px] dark:text-slate-400">Institutional efficiency gain</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="bg-slate-50 px-6 py-16 transition-colors duration-300 md:px-10 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto mb-10 max-w-2xl text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="mb-3 font-bold text-2xl text-[#00113a] md:text-3xl dark:text-blue-50"
            >
              The Complexity We Solve
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[#515f74] text-sm md:text-base dark:text-slate-400">
              Traditional research management is a maze. We provide the map and the engine.
            </motion.p>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {[
              {
                icon: Columns3,
                title: "Operational Fragmentation",
                desc: "Siloed data and disconnected workflows that prevent a unified institutional view of research progress.",
              },
              {
                icon: Clock,
                title: "Fiscal Delays",
                desc: "Lengthy approval cycles and manual fund tracking that stall momentum and discourage investigators.",
              },
              {
                icon: History,
                title: "Lost Institutional Memory",
                desc: "Valuable insights and historical data lost in legacy systems, hindering future grant potential.",
              },
            ].map((item, _idx) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
                }}
                className="rounded-xl border border-slate-200 bg-[#ffffff] p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-[#2d3133]"
              >
                <item.icon className="mb-4 h-8 w-8 text-[#00daf3]" />
                <h3 className="mb-2 font-bold text-[#00113a] text-lg dark:text-[#dbe1ff]">{item.title}</h3>
                <p className="text-[#515f74] text-sm leading-relaxed dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Pillars Section */}
      <section className="overflow-hidden border-slate-100 border-y bg-white px-6 py-12 md:px-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center font-bold text-[#00113a] text-xl uppercase tracking-wide md:text-3xl dark:text-blue-50"
          >
            Three Pillars of Innovation
          </motion.h2>
          <div className="space-y-16">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center gap-10 lg:flex-row">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-5/12"
              >
                <div className="relative aspect-video">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, -1, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="-inset-1.5 -rotate-1 absolute rounded-lg bg-[#00daf3]/5"
                  />
                  <Image
                    className="relative aspect-video w-full rounded-lg object-cover shadow-lg"
                    alt="Research Laboratory"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAsQUC6EzNKqYnWqQWY8g6CaTtd1mex5l4eA60X3wBy8ZZVc5Vpc4D0IwiRIfdkXljOZENdmnolp9oWZR6f5hcna4cFRRSNt8JNhvHYpz9y2gOuhSV9AbBuKkus9_VwUvH-q6Vx2lemTEkY5jcIlcYTUVLr2zv86qVz969Du9kqF0awfSqOlbDoEWqLdNbOmfLTj55yV-qg3iG6MXadFlFQapSF4XbJ-pJI8BuYezfSOIUx2LVsp_sRAE8Sjeosoh-aeU9x3Lip_c"
                    fill
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-7/12"
              >
                <div className="mb-3 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 font-bold text-[#00113a] text-[8px] tracking-widest dark:bg-blue-900/30 dark:text-blue-100">
                  PILLAR 01
                </div>
                <h3 className="mb-3 font-bold text-[#00113a] text-xl md:text-2xl dark:text-blue-100">
                  Active Lifecycle Management
                </h3>
                <p className="mb-4 max-w-lg text-[#515f74] text-sm leading-relaxed dark:text-slate-400">
                  A dynamic, end-to-end framework from the first draft to the final fund release. Every stage is
                  transparent, trackable, and optimized for speed.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 font-medium text-[#00113a] text-xs dark:text-blue-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00daf3]" />
                    Real-time milestone tracking
                  </li>
                  <li className="flex items-center gap-2 font-medium text-[#00113a] text-xs dark:text-blue-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00daf3]" />
                    Integrated submission gateways
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center gap-10 lg:flex-row-reverse">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-5/12"
              >
                <div className="relative aspect-video">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="-inset-1.5 absolute rotate-1 rounded-lg bg-blue-100/20 dark:bg-blue-900/10"
                  />
                  <Image
                    className="relative aspect-video w-full rounded-lg object-cover shadow-lg"
                    alt="AI Visualization"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLpBA6LYRNmBiU5DnyfSwmVOFxy9AgxuQAf551mpRDbhpEjZxxyJ1cBVPgCk4jwtwTe_gIw4YvtHkdRLCJn36co2n8PopNrh4L2-MJ8L9-XzGpAdrz0lg8bqoFQEylIDHTUIdcQFq1Q7ZyCVNEFUjUi9IEXUjhbtome95N98xoAM5DbAtDVCFVqgBVihEaMpEumYx4hWFb8KwnRmFq0VWZKtfL9dvt5e0Lz4WQnjKY-sg-k4w_H2TKkNqK0Dkykm8lZ_EUk-_hXb4"
                    fill
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-7/12"
              >
                <div className="mb-3 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 font-bold text-[#00113a] text-[8px] tracking-widest dark:bg-blue-900/30 dark:text-blue-100">
                  PILLAR 02
                </div>
                <h3 className="mb-3 text-right font-bold text-[#00113a] text-xl md:text-2xl lg:text-left dark:text-blue-100">
                  AI-Powered Matching
                </h3>
                <p className="mb-4 ml-auto max-w-lg text-right text-[#515f74] text-sm leading-relaxed lg:ml-0 lg:text-left dark:text-slate-400">
                  Our proprietary collaborative filtering engine identifies the perfect co-investigators, reviewers, and
                  industrial partners based on semantic research expertise.
                </p>
                <ul className="flex flex-col items-end space-y-2 lg:items-start">
                  <li className="flex items-center gap-2 font-medium text-[#00113a] text-xs dark:text-blue-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00daf3]" />
                    Semantic expertise discovery
                  </li>
                  <li className="flex items-center gap-2 font-medium text-[#00113a] text-xs dark:text-blue-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00daf3]" />
                    Interdisciplinary bridge building
                  </li>
                </ul>
              </motion.div>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center gap-10 lg:flex-row">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-5/12"
              >
                <div className="relative aspect-video">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, -1, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className="-inset-1.5 -rotate-1 absolute rounded-lg bg-[#00daf3]/5"
                  />
                  <Image
                    className="relative aspect-video w-full rounded-lg object-cover shadow-lg"
                    alt="Financial Dashboard"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw61IF-oRAwF9VhpdwSEpG5wDNFU46mQ7o1Xrx-yZtGCDZi0bx40D7x-O_4AoU2a2vrJmFUSc_J3jY0ZOUfQ-Gmcl8b5JUK-5PGyCxktOi9Pt7OIJlIkQd3wQ2alIs0DYWwbnkRDfwbJAvMG0oqTv_kxzmllQA5-pBXm8GPrZX5so17u_3UJ8creymfmWDFhkj5G2pn0vtQnxfp8y1FMNN9UAEbHypkW_p4-XamFuBE54Qu_P2gIQjMiNpOFWf6-fjOVGva8nCPTs"
                    fill
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:w-7/12"
              >
                <div className="mb-3 inline-flex items-center rounded bg-blue-100 px-2 py-0.5 font-bold text-[#00113a] text-[8px] tracking-widest dark:bg-blue-900/30 dark:text-blue-100">
                  PILLAR 03
                </div>
                <h3 className="mb-3 font-bold text-[#00113a] text-xl md:text-2xl dark:text-blue-100">
                  Automated Financial Governance
                </h3>
                <p className="mb-4 max-w-lg text-[#515f74] text-sm leading-relaxed dark:text-slate-400">
                  Eliminate the bottleneck of manual fiscal oversight. Multi-tier digital approvals ensure faster
                  funding cycles while maintaining rigorous institutional compliance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 font-medium text-[#00113a] text-xs dark:text-blue-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00daf3]" />
                    Smart compliance auditing
                  </li>
                  <li className="flex items-center gap-2 font-medium text-[#00113a] text-xs dark:text-blue-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#00daf3]" />
                    Frictionless fund disbursement
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="relative overflow-hidden bg-[#00113a] px-6 py-20 text-white transition-colors duration-300 md:px-10 dark:bg-slate-950">
        <motion.div
          animate={{ x: [0, 50, 0], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="-mr-32 absolute top-0 right-0 h-full w-1/3 bg-blue-400/10 blur-[120px]"
        />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="mb-5 font-bold text-2xl leading-tight md:text-4xl">
                Measurable Impact on Institutional Performance
              </motion.h2>
              <motion.p variants={fadeInUp} className="mb-8 max-w-xl text-blue-200/70 text-sm md:text-base">
                We don&apos;t just manage research; we accelerate it. By digitizing the core of academic discovery, we
                unlock new levels of institutional potential.
              </motion.p>
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                <motion.div variants={fadeInUp}>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="mb-1 font-bold text-4xl text-[#00daf3] md:text-5xl"
                  >
                    30-50%
                  </motion.div>
                  <div className="font-medium text-[10px] text-blue-200/60 uppercase tracking-widest">
                    Productivity Gain
                  </div>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    className="mb-1 font-bold text-4xl text-[#00daf3] md:text-5xl"
                  >
                    100%
                  </motion.div>
                  <div className="font-medium text-[10px] text-blue-200/60 uppercase tracking-widest">
                    Total Transparency
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl bg-white/5 p-0.5 backdrop-blur-xl"
            >
              <div className="rounded-[0.9rem] border border-white/10 bg-[#00113a]/40 p-6 md:p-10 dark:bg-slate-900/40">
                <blockquote className="mb-6 text-lg italic leading-relaxed md:text-xl">
                  &ldquo;The ASTU Curator has transformed our research office from a clearinghouse into a strategic
                  engine. We are now funding projects 40% faster than last year.&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#00daf3] bg-slate-500"
                  >
                    <Image
                      className="h-full w-full object-cover"
                      alt="Dr. Elena Rodriguez"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3sj5TsOjS6H-aho_NqRKZlkeY_1j6y2ABG6PvcNbZDRtzzDeDZMBLnARaQoj4NrEd3gCH7nwjLqBxwLMpc0mU2afdEMZcq9gyLgZduScEWaBgjO75YX6PIFk9tRrYRD1Xf1UsNthHhUhjj5Em7Ul9CBh6MxXkAhg388slfm_MXB6ZM2tSOxb1aLI8ouPngUQa_atdZRISaca-6n3bf57mOCQw0CZFpvn1BFkjh-Nzf3dh5UtA0a67ew_RBqjG9eS6H5s4KOHc73o"
                      fill
                    />
                  </motion.div>
                  <div>
                    <div className="font-bold text-sm md:text-base">Dr. Elena Rodriguez</div>
                    <div className="text-[#00daf3] text-[10px] uppercase tracking-wide">
                      Vice President for Research
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white px-6 py-16 transition-colors duration-300 md:px-10 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative translate-y-0 overflow-hidden rounded-2xl bg-slate-100 p-10 text-center shadow-inner md:p-14 dark:bg-slate-800"
          >
            <div className="pointer-events-none absolute inset-0 opacity-5">
              <Image
                className="h-full w-full object-cover"
                alt="Digital Connectivity"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfq1tqRqaOeiwuHwTPbE69EwsG7YLVa4zriz12XHXKeAXyOpr_i9xcwFuN8f0ItVGRHqQIZdReRGmW3VHGfyj90szC-Dbr4yS-3dd4KqzPJbD54AB3CCdDwUf8l2f-aqak9qHXykcBJEKt7FsygDSEzM5Yn2TaYsA_o0z2UPQVBjlMJgKzrwA3oH4RGbQWY_rLzdUDd9_2DxF4tceaIZD0zaKAlvC72iFyET0eK2rabGI68oerfaVVbwGBct8Zrl3FHWx8_lrubp8"
                fill
              />
            </div>
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mb-4 font-bold text-2xl text-[#00113a] md:text-4xl dark:text-blue-50"
              >
                Ready to transform your research?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mx-auto mb-8 max-w-xl text-[#515f74] text-sm md:text-base dark:text-slate-400"
              >
                Join the ecosystem that&apos;s redefining how knowledge is created and managed at ASTU.
              </motion.p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="rounded-lg bg-[#00113a] px-6 py-2.5 font-bold text-sm text-white shadow-md transition-all hover:bg-[#002244]"
                >
                  I am a Principal Investigator
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="rounded-lg border-2 border-[#00113a] px-6 py-2.5 font-bold text-[#00113a] text-sm transition-all hover:bg-[#00113a] hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-slate-900"
                >
                  I am an Administrator
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-slate-200 border-t bg-slate-50 px-6 py-12 transition-colors duration-300 md:px-10 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-4">
          <div className="col-span-1">
            <div className="mb-4 font-bold text-[#00113a] text-base uppercase tracking-wider dark:text-blue-50">
              ASTU Curator
            </div>
            <p className="text-slate-500 text-sm leading-relaxed dark:text-slate-400">
              Advancing frontiers through intelligent collaboration and management.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 font-bold text-[#00113a] text-[9px] uppercase tracking-widest dark:text-blue-100">
              Platform
            </h4>
            <Link className="text-slate-500 text-xs hover:text-[#00daf3] dark:text-slate-400" href="#">
              Ethics & Compliance
            </Link>
            <Link className="text-slate-500 text-xs hover:text-[#00daf3] dark:text-slate-400" href="#">
              Institutional Access
            </Link>
            <Link className="text-slate-500 text-xs hover:text-[#00daf3] dark:text-slate-400" href="#">
              API Documentation
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 font-bold text-[#00113a] text-[9px] uppercase tracking-widest dark:text-blue-100">
              Legal
            </h4>
            <Link className="text-slate-500 text-xs hover:text-[#00daf3] dark:text-slate-400" href="#">
              Privacy Policy
            </Link>
            <Link className="text-slate-500 text-xs hover:text-[#00daf3] dark:text-slate-400" href="#">
              Terms of Service
            </Link>
            <Link className="text-slate-500 text-xs hover:text-[#00daf3] dark:text-slate-400" href="#">
              Data Processing
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 font-bold text-[#00113a] text-[9px] uppercase tracking-widest dark:text-blue-100">
              Contact
            </h4>
            <p className="text-slate-500 text-xs dark:text-slate-400">ASTU Main Campus, Building B</p>
            <p className="text-slate-500 text-xs dark:text-slate-400">support@astu-curator.edu</p>
            <div className="mt-1 flex gap-4">
              <motion.div whileHover={{ scale: 1.2, color: "#22d3ee" }}>
                <Globe className="h-4 w-4 cursor-pointer text-slate-400" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, color: "#22d3ee" }}>
                <Share2 className="h-4 w-4 cursor-pointer text-slate-400" />
              </motion.div>
              <motion.div whileHover={{ scale: 1.2, color: "#22d3ee" }}>
                <Network className="h-4 w-4 cursor-pointer text-slate-400" />
              </motion.div>
            </div>
          </div>
        </div>
        <div className="md:row mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-slate-200 border-t pt-6 dark:border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest dark:text-slate-400">
            © 2024 ASTU Collaborative Research. All rights reserved.
          </div>
          <div className="flex gap-4 text-[10px]">
            <span className="font-medium text-cyan-600 dark:text-cyan-400">Status: All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
