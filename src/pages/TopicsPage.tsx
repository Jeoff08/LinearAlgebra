// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import TOPICS from '../data/topics/index';

// export default function TopicsPage() {
//   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

//   const handleTopicClick = (topicId: string) => {
//     setSelectedTopic(selectedTopic === topicId ? null : topicId);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="font-[Fraunces] text-4xl text-[var(--heading)]">
//           📚 All Topics
//         </h1>
//         <Link 
//           to="/" 
//           className="group flex items-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-all duration-300 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400"
//         >
//           <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//           </svg>
//           Back to Public Page
//         </Link>
//       </div>

//       <p className="text-[var(--muted)]">
//         Browse through all available topics. Click on any topic to expand and view its content.
//       </p>

//       <div className="space-y-4">
//         {TOPICS.map((topic) => {
//           const isExpanded = selectedTopic === topic.id;
          
//           // Extract section headers for the topic
//           const sectionHeaders = Array.from(
//             topic.details.matchAll(/^\s*(\d+)\.\s*(.+)$/gm) || [],
//           ).map((match) => ({
//             number: match[1],
//             title: match[2].trim(),
//           }));

//           return (
//             <div
//               key={topic.id}
//               className="rounded-xl border border-[var(--line)] bg-[var(--panel)] overflow-hidden transition-all duration-300 hover:border-green-200 dark:hover:border-green-800"
//             >
//               {/* Topic Header - Clickable */}
//               <button
//                 onClick={() => handleTopicClick(topic.id)}
//                 className="w-full text-left p-6 transition-all duration-300 hover:bg-green-50/50 dark:hover:bg-green-950/10"
//               >
//                 <div className="flex items-start justify-between gap-4">
//                   <div className="flex-1 space-y-2">
//                     <div className="flex items-center gap-3 flex-wrap">
//                       <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300">
//                         Topic #{topic.id}
//                       </span>
//                       <span className="text-xs text-[var(--muted)]">
//                         {topic.examples.length} examples
//                       </span>
//                       <span className="text-xs text-[var(--muted)]">
//                         {sectionHeaders.length} sections
//                       </span>
//                     </div>
//                     <h2 className="font-[Fraunces] text-2xl text-[var(--heading)] transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">
//                       {topic.title}
//                     </h2>
//                     <p className="text-[var(--muted)] line-clamp-2">
//                       {topic.summary}
//                     </p>
//                   </div>
                  
//                   {/* Expand/Collapse Indicator */}
//                   <div className="flex-shrink-0 mt-1">
//                     <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 transition-all duration-500 ${
//                       isExpanded ? 'rotate-180 bg-green-100 dark:bg-green-900/30' : ''
//                     }`}>
//                       <svg 
//                         className={`h-5 w-5 transition-colors duration-300 ${
//                           isExpanded ? 'text-green-600 dark:text-green-400' : 'text-[var(--muted)]'
//                         }`}
//                         fill="none" 
//                         stroke="currentColor" 
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                       </svg>
//                     </div>
//                   </div>
//                 </div>
//               </button>

//               {/* Expanded Content */}
//               <div 
//                 className={`transition-all duration-500 ease-in-out overflow-hidden ${
//                   isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
//                 }`}
//               >
//                 <div className="border-t border-[var(--line)] p-6 space-y-6">
//                   {/* Summary */}
//                   <div className="rounded-lg border-l-4 border-green-500 bg-gray-50 dark:bg-gray-800/50 p-4">
//                     <h4 className="text-sm font-medium uppercase tracking-wider text-[var(--muted)] mb-1">
//                       Summary
//                     </h4>
//                     <p className="text-[var(--muted)]">{topic.summary}</p>
//                   </div>

//                   {/* Table of Contents */}
//                   {sectionHeaders.length > 0 && (
//                     <div>
//                       <h3 className="font-[Fraunces] text-lg text-[var(--heading)] mb-3">
//                         📑 Sections
//                       </h3>
//                       <div className="grid gap-2 sm:grid-cols-2">
//                         {sectionHeaders.map((section) => (
//                           <div
//                             key={section.number}
//                             className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 p-3"
//                           >
//                             <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
//                               {section.number}
//                             </span>
//                             <span className="text-sm text-[var(--muted)]">
//                               {section.title}
//                             </span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Full Explanation */}
//                   <div>
//                     <h3 className="font-[Fraunces] text-lg text-[var(--heading)] mb-3">
//                       📖 Explanation
//                     </h3>
//                     <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-[Fraunces] prose-headings:text-[var(--heading)] prose-p:text-[var(--muted)] prose-strong:text-[var(--heading)] prose-li:text-[var(--muted)]">
//                       {topic.details.split('\n').map((paragraph, idx) => {
//                         // Check if it's a section header
//                         const sectionMatch = paragraph.match(/^\s*(\d+)\.\s*(.+)$/);
//                         if (sectionMatch) {
//                           return (
//                             <h4 key={idx} className="mt-4 text-lg font-semibold text-[var(--heading)]">
//                               {sectionMatch[1]}. {sectionMatch[2].trim()}
//                             </h4>
//                           );
//                         }
//                         if (paragraph.trim()) {
//                           return <p key={idx} className="text-[var(--muted)]">{paragraph.trim()}</p>;
//                         }
//                         return <br key={idx} />;
//                       })}
//                     </div>
//                   </div>

//                   {/* Examples */}
//                   {topic.examples.length > 0 && (
//                     <div>
//                       <h3 className="font-[Fraunces] text-lg text-[var(--heading)] mb-3">
//                         💡 Examples
//                       </h3>
//                       <div className="grid gap-3 sm:grid-cols-2">
//                         {topic.examples.map((example, idx) => (
//                           <div
//                             key={idx}
//                             className="rounded-lg border border-[var(--line)] p-4 transition-all duration-300 hover:border-purple-300 hover:shadow-md dark:hover:border-purple-700"
//                           >
//                             <div className="flex items-start gap-3">
//                               <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
//                                 {idx + 1}
//                               </span>
//                               <p className="text-sm text-[var(--muted)]">{example}</p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {/* Navigation to individual topic page */}
//                   <div className="pt-4 border-t border-[var(--line)]">
//                     <Link
//                       to={`/topics/${topic.id}`}
//                       className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25"
//                     >
//                       View Full Topic Page
//                       <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                       </svg>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Stats Footer */}
//       <div className="flex items-center justify-between border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
//         <div className="flex items-center gap-4">
//           <span>Total Topics: {TOPICS.length}</span>
//           <span>•</span>
//           <span>Click any topic to expand</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
//           <span>Interactive</span>
//         </div>
//       </div>
//     </div>
//   );
// }