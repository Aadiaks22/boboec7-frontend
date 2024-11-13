'use client'

import { useState, useEffect, useRef } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const sumsOptions = Array.from({ length: 6 }, (_, i) => (i + 1).toString())
const rowsOptions = Array.from({ length: 100 }, (_, i) => (i + 3).toString())
const timesOptions = Array.from({ length: 120 }, (_, i) => (i + 1).toString())

export default function DictationComponent() {
  const [activity, setActivity] = useState('Dictation')
  const [sums, setSums] = useState('1')
  const [type, setType] = useState('SD')
  const [rows, setRows] = useState('3')
  const [time, setTime] = useState('3')
  const [currentNumber, setCurrentNumber] = useState<number | null>(null)
  const [answer, setAnswer] = useState('')
  const [openDictation, setOpenDictation] = useState(false)
  const [dictationActive, setDictationActive] = useState(false)
  const [correctAnswer, setCorrectAnswer] = useState<string[]>([])
  const [timeLeft, setTimeLeft] = useState(parseInt(time))
  const [dictationEnded, setDictationEnded] = useState(false)
  const newNumbersRef = useRef<number[]>([])
  const currentIndexRef = useRef(0)

  const startDictation = () => {
    const rowNumber = parseInt(rows, 10)
    const generatedNumbers = generateRandomNumber(type, rowNumber)
    newNumbersRef.current = generatedNumbers
    setCurrentNumber(generatedNumbers[0])
    setDictationActive(true)
    setDictationEnded(false)
    setCorrectAnswer([])
    setAnswer('')
    setTimeLeft(parseInt(time))
    currentIndexRef.current = 0
  }

  const openDictationDiv = () => {
    setOpenDictation(true)
    setCurrentNumber(null)
    setAnswer('')
    setDictationActive(false)
    setCorrectAnswer([])
    setTimeLeft(parseInt(time))
    setDictationEnded(false)
  }

  useEffect(() => {
    if (dictationActive && timeLeft > 0) {
      const rowNumber = parseInt(rows, 10)
      const totalTime = parseInt(time)
      const timePerNumber = (totalTime / rowNumber)

      const intervalId = setInterval(() => {
        if (currentIndexRef.current < newNumbersRef.current.length) {
          const nextNumber = newNumbersRef.current[currentIndexRef.current]
          setCurrentNumber(nextNumber)
          setCorrectAnswer(prev => [...prev, nextNumber.toString()])
          currentIndexRef.current++
        } else {
          clearInterval(intervalId)
          setDictationEnded(true)
          setDictationActive(false)
        }

        setTimeLeft(prev => prev - timePerNumber)
      }, timePerNumber * 1000)

      return () => clearInterval(intervalId)
    }

    if (timeLeft === 0 && dictationActive) {
      setDictationEnded(true)
    }
  }, [dictationActive, timeLeft, type, rows, time])

  const generateRandomNumber = (type: string, rows: number) => {
    const numbers: number[] = []
    for (let i = 0; i < rows; i++) {
      let number = 0
      if (type === 'SD') {
        number = Math.floor(Math.random() * 10)
      } else if (type === 'SD/DD') {
        number = Math.random() < 0.5
          ? Math.floor(Math.random() * 10)
          : Math.floor(Math.random() * 90 + 10)
      } else if (type === 'D3') {
        number = Math.floor(Math.random() * 900 + 100)
      } else if (type === 'D4') {
        number = Math.floor(Math.random() * 9000 + 1000)
      } else if (type === 'D5') {
        number = Math.floor(Math.random() * 90000 + 10000)
      } else if (type === 'D6') {
        number = Math.floor(Math.random() * 900000 + 100000)
      } else if (type === 'D7') {
        number = Math.floor(Math.random() * 9000000 + 1000000)
      } else if (type === 'D8') {
        number = Math.floor(Math.random() * 90000000 + 10000000)
      }

      if (type.includes('SD/DD') || type.includes('D')) {
        if (Math.random() < 0.5) {
          number = -number
        }
      }

      numbers.push(number)
    }
    return numbers
  }

  const handleShowAnswer = () => {
    const sum = correctAnswer.reduce((acc, curr) => acc + parseInt(curr, 10), 0)
    setAnswer(sum.toString())
  }

  const handleReload = () => {
    setCurrentNumber(null)
    setAnswer('')
    setDictationActive(false)
    setCorrectAnswer([])
    setTimeLeft(parseInt(time))
    setDictationEnded(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-purple-600 text-white">
          <h1 className="text-2xl font-bold">Kid's Dictation Activity</h1>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="activity" className="block text-sm font-medium text-gray-700">Activity:</label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger id="activity" className="w-full">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dictation">Dictation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="sums" className="block text-sm font-medium text-gray-700">Sum(s):</label>
              <Select value={sums} onValueChange={setSums}>
                <SelectTrigger id="sums" className="w-full">
                  <SelectValue placeholder="Select sums" />
                </SelectTrigger>
                <SelectContent>
                  {sumsOptions.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type:</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SD">SD</SelectItem>
                  <SelectItem value="SD/DD">SD/DD</SelectItem>
                  <SelectItem value="D3">D3</SelectItem>
                  <SelectItem value="D4">D4</SelectItem>
                  <SelectItem value="D5">D5</SelectItem>
                  <SelectItem value="D6">D6</SelectItem>
                  <SelectItem value="D7">D7</SelectItem>
                  <SelectItem value="D8">D8</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="rows" className="block text-sm font-medium text-gray-700">Rows:</label>
              <Select value={rows} onValueChange={setRows}>
                <SelectTrigger id="rows" className="w-full">
                  <SelectValue placeholder="Select rows" />
                </SelectTrigger>
                <SelectContent>
                  {rowsOptions.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full bg-teal-600 hover:bg-teal-700" onClick={openDictationDiv}>Load Activity</Button>
        </div>

        {openDictation && (
          <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <div className="text-lg font-semibold text-orange-500">{`${type} - ${rows} Rows [ ${sums} Sum(s) ]`}</div>
              <div className="flex items-center gap-2">
                <label htmlFor="time" className="text-sm font-medium text-gray-700">Total Time</label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time" className="w-32">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timesOptions.map(t => (
                      <SelectItem key={t} value={t}>{t} Seconds</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={startDictation}>Start</Button>
              <Button variant="outline" className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50" onClick={handleReload}>Reload</Button>
            </div>
          </div>
        )}

        {dictationActive && (
          <div className="p-4 space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <div className="text-6xl sm:text-8xl font-bold text-blue-500 text-center">{currentNumber !== null ? currentNumber : '-'}</div>
            </div>
            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full text-4xl font-bold text-orange-600"
              placeholder="Enter your answer"
            />
            <div className="border p-2 rounded h-24 overflow-y-auto bg-gray-100">
              <p className="text-4xl font-bold text-purple-600">{correctAnswer.join(', ')}</p>
            </div>
          </div>
        )}

        {dictationEnded && (
          <div className="p-4">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleShowAnswer}>Correct Answer</Button>
          </div>
        )}
      </div>
    </div>
  )
}