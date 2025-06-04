import React, {useEffect, useState} from 'react'
import ReactApexChart from 'react-apexcharts';

const FunnelChaart = ({type = 'bar', data = null}) => {
  const [chartOption, setChartOptions] = useState();
  useEffect(() => {
    console.log('here', data);
    loadData();
  }, []);

  const loadData = () => {
    // const loadData = (products, series, total) => {
    console.log(data);
    setChartOptions({
        series: [
          {
            name: "Investment Plans",
            data: [5000, 3500, 2000, 1500],
          },
        ],
        options: {
          chart: {
            type: 'bar',
            height: 350,
          },
          plotOptions: {
            bar: {
              borderRadius: 0,
              horizontal: true,
              barHeight: '80%',
              isFunnel: true,
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
              return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
            },
            dropShadow: {
              enabled: true,
            },
          },
          title: {
            text: 'Investments and Total Investors',
            align: 'middle',
          },
          xaxis: {
            categories: [
              'Pro Investor',
              'Expert Plan',
              'Starter Plus',
              'Starter',
            ],
          },
          legend: {
            show: false,
          },
        }
    })
  }

  return (
    <div id="chart" className="pb-5 w-full">
      {chartOption &&
        <ReactApexChart options={chartOption.options} series={chartOption.series} type={type} height={250} />
      }
    </div>
  )
}

export default FunnelChaart