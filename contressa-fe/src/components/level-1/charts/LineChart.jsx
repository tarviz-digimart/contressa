import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export default function BasicArea() {
  return (
    <div className="bg-white rounded-xl w-full h-full flex justify-center basis-2/3">
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 14, 16, 18, 20] }]}
        series={[
          {
            data: [0, 5.5, 2, 8.5, 1.5, 5, 9.0, 5.34, 6.43, 8, 6.4],
            area: false, // Enables area filling
            color: '#8580ed', // Line color
          },
        ]}
        width={500}
        height={300}
      />
    </div>
  );
}
