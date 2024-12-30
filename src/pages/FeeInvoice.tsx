import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar, Eye, FileText } from "lucide-react"
import { getReceipt } from "@/http/api"
import { useMutation } from "@tanstack/react-query"

interface ReceiptData {
  reciept_number: number
  name: string
  date: string
  paid_upto: string
  net_amount: number
  reciept_img: string
}

//const BASE_URL = import.meta.env.VITE_BASE_URL

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [receiptData, setReceiptData] = useState<ReceiptData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  //const queryClient = useQueryClient()


  // useEffect(() => {
  //   const fetchReceiptData = async () => {
  //     try {
  //       const response = await axios.get(`${BASE_URL}/api/admin/getreciept`)
  //       if (!response.data) {
  //         throw new Error("Failed to fetch receipt data")
  //       }

  //       const data = await response.data;

  //       if (data) {
  //         setReceiptData(Array.isArray(data) ? data : [data])
  //       } else {
  //         throw new Error("Receipt not found")
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         setError(error.message)
  //       } else {
  //         setError("An unknown error occurred")
  //       }
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchReceiptData()
  // }, [])


  const mutation = useMutation({
    mutationFn: getReceipt,
    onSuccess: (data) => {
      if (data) {
        setReceiptData(Array.isArray(data) ? data : [data])
        setLoading(false);
      } else {
        throw new Error("Receipt not found")
      }
    },
    onError: (error) => {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
    },
  });

  // Use `useEffect` to call `mutation.mutate()` once when component mounts or based on a specific condition
  useEffect(() => {
    mutation.mutate(); // Call mutate only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures it runs once when the component mounts




  const filteredData = receiptData.filter(
    (receipt) =>
      (receipt.reciept_number.toString().includes(searchTerm.toLowerCase()) ||
        receipt.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!startDate || new Date(receipt.date) >= new Date(startDate)) &&
      (!endDate || new Date(receipt.date) <= new Date(endDate))
  )

  const pageCount = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 bg-green-50">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">Error</div>
        </CardContent>
      </Card>
    )
  }

  if (receiptData.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 bg-yellow-50">
        <CardContent className="p-6">
          <div className="text-center text-yellow-600">No receipt data found</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-6xl mx-auto mt-8 bg-gradient-to-br from-green-50 to-teal-100 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center">
          <FileText className="mr-2" />
          Invoice Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-6 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Receipt Number/Customer Name:
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-green-50 dark:bg-gray-700 border-green-200 dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Start Date:
              </label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-8 bg-green-50 dark:bg-gray-700 border-green-200 dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                End Date:
              </label>
              <div className="relative">
                <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-8 bg-green-50 dark:bg-gray-700 border-green-200 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
          <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white" onClick={() => console.log("Search clicked")}>
            Search
          </Button>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-green-100 dark:bg-gray-700">
                <TableHead className="font-semibold text-green-800 dark:text-green-200">Receipt Number</TableHead>
                <TableHead className="font-semibold text-green-800 dark:text-green-200">Customer Name</TableHead>
                <TableHead className="font-semibold text-green-800 dark:text-green-200">Date</TableHead>
                <TableHead className="font-semibold text-green-800 dark:text-green-200">Paid Upto</TableHead>
                <TableHead className="font-semibold text-green-800 dark:text-green-200">Net Amount</TableHead>
                <TableHead className="font-semibold text-green-800 dark:text-green-200">View Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((invoice) => (
                <TableRow key={invoice.reciept_number} className="hover:bg-green-50 dark:hover:bg-gray-700">
                  <TableCell>{invoice.reciept_number}</TableCell>
                  <TableCell>{invoice.name}</TableCell>
                  <TableCell>{new Date(invoice.date).toLocaleString()}</TableCell>
                  <TableCell>{invoice.paid_upto} Level</TableCell>
                  <TableCell>Rs.{invoice.net_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <a
                      href={`/backend/public${invoice.reciept_img}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Receipt</span>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-white dark:bg-gray-800 text-green-600 border-green-300 hover:bg-green-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? "bg-green-600 text-white" : "bg-white dark:bg-gray-800 text-green-600 border-green-300 hover:bg-green-50"}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="bg-white dark:bg-gray-800 text-green-600 border-green-300 hover:bg-green-50"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}