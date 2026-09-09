export type Testimonial = {
  name: string;
  business: string;
  rating: number;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Daniyal Ahmed",
    business: "Founder, Coastline Restaurant Group",
    rating: 5,
    quote:
      "AP Solutions Hub rebuilt our site in weeks, not months. Reservations went up almost immediately and the team never made us chase an update.",
  },
  {
    name: "Sara Malik",
    business: "Operations Lead, Northline Logistics",
    rating: 5,
    quote:
      "The dashboard they built finally gave us one place to see fleet performance. Our managers check it every morning now — it's just part of how we run.",
  },
  {
    name: "Bilal Farooq",
    business: "Owner, Summit Construction",
    rating: 5,
    quote:
      "Communication was the difference. Every question got a same-day answer, and the finished website actually looks like the company we've built.",
  },
  {
    name: "Ayesha Raza",
    business: "Marketing Director, Pulse Retail",
    rating: 4,
    quote:
      "Our campaign engagement grew across every channel within the first month. The team adjusted strategy quickly whenever the data called for it.",
  },
  {
    name: "Omar Sheikh",
    business: "Principal, Harborview Developments",
    rating: 5,
    quote:
      "The 3D renders sold units before we broke ground. Clients could actually see the building, and that made every sales conversation easier.",
  },
  {
    name: "Hina Qureshi",
    business: "Founder, Verdant Foods",
    rating: 5,
    quote:
      "They gave us a brand identity that finally matched the quality of our product. Retail buyers noticed the difference in our first pitch meeting.",
  },
];
