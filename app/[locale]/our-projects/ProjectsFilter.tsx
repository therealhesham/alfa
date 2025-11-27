'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, X, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string | null;
  category: string | null;
  year: string | number | null;
}

interface ProjectsFilterProps {
  projects: Project[];
  locale: 'ar' | 'en';
  settings?: any;
}

export default function ProjectsFilter({ projects, locale, settings }: ProjectsFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = projects
      .map(p => p.category)
      .filter((cat): cat is string => cat !== null && cat !== '')
      .filter((cat, index, self) => self.indexOf(cat) === index)
      .sort();
    return cats;
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === null || project.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== null;

  return (
    <div style={{ width: '100%' }}>
      {/* Search and Filter Bar */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto 3rem',
        padding: '0 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%'
        }}>
          <Search 
            size={20} 
            style={{
              position: 'absolute',
              left: locale === 'ar' ? 'auto' : '1.25rem',
              right: locale === 'ar' ? '1.25rem' : 'auto',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#999',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'ar' ? 'ابحث في المشاريع...' : 'Search projects...'}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3.5rem',
              paddingRight: locale === 'ar' ? '3.5rem' : '1rem',
              paddingLeft: locale === 'ar' ? '1rem' : '3.5rem',
              fontSize: '1rem',
              border: '2px solid rgba(15, 28, 42, 0.1)',
              borderRadius: '50px',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
              background: 'white',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--gold)';
              e.target.style.boxShadow = '0 0 0 3px rgba(212, 193, 157, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(15, 28, 42, 0.1)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: locale === 'ar' ? 'auto' : '1.25rem',
                left: locale === 'ar' ? '1.25rem' : 'auto',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
                transition: 'color 0.2s ease',
                zIndex: 2
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#666';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#999';
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'white',
              color: 'var(--dark)',
              border: '2px solid rgba(15, 28, 42, 0.1)',
              borderRadius: '50px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
            }}
          >
            <Filter size={16} />
            {locale === 'ar' ? 'الفئات' : 'Categories'}
          </button>

          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(selectedCategory === category ? null : category);
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: selectedCategory === category ? 'var(--gold)' : 'white',
                color: selectedCategory === category ? 'white' : 'var(--dark)',
                border: `2px solid ${selectedCategory === category ? 'var(--gold)' : 'rgba(15, 28, 42, 0.1)'}`,
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                boxShadow: selectedCategory === category ? '0 4px 12px rgba(212, 193, 157, 0.3)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {category}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'rgba(15, 28, 42, 0.05)',
                color: 'var(--dark)',
                border: '2px solid rgba(15, 28, 42, 0.1)',
                borderRadius: '50px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(15, 28, 42, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 28, 42, 0.05)';
              }}
            >
              <X size={16} />
              {locale === 'ar' ? 'مسح الفلاتر' : 'Clear Filters'}
            </button>
          )}
        </div>

        {/* Results Count */}
        <div style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '0.95rem',
          fontFamily: settings?.bodyFont || 'var(--body-font, inherit)'
        }}>
          {locale === 'ar' 
            ? `عرض ${filteredProjects.length} من ${projects.length} مشروع`
            : `Showing ${filteredProjects.length} of ${projects.length} projects`}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '5rem 2rem',
          color: '#666'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem',
            opacity: 0.3
          }}>🔍</div>
          <p style={{
            fontSize: '1.2rem',
            fontFamily: settings?.bodyFont || 'var(--body-font, inherit)',
            opacity: 0.8,
            marginBottom: '0.5rem'
          }}>
            {locale === 'ar' 
              ? 'لم يتم العثور على مشاريع' 
              : 'No projects found'}
          </p>
          <p style={{
            fontSize: '0.95rem',
            fontFamily: settings?.bodyFont || 'var(--body-font, inherit)',
            opacity: 0.6
          }}>
            {locale === 'ar' 
              ? 'جرب البحث بكلمات مختلفة أو اختر فئة أخرى' 
              : 'Try different search terms or select another category'}
          </p>
        </div>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id}
              className="project-card project-fade-in"
              style={{
                position: 'relative',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="project-image" style={{
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Image
                  src={project.image || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
                  alt={project.title}
                  fill
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  unoptimized
                />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(15, 28, 42, 0.1) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease'
                }} className="project-overlay" />
              </div>
              <div className="project-content" style={{
                padding: '2rem'
              }}>
                {project.category && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--gold)',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
                  }}>
                    {project.category}
                  </div>
                )}
                <h3 style={{ 
                  fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                  fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                  fontWeight: 700,
                  color: 'var(--dark)',
                  marginBottom: '1rem',
                  lineHeight: 1.3,
                  letterSpacing: '-0.01em'
                }}>
                  {project.title}
                </h3>
                <p style={{ 
                  fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#555',
                  marginBottom: '1.5rem',
                  opacity: 0.9
                }}>
                  {project.description}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid rgba(15, 28, 42, 0.08)'
                }}>
                  {project.location && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      color: '#666',
                      fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
                    }}>
                      <MapPin size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      <span>{project.location}</span>
                    </div>
                  )}
                  {project.year && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.9rem',
                      color: '#666',
                      fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
                    }}>
                      <Calendar size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      <span>{project.year}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

