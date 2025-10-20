import { motion } from "framer-motion";
import { TestimonialsColumn, type Testimonial } from "./ui/testimonials-column";

const testimonials: Testimonial[] = [
  {
    text: "I scored 8/10 on the quiz. Week 3 of F.I.R.E. and I'm sleeping through the night for the first time in months. Not perfect but way better.",
    name: "Sarah M.",
    role: "Marketing Director, 34",
  },
  {
    text: "Scored 7/10. The breathing exercises actually worked when I woke up mid-panic. I don't know if it's supposed to work that fast but it did. Still using them.",
    name: "Jessica T.",
    role: "Software Engineer, 29",
  },
  {
    text: "okay so I've done years of therapy and this gave me more tools in 2 weeks than I got in 6 months of sessions. wish I'd found it sooner honestly (scored 7/10 btw)",
    name: "Rachel K.",
    role: "Therapist, 41",
  },
  {
    text: "Quiz score 6/10. Before presentations, I'd spiral through every possible way it could go wrong. The exercises helped me stop getting stuck in those 'what if' loops. Took a while to get the hang of it but it works now.",
    name: "Amanda L.",
    role: "Teacher, 37",
  },
  {
    text: "I scored 8/10. After difficult patient conversations, I'd physically tense up and replay everything I said. I didn't realize how much the physical stuff mattered. The body-based exercises are the only thing that's actually helped when I'm spiraling.",
    name: "Emily R.",
    role: "Physician, 44",
  },
  {
    text: "Was skeptical. But after my mom's comments at Sunday dinner, I'd replay the conversation for days. The reframe exercises helped me stop the loop. I don't replay conversations for hours anymore. Actually surprised it worked. (scored 6/10)",
    name: "Priya S.",
    role: "HR Manager, 32",
  },
  {
    text: "I scored 9/10 (chronic overthinker lol). The tracking tools helped me see why I spiral. Now I can catch it before it gets bad. Huge difference.",
    name: "Lauren B.",
    role: "Researcher, 39",
  },
  {
    text: "Scored 9/10. After sending a tough email to an investor, I had a full panic attack. Used the interrupt technique for the first time. It worked. I've been doing F.I.R.E. every morning for 3 weeks now.",
    name: "Maria G.",
    role: "Entrepreneur, 28",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 8);

const Testimonials = () => {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto px-0">
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
