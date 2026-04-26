import { LearnProgressProvider } from '@/components/learn/progress-provider';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <LearnProgressProvider>{children}</LearnProgressProvider>;
}
