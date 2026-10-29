// Editable placeholders — replace with the instructor's real details before launch.
export const site = {
  brandName: "MAS Academy",
  tagline: "Self-paced courses in coding, robotics, finance, maths & science",
  currency: "USD",
  locale: "en",
  dir: "ltr" as "ltr" | "rtl",
  contact: {
    email: "Mohammad_ali_saleh@hotmail.com",
    phone: "+961 70 804 147",
    location: "Chouaifet, El Aamroussieh 1500",
  },
  social: [
    { label: "YouTube", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
  ],
  instructor: {
    name: "Mohammad Ali Saleh",
    title: "Business Administration Specialist & Educator",
    bio: "Two decades in business administration and seven years teaching school students — bringing real-world finance and technology into clear, practical lessons.",
    qualifications: [
      "Master's degree in Accounting and Auditing",
      "License (Bachelor's) in Finance",
      "License (Bachelor's) in Informatics",
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
