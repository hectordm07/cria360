type IconName = "tag" | "tree" | "health" | "store" | "spark" | "check" | "verified" | "pin" | "shield" | "users";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
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
  };
  return <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{paths[name]}</svg>;
}
