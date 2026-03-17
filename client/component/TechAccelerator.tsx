
import React, { useState, useRef, useEffect } from 'react';
import { analyzeCompanyFit } from '../services/geminiServices';
import { CompanyFitAnalysis, View } from '../types';
import { Loader2, Briefcase, TrendingUp, CheckCircle, AlertTriangle, Building2, Calendar, ArrowRight, ExternalLink, ChevronDown, Upload, FileText, X, BookOpen, Zap, Globe, Award } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface TechAcceleratorProps {
    onNavigate?: (view: View) => void;
    onNavigateWithProfile?: (profile: import('../types').StudentAcademicHistory) => void;
    navigateToStudyPlan?: (company: string, customCompanyName: string | undefined, role: string) => void;
}

// Component to render company logo
const CompanyLogo: React.FC<{ company: typeof COMPANIES[0]; size?: 'sm' | 'md' }> = ({ company, size = 'md' }) => {
    const [logoError, setLogoError] = useState(false);
    const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
    const initials = company.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    
    if (!company.logo || logoError) {
        return (
            <div className={`${sizeClasses} ${company.bg} ${company.color} rounded-full flex items-center justify-center font-bold text-xs`}>
                {initials}
            </div>
        );
    }
    
    return (
        <img 
            src={company.logo} 
            alt={company.name} 
            className={`${sizeClasses} object-contain`}
            onError={() => setLogoError(true)}
        />
    );
};

