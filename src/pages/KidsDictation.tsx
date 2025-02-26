'use client'

import { useState, useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
//import { Input } from '@/components/ui/input'

const sumsOptions = ['1', '2']
const rowsOptions = Array.from({ length: 100 }, (_, i) => (i + 3).toString())
const timesOptions = Array.from({ length: 120 }, (_, i) => (i + 1).toString())
const typeOptions = ['SD', 'SD/DD', 'D3', 'D4']

export default function DictationComponent() {
  const [sums, setSums] = useState('1')
  const [type, setType] = useState('SD')
  const [rows, setRows] = useState('3')
  const [time, setTime] = useState('3')
  const [currentNumbers, setCurrentNumbers] = useState<(number | null)[]>([null, null])
  const [dictationActive, setDictationActive] = useState(false)
  const [dictationEnded, setDictationEnded] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [accumulatedNumbers, setAccumulatedNumbers] = useState<string[]>(['', ''])

  const numbersRef = useRef<number[][]>([[], []])
  const currentIndexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startDictation = () => {
    const rowCount = parseInt(rows, 10)
    numbersRef.current = [generateRandomNumbers(type, rowCount), generateRandomNumbers(type, rowCount)]
    setDictationActive(true)
    setDictationEnded(false)
    setShowAnswer(false)
    setAccumulatedNumbers(['', ''])
    currentIndexRef.current = 0
    displayNextNumber()
  }

  const displayNextNumber = () => {
    const rowCount = parseInt(rows, 10)
    const timePerNumber = Math.max(100, (parseInt(time, 10) * 1000) / rowCount)

    if (currentIndexRef.current < numbersRef.current[0].length) {
      const newNumbers = numbersRef.current.map(arr => arr[currentIndexRef.current])
      setCurrentNumbers([newNumbers[0], sums === '2' ? newNumbers[1] : null])

      setAccumulatedNumbers(prev => prev.map((acc, i) => acc ? `${acc}, ${newNumbers[i]}` : `${newNumbers[i]}`))

      currentIndexRef.current++
      timeoutRef.current = setTimeout(displayNextNumber, timePerNumber)
    } else {
      setDictationActive(false)
      setDictationEnded(true)
    }
  }

  const generateRandomNumbers = (type: string, count: number): number[] => {
    const numbers: number[] = []
    let sum = 0
    
    for (let i = 0; i < count; i++) {
      let number = Math.floor(Math.random() * 9) + 1
      if (type === 'SD/DD') number = Math.random() < 0.5 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 90) + 10
      else if (type === 'D3') number = Math.floor(Math.random() * 900) + 100
      else if (type === 'D4') number = Math.floor(Math.random() * 9000) + 1000
      
      if (Math.random() < 0.5) number = -number
      while (sum + number < 0) number = Math.abs(number)
      
      numbers.push(number)
      sum += number
    }
    return numbers
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-purple-600 text-white">
          <h1 className="text-2xl font-bold">Kid's Dictation Activity</h1>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[{ label: 'Sum(s):', value: sums, setter: setSums, options: sumsOptions },
              { label: 'Type:', value: type, setter: setType, options: typeOptions },
              { label: 'Rows:', value: rows, setter: setRows, options: rowsOptions },
              { label: 'Total Time (sec):', value: time, setter: setTime, options: timesOptions }].map(({ label, value, setter, options }) => (
                <div key={label}>
                  <label className="block text-sm font-medium text-gray-700">{label}</label>
                  <Select value={value} onValueChange={setter}>
                    <SelectTrigger className="w-full"><SelectValue placeholder={`Select ${label}`} /></SelectTrigger>
                    <SelectContent>
                      {options.map(option => (<SelectItem key={option} value={option}>{option}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
          </div>
          <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={startDictation}>Start Dictation</Button>
        </div>

        <div className="flex flex-wrap gap-4 p-4 justify-center">
          {accumulatedNumbers.map((accNumbers, index) => (
            sums === '1' && index === 1 ? null : (
              <div key={index} className="w-full md:w-1/2 text-center">
                {dictationActive && <div className="text-9xl font-bold text-blue-500">{currentNumbers[index] ?? '-'}</div>}
                {dictationEnded && showAnswer && <p className="text-9xl font-bold text-green-500">{numbersRef.current[index].reduce((acc, num) => acc + num, 0)}</p>}
                {/* {dictationEnded && <Input className="w-full text-2xl text-center font-bold text-orange-600" placeholder="Enter your answer" />} */}
                <p className="p-2 text-5xl font-bold text-blue-500">{accNumbers}</p>
              </div>
            )
          ))}
        </div>

        {dictationEnded && <div className="p-4"><Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setShowAnswer(true)}>Answer</Button></div>}
      </div>
    </div>
  )
}
