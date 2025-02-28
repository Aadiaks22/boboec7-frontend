"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Search, Calendar, Eye, FileText, PrinterIcon as Print } from "lucide-react"
import { getReceipt, getReceiptbyid } from "@/http/api"
import { useMutation } from "@tanstack/react-query"
import Modal from "react-modal"
import { Label } from "@/components/ui/label"
import { AxiosError } from 'axios';

interface ReceiptData {
  reciept_number: number
  scode: number
  name: string
  course: string
  date: string
  paid_upto: string
  courseFee: number
  exerciseFee: number
  kitFee: number
  net_amount: number
  totalAmountInWords: string
  payment_mode: string
}

interface Credentials {
  reciept_number: string | number
  scode: string | number
  name: string
  course: string
  date: string
  paid_upto: string
  courseFee: string | number
  exerciseFee: string | number
  kitFee: string | number
  net_amount: string | number
  totalAmountInWords: string
  payment_mode: string
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [receiptData, setReceiptData] = useState<ReceiptData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [credentials, setCredentials] = useState<Credentials>({
    reciept_number: "",
    scode: "",
    name: "",
    course: "",
    date: "",
    paid_upto: "",
    courseFee: "",
    exerciseFee: "",
    kitFee: "",
    net_amount: "",
    totalAmountInWords: "",
    payment_mode: "",
  })

