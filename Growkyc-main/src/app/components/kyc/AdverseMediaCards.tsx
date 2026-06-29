import React, { useState, useMemo } from 'react';
import { Badge } from '../ui/badge';
import {
  Newspaper, ExternalLink, ChevronDown, ChevronUp,
  FileText, Globe, Calendar, AlertTriangle, Shield,
  Filter, Sparkles, TrendingUp, BarChart3, XCircle,
  CheckCircle, Clock, Search, ArrowUpRight
} from 'lucide-react';
import { AdverseMediaHit } from './AMLHitsData';

interface AdverseMediaCardsProps {
  articles: AdverseMediaHit[];
  clientName: string;
}

type SeverityFilter = 'All' | 'Critical' | 'High' | 'Medium' | 'Low';
type CategoryFilter = 'All' | AdverseMediaHit['category'];

const SEVERITY_CONFIG = {
  Critical: { border: 'border-red-300', bg: 'bg-red-500/10', badgeBg: 'bg-red-600', text: 'text-red-300', lightBg: 'bg-red-500/10', icon: XCircle, scoreColor: 'text-red-400', scoreBg: 'bg-red-500/15', scoreRing: 'ring-red-200' },
  High:     { border: 'border-orange-300', bg: 'bg-orange-500/10', badgeBg: 'bg-orange-500', text: 'text-orange-300', lightBg: 'bg-orange-500/10', icon: AlertTriangle, scoreColor: 'text-orange-400', scoreBg: 'bg-orange-500/15', scoreRing: 'ring-orange-200' },
  Medium:   { border: 'border-yellow-300', bg: 'bg-yellow-500/10', badgeBg: 'bg-yellow-500', text: 'text-yellow-300', lightBg: 'bg-yellow-500/10', icon: AlertTriangle, scoreColor: 'text-yellow-400', scoreBg: 'bg-yellow-500/15', scoreRing: 'ring-yellow-200' },
  Low:      { border: 'border-blue-500/30', bg: 'bg-blue-500/10', badgeBg: 'bg-blue-500', text: 'text-blue-300', lightBg: 'bg-blue-500/10', icon: Shield, scoreColor: 'text-blue-400', scoreBg: 'bg-blue-500/15', scoreRing: 'ring-blue-200' },
};

const CATEGORY_ICONS: Record<string, string> = {
  'Financial Crime': '💰', 'Fraud': '🔍', 'Corruption': '⚖️',
  'Regulatory': '📋', 'Legal': '⚖️', 'Reputational': '📰',
};

function generateAISummary(article: AdverseMediaHit): string {
  const sev = article.severity === 'Critical' ? 'critically alarming' : article.severity === 'High' ? 'highly concerning' : article.severity === 'Medium' ? 'moderately concerning' : 'low-priority';
  const rel = article.relevanceScore >= 90 ? 'This article is directly and specifically relevant to the subject entity with near-certain attribution.' : article.relevanceScore >= 70 ? 'Strong correlation to the subject entity has been identified through named references and contextual matching.' : article.relevanceScore >= 50 ? 'Moderate relevance detected — the subject entity is mentioned but may not be the primary focus of the article.' : 'Weak relevance — the subject entity may be tangentially mentioned or is part of a broader industry commentary.';
  return `AI Assessment: This ${sev} ${article.category.toLowerCase()} article published by ${article.publication} on ${article.publishDate} carries a relevance score of ${article.relevanceScore}%. ${rel} Recommend ${article.severity === 'Critical' || article.severity === 'High' ? 'immediate compliance review and escalation to senior management.' : 'routine monitoring and inclusion in the next periodic review.'}`;
}

