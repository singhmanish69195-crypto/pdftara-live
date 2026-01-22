'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Shield, Zap, Globe, Heart, Lock, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { type Locale } from '@/lib/i18n/config';

interface AboutPageClientProps {
  locale: Locale;
}

export default function AboutPageClient({ locale }: AboutPageClientProps) {
  const t = useTranslations('common');
  
  // Static Values taaki Translation ka error na aaye
  const values = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your files never leave your device. Processing happens locally in your browser.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Powered by WebAssembly for instant PDF processing without server latency.',
    },
    {
      icon: Globe,
      title: 'Accessible',
      description: 'Designed to be easy to use for everyone, everywhere, on any device.',
    },
    {
      icon: Heart,
      title: 'Free Forever',
      description: 'We believe essential PDF tools should be free and accessible to all.',
    },
    {
      icon: Lock,
      title: 'Secure by Design',
      description: 'No data collection, no hidden tracking, and 100% GDPR compliant.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built with feedback from users like you to solve real-world document problems.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[hsl(var(--color-primary)/0.1)] via-[hsl(var(--color-background))] to-[hsl(var(--color-secondary)/0.1)] py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-black text-[hsl(var(--color-foreground))] mb-6 tracking-tight">
                About {t('brand')}
              </h1>
              <p className="text-xl text-[hsl(var(--color-muted-foreground))] mb-8 leading-relaxed">
                We are on a mission to make PDF editing simple, private, and free for everyone. 
                No servers, no uploads, just pure performance.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-8 text-center">
                Our Mission
              </h2>
              <div className="prose prose-lg max-w-none text-[hsl(var(--color-muted-foreground))] leading-loose">
                <p className="mb-6">
                  In a world where digital privacy is constantly challenged, handling sensitive documents online can be scary. Most online PDF tools upload your files to a remote server to process them. We asked ourselves: <strong>"Why send the file away when your computer is powerful enough to do it?"</strong>
                </p>
                <p className="mb-6">
                  That's why we built {t('brand')}. We utilize cutting-edge browser technologies like <strong>WebAssembly</strong> to run powerful PDF manipulation code directly inside your web browser.
                </p>
                <p>
                  The result? Your documents never leave your computer. You get the speed of a desktop application with the convenience of a website. It's safer, faster, and smarter.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-[hsl(var(--color-muted)/0.3)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-12 text-center">
              Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="p-8 border border-[hsl(var(--color-border))]" hover>
                    <div className="flex items-start gap-5">
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[hsl(var(--color-primary)/0.1)] flex items-center justify-center">
                        <Icon className="h-7 w-7 text-[hsl(var(--color-primary))]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[hsl(var(--color-foreground))] mb-3">
                          {value.title}
                        </h3>
                        <p className="text-sm text-[hsl(var(--color-muted-foreground))] leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white border border-slate-100 rounded-[2.5rem] p-10 md:p-16 shadow-xl shadow-slate-200/50">
              <h2 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-8 text-center">
                The Technology Stack
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div>
                    <p className="text-[hsl(var(--color-muted-foreground))] mb-6 text-lg">
                      We use the latest web standards to deliver a native-app-like experience in your browser.
                    </p>
                    <ul className="space-y-4">
                      {[
                        "Next.js 14 for blazing fast performance",
                        "WebAssembly for complex PDF processing",
                        "Service Workers for offline capabilities",
                        "Tailwind CSS for responsive design",
                        "Client-Side Encryption for security"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-[hsl(var(--color-foreground))] font-medium">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                 </div>
                 <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center">
                    <div className="text-center">
                       <div className="text-6xl font-black text-slate-200 mb-2">100%</div>
                       <div className="text-xl font-bold text-slate-400">Client Side</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[hsl(var(--color-primary)/0.05)]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-6">
                Ready to get started?
              </h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-10 text-lg">
                Experience the privacy and speed of {t('brand')} today. No registration required.
              </p>
              <Link href={`/${locale}/tools`}>
                <Button variant="primary" size="lg" className="rounded-full px-10 py-6 text-lg">
                  Explore Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}