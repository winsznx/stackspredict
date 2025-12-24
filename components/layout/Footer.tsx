import Link from 'next/link';
import { Twitter, Github, BookOpen } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="w-full border-t border-border bg-background mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="font-bold text-foreground mb-4">StacksPredict</h3>
                        <p className="text-sm text-muted-foreground">
                            A Bitcoin-native prediction market built on Stacks, bringing the future of decentralized forecasting.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    Markets
                                </Link>
                            </li>
                            <li>
                                <Link href="/portfolio" className="text-muted-foreground hover:text-primary transition-colors">
                                    Portfolio
                                </Link>
                            </li>
                            <li>
                                <Link href="/create" className="text-muted-foreground hover:text-primary transition-colors">
                                    Create Market
                                </Link>
                            </li>
                            <li>
                                <Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">
                                    Leaderboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Settlement Sources
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Network */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Community</h3>
                        <div className="flex space-x-4 mb-4">
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                aria-label="Documentation"
                            >
                                <BookOpen className="h-5 w-5" />
                            </a>
                        </div>
                        <div className="text-sm">
                            <p className="text-muted-foreground mb-1">Network Status</p>
                            <div className="flex items-center space-x-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <span className="text-xs text-muted-foreground">Stacks Testnet</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} StacksPredict. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Built on Bitcoin L2 with Stacks</p>
                </div>
            </div>
        </footer>
    );
}
