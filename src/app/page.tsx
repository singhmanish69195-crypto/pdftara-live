import { redirect } from 'next/navigation';
// Note: Ensure ye path sahi ho tumhari file structure ke hisab se
import { defaultLocale } from '@/lib/i18n/config'; 

export default function RootPage() {
  // Google isse "307 Temporary Redirect" ya "308 Permanent Redirect" maanega
  // Jo ki SEO ke liye healthy hai.
  redirect(`/${defaultLocale}`);
}
