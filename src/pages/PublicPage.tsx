// PublicPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MathCalculator from "../components/MathCalculator";
import PdfCard from "../components/PdfCard";
import PdfModal from "../components/PdfModal";
import TOPICS from "../data/topics/index";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import type { PdfItem } from "../types/models";

export default function PublicPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [pdfs, setPdfs] = useState<PdfItem[]>([]);
  const [selected, setSelected] = useState<PdfItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopics, setShowTopics] = useState(false);
  const [topicsVisible, setTopicsVisible] = useState(false);
  const [clickedTopicId, setClickedTopicId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await api.listPdfs();
        if (alive) setPdfs(rows);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Check if we just returned from a topic page
  useEffect(() => {
    const wasOnTopic = sessionStorage.getItem('returningFromTopic');
    if (wasOnTopic) {
      setShowTopics(true);
      sessionStorage.removeItem('returningFromTopic');
      // Trigger entrance animation after a small delay
      setTimeout(() => {
        setTopicsVisible(true);
      }, 50);
    }
  }, []);

  function handleOpen(pdf: PdfItem) {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: "/", message: "Sign in as admin or user to open PDFs." },
      });
      return;
    }
    setSelected(pdf);
  }

  const handleToggleTopics = () => {
    if (!showTopics) {
      setShowTopics(true);
      // Trigger entrance animation after the element is rendered
      setTimeout(() => {
        setTopicsVisible(true);
      }, 50);
    } else {
      setTopicsVisible(false);
      // Hide after exit animation completes
      setTimeout(() => {
        setShowTopics(false);
      }, 500);
    }
  };

  const handleTopicClick = (topicId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setClickedTopicId(topicId);
    // Store that we're navigating from a topic
    sessionStorage.setItem('returningFromTopic', 'true');
    // Navigate after a small delay for the click animation
    setTimeout(() => {
      navigate(`/topics/${topicId}`);
    }, 300);
  };

  return (
    <div className="space-y-8">
      <p className="mt-3 text-(--muted)">
        The calculator is public — use it without an account. Shared PDFs
        appear here for signed-in users, and the topics below help you learn
        linear algebra step by step.
      </p>

      {/* Topics Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="m-0 font-[Fraunces] text-2xl">Topics</h2>
            <p className="mt-1 text-sm text-(--muted)">
              {showTopics 
                ? "Click a topic to read a short explanation and examples." 
                : "Click the button below to explore linear algebra topics."}
            </p>
          </div>
          <button
            onClick={handleToggleTopics}
            className="rounded-lg bg-green-500 px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/25"
          >
            {showTopics ? "Hide Topics" : "Linear Algebra"}
          </button>
        </div>
        
        {/* Topics Grid - Sliding from right with animation */}
        <div className="relative overflow-hidden">
          <div 
            className={`grid gap-3 md:grid-cols-2 transition-all duration-700 ease-in-out ${
              showTopics && topicsVisible
                ? "translate-x-0 opacity-100 max-h-[5000px] mt-4" 
                : showTopics && !topicsVisible
                ? "translate-x-full opacity-0 max-h-[5000px] mt-4"
                : "translate-x-full opacity-0 max-h-0 pointer-events-none"
            }`}
          >
            {TOPICS.map((t, index) => {
              const isClicked = clickedTopicId === t.id;
              return (
                <article
                  key={t.id}
                  className={`group border border-(--line) bg-(--panel) p-4 transition-all duration-500 hover:border-green-300 hover:shadow-md hover:shadow-green-500/5 dark:hover:border-green-700 ${
                    topicsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } ${
                    isClicked ? 'scale-95 opacity-0 pointer-events-none' : ''
                  }`}
                  style={{
                    transitionDelay: topicsVisible ? `${index * 50}ms` : '0ms'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="m-0 font-[Fraunces] text-lg text-(--heading) transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                        {t.title}
                      </h3>
                      <p className="mt-1 text-sm text-(--muted) line-clamp-2">{t.summary}</p>
                    </div>
                    <span className="ml-3 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-medium text-green-700 transition-all duration-300 group-hover:bg-green-500 group-hover:text-white group-hover:scale-110 dark:bg-green-900/30 dark:text-green-300 dark:group-hover:bg-green-500 dark:group-hover:text-white">
                      {t.examples.length}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Link
                      to={`/topics/${t.id}`}
                      onClick={(e) => handleTopicClick(t.id, e)}
                      className="btn primary no-underline text-sm relative overflow-hidden group/link"
                    >
                      <span className="relative z-10">Read Topic</span>
                      <span className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                    <span className="text-xs text-(--muted)">
                      {t.examples.length} examples
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <MathCalculator />
    </div>
  );
}