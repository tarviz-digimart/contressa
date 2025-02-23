import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicBars() {
  return (
    <div className="bg-white rounded-xl w-full h-full flex justify-center">
      <BarChart
        xAxis={[{ scaleType: 'band', data: ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5'] }]}
        series={[
          { data: [2, 5, 6, 1, 7], color: '#4f46e5' }, // Blue
        ]}
        width={500}
        height={300}
      />
    </div>
  );
}
