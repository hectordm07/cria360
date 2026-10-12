type IconName = "home" | "box" | "wallet" | "chart" | "help" | "tag" | "tree" | "health" | "store" | "spark" | "check" | "verified" | "pin" | "shield" | "users" | "scan" | "logout" | "menu" | "close" | "search";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 10 9-7 9 7v10H3V10Z" /><path d="M9 20v-7h6v7" /></>,
    box: <><path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z" /><path d="m3 7 9 4 9-4M12 11v10M7.5 5l9 4" /></>,
    wallet: <><path d="M4 5h15v15H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M2 8h17M16 12h6v5h-6zM18.5 14.5h.01" /></>,
    chart: <><path d="M4 3v18h17M8 17v-5M13 17V8M18 17V4" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 8.5a2.5 2.5 0 1 1 4 2c-1.5 1-1.5 1-1.5 2M12 16h.01" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    tag: <><path d="M20 13 13 20l-9-9V4h7l9 9Z"/><path d="M8.5 8.5h.01"/></>,
    tree: <><circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M12 7.5v4m0 0H6v4m6-4h6v4"/></>,
    health: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/><path d="M8 12h2l1-2 2 4 1-2h2"/></>,
    store: <><path d="M3 10h18M5 10v10h14V10M4 4h16l1 6H3l1-6Z"/><path d="M9 14h6v6"/></>,
    spark: <><path d="m12 3 1.3 4.2L17 9l-3.7 1.8L12 15l-1.3-4.2L7 9l3.7-1.8L12 3Z"/><path d="m5 15 .7 2.3L8 18.5l-2.3 1.2L5 22l-.7-2.3L2 18.5l2.3-1.2L5 15Zm14-4 .6 1.8 1.9.9-1.9.9L19 16.5l-.6-1.9-1.9-.9 1.9-.9L19 11Z"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    verified: <><path d="M12 2.5 15 4l3.4-.2.2 3.4 1.9 2.8-1.9 2.8-.2 3.4-3.4-.2-3 1.5-3-1.5-3.4.2-.2-3.4L3.5 10l1.9-2.8.2-3.4L9 4l3-1.5Z"/><path d="m8.5 10 2.2 2.2 4.8-4.8"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    scan: <><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8h3v3H7zM14 8h3v3h-3zM7 14h3v3H7zM14 14h1.5M17 14v3h-3"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></>,
  };
  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{paths[name]}</svg>;
}


