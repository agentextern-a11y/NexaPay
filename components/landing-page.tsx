import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Shield, 
  Globe, 
  Smartphone, 
  CreditCard, 
  ArrowRight, 
  Play,
  Radio,
  Check,
  CheckCheck,
  Wallet,
  Building2,
  Code,
  Users
} from 'lucide-react'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-xl sm:text-2xl text-foreground">NEXA Pay</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">How It Works</a>
              <a href="#products" className="text-muted-foreground hover:text-foreground transition">Products</a>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center glass-card rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                <span className="text-sm text-muted-foreground">Live on mainnet</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6">
                <span className="gradient-text">Tap. Pay.</span>
                <br />
                <span className="gradient-text">Instantly.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-2">
                The next generation of crypto payments.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground/70 mb-8">
                Fast. Secure. Borderless.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/sign-up">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Start Paying <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                  <Play className="w-4 h-4" /> Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative flex justify-center">
              {/* Phone mockup */}
              <div className="relative w-64 sm:w-72 h-[500px] sm:h-[560px] bg-card rounded-[3rem] border-4 border-border p-3 shadow-2xl">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-card rounded-b-2xl z-10" />
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden p-4">
                  <div className="text-xs text-muted-foreground text-center mb-4">9:41</div>
                  <div className="text-sm text-muted-foreground">Hello, Alex</div>
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground">Total Balance</div>
                    <div className="text-2xl font-bold text-foreground">$2,450.75</div>
                    <div className="text-xs text-success">+5.26%</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {['Top Up', 'Send', 'Receive', 'More'].map((action, i) => (
                      <div key={action} className="text-center p-2 bg-secondary rounded-lg">
                        <div className={`w-4 h-4 mx-auto mb-1 rounded ${
                          i === 0 ? 'bg-primary' : i === 1 ? 'bg-accent' : i === 2 ? 'bg-success' : 'bg-muted-foreground'
                        }`} />
                        <div className="text-[10px] text-muted-foreground">{action}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 gradient-bg rounded-full" />
                        <div>
                          <div className="text-xs font-semibold text-foreground">NEXA Wallet</div>
                          <div className="text-[10px] text-muted-foreground">1,250.50 USDC</div>
                        </div>
                      </div>
                      <div className="text-xs text-foreground">$1,250.50</div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-warning rounded-full" />
                        <div>
                          <div className="text-xs font-semibold text-foreground">Bitcoin</div>
                          <div className="text-[10px] text-muted-foreground">0.025 BTC</div>
                        </div>
                      </div>
                      <div className="text-xs text-foreground">$1,125.20</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 sm:-top-8 sm:-right-4 w-14 h-14 sm:w-16 sm:h-16 bg-warning/20 rounded-2xl flex items-center justify-center backdrop-blur-lg border border-warning/30 animate-bounce">
                <span className="text-warning text-xl sm:text-2xl font-bold">BTC</span>
              </div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-4 sm:-left-4 w-12 h-12 sm:w-14 sm:h-14 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-lg border border-primary/30">
                <span className="text-primary text-lg sm:text-xl font-bold">ETH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: '$2.4B+', label: 'Transaction Volume' },
              { value: '120+', label: 'Countries Supported' },
              { value: '850K+', label: 'Users Worldwide' },
              { value: '99.99%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-muted-foreground text-xs sm:text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Built for Everyone</h2>
            <p className="text-muted-foreground text-base sm:text-lg">Powering payments for people and businesses around the world.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {[
              { icon: Users, title: 'Users', desc: 'Pay anywhere instantly with your crypto' },
              { icon: Building2, title: 'Merchants', desc: 'Accept crypto payments with ease' },
              { icon: Code, title: 'Developers', desc: 'Powerful APIs and SDKs to integrate' },
              { icon: Wallet, title: 'Businesses', desc: 'Scale your operations globally' },
            ].map((item) => (
              <div key={item.title} className="feature-card p-4 sm:p-6 rounded-2xl text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          
          {/* Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Zap, title: 'Tap to Pay', desc: 'Just tap your phone or card and pay in seconds with crypto', color: 'text-accent' },
              { icon: Radio, title: 'Instant Settlement', desc: 'Real-time crypto settlement. 24/7. No waiting.', color: 'text-primary' },
              { icon: Shield, title: 'Secure & Private', desc: 'Your assets are protected with bank-grade security', color: 'text-success' },
              { icon: Globe, title: 'Global Payments', desc: 'Pay anywhere in the world with real-time conversion', color: 'text-warning' },
            ].map((feature) => (
              <div key={feature.title} className="glass-card p-5 sm:p-6 rounded-2xl">
                <feature.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${feature.color} mb-3 sm:mb-4`} />
                <h3 className="font-bold text-base sm:text-lg mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground">Four simple steps to pay with crypto</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Smartphone, title: 'Open App', desc: 'Launch NEXA and choose Tap to Pay' },
              { icon: Radio, title: 'Tap Device', desc: 'Hold phone near terminal' },
              { icon: Check, title: 'Confirm', desc: 'Review and confirm the payment' },
              { icon: CheckCheck, title: 'All Set', desc: 'Payment complete in seconds!' },
            ].map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 relative">
                  <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 sm:mt-12">
            <Link href="/sign-up">
              <Button size="lg">Get Started Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">The Future of Payments is Here</h2>
          <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8">NEXA brings the power of crypto to everyday payments.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                Start Paying
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8 sm:mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">N</span>
                </div>
                <span className="font-bold text-xl text-foreground">NEXA Pay</span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">The next generation of crypto payments. Fast. Secure. Borderless.</p>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Roadmap'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
              { title: 'Resources', links: ['Developers', 'Docs', 'Help Center', 'Community'] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-3 sm:mb-4 text-foreground">{section.title}</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-foreground transition">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-border pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">2024 NEXA Pay. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
