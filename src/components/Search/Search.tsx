import { AnimatedText } from '@/components/AnimatedText'
import { SearchBar } from '@/components/SearchBar'
import { Checkbox } from '@nextui-org/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { SearchResult, SearchResultProps } from '../SearchResult'

export type SearchProps = {
  query?: string
  onQueryChange?: (query: string) => void
  searching?: boolean
  results?: SearchResultProps['files']
  onSearch?: (query: string) => void
  selectedFiles?: SearchResultProps['selected']
  onSelect?: SearchResultProps['onSelect']
  compact?: boolean
}

const fileTypes = ['pdf', 'document', 'video', 'audio', 'image', 'folder']

export const Search: React.FC<SearchProps> = ({
  query,
  onQueryChange,
  searching,
  results,
  onSearch,
  selectedFiles,
  onSelect,
  compact,
}) => {
  const [selectedFileTypes, setSelectedFileTypes] =
    useState<string[]>(fileTypes)

  const handleFilterChange = (type: string, checked: boolean) => {
    setSelectedFileTypes((prev) =>
      checked ? [...prev, type] : prev.filter((t) => t !== type),
    )
  }

  const filteredResults = results?.filter((file) =>
    selectedFileTypes.includes(file.type),
  )

  return (
    <div className="flex flex-col p-4">
      <SearchBar
        className={clsx(
          'transition',
          'mb-10',
          'mx-5',
          compact && ['opacity-0', 'invisible', 'h-0', 'mb-0'],
        )}
        value={query}
        pending={searching}
        onChange={(e) => onQueryChange && onQueryChange(e.target.value)}
        onSubmit={() => {
          onSearch && onSearch(query || '')
        }}
      />
      <div className="mb-4 mx-auto">
        {fileTypes.map((type) => (
          <Checkbox
            className="mx-3"
            key={type}
            isSelected={selectedFileTypes.includes(type)}
            onChange={(e) => handleFilterChange(type, e.target.checked)}
          >
            {type}
          </Checkbox>
        ))}
      </div>
      <div>
        {typeof results !== 'undefined' && (
          <SearchResult
            title={
              <div className="flex flex-row items-center gap-2">
                <AnimatedText
                  maxTime={500}
                  text={compact ? query! : 'Search results'}
                />
              </div>
            }
            description={
              <AnimatedText
                maxTime={500}
                text={
                  compact
                    ? `Ask me anything to help with your studies!`
                    : `Select at least one file to start a new conversation.`
                }
              />
            }
            selected={selectedFiles}
            onSelect={onSelect}
            files={filteredResults}
            hideList={compact}
            compactOverview={compact}
          />
        )}
      </div>
    </div>
  )
}
