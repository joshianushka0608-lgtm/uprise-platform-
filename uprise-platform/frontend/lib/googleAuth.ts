"use client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { access_token?: string; credential?: string }) => void;
          }) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement,
            options: { theme?: string; size?: string; text?: string; width?: number }
          ) => void;
        };
      };
    };
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  return new Promise((resolve) => {
    // Check if Google Identity Services is loaded
    if (!window.google) {
      // Load Google Identity Services script dynamically
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleSignIn(resolve);
      };
      script.onerror = () => {
        resolve({ success: false, error: "Failed to load Google Sign-In" });
      };
      document.head.appendChild(script);
    } else {
      initGoogleSignIn(resolve);
    }
  });
}

function initGoogleSignIn(
  resolve: (result: { success: boolean; error?: string }) => void
) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    // No Google Client ID configured — fall back to demo mode
    // For development/demo, simulate a successful sign-in
    simulateDemoSignIn(resolve);
    return;
  }

  window.google!.accounts.id.initialize({
    client_id: clientId,
    callback: async (response) => {
      if (response.credential) {
        // Decode the JWT credential to get user info
        const payload = JSON.parse(atob(response.credential.split(".")[1]));

        try {
          const res = await fetch(`${API_URL}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              google_id: payload.sub,
              email: payload.email,
              name: payload.name,
              avatar_url: payload.picture,
            }),
          });

          const data = await res.json();

          if (res.ok && data.token) {
            localStorage.setItem("uprise_token", data.token);
            localStorage.setItem("uprise_user", JSON.stringify(data.user));
            resolve({ success: true });
          } else {
            resolve({ success: false, error: data.error || "Authentication failed" });
          }
        } catch {
          resolve({ success: false, error: "Could not connect to server" });
        }
      } else {
        resolve({ success: false, error: "No credential received from Google" });
      }
    },
  });

  // Trigger the one-tap or button prompt
  window.google!.accounts.id.prompt();
}

async function simulateDemoSignIn(
  resolve: (result: { success: boolean; error?: string }) => void
) {
  // Demo mode: create a fake user for testing without Google credentials
  const demoUser = {
    id: "demo-" + Math.random().toString(36).substr(2, 9),
    name: "Demo User",
    email: "demo@" + Date.now() + ".com",
    roles: ["learner"],
    student_id_verified: false,
    created_at: new Date().toISOString(),
  };

  // Store in localStorage
  localStorage.setItem("uprise_token", "demo-token-" + Date.now());
  localStorage.setItem("uprise_user", JSON.stringify(demoUser));
  localStorage.setItem("uprise_demo_mode", "true");

  resolve({ success: true });
}
