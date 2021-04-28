import React,{useState,useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import {Card,CardContent} from '@material-ui/core';
import numeral from 'numeral';

const options={
    legend:{
        display:false,
    },
    elements:{
        point:{
            radius:0,
        }
    },
    maintainAspectRatio:false,
    tooltips:{
        mode:"index",
        intersect:false,
        callbacks:{
            label:function(tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0")
            },
        },
    },
    scales:{
        xAxes:[
           { 
               type:"time",
            time:{
                format:'MM/DD/YY',
                tooltipFormat:'ll',
            },
        },
        
    ],
        yAxes:[
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    callbacks:function(value,index,values) {
                        return numeral(value).format('0a');
                    },
                },
            },
        ],
    },

}

function LineGraph({caseType="cases"}) {
    const [data, setData ] = useState({});

    useEffect(async()=>{
        const fetchData = async ()=>{
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response) =>{ 
                return response.json()
            })
            .then((data)=>{
                let chartData = buildChartData(data, caseType)
                setData(chartData);
            });
        }
        fetchData();
    },[caseType]);



    const buildChartData = (data, caseType)=>{
        const chartData=[];
        let lastDataPoint;
        for(let date in data.cases) {
            if (lastDataPoint){
                const newDataPoint={
                    x: date,
                    y: data[caseType][date]- lastDataPoint,
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint = data[caseType][date]
        }
        return chartData;
    }

    return (
        <Card>
            <CardContent> 
                <h3 >Worlwide New Cases</h3>
            {data?.length>0 && (
                <Line
                options={options}
                data={{
                    datasets:[{
                        backgroundColor: 'rgba(206,16,52,0.5)',
                        borderColor:'#CC1034',
                        data: data,
                    }],
                }}/>
            )}
            </CardContent>
        </Card>
    )
}

export default LineGraph
