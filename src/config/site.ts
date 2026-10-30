import instructorPhoto from "@/assets/mohammad-ali-saleh.png.asset.json";

export const site = {
  brandName: "MAS Academy",
  tagline: "Self-paced courses in coding, robotics, finance, maths & science",
  currency: "USD",
  locale: "en",
  dir: "ltr" as "ltr" | "rtl",
  contact: {
    email: "mohammadalisalehg@gmail.com",
    phone: "+961 70 804 147",
    location: "Chouaifet, El Aamroussieh 1500",
    whatsapp: "https://wa.me/96170804147",
  },
  social: [
    { label: "YouTube", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "Portfolio", href: "https://mohammadalisaleh.my.canva.site/" },
    { label: "GitHub", href: "#" },
  ],
  instructor: {
    name: "Mohammad Ali Saleh",
    photo: instructorPhoto.url,
    achievements: [
      { value: "60+", label: "students taught", qualifier: "Approximately" },
      { value: "2,000+", label: "technology-skills classes", qualifier: "Around" },
    ],
    title: "Interdisciplinary Educator · Tutor · Business Administration Specialist",
    bio: "A tutor and business administration specialist connecting coding, robotics, mathematics, science, finance and business through practical learning — two decades in business and seven years teaching school students.",
    qualifications: [
      "Master's degree in Accounting and Auditing",
      "License (Bachelor's) in Finance",
      "License (Bachelor's) in Business Informatics",
    ],
    experience: [
      { years: 20, label: "years as a Business Administration Specialist" },
      { years: 7, label: "years teaching Coding, Robotics, Finance, Maths & Science" },
    ],
  },
};

export function formatPrice(amount: number, currency = site.currency) {
  return new Intl.NumberFormat(site.locale, { style: "currency", currency }).format(amount);
}
