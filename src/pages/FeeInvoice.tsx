import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface InvoiceData {
  receiptNumber: string
  customerName: string
  date: string
  netAmount: number
}

export default function Component() {
  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const invoiceData: InvoiceData[] = [
    { receiptNumber: 'R20240007', customerName: 'Aditya Gupta', date: '2024-04-09', netAmount: 360 },
    { receiptNumber: 'R20230006', customerName: 'Aditya Gupta', date: '2023-12-18', netAmount: 270 },
    { receiptNumber: 'R20230005', customerName: 'Aditya Gupta', date: '2023-12-08', netAmount: 360 },
    { receiptNumber: 'R20230004', customerName: 'Aditya Gupta', date: '2023-12-07', netAmount: 1440 },
    { receiptNumber: 'R20230001', customerName: 'Aditya Gupta', date: '2023-12-07', netAmount: 28782 },
    { receiptNumber: 'R20230002', customerName: 'Aditya Gupta', date: '2023-12-07', netAmount: 369 },
    { receiptNumber: 'R20230003', customerName: 'Aditya Gupta', date: '2023-12-07', netAmount: 9732 },
  ]

  const filteredData = invoiceData.filter(invoice => 
    (invoice.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!startDate || new Date(invoice.date) >= new Date(startDate)) &&
    (!endDate || new Date(invoice.date) <= new Date(endDate))
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invoice Data</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Receipt Number/Customer Name:
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Enter Receipt Number or Customer Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date:
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date:
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={() => console.log('Search clicked')}>
          Search
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Receipt Number</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Net Amount</TableHead>
            <TableHead>View Receipt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((invoice) => (
            <TableRow key={invoice.receiptNumber}>
              <TableCell>{invoice.receiptNumber}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.netAmount}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => console.log(`View receipt for ${invoice.receiptNumber}`)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}