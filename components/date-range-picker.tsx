import type React from "react"

interface DatePickerWithRangeProps {
  onChange: (range: { from: string | null; to: string | null }) => void
  value: { from: string | null; to: string | null }
}

export const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({ onChange, value }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: inputValue } = e.target
    onChange({
      ...value,
      [name]: inputValue,
    })
  }

  return (
    <div className="flex space-x-4">
      <div>
        <label htmlFor="from" className="block text-sm font-medium text-gray-700">
          From
        </label>
        <input
          type="date"
          id="from"
          name="from"
          value={value.from || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="to" className="block text-sm font-medium text-gray-700">
          To
        </label>
        <input
          type="date"
          id="to"
          name="to"
          value={value.to || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </div>
    </div>
  )
}

