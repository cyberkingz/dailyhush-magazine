import { motion } from "framer-motion";
import { TestimonialsColumn, type Testimonial } from "./ui/testimonials-column";

const testimonials: Testimonial[] = [
  {
    text: "I used to replay work conversations for hours. The F.I.R.E. method gave me a way to interrupt that spiral in under 2 minutes. Game changer.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Sarah M.",
    role: "Marketing Director, 34",
  },
  {
    text: "The polyvagal exercises actually worked when I was spiraling at 3 AM. First time I've found something that helps in the moment, not just theory.",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    name: "Jessica T.",
    role: "Software Engineer, 29",
  },
  {
    text: "I've done years of therapy. This is the first resource that gave me concrete tools I could use when my brain wouldn't shut up. Wish I'd found it sooner.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Rachel K.",
    role: "Therapist, 41",
  },
  {
    text: "The detached mindfulness practices from MCT are exactly what I needed. No more getting stuck in 'what if' loops before presentations.",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    name: "Amanda L.",
    role: "Teacher, 37",
  },
  {
    text: "Finally, something that addresses the physical symptoms of overthinking. The nervous system regulation tools are surprisingly effective.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Emily R.",
    role: "Physician, 44",
  },
  {
    text: "I was skeptical, but the RF-CBT concrete processing exercises helped me stop ruminating about family conflicts. Actually works.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Priya S.",
    role: "HR Manager, 32",
  },
  {
    text: "The Window of Tolerance mapping helped me understand why I spiral. Now I can catch it before I'm fully dysregulated. Brilliant.",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    name: "Lauren B.",
    role: "Researcher, 39",
  },
  {
    text: "Used the emergency interrupt protocol during a panic attack. It worked. I've been using F.I.R.E. daily for 3 weeks now.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Maria G.",
    role: "Entrepreneur, 28",
  },
  {
    text: "The cognitive distortion tracking opened my eyes to patterns I didn't know I had. Worth every penny for that alone.",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    name: "Diana W.",
    role: "Writer, 36",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const Testimonials = () => {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75">
            Real experiences from women who've used the F.I.R.E. method.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
