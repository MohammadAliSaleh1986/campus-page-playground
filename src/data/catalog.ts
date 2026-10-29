// Sample development data. Prices are placeholders, not real prices.
// Stage 2 replaces this module with database-backed queries.
import coding from "@/assets/course-coding.jpg";
import finance from "@/assets/course-finance.jpg";
import robotics from "@/assets/course-robotics.jpg";

export type Subject = "coding" | "robotics" | "finance" | "mathematics" | "science";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type AgeGroup = "10-12" | "13-15" | "16-18" | "Adults";
export type Format = "Video" | "Video + Quizzes" | "Project-based";

export interface Lesson { title: string; minutes: number; preview?: boolean }
export interface Section { title: string; lessons: Lesson[] }
export interface Course {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  subject: Subject;
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  format: Format;
  price: number;
  featured: boolean;
  publishedAt: string;
  includedInSubscription: boolean;
  objectives: string[];
  prerequisites: string[];
  requirements: string[];
  curriculum: Section[];
  faqs: { q: string; a: string }[];
}

export const subjects: { id: Subject; label: string; blurb: string }[] = [
  { id: "coding", label: "Coding", blurb: "Logic, programming and building apps" },
  { id: "robotics", label: "Robotics", blurb: "Sensors, motors and smart machines" },
  { id: "finance", label: "Finance", blurb: "Money, saving and business basics" },
  { id: "mathematics", label: "Mathematics", blurb: "Clear foundations, real problems" },
  { id: "science", label: "Science", blurb: "Curiosity through experiments" },
];

const commonFaqs = [
  { q: "How long do I have access?", a: "Individual purchases include lifetime access to the course unless stated otherwise." },
  { q: "Do I need to attend live sessions?", a: "No. Every lesson is recorded so you can learn at your own pace." },
];

export const courses: Course[] = [
  {
    slug: "coding-foundations",
    title: "Coding Foundations for Young Creators",
    subtitle: "Think like a programmer with blocks, then Python",
    description: "A friendly first step into programming. Students build games and small tools while learning variables, loops, conditions and functions.",
    thumbnail: coding,
    subject: "coding",
    difficulty: "Beginner",
    ageGroup: "10-12",
    format: "Project-based",
    price: 49,
    featured: true,
    publishedAt: "2026-09-10",
    includedInSubscription: true,
    objectives: ["Understand sequences, loops and conditions", "Build three small games", "Write first Python programs", "Debug code with confidence"],
    prerequisites: ["Basic reading and typing skills"],
    requirements: ["A computer with a modern browser", "Curiosity!"],
    curriculum: [
      { title: "Getting started", lessons: [{ title: "Welcome & how this course works", minutes: 5, preview: true }, { title: "What is code?", minutes: 9, preview: true }] },
      { title: "Block coding", lessons: [{ title: "Sequences and events", minutes: 14 }, { title: "Loops", minutes: 16 }, { title: "Project: Maze game", minutes: 25 }] },
      { title: "Hello, Python", lessons: [{ title: "Variables and input", minutes: 15 }, { title: "If / else", minutes: 17 }, { title: "Project: Quiz app", minutes: 28 }] },
    ],
    faqs: commonFaqs,
  },
  {
    slug: "money-smart-teens",
    title: "Money Smart: Personal Finance for Teens",
    subtitle: "Budgeting, saving and how businesses make money",
    description: "Practical finance taught by an accounting professional. Learn to budget, understand interest, and read a simple income statement.",
    thumbnail: finance,
    subject: "finance",
    difficulty: "Beginner",
    ageGroup: "13-15",
    format: "Video + Quizzes",
    price: 39,
    featured: true,
    publishedAt: "2026-08-22",
    includedInSubscription: true,
    objectives: ["Build a personal budget", "Understand saving and compound interest", "Know the difference between needs and wants", "Read a simple business statement"],
    prerequisites: ["Basic arithmetic"],
    requirements: ["Notebook or spreadsheet app"],
    curriculum: [
      { title: "Money basics", lessons: [{ title: "Where money comes from", minutes: 8, preview: true }, { title: "Needs vs wants", minutes: 11 }] },
      { title: "Budgeting & saving", lessons: [{ title: "Your first budget", minutes: 18 }, { title: "Compound interest", minutes: 15 }, { title: "Quiz: Saving", minutes: 10 }] },
      { title: "Business thinking", lessons: [{ title: "Revenue, costs, profit", minutes: 16 }, { title: "Reading an income statement", minutes: 20 }] },
    ],
    faqs: commonFaqs,
  },
  {
    slug: "robotics-starter",
    title: "Robotics Starter: Build & Program",
    subtitle: "Sensors, motors and your first autonomous robot",
    description: "Learn how robots sense and move. Program simulated and real robots to follow lines, avoid obstacles and solve challenges.",
    thumbnail: robotics,
    subject: "robotics",
    difficulty: "Intermediate",
    ageGroup: "13-15",
    format: "Project-based",
    price: 59,
    featured: true,
    publishedAt: "2026-10-01",
    includedInSubscription: false,
    objectives: ["Explain how sensors and motors work", "Program a line-following robot", "Design obstacle-avoidance logic", "Plan and test a robotics project"],
    prerequisites: ["Coding Foundations or equivalent"],
    requirements: ["Computer with browser (simulator included)", "Optional: a beginner robotics kit"],
    curriculum: [
      { title: "How robots work", lessons: [{ title: "Sense, think, act", minutes: 10, preview: true }, { title: "Motors and wheels", minutes: 14 }] },
      { title: "Programming robots", lessons: [{ title: "Using the simulator", minutes: 12 }, { title: "Line following", minutes: 22 }, { title: "Obstacle avoidance", minutes: 24 }] },
      { title: "Final challenge", lessons: [{ title: "Project brief", minutes: 8 }, { title: "Build, test, improve", minutes: 30 }] },
    ],
    faqs: commonFaqs,
  },
];

