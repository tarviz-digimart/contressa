import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie() {
  return (
    <div className="bg-white rounded-xl w-full h-full flex justify-center">
      <PieChart
        series={[
          {
            data: [
              { id: 0, value: 15, label: 'Warehouse A', color: '#7dd6c0' },
              { id: 1, value: 20, label: 'Warehouse B', color: '#f2a86f' },
              { id: 2, value: 25, label: 'Warehouse C', color: '#f9d55c' },
              { id: 3, value: 10, label: 'Warehouse D', color: '#a989c5' },
              { id: 4, value: 30, label: 'Warehouse E', color: '#ec5b55' },
            ],
            innerRadius: 50, // Keep donut hole
            outerRadius: 100, // Adjust pie size
            paddingAngle: 0, // No slice gaps
            cornerRadius: 0, // No rounded edges
            labelPlacement: 'outside', // Moves labels outside
            labelPosition: 3.4, // Push labels further away
          },
        ]}
        width={400}
        height={300}
      />
    </div>
  );
}
