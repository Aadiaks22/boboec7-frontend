import { useState, useEffect, useRef } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sumsOptions = Array.from({ length: 6 }, (_, i) => (i + 1).toString());
const rowsOptions = Array.from({ length: 100 }, (_, i) => (i + 3).toString());
const timesOptions = Array.from({ length: 120 }, (_, i) => (i + 1).toString());

export default function DictationComponent() {
  const [activity, setActivity] = useState('Dictation');
  const [sums, setSums] = useState('1');
  const [type, setType] = useState('SD');
  const [rows, setRows] = useState('3');
  const [time, setTime] = useState('3');
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [answer, setAnswer] = useState('');
  const [openDictation, setOpenDictation] = useState(false);
  const [dictationActive, setDictationActive] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(parseInt(time));
  const [dictationEnded, setDictationEnded] = useState(false);
  const newNumbersRef = useRef<number[]>([]); // Store the numbers to show
  const currentIndexRef = useRef(0); // Track the current number index

  // Start the dictation
  const startDictation = () => {
    const rowNumber = parseInt(rows, 10); // Convert rows to a number
    const generatedNumbers = generateRandomNumber(type, rowNumber); // Generate all numbers at once
    newNumbersRef.current = generatedNumbers; // Store the numbers
    console.log('Generated Numbers:', generatedNumbers);
    setCurrentNumber(generatedNumbers[0]); // Set the first number
    setDictationActive(true);
    setDictationEnded(false);
    setCorrectAnswer([]); // Reset correct answers
    setAnswer('');
    setTimeLeft(parseInt(time)); // Reset time
    currentIndexRef.current = 0; // Reset index
  };

  const openDictationDiv = () => {
    setOpenDictation(true);
    setCurrentNumber(null);
    setAnswer('');
    setDictationActive(false);
    setCorrectAnswer([]);
    setTimeLeft(parseInt(time));
    setDictationEnded(false);
  };


  useEffect(() => {
    if (dictationActive && timeLeft > 0) {
      const rowNumber = parseInt(rows, 10);
      const totalTime = parseInt(time); // Total time for the dictation
      const timePerNumber = (totalTime / rowNumber); // Time for each number display

      const intervalId = setInterval(() => {
        // Show one number at a time
        if (currentIndexRef.current < newNumbersRef.current.length) {
          const nextNumber = newNumbersRef.current[currentIndexRef.current];
          setCurrentNumber(nextNumber);
          setCorrectAnswer(prev => [...prev, nextNumber.toString()]);
          currentIndexRef.current++;
        } else {
          clearInterval(intervalId); // Stop once all numbers are displayed
          setDictationEnded(true);
          console.log('Ended');
          setDictationActive(false);
        }

        setTimeLeft(prev => prev - timePerNumber); // Decrement time left
      }, timePerNumber * 1000);

      return () => clearInterval(intervalId);
    }

    if (timeLeft === 0 && dictationActive) {
      setDictationEnded(true); // Dictation has ended
      console.log('Ended');
    }
  }, [dictationActive, timeLeft, type, rows, time]);
  

  // Generate random numbers based on type
  const generateRandomNumber = (type: string, rows: number) => {
    const numbers: number[] = [];
    console.log('total rows:', rows);
    for (let i = 0; i < rows; i++) {
      let number = 0;
      if (type === 'SD') {
        number = Math.floor(Math.random() * 10); // Single-digit (0-9)
      } else if (type === 'SD/DD') {
        number = Math.random() < 0.5
          ? Math.floor(Math.random() * 10)  // Single-digit (0-9)
          : Math.floor(Math.random() * 90 + 10); // Double-digit (10-99)
      } else if (type === 'D3') {
        number = Math.floor(Math.random() * 900 + 100); // Three-digit (100-999)
      } else if (type === 'D4') {
        number = Math.floor(Math.random() * 9000 + 1000); // Four-digit (1000-9999)
      } else if (type === 'D5') {
        number = Math.floor(Math.random() * 90000 + 10000); // Five-digit (10000-99999)
      } else if (type === 'D6') {
        number = Math.floor(Math.random() * 900000 + 100000); // Six-digit (100000-999999)
      } else if (type === 'D7') {
        number = Math.floor(Math.random() * 9000000 + 1000000); // Seven-digit (1000000-9999999)
      } else if (type === 'D8') {
        number = Math.floor(Math.random() * 90000000 + 10000000); // Eight-digit (10000000-99999999)
      }

      // Apply positive/negative logic based on the type
      if (type.includes('SD/DD') || type.includes('D')) {
        if (Math.random() < 0.5) {
          number = -number; // Make the number negative
        }
      }

      numbers.push(number);
    }
    return numbers;
  };

  const handleShowAnswer = () => {
    // Calculate the sum of the correctAnswer array
    const sum = correctAnswer.reduce((acc, curr) => acc + parseInt(curr, 10), 0);
    setAnswer(sum.toString());
  };

  const handleReload = () => {
    setCurrentNumber(null);
    setAnswer('');
    setDictationActive(false);
    setCorrectAnswer([]);
    setTimeLeft(parseInt(time));
    setDictationEnded(false);
  };


  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700">Select Activity:</label>
          <Select value={activity} onValueChange={setActivity}>
            <SelectTrigger id="activity" className="w-[200px]">
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
            <SelectTrigger id="sums" className="w-[100px]">
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
            <SelectTrigger id="type" className="w-[100px]">
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
            <SelectTrigger id="rows" className="w-[100px]">
              <SelectValue placeholder="Select rows" />
            </SelectTrigger>
            <SelectContent>
              {rowsOptions.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button className="mt-6" onClick={openDictationDiv}>Load Activity</Button>
      </div>

      {openDictation && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">{`${type} - ${rows} Rows [ ${sums} Sum(s) ]`}</div>
          <div>
            <label htmlFor="time" className="mr-2">Total Time</label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger id="time" className="w-[150px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timesOptions.map(t => (
                  <SelectItem key={t} value={t}>{t} Seconds</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="secondary" onClick={startDictation}>Start</Button>
          <Button variant="outline" onClick={handleReload}>Reload</Button>
        </div>
      )}

      {dictationActive && (
        <>
          <div className="border-l-4 border-green-500 pl-4 mb-4">
            <div className="text-8xl font-bold text-blue-500">{currentNumber !== null ? currentNumber : '-'}</div>
          </div>

          <Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="mb-4"
            placeholder="Enter your answer"
          />
          {/* Field to show all generated random numbers */}
          <div className="border p-2 rounded mb-4 h-24 overflow-y-auto bg-gray-100">
            <p>{correctAnswer.join(', ')}</p>
          </div>

        </>
      )}

      {/* Show the "Correct Answer" button only after dictation ends */}
      {dictationEnded && (
        <Button className="w-full" onClick={handleShowAnswer}>Correct Answer</Button>
      )}
    </div>
  );
}
