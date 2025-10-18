import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarLinkProps {
  link: Links;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div> & {
  mobileLogo?: React.ReactNode;
}) => {
  const { mobileLogo, ...rest } = props;
  return (
    <>
      <DesktopSidebar {...rest} />
      <MobileSidebar {...(rest as React.ComponentProps<"div">)} mobileLogo={mobileLogo} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-emerald-500/20 backdrop-blur-[48px] backdrop-saturate-[140%] border-r border-emerald-500/25 w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "80px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  mobileLogo,
  ...props
}: React.ComponentProps<"div"> & {
  mobileLogo?: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* Mobile Header Bar */}
      <div
        className={cn(
          "h-16 px-4 flex flex-row md:hidden items-center justify-between bg-emerald-500/20 backdrop-blur-[48px] backdrop-saturate-[140%] border-b border-emerald-500/25 w-full relative z-10"
        )}
        {...props}
      >
        <div className="flex items-center z-10">
          {mobileLogo}
        </div>
        <button
          className="flex items-center z-10 p-2 -mr-2 hover:bg-emerald-500/20 rounded-lg transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <Menu className="text-white h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="fixed inset-y-0 left-0 w-[85vw] max-w-sm bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 z-[100] md:hidden shadow-2xl"
            >
              {/* Close Button */}
              <button
                className="absolute right-4 top-4 z-50 text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Drawer Content */}
              <div className="relative h-full w-full flex flex-col px-6 pt-16 pb-8 overflow-y-auto overflow-x-hidden">
                {/* Explicitly render children with forced visibility */}
                <div className="flex flex-col gap-8 w-full text-white">
                  {children}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  onClick,
}: SidebarLinkProps) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center justify-start gap-3 group/sidebar py-2 relative",
        className
      )}
      onClick={onClick}
    >
      <span className="flex-shrink-0 flex items-center justify-center">
        {link.icon}
      </span>
      <span
        className={cn(
          "text-sm group-hover/sidebar:translate-x-1 transition-transform duration-150 whitespace-pre flex-1",
          // Desktop behavior: hide text when collapsed
          animate && !open && "md:hidden md:opacity-0",
          (!animate || open) && "md:inline-block md:opacity-100",
          // Mobile behavior: always show text
          "opacity-100 inline-block"
        )}
      >
        {link.label}
      </span>
    </Link>
  );
};