export const courseMinutes = (c: Course) =>
  c.curriculum.reduce((t, s) => t + s.lessons.reduce((a, l) => a + l.minutes, 0), 0);
export const lessonCount = (c: Course) => c.curriculum.reduce((t, s) => t + s.lessons.length, 0);
export const formatDuration = (min: number) => `${Math.floor(min / 60)}h ${min % 60}m`;

export interface Plan {
  id: string;
  name: string;
  price: number | null;
  interval: "one-time" | "month" | "year";
  enabled: boolean;
  summary: string;
  benefits: string[];
  expires: string;
  renews: string;
  highlight?: boolean;
}

export const plans: Plan[] = [
  {
    id: "single", name: "Individual course", price: null, interval: "one-time", enabled: true,
    summary: "Buy only the course you need.",
    benefits: ["Full access to one course", "All lessons, quizzes and resources", "Progress tracking"],
    expires: "Lifetime access to that course", renews: "No — single payment",
  },
  {
    id: "monthly", name: "Monthly access", price: 19, interval: "month", enabled: true, highlight: true,
    summary: "Explore every eligible course.",
    benefits: ["All subscription-eligible courses", "New courses as they launch", "Cancel any time"],
    expires: "Access ends when the subscription ends", renews: "Yes — renews monthly until cancelled",
  },
  {
    id: "annual", name: "Annual access", price: 169, interval: "year", enabled: true,
    summary: "Best value for a full year of learning.",
    benefits: ["Everything in Monthly", "Two months free vs monthly", "Cancel renewal any time"],
    expires: "Access ends when the subscription ends", renews: "Yes — renews yearly until cancelled",
  },
];

export const generalFaqs = [
  { q: "Who are the courses for?", a: "Mainly school students aged about 10–18, plus anyone curious about finance and technology." },
  { q: "Are the lessons live?", a: "No. All courses are recorded, so students learn at their own pace, any time." },
  { q: "What's the difference between buying a course and subscribing?", a: "Buying gives lasting access to one course. A subscription unlocks all eligible courses while it is active." },
  { q: "Can parents follow progress?", a: "Students see their progress on their dashboard; parent-friendly reports are planned." },
  { q: "Can I cancel a subscription?", a: "Yes, at any time. You keep access until the end of the period you already paid for." },
  { q: "Do I get a certificate?", a: "Completion certificates are planned for courses that finish with a final assessment." },
];
