import React, {useEffect, useState} from 'react'
import ReactApexChart from 'react-apexcharts';

const GuageCharts = ({type = 'radialBar', percent = 0}) => {
  const [chartOption, setChartOptions] = useState();
  useEffect(() => {
    loadData(percent);
  }, []);

  const loadData = (percentage) => {
    setChartOptions({series: [percentage],
        options: {
          chart: {
            type: 'radialBar',
            offsetY: -20,
            sparkline: {
              enabled: true
            }
          },
          plotOptions: {
            radialBar: {
              startAngle: -100,
              endAngle: 100,
              track: {
                background: "#e7e7e7",
                strokeWidth: '97%',
                margin: 5, // margin is in pixels
                dropShadow: {
                  enabled: true,
                  top: 2,
                  left: 0,
                  color: '#999',
                  opacity: 1,
                  blur: 2
                }
              },
              dataLabels: {
                name: {
                  show: false
                },
                value: {
                  offsetY: -2,
                  fontSize: '22px'
                }
              }
            }
          },
          grid: {
            padding: {
              top: -10
            }
          },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              shadeIntensity: 0.4,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 50, 53, 91]
            },
          },
          labels: ['Average Results'],
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

export default GuageCharts