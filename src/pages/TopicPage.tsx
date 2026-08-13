// TopicPage.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import TOPICS from "../data/topics/index";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const topic = TOPICS.find((t) => t.id === id);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!topic) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="font-[Fraunces] text-3xl text-[var(--heading)]">Topic not found</h2>
        <p className="mt-3 text-[var(--muted)]">
          Return to the <Link to="/" className="text-green-500 hover:text-green-600 transition-colors">public page</Link>.
        </p>
      </div>
    );
  }

  // Get gradient colors based on topic
  const getGradientColors = () => {
    const colors = [
      "from-emerald-500 to-teal-500",
      "from-blue-500 to-indigo-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-cyan-500 to-blue-500",
      "from-green-500 to-emerald-500",
    ];
    const index = topic.id.length % colors.length;
    return colors[index];
  };

  // Extract sections with numbers (1 to 10 etc)
  const sections = Array.from(
    topic?.details.matchAll(/^\s*(\d+)\.\s*(.+)$/gm) || [],
  ).map((match) => ({
    id: `topic-section-${match[1]}`,
    number: parseInt(match[1]),
    title: match[2].trim(),
    content: match[0]
  }));

  // Get the section content (between section headers)
  const getSectionContent = (sectionNumber: number) => {
    const details = topic.details;
    const sectionRegex = new RegExp(`^\\s*${sectionNumber}\\.\\s*.+$`, 'gm');
    const nextSectionRegex = new RegExp(`^\\s*${sectionNumber + 1}\\.\\s*.+$`, 'gm');
    
    let startIndex = details.search(sectionRegex);
    let endIndex = details.search(nextSectionRegex);
    
    if (startIndex === -1) return '';
    
    const headerMatch = details.substring(startIndex).match(/^.*$/m);
    if (headerMatch) {
      startIndex += headerMatch[0].length;
    }
    
    if (endIndex !== -1) {
      return details.substring(startIndex, endIndex).trim();
    } else {
      return details.substring(startIndex).trim();
    }
  };

  // Navigation functions
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const nextSlide = () => {
    if (isTransitioning || currentSlide === slides.length - 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => prev + 1);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const prevSlide = () => {
    if (isTransitioning || currentSlide === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(prev => prev - 1);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  // Create slides - First slide is the title/content overview
  const slides = [
    {
      id: 'overview',
      type: 'overview' as const,
      number: undefined,
      component: (
        <div className="relative overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--panel)] p-8 min-h-[400px]">
          <div className={`absolute top-0 right-0 h-32 w-32 rounded-full bg-gradient-to-br ${getGradientColors()} opacity-10 blur-2xl`} />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300">
                Topic #{topic.id}
              </span>
              <span className="text-xs text-[var(--muted)]">
                {sections.length} sections
              </span>
            </div>
            <h1 className="m-0 font-[Fraunces] text-4xl text-[var(--heading)] mb-4">
              {topic.title}
            </h1>
            <p className="text-[var(--muted)] leading-relaxed text-lg mb-6">
              {topic.summary}
            </p>
            
            {/* Table of Contents */}
            <div className="mt-6 border-t border-[var(--line)] pt-6">
              <h2 className="font-[Fraunces] text-xl text-[var(--heading)] flex items-center gap-2 mb-4">
                <span className="text-green-500">📑</span> Table of Contents
              </h2>
              <div className="grid gap-2 md:grid-cols-2">
                {sections.map((section, index) => {
                  const slideIndex = index + 1;
                  return (
                    <button
                      key={section.id}
                      onClick={() => goToSlide(slideIndex)}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="group flex items-center gap-3 rounded-lg p-3 transition-all duration-300 hover:bg-green-50 dark:hover:bg-green-950/20 text-left"
                    >
                      <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                        hoveredIndex === index
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/30 scale-110"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>
                        {section.number}
                      </span>
                      <span className="text-[var(--muted)] group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {section.title}
                      </span>
                      <span className="ml-auto text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )
    },
    // Add each numbered section as a slide with full content visible
    ...sections.map((section) => {
      const content = getSectionContent(section.number);
      
      return {
        id: section.id,
        type: 'section' as const,
        number: section.number,
        title: section.title,
        content: content,
        component: (
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel)] p-8 min-h-[400px]">
            {/* Section Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-2xl font-bold text-white shadow-lg shadow-green-500/30">
                  {section.number}
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-[Fraunces] text-2xl text-[var(--heading)]">
                  {section.title}
                </h2>
              </div>
            </div>

            {/* Section Content - Always visible */}
            <div className="pt-4 border-t border-[var(--line)]">
              <div
                className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-[Fraunces] prose-headings:text-[var(--heading)] prose-p:text-[var(--muted)] prose-strong:text-[var(--heading)] prose-li:text-[var(--muted)] prose-ul:list-disc prose-ol:list-decimal"
                dangerouslySetInnerHTML={{ 
                  __html: content
                    .replace(/\n/g, "<br />")
                    .replace(/```([^`]+)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
                }}
              />
            </div>
          </div>
        )
      };
    })
  ];

  // Navigate back with animation
  const handleBackToTopics = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, isTransitioning]);

  if (slides.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h2 className="font-[Fraunces] text-3xl text-[var(--heading)]">No sections found</h2>
        <p className="mt-3 text-[var(--muted)]">
          Return to the <Link to="/" className="text-green-500 hover:text-green-600 transition-colors">public page</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <Link 
          to="/"
          onClick={handleBackToTopics}
          className="group flex items-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-all duration-300 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400"
        >
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All Topics
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--muted)]">
            {currentSlide === 0 ? 'Overview' : `Section ${currentSlide} of ${slides.length - 1}`}
          </span>
        </div>
      </div>

      {/* Slide Show Container */}
      <div className="relative overflow-hidden min-h-[500px]">
        <div 
          className={`transition-all duration-700 ease-out ${
            isExiting 
              ? 'opacity-0 -translate-x-8 scale-95' 
              : isEntering 
              ? 'opacity-0 translate-x-8 scale-95' 
              : 'opacity-100 translate-x-0 scale-100'
          }`}
        >
          <div className="relative">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-500 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-8 pointer-events-none'
                    : 'opacity-0 translate-x-8 pointer-events-none'
                } ${isTransitioning ? 'scale-95' : 'scale-100'}`}
                style={{
                  position: index === currentSlide ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}
              >
                {slide.component}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0 || isTransitioning}
          className={`group flex items-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
            currentSlide === 0 || isTransitioning
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 hover:shadow-md hover:-translate-x-1'
          }`}
        >
          <svg className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {currentSlide === 0 ? 'Start' : 'Previous'}
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--muted)]">
            {currentSlide === 0 ? 'Overview' : `Section ${currentSlide} of ${slides.length - 1}`}
          </span>
          <div className="flex gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-10 bg-gradient-to-r from-green-400 to-emerald-500' 
                    : 'w-2 bg-[var(--muted)] hover:bg-green-400'
                }`}
                aria-label={slide.type === 'overview' ? 'Go to overview' : `Go to section ${slide.number}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1 || isTransitioning}
          className={`group flex items-center gap-2 rounded-lg border border-[var(--line)] px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
            currentSlide === slides.length - 1 || isTransitioning
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 hover:shadow-md hover:translate-x-1'
          }`}
        >
          {currentSlide === slides.length - 1 ? 'End' : 'Next'}
          {currentSlide < slides.length - 1 && (
            <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}