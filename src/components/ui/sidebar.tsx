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

export const SidebarBody = (props: React.ComponentProps<typeof motion.div> & { pageTitle?: string }) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div"> & { pageTitle?: string })} />
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
        "h-screen hidden md:flex md:flex-col flex-shrink-0",
        open ? "px-4" : "px-2",
        "py-4",
        className
      )}
      animate={{
        width: animate ? (open ? "240px" : "60px") : "240px",
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
  pageTitle,
  ...props
}: React.ComponentProps<"div"> & {
  pageTitle?: string;
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* Enhanced Mobile Header - Emerald Liquid Glass */}
      <div
        className={cn(
          // Container structure - optimized height for content
          "h-16 px-4 flex flex-row md:hidden items-center justify-between w-full gap-3",
          // Emerald liquid glass background
          "bg-emerald-500/25 backdrop-blur-[48px] backdrop-saturate-[200%]",
          // Refined border and shadow system
          "border-b border-emerald-400/20",
          "shadow-[0_8px_16px_-4px_rgba(16,185,129,0.12),0_16px_32px_-8px_rgba(16,185,129,0.18),0_1px_0_0_rgba(255,255,255,0.12)_inset]",
          // Smooth transitions
          "transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        )}
        {...props}
      >
        {/* Left: Logo/Brand */}
        <Link
          to="/admin/dashboard"
          className="flex-shrink-0 flex items-center gap-2"
          aria-label="DailyHush Admin Home"
        >
          <img
            src="/rounded-logo.png"
            alt="DailyHush"
            className="h-8 w-8 rounded-full flex-shrink-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          />
          <span className="text-white font-semibold text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] hidden xs:inline">
            DailyHush
          </span>
        </Link>

        {/* Center: Page Title (collapses on small screens) */}
        {pageTitle && (
          <div className="flex-1 flex justify-center px-2 min-w-0 hidden sm:flex">
            <h1 className="text-white/90 text-sm font-medium truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
              {pageTitle}
            </h1>
          </div>
        )}

        {/* Right: Menu Button - Liquid Glass Interactive */}
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            // Touch target - 44x44px minimum
            "flex-shrink-0 w-11 h-11 flex items-center justify-center",
            // Liquid glass button
            "bg-[hsla(200,14%,78%,0.12)] backdrop-blur-[16px] backdrop-saturate-[180%]",
            "rounded-[12px]",
            "border border-emerald-400/15",
            "shadow-[0_2px_4px_-2px_rgba(31,45,61,0.06),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
            // Interactive states
            "transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
            "active:scale-95",
            "hover:bg-[hsla(200,14%,78%,0.18)]",
            "hover:shadow-[0_4px_8px_-2px_rgba(31,45,61,0.08),0_2px_4px_rgba(16,185,129,0.08),0_1px_0_0_rgba(255,255,255,0.2)_inset]",
            "hover:-translate-y-[0.5px]",
            // Focus states for accessibility
            "focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-emerald-950"
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <Menu className="text-white h-5 w-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 p-10 z-[100] flex flex-col justify-between",
              // Emerald liquid glass mobile sidebar
              "bg-emerald-500/35 backdrop-blur-[48px] backdrop-saturate-[140%]",
              "border-r border-emerald-500/25",
              className
            )}
          >
            {/* Close Button - Enhanced with liquid glass */}
            <button
              className={cn(
                "absolute right-6 top-6 z-50",
                "w-11 h-11 flex items-center justify-center",
                "bg-[hsla(200,14%,78%,0.12)] backdrop-blur-[16px]",
                "rounded-[12px]",
                "border border-emerald-400/15",
                "shadow-[0_2px_4px_-2px_rgba(31,45,61,0.06),0_1px_0_0_rgba(255,255,255,0.15)_inset]",
                "transition-all duration-[250ms]",
                "active:scale-95",
                "hover:bg-[hsla(200,14%,78%,0.18)]"
              )}
              onClick={() => setOpen(!open)}
              aria-label="Close menu"
            >
              <X className="text-white h-5 w-5" />
            </button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: any;
}) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center group/sidebar rounded-lg transition-colors min-w-0",
        open ? "py-2 px-3 gap-3 justify-start" : "py-2 px-0 justify-center",
        className
      )}
      {...props}
    >
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {link.icon}
      </div>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-nowrap overflow-hidden"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
