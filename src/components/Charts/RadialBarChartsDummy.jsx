import React, {useEffect, useState} from 'react'
import ReactApexChart from 'react-apexcharts';

const RadialBarCharts = ({type = 'radialBar', data = null}) => {
  const [chartOption, setChartOptions] = useState();
  useEffect(() => {
    console.log('here', data);
    loadData();
  }, []);

  const loadData = (products, series, total) => {
    console.log(data);
    setChartOptions({
        series: [44, 55, 67, 83],
        options: {
          chart: {
            height: 350,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              dataLabels: {
                name: {
                  fontSize: '22px',
                },
                value: {
                  fontSize: '16px',
                },
                total: {
                  show: true,
                  label: 'Total Investments',
                  formatter: function (w) {
                    // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                    return 249
                  }
                }
              }
            }
          },
          labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],
        },
    })
  }

  return (
    <div id="chart" className="pb-5 w-full">
      {chartOption &&
        <ReactApexChart options={chartOption.options} series={chartOption.series} type={type} height={350} />
      }
    </div>
  )
}

export default RadialBarCharts