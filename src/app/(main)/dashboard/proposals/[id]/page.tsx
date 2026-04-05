"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Download,
  Edit,
  FileText,
  History,
  MessageSquare,
  Paperclip,
  Send,
  User,
  Award,
  Video,
} from "lucide-react";

export default function ProposalDetailsPage() {
  const params = useParams();
  const id = params?.id || "PRP-044";

  // ─── MOCK FEATURE TOGGLE ─────────────────────────
  const SHOW_MOCK_APPOINTMENT = true;
  const mockAppointment = {
    title: "Quantum Computing Simulation",
    date: "14 Mar 2025",
    time: "10:00 AM (EAT)",
    venue: "Main Campus — Senate Hall",
    message: "Please ensure your presentation is strictly 15 minutes. The evaluation committee has already reviewed your abstract.",
  };

  // Mock data for the specific proposal
  const proposal = {
    id: id,
    title: "Neural Interface Robotics Control",
    status: "Revisions Required",
    date: "Oct 26, 2026",
    abstract:
      "This proposal outlines a framework for developing real-time brain-computer interfaces (BCI) designed to control advanced robotic prosthetics with sub-millisecond latency. By leveraging deep learning models, we aim to translate neural oscillations directly into motor commands, circumventing traditional nerve pathways damaged by spinal injuries.",
    objectives: [
      "Develop a low-latency neural decoding algorithm.",
      "Integrate the BCI with a standard robotic arm prototype.",
      "Conduct clinical trials with 10 participants over 6 months.",
    ],
    budget: "$450,000",
    investigator: "Dr. Sarah Jenkins",
    department: "Bioengineering",
    version: "v1.2",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200/50",
  };

  const feedback = [
    {
      id: 1,
      author: "Eval Committee",
      role: "Review Board",
      avatar: "EC",
      date: "Oct 25, 2026",
      text: "The theoretical models are sound, but the hardware integration section lacks specificity. Please outline the specific sensor modules you plan to use for the robotic arm prototype.",
      type: "revision",
    },
    {
      id: 2,
      author: "Dr. Alan Grant",
      role: "Co-Investigator",
      avatar: "AG",
      date: "Oct 24, 2026",
      text: "I've added the budget breakdown for the clinical trials to the appendix.",
      type: "comment",
    },
  ];

  const history = [
    { version: "v1.2", date: "Oct 26, 2026", action: "Status changed to Revisions Required", author: "System" },
    { version: "v1.1", date: "Oct 24, 2026", action: "Submitted for Review", author: "Dr. Sarah Jenkins" },
    { version: "v1.0", date: "Oct 18, 2026", action: "Proposal Created", author: "Dr. Sarah Jenkins" },
  ];

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-6 lg:p-10">
      {/* Top Navigation */}
      <div className="mb-2 flex items-center gap-2">
        <Link href="/dashboard/proposals">
          <Button variant="ghost" size="sm" className="h-8 rounded-full text-slate-500 shadow-none hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Proposals
          </Button>
        </Link>
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm md:flex-row md:items-end dark:border-slate-800/50 dark:bg-slate-950/50">
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-slate-200 px-2 py-0.5 font-semibold text-slate-500 text-xs dark:border-slate-700 dark:text-slate-400">
              {proposal.id}
            </Badge>
            <Badge variant="outline" className={`${proposal.color} inline-flex items-center rounded px-2.5 py-0.5 font-medium shadow-none`}>
              {proposal.status}
            </Badge>
          </div>
          <h1 className="font-bold text-2xl text-slate-900 tracking-tight md:text-3xl dark:text-slate-100">
            {proposal.title}
          </h1>
          <div className="flex items-center gap-4 font-medium text-slate-500 text-sm">
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" /> {proposal.investigator}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Last Updated: {proposal.date}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <Button variant="outline" className="flex-1 rounded-full font-medium md:flex-auto">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button className="flex-1 rounded-full border-0 bg-blue-600 font-medium text-white shadow-sm hover:bg-blue-700 md:flex-auto">
            <Edit className="mr-2 h-4 w-4" /> Edit Proposal
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs defaultValue="overview" className="mt-2 w-full">
        <TabsList className="scrollbar-hide h-12 w-full flex-nowrap justify-start overflow-x-auto rounded-none border-slate-200 border-b bg-transparent p-0 dark:border-slate-800">
          <TabsTrigger 
            value="overview" 
            className="rounded-none border-transparent border-b-2 px-6 py-3 font-medium text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:data-[state=active]:text-blue-400"
          >
            <FileText className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger 
            value="feedback" 
            className="rounded-none border-transparent border-b-2 px-6 py-3 font-medium text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:data-[state=active]:text-blue-400"
          >
            <MessageSquare className="mr-2 h-4 w-4" /> Feedback & Comments
            <Badge className="ml-2 h-4 rounded-full border-0 bg-amber-100 px-1.5 py-0 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">1</Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="rounded-none border-transparent border-b-2 px-6 py-3 font-medium text-slate-500 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-700 data-[state=active]:shadow-none dark:data-[state=active]:text-blue-400"
          >
            <History className="mr-2 h-4 w-4" /> Version History
          </TabsTrigger>
          {SHOW_MOCK_APPOINTMENT && (
            <TabsTrigger 
              value="evaluation" 
              className="rounded-none border-transparent border-b-2 px-6 py-3 font-medium text-slate-500 data-[state=active]:border-amber-600 data-[state=active]:bg-transparent data-[state=active]:text-amber-700 data-[state=active]:shadow-none dark:data-[state=active]:text-amber-400"
            >
              <Award className="mr-2 h-4 w-4" /> Defence & Evaluation
              <Badge className="ml-2 h-4 rounded-full border-0 bg-red-100 px-1.5 py-0 text-red-700 dark:bg-red-900/30 dark:text-red-400">Action Required</Badge>
            </TabsTrigger>
          )}
        </TabsList>

        <div className="py-6">
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-0 focus-visible:outline-none">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                <Card className="overflow-hidden rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                  <CardHeader className="border-slate-100 border-b bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                    <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Abstract</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-slate-600 text-sm leading-relaxed dark:text-slate-400">
                    {proposal.abstract}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                  <CardHeader className="border-slate-100 border-b bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                    <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Key Objectives</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {proposal.objectives.map((obj) => (
                        <li key={obj} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-slate-600 text-sm dark:border-slate-800 dark:bg-slate-900/20 dark:text-slate-400">
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-500" />
                          <span className="mt-0.5 leading-tight">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Details */}
              <div className="flex flex-col gap-6">
                <Card className="rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base text-slate-800 dark:text-slate-200">Proposal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 text-sm">
                    <div className="flex items-center justify-between border-slate-100 border-b py-2 dark:border-slate-800">
                      <span className="font-medium text-slate-500">Department</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{proposal.department}</span>
                    </div>
                    <div className="flex items-center justify-between border-slate-100 border-b py-2 dark:border-slate-800">
                      <span className="font-medium text-slate-500">Est. Budget</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{proposal.budget}</span>
                    </div>
                    <div className="flex items-center justify-between border-slate-100 border-b py-2 dark:border-slate-800">
                      <span className="font-medium text-slate-500">Current Version</span>
                      <Badge variant="secondary" className="rounded font-semibold">{proposal.version}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border-blue-100 border-slate-200/50 bg-blue-50/50 shadow-none dark:border-blue-900/50 dark:border-slate-800/50 dark:bg-blue-900/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-blue-800 dark:text-blue-300">Required Action</CardTitle>
                  </CardHeader>
                  <CardContent className="text-blue-700/80 text-sm dark:text-blue-400">
                    <p className="mb-4">This proposal requires revisions based on evaluator feedback before it can move forward.</p>
                    <Button className="w-full rounded-full border-0 bg-blue-600 font-medium text-white shadow-sm transition-all hover:bg-blue-700">
                      Review Feedback
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="mt-0 focus-visible:outline-none">
            <Card className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border-slate-200/50 shadow-none md:flex-row dark:border-slate-800/50">
              
              {/* Feedback List */}
              <div className="flex w-full flex-col border-slate-100 border-r bg-slate-50/30 md:w-1/2 lg:w-3/5 dark:border-slate-800 dark:bg-slate-900/10">
                <div className="border-slate-100 border-b bg-white p-4 font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                  Reviewer Comments
                </div>
                <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
                  {feedback.map((fb) => (
                    <div key={fb.id} className="flex items-start gap-4">
                      <Avatar className={`h-10 w-10 border ${fb.type === 'revision' ? 'border-amber-200' : 'border-slate-200'}`}>
                        <AvatarFallback className={`font-semibold text-sm ${fb.type === 'revision' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-700'}`}>
                          {fb.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-1 flex-col gap-1.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm dark:text-slate-100">{fb.author}</span>
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500 text-xs dark:bg-slate-800">{fb.role}</span>
                          </div>
                          <span className="font-medium text-[11px] text-slate-400">{fb.date}</span>
                        </div>
                        <div className={`rounded-xl border p-4 text-sm leading-relaxed ${
                          fb.type === 'revision' 
                            ? 'border-amber-100 bg-amber-50/50 text-amber-900 dark:border-amber-800/50 dark:bg-amber-900/10 dark:text-amber-200' 
                            : 'border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'
                        }`}>
                          {fb.text}
                          {fb.type === 'revision' && (
                            <Badge className="mt-3 block w-fit rounded-sm border-0 bg-amber-500 px-2 py-0 hover:bg-amber-600">Required Revision</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Area */}
              <div className="flex w-full flex-col bg-white p-6 md:w-1/2 lg:w-2/5 dark:bg-slate-950">
                <h3 className="mb-4 font-semibold text-slate-800 text-sm dark:text-slate-200">Post a Response or Note</h3>
                <Textarea 
                  placeholder="Type your response or internal note here..." 
                  className="min-h-[200px] flex-1 resize-none rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/50"
                />
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button className="rounded-full border-0 bg-blue-600 px-6 font-medium text-white shadow-sm transition-all hover:bg-blue-700">
                    <Send className="mr-2 h-4 w-4" /> Send Update
                  </Button>
                </div>
              </div>

            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-0 focus-visible:outline-none">
            <Card className="w-full max-w-3xl rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
              <CardHeader className="border-slate-100 border-b bg-slate-50/30 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Revision History</CardTitle>
                <CardDescription>Track all versions and status changes for this proposal.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-8">
                  {history.map((item, i) => (
                    <div
                      key={`${item.version}-${item.date}-${item.action}`}
                      className="relative flex gap-6"
                    >
                      {i !== history.length - 1 && (
                        <div className="absolute top-8 bottom-[-2rem] left-[5.5rem] w-px bg-slate-200 dark:bg-slate-800" />
                      )}
                      <div className="w-16 shrink-0 pt-1 text-right">
                        <Badge variant="outline" className="rounded border border-slate-200 bg-slate-50 font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.version}</Badge>
                      </div>
                      <div className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full bg-blue-500 ring-4 ring-white dark:ring-slate-950" />
                      <div className="flex flex-1 flex-col gap-1 pb-2">
                        <p className="font-medium text-slate-800 dark:text-slate-100">{item.action}</p>
                        <p className="text-slate-500 text-sm">By {item.author}</p>
                        <p className="mt-1 font-medium text-slate-400 text-xs uppercase tracking-wider">{item.date}</p>
                      </div>
                      <Button variant="outline" size="sm" className="hidden h-8 rounded-full text-xs sm:flex">View Version</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Evaluation / Defence Tab */}
          {SHOW_MOCK_APPOINTMENT && (
            <TabsContent value="evaluation" className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                
                {/* Left Column: Schedule & Action Block */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                  <Card className="rounded-xl border-amber-200/50 bg-gradient-to-b from-amber-50 to-white shadow-md dark:border-amber-900/50 dark:from-amber-950/40 dark:to-slate-950">
                    <CardHeader className="border-amber-100/50 border-b bg-amber-500/10 pb-4 dark:border-amber-900/20 dark:bg-amber-500/5">
                      <CardTitle className="flex items-center gap-2 text-lg text-amber-900 dark:text-amber-400">
                        <Calendar className="h-5 w-5" />
                        Defence Scheduled
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Date & Time (EAT)</p>
                          <p className="mt-0.5 font-bold text-slate-800 text-lg dark:text-slate-200">{mockAppointment.date}</p>
                          <p className="font-medium text-slate-500 text-sm">{mockAppointment.time}</p>
                        </div>
                        <div>
                          <p className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">Location</p>
                          <p className="mt-0.5 font-semibold text-slate-700 text-sm dark:text-slate-300">{mockAppointment.venue}</p>
                        </div>
                        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
                          <p className="font-bold text-[10px] text-amber-700 uppercase tracking-widest dark:text-amber-400">Admin/Coordinator Note</p>
                          <p className="mt-1 text-amber-900 text-sm leading-relaxed dark:text-amber-200">{mockAppointment.message}</p>
                        </div>
                        
                        <div className="mt-2 flex flex-col gap-3">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 font-semibold text-white shadow-sm dark:bg-amber-600 dark:hover:bg-amber-500">
                            Confirm Attendance
                          </Button>
                          <Button variant="outline" className="w-full font-semibold">
                            Propose New Time
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column: Pre-submission & Rubric prep */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                  <Card className="rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                    <CardHeader className="border-slate-100 border-b bg-slate-50/30 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                      <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Pre-Defence Requirements</CardTitle>
                      <CardDescription>Upload necessary materials before the defence date.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4 rounded-xl border border-dashed border-slate-300 p-6 dark:border-slate-700">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                          <Video className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 text-base dark:text-slate-200">Presentation Deck (Required)</h4>
                          <p className="mt-1 text-slate-500 text-sm leading-relaxed dark:text-slate-400">
                            The committee requires your slide deck at least 48 hours before the defence. Accepted formats: PPTX, PDF. Max 50MB.
                          </p>
                          <Button className="mt-4 border-0 font-medium shadow-none bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                            <Paperclip className="mr-2 h-4 w-4" /> Choose File to Upload
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-xl border-slate-200/50 shadow-none dark:border-slate-800/50">
                    <CardHeader className="border-slate-100 border-b bg-slate-50/30 pb-4 dark:border-slate-800 dark:bg-slate-900/10">
                      <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Evaluation Rubric Preview</CardTitle>
                      <CardDescription>What the evaluators will grade your defence on.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between border-slate-100 border-b px-6 py-4 dark:border-slate-800">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm dark:text-slate-200">Clarity and Presentation</p>
                            <p className="text-slate-500 text-xs">How well the problem and solution are articulated.</p>
                          </div>
                          <Badge variant="outline">20 pts</Badge>
                        </div>
                        <div className="flex items-center justify-between border-slate-100 border-b px-6 py-4 dark:border-slate-800">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm dark:text-slate-200">Methodology Rigor</p>
                            <p className="text-slate-500 text-xs">Quality of experimental design, feasibility, and technical depth.</p>
                          </div>
                          <Badge variant="outline">35 pts</Badge>
                        </div>
                        <div className="flex items-center justify-between px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800 text-sm dark:text-slate-200">Q&A Handling</p>
                            <p className="text-slate-500 text-xs">Ability to defend the premise against panel critique.</p>
                          </div>
                          <Badge variant="outline">25 pts</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}

        </div>
      </Tabs>
    </div>
  );
}
