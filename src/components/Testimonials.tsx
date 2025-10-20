import { motion } from "framer-motion";
import { TestimonialsColumn, type Testimonial } from "./ui/testimonials-column";

// Using customer reviews from product page for authenticity
const testimonials: Testimonial[] = [
  {
    text: "my therapist literally begged me to try breathing exercises and I never did them bc I'd forget. having this on my body all the time means I actually use it. I breathe through it before going into target (weird I know but stores stress me out), before bed, sometimes just on the couch. the silver is really pretty btw, got 3 compliments already",
    name: "Megan K.",
    role: "Denver, CO",
  },
  {
    text: "I replay stuff in my head alllll the time its exhausting. Got this and it does work when I remember to use it. The breathing felt weird at first like I was doing it wrong?? Watched the video again and figured it out. Good for before presentations. Shipping was fast too which was nice",
    name: "Kristen P.",
    role: "San Diego, CA",
  },
  {
    text: "I'm a middle school teacher so you can imagine my stress levels lol. I worry about EVERYTHING - parent emails, lesson plans, did I say the wrong thing to a student, etc etc. This has been really helpful for when I start getting in my head. Not a cure but it helps me reset. Used it before a tough parent meeting last week and it genuinely made a difference",
    name: "Sarah T.",
    role: "Chicago, IL",
  },
  {
    text: "freelance graphic designer = constant anxiety about money and clients. This has become part of my morning routine now. Coffee, breathing necklace, open laptop lol. I use it throughout the day when I start stressing about stuff. Doesn't make my problems go away but stops me from spiraling for hours. Also its actually cute so thats a bonus",
    name: "Lauren H.",
    role: "Boston, MA",
  },
  {
    text: "work in sales and I stress about every client call. Did I talk too much? Should I follow up? This has become my ritual before calls. Takes 90 seconds and I feel way more centered. Also after bad calls it helps me move on instead of obsessing. Color matches all my work clothes",
    name: "Nicole D.",
    role: "Minneapolis, MN",
  },
  {
    text: "I overthink social stuff constantly, like things I said years ago will randomly pop in my head and I cringe. Started using this and its part of my routine now. Morning coffee then breathing then I can function lol. Use it during my commute too. Rose gold is gorgeous btw and people keep asking where I got it. I tell them its a breathing necklace and they look at me like im crazy",
    name: "Alison F.",
    role: "Charlotte, NC",
  },
  {
    text: "chronic what if person. this interrupts that loop when I use it. not instant but way better than trying to just tell myself to stop which never worked. good for meetings when I start panicking about something I said",
    name: "Rebecca H.",
    role: "San Francisco, CA",
  },
  {
    text: "I'm 52 and been an overthinker forever. Tried therapy meditation apps all of it. This actually helps when I start obsessing about something. Wear it daily use it multiple times. Looks like regular jewelry not a wellness thing. Wish I found this years ago",
    name: "Patricia G.",
    role: "Houston, TX",
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
