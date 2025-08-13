import React, { useState } from 'react';
import type { Team, Domain, SuperDomain, FilterState } from './RoadmapBoard';

interface FilterBarProps {
  teams: Team[];
  domains: Domain[];
  superDomains: SuperDomain[];
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  teams,
  domains,
  superDomains,
  filters,
  onFiltersChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTeamToggle = (teamId: string) => {
    const newTeams = filters.teams.includes(teamId)
      ? filters.teams.filter(id => id !== teamId)
      : [...filters.teams, teamId];
    onFiltersChange({ teams: newTeams });
  };

  const handleDomainToggle = (domainId: string) => {
    const newDomains = filters.domains.includes(domainId)
      ? filters.domains.filter(id => id !== domainId)
      : [...filters.domains, domainId];
    onFiltersChange({ domains: newDomains });
  };

  const handleSuperDomainToggle = (superDomainId: string) => {
    const newSuperDomains = filters.superDomains.includes(superDomainId)
      ? filters.superDomains.filter(id => id !== superDomainId)
      : [...filters.superDomains, superDomainId];
    onFiltersChange({ superDomains: newSuperDomains });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      teams: [],
      domains: [],
      superDomains: [],
    });
  };

  const getActiveFilterCount = () => {
    return filters.teams.length + filters.domains.length + filters.superDomains.length;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Roadmap Board</h2>
          
          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <span>Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-brand-yellow text-brand-dark-green text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Clear Filters Button */}
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-500">
          Showing {domains.length} domains across {teams.length} teams
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Teams Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Teams</h3>
              <div className="space-y-2">
                {teams.map((team) => (
                  <label key={team.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.teams.includes(team.id)}
                      onChange={() => handleTeamToggle(team.id)}
                      className="rounded border-gray-300 text-brand-dark-green focus:ring-brand-light-green"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: team.color || '#6B7280' }}
                      />
                      <span className="text-sm text-gray-700">{team.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Super Domains Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Super Domains</h3>
              <div className="space-y-2">
                {superDomains.map((superDomain) => (
                  <label key={superDomain.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.superDomains.includes(superDomain.id)}
                      onChange={() => handleSuperDomainToggle(superDomain.id)}
                      className="rounded border-gray-300 text-brand-dark-green focus:ring-brand-light-green"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: superDomain.color || '#6B7280' }}
                      />
                      <span className="text-sm text-gray-700">{superDomain.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Domains Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Workstreams</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {domains.map((domain) => {
                  const superDomain = superDomains.find(sd => sd.id === domain.super_domain_id);
                  return (
                    <label key={domain.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.domains.includes(domain.id)}
                        onChange={() => handleDomainToggle(domain.id)}
                        className="rounded border-gray-300 text-brand-dark-green focus:ring-brand-light-green"
                      />
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: domain.color || '#6B7280' }}
                        />
                        <span className="text-sm text-gray-700">{domain.name}</span>
                        {superDomain && (
                          <span className="text-xs text-gray-500">
                            ({superDomain.name})
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
