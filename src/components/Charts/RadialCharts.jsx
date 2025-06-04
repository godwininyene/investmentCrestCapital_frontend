import React, {useEffect, useState} from 'react'
import ReactApexChart from 'react-apexcharts';

const RadialBarCharts = ({type = 'radialBar', data}) => {
  const [chartOption, setChartOptions] = useState();
  useEffect(() => {
    console.log('here', data);
    let products = [];
    let qtys = [];
    data.products.forEach(items => {
        products.push(items.product.product_name);
        qtys.push((items.num_sold/data.total) * (100/1));
    });
    loadData(products, qtys, data.total);
  }, []);

  const loadData = (products, series, total) => {
    console.log(data);
    setChartOptions({series: series,
      options: {
        chart: {
          height: 200,
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
                label: 'Total',
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return total
                }
              }
            }
          }
        },
        labels: products,
      },
    })
  }

  return (
    <div id="chart" className="pb-5">
      {chartOption &&
        <ReactApexChart options={chartOption.options} series={chartOption.series} type={type} height={250} />
      }
    </div>
  )
}

export default RadialBarCharts