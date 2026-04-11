/** biome-ignore-all lint/nursery/useSortedClasses: <explanation> */
/** biome-ignore-all lint/performance/noImgElement: <explanation> */
import Link from "next/link";

import { BadgeCheck, Globe, LineChart, Mail, Network, Share2, Shield, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafbfc] font-sans">
      {/* Header */}
      <header className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12 xl:max-w-6xl">
        {/* Logo */}
        <Link href="/" className="font-serif text-[24px] tracking-tight text-[#1b2b5a] italic">
          ASTU Research
        </Link>

        <nav className="hidden items-center space-x-8 md:flex">
          <Link href="#" className="border-b-2 border-[#eab308] pb-1 text-[14px] font-bold text-[#1b2b5a]">
            Research
          </Link>
          <Link href="#" className="pb-1 text-[14px] text-slate-500 transition-colors hover:text-slate-900">
            Collaboration
          </Link>
          <Link href="#" className="pb-1 text-[14px] text-slate-500 transition-colors hover:text-slate-900">
            Funding
          </Link>
          <Link href="#" className="pb-1 text-[14px] text-slate-500 transition-colors hover:text-slate-900">
            About ASTU
          </Link>
        </nav>

        {/* Access Platform Button */}
        <div>
          <Button className="h-10 rounded-sm bg-[#0b1b3d] px-6 text-[13px] font-medium tracking-wide text-white hover:bg-[#162752]">
            Access Platform
          </Button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="container mx-auto grid items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:py-16 xl:max-w-6xl">
        {/* Left Column Area */}
        <div className="max-w-lg">
          <Badge className="mb-5 rounded-full border-none bg-[#fcebb6] px-3.5 py-1 font-sans text-[9px] font-extrabold tracking-[0.15em] text-[#b4860b] uppercase shadow-none hover:bg-[#fbdc85]">
            Institutional Research Hub
          </Badge>

          <h1 className="mb-5 flex flex-col font-serif text-[2.5rem] leading-[1.1] tracking-tight text-[#0a1930] md:text-[3.5rem]">
            <span>Advancing</span>
            <span>Research</span>
            <span>Excellence</span>
            <span className="mt-1 font-serif text-[#9e7622] italic">Through Collaboration</span>
          </h1>

          <p className="mb-8 max-w-110 text-[1rem] leading-[1.6] font-light text-slate-600">
            The unified digital ecosystem for Adama Science and Technology University researchers, bridging discipline
            gaps with AI-powered matching and integrated workflow management.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button className="h-11 w-full rounded-md bg-[#0b1a3b] px-6 text-[14px] font-semibold text-white shadow-none hover:bg-[#162752] sm:w-auto">
              Join the Community
            </Button>
            <Button
              variant="secondary"
              className="h-11 w-full rounded-md border-none bg-[#e5e7eb] px-6 text-[14px] font-semibold text-slate-800 shadow-none hover:bg-[#d1d5db] sm:w-auto"
            >
              Explore Repository
            </Button>
          </div>
        </div>

        {/* Right Column Area - Visuals */}
        <div className="relative mt-10 flex justify-center lg:mt-0 lg:justify-end">
          {/* Decorative Star Icon on Top Right */}
          <div className="absolute -top-3 right-2 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-[#fafbfc] bg-[#fadd96] shadow-lg lg:-right-1">
            <Star className="h-5 w-5 text-[#9e7622]" strokeWidth={2} />
          </div>

          <div className="relative aspect-4/5 w-full max-w-100 overflow-hidden rounded-4xl bg-slate-100 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
              alt="Researchers collaborating in a modern facility"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

            {/* Overlay Active Projects Card */}
            <div className="absolute right-4 bottom-4 left-4">
              <Card className="rounded-lg border-none bg-white/95 px-4 pt-4 pb-3 shadow-2xl backdrop-blur-md">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    <BadgeCheck className="h-6 w-6 text-[#9e7622]" strokeWidth={2} />
                  </div>
                  <div className="w-full flex-1 overflow-hidden">
                    <p className="mb-0.5 text-[8px] font-bold tracking-widest text-slate-500 uppercase">
                      Active Projects
                    </p>
                    <p className="mb-2 truncate font-serif text-[17px] leading-tight text-[#0a1930]">
                      Quantum Computing <br /> Synergy
                    </p>
                    <div className="flex h-0.5 w-full overflow-hidden bg-slate-100">
                      <div className="h-full w-[85%] bg-[#0a1930]" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* The Digital Curator Section */}
      <section className="bg-[#f0f2f5] py-20">
        <div className="container mx-auto px-6 lg:px-12 xl:max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="mb-4 font-serif text-[2.5rem] tracking-tight text-[#0a1930]">The Digital Curator</h2>
              <p className="text-[1.05rem] leading-[1.7] text-slate-500">
                Harnessing artificial intelligence to transform raw data into institutional intelligence and global
                research impact.
              </p>
            </div>
            <div className="pb-2">
              <span className="border-b-2 border-[#a07a10] pb-1 text-[10px] font-bold tracking-[0.2em] text-[#a07a10] uppercase">
                INNOVATION CORE
              </span>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {/* Researcher Matching - Spans 2 Cols */}
            <Card className="relative min-h-85 overflow-hidden rounded-2xl border-none bg-white p-0 shadow-sm md:col-span-2">
              <div className="flex h-full flex-col md:flex-row">
                <div className="flex flex-col justify-center p-8 md:w-1/2 lg:p-10">
                  <div className="mt-1 mb-5">
                    <Network className="h-8 w-8 text-[#a07a10]" strokeWidth={2} />
                  </div>
                  <h3 className="mb-3 font-serif text-[1.5rem] text-[#0a1930]">Researcher Matching</h3>
                  <p className="text-[14px] leading-[1.7] text-slate-500">
                    Our proprietary AI analyzes publication histories and current interests to suggest potential
                    collaborators across departments.
                  </p>
                </div>
                <div className="relative flex min-h-65 items-center justify-center bg-white p-6 md:w-1/2">
                  <div
                    className="relative aspect-square w-full max-w-70 overflow-hidden rounded-xl bg-[#0A1128] shadow-xl"
                    style={{
                      transform: "perspective(1000px) rotateY(-12deg) rotateX(4deg)",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80"
                      alt="Network Visualization"
                      className="h-full w-full object-cover opacity-70 mix-blend-screen"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-[#0a1930] to-transparent opacity-80 mix-blend-multiply" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Expertise Visualization */}
            <Card className="flex min-h-85 flex-col justify-center rounded-2xl border-none bg-[#07132a] p-8 text-white shadow-sm lg:p-10">
              <div className="mb-5">
                <LineChart className="h-8 w-8 text-[#fcd34d]" strokeWidth={2} />
              </div>
              <h3 className="mb-3 font-serif text-[1.5rem] leading-tight">Expertise Visualization</h3>
              <p className="text-[14px] leading-[1.7] text-slate-400">
                Dynamic heatmaps that display institutional strengths and identifying emerging research trends in
                real-time.
              </p>
            </Card>

            {/* Authorship Verification */}
            <Card className="flex min-h-50 flex-col justify-center rounded-2xl border-none bg-[#e4e9ec] p-8 shadow-sm lg:p-10">
              <div className="mb-4">
                <Shield className="h-7 w-7 text-[#0a1930]" strokeWidth={2} />
              </div>
              <h3 className="mb-2 font-serif text-[1.25rem] text-[#0a1930]">Authorship Verification</h3>
              <p className="text-[14px] leading-[1.6] text-slate-600">
                Blockchain-backed verification for intellectual property and contribution tracking.
              </p>
            </Card>

            {/* Version Control - Spans 2 Cols */}
            <Card className="flex min-h-50 flex-col justify-center rounded-2xl border-none bg-white p-8 shadow-sm md:col-span-2 lg:p-10">
              <div className="flex h-full w-full flex-col items-center justify-between gap-6 md:flex-row">
                <div>
                  <h3 className="mb-2 font-serif text-[1.25rem] text-[#0a1930]">Version Control</h3>
                  <p className="text-[14px] leading-[1.6] text-slate-500">
                    Automated archival and history tracking for collaborative manuscripts and datasets.
                  </p>
                </div>
                <div className="flex -space-x-2 md:pr-4">
                  <div className="z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#e2e8f0] text-[9px] font-bold text-[#334155] shadow-sm">
                    DR
                  </div>
                  <div className="z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#cbd5e1] text-[9px] font-bold text-[#334155] shadow-sm">
                    AK
                  </div>
                  <div className="z-30 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#8c6716] text-[9px] font-bold text-white shadow-sm">
                    +12
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Seamless Academic Lifecycle Section */}
      <section className="border-t border-slate-100 bg-white py-20">
        <div className="container mx-auto px-6 lg:px-12 xl:max-w-6xl">
          {/* Section Heading */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-serif text-[2.5rem] tracking-tight text-[#0a1930] md:text-[2.75rem]">
              Seamless Academic Lifecycle
            </h2>
            <div className="mx-auto h-[2.5px] w-16 bg-[#d97706]" />
          </div>

          {/* Lifecycle Grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-14">
            {/* 01 Proposal Phase */}
            <div className="flex flex-col">
              <div className="group relative mb-6 aspect-4/3 overflow-hidden rounded-lg bg-slate-50 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80"
                  alt="Proposal Phase"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a1930] text-[9px] font-bold text-white">
                  01
                </div>
                <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Proposal Phase</span>
              </div>
              <h3 className="mb-2 font-serif text-[1.35rem] text-[#0a1930]">Proposal Submission</h3>
              <p className="text-[14px] leading-relaxed text-slate-500">
                Guided templates for ethical clearance and funding requests, integrated with institutional standards.
              </p>
            </div>

            {/* 02 Execution Phase */}
            <div className="flex flex-col">
              <div className="group relative mb-6 aspect-4/3 overflow-hidden rounded-lg bg-slate-50 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
                  alt="Execution Phase"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a1930] text-[9px] font-bold text-white">
                  02
                </div>
                <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">
                  Execution Phase
                </span>
              </div>
              <h3 className="mb-2 font-serif text-[1.35rem] text-[#0a1930]">Budget Management</h3>
              <p className="text-[14px] leading-relaxed text-slate-500">
                Real-time tracking of research grants, procurement, and expenditure with automated reporting.
              </p>
            </div>

            {/* 03 Review Phase */}
            <div className="flex flex-col">
              <div className="group relative mb-6 aspect-4/3 overflow-hidden rounded-lg bg-slate-50 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80"
                  alt="Review Phase"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0a1930] text-[9px] font-bold text-white">
                  03
                </div>
                <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 uppercase">Review Phase</span>
              </div>
              <h3 className="mb-2 font-serif text-[1.35rem] text-[#0a1930]">Supervisor Feedback</h3>
              <p className="text-[14px] leading-relaxed text-slate-500">
                Asynchronous commenting system for advisors and peer-reviewers to provide structured feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-white px-6 py-20 lg:px-12">
        <div className="container mx-auto xl:max-w-6xl">
          <Card className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-[32px] border-none bg-[#031c44] px-10 py-16 text-center shadow-xl lg:flex-row lg:px-16 lg:py-20 lg:text-left">
            <div className="pointer-events-none absolute top-0 right-0 -mt-32 -mr-32 h-100 w-100 rounded-full bg-blue-500/5" />

            <div className="relative z-10 max-w-xl">
              <h2 className="mb-4 font-serif text-[2.5rem] leading-[1.1] tracking-tight text-white md:text-[3.25rem]">
                Ready to amplify your research?
              </h2>
              <p className="text-[1rem] leading-relaxed font-light text-blue-100/60">
                Join over 2,500 ASTU faculty members and researchers in a secure, unified environment designed for
                discovery.
              </p>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-3">
              <Button className="h-14 rounded-md bg-[#8b6516] px-8 text-[16px] font-bold text-white transition-all hover:scale-105 hover:bg-[#a17a2a] active:scale-95">
                Join the ASTU Research Community
              </Button>
              <span className="mt-1 text-[12px] font-light text-blue-100/30 italic">
                Institutional ID login required
              </span>
            </div>
          </Card>
        </div>
      </section>

      <div className="flex w-full justify-center py-2">
        <div className="h-[1.5px] w-10 bg-pink-400/20" />
      </div>

      {/* Footer Section */}
      <footer className="border-t border-slate-100 bg-[#f8fafc] pt-20 pb-10">
        <div className="container mx-auto px-6 lg:px-12 xl:max-w-6xl">
          <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-4">
            <div>
              <h3 className="mb-5 font-serif text-[17px] font-bold text-[#0a1930]">ASTU Research</h3>
              <p className="max-w-55 text-[13px] leading-relaxed text-slate-500">
                The leading platform for scientific discovery and academic collaboration at Adama Science and Technology
                University.
              </p>
            </div>
            <div>
              <h4 className="mb-6 text-[10px] font-extrabold tracking-[0.2em] text-[#0a1930]/30 uppercase">
                RESOURCES
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-[14px] text-slate-600 transition-colors hover:text-[#0a1930]">
                    Institutional Repository
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[14px] text-slate-600 transition-colors hover:text-[#0a1930]">
                    Ethics Committee
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[14px] text-slate-600 transition-colors hover:text-[#0a1930]">
                    Journals & Publications
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-[10px] font-extrabold tracking-[0.2em] text-[#0a1930]/30 uppercase">SUPPORT</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-[14px] text-slate-600 transition-colors hover:text-[#0a1930]">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[14px] text-slate-600 transition-colors hover:text-[#0a1930]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-[14px] text-slate-600 transition-colors hover:text-[#0a1930]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-[10px] font-extrabold tracking-[0.2em] text-[#0a1930]/30 uppercase">CONNECT</h4>
              <div className="flex gap-4">
                <Share2 className="h-4 w-4 cursor-pointer text-slate-400 hover:text-[#0a1930]" />
                <Mail className="h-4 w-4 cursor-pointer text-slate-400 hover:text-[#0a1930]" />
                <Globe className="h-4 w-4 cursor-pointer text-slate-400 hover:text-[#0a1930]" />
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200/50 pt-10 text-center">
            <p className="text-[12px] font-medium text-slate-400">
              © 2024 Adama Science and Technology University. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
