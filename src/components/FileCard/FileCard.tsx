import { Chip } from '@nextui-org/react'
import React from 'react'

export type FileCardProps = {
  name: string
  extension: string
  icon: React.ReactNode
  excerpt?: string
  tags?: string[]
  startContent?: React.ReactNode
}

export const FileCard: React.FC<FileCardProps> = ({
  name,
  extension,
  icon,
  tags,
  excerpt,
  startContent,
}) => {
  const displayName =
    !!extension && name.endsWith(extension)
      ? name.slice(0, name.length - (extension || '').length)
      : name
  const extensionChip = extension ? (
    <Chip color="primary" size="sm" radius="full" className="ms-2 opacity-90">
      {extension}
    </Chip>
  ) : null

  return (
    <div className="flex flex-row items-center">
      {startContent}
      <div className="w-6 h-6 flex items-center justify-center fill-primary-500">
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex items-center">
          <span className="font-medium">{displayName}</span>
          {extensionChip}
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">
            {excerpt || displayName}
          </span>
          <div className="flex gap-1">
            {(tags || []).slice(0, 2).map((tag, index) => (
              <Chip key={index} size="sm" radius="full">
                {tag}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
