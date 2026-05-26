'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, MapPin, Phone, User } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { type Locale } from '@/lib/i18n/config';

interface ContactPageClientProps {
  locale: Locale;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactPageClient({ locale }: ContactPageClientProps) {
  const t = useTranslations('contactPage');
  const tCommon = useTranslations('common');
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header locale={locale} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[hsl(var(--color-primary)/0.05)] to-transparent py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-[hsl(var(--color-foreground))] mb-6">
                Get in Touch
              </h1>
              <p className="text-lg text-[hsl(var(--color-muted-foreground))]">
                Have questions regarding our PDF tools, privacy policy, or need technical support? 
                We are here to help. Reach out to us directly or fill out the form below.
              </p>
            </div>
          </div>
        </section>

        {/* --- NEW CONTACT DETAILS SECTION (Manish Singh Info) --- */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              
              {/* Box 1: Name */}
              <Card className="p-8 text-center flex flex-col items-center hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                  <User className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--color-foreground))] mb-2">Owner & Developer</h3>
                <p className="text-[hsl(var(--color-muted-foreground))] font-medium">Manish Singh</p>
                <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-1">PDFTara Administrator</p>
              </Card>

              {/* Box 2: Address */}
              <Card className="p-8 text-center flex flex-col items-center hover:shadow-lg transition-shadow border-t-4 border-t-green-500">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-4 text-green-600">
                  <MapPin className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--color-foreground))] mb-2">Office Address</h3>
                <p className="text-[hsl(var(--color-muted-foreground))] text-sm leading-relaxed">
                  Raja Habeli, Chotikothi Peeche<br />
                  Mo. Kotriyast<br />
                  Bhinga, Shrawasti, Pin 271831<br />
                  Uttar Pradesh, India
                </p>
              </Card>

              {/* Box 3: Phone */}
              <Card className="p-8 text-center flex flex-col items-center hover:shadow-lg transition-shadow border-t-4 border-t-purple-500">
                <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mb-4 text-purple-600">
                  <Phone className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--color-foreground))] mb-2">Contact Number</h3>
                <p className="text-[hsl(var(--color-muted-foreground))] font-medium">+91 9451091583</p>
                <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-1">Available: Mon-Fri (10 AM - 6 PM)</p>
              </Card>

            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-[hsl(var(--color-muted)/0.3)]">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-3">
                  Send us a Message
                </h2>
                <p className="text-[hsl(var(--color-muted-foreground))]">
                  Prefer email? Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              {formStatus === 'success' ? (
                <Card className="p-10 text-center border-green-200 bg-green-50/50">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-[hsl(var(--color-muted-foreground))] mb-8">
                    Thank you for contacting us. We have received your message and will respond shortly.
                  </p>
                  <Button variant="outline" onClick={() => setFormStatus('idle')}>
                    Send Another Message
                  </Button>
                </Card>
              ) : (
                <Card className="p-8 md:p-10 shadow-xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-[hsl(var(--color-foreground))] mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-[hsl(var(--color-foreground))] mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[hsl(var(--color-foreground))] mb-2">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="business">Business / Partnership</option>
                        <option value="feedback">Feedback & Suggestions</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[hsl(var(--color-foreground))] mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))] resize-none"
                        placeholder="How can we help you today?"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full py-4 text-lg font-bold"
                      loading={formStatus === 'submitting'}
                      disabled={formStatus === 'submitting'}
                    >
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                      {formStatus !== 'submitting' && <Send className="ml-2 h-5 w-5" />}
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-[hsl(var(--color-muted-foreground))]" />
              <h2 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mb-4">
                Looking for quick answers?
              </h2>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-8">
                Check out our Frequently Asked Questions section for immediate help with common issues.
              </p>
              <Link href={`/${locale}/faq`}>
                <Button variant="outline" className="px-8 py-3">
                  Visit FAQ Center
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