export function AdverseMediaCards({ articles, clientName }: AdverseMediaCardsProps) {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCard = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredArticles = useMemo(() =>
    articles
      .filter(a => severityFilter === 'All' || a.severity === severityFilter)
      .filter(a => categoryFilter === 'All' || a.category === categoryFilter)
      .filter(a => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return a.headline.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.publication.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const order = { Critical: 0, High: 1, Medium: 2, Low: 3 };
        return order[a.severity] !== order[b.severity] ? order[a.severity] - order[b.severity] : b.relevanceScore - a.relevanceScore;
      }),
    [articles, severityFilter, categoryFilter, searchQuery]
  );

  const severityDist = useMemo(() => {
    const d = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    articles.forEach(a => d[a.severity]++);
    return d;
  }, [articles]);

  const avgRelevance = useMemo(() => articles.length === 0 ? 0 : Math.round(articles.reduce((s, a) => s + a.relevanceScore, 0) / articles.length), [articles]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(articles.map(a => a.category)))], [articles]);
  const overallScore = useMemo(() => {
    if (articles.length === 0) return 0;
    const w = { Critical: 100, High: 75, Medium: 50, Low: 25 };
    return Math.round(articles.reduce((s, a) => s + w[a.severity] * (a.relevanceScore / 100), 0) / articles.length);
  }, [articles]);

  if (articles.length === 0) return null;

  return (
    <div style={{ border: '2px solid #fbbf24', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', background: '#fff' }}>

      {/* ── ORANGE HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg, #d97706, #ea580c, #dc2626)', borderRadius: '10px 10px 0 0', padding: '24px 24px 0' }}>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px' }}>
              <Newspaper style={{ width: 28, height: 28, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Adverse Media Screening Results</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{articles.length} article{articles.length !== 1 ? 's' : ''} found for {clientName}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" onClick={() => setExpandedCards(new Set(filteredArticles.map(a => a.id)))}
              style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
              Expand All
            </button>
            <button type="button" onClick={() => setExpandedCards(new Set())}
              style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
              Collapse All
            </button>
          </div>
        </div>

        {/* Severity score tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px', marginBottom: '16px' }}>
          {/* Overall */}
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Overall Score</div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: overallScore >= 75 ? '#fca5a5' : overallScore >= 50 ? '#fde68a' : '#bbf7d0' }}>{overallScore}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{overallScore >= 75 ? 'Critical' : overallScore >= 50 ? 'Elevated' : 'Manageable'}</div>
          </div>

          {/* Severity filter buttons */}
          {(['Critical', 'High', 'Medium', 'Low'] as const).map(sev => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(prev => prev === sev ? 'All' : sev)}
              style={{
                background: severityFilter === sev ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '12px',
                textAlign: 'center',
                border: severityFilter === sev ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{sev}</div>
              <div style={{ fontSize: '26px', fontWeight: 700, color: '#fff' }}>{severityDist[sev]}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{severityDist[sev] === 1 ? 'article' : 'articles'}</div>
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{ background: 'rgba(0,0,0,0.15)', margin: '0 -24px', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Filters:</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat as CategoryFilter)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: categoryFilter === cat ? '#fff' : 'rgba(255,255,255,0.15)',
                  color: categoryFilter === cat ? '#1f2937' : 'rgba(255,255,255,0.85)',
                  transition: 'all 0.15s',
                }}
              >
                {cat !== 'All' && CATEGORY_ICONS[cat] ? `${CATEGORY_ICONS[cat]} ` : ''}{cat}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <Search style={{ width: 14, height: 14, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              style={{ paddingLeft: 30, paddingRight: 14, paddingTop: 6, paddingBottom: 6, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', fontSize: '13px', color: '#fff', width: '180px', outline: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* ── ARTICLE CARDS BODY ── */}
      <div style={{ padding: '24px', background: 'linear-gradient(to bottom,#f9fafb,#fff)' }}>
        {filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Search style={{ width: 48, height: 48, color: '#d1d5db', margin: '0 auto 12px' }} />
            <p style={{ color: '#6b7280', fontWeight: 500 }}>No articles match your current filters.</p>
            <button type="button" onClick={() => { setSeverityFilter('All'); setCategoryFilter('All'); setSearchQuery(''); }}
              style={{ color: '#d97706', fontWeight: 600, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}>
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredArticles.map(article => {
              const cfg = SEVERITY_CONFIG[article.severity];
              const SevIcon = cfg.icon;
              const isExpanded = expandedCards.has(article.id);
              const aiSummary = generateAISummary(article);

              return (
                <div key={article.id} className={`rounded-xl border-2 ${cfg.border} shadow-sm hover:shadow-md transition-shadow`} style={{ overflow: 'hidden' }}>

                  {/* Card collapsed row */}
                  <div className={cfg.bg} style={{ padding: '20px', cursor: 'pointer' }} onClick={() => toggleCard(article.id)}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>

                      {/* Score circle */}
                      <div className={`w-16 h-16 rounded-2xl ${cfg.scoreBg} ring-2 ${cfg.scoreRing} flex-shrink-0`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <SevIcon className={`w-5 h-5 ${cfg.scoreColor}`} />
                        <span className={`text-lg font-black ${cfg.scoreColor}`} style={{ lineHeight: 1 }}>{article.relevanceScore}</span>
                        <span className={`${cfg.scoreColor} uppercase`} style={{ fontSize: 9, fontWeight: 700, opacity: 0.7 }}>score</span>
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <Badge className={`${cfg.badgeBg} text-white font-bold text-xs uppercase`}>{article.severity}</Badge>
                          <Badge variant="outline" className="bg-white text-slate-300 text-xs">{CATEGORY_ICONS[article.category] || '📄'} {article.category}</Badge>
                          <Badge variant="outline" className={`${cfg.lightBg} ${cfg.text} text-xs`}>
                            <TrendingUp className="w-3 h-3 mr-1" />{article.relevanceScore}% Relevance
                          </Badge>
                        </div>
                        <h4 style={{ fontWeight: 700, fontSize: '16px', color: '#111827', marginBottom: '8px' }}>{article.headline}</h4>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6b7280' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Globe style={{ width: 14, height: 14 }} />{article.publication}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar style={{ width: 14, height: 14 }} />
                            {new Date(article.publishDate).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                        <a href={article.url} target="_blank" rel="noopener noreferrer"
                          className={`p-2 rounded-lg ${cfg.lightBg} ${cfg.text}`}
                          onClick={e => e.stopPropagation()} title="Open article">
                          <ArrowUpRight style={{ width: 16, height: 16 }} />
                        </a>
                        <span className={`p-2 rounded-lg ${cfg.lightBg} ${cfg.text}`}>
                          {isExpanded ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ background: '#fff', borderTop: '2px dashed #e5e7eb' }}>
                      {/* AI Summary */}
                      <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <div style={{ padding: '6px', background: 'linear-gradient(135deg,#7c3aed,#9333ea)', borderRadius: '8px' }}>
                            <Sparkles style={{ width: 14, height: 14, color: '#fff' }} />
                          </div>
                          <span style={{ fontWeight: 700, color: '#111827' }}>AI-Generated Analysis</span>
                          <Badge variant="outline" className="bg-violet-500/10 text-violet-300 border-violet-500/30 text-xs">Auto-generated</Badge>
                        </div>
                        <div style={{ background: 'linear-gradient(to right,#f5f3ff,#faf5ff)', borderRadius: '10px', padding: '16px', border: '1px solid #ede9fe' }}>
                          <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{aiSummary}</p>
                        </div>
                      </div>

                      {/* Article summary */}
                      <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <FileText style={{ width: 18, height: 18, color: '#6b7280' }} />
                          <span style={{ fontWeight: 700, color: '#111827' }}>Article Summary</span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.7, paddingLeft: '26px' }}>{article.summary}</p>
                      </div>

                      {/* Detail grid */}
                      <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
                          {[
                            { label: 'Publication', val: article.publication, icon: <Globe style={{ width: 14, height: 14, color: '#9ca3af' }} /> },
                            { label: 'Published Date', val: article.publishDate, icon: <Calendar style={{ width: 14, height: 14, color: '#9ca3af' }} /> },
                            { label: 'Category', val: `${CATEGORY_ICONS[article.category] || '📄'} ${article.category}` },
                          ].map(({ label, val, icon }) => (
                            <div key={label} style={{ background: '#f9fafb', borderRadius: '10px', padding: '14px', border: '1px solid #e5e7eb' }}>
                              <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 6 }}>{label}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>{icon}<span style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>{val}</span></div>
                            </div>
                          ))}
                          <div className={`${cfg.scoreBg} rounded-xl border-2 ${cfg.border}`} style={{ padding: '14px' }}>
                            <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 6 }}>Severity</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <SevIcon className={`w-5 h-5 ${cfg.scoreColor}`} />
                              <span className={`font-black text-lg ${cfg.scoreColor}`}>{article.severity}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Relevance meter */}
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <BarChart3 style={{ width: 14, height: 14 }} /> Relevance Score
                          </span>
                          <span className={`text-sm font-black ${cfg.scoreColor}`}>{article.relevanceScore}%</span>
                        </div>
                        <div style={{ background: '#e5e7eb', borderRadius: '999px', height: 10, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '999px', width: `${article.relevanceScore}%`, background: article.relevanceScore >= 90 ? 'linear-gradient(to right,#ef4444,#f43f5e)' : article.relevanceScore >= 70 ? 'linear-gradient(to right,#f97316,#f59e0b)' : article.relevanceScore >= 50 ? 'linear-gradient(to right,#eab308,#f59e0b)' : 'linear-gradient(to right,#3b82f6,#06b6d4)', transition: 'width 0.6s' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: 4 }}>
                          <span>Low Relevance</span><span>High Relevance</span>
                        </div>
                      </div>

                      {/* Source / actions footer */}
                      <div style={{ padding: '16px 20px', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Clock style={{ width: 14, height: 14 }} />
                          Screened on {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button type="button" onClick={e => e.stopPropagation()}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff', color: '#374151', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
                            <CheckCircle style={{ width: 14, height: 14 }} /> Mark Reviewed
                          </button>
                          <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className={`inline-flex items-center gap-2 px-4 py-2 ${cfg.badgeBg} text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity`}>
                            <ExternalLink style={{ width: 14, height: 14 }} /> Read Full Article
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {filteredArticles.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280' }}>
            <span>
              Showing {filteredArticles.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
              {severityFilter !== 'All' && ` · Filtered by: ${severityFilter}`}
              {categoryFilter !== 'All' && ` · Category: ${categoryFilter}`}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart3 style={{ width: 14, height: 14 }} />
              Avg. Relevance: <strong style={{ color: '#374151' }}>{avgRelevance}%</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
