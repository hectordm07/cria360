"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "./icon";

export function AccountLink({ mobile = false }: { mobile?: boolean }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const href = signedIn ? "/cuenta" : "/ingresar";
  const label = signedIn ? "Mi cuenta" : "Ingresar";

  return mobile
    ? <Link href={href} aria-label={label}><span className="mobile-nav-icon"><Icon name="users" size={21} /></span><span>{signedIn ? "Cuenta" : "Ingresar"}</span></Link>
    : <Link className="login-link" href={href}>{label}</Link>;
}
