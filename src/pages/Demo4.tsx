import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useEffect, useState } from 'react';
//import { useParams } from 'react-router-dom';

interface ReceiptData {
  reciept_number: number;
  name: string;
  date: string;  // Changed to string as you'll likely get date strings from the API
  paid_upto: string;
  net_amount: number;
  reciept_img: string; // Image path
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ShowReceipt: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [receiptData, setReceiptData] = useState<ReceiptData[]>([]);  // Changed to an array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //const { id } = useParams<{ id: string }>(); 

  useEffect(() => {
    const fetchReceiptData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/admin/getreciept`);
        if (!response.ok) {
          throw new Error('Failed to fetch receipt data');
        }

        const data = await response.json();

        if (data) {
          setReceiptData(Array.isArray(data) ? data : [data]);  // Ensure it's an array
        } else {
          throw new Error('Receipt not found');
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptData();
  }, []);

  const filteredData = receiptData.filter((receipt) =>
    (receipt.reciept_number.toString().includes(searchTerm.toLowerCase()) ||
      receipt.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!startDate || new Date(receipt.date) >= new Date(startDate)) &&
    (!endDate || new Date(receipt.date) <= new Date(endDate))
  );

  if (loading) {
    return <p>Loading receipt data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (receiptData.length === 0) {
    return <p>No receipt data found</p>;
  }

  return (
    <>
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
              <TableRow key={invoice.reciept_number}>
                <TableCell>{invoice.reciept_number}</TableCell>
                <TableCell>{invoice.name}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleString()}</TableCell>
                <TableCell>{invoice.net_amount}</TableCell>
                <TableCell>
                  <a href={`backend/public${invoice.reciept_img}`} target="_blank">
                    <img src={`backend/public${invoice.reciept_img}`} width="50" height="50" alt="Receipt Image" className="img img-thumbnail" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ShowReceipt;
