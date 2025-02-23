import React from 'react';
import { fontStyle } from '@/utils/styles/fontStyles';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FaceIcon from '@mui/icons-material/Face';
import BasicArea from '@/components/level-1/charts/LineChart';
import BasicBars from '@/components/level-1/charts/BarGraph';
import BasicPie from '@/components/level-1/charts/PieChart';
import { cardData } from '@/DummyData/FakeData';
import { productData } from '@/DummyData/FakeData';
import { employeeData } from '@/DummyData/FakeData';
import { categoryData } from '@/DummyData/FakeData';

//Dashboard Card
const DashboardCard = ({ count, title, label, icon, amount, color }) => {
  const style = fontStyle();
  return (
    <div className="flex-1 rounded-xl shadow-md border bg-white cursor-pointer hover:shadow-xl transition-all duration-400">
      <div
        style={{ backgroundColor: color }}
        className="p-4 rounded-t-xl flex justify-between items-center"
      >
        <div>
          <p style={style.subHeading} className="text-xl font-semibold">
            {count}
          </p>
          <p style={style.subHeading} className="text-sm font-medium">
            {title}
          </p>
        </div>
        <div>{icon}</div>
      </div>
      <div className="p-4 rounded-b-xl ">
        <p style={style.subHeading} className="text-sm text-gray-600">
          {label}
        </p>
        <p style={style.subHeading} className="text-xl font-bold">
          {amount}
        </p>
      </div>
    </div>
  );
};

//Top Employee List Component
const TopList = ({ title, data }) => {
  const style = fontStyle();
  return (
    <div className="bg-white h-full basis-1/2 p-4 rounded-xl ">
      <p style={{ ...style.heading, paddingLeft: '1rem' }}>{title}</p>
      {data.map((item, index) => (
        <div
          key={index}
          className="flex m-4 bg-slate-50 items-center p-[1rem] h-[6rem] rounded-lg border-2 hover:shadow-md transition-all duration-400 cursor-pointer"
        >
          <div className="flex w-full items-center justify-around gap-4">
            <FaceIcon sx={{ fontSize: 50 }} />
            <div className="flex flex-col items-center">
              <div style={style.subHeading}>{item.name}</div>
              <div style={style.subHeading}>
                Sales: <span style={style.body}>{item.sales}</span> | Orders:{' '}
                <span style={style.body}>{item.orders}</span>
              </div>
            </div>
            <div>
              <EmojiEventsIcon sx={{ color: 'gold', fontSize: 50 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

//Top selling Product Component
const TopProductList = ({ title, data }) => {
  const style = fontStyle();
  return (
    <div className="bg-white h-full basis-1/2 p-4 rounded-xl ">
      <p style={{ ...style.heading, paddingLeft: '1rem' }}>{title}</p>
      {data.map((item, index) => (
        <div
          key={index}
          className="flex m-4 bg-slate-50 items-center p-[1rem] h-[6rem] rounded-lg border-2 hover:shadow-md transition-all duration-400 cursor-pointer"
        >
          <div className="flex w-full items-center justify-around gap-4">
            <div>
              <div className="text-xl font-semibold">{item.name}</div>
              <div>{item.cost}</div>
            </div>
            <div>
              <div>{item.orders} units</div>
              <div className="text-green-500">{item.percent}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

//CateogryPerformance component
const CateogryPerformance = ({ data }) => {
  const style = fontStyle();
  return (
    <>
      <div className="text-2xl font-bold mb-2 p-2 text-center my-4">Category Performance</div>
      <div className="flex font-bold justify-around my-4 px-4" style={style.subHeading}>
        <div>Category</div>
        <div>Amount</div>
      </div>
      {data.map((data, index) => (
        <div key={index} className="flex justify-around px-4">
          <div>{data.name}</div>
          <div>{data.amount}</div>
        </div>
      ))}
    </>
  );
};

//Dashboard Page
function Page() {
  return (
    <div className='flex justify-center w-full h-full'>
      <div className="flex flex-col mt-5 gap-y-5 w-[95%] items-center">
        <div className="flex gap-5 justify-center w-full">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
        <div className="flex gap-5 w-full justify-center">
          <TopList title="Top Performing Employees" data={employeeData} />
          <TopProductList title="Top Selling Products" data={productData} />
        </div>
        <div className="flex gap-5  items-center justify-around w-full">
          <BasicBars />
          <BasicPie />
        </div>
        <div className="flex items-center justify-around gap-5 w-full">
          <BasicArea />
          <div className="bg-white rounded-xl w-full h-full  basis-1/3">
            <CateogryPerformance data={categoryData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
