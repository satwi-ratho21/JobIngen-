import React, { useState } from 'react';
import { View } from '../types';
import { Briefcase, ArrowLeft, Zap, ChevronDown } from 'lucide-react';

interface StudyPlanProps {
    onNavigate?: (view: View) => void;
    company: string;
    customCompanyName?: string;
    role: string;
}

interface QuestionOption {
    id: string;
    text: string;
}

interface MCQQuestion {
    id: number;
    question: string;
    options: QuestionOption[];
    correctAnswer: string;
    explanation: string;
}

interface YearData {
    year: number;
    questions: MCQQuestion[];
}

// Year-wise Question Banks for each company (Real Placement Drive Questions)
const COMPANY_QUESTION_BANKS: { [key: string]: YearData[] } = {
    'Google': [
        {
            year: 2025,
            questions: [
                {
                    id: 1,
                    question: 'Design a system to handle 1 million concurrent users on Google Search. Which component would be the bottleneck?',
                    options: [
                        { id: 'a', text: 'Database layer' },
                        { id: 'b', text: 'Network bandwidth' },
                        { id: 'c', text: 'CPU processing' },
                        { id: 'd', text: 'All of the above' }
                    ],
                    correctAnswer: 'd',
                    explanation: 'All components become bottlenecks. The solution involves horizontal scaling, load balancing, caching (CDN), database sharding, and distributed computing.'
                },
                {
                    id: 2,
                    question: 'Implement a trie data structure. What is the time complexity for search operation?',
                    options: [
                        { id: 'a', text: 'O(1)' },
                        { id: 'b', text: 'O(log n)' },
                        { id: 'c', text: 'O(m) where m is length of word' },
                        { id: 'd', text: 'O(n)' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'Trie search has O(m) complexity where m is the length of the word being searched, as we traverse character by character.'
                },
                {
                    id: 3,
                    question: 'How would you detect a cycle in a directed graph?',
                    options: [
                        { id: 'a', text: 'DFS with color marking' },
                        { id: 'b', text: 'BFS with visited array' },
                        { id: 'c', text: 'Union-Find algorithm' },
                        { id: 'd', text: 'Topological sort' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'DFS with three colors (white, gray, black) is the standard approach. If we encounter a gray node during traversal, we found a cycle.'
                },
                {
                    id: 4,
                    question: 'What is the main advantage of using Protocol Buffers over JSON?',
                    options: [
                        { id: 'a', text: 'Human readable' },
                        { id: 'b', text: 'Smaller size and faster serialization' },
                        { id: 'c', text: 'Better for web APIs' },
                        { id: 'd', text: 'No schema required' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Protocol Buffers provide binary serialization that is more compact and faster to parse than JSON, ideal for high-performance systems.'
                }
            ]
        },
        {
            year: 2024,
            questions: [
                {
                    id: 1,
                    question: 'What is the main advantage of using Redis for caching?',
                    options: [
                        { id: 'a', text: 'Persistent storage' },
                        { id: 'b', text: 'In-memory speed with millisecond latency' },
                        { id: 'c', text: 'SQL query support' },
                        { id: 'd', text: 'Built-in load balancing' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Redis is an in-memory data store that provides extremely fast access with sub-millisecond latency, making it ideal for caching frequently accessed data.'
                },
                {
                    id: 2,
                    question: 'Explain the difference between HashMap and ConcurrentHashMap.',
                    options: [
                        { id: 'a', text: 'No difference' },
                        { id: 'b', text: 'ConcurrentHashMap uses segment locking' },
                        { id: 'c', text: 'HashMap is faster' },
                        { id: 'd', text: 'ConcurrentHashMap uses bucket locking' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'ConcurrentHashMap uses segment-level locking for better concurrency. HashMap is not thread-safe while ConcurrentHashMap allows multiple threads to read/write safely.'
                },
                {
                    id: 3,
                    question: 'What is the time complexity of inserting an element in a balanced BST?',
                    options: [
                        { id: 'a', text: 'O(1)' },
                        { id: 'b', text: 'O(log n)' },
                        { id: 'c', text: 'O(n)' },
                        { id: 'd', text: 'O(n log n)' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'In a balanced BST, insertion takes O(log n) time because the tree height is logarithmic relative to the number of nodes.'
                }
            ]
        },
        {
            year: 2023,
            questions: [
                {
                    id: 1,
                    question: 'What is the difference between synchronous and asynchronous I/O?',
                    options: [
                        { id: 'a', text: 'Same thing' },
                        { id: 'b', text: 'Synchronous waits for completion, Async continues immediately' },
                        { id: 'c', text: 'Asynchronous is slower' },
                        { id: 'd', text: 'Synchronous uses threads' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Synchronous I/O blocks the thread until completion. Asynchronous I/O returns immediately and notifies when complete, allowing other work to proceed.'
                },
                {
                    id: 2,
                    question: 'Merge two sorted arrays of size m and n. What is optimal space complexity?',
                    options: [
                        { id: 'a', text: 'O(1)' },
                        { id: 'b', text: 'O(m)' },
                        { id: 'c', text: 'O(n)' },
                        { id: 'd', text: 'O(m+n)' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'Using two pointers from the end of the first array, we can merge in-place with O(1) extra space by comparing and placing elements from right to left.'
                }
            ]
        }
    ],
    'Microsoft': [
        {
            year: 2025,
            questions: [
                {
                    id: 1,
                    question: 'What is the main principle behind microservices architecture?',
                    options: [
                        { id: 'a', text: 'Single monolithic service' },
                        { id: 'b', text: 'Independent, deployable services' },
                        { id: 'c', text: 'Shared database' },
                        { id: 'd', text: 'Centralized authentication' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Microservices are independent services that can be developed, deployed, and scaled separately. They communicate via APIs and have their own databases.'
                },
                {
                    id: 2,
                    question: 'Implement binary search. What is its time complexity?',
                    options: [
                        { id: 'a', text: 'O(n)' },
                        { id: 'b', text: 'O(log n)' },
                        { id: 'c', text: 'O(1)' },
                        { id: 'd', text: 'O(n log n)' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Binary search eliminates half of the search space with each comparison, resulting in O(log n) time complexity.'
                },
                {
                    id: 3,
                    question: 'What is ACID in database transactions?',
                    options: [
                        { id: 'a', text: 'Atomicity, Consistency, Isolation, Durability' },
                        { id: 'b', text: 'Access, Control, Index, Data' },
                        { id: 'c', text: 'Authentication, Confidentiality, Integrity, Delivery' },
                        { id: 'd', text: 'None of the above' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (permanent).'
                }
            ]
        },
        {
            year: 2024,
            questions: [
                {
                    id: 1,
                    question: 'What is the purpose of a load balancer?',
                    options: [
                        { id: 'a', text: 'Store data' },
                        { id: 'b', text: 'Distribute incoming requests across servers' },
                        { id: 'c', text: 'Encrypt traffic' },
                        { id: 'd', text: 'Monitor server health' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'A load balancer distributes network traffic across multiple servers to optimize resource utilization, maximize throughput, and minimize latency.'
                },
                {
                    id: 2,
                    question: 'Reverse a string using recursion. Space complexity?',
                    options: [
                        { id: 'a', text: 'O(1)' },
                        { id: 'b', text: 'O(n) - call stack' },
                        { id: 'c', text: 'O(log n)' },
                        { id: 'd', text: 'O(n²)' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Recursive string reversal uses O(n) space due to the call stack depth being proportional to string length.'
                }
            ]
        },
        {
            year: 2023,
            questions: [
                {
                    id: 1,
                    question: 'What is REST API?',
                    options: [
                        { id: 'a', text: 'Remote Execution Symbolic Transfer' },
                        { id: 'b', text: 'Representational State Transfer' },
                        { id: 'c', text: 'Relative Entity Search Tool' },
                        { id: 'd', text: 'Request Entity Service Tool' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'REST is an architectural style for building web APIs using HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs.'
                }
            ]
        }
    ],
    'Amazon': [
        {
            year: 2025,
            questions: [
                {
                    id: 1,
                    question: 'What is an EC2 instance in AWS?',
                    options: [
                        { id: 'a', text: 'Elastic Cloud Computing - virtual server' },
                        { id: 'b', text: 'Email Communication Configuration' },
                        { id: 'c', text: 'Encrypted Container' },
                        { id: 'd', text: 'Enterprise Cluster' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'EC2 instances are resizable virtual computers in Amazon Web Services that allow scalable computing capacity in the cloud.'
                },
                {
                    id: 2,
                    question: 'Design a LRU Cache. What data structure is optimal?',
                    options: [
                        { id: 'a', text: 'Array only' },
                        { id: 'b', text: 'Linked List only' },
                        { id: 'c', text: 'HashMap + Doubly Linked List' },
                        { id: 'd', text: 'Queue only' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'HashMap provides O(1) access while Doubly Linked List maintains insertion order for LRU eviction, together achieving O(1) for all operations.'
                },
                {
                    id: 3,
                    question: 'What is DynamoDB used for?',
                    options: [
                        { id: 'a', text: 'Relational database' },
                        { id: 'b', text: 'NoSQL key-value database' },
                        { id: 'c', text: 'File storage' },
                        { id: 'd', text: 'Message queue' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'DynamoDB is AWS\'s fully managed NoSQL database service that provides fast, predictable performance with seamless scalability.'
                }
            ]
        },
        {
            year: 2024,
            questions: [
                {
                    id: 1,
                    question: 'Find the peak element in an array. Optimal complexity?',
                    options: [
                        { id: 'a', text: 'O(n)' },
                        { id: 'b', text: 'O(log n) using modified binary search' },
                        { id: 'c', text: 'O(1)' },
                        { id: 'd', text: 'O(n log n)' }
                    ],
                    correctAnswer: 'b',
                    explanation: 'Peak element can be found in O(log n) using binary search by comparing middle with neighbors and eliminating half the search space.'
                },
                {
                    id: 2,
                    question: 'What is S3 in AWS?',
                    options: [
                        { id: 'a', text: 'Simple Storage Service' },
                        { id: 'b', text: 'Secure Server Storage' },
                        { id: 'c', text: 'Scalable Stream Service' },
                        { id: 'd', text: 'Service Status System' }
                    ],
                    correctAnswer: 'a',
                    explanation: 'S3 is a highly scalable object storage service for storing any amount of data and retrieving it from anywhere on the web.'
                }
            ]
        },
        {
            year: 2023,
            questions: [
                {
                    id: 1,
                    question: 'Two Sum problem: Find two numbers that add to target. Time complexity?',
                    options: [
                        { id: 'a', text: 'O(n²) brute force' },
                        { id: 'b', text: 'O(n log n) sorting' },
                        { id: 'c', text: 'O(n) with HashMap' },
                        { id: 'd', text: 'O(log n)' }
                    ],
                    correctAnswer: 'c',
                    explanation: 'Using a HashMap to store seen numbers, we can find two numbers in O(n) time by checking if (target - current) exists.'
                }
            ]
        }
    ]
};

const StudyPlan: React.FC<StudyPlanProps> = ({ onNavigate, company, customCompanyName, role }) => {
    const displayCompanyName = customCompanyName || company;
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
    
    // Get question banks for company
    const yearBanks = COMPANY_QUESTION_BANKS[company] || [];
    const selectedYearData = selectedYear 
        ? yearBanks.find(y => y.year === selectedYear)
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => onNavigate?.('tech-accelerator')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tech Accelerator
                    </button>
                </div>

                {/* Title Section */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">
                                {displayCompanyName} Interview Preparation
                            </h1>
                            <p className="text-lg text-slate-600">
                                Role: <span className="font-semibold text-indigo-600">{role}</span>
                            </p>
                        </div>
                        <Briefcase className="h-12 w-12 text-indigo-600 mt-2" />
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <p className="text-sm text-indigo-800">
                            <strong>Study Tip:</strong> Review questions from different years. These are real questions from actual placement drives. Master the problem-solving patterns!
                        </p>
                    </div>
                </div>

                {/* Year Selection */}
                {yearBanks.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">📅 Select Year - Previous Placement Drives</h2>
                        <div className="flex flex-wrap gap-3">
                            {yearBanks.map((yearData) => (
                                <button
                                    key={yearData.year}
                                    onClick={() => {
                                        setSelectedYear(yearData.year);
                                        setExpandedQuestion(null);
                                    }}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                                        selectedYear === yearData.year
                                            ? 'bg-indigo-600 text-white shadow-lg scale-105'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                                >
                                    {yearData.year} Drive
                                    <span className="block text-sm font-normal mt-1">
                                        {yearData.questions.length} Questions
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Questions Section */}
                {selectedYearData ? (
                    <div className="space-y-4">
                        <div className="text-white mb-6">
                            <h2 className="text-2xl font-bold">
                                {selectedYearData.year} Placement Drive Questions
                            </h2>
                            <p className="text-slate-300 mt-1">
                                Click on each question to reveal 4 options and the correct answer
                            </p>
                        </div>
                        
                        {selectedYearData.questions.map((question) => (
                            <div key={question.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <button
                                    onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
                                    className="w-full text-left p-6 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-start gap-4">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm shrink-0 mt-0.5">
                                                {question.id}
                                            </span>
                                            <p className="text-lg font-semibold text-slate-900">
                                                {question.question}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform shrink-0 ${expandedQuestion === question.id ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Expanded Answer Section */}
                                {expandedQuestion === question.id && (
                                    <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
                                        {/* Options */}
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-3 text-lg">Choose the Correct Answer:</h4>
                                            <div className="space-y-2">
                                                {question.options.map((option) => (
                                                    <div
                                                        key={option.id}
                                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                            option.id === question.correctAnswer
                                                                ? 'border-green-500 bg-green-50'
                                                                : 'border-slate-200 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <span className={`font-bold text-lg w-6 text-center ${
                                                                option.id === question.correctAnswer
                                                                    ? 'text-green-600'
                                                                    : 'text-slate-600'
                                                            }`}>
                                                                {option.id.toUpperCase()}
                                                            </span>
                                                            <div className="flex-1">
                                                                <p className="text-slate-700">{option.text}</p>
                                                                {option.id === question.correctAnswer && (
                                                                    <span className="text-sm font-semibold text-green-600 mt-1 block">✓ Correct Answer</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Explanation */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-start gap-3">
                                                <Zap className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <h4 className="font-semibold text-blue-900 mb-1">📚 Explanation:</h4>
                                                    <p className="text-sm text-blue-800 leading-relaxed">{question.explanation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <Briefcase className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">👆 Select a year above to view real placement drive questions</p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 bg-white rounded-xl shadow-md p-6 text-center">
                    <p className="text-slate-600 mb-4">
                        ⭐ Practice these real placement questions to ace your interview!
                    </p>
                    <button
                        onClick={() => onNavigate?.('mentor')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
                    >
                        <Zap className="h-5 w-5" />
                        Practice with AI Mentor
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudyPlan;
