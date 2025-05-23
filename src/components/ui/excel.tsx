'use client';

import { useState } from 'react';
import axios from 'axios';

export default function InvoiceExport() {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [isExport, setIsExport] = useState(true); // 🔄 Toggle state

  const handleDownload = async () => {
    setLoading(true);
    try {
      let url = '';
      let params = {};
      let fileName = '';

      if (isExport) {
        // Export invoices
        url = '/api/invoice';
        params = { action: 'export', year, month };
        fileName = `invoices-${year}-${month}.xlsx`;
      } else {
        // Dealer endpoint
        url = '/api/dealer';
        params = { action: 'export', year, month };
        fileName = `dealer-data-${year}-${month}.xlsx`;
      }

      const response = await axios.get(url, {
        params,
        responseType: 'blob',
        headers: {
          Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download Excel file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Download Excel File
      </h2>

      {/* Toggle Switch */}
     <div className="flex items-center gap-3 mb-4">
  <span className="text-black dark:text-white">Purchase record</span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={isExport}
      onChange={() => setIsExport(!isExport)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-emerald-400 dark:bg-gray-600 peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-indigo-500 transition-colors duration-300"></div>
    <div className="absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 transform peer-checked:translate-x-full"></div>
  </label>
  <span className="text-black dark:text-white">Sales GST Bill</span>
</div>


      <div className="flex gap-2 mb-4">
        <select
          className="border px-2 py-1 text-black dark:text-white dark:bg-black rounded"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="border px-2 py-1 rounded w-24 text-black dark:text-white"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        {loading ? 'Downloading...' : 'Download Excel'}
      </button>
    </div>
  );
}
