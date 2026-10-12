"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleSignInButton({ preview = false }: { preview?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function signIn() {
    setLoading(true);
    setErrorMessage("");

    try {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/cuenta`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setErrorMessage("El acceso con Google aún no está disponible. Inténtalo nuevamente más tarde.");
      setLoading(false);
    }
    } catch {
      setErrorMessage("Revisa tu conexión y vuelve a intentar el acceso con Google.");
      setLoading(false);
    }
  }

  return (
    <>
      <button className="google-signin" type="button" onClick={signIn} disabled={loading || preview}>
        <span aria-hidden="true" className="google-mark">G</span>
        {loading ? "Conectando…" : "Continuar con Google"}
      </button>
      {errorMessage && <p className="auth-error" role="alert">{errorMessage}</p>}
    </>
  );
}