  // Fetch receipt mutation
  const receiptMutation = useMutation({
    mutationFn: getReceiptbyid,
    onSuccess: (data) => {
      if (data) {
        setCredentials({
          reciept_number: data.reciept_number,
          scode: data.scode,
          name: data.name,
          course: data.course,
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          paid_upto: data.paid_upto,
          courseFee: data.courseFee,
          exerciseFee: data.exercisenkitFee,
          kitFee: data.exercisenkitFee,
          net_amount: data.net_amount,
          totalAmountInWords: data.totalAmountInWords,
          payment_mode: data.payment_mode,
        })
      } else {
        console.error("No receipt data found.")
      }
    },
    onError: (error: unknown) => {
      // Ensure error is an AxiosError
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response) {
        // Check if the API returned a meaningful error message
        const errorMessage = axiosError.response.data?.message || 'Error fetching receipt:';
        setError(errorMessage);
      } else {
        // Other errors (network issues, etc.)
        setError('Something went wrong. Please try again.');
      }
    },
  })

  const openModal = async (id: number) => {
    if (!id) {
      return alert("Error Data Not Found")
    }
    receiptMutation.mutate(id, {
      onSuccess: () => {
        setIsModalOpen(true) // Open the modal after data is fetched
      },
    })
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const mutation = useMutation({
    mutationFn: getReceipt,
    onSuccess: (data) => {
      if (data) {
        setReceiptData(Array.isArray(data) ? data : [data])
        setLoading(false)
      } else {
        throw new Error("Receipt not found")
      }
    },
    onError: (error: unknown) => {
      // Ensure error is an AxiosError
      const axiosError = error as AxiosError<{ message: string }>;

      if (axiosError.response) {
        // Check if the API returned a meaningful error message
        const errorMessage = axiosError.response.data?.message || 'Error fetching receipt:';
        setError(errorMessage);
      } else {
        // Other errors (network issues, etc.)
        setError('Something went wrong. Please try again.');
      }
    },
  })

  // Use `useEffect` to call `mutation.mutate()` once when component mounts
  useEffect(() => {
    mutation.mutate() // Call mutate only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutation.mutate]) // Empty dependency array ensures it runs once when the component mounts

  const filteredData = receiptData.filter(
    (receipt) =>
      (receipt.reciept_number.toString().includes(searchTerm.toLowerCase()) ||
        receipt.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!startDate || new Date(receipt.date) >= new Date(startDate)) &&
      (!endDate || new Date(receipt.date) <= new Date(endDate)),
  )

  const pageCount = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePrint = () => {
    const printContent = document.querySelector(".invoice")

    if (printContent) {
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                body { font-family: Arial, sans-serif; }
                .invoice { max-width: 800px; margin: 0 auto; }
                @media print {
                  body { margin: 0; padding: 0; }
                  .invoice { width: 100%; }
                }
                ${document.querySelector("style")?.innerHTML || ""}
              </style>
            </head>
            <body>
              ${printContent.outerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.onafterprint = () => printWindow.close()
      }
    }
  }

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
          <div className="text-center text-red-600">Error: {error}</div>
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
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <button onClick={handlePrint} className="text-gray-600 hover:text-green-500 flex items-center gap-1">
              <Print className="h-4 w-4" />
              <span className="text-xs">Print</span>
            </button>
            <button onClick={closeModal} className="text-gray-600 hover:text-red-500">
              ✕
            </button>
          </div>
          <div className="invoice border border-black p-2 print:border-none print:p-1 print:text-[8pt] print:leading-tight bg-white text-black [&_*]:font-['Arial']">
            <div className="text-lg font-bold text-center mb-2 print:text-sm">OEC-7 ACADEMY (Student Copy)</div>
            <div className="text-xs text-center mb-2 print:text-[7pt]">(GST IN - 09AJUPB7083R1Z5)</div>

            <div className="grid grid-cols-2 gap-1 mb-2 text-xs print:text-[7pt]">
              <div className="flex">
                <Label className="mt-1 font-bold">Student Code:</Label>
                <Input
                  className="w-auto ml-1 border-none bg-transparent p-0 h-auto font-sans text-black [&]:font-sans"
                  id="studentCode"
                  name="studentCode"
                  value={credentials.scode || ""}
                  readOnly
                />
              </div>
              <div className="flex">
                <Label className="mt-1 font-bold">Receipt No.:</Label>
                <Input
                  className="w-auto ml-1 border-none bg-transparent p-0 h-auto font-sans text-black [&]:font-sans"
                  id="receiptNumber"
                  name="receiptNumber"
                  value={credentials.reciept_number || ""}
                  readOnly
                />
              </div>
              <div className="flex">
                <Label className="mt-1 font-bold" htmlFor="studentName">
                  Student Name:
                </Label>
                <Input
                  className="w-auto ml-1 border-none bg-transparent p-0 h-auto font-sans text-black [&]:font-sans"
                  id="studentName"
                  name="studentName"
                  value={credentials.name || ""}
                  readOnly
                />
              </div>
              <div className="flex">
                <Label className="mt-1 font-bold" htmlFor="courseName">
                  Course:
                </Label>
                <Input
                  className="w-auto ml-1 border-none bg-transparent p-0 h-auto font-sans text-black [&]:font-sans"
                  id="courseName"
                  name="courseName"
                  value={credentials.course || ""}
                  readOnly
                />
              </div>
              <div className="flex">
                <Label className="mt-1 font-bold">Level:</Label>
                <Input
                  className="w-auto ml-1 border-none bg-transparent p-0 h-auto font-sans text-black [&]:font-sans"
                  value={credentials.paid_upto || "1"}
                  readOnly
                />
              </div>
              <div className="flex">
                <Label className="mt-1 font-bold" htmlFor="date">
                  Date:
                </Label>
                <Input
                  className="w-auto ml-1 border-none bg-transparent p-0 h-auto font-sans text-black [&]:font-sans"
                  id="date"
                  name="date"
                  value={credentials.date || ""}
                  readOnly
                />
              </div>
            </div>

            <table className="w-full border-collapse border border-black mb-2 text-xs print:text-[7pt]">
              <thead>
                <tr>
                  <th className="border border-black p-1 print:p-[2px]">Description</th>
                  <th className="border border-black p-1 print:p-[2px]">Rate</th>
                  <th className="border border-black p-1 print:p-[2px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-1 print:p-[2px]">Course Fee</td>
                  <td className="text-center border border-black p-1 print:p-[2px]"></td>
                  <td className="border border-black p-1 print:p-[2px] text-center">{credentials.courseFee || 0}</td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">9%</td>
                  <td className="border border-black p-1 print:p-[2px] text-center">
                    {typeof credentials.courseFee === "number"
                      ? (credentials.courseFee * 0.09).toFixed(2)
                      : (Number.parseFloat((credentials.courseFee as string) || "0") * 0.09).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
                  <td className="text-center border border-black p-1 print:p-[2px]">9%</td>
                  <td className="border border-black p-1 print:p-[2px] text-center">
                    {typeof credentials.courseFee === "number"
                      ? (credentials.courseFee * 0.09).toFixed(2)
                      : (Number.parseFloat((credentials.courseFee as string) || "0") * 0.09).toFixed(2)}
                  </td>
                </tr>
                {credentials.paid_upto !== "1" ? (
                  <>
                    <tr>
                      <td className="border border-black p-1 print:p-[2px]">Exercise Book</td>
                      <td className="text-center border border-black p-1 print:p-[2px]"></td>
                      <td className="border border-black p-1 print:p-[2px] text-center">
                        {credentials.exerciseFee || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
                      <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
                      <td className="border border-black p-1 print:p-[2px] text-center">
                        {typeof credentials.exerciseFee === "number"
                          ? (credentials.exerciseFee * 0.06).toFixed(2)
                          : (Number.parseFloat((credentials.exerciseFee as string) || "0") * 0.06).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
                      <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
                      <td className="border border-black p-1 print:p-[2px] text-center">
                        {typeof credentials.exerciseFee === "number"
                          ? (credentials.exerciseFee * 0.06).toFixed(2)
                          : (Number.parseFloat((credentials.exerciseFee as string) || "0") * 0.06).toFixed(2)}
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="border border-black p-1 print:p-[2px]">Kit Fee</td>
                      <td className="text-center border border-black p-1 print:p-[2px]"></td>
                      <td className="border border-black p-1 print:p-[2px] text-center">
                        {credentials.kitFee || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center border border-black p-1 print:p-[2px] pl-4">Central Tax</td>
                      <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
                      <td className="border border-black p-1 print:p-[2px] text-center">
                        {typeof credentials.kitFee === "number"
                          ? (credentials.kitFee * 0.6).toFixed(2)
                          : (Number.parseFloat((credentials.kitFee as string) || "0") * 0.06).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center border border-black p-1 print:p-[2px] pl-4">State Tax</td>
                      <td className="text-center border border-black p-1 print:p-[2px]">6%</td>
                      <td className="border border-black p-1 print:p-[2px] text-center">
                        {typeof credentials.kitFee === "number"
                          ? (credentials.kitFee * 0.06).toFixed(2)
                          : (Number.parseFloat((credentials.kitFee as string) || "0") * 0.06).toFixed(2)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            <div className="grid grid-cols-2 gap-2 mb-2 text-xs print:text-[7pt]">
              <div className="flex">
                <Label className="mt-1 font-bold">Payment Mode:</Label>
                <Input
                  className="w-auto ml-1 border-none bg-transparent p-0 h-auto font-sans text-black [&]:font-sans"
                  value={credentials.payment_mode || "Cash"}
                  readOnly
                />
              </div>
              <div className="flex text-center">
                <Label className="mt-1 font-bold" htmlFor="totalAmount">
                  Total:
                </Label>
                <Input
                  className="w-auto ml-1 border-none bg-transparent p-0 h-auto font-sans text-black [&]:font-sans"
                  id="totalAmount"
                  name="totalAmount"
                  value={
                    typeof credentials.net_amount === "number"
                      ? credentials.net_amount.toFixed(2)
                      : Number.parseFloat((credentials.net_amount as string) || "0").toFixed(2)
                  }
                  readOnly
                />
              </div>
              <div></div>
              <div className="flex justify-end">
                <Label className="font-bold" htmlFor="amountInWords">
                  Amount in Words:
                </Label>
                <textarea
                  className="w-full ml-1 border-none bg-transparent p-0 h-auto text-xs print:text-[7pt] font-sans text-black [&]:font-sans"
                  id="amountInWords"
                  name="amountInWords"
                  value={credentials.totalAmountInWords || ""}
                  readOnly
                  rows={2}
                  style={{ resize: "none" }}
                />
              </div>
            </div>
            <div className="flex">
              <div className="mt-2 text-xs print:text-[7pt]">
                <span className="font-bold">Authority Seal And Signature</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

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
            <Button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            >
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
                    <TableCell
                      onClick={() => openModal(invoice.reciept_number)}
                      className="cursor-pointer text-blue-500 hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
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
                    className={
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "bg-white dark:bg-gray-800 text-green-600 border-green-300 hover:bg-green-50"
                    }
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
    </>
  )
}

