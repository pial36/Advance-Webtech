import "@/styles/globals.css";
import {AuthProvider} from "@/pages/utils/authcontext";
import {IdProvider} from "@/pages/utils/idcontext";

export default function App({ Component, pageProps }) {
  return (
      <AuthProvider>
          <IdProvider>
            <Component {...pageProps} />
          </IdProvider>
      </AuthProvider>
  );
}
