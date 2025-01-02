import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 flex items-center justify-center">
      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border-2 border-orange-200">
        <CardContent className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-shrink-0 transform transition-all duration-500 ease-in-out hover:scale-105">
              <img
                src="/images/bob-intro1.jpg"
                alt="BOB"
                className="h-64 w-auto sm:h-80 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border-4 border-orange-300"
              />
            </div>
            <div className="flex flex-col items-center sm:items-start gap-4">
              <img
                src="/images/brainobrain-logo.png"
                alt="Brainobrain Logo"
                className="h-16 w-16 hover:scale-110 transition-transform duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  transform: isHovered ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 0.5s ease-in-out'
                }}
              />
              <h1 className="text-3xl sm:text-4xl font-bold text-orange-800 tracking-tight">
                Welcome to{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-400">
                  BRAINOBRAIN-OEC7
                </span>
              </h1>
              <p className="text-orange-700 text-center sm:text-left max-w-md">
                Unlock your potential with our innovative learning techniques and expert guidance.
              </p>
              <Button 
                className="mt-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}