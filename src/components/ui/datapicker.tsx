'use client'

import { format, isValid, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, X } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  date: Date | null | undefined
  setDate: (date: Date | null | undefined) => void
  label: 'start' | 'end'
  className?: string
  onInvalidChange?: (invalid: boolean) => void
}

export function DatePicker({ date, setDate, label, className, onInvalidChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : '')
  const ignoreNextBlurRef = React.useRef(false)
  const selectedDate = date ?? undefined

  function clearDate() {
    ignoreNextBlurRef.current = true
    setInputValue('')
    setDate(null)
    onInvalidChange?.(false)
    setOpen(false)
  }

  function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  function formatDateValue(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 8)

    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
  }

  function parseDateValue(value: string) {
    if (value.length !== 10) return undefined

    const parsedDate = parse(value, 'dd/MM/yyyy', new Date(), { locale: ptBR })

    if (!isValid(parsedDate)) return undefined
    if (format(parsedDate, 'dd/MM/yyyy', { locale: ptBR }) !== value) return undefined

    return parsedDate
  }

  const months = Array.from({ length: 12 }).map((_, i) => capitalize(format(new Date(2020, i, 1), 'MMMM', { locale: ptBR })))

  React.useEffect(() => {
    setInputValue(date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : '')
  }, [date])

  return (
    <Field>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          <Input
            value={inputValue}
            placeholder={label === 'start' ? 'Data de início' : 'Data de término'}
            className={cn(inputValue ? 'pr-20' : 'pr-11', className)}
            onChange={event => {
              const formattedValue = formatDateValue(event.target.value)

              setInputValue(formattedValue)

              if (!formattedValue) {
                clearDate()
                return
              }

              const parsedDate = parseDateValue(formattedValue)

              if (parsedDate) {
                setDate(parsedDate)
                onInvalidChange?.(false)
              }
            }}
            onBlur={() => {
              if (ignoreNextBlurRef.current) {
                ignoreNextBlurRef.current = false
                return
              }

              if (!inputValue) {
                setDate(null)
                onInvalidChange?.(false)
                return
              }

              const parsedDate = parseDateValue(inputValue)

              if (parsedDate) {
                setDate(parsedDate)
                setInputValue(format(parsedDate, 'dd/MM/yyyy', { locale: ptBR }))
                onInvalidChange?.(false)
                return
              }

              setDate(null)
              onInvalidChange?.(true)
            }}
          />

          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-translate-y-1/2 absolute top-1/2 right-9"
              aria-label={label === 'start' ? 'Limpar data de início' : 'Limpar data de término'}
              onPointerDown={event => {
                event.preventDefault()
                clearDate()
              }}
            >
              <X className="size-4" />
            </Button>
          )}

          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-translate-y-1/2 absolute top-1/2 right-1"
              aria-label={label === 'start' ? 'Selecionar data de início' : 'Selecionar data de término'}
            >
              <CalendarDays className="size-4" />
            </Button>
          </PopoverTrigger>
        </div>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            defaultMonth={selectedDate}
            locale={ptBR}
            captionLayout="dropdown"
            startMonth={new Date(2000, 0)}
            endMonth={new Date(2050, 11)}
            formatters={{
              formatMonthDropdown: month => months[month.getMonth()],
              formatCaption: date => format(date, 'MMMM yyyy', { locale: ptBR }),
            }}
            onSelect={date => {
              setDate(date)
              setInputValue(date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : '')
              onInvalidChange?.(false)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
