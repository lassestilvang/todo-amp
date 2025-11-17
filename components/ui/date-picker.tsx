'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  date?: Date | null
  onDateChange: (date: Date | null) => void
  placeholder?: string
  disabled?: boolean
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Pick a date',
  disabled = false,
}: DatePickerProps) {
  const handleSelect = (day: Date | undefined) => {
    onDateChange(day ?? null)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-between pl-3 pr-3 text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <span>{date ? format(date, 'PPP') : placeholder}</span>
          <CalendarIcon className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={handleSelect}
          disabled={disabled ? () => false : undefined}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