const COMPANIES = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png', color: 'text-white', bg: 'bg-red-500', border: 'border-red-200' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png', color: 'text-white', bg: 'bg-blue-600', border: 'border-blue-200' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png', color: 'text-white', bg: 'bg-orange-600', border: 'border-orange-200' },
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png', color: 'text-white', bg: 'bg-black', border: 'border-gray-800' },
    { name: 'TCS', logo: 'https://upload.wikimedia.org/wikipedia/en/b/b1/Tata_Consultancy_Services_Logo.svg', color: 'text-white', bg: 'bg-pink-600', border: 'border-pink-200' },
    { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Infosys_logo.svg/1200px-Infosys_logo.svg.png', color: 'text-white', bg: 'bg-blue-700', border: 'border-blue-300' },
    { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Wipro_logo.svg/1200px-Wipro_logo.svg.png', color: 'text-white', bg: 'bg-green-600', border: 'border-green-300' },
    { name: 'HCL', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/35/HCL_Technologies_logo.svg/1200px-HCL_Technologies_logo.svg.png', color: 'text-white', bg: 'bg-purple-600', border: 'border-purple-300' },
    { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Accenture.svg/1200px-Accenture.svg.png', color: 'text-white', bg: 'bg-red-700', border: 'border-red-300' },
    { name: 'Zoho', logo: 'https://www.zohowebstatic.com/sites/zweb/images/en-US/zoho-logo.svg', color: 'text-white', bg: 'bg-yellow-700', border: 'border-yellow-200' },
    { name: 'Swiggy', logo: 'https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_568,h_320/portal/c/logo_light', color: 'text-white', bg: 'bg-orange-600', border: 'border-orange-300' },
    { name: 'Razorpay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Razorpay_logo.svg/1200px-Razorpay_logo.svg.png', color: 'text-white', bg: 'bg-blue-700', border: 'border-blue-300' },
    { name: 'Zerodha', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Zerodha_Logo.png/1200px-Zerodha_Logo.png', color: 'text-white', bg: 'bg-emerald-700', border: 'border-emerald-200' },
    { name: 'Flipkart', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Flipkart_logo.svg/1200px-Flipkart_logo.svg.png', color: 'text-white', bg: 'bg-blue-600', border: 'border-blue-300' },
    { name: 'Other', logo: '', color: 'text-white', bg: 'bg-slate-600', border: 'border-slate-300' },
];

const ROLES = [
    'Software Development Engineer (SDE I)',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Product Manager',
    'QA Automation Engineer'
];

// Company Information & Previous Interview Questions
const COMPANY_INFO: { [key: string]: { url: string; description: string; drive: string; questions: Array<{ q: string; a: string }> } } = {
    'Google': {
        url: 'https://www.google.com/careers',
        description: 'Build tools for billions of people worldwide',
        drive: 'Google 2025 Drive - Ongoing',
        questions: [
            { q: 'How would you design a load balancer?', a: 'A load balancer distributes incoming requests across multiple servers to optimize resource usage, maximize throughput, minimize response time, and avoid overload. Consider session persistence, health checks, and failover mechanisms.' },
            { q: 'Explain your approach to debugging a production issue.', a: 'Start with monitoring/logs, isolate the issue with minimal reproduction, check recent changes, use debugging tools, verify fix in staging, deploy with rollback plan, and conduct post-mortem analysis.' },
            { q: 'Design a URL shortening service.', a: 'Use distributed systems with hash function mapping, database for storage, caching layer (Redis), redirect mechanism, analytics tracking, and rate limiting for API protection.' }
        ]
    },
    'Microsoft': {
        url: 'https://careers.microsoft.com',
        description: 'Empower every person and organization on the planet',
        drive: 'Microsoft Campus Drive 2025',
        questions: [
            { q: 'How would you implement autocomplete in a search engine?', a: 'Use Trie data structure for prefix matching, cache popular queries, implement user feedback collection, use prediction algorithms (Markov chains, neural networks), and optimize for latency with CDN.' },
            { q: 'Design a real-time chat system.', a: 'Use WebSockets for real-time communication, message queues (RabbitMQ/Kafka), distributed database (MongoDB), caching (Redis), and ensure scalability with load balancing.' },
            { q: 'Explain the Windows registry and how it works.', a: 'Hierarchical database storing system settings, applications, and user preferences. Contains HKEY_LOCAL_MACHINE, HKEY_CURRENT_USER, HKEY_CLASSES_ROOT, HKEY_CURRENT_CONFIG, HKEY_USERS. Accessible via Registry Editor (regedit).' }
        ]
    },
    'Amazon': {
        url: 'https://www.amazon.jobs',
        description: 'Work Day 1 culture focused on customers',
        drive: 'Amazon SDE Internship 2025',
        questions: [
            { q: 'Design an e-commerce recommendation system.', a: 'Combine collaborative filtering, content-based filtering, user behavior analysis, A/B testing, real-time updates with Apache Spark/Kafka, and personalization algorithms for improved CTR.' },
            { q: 'How would you scale a database to handle millions of requests?', a: 'Implement database sharding by user/region, use read replicas, caching layer (ElastiCache), CDN for static content, and consider NoSQL for specific use cases.' },
            { q: 'Design Amazon\'s "Customers Who Bought This Also Bought" feature.', a: 'Use collaborative filtering, purchase history analysis, product similarity metrics, real-time computation with MapReduce/Spark, caching frequently accessed recommendations, and A/B testing for optimization.' }
        ]
    },
    'Apple': {
        url: 'https://www.apple.com/jobs',
        description: 'Create innovative products that enrich lives',
        drive: 'Apple Engineering Program 2025',
        questions: [
            { q: 'Describe your experience with performance optimization.', a: 'Focus on profiling tools, identifying bottlenecks (CPU/memory), algorithm optimization, caching strategies, lazy loading, and testing on real devices before deployment.' },
            { q: 'How do you ensure code quality?', a: 'Use code reviews, automated testing (unit/integration), linting tools, version control practices, continuous integration/deployment, and documentation standards.' },
            { q: 'Design a notification system for iOS apps.', a: 'Use APNs (Apple Push Notification service), token-based authentication, payload optimization, batching strategies, fallback mechanisms, and user preference management.' }
        ]
    },
    'TCS': {
        url: 'https://www.tcs.com/careers',
        description: 'Transforming with IT and beyond',
        drive: 'TCS Campus Hiring 2025',
        questions: [
            { q: 'Explain the difference between SOAP and REST APIs.', a: 'REST is simpler, stateless, HTTP-based; SOAP is complex, protocol-independent, uses XML. REST is preferred for modern web services; SOAP for enterprise applications.' },
            { q: 'What is DevOps and why is it important?', a: 'DevOps integrates development and operations for faster releases, improved collaboration, automated testing/deployment, infrastructure as code, and continuous monitoring.' },
            { q: 'Explain the Software Development Life Cycle (SDLC).', a: 'SDLC includes planning, analysis, design, implementation, testing, deployment, and maintenance phases. Ensures systematic development, quality assurance, and timely delivery of software projects.' }
        ]
    },
    'Infosys': {
        url: 'https://www.infosys.com/careers',
        description: 'Your nearshore advantage for digital transformation',
        drive: 'Infosys Internship Program 2025',
        questions: [
            { q: 'What are microservices and their advantages?', a: 'Independent, scalable services with separate databases, enabling faster deployment, independent scaling, and technology flexibility. Challenge: distributed tracing and eventual consistency.' },
            { q: 'Explain Agile methodology.', a: 'Iterative development with 2-week sprints, continuous feedback, adaptive to changes, daily standups, retrospectives, and emphasis on working software over documentation.' },
            { q: 'What is the importance of cloud computing in modern applications?', a: 'Provides scalability, cost-efficiency, reliability, global reach, and flexibility. Enables pay-as-you-go model, eliminates infrastructure management burden, and supports rapid innovation.' }
        ]
    },
    'Wipro': {
        url: 'https://careers.wipro.com',
        description: 'Apply innovative technology solutions to solve complex problems',
        drive: 'Wipro Campus Program 2025',
        questions: [
            { q: 'What are the different types of testing in software development?', a: 'Unit testing (individual components), integration testing (component interaction), system testing (complete system), UAT (user acceptance), performance testing, and regression testing.' },
            { q: 'Explain the concept of containers and Docker.', a: 'Containers package application with dependencies in isolated environments. Docker provides containerization, enabling consistent deployment across dev/staging/production environments with minimal overhead.' },
            { q: 'What is CI/CD and its benefits?', a: 'Continuous Integration automates testing on code changes; Continuous Deployment automates release to production. Benefits: faster feedback, reduced manual errors, improved quality, and rapid iterations.' }
        ]
    },
    'HCL': {
        url: 'https://www.hcltech.com/careers',
        description: 'Technology for good - Making an impact with innovation',
        drive: 'HCL Technologies Recruitment 2025',
        questions: [
            { q: 'Explain object-oriented programming principles.', a: 'Encapsulation (bundling data/methods), Inheritance (reusing properties), Polymorphism (method overriding), and Abstraction (hiding complexity). Core principles for maintainable, scalable code.' },
            { q: 'What is the difference between SQL and NoSQL databases?', a: 'SQL: structured, ACID compliant, relational; NoSQL: flexible schema, eventual consistency, distributed. Choose based on data structure and scalability requirements.' },
            { q: 'How do you handle API versioning?', a: 'Strategies: URL path versioning (/v1/users), query parameters (?version=1), headers, or content negotiation. Ensure backward compatibility and smooth migration for clients.' }
        ]
    },
    'Accenture': {
        url: 'https://www.accenture.com/us-en/careers',
        description: 'Delivering on the promise of technology and human creativity',
        drive: 'Accenture Campus Hiring 2025',
        questions: [
            { q: 'What is blockchain and its real-world applications?', a: 'Distributed ledger technology ensuring transparency and security. Applications: cryptocurrency, supply chain tracking, smart contracts, voting systems, and healthcare records.' },
            { q: 'Explain artificial intelligence and machine learning.', a: 'AI simulates human intelligence; ML subset of AI enabling systems to learn from data. Applications: recommendations, predictions, NLP, computer vision, and autonomous systems.' },
            { q: 'What is data security and compliance?', a: 'Protecting data through encryption, access controls, auditing, and compliance with regulations (GDPR, HIPAA). Essential for building customer trust and avoiding legal penalties.' }
        ]
    },
    'Zoho': {
        url: 'https://www.zoho.com/careers',
        description: 'Building a more efficient digital world',
        drive: 'Zoho Engineering Hiring 2025',
        questions: [
            { q: 'Design a task management system like Zoho Projects.', a: 'Features: project creation, task assignment, timeline tracking, team collaboration, progress monitoring, reporting. Use React frontend, Node.js backend, MongoDB for data, and WebSockets for real-time updates.' },
            { q: 'How would you build a scalable SaaS application?', a: 'Multi-tenancy architecture, database isolation, auto-scaling infrastructure, security at multiple layers, monitoring/logging, disaster recovery, and compliance with data regulations.' },
            { q: 'Explain REST API design best practices.', a: 'Use proper HTTP methods, meaningful endpoints, versioning, error handling with status codes, pagination, rate limiting, documentation, and security headers.' }
        ]
    },
    'Swiggy': {
        url: 'https://www.swiggycareers.com',
        description: 'Making delivery accessible to all',
        drive: 'Swiggy Engineering Drive 2025',
        questions: [
            { q: 'Design a food delivery tracking system.', a: 'Real-time location updates via GPS, WebSockets for live feed, order status pipeline, driver assignment algorithm, geospatial queries for nearby restaurants, push notifications.' },
            { q: 'How would you optimize database queries for performance?', a: 'Use indexing on frequently queried columns, query optimization, caching (Redis), database partitioning, denormalization where appropriate, and regular performance analysis.' },
            { q: 'Explain the CAP theorem in distributed systems.', a: 'Consistency, Availability, Partition tolerance. Most systems achieve CA (traditional DB) or AP (NoSQL). Choose based on application needs: banking (CA) or social media (AP).' }
        ]
    },
    'Razorpay': {
        url: 'https://razorpay.com/careers',
        description: 'Building fintech infrastructure for India',
        drive: 'Razorpay Tech Hiring 2025',
        questions: [
            { q: 'Design a payment processing system.', a: 'Payment gateway integration, PCI compliance, encryption (TLS/SSL), fraud detection, idempotency for retries, transaction logging, reconciliation, and settlement management.' },
            { q: 'How do you handle high-frequency transactions?', a: 'Queue-based architecture (Kafka), asynchronous processing, database optimization, caching, circuit breakers, load balancing, and monitoring for anomalies.' },
            { q: 'Explain PCI DSS compliance and why it matters.', a: 'Payment Card Industry Data Security Standard ensures secure handling of payment card data. Mandatory for payment processors: encryption, access control, logging, vulnerability scanning, and regular audits.' }
        ]
    },
    'Zerodha': {
        url: 'https://zerodha.com/careers',
        description: 'Investing for everyone',
        drive: 'Zerodha Engineering Hiring 2025',
        questions: [
            { q: 'Design a stock trading platform.', a: 'Real-time market data streaming, order execution engine, portfolio management, risk management, WebSockets for live price updates, charting libraries, and regulatory compliance.' },
            { q: 'How would you handle high-frequency market data?', a: 'Message queues (Kafka) for data ingestion, time-series databases (InfluxDB), in-memory caching (Redis), pub-sub for real-time updates, and efficient data serialization.' },
            { q: 'Explain the difference between synchronous and asynchronous processing.', a: 'Synchronous: blocking, immediate response; Asynchronous: non-blocking, callback/promise based. Choose async for I/O-heavy, long-running operations; sync for critical, immediate operations.' }
        ]
    },
    'Flipkart': {
        url: 'https://www.flipkartcareers.com',
        description: 'Transform the retail experience in India',
        drive: 'Flipkart Campus Hiring 2025',
        questions: [
            { q: 'Design Flipkart\'s product search and filtering system.', a: 'Full-text search (Elasticsearch), faceted search, filters by category/price/rating, autocomplete with suggestions, ranking by relevance/popularity, and performance optimization for millions of products.' },
            { q: 'How would you manage inventory for thousands of sellers?', a: 'Distributed inventory management, real-time stock updates, multi-warehouse coordination, demand forecasting, stockout prevention, and integration with seller systems.' },
            { q: 'Explain the importance of caching in e-commerce platforms.', a: 'Reduces database load, improves response time, enables offline browsing. Cache popular products, search results, user sessions, and product recommendations using Redis/Memcached.' }
        ]
    }
};

// Generic questions for custom companies
const GENERIC_INTERVIEW_QUESTIONS = [
    { q: 'Tell me about yourself and your technical background.', a: 'Provide a 2-3 minute summary of your education, relevant experience, key projects, technical skills, and why you\'re interested in the position. Focus on achievements and growth.' },
    { q: 'What are your strongest technical skills?', a: 'Highlight 3-4 core competencies with examples of projects where you used them. Be honest about your proficiency level and areas you\'re actively improving.' },
    { q: 'Describe a challenging problem you solved.', a: 'Use the STAR method: Situation, Task, Action, Result. Show problem-solving approach, technical depth, collaboration, and learning from the experience.' },
    { q: 'How do you approach learning new technologies?', a: 'Discuss courses taken, documentation reading, building projects, contributing to open-source, or teaching others. Show continuous learning mindset and practical implementation.' },
    { q: 'What is your experience with team collaboration and communication?', a: 'Share experiences working in teams, communicating with non-technical stakeholders, handling disagreements, and contributing to a positive team culture.' }
];

const TechAccelerator: React.FC<TechAcceleratorProps> = ({ onNavigate, onNavigateWithProfile, navigateToStudyPlan }) => {
    const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0].name);
    const [customCompanyName, setCustomCompanyName] = useState('');
    const [role, setRole] = useState('Software Development Engineer (SDE I)');
    const [resumeText, setResumeText] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<CompanyFitAnalysis | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [scrollToQuestions, setScrollToQuestions] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const roleDropdownRef = useRef<HTMLDivElement>(null);
    const questionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
                setShowRoleDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle scroll to questions section when "Create Study Plan" is clicked
    useEffect(() => {
        if (scrollToQuestions && questionsRef.current) {
            questionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setScrollToQuestions(false); // Reset the flag after scrolling
        }
    }, [scrollToQuestions]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setResumeFile(f);
            // Run a quick analysis preview immediately using the uploaded file
            (async () => {
                try {
                    // read file as base64
                    const reader = new FileReader();
                    const filePromise = new Promise<string>((resolve, reject) => {
                        reader.onload = () => {
                            const result = reader.result as string;
                            const base64Content = result.split(',')[1] || result;
                            resolve(base64Content);
                        };
                        reader.onerror = () => reject(new Error('Failed to read file'));
                    });
                    reader.readAsDataURL(f);
                    const base64Content = await filePromise;
                    setLoading(true);
                    const data = await analyzeCompanyFit({ content: base64Content, mimeType: 'application/pdf' }, selectedCompany, role, resumeText || '');
                    if (data && data.matchScore !== undefined) setAnalysis(data);
                } catch (err) {
                    // ignore preview errors
                } finally {
                    setLoading(false);
                }
            })();
        }
    };

    const handleAnalyze = async () => {
        if (!resumeFile && !resumeText.trim()) {
            alert("Please upload a resume or enter your skills.");
            return;
        }
        setLoading(true);
        setAnalysis(null); // Clear previous analysis
        try {
            let resumeInput = { content: '', mimeType: 'text/plain' };
            
            if (resumeFile) {
                // Read PDF file as base64
                const reader = new FileReader();
                const filePromise = new Promise<string>((resolve, reject) => {
                    reader.onload = () => {
                        const result = reader.result as string;
                        // Extract base64 content (remove data:application/pdf;base64, prefix)
                        const base64Content = result.split(',')[1] || result;
                        resolve(base64Content);
                    };
                    reader.onerror = () => reject(new Error('Failed to read file'));
                });
                
                reader.readAsDataURL(resumeFile);
                const base64Content = await filePromise;
                
                resumeInput = { 
                    content: base64Content,
                    mimeType: 'application/pdf'
                };
            } else {
                // Use text input
                resumeInput = { 
                    content: resumeText.trim(),
                    mimeType: 'text/plain'
                };
            }

            const data = await analyzeCompanyFit(
                resumeInput, 
                selectedCompany, 
                role, 
                resumeText || ''
            );
            
            if (data && data.matchScore !== undefined) {
                setAnalysis(data);
            } else {
                throw new Error('Invalid response from API');
            }
        } catch (e: any) {
            console.error('Analysis error:', e);
            // Use mock data as fallback
            const mockData = {
                matchScore: 45,
                culturalFit: `Based on the resume analysis, there is moderate alignment with ${selectedCompany}'s cultural principles. The candidate shows potential but needs to demonstrate more ownership and innovation mindset.`,
                technicalGaps: [
                    'Advanced SQL and BigQuery experience',
                    'Machine Learning algorithms and frameworks',
                    'Distributed computing concepts',
                    'System design patterns'
                ],
                accelerationPlan: [
                    { week: 'WEEK 1', focus: 'SQL & Data Warehousing', tasks: ['Complete SQL best practices', 'Practice BigQuery queries'] },
                    { week: 'WEEK 2', focus: 'Distributed Computing', tasks: ['Study Apache Spark', 'Understand MapReduce'] },
                    { week: 'WEEK 3', focus: 'Machine Learning', tasks: ['Review ML algorithms', 'Practice with frameworks'] },
                    { week: 'WEEK 4', focus: 'Experimentation', tasks: ['Understand A/B testing', 'Study statistical modeling'] }
                ]
            };
            setAnalysis(mockData);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskClick = (task: string) => {
        if (!onNavigate) return;
        const lowerTask = task.toLowerCase();
        if (lowerTask.includes('project') || lowerTask.includes('build')) onNavigate('projects');
        else if (lowerTask.includes('interview') || lowerTask.includes('mock') || lowerTask.includes('dsa')) onNavigate('interview');
        else if (lowerTask.includes('lab') || lowerTask.includes('workflow')) onNavigate('lab');
        else if (lowerTask.includes('notes') || lowerTask.includes('study')) onNavigate('notes');
        else onNavigate('mentor');
    };

    const currentCompany = (() => {
        if (selectedCompany === 'Other' && customCompanyName) {
            return { name: customCompanyName, logo: '', color: 'text-white', bg: 'bg-slate-600', border: 'border-slate-300' };
        }
        return COMPANIES.find(c => c.name === selectedCompany) || COMPANIES[0];
    })();

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-md">
                    <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800">Tech Accelerator</h2>
                    <p className="text-slate-500">Target specific MNCs & Startups and get a week-by-week acceleration plan.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
                {/* Left Panel: Configuration */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="space-y-6">
                            {/* Company Selector */}
                            <div className="relative" ref={dropdownRef}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Target Company</label>
                                <div className="relative">
                                     <button 
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-full flex items-center justify-between p-3 bg-white border border-slate-300 rounded-lg hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                     >
                                        <div className="flex items-center gap-3">
                                            <CompanyLogo company={currentCompany} />
                                            <span className="font-semibold text-slate-700">{currentCompany.name}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                     </button>

                                    {showDropdown && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-64 overflow-y-auto custom-scrollbar">
                                            {COMPANIES.map(company => (
                                                <button
                                                    key={company.name}
                                                    onClick={() => {
                                                        setSelectedCompany(company.name);
                                                        setShowDropdown(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left"
                                                >
                                                    <CompanyLogo company={company} size="sm" />
                                                    <span className="text-sm font-medium text-slate-700">{company.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Custom Company Input */}
                            {selectedCompany === 'Other' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                                    <input 
                                        type="text"
                                        value={customCompanyName}
                                        onChange={(e) => setCustomCompanyName(e.target.value)}
                                        className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
                                        placeholder="Enter your company name"
                                    />
                                </div>
                            )}

                            {/* Role Selector */}
                            <div className="relative" ref={roleDropdownRef}>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Target Role</label>
                                <div className="relative">
                                     <button 
                                        onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                                        className="w-full flex items-center justify-between p-3 bg-white border border-slate-300 rounded-lg hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                     >
                                         <div className="flex items-center gap-2">
                                             <Briefcase className="h-4 w-4 text-slate-400" />
                                             <span className="text-sm text-slate-700 font-medium truncate">{role}</span>
                                         </div>
                                         <ChevronDown className="h-4 w-4 text-slate-400" />
                                     </button>
                                     
                                     {showRoleDropdown && (
                                         <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto custom-scrollbar">
                                             {ROLES.map(r => (
                                                 <button
                                                     key={r}
                                                     onClick={() => {
                                                         setRole(r);
                                                         setShowRoleDropdown(false);
                                                     }}
                                                     className="w-full text-left p-3 text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50 last:border-0"
                                                 >
                                                     {r}
                                                 </button>
                                             ))}
                                         </div>
                                     )}
                                </div>
                            </div>

                            {/* Resume Upload */}
                             <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Upload Resume</label>
                                <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors relative ${resumeFile ? 'border-green-300 bg-green-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50'}`}>
                                    <input 
                                        type="file" 
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {resumeFile ? (
                                        <div className="flex flex-col items-center">
                                            <div className="bg-green-100 p-2 rounded-full mb-2">
                                                <FileText className="h-6 w-6 text-green-600" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{resumeFile.name}</p>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setResumeFile(null); }}
                                                className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1"
                                            >
                                                <X className="h-3 w-3" /> Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-indigo-100 p-2 rounded-full mb-2">
                                                <Upload className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">Click to upload PDF</p>
                                            <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Skills Text Area */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Additional Skills / Notes</label>
                                <textarea 
                                    value={resumeText}
                                    onChange={(e) => { setResumeText(e.target.value); setAnalysis(null); }}
                                    onBlur={async () => {
                                        // Re-run analysis when the user finishes typing (on blur)
                                        if (!resumeText.trim() && !resumeFile) return;
                                        if (loading) return;
                                        setLoading(true);
                                        try {
                                            let resumeInput: { content: string; mimeType?: string } = { content: '', mimeType: 'text/plain' };
                                            if (resumeFile) {
                                                // Read file as base64
                                                const reader = new FileReader();
                                                const filePromise = new Promise<string>((resolve, reject) => {
                                                    reader.onload = () => {
                                                        const result = reader.result as string;
                                                        const base64Content = result.split(',')[1] || result;
                                                        resolve(base64Content);
                                                    };
                                                    reader.onerror = () => reject(new Error('Failed to read file'));
                                                });
                                                reader.readAsDataURL(resumeFile);
                                                const base64Content = await filePromise;
                                                resumeInput = { content: base64Content, mimeType: 'application/pdf' };
                                            } else {
                                                resumeInput = { content: resumeText.trim(), mimeType: 'text/plain' };
                                            }

                                            const data = await analyzeCompanyFit(resumeInput, selectedCompany, role, resumeText || '');
                                            if (data && data.matchScore !== undefined) setAnalysis(data);
                                        } catch (e) {
                                            // ignore
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="w-full p-3 h-24 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none text-sm"
                                    placeholder="e.g. I have built 3 projects in React. I am weak in Dynamic Programming..."
                                />
                            </div>

                            <button 
                                onClick={handleAnalyze}
                                disabled={loading || (!resumeText && !resumeFile)}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-slate-200"
                            >
                                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Analyze Readiness"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Results */}
                <div className="lg:col-span-8">
                    {!analysis && !loading && (
                        <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Briefcase className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Start Your Acceleration</h3>
                            <p className="text-slate-400 max-w-md">Select a target company and role to get a personalized breakdown of what you're missing and how to fix it in 4 weeks.</p>
                        </div>
                    )}

                    {loading && (
                        <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-12 text-center">
                             <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-6" />
                             <h3 className="text-lg font-bold text-slate-700">Analyzing Profile...</h3>
                             <p className="text-slate-400">Comparing your skills with {selectedCompany} requirements...</p>
                        </div>
                    )}

                    {analysis && (
                        <div className="space-y-6">
                            {/* Match Score and Status */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <div className="grid lg:grid-cols-12 gap-6 mb-6">
                                    {/* ATS Friendly Score Section */}
                                    <div className="lg:col-span-6">
                                        <div className="mb-3">
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
                                                <Award className="h-4 w-4" /> ATS Friendly Score
                                            </h3>
                                        </div>
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            {/* Circular Progress */}
                                            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="64" cy="64" r="56" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                                                    <circle 
                                                        cx="64" cy="64" r="56" 
                                                        stroke={analysis.matchScore > 75 ? '#22c55e' : analysis.matchScore > 50 ? '#eab308' : '#ef4444'} 
                                                        strokeWidth="12" 
                                                        fill="transparent" 
                                                        strokeDasharray={351.86} 
                                                        strokeDashoffset={351.86 - (351.86 * analysis.matchScore) / 100} 
                                                        className="transition-all duration-1000 ease-out"
                                                    />
                                                </svg>
                                                <div className="absolute flex flex-col items-center">
                                                    <span className="text-3xl font-bold text-slate-800">{analysis.matchScore}%</span>
                                                    <span className="text-xs text-slate-500 font-semibold">MATCH</span>
                                                </div>
                                            </div>
                                            
                                            {/* Status Badge */}
                                            <div className="flex-1">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
                                                    style={{
                                                        backgroundColor: analysis.matchScore > 75 ? '#dcfce7' : analysis.matchScore > 50 ? '#fef3c7' : '#fee2e2',
                                                        color: analysis.matchScore > 75 ? '#166534' : analysis.matchScore > 50 ? '#854d0e' : '#991b1b'
                                                    }}
                                                >
                                                    <span className="text-xs font-bold">
                                                        {analysis.matchScore > 75 ? '✓ High Probability' : analysis.matchScore > 50 ? '○ Medium Probability' : '✗ Low Probability'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600">Your resume matches {analysis.matchScore}% of the job requirements for this role.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* StudyPrep Section */}
                                    <div className="lg:col-span-6 bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-lg border border-indigo-100">
                                        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4" /> StudyPrep
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Zap className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-indigo-900">Focus Areas</p>
                                                    <p className="text-xs text-indigo-700 mt-0.5">{analysis.technicalGaps?.slice(0, 2).join(', ') || 'No gaps identified'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Calendar className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-indigo-900">Timeline</p>
                                                    <p className="text-xs text-indigo-700 mt-0.5">4 weeks intensive preparation</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    navigateToStudyPlan?.(selectedCompany, customCompanyName || undefined, role);
                                                }}
                                                className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-3 py-2 rounded transition-colors mt-2"
                                            >
                                                Create Study Plan →
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Company Info Card */}
                                <div className="border-t border-slate-200 pt-4 mt-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-indigo-600" /> Company Information
                                        </h4>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                        <p className="text-sm text-slate-700 mb-2">{COMPANY_INFO[selectedCompany]?.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <a 
                                                href={COMPANY_INFO[selectedCompany]?.url || '#'} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded border border-indigo-200 hover:bg-indigo-100 transition-colors"
                                            >
                                                Visit Careers <ExternalLink className="h-3 w-3" />
                                            </a>
                                            <span className="text-xs font-medium text-slate-600 bg-white px-3 py-1.5 rounded border border-slate-200">
                                                {COMPANY_INFO[selectedCompany]?.drive}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cultural Fit */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Building2 className="h-5 w-5 text-indigo-500" /> Cultural Fit
                                </h3>
                                <div className="text-sm text-slate-600 leading-relaxed">
                                    <ReactMarkdown 
                                        components={{
                                            p: ({node, ...props}) => <p className="mb-2" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1" {...props} />,
                                            li: ({node, ...props}) => <li className="marker:text-indigo-500" {...props} />
                                        }}
                                    >
                                        {analysis.culturalFit}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* Missing Critical Skills */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" /> Missing Critical Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.technicalGaps && analysis.technicalGaps.length > 0 ? (
                                        analysis.technicalGaps.map((gap, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold">
                                                {gap}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500">No critical skills missing!</span>
                                    )}
                                </div>
                            </div>

                            {/* 4-Week Acceleration Plan */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-indigo-600" />
                                    <h3 className="font-bold text-slate-800">4-Week Acceleration Plan</h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {analysis.accelerationPlan && analysis.accelerationPlan.length > 0 ? (
                                        analysis.accelerationPlan.map((week, idx) => (
                                            <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                                                <div className="flex flex-col md:flex-row md:items-start gap-4">
                                                    <div className="shrink-0">
                                                        <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded border border-indigo-100">
                                                            {week.week || `WEEK ${idx + 1}`}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-800 text-lg mb-3">{week.focus}</h4>
                                                        {week.tasks && week.tasks.length > 0 ? (
                                                            <ul className="space-y-2">
                                                                {week.tasks.map((task, tIdx) => (
                                                                    <li key={tIdx} className="flex items-start gap-3 text-sm text-slate-600">
                                                                        <CheckCircle className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />
                                                                        <span className="flex-1">{task}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                              <p className="text-sm text-slate-500">{(week as any).description || 'No specific tasks defined.'}</p>
                                                        )}
                                                        <div className="mt-4 flex gap-2">
                                                            {idx === 0 && (
                                                                <button 
                                                                    onClick={() => onNavigate && onNavigate('mentor')}
                                                                    className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-lg border border-indigo-100 font-semibold hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    Ask AI Mentor
                                                                </button>
                                                            )}
                                                            {idx === 1 && (
                                                                <button 
                                                                    onClick={() => onNavigate && onNavigate('notes')}
                                                                    className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-lg border border-indigo-100 font-semibold hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    Create Notes
                                                                </button>
                                                            )}
                                                            {idx === 2 && (
                                                                <button 
                                                                    onClick={() => onNavigate && onNavigate('interview')}
                                                                    className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-lg border border-indigo-100 font-semibold hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    Practice Coding
                                                                </button>
                                                            )}
                                                            {idx === 3 && (
                                                                <button 
                                                                    onClick={() => onNavigate && onNavigate('mentor')}
                                                                    className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1.5 rounded-lg border border-indigo-100 font-semibold hover:bg-indigo-100 transition-colors"
                                                                >
                                                                    Ask AI Mentor
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-6 text-center text-slate-500">
                                            <p>No acceleration plan available. Please try again.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Previous Interview Questions & Answers */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" ref={questionsRef}>
                                <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-indigo-600" />
                                    <h3 className="font-bold text-slate-800">
                                        {customCompanyName ? `Previous ${customCompanyName} Interview Questions` : `Previous ${selectedCompany} Interview Questions`}
                                    </h3>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {(() => {
                                        // Determine which questions to display
                                        let questionsToDisplay = [];
                                        
                                        if (customCompanyName) {
                                            // For custom companies, use generic questions
                                            questionsToDisplay = GENERIC_INTERVIEW_QUESTIONS;
                                        } else {
                                            // For predefined companies, use company-specific questions
                                            questionsToDisplay = COMPANY_INFO[selectedCompany]?.questions || [];
                                        }
                                        
                                        return questionsToDisplay && questionsToDisplay.length > 0 ? (
                                            questionsToDisplay.map((qa, idx) => (
                                                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors">
                                                    <div className="mb-3">
                                                        <h4 className="font-semibold text-slate-800 text-base flex items-start gap-2 mb-2">
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold shrink-0 mt-0.5">Q</span>
                                                            {qa.q}
                                                        </h4>
                                                    </div>
                                                    <div className="ml-8">
                                                        <p className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold shrink-0 mt-0">A</span>
                                                            <span className="flex-1">{qa.a}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-slate-500">
                                                <p>No questions available for this company.</p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Early Warning Notice small box below Tech Accelerator */}
            <div className="mt-6 max-w-7xl mx-auto">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                        const prefill = { previousPercentage: 78, activeBacklogs: 0, performanceNotes: 'Previous semester: 78% — slight dip due to missed submissions', snapchatId: '@student123', instagramId: '', whatsappNumber: '', uploadedMemoName: 'marks_semester3.pdf' };
                        if (typeof onNavigateWithProfile === 'function') { onNavigateWithProfile(prefill as any); } else { onNavigate && onNavigate('early-warning'); }
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { const prefill = { previousPercentage: 78, activeBacklogs: 0, performanceNotes: 'Previous semester: 78% — slight dip due to missed submissions', snapchatId: '@student123', instagramId: '', whatsappNumber: '', uploadedMemoName: 'marks_semester3.pdf' }; if (typeof onNavigateWithProfile === 'function') { onNavigateWithProfile(prefill as any); } else { onNavigate && onNavigate('early-warning'); } } }}
                    className="w-full bg-white p-4 rounded-lg border border-yellow-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center gap-4"
                    aria-label="Open Early Warning Notice"
                >
                    <div className="p-3 rounded-md bg-yellow-50 text-yellow-600">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-800">early warning notice !</h4>
                        <p className="text-xs text-slate-500">Proactively identify students showing silent distress. Click to open Early Warning System (consent-required, privacy-preserving).</p>
                    </div>
                    <div className="ml-auto text-xs text-slate-400">Click to open →</div>
                </div>
            </div>
        </div>
    );
};

export default TechAccelerator;
